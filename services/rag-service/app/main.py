import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="rag-service", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:3001").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    query: str
    crop: str = "General"
    top_k: int = 3

class UpsertRequest(BaseModel):
    document_id: str
    text: str
    metadata: dict = {}

@app.get("/health")
def health():
    return {"status": "healthy", "service": "rag-service"}

@app.post("/rag/query")
async def query_knowledge_base(request: QueryRequest):
    """Semantic vector lookup for specialized plant disease management advice"""
    if not request.query:
        raise HTTPException(status_code=400, detail="Query cannot be empty")
        
    print(f"Executing RAG query: '{request.query}' on crop channel: {request.crop}")
    
    # Mock vector database matches
    return {
        "success": True,
        "results": [
            {
                "score": 0.892,
                "text": f"For {request.crop} blight management, utilize copper oxychloride or common chemical applications early in the morning when dew is light.",
                "source": "BARI Agriculture Extension Handbook 2025"
            },
            {
                "score": 0.764,
                "text": f"Organic prevention for crop blight includes crop rotation and balanced application of urea fertilizers.",
                "source": "BRRI Rice Disease Bulletin #4"
            }
        ]
    }

@app.post("/rag/upsert")
async def upsert_document(request: UpsertRequest):
    """Indexes agriculture training texts into the vector database"""
    if not request.document_id or not request.text:
        raise HTTPException(status_code=400, detail="document_id and text must be supplied")
        
    print(f"Upserting document [{request.document_id}] to vector index.")
    return {"success": True, "indexed_id": request.document_id}
