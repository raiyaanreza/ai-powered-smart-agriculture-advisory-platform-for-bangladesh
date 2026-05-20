import os
import sys

# Set required env vars before importing the app
os.environ.setdefault("INTERNAL_SHARED_SECRET", "test-secret-token")
os.environ.setdefault("SUPABASE_JWT_SECRET", "test-jwt-secret")

# Insert service path to avoid conflicts in monorepo test collection
service_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if service_dir not in sys.path:
    sys.path.insert(0, service_dir)

from fastapi.testclient import TestClient
from jose import jwt
from app.main import app

client = TestClient(app)

INTERNAL_TOKEN = os.environ["INTERNAL_SHARED_SECRET"]
JWT_SECRET = os.environ["SUPABASE_JWT_SECRET"]
headers = {"X-Internal-Token": INTERNAL_TOKEN}

def _make_test_jwt(user_id: str = "test-user-123", email: str = "test@example.com", role: str = "authenticated"):
    """Create a test JWT signed with the test secret."""
    payload = {
        "sub": user_id,
        "email": email,
        "role": role,
        "exp": 9999999999,  # far future
        "iss": "supabase",
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")

def test_auth_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_auth_validation():
    token = _make_test_jwt()
    response = client.post("/auth/validate", json={"token": token}, headers=headers)
    assert response.status_code == 200
    assert response.json()["valid"] is True
    assert response.json()["user"]["id"] == "test-user-123"
    assert response.json()["user"]["email"] == "test@example.com"

def test_auth_validation_admin():
    token = _make_test_jwt(role="admin", email="admin@example.com")
    response = client.post("/auth/validate", json={"token": token}, headers=headers)
    assert response.status_code == 200
    assert response.json()["valid"] is True
    assert response.json()["user"]["role"] == "admin"

def test_auth_validation_invalid_token():
    response = client.post("/auth/validate", json={"token": "invalid-token"}, headers=headers)
    assert response.status_code == 401

def test_auth_validation_empty_token():
    response = client.post("/auth/validate", json={"token": ""}, headers=headers)
    assert response.status_code == 400
