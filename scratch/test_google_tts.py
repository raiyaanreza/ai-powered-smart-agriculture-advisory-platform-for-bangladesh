import requests

text = "আসসালামু আলাইকুম, কেমন আছেন? আমি আপনার এআই কৃষি সহকারী।"
url = f"https://translate.google.com/translate_tts?ie=UTF-8&tl=bn&client=tw-ob&q={requests.utils.quote(text)}"

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

try:
    response = requests.get(url, headers=headers)
    print("Status Code:", response.status_code)
    print("Content-Type:", response.headers.get("Content-Type"))
    print("Content-Length:", response.headers.get("Content-Length"))
    if response.status_code == 200:
        with open("scratch/test_google_tts.mp3", "wb") as f:
            f.write(response.content)
        print("Success! Saved scratch/test_google_tts.mp3")
    else:
        print("Response:", response.text)
except Exception as e:
    print("Error:", e)
