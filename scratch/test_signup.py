import requests

url = "https://lhnucgxjultsrkjvsjrz.supabase.co/auth/v1/signup"
headers = {
    "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxobnVjZ3hqdWx0c3JranZzanJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3ODI4ODksImV4cCI6MjA5NDM1ODg4OX0.O6TIB_MO5Ss0Sl5C7TXjg9z2Xhp9IT_UsWsPz1_34PE",
    "Content-Type": "application/json"
}
payload = {
    "email": "test_auth_check@agri-test.bd",
    "password": "Password123!",
    "data": {
        "full_name": "Test Onboarding User"
    }
}

r = requests.post(url, headers=headers, json=payload)
print("Status Code:", r.status_code)
print("Response:", r.text)
