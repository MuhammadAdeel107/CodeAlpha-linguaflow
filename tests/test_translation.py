import sys
from pathlib import Path

sys.path.insert(
    0,
    str(Path(__file__).resolve().parents[1])
)

from app import create_app


def test_health_endpoint():
    app = create_app()
    client = app.test_client()

    response = client.get("/api/health")

    assert response.status_code == 200

    data = response.get_json()

    assert data["status"] == "ok"
    assert data["service"] == "linguaflow"


def test_empty_translation():
    app = create_app()
    client = app.test_client()

    response = client.post(
        "/api/translate",
        json={
            "text": "",
            "source_language": "",
            "target_language": "ur",
        },
    )

    assert response.status_code == 400

    data = response.get_json()

    assert "error" in data


def test_invalid_target_language():
    app = create_app()
    client = app.test_client()

    response = client.post(
        "/api/translate",
        json={
            "text": "Hello",
            "source_language": "en",
            "target_language": "xyz",
        },
    )

    assert response.status_code == 400

    data = response.get_json()

    assert "error" in data