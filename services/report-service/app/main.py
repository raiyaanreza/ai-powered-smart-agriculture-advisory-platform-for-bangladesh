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

app = FastAPI(title="report-service", version="0.1.0", dependencies=[Depends(verify_internal_token)])

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:3001").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ReportRequest(BaseModel):
    farmer_id: str
    farmer_name: str
    diagnoses_count: int
    recommendations: str

@app.get("/health")
def health():
    return {"status": "healthy", "service": "report-service"}

@app.post("/reports/generate")
async def generate_report(request: ReportRequest):
    """Generates expert advisory reports in PDF schema"""
    if not request.farmer_id or not request.farmer_name:
        raise HTTPException(status_code=400, detail="farmer_id and farmer_name are required")
        
    print(f"Generating high-fidelity PDF report for Farmer: {request.farmer_name} (ID: {request.farmer_id})")
    
    # Mock dynamic report creation
    return {
        "success": True,
        "report_id": f"REP-2026-{request.farmer_id[:4].upper()}",
        "url": f"http://localhost:8007/static/reports/REP-{request.farmer_id}.pdf",
        "metadata": {
            "farmer_name": request.farmer_name,
            "total_diagnoses": request.diagnoses_count,
            "status": "Ready"
        }
    }
