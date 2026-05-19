import os
import sys

# Add project root to path to access packages
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../.."))
if project_root not in sys.path:
    sys.path.append(project_root)

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.schemas.chat import ChatRequest, ChatResponse, CropAnalysisRequest, CropAnalysisResponse
from app.services.offline_chat_service import offline_chat_service

try:
    from app.services.gemini_service import gemini_service
except Exception as _gemini_err:
    print(f"[advisory-service] WARNING: Gemini unavailable — online chat disabled. ({_gemini_err})")
    gemini_service = None

app = FastAPI(title="AgriVision Advisory Service")


# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:3001").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "advisory-service"}

@app.post("/advisory/chat", response_model=ChatResponse)
async def chat_with_advisor(request: ChatRequest):
    if gemini_service is None:
        raise HTTPException(
            status_code=503,
            detail="অনলাইন অ্যাডভাইজরি সার্ভিস এই মুহূর্তে উপলব্ধ নয়। অফলাইন মোডের জন্য /advisory/chat/offline ব্যবহার করুন। (Online advisory unavailable — use /advisory/chat/offline instead.)"
        )
    try:
        response = await gemini_service.get_response(request.message, request.history, request.image_data)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/advisory/chat/offline", response_model=ChatResponse)
async def offline_chat(request: ChatRequest):
    """
    Keyword-matched, zero-network Bangla advisory.
    Uses the same ChatRequest / ChatResponse contract as /advisory/chat so the
    frontend can fall back to this endpoint transparently when Gemini is unreachable.
    image_data is accepted in the request body but ignored (offline engine is text-only).
    """
    return offline_chat_service.get_response(request.message)

@app.post("/advisory/crop-analysis", response_model=CropAnalysisResponse)
async def generate_analysis(request: CropAnalysisRequest):
    try:
        response = await gemini_service.generate_crop_analysis(
            request.crops, request.soil_type, request.district, request.season
        )
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
