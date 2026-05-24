"""
RAG Ingestion Pipeline — Optimized with Local Embeddings + SHA-256 Hash Cache
=============================================================================
Strategy (Zero API Cost):
  1. Embed ALL documents locally using BAAI/bge-m3 via sentence-transformers.
     → No Gemini API, no HF API, no rate limits, no cost — ever.
  2. SHA-256 hash cache in SQLite skips re-embedding unchanged chunks.
     → Re-running ingestion after adding 1 new doc = only embeds that 1 doc.
  3. Larger chunks (1800 chars) reduce total chunk count by ~42% vs 1000 chars.
  4. `force=True` wipes collection + cache for schema migrations.
"""
import hashlib
import json
import logging
import os
import sqlite3
import time
from pathlib import Path
from typing import List, Optional

from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, PointStruct, VectorParams

from app.services.embeddings import embed_texts, get_embedding_dim

logger = logging.getLogger(__name__)

# ── Config ─────────────────────────────────────────────────────────────────────
QDRANT_URL      = os.getenv("QDRANT_URL", "http://localhost:6333")
COLLECTION_NAME = "agri_knowledge_base"
SOURCES_DIR     = os.getenv("RAG_SOURCES_DIR", "models/sources")

_SERVICE_ROOT = Path(__file__).resolve().parent.parent.parent.parent.parent
SOURCES_PATH  = _SERVICE_ROOT / SOURCES_DIR
CACHE_DB_PATH = Path(__file__).resolve().parent.parent.parent / "data" / "embedding_cache.db"

# Chunking — 1800/100 produces ~42% fewer chunks than 1000/200
CHUNK_SIZE    = 1800
CHUNK_OVERLAP = 100
BATCH_SIZE    = 64   # Local inference: larger batches are fine (no API rate limit)


# ── Embedding Cache (SQLite) ────────────────────────────────────────────────────

class EmbeddingCache:
    """
    Persistent content-hash cache backed by SQLite.
    Maps SHA-256(chunk_text) → source filename to skip already-indexed chunks.
    """
    def __init__(self, db_path: Path = CACHE_DB_PATH):
        db_path.parent.mkdir(parents=True, exist_ok=True)
        self._conn = sqlite3.connect(str(db_path), check_same_thread=False)
        self._init_schema()

    def _init_schema(self):
        self._conn.execute(
            """
            CREATE TABLE IF NOT EXISTS chunk_cache (
                hash        TEXT PRIMARY KEY,
                source_file TEXT NOT NULL,
                model       TEXT NOT NULL DEFAULT 'local',
                created_at  TEXT NOT NULL DEFAULT (datetime('now'))
            )
            """
        )
        try:
            self._conn.execute("ALTER TABLE chunk_cache ADD COLUMN model TEXT NOT NULL DEFAULT 'local'")
        except sqlite3.OperationalError:
            # Column already exists
            pass
        self._conn.commit()

    def contains(self, chunk_hash: str) -> bool:
        return self._conn.execute(
            "SELECT 1 FROM chunk_cache WHERE hash = ?", (chunk_hash,)
        ).fetchone() is not None

    def add(self, chunk_hash: str, source_file: str, model: str = "local"):
        self._conn.execute(
            "INSERT OR IGNORE INTO chunk_cache (hash, source_file, model) VALUES (?, ?, ?)",
            (chunk_hash, source_file, model),
        )
        self._conn.commit()

    def clear(self):
        self._conn.execute("DELETE FROM chunk_cache")
        self._conn.commit()
        logger.info("EmbeddingCache cleared.")

    def stats(self) -> dict:
        count = self._conn.execute("SELECT COUNT(*) FROM chunk_cache").fetchone()[0]
        size  = CACHE_DB_PATH.stat().st_size if CACHE_DB_PATH.exists() else 0
        return {"cached_hashes": count, "db_size_bytes": size}

    def close(self):
        self._conn.close()


_cache: Optional[EmbeddingCache] = None


def get_cache() -> EmbeddingCache:
    global _cache
    if _cache is None:
        _cache = EmbeddingCache()
    return _cache


def _compute_hash(text: str) -> str:
    normalized = " ".join(text.split())
    return hashlib.sha256(normalized.encode("utf-8")).hexdigest()


# ── Qdrant Helpers ─────────────────────────────────────────────────────────────

def _get_client() -> QdrantClient:
    return QdrantClient(
        url=QDRANT_URL,
        api_key=os.getenv("QDRANT_API_KEY"),
        timeout=120,
    )


def _ensure_collection(client: QdrantClient):
    existing = [c.name for c in client.get_collections().collections]
    dim = get_embedding_dim()
    if COLLECTION_NAME not in existing:
        client.create_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=VectorParams(size=dim, distance=Distance.COSINE),
        )
        logger.info(f"Created Qdrant collection '{COLLECTION_NAME}' (dim={dim})")
    else:
        logger.info(f"Collection '{COLLECTION_NAME}' exists — skipping creation.")


def _wipe_collection(client: QdrantClient):
    existing = [c.name for c in client.get_collections().collections]
    if COLLECTION_NAME in existing:
        client.delete_collection(COLLECTION_NAME)
        logger.info(f"Deleted collection '{COLLECTION_NAME}'")
    _ensure_collection(client)


# ── Document Loading ───────────────────────────────────────────────────────────

def _parse_yaml_frontmatter(text: str) -> tuple[dict, str]:
    metadata: dict = {}
    content = text
    if text.strip().startswith("---"):
        parts = text.split("---", 2)
        if len(parts) >= 3:
            for line in parts[1].splitlines():
                if ":" in line:
                    k, v = line.split(":", 1)
                    metadata[k.strip()] = v.strip().strip('"').strip("'")
            content = parts[2]
    return metadata, content


def _flatten_json(obj, prefix: str = "") -> str:
    parts = []
    if isinstance(obj, dict):
        for k, v in obj.items():
            parts.append(_flatten_json(v, f"{prefix}.{k}" if prefix else k))
    elif isinstance(obj, list):
        for i, item in enumerate(obj):
            parts.append(_flatten_json(item, f"{prefix}[{i}]"))
    else:
        parts.append(f"{prefix}: {obj}")
    return "\n".join(parts)


def _load_documents() -> List[Document]:
    docs: List[Document] = []
    sources_path = Path(SOURCES_PATH)
    if not sources_path.exists():
        logger.warning(f"Sources directory not found: {sources_path}")
        return docs

    for fp in sources_path.glob("**/*.md"):
        try:
            text = fp.read_text(encoding="utf-8")
            meta, content = _parse_yaml_frontmatter(text)
            docs.append(Document(
                page_content=content,
                metadata={
                    "source": fp.name, "type": "markdown",
                    "crop": meta.get("crop", "Unknown"),
                    "disease_pest_name": meta.get("disease_pest_name", meta.get("topic", "Unknown")),
                    "publisher": meta.get("publisher", "Unknown"),
                    "publication_year": meta.get("year", meta.get("publication_year", "Unknown")),
                    "doi": meta.get("doi", "Unknown"),
                    "academic_citation": meta.get("academic_citation", "Unknown"),
                },
            ))
        except Exception as e:
            logger.error(f"Failed to load MD {fp}: {e}")

    for fp in sources_path.glob("**/*.json"):
        try:
            with open(fp, "r", encoding="utf-8") as f:
                raw = json.load(f)
            docs.append(Document(
                page_content=_flatten_json(raw),
                metadata={"source": fp.name, "type": "json"},
            ))
        except Exception as e:
            logger.error(f"Failed to load JSON {fp}: {e}")

    try:
        from langchain_community.document_loaders import PyPDFLoader
        for fp in sources_path.glob("**/*.pdf"):
            try:
                pages = PyPDFLoader(str(fp)).load()
                for p in pages:
                    p.metadata.update({"source": fp.name, "type": "pdf"})
                docs.extend(pages)
            except Exception as e:
                logger.error(f"Failed to load PDF {fp}: {e}")
    except ImportError:
        pass

    logger.info(f"Loaded {len(docs)} documents from {sources_path}")
    return docs


def _split_documents(docs: List[Document]) -> List[Document]:
    return RecursiveCharacterTextSplitter(
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP,
        separators=["\n\n", "\n", "।", ".", " ", ""],
    ).split_documents(docs)


# ── Main Ingestion Entry Point ─────────────────────────────────────────────────

def run_ingestion(force: bool = False) -> dict:
    """
    Incremental RAG ingestion using local BAAI/bge-m3 embeddings.
    Zero API cost. Only embeds new/changed chunks.

    Args:
        force: Wipe Qdrant collection + hash cache and re-embed everything.
               Use only when switching embedding models or chunk schema.
    """
    logger.info("=== RAG Ingestion — Local Embeddings (BAAI/bge-m3) ===")
    cache  = get_cache()
    docs   = _load_documents()
    if not docs:
        return {"status": "no_documents", "chunks_indexed": 0}

    chunks = _split_documents(docs)
    total  = len(chunks)
    logger.info(f"Total chunks: {total}")

    client = _get_client()

    if force:
        logger.warning("FORCE mode: wiping Qdrant + hash cache.")
        _wipe_collection(client)
        cache.clear()
    else:
        _ensure_collection(client)

    # --- Filter already-cached chunks ---
    new_chunks: List[Document] = []
    skipped = 0
    for chunk in chunks:
        h = _compute_hash(chunk.page_content)
        if cache.contains(h):
            skipped += 1
        else:
            chunk.metadata["_hash"] = h
            new_chunks.append(chunk)

    logger.info(f"Skipped {skipped} cached, embedding {len(new_chunks)} new chunks locally.")

    if not new_chunks:
        logger.info("Nothing to embed — all chunks already indexed. 0 compute used.")
        return {
            "status": "up_to_date",
            "total_chunks": total,
            "chunks_skipped": skipped,
            "chunks_newly_indexed": 0,
            "api_calls_made": 0,
            "cache": cache.stats(),
        }

    # --- Embed locally in batches (no API, no rate limits) ---
    newly_indexed = 0
    import uuid

    for i in range(0, len(new_chunks), BATCH_SIZE):
        batch = new_chunks[i: i + BATCH_SIZE]
        texts = [c.page_content for c in batch]

        logger.info(
            f"Embedding batch {i + 1}–{min(i + BATCH_SIZE, len(new_chunks))} "
            f"of {len(new_chunks)} locally..."
        )

        # Local inference — no try/except for rate limits needed
        vectors = embed_texts(texts, batch_size=BATCH_SIZE)

        # Build Qdrant PointStructs manually for full control
        points = []
        for chunk, vector in zip(batch, vectors):
            meta = {k: v for k, v in chunk.metadata.items() if k != "_hash"}
            meta["text"] = chunk.page_content  # store text for retrieval
            points.append(PointStruct(
                id=str(uuid.uuid4()),
                vector=vector,
                payload=meta,
            ))

        # Upload to Qdrant
        client.upsert(collection_name=COLLECTION_NAME, points=points, wait=True)

        # Record hashes in cache
        for chunk in batch:
            h = chunk.metadata.pop("_hash", None)
            if h:
                cache.add(h, chunk.metadata.get("source", "unknown"), model="bge-m3")

        newly_indexed += len(batch)
        logger.info(f"✅ {newly_indexed}/{len(new_chunks)} chunks indexed.")

    logger.info(
        f"=== Done: {newly_indexed} new chunks embedded locally, "
        f"{skipped} skipped from cache. 0 API calls made. ==="
    )
    return {
        "status": "success",
        "total_chunks": total,
        "chunks_skipped": skipped,
        "chunks_newly_indexed": newly_indexed,
        "api_calls_made": 0,      # always 0 with local embeddings
        "embedding_model": "BAAI/bge-m3 (local)",
        "collection": COLLECTION_NAME,
        "cache": cache.stats(),
    }
