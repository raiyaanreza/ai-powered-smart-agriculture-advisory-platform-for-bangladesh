import requests
import base64
import json
import time

url = "http://localhost:3000/api/diagnose"
image_path = "models/test images/Rice__Leaf_Blast/0001.jpg"

print("Waiting for dev server to boot...")
time.sleep(10)

print(f"Reading image from {image_path}...")
with open(image_path, "rb") as image_file:
    encoded_string = base64.b64encode(image_file.read()).decode("utf-8")

payload = {
    "image": f"data:image/jpeg;base64,{encoded_string}",
    "language": "en"
}

print("Sending request to Next.js API (/api/diagnose)...")
try:
    response = requests.post(url, json=payload, timeout=60)
    print("Status Code:", response.status_code)
    try:
        print("Response JSON:")
        print(json.dumps(response.json(), indent=2))
    except Exception:
        print("Raw Response:", response.text)
except Exception as e:
    print("Error during request:", e)
