import os
import sys
from pathlib import Path

# Add services/rag-service to Python path so we can import app
repo_root = Path(__file__).resolve().parent.parent
sys.path.append(str(repo_root / "services" / "rag-service"))

from dotenv import load_dotenv
load_dotenv(dotenv_path=repo_root / ".env")

# Ensure required environment variables for the RAG ingestion
os.environ["RAG_SOURCES_DIR"] = "models/sources"

from app.services.ingestion import run_ingestion

print("Starting RAG ingestion of models/sources documents (including vutta/)...")
try:
    result = run_ingestion()
    print("Ingestion result:")
    print(result)
except Exception as e:
    import traceback
    print("Error running ingestion:")
    traceback.print_exc()
