import requests

api_key = "AIzaSyB8WKUO9x-J00N1w9Sw31QzcA_mKDHEfy0"
models = ["gemini-3.1-flash-tts-preview", "gemini-2.5-flash-preview-tts"]

payload = {
    "contents": [
        {
            "parts": [
                {
                    "text": "আসসালামু আলাইকুম, কেমন আছেন?"
                }
            ]
        }
    ],
    "generationConfig": {
        "responseModalities": ["AUDIO"],
        "speechConfig": {
            "voiceConfig": {
                "prebuiltVoiceConfig": {
                    "voiceName": "Aoede"
                }
            }
        }
    }
}

headers = {
    "Content-Type": "application/json"
}

for model in models:
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
    print(f"Testing model: {model}...")
    try:
        response = requests.post(url, headers=headers, json=payload)
        print("  Status Code:", response.status_code)
        if response.status_code == 200:
            data = response.json()
            parts = data.get("candidates", [{}])[0].get("content", {}).get("parts", [])
            found_audio = False
            for part in parts:
                if "inlineData" in part:
                    mime_type = part["inlineData"].get("mimeType")
                    base64_data = part["inlineData"].get("data")
                    print(f"  SUCCESS! Found audio. MimeType: {mime_type}, length: {len(base64_data)}")
                    found_audio = True
                else:
                    print("  Text part:", part.get("text"))
            if not found_audio:
                print("  No audio in parts:", parts)
        else:
            print("  Response:", response.text)
    except Exception as e:
        print("  Error:", e)
