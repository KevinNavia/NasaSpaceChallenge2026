# StellarApp — NASA Space Apps Challenge 2026

**English** · [Español](README.es.md)

**Challenge:** Fire Safety and Combustion in Microgravity

An interactive AI platform that unlocks, classifies and models four decades of NASA research on fire physics in microgravity (ISS, Cygnus Saffire, BASS-II, FLEX-2), aimed at protecting astronauts on **Artemis (Moon)** missions and spacecraft traveling to **Mars**.

Live demo: <https://stellarapp.nerosystem.solutions>

---

## Key Features

1. **Normalized Experimental Catalog**
   - Structured ingestion of **Saffire (I, II, IV)**, **BASS-II** and **FLEX-2** data.
   - Physical parameters: flame spread rate (mm/s), Limiting Oxygen Index (LOI), quenching distance and flame morphology.

2. **Physical Comparator: 1g (Earth) vs. 0g (Space)**
   - Illustrates the impact of gravitational buoyancy: conical flames driven by natural convection versus spherical, diffuse flames in microgravity.
   - Specific hazard analysis such as molten plastic dripping in weightlessness and smoldering fires.

3. **Predictive Exploration-Atmosphere Simulator**
   - Real-time risk calculation for habitat profiles (e.g., Artemis atmosphere: 26%–34% O₂ at 56 kPa).
   - Detection of invisible **"Cool Flames"** (low-temperature combustion).

4. **AI Safety Assistant**
   - Natural-language answers grounded in NASA technical papers.
   - Operational recommendations for the spacecraft Environmental Control and Life Support System (ECLSS).

5. **Kalman CO-Toxicity Telemetry & Hardware-in-the-Loop**
   - Stochastic filtering of IoT sensor noise to compute critical evacuation times.
   - Live integration with a Raspberry Pi Pico W / ESP32-8048S043 digital twin cockpit.

6. **Earth-to-Space Fire Bridge**
   - Cross-calibration of NASA FIRMS satellite Fire Radiative Power (FRP) with microgravity combustion physics.

7. **NASA PSI Database**
   - 14 official Physical Sciences Informatics studies and 32 validated parameters.

---

## Technology Stack

- **Frontend:** Next.js 14 (App Router) / React 18 / TypeScript / Tailwind CSS / Recharts / Lucide.
- **Backend:** FastAPI (Python), Pydantic v2, pytest.
- **AI:** Gemini API with dataset grounding, plus a local Ollama/Qwen-2.5 fallback for offline (air-gapped) operation.
- **Data sources:** NASA Physical Sciences Informatics (PSI) and NASA Technical Reports Server (NTRS).
- **Infrastructure:** Docker Compose + Nginx + Let's Encrypt.

---

## Quick Start (< 2 minutes)

### Option 1: Docker Compose

```bash
docker compose up -d --build
```

- Frontend: <http://localhost:8066>
- Backend: <http://localhost:8067/docs>

### Option 2: Automated script (Windows)

```powershell
.\start-dev.ps1
```

### Option 3: Manual

#### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate      # Linux/macOS: source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

API docs: <http://localhost:8000/docs>

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

Dashboard: <http://localhost:3000> (redirects to `/es` or `/en`)

---

## Internationalization (ES / EN)

The interface is available in Spanish and English through [`next-intl`](https://next-intl.dev) with locale-prefixed routes.

| Route | Language |
| --- | --- |
| `/` | Redirects based on the browser (cookie `NEXT_LOCALE`) |
| `/es`, `/es/pitch` | Spanish (default) |
| `/en`, `/en/pitch` | English |

- The **ES / EN** switcher lives in the navbar (desktop and mobile menu) and in the pitch header.
- Initial detection uses `Accept-Language`; a manual choice is stored for one year in the `NEXT_LOCALE` cookie.
- UI strings live in `frontend/messages/es.json` and `frontend/messages/en.json`, organized by namespace (`nav`, `hero`, `catalog`, `metrics`, `comparison`, `simulator`, `bridge`, `kalman`, `cockpit`, `footage`, `analytics`, `pitch`, `ai`, `footer`, `metadata`).
- Configuration: `frontend/locales.ts`, `frontend/i18n.ts`, `frontend/middleware.ts` and `frontend/navigation.ts` (locale-aware `Link`/`useRouter` helpers).

When adding a new string, add the same key to **both** JSON files. Namespaces are verified 1:1.

The backend also accepts a `lang=es|en` parameter (query string or JSON body) on the content-generating endpoints: `/api/ai/ask`, `/api/ai/simulate`, `/api/telemetry/kalman`, `/api/firms/summary`, `/api/firms/frp`, `/api/experiments` and `/api/scenarios`. The frontend forwards the active locale on every call, so AI answers, diagnostics, experiment narratives and chart data arrive already localized.

> Status: **full ES/EN localization of the web interface and backend-generated content** — UI, AI answers, simulator diagnostics, Kalman telemetry, NASA FIRMS bridge and experiment narratives. Official NASA PSI study descriptions remain in their source language (English), and the Telegram bot uses its own conversational language. Risk levels are returned as stable codes (`Extreme`, `Critical`, `Moderate`, `Low`) and translated by the UI.

---

## Tests

```bash
cd backend
pytest
```

The suite covers microgravity physics models, aerospace guardrails, the Kalman filter and API contracts (**35 tests**).

Frontend build and type checks:

```bash
cd frontend
npm run build
```

---

## Project Structure

```
stellarapp/
├─ backend/            FastAPI service, physics engine, AI service, tests
│  ├─ main.py
│  ├─ ai_service.py
│  ├─ physics_engine.py
│  ├─ firms_service.py
│  ├─ telegram_service.py
│  ├─ data/            NASA datasets (combustion + PSI)
│  └─ tests/
├─ frontend/           Next.js 14 application
│  ├─ app/[locale]/    Localized routes (home + pitch)
│  ├─ components/      Dashboard, charts, Kalman HUD, AI assistants
│  ├─ messages/        es.json / en.json
│  └─ middleware.ts    Locale detection and routing
├─ hardware/           ESP32 cockpit firmware and Pico W bridge
├─ scripts/            Telemetry bridge scripts
└─ docker-compose.yml
```

---

## Deployment

Production runs on a Linux server behind Nginx:

- `stellarapp_frontend` → `127.0.0.1:8066`
- `stellarapp_backend` → `127.0.0.1:8067`
- Public host: `stellarapp.nerosystem.solutions` (HTTPS via Let's Encrypt)

```bash
git pull
docker compose up -d --build
```

---

## Data & Credits

- NASA Physical Sciences Informatics (PSI) — <https://psi.nasa.gov>
- NASA Technical Reports Server (NTRS) — <https://ntrs.nasa.gov>
- NASA FIRMS — <https://firms.modaps.eosdis.nasa.gov>
- Saffire, BASS-II, FLEX-2, SAME and ACME experiment data.
- Official NASA imagery: <https://images.nasa.gov> (public domain).

**Team StellarApp** — NASA International Space Apps Challenge 2026.
