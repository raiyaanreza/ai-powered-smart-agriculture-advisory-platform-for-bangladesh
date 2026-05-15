import os
from supabase import create_client

url = "https://lhnucgxjultsrkjvsjrz.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxobnVjZ3hqdWx0c3JranZzanJ6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODc4Mjg4OSwiZXhwIjoyMDk0MzU4ODg5fQ.ohLFbWBtaXkf8V-vTV_8kN38vpi6dv9Y7A0S98cvi14"

supabase = create_client(url, key)

def check():
    print("Checking Database Content...")
    
    tables = ["profiles", "diagnoses", "reports", "notifications", "diseases"]
    for table in tables:
        try:
            res = supabase.table(table).select("*", count="exact").execute()
            print(f"Table '{table}': {res.count} records")
        except Exception as e:
            print(f"Error checking table '{table}': {e}")

if __name__ == "__main__":
    check()
