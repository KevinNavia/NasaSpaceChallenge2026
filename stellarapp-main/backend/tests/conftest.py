"""Configuración común de pytest: entorno determinista, sin secretos reales."""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

# Debe fijarse ANTES de importar main / telegram_service.
os.environ.setdefault("TELEGRAM_BOT_TOKEN", "test-token")
os.environ.setdefault("RATE_LIMIT_DISABLED", "1")
os.environ.pop("STELLAR_API_KEY", None)
