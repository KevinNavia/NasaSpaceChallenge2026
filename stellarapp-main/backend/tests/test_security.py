import pytest
from fastapi.testclient import TestClient

import telegram_service
from main import app, ai_service

client = TestClient(app)


def test_subscribers_not_exposed():
    r = client.get("/api/telegram/status")
    assert r.status_code == 200
    body = r.json()
    assert "subscribers" not in body
    assert "subscribers_count" in body


def test_hardware_post_requires_key_when_configured(monkeypatch):
    monkeypatch.setenv("STELLAR_API_KEY", "secreto-test")
    payload = {"device": "pico", "scenario_id": "rover"}
    assert client.post("/api/telemetry/hardware", json=payload).status_code == 401
    assert client.post("/api/telemetry/hardware", json=payload, headers={"X-API-Key": "mala"}).status_code == 401
    ok = client.post("/api/telemetry/hardware", json=payload, headers={"X-API-Key": "secreto-test"})
    assert ok.status_code == 200


def test_set_webhook_requires_key_when_configured(monkeypatch):
    monkeypatch.setenv("STELLAR_API_KEY", "secreto-test")
    assert client.post("/api/telegram/set-webhook").status_code == 401


def test_webhook_secret_enforced(monkeypatch):
    monkeypatch.setattr(telegram_service, "WEBHOOK_SECRET", "abc123")
    update = {"update_id": 1}
    assert client.post("/api/telegram/webhook", json=update).status_code == 403
    r = client.post("/api/telegram/webhook", json=update, headers={"X-Telegram-Bot-Api-Secret-Token": "abc123"})
    assert r.status_code == 200


def test_cors_blocks_unknown_origin():
    r = client.options(
        "/api/experiments",
        headers={"Origin": "https://evil.example", "Access-Control-Request-Method": "GET"},
    )
    assert "access-control-allow-origin" not in {k.lower() for k in r.headers}


def test_rate_limit_on_ai(monkeypatch):
    monkeypatch.setenv("RATE_LIMIT_DISABLED", "0")
    from main import ai_limiter
    ai_limiter._hits.clear()
    codes = [client.post("/api/ai/ask", json={"query": "Receta de tacos"}).status_code for _ in range(22)]
    assert 429 in codes
    ai_limiter._hits.clear()


def test_telegram_html_is_escaped(monkeypatch):
    import asyncio
    sent = []

    async def fake_send(chat_id, text, **kw):
        sent.append(text)
        return True

    monkeypatch.setattr(telegram_service, "_load_subscribers", lambda: [{"chat_id": 1}])
    monkeypatch.setattr(telegram_service, "send_telegram_message", fake_send)
    asyncio.run(telegram_service.broadcast_alert("<b>x</b>", "<a href='evil'>click</a>", "CRITICAL", {"<k>": "<v>"}))
    assert "<a href" not in sent[0]
    assert "&lt;a href" in sent[0]


@pytest.mark.parametrize("query", [
    "What is the mission statement of my company?",   # contiene 'iss' pero no es del dominio
    "Receta de tacos y cocinar",
    "Quiero ir al circo",
    "What is the best pasta recipe?",
])
def test_guardrail_no_false_positives(query):
    assert not ai_service._is_query_in_domain(query)


@pytest.mark.parametrize("query", [
    "¿Qué es la combustión en microgravedad?",
    "Peligros de la ISS",
    "Filtro de Kalman para CO",
    "Atmósfera Artemis al 26% de O2",
    "Misión SAME y humo",
    "How does oxygen affect flame spread in microgravity?",
    "Is burning plastic dangerous on a spacecraft?",
])
def test_guardrail_true_positives(query):
    assert ai_service._is_query_in_domain(query)
