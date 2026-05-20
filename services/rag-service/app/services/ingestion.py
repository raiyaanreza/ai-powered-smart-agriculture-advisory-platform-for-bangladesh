"""
RAG Ingestion Pipeline
Reads PDF, DOCX, MD, JSON files from models/sources/ and upserts them
into Qdrant using Gemini text-embedding-004.
"""
import os
import json
import glob
import logging
from pathlib import Path
from typing import List

from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.schema import Document
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_qdrant import QdrantVectorStore
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams

logger = logging.getLogger(__name__)

QDRANT_URL = os.getenv("QDRANT_URL", "http://localhost:6333")
COLLECTION_NAME = "agri_knowledge_base"
EMBEDDING_MODEL = "models/gemini-embedding-001"          # Standard Gemini embedding model
SOURCES_DIR = os.getenv("RAG_SOURCES_DIR", "models/sources")

# Resolve sources dir relative to repo root (3 levels up from this file)
_service_dir = Path(__file__).resolve().parent.parent.parent.parent.parent
SOURCES_PATH = _service_dir / SOURCES_DIR


def _get_embeddings() -> GoogleGenerativeAIEmbeddings:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY environment variable is not set.")
    return GoogleGenerativeAIEmbeddings(
        model=EMBEDDING_MODEL,
        google_api_key=api_key,
    )


def _ensure_collection(client: QdrantClient, vector_size: int = 768):
    """Create Qdrant collection if it does not already exist."""
    existing = [c.name for c in client.get_collections().collections]
    if COLLECTION_NAME not in existing:
        client.create_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=VectorParams(size=vector_size, distance=Distance.COSINE),
        )
        logger.info(f"Created Qdrant collection: {COLLECTION_NAME}")
    else:
        logger.info(f"Collection '{COLLECTION_NAME}' already exists — skipping creation.")


def _load_documents() -> List[Document]:
    """Load all supported documents from the sources directory."""
    docs: List[Document] = []
    sources_path = Path(SOURCES_PATH)

    if not sources_path.exists():
        logger.warning(f"Sources directory not found: {sources_path}")
        return docs

    # ---------- JSON files ----------
    for fp in sources_path.glob("**/*.json"):
        try:
            with open(fp, "r", encoding="utf-8") as f:
                raw = json.load(f)
            # Flatten JSON into readable text chunks
            text = _flatten_json(raw)
            docs.append(Document(
                page_content=text,
                metadata={"source": fp.name, "type": "json"}
            ))
            logger.info(f"Loaded JSON: {fp.name}")
        except Exception as e:
            logger.error(f"Failed to load JSON {fp}: {e}")

    # ---------- Markdown files ----------
    for fp in sources_path.glob("**/*.md"):
        try:
            text = fp.read_text(encoding="utf-8")
            docs.append(Document(
                page_content=text,
                metadata={"source": fp.name, "type": "markdown"}
            ))
            logger.info(f"Loaded Markdown: {fp.name}")
        except Exception as e:
            logger.error(f"Failed to load MD {fp}: {e}")

    # ---------- PDF files ----------
    try:
        from langchain_community.document_loaders import PyPDFLoader
        for fp in sources_path.glob("**/*.pdf"):
            try:
                loader = PyPDFLoader(str(fp))
                pages = loader.load()
                for page in pages:
                    page.metadata["source"] = fp.name
                    page.metadata["type"] = "pdf"
                docs.extend(pages)
                logger.info(f"Loaded PDF: {fp.name} ({len(pages)} pages)")
            except Exception as e:
                logger.error(f"Failed to load PDF {fp}: {e}")
    except ImportError:
        logger.warning("langchain_community not installed — PDF loading skipped.")

    # ---------- DOCX files ----------
    try:
        from docx import Document as DocxDocument
        for fp in sources_path.glob("**/*.docx"):
            try:
                docx = DocxDocument(str(fp))
                text = "\n".join([p.text for p in docx.paragraphs if p.text.strip()])
                docs.append(Document(
                    page_content=text,
                    metadata={"source": fp.name, "type": "docx"}
                ))
                logger.info(f"Loaded DOCX: {fp.name}")
            except Exception as e:
                logger.error(f"Failed to load DOCX {fp}: {e}")
    except ImportError:
        logger.warning("python-docx not installed — DOCX loading skipped.")

    return docs


def _flatten_json(obj, prefix="") -> str:
    """Recursively flatten a JSON object into readable key-value text."""
    parts = []
    if isinstance(obj, dict):
        for k, v in obj.items():
            key = f"{prefix}.{k}" if prefix else k
            parts.append(_flatten_json(v, key))
    elif isinstance(obj, list):
        for i, item in enumerate(obj):
            parts.append(_flatten_json(item, f"{prefix}[{i}]"))
    else:
        parts.append(f"{prefix}: {obj}")
    return "\n".join(parts)


def _split_documents(docs: List[Document]) -> List[Document]:
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        separators=["\n\n", "\n", "।", ".", " ", ""],  # Bangla-aware separators
    )
    return splitter.split_documents(docs)


def run_ingestion() -> dict:
    """
    Main ingestion entry point.
    Loads all source documents, chunks them, embeds with Gemini, and upserts to Qdrant.
    Returns a status summary dict.
    """
    logger.info("=== Starting RAG Ingestion Pipeline ===")
    docs = _load_documents()
    if not docs:
        return {"status": "no_documents", "chunks_indexed": 0}

    chunks = _split_documents(docs)
    logger.info(f"Split into {len(chunks)} chunks.")

    embeddings = _get_embeddings()
    qdrant_api_key = os.getenv("QDRANT_API_KEY")

    # Upsert all chunks into Qdrant using LangChain's vector store wrapper
    QdrantVectorStore.from_documents(
        documents=chunks,
        embedding=embeddings,
        url=QDRANT_URL,
        api_key=qdrant_api_key,
        collection_name=COLLECTION_NAME,
    )
    logger.info(f"Upserted {len(chunks)} chunks to Qdrant collection '{COLLECTION_NAME}'.")
    return {
        "status": "success",
        "documents_loaded": len(docs),
        "chunks_indexed": len(chunks),
        "collection": COLLECTION_NAME,
    }
