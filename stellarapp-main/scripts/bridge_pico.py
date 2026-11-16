"""
STELLARAPP // PUENTE SERIAL DUAL (PICO W COM6 + ESP32 HUD COM9 -> SERVIDOR NUBE)
Lee la telemetría del sensor térmico RP2040 en Raspberry Pi Pico W (COM6),
la retransmite por serial a la pantalla táctil ESP32-8048S043 (COM9)
y la sincroniza con el servidor en producción y las alertas de Telegram.
"""
import sys
import json
import time
import requests
import serial

PICO_PORT = "COM6"
ESP32_PORT = "COM9"
BAUD_RATE = 115200
PROD_API_URL = "https://stellarapp.nerosystem.solutions/api/telemetry/hardware"
LOCAL_API_URL = "http://127.0.0.1:8000/api/telemetry/hardware"

print("=" * 70, flush=True)
print("🛰️  STELLARAPP // PUENTE INTEGRAL HARDWARE-IN-THE-LOOP", flush=True)
print(f"   Sensor RP2040:  {PICO_PORT} @ {BAUD_RATE} baud", flush=True)
print(f"   Pantalla HUD:   {ESP32_PORT} @ {BAUD_RATE} baud", flush=True)
print(f"   Servidor Nube:  {PROD_API_URL}", flush=True)
print("=" * 70, flush=True)

# 1. Conectar al sensor Pico W
try:
    ser_pico = serial.Serial(PICO_PORT, BAUD_RATE, timeout=2)
    print(f"✅ Conexión establecida con Sonda RP2040 en {PICO_PORT}.", flush=True)
except Exception as e:
    print(f"❌ Error abriendo {PICO_PORT} (Pico W): {e}", flush=True)
    sys.exit(1)

# 2. Conectar opcionalmente a la pantalla ESP32 Cockpit HUD
ser_esp32 = None
try:
    ser_esp32 = serial.Serial(ESP32_PORT, BAUD_RATE, timeout=0.1)
    print(f"✅ Conexión establecida con Pantalla Táctil ESP32 HUD en {ESP32_PORT}.", flush=True)
except Exception as e:
    print(f"⚠️ Pantalla {ESP32_PORT} en espera o no disponible ({e}). Continuando con nube...", flush=True)

print("\n👉 Telemetría activa: apoya tu pulgar sobre el chip RP2040 para elevar la temperatura y activar la alarma.\n", flush=True)

session = requests.Session()
last_broadcast_time = 0
last_post_time = 0

while True:
    try:
        # Intentar reconectar ESP32 si no estaba listo
        if ser_esp32 is None:
            try:
                ser_esp32 = serial.Serial(ESP32_PORT, BAUD_RATE, timeout=0.1)
                print(f"✅ Conectado a Pantalla ESP32 HUD en {ESP32_PORT}.", flush=True)
            except Exception:
                pass

        # Leer respuesta táctil o comandos desde el ESP32 si los hay
        if ser_esp32 is not None and ser_esp32.is_open:
            try:
                if ser_esp32.in_waiting:
                    esp_line = ser_esp32.readline().decode("utf-8", "ignore").strip()
                    if esp_line:
                        print(f"🖥️ [ESP32 TOUCH EVENT]: {esp_line}", flush=True)
            except Exception:
                ser_esp32 = None

        # Leer telemetría desde Pico W
        raw_line = ser_pico.readline().decode("utf-8", "ignore").strip()
        if not raw_line or not raw_line.startswith("{"):
            continue

        data = json.loads(raw_line)
        temp_c = float(data.get("chip_temp_c", 25.0))
        o2_raw = float(data.get("o2_raw", 21.0))
        o2_kalman = float(data.get("o2_kalman", 21.0))
        co_ppm = float(data.get("co_ppm", 20.0))
        k_gain = float(data.get("k_gain", 0.167))
        status = data.get("status", "NOMINAL")

        # Reenviar de inmediato a la pantalla ESP32
        if ser_esp32 is not None and ser_esp32.is_open:
            try:
                ser_esp32.write((raw_line + "\n").encode("utf-8"))
            except Exception:
                ser_esp32 = None

        now = time.time()
        # Post a la nube cada ~1.0 segundo para mantener estado live
        if now - last_post_time < 0.95:
            continue
        last_post_time = now

        is_critical = ("CRITICO" in status) or o2_kalman >= 27.5 or temp_c >= 43.5 or co_ppm >= 70.0
        should_broadcast = is_critical and (now - last_broadcast_time > 60)

        alert_symbol = "🚨" if is_critical else ("⚠️" if "ALERTA" in status else "🟢")
        print(f"{alert_symbol} [{status}] Chip: {temp_c:.1f}°C | O₂ Kalman: {o2_kalman:.2f}% | CO: {co_ppm:.1f} ppm | K-Gain: {k_gain}", flush=True)

        payload = {
            "device": "Raspberry Pi Pico W",
            "chip_temp_c": temp_c,
            "o2_raw": o2_raw,
            "o2_kalman": o2_kalman,
            "co_ppm": co_ppm,
            "k_gain": k_gain,
            "status": status,
            "scenario_id": "rover",
            "broadcast_to_telegram": should_broadcast
        }

        # 1. Enviar a Servidor Nube en Producción
        try:
            r = session.post(PROD_API_URL, json=payload, timeout=2.0)
            if should_broadcast:
                print("   📢 ALERTA CRÍTICA EMITIDA A TELEGRAM Y AUDITORIO!", flush=True)
                last_broadcast_time = now
        except Exception:
            pass

        # 2. Enviar a Backend Local si está activo
        try:
            session.post(LOCAL_API_URL, json=payload, timeout=0.3)
        except Exception:
            pass

    except KeyboardInterrupt:
        print("\n⏹️ Puente detenido por el usuario.", flush=True)
        if ser_pico and ser_pico.is_open:
            ser_pico.close()
        if ser_esp32 and ser_esp32.is_open:
            ser_esp32.close()
        break
    except Exception as err:
        time.sleep(0.5)
