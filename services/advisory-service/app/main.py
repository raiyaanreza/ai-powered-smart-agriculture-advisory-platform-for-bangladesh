import os
import sys

# Add project root to path to access packages
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../.."))
if project_root not in sys.path:
    sys.path.append(project_root)

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.schemas.chat import ChatRequest, ChatResponse, CropAnalysisRequest, CropAnalysisResponse
from app.services.gemini_service import gemini_service

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
    try:
        response = await gemini_service.get_response(request.message, request.history, request.image_data)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

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
