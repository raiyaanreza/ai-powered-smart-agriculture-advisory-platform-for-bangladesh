import os

for root, dirs, files in os.walk("e:\\agri-ai-platform"):
    # skip node_modules, .venv, etc.
    if any(p in root for p in ["node_modules", ".venv", ".git", "__pycache__", "dist"]):
        continue
    for file in files:
        if file.endswith((".spec.ts", ".ts", ".tsx", ".py")) and any(kw in file.lower() for kw in ["auth", "login", "role", "user", "middleware"]):
            print(os.path.join(root, file))
