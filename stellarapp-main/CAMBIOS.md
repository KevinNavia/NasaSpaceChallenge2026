# Cambios de mejora + versión bilingüe ES/EN (fusionada)

Esta versión combina tres cosas:
1. **Tu código actual** (hardware Pico W, metraje oficial NASA, Ralph Loop, pitch actualizado).
2. **La traducción ES/EN** (carpeta `frontend/i18n`, selector de idioma, asistente IA bilingüe).
3. **Las mejoras de seguridad/backend/DevOps** descritas abajo.

El zip bilingüe estaba basado en una versión más antigua (sin hardware ni metraje NASA). Se fusionó
con un merge de 3 vías: se conservaron sus traducciones y se añadieron las funciones nuevas, que
también quedaron traducidas (panel Hardware-in-the-Loop, galería y videos NASA, lightbox).
El diseño visual no se modificó.

## Bilingüe (sin cambios respecto al zip recibido, salvo lo indicado)
- `frontend/i18n/*` y el selector ES/EN en Navbar y /pitch.
- `POST /api/ai/ask` acepta `language: "es" | "en"`.
- Nuevo: ~40 textos traducidos (hardware, NASAOfficialFootage, lightbox del pitch) en `i18n/en.json`.
- El guardrail del dominio ahora entiende términos en inglés **y** usa palabras completas.
- Los mensajes del bot de Telegram siguen en español.

## Frontend (zona del diseño): sin cambios visuales

## Seguridad
- Token de Telegram eliminado del código y de `.env.example` (ahora solo `TELEGRAM_BOT_TOKEN` por entorno).
- `X-API-Key` (`STELLAR_API_KEY`) en `POST /api/telemetry/hardware` y `POST /api/telegram/set-webhook`.
- Webhook de Telegram validado con `TELEGRAM_WEBHOOK_SECRET`.
- `/api/telegram/status` ya no devuelve la lista de suscriptores (el Navbar solo usa el conteo).
- CORS limitado a `ALLOWED_ORIGINS`.
- Rate limit por IP: 20 consultas IA/min, 5 emisiones a Telegram/min.
- Alertas de Telegram con HTML escapado.
- Key de Gemini enviada por header, no en la URL.

## Backend
- Guardrail por palabra completa (sin falsos positivos como "mission" -> "iss").
- Respuestas de Ollama menos cortadas (`OLLAMA_NUM_PREDICT=300`, configurable).
- `print` -> `logging`. `requirements.txt` en UTF-8 + `requirements-dev.txt`.
- Suscriptores en `backend/runtime/` (volumen Docker persistente).

## DevOps
- Dockerfiles: usuario no root, `npm ci`, healthchecks, `.dockerignore`.
- `docker-compose.yml` con volumen y variables de entorno.
- CI en `.github/workflows/ci.yml` (pytest, tsc, build, gitleaks).
- `scripts/bridge_pico.py`: puerto y URL por argumento; envía `X-API-Key`.

## Para desplegar
1. En @BotFather: `/revoke` y obtén un token nuevo.
2. Crea `.env` en la raíz (junto a docker-compose.yml) con:
   TELEGRAM_BOT_TOKEN, TELEGRAM_WEBHOOK_SECRET, STELLAR_API_KEY, GEMINI_API_KEY.
   Genera secretos con `openssl rand -hex 32`.
3. `docker compose up -d --build`
4. Re-registra el webhook (ahora con secreto):
   `curl -X POST -H "X-API-Key: $STELLAR_API_KEY" https://stellarapp.nerosystem.solutions/api/telegram/set-webhook`
5. Pico: `STELLAR_API_KEY=... python scripts/bridge_pico.py --port COM6`
6. Limpia el historial de git del token antiguo (o simplemente asume que está quemado y ya revocado).
