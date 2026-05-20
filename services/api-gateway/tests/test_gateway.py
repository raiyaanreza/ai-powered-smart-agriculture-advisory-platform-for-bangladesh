import os
import sys

# Set required env vars before importing the app
os.environ.setdefault("INTERNAL_SHARED_SECRET", "test-secret-token")

# Insert service path to avoid conflicts in monorepo test collection
service_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if service_dir not in sys.path:
    sys.path.insert(0, service_dir)

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_gateway_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["service"] == "AgriVision API Gateway"

def test_gateway_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"
