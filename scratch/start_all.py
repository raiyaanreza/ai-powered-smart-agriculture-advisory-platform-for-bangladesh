import subprocess
import os
import sys
import time

services = [
    ("api-gateway", 8000, "services/api-gateway"),
    ("advisory-service", 8001, "services/advisory-service"),
    ("crop-routing-service", 8002, "services/crop-routing-service"),
    ("agent-orchestrator", 8003, "services/agent-orchestrator"),
    ("auth-service", 8004, "services/auth-service"),
    ("notification-service", 8005, "services/notification-service"),
    ("analytics-service", 8006, "services/analytics-service"),
    ("report-service", 8007, "services/report-service"),
    ("rag-service", 8008, "services/rag-service"),
    ("disease-rice-service", 8010, "services/disease-rice-service"),
    ("disease-brassica-service", 8011, "services/disease-brassica-service"),
    ("disease-corn-service", 8012, "services/disease-corn-service"),
    ("disease-potato-service", 8013, "services/disease-potato-service"),
    ("disease-wheat-service", 8014, "services/disease-wheat-service"),
]

processes = []
venv_python = os.path.abspath(".venv/Scripts/python.exe")

print("=== Starting 14 FastAPI microservices ===")
for name, port, path in services:
    print(f"-> Starting {name} on port {port}...")
    # Start uvicorn app
    proc = subprocess.Popen(
        [venv_python, "-m", "uvicorn", "app.main:app", "--port", str(port), "--host", "127.0.0.1"],
        cwd=os.path.abspath(path),
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )
    processes.append((name, proc))
    time.sleep(0.5)

print("\n=== Starting Next.js applications (web on 3000, admin on 3001) ===")
next_proc = subprocess.Popen(
    ["pnpm", "run", "dev"],
    cwd=os.path.abspath("."),
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
    text=True,
    shell=True
)
processes.append(("next-apps", next_proc))

print("\nAll servers launched! Keeping process alive in background...")
try:
    while True:
        # Check if any process has crashed
        for name, proc in processes:
            poll = proc.poll()
            if poll is not None:
                print(f"WARNING: Process {name} exited with code {poll}")
                stdout, stderr = proc.communicate()
                print(f"STDOUT:\n{stdout}\nSTDERR:\n{stderr}")
                processes.remove((name, proc))
        time.sleep(2)
except KeyboardInterrupt:
    print("\nShutting down all processes...")
    for name, proc in processes:
        proc.terminate()
    print("All processes terminated.")
