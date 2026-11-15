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
- **Backend:** FastAPI (Python 3.14).
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

## 🌐 Internacionalización (ES / EN)

La interfaz está disponible en español e inglés mediante [`next-intl`](https://next-intl.dev) con rutas por idioma.

| Ruta | Idioma |
| --- | --- |
| `/` | Redirige según el navegador (cookie `NEXT_LOCALE`) |
| `/es`, `/es/pitch` | Español (idioma por defecto) |
| `/en`, `/en/pitch` | Inglés |

- El selector **ES / EN** está en el navbar (escritorio y menú móvil) y en la cabecera del pitch.
- La detección inicial usa `Accept-Language`; la elección manual se guarda un año en la cookie `NEXT_LOCALE`.
- Los textos viven en `frontend/messages/es.json` y `frontend/messages/en.json`, organizados por namespace (`nav`, `hero`, `catalog`, `footer`, `metadata`, `localeSwitcher`).
- Configuración: `frontend/locales.ts`, `frontend/i18n.ts`, `frontend/middleware.ts` y `frontend/navigation.ts` (helpers `Link`/`useRouter` con prefijo de idioma).

Para añadir un texto nuevo, agrega la misma clave en **ambos** archivos JSON; `next build` falla si una clave falta en el idioma que se renderiza.

> Estado: Fase 0 completada (infraestructura, navbar, hero, catálogo, footer y metadata). Los componentes internos de la home, el contenido del pitch y las respuestas del agente IA siguen en español (fases 1–3).
