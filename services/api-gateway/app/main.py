"""API Gateway Service - Entry Point with Asynchronous Reverse Proxying"""

import os
import sys
import logging
import httpx
from fastapi import FastAPI, Request, Response, HTTPException
from fastapi.middleware.cors import CORSMiddleware

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="AgriVision API Gateway",
    description="API Gateway for AgriVision AI Agriculture Platform",
    version="0.1.0"
)

# Fail fast if shared secret is not configured
INTERNAL_SHARED_SECRET = os.environ.get("INTERNAL_SHARED_SECRET")
if not INTERNAL_SHARED_SECRET:
    raise RuntimeError(
        "INTERNAL_SHARED_SECRET environment variable is not set. "
        "This is required for inter-service authentication."
    )

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:3001").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SERVICES = {
    "advisory": "http://localhost:8001",
    "crop-routing": "http://localhost:8002",
    "agent-orchestrator": "http://localhost:8003",
    "auth": "http://localhost:8004",
    "notification": "http://localhost:8005",
    "analytics": "http://localhost:8006",
    "report": "http://localhost:8007",
    "rag": "http://localhost:8008",
}

GATEWAY_TIMEOUT = float(os.getenv("GATEWAY_TIMEOUT", "60.0"))

client = httpx.AsyncClient()

@app.on_event("shutdown")
async def shutdown_event():
    await client.aclose()

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "api-gateway"}

@app.get("/metrics")
async def metrics():
    """Prometheus-compatible metrics endpoint"""
    return Response(
        content=f'# HELP service_up Whether the service is up\n# TYPE service_up gauge\nservice_up{{service="api-gateway"}} 1\n',
        media_type="text/plain",
    )

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": "AgriVision API Gateway",
        "version": "0.1.0",
        "status": "operational"
    }

@app.api_route("/{service_name}/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"])
async def reverse_proxy(service_name: str, path: str, request: Request):
    """Generically proxy incoming gateway traffic to downstream services"""
    if service_name not in SERVICES:
        if service_name == "diagnose":
            target_url = f"{SERVICES['agent-orchestrator']}/diagnose"
            if path:
                target_url += f"/{path}"
        else:
            raise HTTPException(status_code=404, detail=f"Service '{service_name}' not found")
    else:
        target_url = f"{SERVICES[service_name]}/{path}"
    
    # Append query params if present
    query_params = str(request.url.query)
    if query_params:
        target_url += f"?{query_params}"
        
    # Read raw body
    body = await request.body()
    headers = dict(request.headers)
    
    # Remove host header to avoid routing loops/host header issues
    headers.pop("host", None)
    
    # Add internal authentication token
    headers["X-Internal-Token"] = INTERNAL_SHARED_SECRET
    
    try:
        response = await client.request(
            method=request.method,
            url=target_url,
            headers=headers,
            content=body,
            timeout=GATEWAY_TIMEOUT
        )
        return Response(
            content=response.content,
            status_code=response.status_code,
            headers=dict(response.headers)
        )
    except httpx.RequestError as exc:
        logger.error("Gateway proxy error to '%s': %s", service_name, exc)
        raise HTTPException(
            status_code=502,
            detail=f"Bad Gateway: Error communicating with downstream service '{service_name}'."
        )

@app.api_route("/diagnose", methods=["POST", "OPTIONS"])
async def direct_diagnose(request: Request):
    """Direct route for YOLO crop/disease diagnostics"""
    return await reverse_proxy("diagnose", "", request)