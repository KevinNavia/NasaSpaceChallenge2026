import pytest
import os
import json
from unittest.mock import patch, AsyncMock
from fastapi.testclient import TestClient

import telegram_service
from main import app

client = TestClient(app)

@pytest.fixture(autouse=True)
def clean_subscribers_file(tmp_path):
    test_subs_file = str(tmp_path / "test_subscribers.json")
    with patch("telegram_service.SUBSCRIBERS_FILE", test_subs_file):
        yield

def test_add_and_get_subscribers():
    assert len(telegram_service.get_subscribers()) == 0
    added = telegram_service.add_subscriber(12345678, {"first_name": "Neil", "username": "armstrong"})
    assert added is True
    subs = telegram_service.get_subscribers()
    assert len(subs) == 1
    assert subs[0]["chat_id"] == 12345678
    assert subs[0]["first_name"] == "Neil"

    # Re-adding updates, does not duplicate
    added2 = telegram_service.add_subscriber(12345678, {"first_name": "Neil A."})
    assert added2 is False
    assert len(telegram_service.get_subscribers()) == 1

def test_telegram_main_keyboard():
    kb = telegram_service.get_main_keyboard()
    assert "inline_keyboard" in kb
    buttons = [btn for row in kb["inline_keyboard"] for btn in row]
    callbacks = [btn.get("callback_data") for btn in buttons if "callback_data" in btn]
    assert "cmd_telemetry" in callbacks
    assert "cmd_alert" in callbacks
    assert "cmd_sim_nomex" in callbacks
    assert "cmd_psi" in callbacks

import asyncio

def test_handle_start_update():
    async def _run():
        update = {
            "message": {
                "chat": {"id": 998877},
                "text": "/start",
                "from": {"first_name": "Buzz", "username": "aldrin"},
                "date": 1700000000
            }
        }
        with patch("telegram_service.send_telegram_message", new_callable=AsyncMock) as mock_send:
            mock_send.return_value = True
            res = await telegram_service.handle_update(update)
            assert res["status"] == "ok"
            assert res["action"] == "welcome_sent"
            mock_send.assert_called_once()
            args = mock_send.call_args[0]
            assert args[0] == 998877
            assert "STELLARAPP" in args[1]
            assert "Buzz" in args[1]
    asyncio.run(_run())

def test_handle_callback_telemetry():
    async def _run():
        update = {
            "callback_query": {
                "id": "query_123",
                "data": "cmd_telemetry",
                "message": {"chat": {"id": 998877}},
                "from": {"first_name": "Buzz"}
            }
        }
        with patch("telegram_service.answer_callback_query", new_callable=AsyncMock) as mock_answer, \
             patch("telegram_service.send_telegram_message", new_callable=AsyncMock) as mock_send:
            mock_answer.return_value = None
            mock_send.return_value = True
            res = await telegram_service.handle_update(update)
            assert res["action"] == "telemetry_sent"
            mock_send.assert_called_once()
            text = mock_send.call_args[0][1]
            assert "Rover Lunar" in text
            assert "Kalman" in text
    asyncio.run(_run())

def test_broadcast_alert():
    async def _run():
        telegram_service.add_subscriber(111, {"first_name": "User1"})
        telegram_service.add_subscriber(222, {"first_name": "User2"})

        with patch("telegram_service.send_telegram_message", new_callable=AsyncMock) as mock_send:
            mock_send.return_value = True
            count = await telegram_service.broadcast_alert(
                title="Incendio en Módulo de Servicio",
                message="Despresurización detectada",
                severity="CRITICAL",
                details={"O2": "32%", "CO": "120 ppm"}
            )
            assert count == 2
            assert mock_send.call_count == 2
    asyncio.run(_run())

def test_api_telegram_status_endpoint():
    resp = client.get("/api/telegram/status")
    assert resp.status_code == 200
    data = resp.json()
    assert data["bot_username"] == "Stellar_App_bot"
    assert "https://t.me/Stellar_App_bot" in data["bot_link"]
    assert "subscribers_count" in data

def test_api_telegram_broadcast_endpoint():
    payload = {
        "title": "Prueba Auditorio",
        "message": "Mensaje de prueba para evaluación",
        "severity": "WARNING"
    }
    with patch("telegram_service.broadcast_alert", new_callable=AsyncMock) as mock_bcast:
        mock_bcast.return_value = 5
        resp = client.post("/api/telegram/broadcast", json=payload)
        assert resp.status_code == 200
        assert resp.json()["status"] == "success"
        assert resp.json()["recipients_sent"] == 5
