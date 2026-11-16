# StellarApp — NASA Space Apps Challenge 2026

[![NASA Space Apps](https://img.shields.io/badge/NASA_Space_Apps-2026-0B3D91?style=for-the-badge&logo=nasa&logoColor=white)](https://www.spaceappschallenge.org/)
[![Production Live](https://img.shields.io/badge/Plataforma_En_Vivo-stellarapp.nerosystem.solutions-76b900?style=for-the-badge&logo=cloudflare&logoColor=white)](https://stellarapp.nerosystem.solutions)
[![Next.js 14](https://img.shields.io/badge/Next.js-14_App_Router-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

[English](README.md) · **Español**

**Desafío:** Seguridad Contra Incendios y Combustión en Microgravedad

Plataforma interactiva con Inteligencia Artificial que desbloquea, clasifica e interpreta cuatro décadas de investigación de la NASA sobre la física del fuego en microgravedad (ISS, Cygnus Saffire, BASS-II, FLEX-2), orientada a proteger a los astronautas en misiones **Artemis (Luna)** y naves hacia **Marte**.

- 🌐 **Plataforma en vivo:** <https://stellarapp.nerosystem.solutions>
- 🎥 **Video Demostración Operacional (HIL):** [Ver Video del Sistema (MP4)](https://stellarapp.nerosystem.solutions/media/STELLARAPP_Demo.mp4)
- 🤖 **Bot de Telegram Telemetría IoT:** [@Stellar_App_bot](https://t.me/Stellar_App_bot)

---

## Dossier Técnico Oficial & Reportes de Vuelo (PDF)

| Documento | Alcance | Idioma | Descarga Directa |
| --- | --- | :---: | :---: |
| **Informe de Investigación Oficial NASA** | Documento técnico y científico completo para el Space Apps Challenge 2026 | Inglés | [📄 Descargar PDF](https://stellarapp.nerosystem.solutions/STELLARAPP_NASA_INGLES.pdf) |
| **Ficha Técnica de Hardware y Aviónica** | Sonda sensorial RP2040 Pico W + Cabina Sunton ESP32 4.3" TFT y esquemas | Técnico | [📄 Descargar PDF](https://stellarapp.nerosystem.solutions/StellarApp_Ficha_Tecnica_Hardware_Software.pdf?v=2026) |

---

## Características Principales

1. **Catálogo Experimental Normalizado**
   - Ingesta estructurada de datos de **Saffire (I, II, IV)**, **BASS-II** y **FLEX-2**.
   - Parámetros físicos: tasa de propagación de llama (mm/s), Índice de Oxígeno Límite (LOI), distancia de extinción y morfología de la llama.

2. **Comparador Físico 1g (Tierra) vs. 0g (Espacio)**
   - Ilustración del impacto de la flotabilidad gravitacional: llamas cónicas por convección natural vs. llamas esféricas difusas en microgravedad.
   - Análisis de riesgos específicos como el goteo de plástico fundido en ingravidez y los fuegos latentes (*smoldering*).

3. **Simulador Predictivo de Atmósferas de Exploración**
   - Cálculo en tiempo real del riesgo para perfiles de hábitat (ej. atmósfera Artemis: 26%–34% de O₂ a 56 kPa).
   - Detección del peligro de **"Cool Flames"** (combustión invisible a baja temperatura).

4. **Asistente de Seguridad con Inteligencia Artificial**
   - Respuestas en lenguaje natural fundamentadas en papers técnicos de la NASA.
   - Recomendaciones operativas para el sistema de control ambiental de la nave (ECLSS).

5. **Telemetría de Toxicidad por CO con Filtro de Kalman y Hardware-in-the-Loop**
   - Filtrado estocástico de ruido de sensores IoT para calcular tiempos de evacuación crítica.
   - Integración en vivo con una cabina gemela digital Raspberry Pi Pico W / ESP32-8048S043.

6. **Puente Tierra–Espacio**
   - Calibración cruzada de la Potencia Radiativa de Fuego (FRP) de los satélites NASA FIRMS con la física de combustión en microgravedad.

7. **Base de Datos NASA PSI**
   - 14 estudios oficiales de Physical Sciences Informatics y 32 parámetros validados.

8. **Ranking Explicable de Investigaciones**
   - Ordena cada investigación para un perfil de hábitat (ISS, Artemis, base lunar, rover presurizado, traje EVA).
   - Puntuación de 0 a 100 con cuatro factores auditables: inflamabilidad (LOI vs O₂ ambiental), propagación de llama, dificultad de detección y relevancia gravitatoria.

9. **Impacto en la Tierra y Lecciones Aprendidas**
   - Spinoffs oficiales de la NASA vinculados a la seguridad contra incendios (agua nebulizada, detección de humo, tanques de aire y ropa protectora para bomberos).
   - Línea temporal 1967→Artemis con Apolo 1, Apolo 13, el incendio de la Mir, Saffire y Artemis II.

10. **Biblioteca de Referencia del Reto**
   - Las 10 fuentes oficiales de la pestaña Resources (PSI, NASA Glenn, ScienceCasts, guía del investigador, casos históricos y spinoffs), con descargas PDF/EPUB.
   - Mapa de 15 investigaciones (dataset, citadas en el brief, activas y futuras como FM2 y LUCI), instalaciones de la ISS (CIR, MDCA, MSG, Cygnus) y hechos verificados.
   - Se declara explícitamente el vacío de datos de gravedad parcial.

---

## Stack Tecnológico

- **Frontend:** Next.js 14 (App Router) / React 18 / TypeScript / Tailwind CSS / Recharts / Lucide.
- **Backend:** FastAPI (Python), Pydantic v2, pytest.
- **IA:** API de Gemini con grounding sobre el dataset, más un fallback local Ollama/Qwen-2.5 para operación offline (air-gapped).
- **Fuentes de datos:** NASA Physical Sciences Informatics (PSI) y NASA Technical Reports Server (NTRS).
- **Infraestructura:** Docker Compose + Nginx + Let's Encrypt.

---

## Inicio Rápido (< 2 minutos)

### Opción 1: Docker Compose

```bash
docker compose up -d --build
```

- Frontend: <http://localhost:8066>
- Backend: <http://localhost:8067/docs>

### Opción 2: Script automático (Windows)

```powershell
.\start-dev.ps1
```

### Opción 3: Manual

#### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate      # Linux/macOS: source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Documentación de la API: <http://localhost:8000/docs>

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

Panel interactivo: <http://localhost:3000> (redirige a `/es` o `/en`)

---

## Internacionalización (ES / EN)

La interfaz está disponible en español e inglés mediante [`next-intl`](https://next-intl.dev) con rutas por idioma.

| Ruta | Idioma |
| --- | --- |
| `/` | Redirige según el navegador (cookie `NEXT_LOCALE`) |
| `/es`, `/es/pitch` | Español (idioma por defecto) |
| `/en`, `/en/pitch` | Inglés |

- El selector **ES / EN** está en el navbar (escritorio y menú móvil) y en la cabecera del pitch.
- La detección inicial usa `Accept-Language`; la elección manual se guarda un año en la cookie `NEXT_LOCALE`.
- Los textos viven en `frontend/messages/es.json` y `frontend/messages/en.json`, organizados por namespace (`nav`, `hero`, `catalog`, `metrics`, `comparison`, `simulator`, `bridge`, `kalman`, `cockpit`, `footage`, `analytics`, `pitch`, `ai`, `footer`, `metadata`).
- Configuración: `frontend/locales.ts`, `frontend/i18n.ts`, `frontend/middleware.ts` y `frontend/navigation.ts` (helpers `Link`/`useRouter` con prefijo de idioma).

Para añadir un texto nuevo, agrega la misma clave en **ambos** archivos JSON. Los namespaces se verifican 1:1.

El backend también acepta el parámetro `lang=es|en` (query string o cuerpo JSON) en los endpoints que generan contenido: `/api/ai/ask`, `/api/ai/simulate`, `/api/telemetry/kalman`, `/api/firms/summary`, `/api/firms/frp`, `/api/experiments`, `/api/ranking`, `/api/resources` y `/api/scenarios`. El frontend envía el idioma activo en cada llamada, de modo que las respuestas de la IA, los diagnósticos, las narrativas de experimentos y los datos de gráficos llegan ya localizados.

> Estado: **localización ES/EN completa de la interfaz web y del contenido generado por el backend** — UI, respuestas de IA, diagnósticos del simulador, telemetría Kalman, puente NASA FIRMS y narrativas de experimentos. Las descripciones de los estudios oficiales NASA PSI permanecen en su idioma de origen (inglés), y el bot de Telegram usa su propio lenguaje conversacional. Los niveles de riesgo se devuelven como códigos estables (`Extreme`, `Critical`, `Moderate`, `Low`) y la interfaz los traduce.

---

## Pruebas

```bash
cd backend
pytest
```

La suite cubre modelos físicos de microgravedad, guardrails aeroespaciales, el filtro de Kalman y los contratos de la API (**35 pruebas**).

Build y verificación de tipos del frontend:

```bash
cd frontend
npm run build
```

---

## Estructura del Proyecto

```
stellarapp/
├─ backend/            Servicio FastAPI, motor físico, servicio de IA, tests
│  ├─ main.py
│  ├─ ai_service.py
│  ├─ physics_engine.py
│  ├─ firms_service.py
│  ├─ telegram_service.py
│  ├─ data/            Datasets NASA (combustión + PSI)
│  └─ tests/
├─ frontend/           Aplicación Next.js 14
│  ├─ app/[locale]/    Rutas localizadas (home + pitch)
│  ├─ components/      Dashboard, gráficos, HUD Kalman, asistentes IA
│  ├─ messages/        es.json / en.json
│  └─ middleware.ts    Detección y enrutado de idioma
├─ hardware/           Firmware de cabina ESP32 y puente Pico W
├─ scripts/            Scripts del puente de telemetría
└─ docker-compose.yml
```

---

## Despliegue

Producción corre en un servidor Linux detrás de Nginx:

- `stellarapp_frontend` → `127.0.0.1:8066`
- `stellarapp_backend` → `127.0.0.1:8067`
- Host público: `stellarapp.nerosystem.solutions` (HTTPS con Let's Encrypt)

```bash
git pull
docker compose up -d --build
```

---

## Datos y Créditos

- NASA Physical Sciences Informatics (PSI) — <https://psi.nasa.gov>
- NASA Technical Reports Server (NTRS) — <https://ntrs.nasa.gov>
- NASA FIRMS — <https://firms.modaps.eosdis.nasa.gov>
- Datos de los experimentos Saffire, BASS-II, FLEX-2, SAME y ACME.
- Imágenes oficiales de la NASA: <https://images.nasa.gov> (dominio público).

**Equipo StellarApp** — NASA International Space Apps Challenge 2026.
