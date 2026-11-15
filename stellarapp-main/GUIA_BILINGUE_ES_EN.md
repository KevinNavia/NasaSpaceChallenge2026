# StellarApp bilingüe: español / inglés

Esta es una versión derivada de `stellarapp-ma2in.zip`, sin cambios intencionales en los modelos físicos ni valores del catálogo.

## Cómo ejecutar localmente (Windows, Visual Studio Code)

1. Descomprime el ZIP y abre `stellarapp-main` en VS Code.
2. Usa los comandos de instalación y ejecución originales de `README.md` (requieren Node.js, Python y dependencias).
3. Frontend: `cd frontend`, `npm install`, `npm run dev`.
4. Backend, en otra terminal: `cd backend`; crear entorno virtual y `pip install -r requirements.txt`, seguido del comando de Uvicorn indicado en el README.
5. Abre http://localhost:3000 y elige **ES** o **EN** arriba a la derecha. El idioma se conserva en `localStorage` para la próxima visita y al abrir `/pitch`.

## ¿Dónde actualizamos las traducciones?

- Selector y preferencias: `frontend/i18n/LanguageSwitcher.tsx` y `LanguageContext.tsx`.
- Traducciones: `frontend/i18n/en.json` (clave = frase original en español, valor = traducción inglesa).
- Componentes: `frontend/components/*.tsx`, `frontend/app/page.tsx`, `frontend/app/pitch/page.tsx`.
- Si agregas un texto visible en español en JSX, escribe `{t("Nuevo texto en español")}` dentro de un componente que ya tenga `const { t } = useLanguage();`. Luego agrega `"Nuevo texto en español": "New text in English"` en `en.json`.
- Ejemplo de un botón: `<button>{t("Ejecutar")}</button>` y en `en.json` agregar `"Ejecutar": "Run"`.
- Si introduces un componente nuevo, importa `useLanguage` de `../i18n/LanguageContext` (ajustando la ruta) y llama al hook dentro del componente.
- Las etiquetas/campos numéricos y las claves de JSON/API siguen con sus nombres originales; no traducir identificadores técnicos.
- Chat de IA: ambas interfaces envían `language: "es" | "en"` al endpoint `/api/ai/ask`; FastAPI pasa el idioma a `ai_service.py`. Se añadió una respuesta local en inglés cuando no hay un modelo conectado. Las respuestas del modelo externo dependen de su disponibilidad y precisión.
- Telegram: los mensajes definidos en el bot siguen mayormente en español; cambiar el idioma de la web no modifica las suscripciones de Telegram ni traduce automáticamente esos mensajes.

## Alcance y advertencias

- La página y sus módulos principales se muestran en español o inglés mediante diccionario local. Algunas descripciones científicas extensas o respuestas de servicios externos pueden conservar el idioma original si todavía no figuran en el diccionario.
- No hay Google Translate ni dependencia de un traductor externo para la interfaz.
- Las gráficas y las estimaciones físicas se conservan como prototipo demostrativo, no resultados certificados por NASA.
- El selector NO publica una página en Internet. Para desplegar, actualizar el repositorio GitHub que use tu equipo y ejecutar el despliegue según su proveedor (Vercel/Docker/etc). No se accedió a cuentas del equipo.
- Antes de cada publicación: `npm run build` en el frontend, `PYTHONPATH=backend python -m pytest -q` desde la raíz en Linux/macOS, o `cd backend; python -m pytest -q` en Windows (con el entorno de Python activo); comprobar ES, EN, `/pitch`, asistente, simulación y Telegram.

## Cómo integrar los próximos cambios de tus compañeros (Git)

1. Hacer una copia de respaldo o trabajar en una rama, por ejemplo `feature/bilingue-es-en`.
2. Agregar los archivos y cambios bilingües mediante un **merge** o revisión de diferencias, especialmente en `Navbar.tsx`, `app/page.tsx`, `app/pitch/page.tsx`, `ai_service.py` y `main.py`. Evitar reemplazar a ciegas archivos que hayan cambiado después de este ZIP.
3. Cuando otro integrante agregue un botón, etiqueta, gráfico o sección, envolver su texto con `t(...)` y añadir su traducción a `i18n/en.json`. Si es contenido del catálogo originalmente en inglés, añadir su equivalente español a `i18n/es.json`.
4. Confirmar que los cambios se ven en ES y EN, tanto en escritorio como en móvil. Verificar la consola del navegador y los endpoints de FastAPI.
5. Hacer un commit y desplegar el nuevo código en su hosting habitual; el servidor público **no se actualiza automáticamente** por cambiar el ZIP local.

## Estado de validación de esta entrega

- Sintaxis: 17 archivos TS/TSX procesados sin errores de parseo.
- Backend: 45 pruebas automáticas aprobadas, incluidas 3 pruebas nuevas de idioma.
- No se ejecutó `npm run build` ni un test visual de navegador en este entorno: faltaron dependencias npm completas para una compilación real.
- Se conservaron los cálculos y archivos de datos originales, salvo traducciones de interfaz y soporte de idioma en el asistente.
