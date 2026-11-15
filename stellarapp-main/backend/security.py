"""Seguridad ligera para StellarApp: API key para rutas sensibles y rate limiting en memoria.

Sin dependencias externas. Configuración por variables de entorno:

- STELLAR_API_KEY      Clave requerida (header ``X-API-Key``) en rutas administrativas
                       y de telemetría de hardware. Si está vacía, las rutas quedan
                       abiertas (modo desarrollo) y se registra una advertencia.
- ALLOWED_ORIGINS      Orígenes CORS permitidos, separados por coma.
- TRUST_PROXY_HEADERS  "1" para leer la IP real desde X-Forwarded-For (detrás de Nginx/Cloudflare).
"""
import hmac
import logging
import os
import time
from collections import defaultdict, deque
from typing import Deque, Dict, List

from fastapi import Header, HTTPException, Request

logger = logging.getLogger("stellarapp.security")

_warned_open = False


def get_api_key() -> str:
    return os.getenv("STELLAR_API_KEY", "").strip()


def get_allowed_origins() -> List[str]:
    raw = os.getenv(
        "ALLOWED_ORIGINS",
        "https://stellarapp.nerosystem.solutions,http://localhost:3000,http://127.0.0.1:3000",
    )
    return [o.strip() for o in raw.split(",") if o.strip()]


async def require_api_key(x_api_key: str = Header(default="")) -> None:
    """Dependencia FastAPI: exige X-API-Key cuando STELLAR_API_KEY está configurada."""
    global _warned_open
    expected = get_api_key()
    if not expected:
        if not _warned_open:
            logger.warning("STELLAR_API_KEY no configurada: rutas protegidas ABIERTAS (solo desarrollo).")
            _warned_open = True
        return
    if not hmac.compare_digest(x_api_key.encode("utf-8"), expected.encode("utf-8")):
        raise HTTPException(status_code=401, detail="API key inválida o ausente")


def client_ip(request: Request) -> str:
    if os.getenv("TRUST_PROXY_HEADERS", "0") == "1":
        fwd = request.headers.get("x-forwarded-for", "")
        if fwd:
            return fwd.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


class RateLimiter:
    """Ventana deslizante por IP. Uso: ``Depends(RateLimiter(20, 60))``."""

    def __init__(self, max_calls: int, per_seconds: int, scope: str = ""):
        self.max_calls = max_calls
        self.per_seconds = per_seconds
        self.scope = scope
        self._hits: Dict[str, Deque[float]] = defaultdict(deque)

    async def __call__(self, request: Request) -> None:
        if os.getenv("RATE_LIMIT_DISABLED", "0") == "1":
            return
        key = f"{self.scope}:{client_ip(request)}"
        now = time.monotonic()
        hits = self._hits[key]
        while hits and now - hits[0] > self.per_seconds:
            hits.popleft()
        if len(hits) >= self.max_calls:
            retry = max(1, int(self.per_seconds - (now - hits[0])))
            raise HTTPException(
                status_code=429,
                detail="Demasiadas solicitudes. Intenta de nuevo en unos segundos.",
                headers={"Retry-After": str(retry)},
            )
        hits.append(now)
        # Evita crecimiento ilimitado del diccionario
        if len(self._hits) > 5000:
            for k in [k for k, v in self._hits.items() if not v]:
                self._hits.pop(k, None)
