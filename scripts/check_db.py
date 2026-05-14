import psycopg2
import sys

db_url = 'postgresql://postgres:%5BRaiyan%40191140%5D@db.lhnucgxjultsrkjvsjrz.supabase.co:5432/postgres'

try:
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()
    
    # Check extensions
    cur.execute("SELECT extname FROM pg_extension;")
    extensions = [row[0] for row in cur.fetchall()]
    print('Extensions:', extensions)
    
    # Check tables
    cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';")
    tables = [row[0] for row in cur.fetchall()]
    print('Tables:', tables)
    
    cur.close()
    conn.close()
except Exception as e:
    print('Error:', e)
