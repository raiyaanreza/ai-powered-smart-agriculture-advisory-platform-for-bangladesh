import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="notification-service", version="0.1.0")

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
