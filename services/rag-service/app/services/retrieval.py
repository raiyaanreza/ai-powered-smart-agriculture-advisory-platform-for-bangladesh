"""
RAG Retrieval Service — Local Embeddings + TTL Query Cache
==========================================================
Uses local BAAI/bge-m3 (sentence-transformers) for query embedding.
Zero API calls. Query vectors cached for 1 hour.
"""
import logging
import os
from typing import List, Optional

from qdrant_client import QdrantClient
from qdrant_client.models import ScoredPoint

from app.services.embeddings import embed_query, get_query_cache_stats

logger = logging.getLogger(__name__)

QDRANT_URL      = os.getenv("QDRANT_URL", "http://localhost:6333")
COLLECTION_NAME = "agri_knowledge_base"


def _get_client() -> QdrantClient:
    return QdrantClient(
        url=QDRANT_URL,
        api_key=os.getenv("QDRANT_API_KEY"),
        timeout=30,
    )


def _collection_exists() -> bool:
    try:
        names = [c.name for c in _get_client().get_collections().collections]
        return COLLECTION_NAME in names
    except Exception:
        return False


def retrieve(query: str, top_k: int = 3, crop: Optional[str] = None) -> List[dict]:
    """
    Retrieve top-k semantically relevant chunks for a query.
    Uses local bge-m3 embedding (0 API calls) + TTL cache for repeated queries.

    Args:
        query:  Farmer's question.
        top_k:  Number of chunks to retrieve.
        crop:   Optional crop filter.

    Returns:
        List of result dicts with text, source, score, and metadata.
    """
    if not _collection_exists():
        logger.warning("Qdrant collection not found. Run /rag/ingest first.")
        return []

    try:
        # embed_query() uses TTL cache — same query = 0 compute after first call
        query_vector = embed_query(query)

        client = _get_client()
        res = client.query_points(
            collection_name=COLLECTION_NAME,
            query=query_vector,
            limit=top_k,
        )

        raw = [
            {
                "text": point.payload.get("text", point.payload.get("page_content", "")),
                "source": point.payload.get("source", "Unknown"),
                "crop": point.payload.get("crop", "Unknown"),
                "disease_pest_name": point.payload.get("disease_pest_name", "Unknown"),
                "publisher": point.payload.get("publisher", "Unknown"),
                "publication_year": point.payload.get("publication_year", "Unknown"),
                "doi": point.payload.get("doi", "Unknown"),
                "academic_citation": point.payload.get("academic_citation", "Unknown"),
                "score": float(point.score),
            }
            for point in res.points
        ]

        if crop:
            filtered = [r for r in raw if r["crop"].lower() == crop.lower()]
            if filtered:
                return filtered
            logger.info(f"Crop filter '{crop}' → 0 results, falling back to unfiltered.")

        return raw

    except Exception as e:
        logger.error(f"RAG retrieval failed: {e}")
        return []


def format_context_for_prompt(results: List[dict]) -> str:
    """Format retrieved chunks into a Gemini-ready context block."""
    if not results:
        return ""

    lines = ["### Official Agricultural Reference Context (BARI/BRRI Sources):"]
    for i, r in enumerate(results, 1):
        lines.append(f"\n[Source {i}: {r['source']}]")
        if r.get("academic_citation") and r["academic_citation"] != "Unknown":
            lines.append(f"Academic Citation: {r['academic_citation']}")
        if r.get("doi") and r["doi"] != "Unknown":
            lines.append(f"DOI: {r['doi']}")
        if r.get("publisher") and r["publisher"] != "Unknown":
            lines.append(f"Publisher: {r['publisher']}")
        if r.get("publication_year") and r["publication_year"] != "Unknown":
            lines.append(f"Year: {r['publication_year']}")
        lines.append(r["text"].strip())

    return "\n".join(lines)


# Re-export cache stats for /rag/status endpoint
def get_cache_stats() -> dict:
    return get_query_cache_stats()
