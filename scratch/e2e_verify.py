import httpx, json

# Test advisory chat end-to-end with RAG
print("=== Advisory Chat RAG E2E Test ===")
payload = {"message": "ধানের ব্লাস্ট রোগের ঔষধ কী?", "history": []}
r = httpx.post("http://localhost:8000/advisory/advisory/chat", json=payload, timeout=30)
data = r.json()
text = data.get("text", "")
print("Status:", r.status_code)
print("Keys:", list(data.keys()))
print("Text length:", len(text))
print("First 80 chars (utf-8):", text[:80].encode("utf-8"))
has_context = "BARI" in text or "BRRI" in text or "ব্লাস্ট" in text or "ট্রুপার" in text or "Nativo" in text
print("Contains grounded context:", has_context)
print()

# Save full text
with open("scratch/advisory_rag_response.txt", "w", encoding="utf-8") as f:
    f.write(text)
print("Full response saved to scratch/advisory_rag_response.txt")
print()

# Test RAG query directly
print("=== RAG Direct Semantic Search ===")
rag_payload = {"query": "blast disease medicine rice", "top_k": 3}
r2 = httpx.post("http://localhost:8008/rag/query", json=rag_payload, timeout=15)
rag_data = r2.json()
print("RAG Status:", r2.status_code)
results = rag_data.get("results", [])
print("Chunks retrieved:", len(results))
for i, chunk in enumerate(results[:3], 1):
    score = chunk.get("score", 0)
    source = chunk.get("source", "")
    preview = chunk.get("text", "")[:80].encode("utf-8")
    print(f"  Chunk {i} | score={score:.3f} | source={source}")
    print(f"           preview={preview}")
