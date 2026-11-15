# StellarApp - NASA Space Apps Challenge 2026

## 🚀 Desafío: Seguridad Contra Incendios y Combustión en Microgravedad

Plataforma interactiva con Inteligencia Artificial que resume, clasifica e interpreta décadas de investigación de la NASA sobre la física del fuego en microgravedad (ISS, Cygnus Saffire, BASS-II, FLEX-2), orientada a proteger a los astronautas en misiones **Artemis (Luna)** y naves hacia **Marte**.

---

## 🛰️ Características Principales

1. **Catálogo Experimental Normalizado:**
   - Ingesta estructurada de datos de **Saffire (I, II, IV)**, **BASS-II** y **FLEX-2**.
   - Parámetros físicos: Tasa de propagación de llama ($mm/s$), Índice de Oxígeno Límite ($LOI$), distancia de extinción y morfología de la llama.

2. **Comparador Físico 1g (Tierra) vs. 0g (Espacio):**
   - Ilustración del impacto de la flotabilidad gravitacional: llamas cónicas por convección natural vs. llamas esféricas difusas en microgravedad.
   - Análisis de riesgos específicos como el goteo de plástico fundido en ingravidez y fuegos latentes (*smoldering*).

3. **Simulador Predictivo de Atmósferas de Exploración:**
   - Cálculo en tiempo real del riesgo para perfiles de hábitat (ej. atmósfera Artemis: 26% - 32% $O_2$ a 56 kPa).
   - Detección de peligro de **"Cool Flames"** (combustión invisible a baja temperatura).

4. **Asistente de Seguridad con Inteligencia Artificial (Gemini):**
   - Respuestas en lenguaje natural fundamentadas en papers técnicos de la NASA.
   - Recomendaciones operativas para el sistema de control ambiental de la nave (ECLSS).

---

## 🛠️ Stack Tecnológico

- **Frontend:** Next.js 14 / React / Tailwind CSS / Lucide Icons.
- **Backend:** FastAPI (Python 3.11).
- **Inteligencia Artificial:** Gemini API (`gemini-2.0-flash`) con sistema de grounding sobre el dataset de la NASA.
- **Fuentes de Datos:** NASA Physical Sciences Informatics (PSI) & NASA Technical Reports Server (NTRS).

---

## ⚡ Inicio Rápido (< 2 minutos)

### Opción 1: Script Automático
```powershell
.\start-dev.ps1
```

### Opción 2: Manual

#### Backend:
```bash
cd backend
.\.venv\Scripts\Activate.ps1
uvicorn main:app --reload --port 8000
```
*API docs disponibles en:* `http://localhost:8000/docs`

#### Frontend:
```bash
cd frontend
npm run dev
```
*Panel interactivo disponible en:* `http://localhost:3000`


---

## 🔐 Seguridad y configuración

Copia `backend/.env.example` a `backend/.env` y completa los valores. **Nunca subas `.env` ni tokens al repositorio.**

| Variable | Para qué sirve |
|---|---|
| `TELEGRAM_BOT_TOKEN` | Token del bot (de @BotFather). Solo por entorno. |
| `TELEGRAM_WEBHOOK_SECRET` | Secreto que Telegram envía en cada webhook; el backend lo valida. |
| `STELLAR_API_KEY` | Header `X-API-Key` exigido en `POST /api/telemetry/hardware` y `POST /api/telegram/set-webhook`. |
| `ALLOWED_ORIGINS` | Orígenes CORS permitidos (separados por coma). |
| `TRUST_PROXY_HEADERS` | `1` detrás de Nginx/Cloudflare para limitar por IP real. |

- Límites por IP: 20 consultas de IA/min y 5 emisiones a Telegram/min.
- `GET /api/telegram/status` ya no expone la lista de suscriptores, solo el conteo.
- Si necesitas rotar el token: `/revoke` en @BotFather, actualiza `.env` y llama a `set-webhook` con tu `X-API-Key`.
- Puente del Pico W: `STELLAR_API_KEY=... python scripts/bridge_pico.py --port COM6`.

### Tests

```bash
cd backend
pip install -r requirements-dev.txt
python -m pytest -q
```

---

## 🌐 Idiomas (ES / EN)

La interfaz y el asistente de IA funcionan en español e inglés. El selector está arriba a la derecha y se recuerda en `localStorage`. Para añadir textos nuevos, usa `t("Texto en español")` y agrega la pareja en `frontend/i18n/en.json`. Detalles en `GUIA_BILINGUE_ES_EN.md`.
