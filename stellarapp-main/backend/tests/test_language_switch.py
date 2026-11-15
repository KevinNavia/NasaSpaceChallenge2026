"""Checks for bilingual chat request compatibility without any external API calls."""
import pytest
from pathlib import Path
from fastapi.testclient import TestClient
from main import app, ai_service


@pytest.mark.anyio
async def test_assistant_supports_english_offline(monkeypatch):
    monkeypatch.setattr(ai_service, "ollama_host", "")
    monkeypatch.setattr(ai_service, "api_key", "")
    response = await ai_service.ask_safety_assistant("How does oxygen affect flame spread in microgravity?", language="en")
    assert response["model"] == "StellarApp-English-Demo-Fallback"
    assert "microgravity" in response["answer"].lower()
    assert response["grounded"] is False


def test_api_language_english_guardrails():
    client = TestClient(app)
    response = client.post("/api/ai/ask", json={"query": "What is the best pasta recipe?", "language": "en"})
    assert response.status_code == 200
    assert "microgravity" in response.json()["answer"].lower()


def test_api_invalid_language_rejected():
    client = TestClient(app)
    response = client.post("/api/ai/ask", json={"query": "microgravity fire", "language": "xx"})
    assert response.status_code == 422
