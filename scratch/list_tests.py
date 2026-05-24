import os

for root, dirs, files in os.walk("e:\\agri-ai-platform"):
    if any(p in root for p in ["node_modules", ".venv", ".git"]):
        continue
    for file in files:
        if file.endswith((".spec.ts", ".spec.tsx", ".test.ts", ".test.tsx")):
            print(os.path.join(root, file))
