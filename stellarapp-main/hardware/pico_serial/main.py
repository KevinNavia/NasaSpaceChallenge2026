"""
STELLARAPP // FIRMWARE PICO W (CALIBRADO Y ESTABLE - USB SERIAL)
Exclusivo por Puerto Serie USB (COM6 @ 115200 baudios).
Sin alertas fantasma. Filtrado estocastico de Kalman estable.
"""
import machine
import time
import json
import gc

# 1. Asegurar Wi-Fi completamente apagado
try:
    import network
    wlan = network.WLAN(network.STA_IF)
    wlan.disconnect()
    wlan.active(False)
    ap = network.WLAN(network.AP_IF)
    ap.active(False)
except Exception:
    pass

# 2. Configuración de Hardware
led = machine.Pin("LED", machine.Pin.OUT)
sensor_temp = machine.ADC(4)  # Sensor de silicio interno RP2040
conversion_factor = 3.3 / 65535

# 3. Filtro de Kalman Embebido
class MicroKalman:
    def __init__(self, q=0.008, r=0.35):
        self.q = q      # Varianza de proceso baja (estable)
        self.r = r      # Varianza de medición
        self.x = 21.0   # Concentración O2 base (21.0%)
        self.p = 1.0
        self.k = 0.167

    def update(self, measurement):
        self.p = self.p + self.q
        self.k = self.p / (self.p + self.r)
        self.x = self.x + self.k * (measurement - self.x)
        self.p = (1.0 - self.k) * self.p
        return self.x, self.k

kalman = MicroKalman()

def read_stable_temp():
    """Promedia 20 muestras ADC para eliminar ruido eléctrico."""
    total = 0
    for _ in range(20):
        total += sensor_temp.read_u16()
        time.sleep_us(80)
    raw_v = (total / 20.0) * conversion_factor
    # Formula oficial RP2040: T = 27 - (V - 0.706) / 0.001721
    return 27.0 - (raw_v - 0.706) / 0.001721

# Calibración inicial de línea base (reposo en temperatura ambiente)
time.sleep(0.3)
samples = [read_stable_temp() for _ in range(15)]
temp_baseline = sum(samples) / len(samples)

led.value(1) # LED fijo: Estado Nominal
print(json.dumps({"ready": True, "mode": "USB_SERIAL_CALIBRATED", "baseline": round(temp_baseline, 1)}))

loop_count = 0

while True:
    try:
        loop_count += 1
        gc.collect()

        real_temp = read_stable_temp()

        # Adaptar línea base solo si no hay calentamiento intencional
        # (se adapta lentamente a cambios lentos de temperatura ambiente)
        if real_temp < temp_baseline:
            temp_baseline = 0.95 * temp_baseline + 0.05 * real_temp
        elif (real_temp - temp_baseline) < 0.6:
            temp_baseline = 0.98 * temp_baseline + 0.02 * real_temp

        # Incremento térmico real sobre el reposo
        delta = max(0.0, real_temp - temp_baseline)

        # Estados con umbrales calibrados:
        # Reposo: delta < 1.2 °C -> NOMINAL
        # Contacto pulgar moderado: delta >= 1.2 °C -> ALERTA
        # Contacto pulgar prolongado o conato: delta >= 2.8 °C o temp >= 43.5 °C -> CRÍTICO
        if delta >= 2.8 or real_temp >= 43.5:
            status = "CRITICO // EVACUACION"
            target_o2 = min(34.0, 21.0 + (delta * 3.2))
            display_temp = min(52.0, real_temp + delta * 1.5)
            # Parpadeo rápido de alarma en LED
            for _ in range(3):
                led.toggle()
                time.sleep(0.05)
        elif delta >= 1.2:
            status = "ALERTA TERMICA"
            target_o2 = 21.0 + (delta * 2.0)
            display_temp = real_temp + delta * 1.0
            led.toggle()
            time.sleep(0.12)
        else:
            status = "NOMINAL"
            target_o2 = 21.0
            display_temp = real_temp
            led.value(1)

        # Filtrado de O2 con algoritmo estocástico de Kalman
        o2_kalman, k_gain = kalman.update(target_o2)

        # Estimación de CO nominal o proporcional al fuego
        if status == "NOMINAL":
            co_ppm = 22.0
        else:
            co_ppm = max(22.0, round(22.0 + (o2_kalman - 21.0) * 8.5, 1))

        telemetry = {
            "device": "Raspberry Pi Pico W",
            "chip_temp_c": round(display_temp, 1),
            "real_temp_c": round(real_temp, 2),
            "delta_temp": round(delta, 2),
            "o2_raw": round(target_o2, 1),
            "o2_kalman": round(o2_kalman, 2),
            "co_ppm": co_ppm,
            "k_gain": round(k_gain, 3),
            "status": status
        }

        # Transmitir por puerto USB Serial
        print(json.dumps(telemetry))

        time.sleep(0.65)

    except Exception as err:
        time.sleep(0.5)
