import requests
import sys

# Force stdout to use utf-8 to prevent charmap print errors on Windows
sys.stdout.reconfigure(encoding='utf-8')

RAG_URL = "http://localhost:8008/rag/query"
ADVISORY_DIRECT_URL = "http://localhost:8001/advisory/chat"
ADVISORY_GATEWAY_URL = "http://localhost:8000/advisory/advisory/chat"
TOKEN = "super-secret-internal-key-2026"

print("--- Testing RAG Service Retrieval ---")
headers = {
    "Content-Type": "application/json",
    "X-Internal-Token": TOKEN
}
payload = {
    "query": "ধানের ব্লাস্ট রোগ",
    "top_k": 2
}

try:
    resp = requests.post(RAG_URL, headers=headers, json=payload)
    print(f"Status Code: {resp.status_code}")
    if resp.status_code == 200:
        data = resp.json()
        print(f"Success: {data['success']}")
        print(f"Collection Empty: {data['collection_empty']}")
        print(f"Results Count: {len(data['results'])}")
        for idx, item in enumerate(data['results']):
            print(f"\n[Result {idx+1}]")
            print(f"Source: {item['source']}")
            print(f"Text Snippet: {item['text'][:150]}...")
            print(f"Citation: {item['academic_citation']}")
    else:
        print(resp.text)
except Exception as e:
    print(f"RAG Error: {e}")

print("\n--- Testing Advisory Service Chat (DIRECT - 8001) ---")
payload_chat = {
    "message": "ধানের ব্লাস্ট রোগের প্রতিকার কি?",
    "history": [],
    "image_data": None
}
try:
    resp_chat = requests.post(ADVISORY_DIRECT_URL, json=payload_chat, headers=headers)
    print(f"Status Code: {resp_chat.status_code}")
    if resp_chat.status_code == 200:
        chat_data = resp_chat.json()
        print("\nChat Response:")
        print(chat_data['text'])
    else:
        print(resp_chat.text)
except Exception as e:
    print(f"Advisory Chat Error: {e}")

print("\n--- Testing Advisory Service Chat (GATEWAY - 8000) ---")
try:
    # Gateway automatically adds X-Internal-Token, so no custom headers required for client
    resp_chat_gw = requests.post(ADVISORY_GATEWAY_URL, json=payload_chat)
    print(f"Status Code: {resp_chat_gw.status_code}")
    if resp_chat_gw.status_code == 200:
        chat_data_gw = resp_chat_gw.json()
        print("\nChat Response:")
        print(chat_data_gw['text'])
    else:
        print(resp_chat_gw.text)
except Exception as e:
    print(f"Advisory Chat Gateway Error: {e}")
