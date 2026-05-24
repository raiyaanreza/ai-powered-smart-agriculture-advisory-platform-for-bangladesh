"""
RAG Retrieval Service
Semantic vector lookup using Qdrant + Gemini text-embedding-004.
Called by the advisory service before sending a prompt to Gemini.
"""
import os
import logging
from typing import List, Optional

from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_qdrant import QdrantVectorStore
from langchain_core.documents import Document
from qdrant_client import QdrantClient

logger = logging.getLogger(__name__)

QDRANT_URL = os.getenv("QDRANT_URL", "http://localhost:6333")
COLLECTION_NAME = "agri_knowledge_base"
EMBEDDING_MODEL = "models/gemini-embedding-2"


def _get_embeddings() -> GoogleGenerativeAIEmbeddings:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY not set")
    return GoogleGenerativeAIEmbeddings(
        model=EMBEDDING_MODEL,
        google_api_key=api_key,
    )


def _collection_exists() -> bool:
    try:
        qdrant_api_key = os.getenv("QDRANT_API_KEY")
        client = QdrantClient(url=QDRANT_URL, api_key=qdrant_api_key)
        existing = [c.name for c in client.get_collections().collections]
        return COLLECTION_NAME in existing
    except Exception:
        return False


def retrieve(query: str, top_k: int = 3, crop: Optional[str] = None) -> List[dict]:
    """
    Retrieve the top-k most semantically relevant document chunks for a query.
    Optionally filter by crop metadata.
    Returns a list of dicts: { "text": ..., "source": ..., "score": ... }
    """
    if not _collection_exists():
        logger.warning("Qdrant collection does not exist yet. Run ingestion first.")
        return []

    try:
        embeddings = _get_embeddings()
        qdrant_api_key = os.getenv("QDRANT_API_KEY")
        store = QdrantVectorStore.from_existing_collection(
            embedding=embeddings,
            collection_name=COLLECTION_NAME,
            url=QDRANT_URL,
            api_key=qdrant_api_key,
        )

        results_with_scores: List[tuple[Document, float]] = store.similarity_search_with_score(
            query, k=top_k
        )

        return [
            {
                "text": doc.page_content,
                "source": doc.metadata.get("source", "Unknown"),
                "crop": doc.metadata.get("crop", "Unknown"),
                "disease_pest_name": doc.metadata.get("disease_pest_name", "Unknown"),
                "publisher": doc.metadata.get("publisher", "Unknown"),
                "publication_year": doc.metadata.get("publication_year", "Unknown"),
                "doi": doc.metadata.get("doi", "Unknown"),
                "academic_citation": doc.metadata.get("academic_citation", "Unknown"),
                "score": float(score),
            }
            for doc, score in results_with_scores
        ]
    except Exception as e:
        logger.error(f"RAG retrieval failed: {e}")
        return []


def format_context_for_prompt(results: List[dict]) -> str:
    """
    Format retrieved results into a clean context block to inject into the Gemini prompt.
    """
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
