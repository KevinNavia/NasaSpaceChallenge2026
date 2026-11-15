"""
STELLARAPP // PUENTE SERIAL USB PICO W -> SERVIDOR NUBE
Lee la telemetría en tiempo real del Raspberry Pi Pico W por USB (COM6)
y la sincroniza con el servidor en producción y las alertas de Telegram.
"""
import os
import sys
import json
import time
import argparse
import requests
import serial

# Configuración: argumentos o variables de entorno (sin valores fijos ni secretos en el código).
#   python bridge_pico.py --port COM6
#   STELLAR_API_KEY=... python bridge_pico.py --port /dev/ttyACM0
parser = argparse.ArgumentParser(description="Puente serial Pico W -> StellarApp")
parser.add_argument("--port", default=os.getenv("PICO_SERIAL_PORT", "COM6"), help="Puerto serie (COM6, /dev/ttyACM0...)")
parser.add_argument("--baud", type=int, default=int(os.getenv("PICO_BAUD_RATE", "115200")))
parser.add_argument("--api-url", default=os.getenv("STELLAR_PROD_API_URL", "https://stellarapp.nerosystem.solutions/api/telemetry/hardware"))
parser.add_argument("--local-url", default=os.getenv("STELLAR_LOCAL_API_URL", "http://127.0.0.1:8000/api/telemetry/hardware"))
args = parser.parse_args()

SERIAL_PORT = args.port
BAUD_RATE = args.baud
PROD_API_URL = args.api_url
LOCAL_API_URL = args.local_url

API_KEY = os.getenv("STELLAR_API_KEY", "")
HEADERS = {"X-API-Key": API_KEY} if API_KEY else {}
if not API_KEY:
    print("⚠️  STELLAR_API_KEY no definida: el servidor rechazará el POST si tiene la clave activada.")

print("=" * 65)
print(f"🛰️  STELLARAPP // PUENTE HARDWARE-IN-THE-LOOP")
print(f"   Puerto Serie: {SERIAL_PORT} @ {BAUD_RATE} baud")
print(f"   Servidor Nube: {PROD_API_URL}")
print("=" * 65)

try:
    ser = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=2)
    print("✅ Conexión establecida con Raspberry Pi Pico W (RP2040).")
    print("👉 Apoya tu dedo sobre el chip RP2040 para elevar la temperatura y disparar la alarma.\n")
except Exception as e:
    print(f"❌ Error abriendo puerto {SERIAL_PORT}: {e}")
    print("Verifica que la placa esté conectada y que ningún otro programa (como Thonny) tenga el puerto abierto.")
    sys.exit(1)

last_broadcast_time = 0
last_post_time = 0

while True:
    try:
        raw_line = ser.readline().decode("utf-8", "ignore").strip()
        if not raw_line or not raw_line.startswith("{"):
            continue

        data = json.loads(raw_line)
        temp_c = float(data.get("chip_temp_c", 25.0))
        o2_raw = float(data.get("o2_raw", 21.0))
        o2_kalman = float(data.get("o2_kalman", 21.0))
        co_ppm = float(data.get("co_ppm", 20.0))
        k_gain = float(data.get("k_gain", 0.167))
        status = data.get("status", "NOMINAL")

        now = time.time()
        # Post every ~800ms
        if now - last_post_time < 0.8:
            continue
        last_post_time = now

        is_critical = status == "CRITICO // EVACUACION" or o2_kalman >= 27.5 or temp_c >= 42.0
        should_broadcast = is_critical and (now - last_broadcast_time > 20)

        # Print high-signal status to terminal
        alert_symbol = "🚨" if is_critical else ("⚠️" if "ALERTA" in status else "🟢")
        print(f"{alert_symbol} [{status}] Chip: {temp_c:.1f}°C | O₂ Kalman: {o2_kalman:.2f}% | CO: {co_ppm:.1f} ppm | K-Gain: {k_gain}")

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
            r = requests.post(PROD_API_URL, json=payload, headers=HEADERS, timeout=2.5)
            if should_broadcast:
                print("   📢 ALERTA CRÍTICA EMITIDA A TELEGRAM Y AUDITORIO!")
                last_broadcast_time = now
        except Exception:
            pass

        # 2. Enviar a Backend Local si está activo
        try:
            requests.post(LOCAL_API_URL, json=payload, headers=HEADERS, timeout=0.5)
        except Exception:
            pass

    except KeyboardInterrupt:
        print("\n⏹️ Puente detenido por el usuario.")
        ser.close()
        break
    except Exception as err:
        pass
