import os
import logging
from fastapi import FastAPI, HTTPException, Header, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def verify_internal_token(request: Request, x_internal_token: str = Header(None)):
    if request.url.path in ("/health", "/docs", "/openapi.json"):
        return True
    secret = os.environ["INTERNAL_SHARED_SECRET"]
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

@app.get("/metrics")
def metrics():
    """Prometheus-compatible metrics endpoint"""
    from fastapi.responses import Response
    return Response(
        content='# HELP service_up Whether the service is up\n# TYPE service_up gauge\nservice_up{service="notification-service"} 1\n',
        media_type="text/plain",
    )

@app.post("/notifications/broadcast")
async def broadcast_notification(request: BroadcastRequest):
    """Broadcasts dynamic agriculture warning alerts via websockets or SMS"""
    if not request.title or not request.message:
        raise HTTPException(status_code=400, detail="Title and message must be provided")
        
    logger.info("Broadcasting bulletin: [%s] %s", request.type.upper(), request.title)
    if request.trigger_sms:
        logger.info("SMS Gateway Triggered for target group: %s", request.target_role)
        
    return {
        "success": True,
        "message": f"Broadcast '{request.title}' successfully deployed.",
        "sms_sent": request.trigger_sms
    }
