"""
RAG Service — FastAPI Application
Provides /rag/query (semantic retrieval) and /rag/ingest (document ingestion).
"""
import os
import logging
from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI, HTTPException, Header, Depends, Request, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional

from app.services.ingestion import run_ingestion
from app.services.retrieval import retrieve, format_context_for_prompt

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def verify_internal_token(request: Request, x_internal_token: str = Header(None)):
    if request.url.path in ("/health", "/docs", "/openapi.json", "/rag/ingest"):
        return True
    secret = os.environ["INTERNAL_SHARED_SECRET"]
    if not x_internal_token or x_internal_token != secret:
        raise HTTPException(status_code=403, detail="Forbidden: Invalid internal token")
    return True


app = FastAPI(
    title="AgriVision RAG Service",
    description="Semantic retrieval over BARI/BRRI agricultural knowledge base using Gemini embeddings + Qdrant.",
    version="1.0.0",
    dependencies=[Depends(verify_internal_token)],
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:3001").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Schemas ────────────────────────────────────────────────────────────────────

class QueryRequest(BaseModel):
    query: str = Field(..., min_length=3, description="Farmer's question or advisory query")
    crop: Optional[str] = Field(None, description="Crop name to optionally filter results")
    top_k: int = Field(3, ge=1, le=10, description="Number of context chunks to retrieve")
    include_formatted: bool = Field(True, description="Also return pre-formatted context string for prompt injection")


class QueryResult(BaseModel):
    text: str
    source: str
    score: float
    crop: Optional[str] = None
    disease_pest_name: Optional[str] = None
    publisher: Optional[str] = None
    publication_year: Optional[str] = None
    doi: Optional[str] = None
    academic_citation: Optional[str] = None


class QueryResponse(BaseModel):
    success: bool
    query: str
    results: list[QueryResult]
    formatted_context: Optional[str] = None
    collection_empty: bool = False


class IngestResponse(BaseModel):
    success: bool
    message: str
    details: Optional[dict] = None


# ── Endpoints ──────────────────────────────────────────────────────────────────

@app.get("/health")
def health():
    return {"status": "healthy", "service": "rag-service", "version": "1.0.0"}

@app.get("/metrics")
def metrics():
    """Prometheus-compatible metrics endpoint"""
    from fastapi.responses import Response
    return Response(
        content='# HELP service_up Whether the service is up\n# TYPE service_up gauge\nservice_up{service="rag-service"} 1\n',
        media_type="text/plain",
    )


@app.post("/rag/query", response_model=QueryResponse)
async def query_knowledge_base(req: QueryRequest):
    """
    Semantic vector search over the agricultural knowledge base.
    Returns relevant chunks from BARI/BRRI documents to ground the advisory LLM.
    """
    results = retrieve(query=req.query, top_k=req.top_k, crop=req.crop)

    if not results:
        return QueryResponse(
            success=True,
            query=req.query,
            results=[],
            formatted_context=None,
            collection_empty=True,
        )

    formatted = format_context_for_prompt(results) if req.include_formatted else None

    return QueryResponse(
        success=True,
        query=req.query,
        results=[QueryResult(**r) for r in results],
        formatted_context=formatted,
        collection_empty=False,
    )


@app.post("/rag/ingest", response_model=IngestResponse)
async def ingest_documents(background_tasks: BackgroundTasks):
    """
    Trigger ingestion of all documents under models/sources/ into Qdrant.
    This endpoint runs synchronously and returns when ingestion is complete.
    """
    try:
        result = run_ingestion()
        return IngestResponse(
            success=True,
            message=f"Ingestion complete. {result.get('chunks_indexed', 0)} chunks indexed.",
            details=result,
        )
    except Exception as e:
        logger.error(f"Ingestion failed: {e}")
        raise HTTPException(status_code=500, detail=f"Ingestion failed: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8008)
