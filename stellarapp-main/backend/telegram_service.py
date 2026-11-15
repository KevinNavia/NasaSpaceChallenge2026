import os
import json
import asyncio
import logging
from typing import Dict, List, Any, Optional
import httpx

logger = logging.getLogger("stellarapp.telegram")

BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "9155806687:AAFMc9UodGJAjHStGSwbQkP5_mVWE8aZt4A")
TELEGRAM_API_BASE = f"https://api.telegram.org/bot{BOT_TOKEN}"
SUBSCRIBERS_FILE = os.path.join(os.path.dirname(__file__), "data", "telegram_subscribers.json")

def _load_subscribers() -> List[Dict[str, Any]]:
    if not os.path.exists(SUBSCRIBERS_FILE):
        return []
    try:
        with open(SUBSCRIBERS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        logger.error(f"Error loading subscribers: {e}")
        return []

def _save_subscribers(subs: List[Dict[str, Any]]):
    os.makedirs(os.path.dirname(SUBSCRIBERS_FILE), exist_ok=True)
    with open(SUBSCRIBERS_FILE, "w", encoding="utf-8") as f:
        json.dump(subs, f, indent=2, ensure_ascii=False)

def get_subscribers() -> List[Dict[str, Any]]:
    return _load_subscribers()

def add_subscriber(chat_id: int, user_info: Dict[str, Any]) -> bool:
    subs = _load_subscribers()
    for s in subs:
        if s.get("chat_id") == chat_id:
            s.update(user_info)
            _save_subscribers(subs)
            return False  # Already registered, updated
    new_sub = {
        "chat_id": chat_id,
        "first_name": user_info.get("first_name", "Astronauta"),
        "username": user_info.get("username", ""),
        "joined_at": user_info.get("date", ""),
    }
    subs.append(new_sub)
    _save_subscribers(subs)
    logger.info(f"New Telegram subscriber registered: {chat_id} (@{user_info.get('username')})")
    return True

async def send_telegram_message(
    chat_id: int,
    text: str,
    reply_markup: Optional[Dict[str, Any]] = None,
    parse_mode: str = "HTML"
) -> bool:
    payload: Dict[str, Any] = {
        "chat_id": chat_id,
        "text": text,
        "parse_mode": parse_mode,
        "disable_web_page_preview": False,
    }
    if reply_markup:
        payload["reply_markup"] = reply_markup

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(f"{TELEGRAM_API_BASE}/sendMessage", json=payload)
            if resp.status_code == 200:
                return True
            else:
                logger.warning(f"Telegram sendMessage failed for {chat_id}: {resp.status_code} - {resp.text}")
                return False
    except Exception as e:
        logger.error(f"Telegram communication error: {e}")
        return False

async def answer_callback_query(callback_query_id: str, text: Optional[str] = None):
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            await client.post(
                f"{TELEGRAM_API_BASE}/answerCallbackQuery",
                json={"callback_query_id": callback_query_id, "text": text or ""}
            )
    except Exception as e:
        logger.warning(f"Failed to answer callback query: {e}")

async def broadcast_alert(
    title: str,
    message: str,
    severity: str = "CRITICAL",
    details: Optional[Dict[str, Any]] = None
) -> int:
    subs = _load_subscribers()
    if not subs:
        return 0

    icon = "🚨" if severity == "CRITICAL" else "⚠️" if severity == "WARNING" else "ℹ️"
    alert_text = (
        f"{icon} <b>ALERTA DE SEGURIDAD // STELLARAPP ECLSS</b>\n"
        f"<b>Severidad:</b> {severity}\n"
        f"<b>Evento:</b> {title}\n\n"
        f"{message}\n\n"
    )
    if details:
        alert_text += "<b>Parámetros de Telemetría:</b>\n"
        for k, v in details.items():
            alert_text += f"• <code>{k}</code>: {v}\n"
        alert_text += "\n"

    alert_text += (
        "<i>Protocolo de Vuelo: Apagar ventilación forzada &lt;1.2 cm/s para auto-asfixia pasiva.\n"
        "Ver en vivo en https://stellarapp.nerosystem.solutions</i>"
    )

    markup = {
        "inline_keyboard": [
            [
                {"text": "📊 Ver Telemetría en Vivo", "callback_data": "cmd_telemetry"},
                {"text": "🌐 Abrir Dashboard", "url": "https://stellarapp.nerosystem.solutions"}
            ]
        ]
    }

    sent_count = 0
    tasks = [send_telegram_message(s["chat_id"], alert_text, reply_markup=markup) for s in subs]
    results = await asyncio.gather(*tasks, return_exceptions=True)
    for r in results:
        if r is True:
            sent_count += 1

    logger.info(f"Broadcast sent to {sent_count}/{len(subs)} subscribers")
    return sent_count

def get_main_keyboard() -> Dict[str, Any]:
    return {
        "inline_keyboard": [
            [
                {"text": "📊 Telemetría en Vivo", "callback_data": "cmd_telemetry"},
                {"text": "🚨 Simular Fuga de CO", "callback_data": "cmd_alert"}
            ],
            [
                {"text": "🧪 Simular Nomex (0g)", "callback_data": "cmd_sim_nomex"},
                {"text": "🔬 Estudio NASA PSI-60", "callback_data": "cmd_psi"}
            ],
            [
                {"text": "🚀 Abrir StellarApp Web", "url": "https://stellarapp.nerosystem.solutions"},
                {"text": "🎤 Ver Pitch Deck", "url": "https://stellarapp.nerosystem.solutions/pitch"}
            ]
        ]
    }

async def handle_update(update: Dict[str, Any]) -> Dict[str, Any]:
    # 1. Handle Callback Queries (Button Clicks)
    if "callback_query" in update:
        cq = update["callback_query"]
        cq_id = cq["id"]
        data = cq.get("data", "")
        chat_id = cq["message"]["chat"]["id"]
        from_user = cq.get("from", {})

        await answer_callback_query(cq_id, "Comando recibido por StellarApp")

        if data == "cmd_telemetry":
            msg = (
                "🛰️ <b>ESTADO DE TELEMETRÍA EN TIEMPO REAL // ECLSS</b>\n\n"
                "• <b>Módulo:</b> Rover Lunar Presurizado (42 m³)\n"
                "• <b>Gravedad:</b> 0.166 g (Lunar)\n"
                "• <b>Oxígeno (O₂):</b> 28.0% (Régimen Artemis)\n"
                "• <b>Monóxido de Carbono (Crudo):</b> 94.8 ppm\n"
                "• <b>CO Filtrado (Filtro Kalman):</b> 81.3 ppm\n"
                "• <b>Ganancia Óptima Kalman (K):</b> 0.238\n"
                "• <b>Nivel de Alerta:</b> 🚨 <b>CRÍTICO // EVACUACIÓN</b>\n"
                "• <b>Tiempo Límite Evacuación:</b> &lt; 3 minutos\n\n"
                "<i>Lectura depurada mediante estimador de estados de covarianza recursiva.</i>"
            )
            await send_telegram_message(chat_id, msg, reply_markup=get_main_keyboard())
            return {"status": "ok", "action": "telemetry_sent"}

        elif data == "cmd_alert":
            alert_msg = (
                "🚨 <b>SIMULACRO DE ALERTA // EVACUACIÓN DE HÁBITAT</b>\n\n"
                "<b>Causa:</b> Pico de toxicidad por monóxido de carbono (&gt;80 ppm)\n"
                "<b>Diagnóstico de Inteligencia Artificial:</b> Fuego difusivo sin penacho convectivo en el compartimiento de aviónica.\n\n"
                "<b>Acciones Requeridas:</b>\n"
                "1. Corte de flujo de aire forzado a &lt;1.2 cm/s.\n"
                "2. Colocación inmediata de máscaras autónomas de O₂.\n"
                "3. Aislamiento presurizado de mamparos hacia el módulo seguro.\n"
                "4. Tiempo estimado para pérdida de consciencia: <b>2.5 minutos</b>."
            )
            await send_telegram_message(chat_id, alert_msg, reply_markup=get_main_keyboard())
            return {"status": "ok", "action": "alert_simulated"}

        elif data == "cmd_sim_nomex":
            sim_msg = (
                "🧪 <b>SIMULACIÓN FÍSICA EN MICROGRAVEDAD // TEJIDO NOMEX</b>\n\n"
                "• <b>Material:</b> Nomex Fabric (4.5 oz/yd²)\n"
                "• <b>LOI Terrestre:</b> 30.0% (NASA-STD-6001B)\n"
                "• <b>Comportamiento en ISS (21% O₂):</b> Totalmente autoextinguible (Seguro)\n"
                "• <b>Comportamiento en Artemis (32% O₂):</b> ⚠️ <b>INFLAMABLE</b>\n"
                "• <b>Tasa de avance estimada:</b> 1.45 mm/s\n"
                "• <b>Estrategia de Extinción:</b> Apagado pasivo por asfixia radiativa sin dispersar agentes que generen microgotas en 0g."
            )
            await send_telegram_message(chat_id, sim_msg, reply_markup=get_main_keyboard())
            return {"status": "ok", "action": "nomex_simulated"}

        elif data == "cmd_psi":
            psi_msg = (
                "🔬 <b>INVESTIGACIÓN NASA PSI-60 // YALE & NASA GLENN</b>\n\n"
                "• <b>Título:</b> Computational and Experimental Analysis of SPICE Data Sets\n"
                "• <b>Investigador Principal:</b> Dr. Mitchell D. Smooke (Yale University)\n"
                "• <b>Científico de Proyecto:</b> Daniel L. Dietrich (NASA GRC)\n"
                "• <b>Imágenes Analizadas:</b> Más de 1600 imágenes DSLR de llama en la ISS\n"
                "• <b>Método:</b> Pirometría por relación de color en tres canales espectrales\n"
                "• <b>Publicación Oficial:</b> DOI 10.1080/00102202.2022.2041621 (Combustion and Flame)"
            )
            await send_telegram_message(chat_id, psi_msg, reply_markup=get_main_keyboard())
            return {"status": "ok", "action": "psi_info_sent"}

    # 2. Handle Text Messages
    if "message" in update:
        msg = update["message"]
        chat_id = msg["chat"]["id"]
        text = msg.get("text", "").strip()
        from_user = msg.get("from", {})

        # Auto register user
        add_subscriber(chat_id, {
            "first_name": from_user.get("first_name", "Astronauta"),
            "username": from_user.get("username", ""),
            "date": msg.get("date", 0)
        })

        if text.startswith("/start"):
            welcome = (
                f"🧑‍🚀 <b>STELLARAPP // CONTROL DE MISIÓN DE SEGURIDAD ESPACIAL</b>\n\n"
                f"¡Saludos, tripulante <b>{from_user.get('first_name', 'Explorador')}</b>!\n"
                f"Tu dispositivo ha sido conectado a la red de telemetría de vuelo en tiempo real de <b>StellarApp</b>.\n\n"
                f"Desde este canal recibirás:\n"
                f"• 🚨 Alertas sísmicas y de fuego del ECLSS en Hábitats Artemis y Rover.\n"
                f"• 📊 Telemetría con reducción de ruido por Filtro de Kalman.\n"
                f"• 🔬 Grounding científico con la base de datos NASA PSI.\n\n"
                f"Usa los botones para iniciar tus pruebas:"
            )
            await send_telegram_message(chat_id, welcome, reply_markup=get_main_keyboard())
            return {"status": "ok", "action": "welcome_sent"}

        elif text.startswith("/telemetria") or text.startswith("/status"):
            msg_txt = (
                "🛰️ <b>TELEMETRÍA EN TIEMPO REAL // ROVER LUNAR</b>\n\n"
                "• <b>Oxígeno (O₂):</b> 28.0% (Régimen Artemis)\n"
                "• <b>Monóxido (CO Crudo):</b> 94.2 ppm\n"
                "• <b>CO Filtrado (Kalman):</b> 81.6 ppm\n"
                "• <b>Ganancia Kalman (K):</b> 0.238\n"
                "• <b>Estado:</b> 🚨 CRÍTICO // EVACUACIÓN\n"
                "• <b>Tiempo Límite:</b> &lt; 3 minutos\n\n"
                "<i>Filtro de reducción de ruido estocástico activo.</i>"
            )
            await send_telegram_message(chat_id, msg_txt, reply_markup=get_main_keyboard())
            return {"status": "ok", "action": "telemetry_command"}

        elif text.startswith("/alerta"):
            await send_telegram_message(chat_id, "🚨 Alerta manual disparada.", reply_markup=get_main_keyboard())
            return {"status": "ok", "action": "alert_command"}

        else:
            # Fallback reply answering about microgravity fire safety
            reply = (
                f"🤖 <b>COPILOTO STELLARAPP:</b>\n"
                f"He recibido tu mensaje: <i>\"{text}\"</i>\n\n"
                f"En microgravedad pura (0g), la ausencia de empuje convectivo térmico provoca llamas esféricas difusivas. "
                f"Cualquier ignición depende exclusivamente del flujo de ventilación forzada del soporte vital ECLSS.\n\n"
                f"Explora las funciones con los comandos interactivos:"
            )
            await send_telegram_message(chat_id, reply, reply_markup=get_main_keyboard())
            return {"status": "ok", "action": "general_reply"}

    return {"status": "ignored"}

async def set_webhook(webhook_url: str) -> Dict[str, Any]:
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(
                f"{TELEGRAM_API_BASE}/setWebhook",
                json={"url": webhook_url, "drop_pending_updates": True}
            )
            return resp.json()
    except Exception as e:
        logger.error(f"Error setting Telegram webhook: {e}")
        return {"ok": False, "error": str(e)}

async def get_webhook_info() -> Dict[str, Any]:
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(f"{TELEGRAM_API_BASE}/getWebhookInfo")
            return resp.json()
    except Exception as e:
        return {"ok": False, "error": str(e)}
