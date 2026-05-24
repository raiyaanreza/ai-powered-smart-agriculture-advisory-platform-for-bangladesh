import os
import sys
from pathlib import Path

# Add services/rag-service to Python path
repo_root = Path(__file__).resolve().parent.parent
sys.path.append(str(repo_root / "services" / "rag-service"))

from dotenv import load_dotenv
load_dotenv(dotenv_path=repo_root / ".env")

from app.services.retrieval import retrieve

print("Querying RAG database for 'ভুট্টা'...")
results = retrieve("ভুট্টা চাষের উপযুক্ত মাটি এবং সার প্রয়োগ পদ্ধতি")
print("Results retrieved:")
for i, r in enumerate(results, 1):
    print(f"\n[{i}] Source: {r['source']} (Score: {r['score']})")
    print(r['text'][:500] + "...")
