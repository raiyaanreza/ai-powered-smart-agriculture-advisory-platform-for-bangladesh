import os
import sys

# Insert service path to avoid conflicts in monorepo test collection
service_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if service_dir not in sys.path:
    sys.path.insert(0, service_dir)

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_auth_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_auth_validation():
    response = client.post("/auth/validate", json={"token": "AgriVision@2026!"})
    assert response.status_code == 200
    assert response.json()["valid"] is True
    assert response.json()["user"]["role"] == "admin"
