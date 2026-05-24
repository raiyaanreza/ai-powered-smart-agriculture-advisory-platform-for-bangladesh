"""
Local Embedding Provider — BAAI/bge-m3 via sentence-transformers
================================================================
THE INDUSTRY STANDARD PERMANENT SOLUTION:

Instead of calling an external API (Gemini, HF Inference, OpenAI) for every
embedding, we download the model ONCE and run it locally on CPU/GPU.

Benefits:
  ✅ Zero API cost — forever, no rate limits, no quotas
  ✅ Native Bengali (Bangla) support in BAAI/bge-m3
  ✅ Pure CPU inference (~80-150ms per batch on modern hardware)
  ✅ Unlimited throughput — scales with your server, not an API tier
  ✅ Works offline / air-gapped
  ✅ Model cached in ~/.cache/huggingface/ after first download (~570MB)

Model choices (in order of recommendation):
  1. BAAI/bge-m3               — Best multilingual, 1024-dim, ~570MB
  2. intfloat/multilingual-e5-large — Good multilingual, 1024-dim, ~560MB
  3. sentence-transformers/paraphrase-multilingual-mpnet-base-v2 — Fast, 768-dim

Usage:
  from app.services.embeddings import get_local_embedder, embed_texts, embed_query

  embedder = get_local_embedder()               # singleton, loaded once
  vectors  = embed_texts(["text1", "text2"])    # batch embed documents
  vector   = embed_query("rice blast disease?") # single query embed (cached)
"""
import logging
import os

# Redirect Hugging Face cache to the E drive workspace directory to avoid C drive space limits
os.environ["HF_HOME"] = "E:/agri-ai-platform/.cache/huggingface"

from typing import List, Optional

from cachetools import TTLCache

logger = logging.getLogger(__name__)

# ── Config ─────────────────────────────────────────────────────────────────────
# Override via env var to switch models without code changes
LOCAL_EMBEDDING_MODEL = os.getenv(
    "LOCAL_EMBEDDING_MODEL",
    "intfloat/multilingual-e5-small",            # Best multilingual model with native Bengali support
)
EMBEDDING_DIMENSIONS = {
    "intfloat/multilingual-e5-small": 384,
    "BAAI/bge-m3": 1024,
    "intfloat/multilingual-e5-large": 1024,
    "sentence-transformers/paraphrase-multilingual-mpnet-base-v2": 768,
}

# HF token for downloading gated models (not required for bge-m3 which is public)
HF_API_KEY = os.getenv("HF_API_KEY", "").strip()

# ── Singleton Model Instance ───────────────────────────────────────────────────
_model = None


def get_local_embedder():
    """
    Load the sentence-transformer model once and cache as a module-level singleton.
    Subsequent calls return the same instance with zero reload cost.
    """
    global _model
    if _model is None:
        try:
            from sentence_transformers import SentenceTransformer
        except ImportError:
            raise RuntimeError(
                "sentence-transformers not installed. "
                "Run: pip install sentence-transformers"
            )

        import torch
        # Avoid thread contention on CPU by limiting threads (usually 4 is optimal)
        torch.set_num_threads(4)
        logger.info(f"Loading local embedding model: {LOCAL_EMBEDDING_MODEL} (Threads: 4)")
        logger.info("(First run downloads model — subsequent runs load from cache)")

        kwargs = {}
        if HF_API_KEY:
            kwargs["token"] = HF_API_KEY

        _model = SentenceTransformer(LOCAL_EMBEDDING_MODEL, **kwargs)
        # get_embedding_dimension() is the current API (get_sentence_embedding_dimension deprecated)
        dim = getattr(_model, "get_embedding_dimension", _model.get_sentence_embedding_dimension)()
        logger.info(f"✅ Model loaded. Embedding dimensions: {dim}")

    return _model


def get_embedding_dim() -> int:
    """Return the embedding dimension for the configured model."""
    return EMBEDDING_DIMENSIONS.get(LOCAL_EMBEDDING_MODEL, 1024)


# ── Query Cache ────────────────────────────────────────────────────────────────
# Cache the last 512 query embeddings for 1 hour.
# Same farmer question → served from memory, 0 compute.
_query_cache: TTLCache = TTLCache(maxsize=512, ttl=3600)


def embed_texts(texts: List[str], batch_size: int = 32) -> List[List[float]]:
    """
    Embed a list of document texts. Used during ingestion.
    Runs purely on local CPU/GPU — no API calls.

    Args:
        texts:      List of text strings to embed.
        batch_size: Number of texts per inference batch.

    Returns:
        List of embedding vectors (List[float]).
    """
    # For E5 models, prepend prefix as required by the model architecture
    if "e5" in LOCAL_EMBEDDING_MODEL.lower():
        processed_texts = [f"passage: {t}" for t in texts]
    else:
        processed_texts = texts

    model = get_local_embedder()
    # encode() returns numpy arrays; convert to Python lists for Qdrant
    embeddings = model.encode(
        processed_texts,
        batch_size=batch_size,
        show_progress_bar=len(processed_texts) > 50,
        normalize_embeddings=True,   # L2-normalize for cosine similarity
        convert_to_numpy=True,
    )
    return embeddings.tolist()


def embed_query(query: str) -> List[float]:
    """
    Embed a single query string, using TTLCache for repeated queries.
    Same query within 1 hour → returns cached vector, 0 compute.

    Args:
        query: The farmer's question or search query.

    Returns:
        Embedding vector as List[float].
    """
    key = query.strip().lower()
    if key in _query_cache:
        logger.debug(f"Query embed cache HIT: '{key[:60]}'")
        return _query_cache[key]

    logger.debug(f"Query embed cache MISS: '{key[:60]}'")
    
    # For E5 models, prepend query prefix as required
    if "e5" in LOCAL_EMBEDDING_MODEL.lower():
        query_text = f"query: {query}"
    else:
        query_text = query

    model = get_local_embedder()
    vector = model.encode(
        query_text,
        normalize_embeddings=True,
        convert_to_numpy=True,
    ).tolist()

    _query_cache[key] = vector
    return vector


def get_query_cache_stats() -> dict:
    """Return cache statistics for the /rag/status endpoint."""
    return {
        "query_cache_size": len(_query_cache),
        "query_cache_maxsize": _query_cache.maxsize,
        "query_cache_ttl_seconds": _query_cache.ttl,
        "model": LOCAL_EMBEDDING_MODEL,
        "embedding_dim": get_embedding_dim(),
        "api_calls_per_query": 0,   # always 0 — purely local
    }
