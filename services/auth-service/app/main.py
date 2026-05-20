import os
from typing import Optional
from fastapi import FastAPI, Request, HTTPException, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from jose import JWTError, jwt
from datetime import datetime, timezone

# Supabase JWT secret - required for token verification
SUPABASE_JWT_SECRET = os.environ.get("SUPABASE_JWT_SECRET", "")

async def verify_internal_token(request: Request, x_internal_token: str = Header(None)):
    if request.url.path in ("/health", "/docs", "/openapi.json"):
        return True
    secret = os.environ["INTERNAL_SHARED_SECRET"]
    if not x_internal_token or x_internal_token != secret:
        raise HTTPException(status_code=403, detail="Forbidden: Invalid internal token")
    return True

app = FastAPI(title="auth-service", version="0.1.0", dependencies=[Depends(verify_internal_token)])

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:3001").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TokenValidationRequest(BaseModel):
    token: str

class UserInfo(BaseModel):
    id: str
    email: str
    role: str
    is_verified: bool

class TokenValidationResponse(BaseModel):
    valid: bool
    user: Optional[UserInfo] = None

def _extract_user_from_jwt(token: str) -> dict:
    """Decode and verify a Supabase JWT, returning user claims."""
    if not SUPABASE_JWT_SECRET:
        raise HTTPException(
            status_code=500,
            detail="SUPABASE_JWT_SECRET is not configured"
        )

    try:
        payload = jwt.decode(
            token,
            SUPABASE_JWT_SECRET,
            algorithms=["HS256"],
            options={"verify_exp": True},
        )
    except JWTError as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Token missing 'sub' claim")

    email = payload.get("email", "")
    role = payload.get("role", "farmer")
    # Supabase sets role to "authenticated" for logged-in users
    if role == "authenticated":
        role = "farmer"

    return {
        "id": user_id,
        "email": email,
        "role": role,
        "is_verified": True,
    }

@app.get("/health")
def health():
    return {"status": "healthy", "service": "auth-service"}

@app.get("/metrics")
def metrics():
    """Prometheus-compatible metrics endpoint"""
    from fastapi.responses import Response
    return Response(
        content='# HELP service_up Whether the service is up\n# TYPE service_up gauge\nservice_up{service="auth-service"} 1\n',
        media_type="text/plain",
    )

@app.post("/auth/validate", response_model=TokenValidationResponse)
async def validate_token(request: TokenValidationRequest):
    """Validates a Supabase JWT and returns user info."""
    token = request.token.strip()
    if not token:
        raise HTTPException(status_code=400, detail="Token cannot be empty")

    # Strip Bearer prefix if present
    if token.startswith("Bearer "):
        token = token.split(" ", 1)[1]

    user = _extract_user_from_jwt(token)
    return TokenValidationResponse(valid=True, user=UserInfo(**user))

@app.get("/auth/userinfo")
async def user_info(authorization: Optional[str] = Header(None)):
    """Returns current user profile from the Authorization header JWT."""
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing Authorization Header")

    token = authorization.strip()
    if token.startswith("Bearer "):
        token = token.split(" ", 1)[1]

    user = _extract_user_from_jwt(token)
    return user
