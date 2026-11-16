/**
 * STELLARAPP // Web Serial API Manager for Raspberry Pi Pico W & RP2040
 * Enables zero-dependency direct USB connection from modern browsers (Chrome/Edge).
 */

export interface HardwareTelemetryData {
  device?: string;
  chip_temp_c: number;
  real_temp_c?: number;
  delta_temp?: number;
  o2_raw: number;
  o2_kalman: number;
  co_ppm: number;
  k_gain: number;
  status: string;
  is_live?: boolean;
  seconds_ago?: number;
  mode?: "webserial" | "bridge" | "synthetic";
}

export interface SerialStatus {
  connected: boolean;
  mode: "webserial" | "bridge" | "none";
  error?: string | null;
  baudRate?: number;
}

let activePort: any = null;
let activeReader: any = null;
let keepReading = false;
let lastSyncTimestamp = 0;
let currentStatus: SerialStatus = {
  connected: false,
  mode: "none",
  error: null,
  baudRate: 115200,
};

export function isWebSerialSupported(): boolean {
  return typeof window !== "undefined" && "serial" in navigator;
}

export function isWebSerialConnected(): boolean {
  return currentStatus.connected && currentStatus.mode === "webserial";
}

export function getSerialStatus(): SerialStatus {
  return { ...currentStatus };
}

function updateStatus(newStatus: Partial<SerialStatus>) {
  currentStatus = { ...currentStatus, ...newStatus };
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("stellarapp:hardware-status", { detail: currentStatus })
    );
  }
}

async function syncToBackend(data: HardwareTelemetryData) {
  const now = Date.now();
  // Throttle backend sync to once per 900ms to avoid overwhelming the server
  if (now - lastSyncTimestamp < 900) return;
  lastSyncTimestamp = now;

  try {
    await fetch("/api/telemetry/hardware", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        device: data.device || "Raspberry Pi Pico W",
        chip_temp_c: data.chip_temp_c,
        o2_raw: data.o2_raw ?? 21.0,
        o2_kalman: data.o2_kalman ?? 21.0,
        co_ppm: data.co_ppm ?? 22.0,
        k_gain: data.k_gain ?? 0.167,
        status: data.status || "NOMINAL",
        scenario_id: "iss",
        lang: "es",
        broadcast_to_telegram: false,
      }),
    });
  } catch {
    // Ignore backend transmission errors in offline mode
  }
}

export async function connectWebSerial(): Promise<{ success: boolean; error?: string }> {
  if (!isWebSerialSupported()) {
    const err = "Web Serial no está soportado en este navegador. Usa Google Chrome o Microsoft Edge.";
    updateStatus({ error: err });
    return { success: false, error: err };
  }

  try {
    const nav = navigator as any;
    const port = await nav.serial.requestPort();
    await port.open({ baudRate: 115200 });

    activePort = port;
    keepReading = true;
    updateStatus({ connected: true, mode: "webserial", error: null, baudRate: 115200 });

    // Start background stream decoding
    readLoop(port);

    return { success: true };
  } catch (err: any) {
    let errorMsg = "Error al abrir el puerto serie.";
    if (err.name === "NotFoundError") {
      errorMsg = "Selección de puerto cancelada por el usuario.";
    } else if (err.name === "NetworkError" || err.message?.includes("Failed to open")) {
      errorMsg = "El puerto COM está ocupado por otra aplicación (ej. puente Python o monitor serie).";
    } else if (err.message) {
      errorMsg = err.message;
    }

    updateStatus({ connected: false, error: errorMsg });
    return { success: false, error: errorMsg };
  }
}

async function readLoop(port: any) {
  let textDecoder: TextDecoderStream | null = null;
  let reader: ReadableStreamDefaultReader<string> | null = null;

  try {
    textDecoder = new TextDecoderStream();
    port.readable.pipeTo(textDecoder.writable);
    reader = textDecoder.readable.getReader();
    activeReader = reader;

    let buffer = "";

    while (keepReading) {
      const { value, done } = await reader.read();
      if (done) break;
      if (value) {
        buffer += value;
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;

          try {
            const parsed = JSON.parse(trimmed);
            if (parsed.chip_temp_c !== undefined || parsed.o2_kalman !== undefined) {
              const telemetry: HardwareTelemetryData = {
                device: parsed.device || "Raspberry Pi Pico W",
                chip_temp_c: Number(parsed.chip_temp_c),
                real_temp_c: parsed.real_temp_c !== undefined ? Number(parsed.real_temp_c) : undefined,
                delta_temp: parsed.delta_temp !== undefined ? Number(parsed.delta_temp) : undefined,
                o2_raw: Number(parsed.o2_raw ?? 21.0),
                o2_kalman: Number(parsed.o2_kalman ?? 21.0),
                co_ppm: Number(parsed.co_ppm ?? 22.0),
                k_gain: Number(parsed.k_gain ?? 0.167),
                status: String(parsed.status || "NOMINAL"),
                is_live: true,
                seconds_ago: 0,
                mode: "webserial",
              };

              // Emit event to entire application
              if (typeof window !== "undefined") {
                window.dispatchEvent(
                  new CustomEvent("stellarapp:hardware-telemetry", { detail: telemetry })
                );
              }

              // Sync to server backend
              syncToBackend(telemetry);
            }
          } catch {
            // Non-JSON line (firmware startup or log), ignore
          }
        }
      }
    }
  } catch (err: any) {
    if (keepReading) {
      updateStatus({ connected: false, error: err.message || "Conexión serie perdida" });
    }
  } finally {
    if (reader) {
      try {
        reader.releaseLock();
      } catch {}
    }
    activeReader = null;
    disconnectWebSerial();
  }
}

export async function disconnectWebSerial(): Promise<void> {
  keepReading = false;

  if (activeReader) {
    try {
      await activeReader.cancel();
    } catch {}
    activeReader = null;
  }

  if (activePort) {
    try {
      await activePort.close();
    } catch {}
    activePort = null;
  }

  updateStatus({ connected: false, mode: "none", error: null });
}

export function subscribeHardwareTelemetry(callback: (data: HardwareTelemetryData) => void): () => void {
  if (typeof window === "undefined") return () => {};

  const handler = (event: Event) => {
    const custom = event as CustomEvent<HardwareTelemetryData>;
    if (custom.detail) {
      callback(custom.detail);
    }
  };

  window.addEventListener("stellarapp:hardware-telemetry", handler);
  return () => window.removeEventListener("stellarapp:hardware-telemetry", handler);
}

export function subscribeHardwareStatus(callback: (status: SerialStatus) => void): () => void {
  if (typeof window === "undefined") return () => {};

  const handler = (event: Event) => {
    const custom = event as CustomEvent<SerialStatus>;
    if (custom.detail) {
      callback(custom.detail);
    }
  };

  window.addEventListener("stellarapp:hardware-status", handler);
  return () => window.removeEventListener("stellarapp:hardware-status", handler);
}
