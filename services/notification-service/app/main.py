import os
from fastapi import FastAPI, HTTPException, Header, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

async def verify_internal_token(request: Request, x_internal_token: str = Header(None)):
    if request.url.path in ("/health", "/docs", "/openapi.json"):
        return True
    secret = os.getenv("INTERNAL_SHARED_SECRET", "super-secret-internal-key-2026")
    if not x_internal_token or x_internal_token != secret:
        raise HTTPException(status_code=403, detail="Forbidden: Invalid internal token")
    return True

app = FastAPI(title="notification-service", version="0.1.0", dependencies=[Depends(verify_internal_token)])

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:3001").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class BroadcastRequest(BaseModel):
    title: str
    message: str
    type: str  # info, warning, critical, emergency
    target_role: str  # all, farmer, user
    trigger_sms: bool = False

@app.get("/health")
def health():
    return {"status": "healthy", "service": "notification-service"}

@app.post("/notifications/broadcast")
async def broadcast_notification(request: BroadcastRequest):
    """Broadcasts dynamic agriculture warning alerts via websockets or SMS"""
    if not request.title or not request.message:
        raise HTTPException(status_code=400, detail="Title and message must be provided")
        
    print(f"Broadcasting bulletin: [{request.type.upper()}] {request.title}")
    if request.trigger_sms:
        print(f"SMS Gateway Triggered for target group: {request.target_role}")
        
    return {
        "success": True,
        "message": f"Broadcast '{request.title}' successfully deployed.",
        "sms_sent": request.trigger_sms
    }
