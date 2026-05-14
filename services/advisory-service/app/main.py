import os
import sys

# Add project root to path to access packages
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../.."))
if project_root not in sys.path:
    sys.path.append(project_root)

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.gemini_service import gemini_service

app = FastAPI(title="AgriVision Advisory Service")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, limit to frontend URL
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
