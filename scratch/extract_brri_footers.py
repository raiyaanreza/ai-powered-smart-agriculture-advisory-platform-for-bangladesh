import os
import sys

if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

sources_dir = r"e:\agri-ai-platform\models\sources\Rice"

for file in os.listdir(sources_dir):
    if file.startswith("rice_brri_") and file.endswith(".md"):
        filepath = os.path.join(sources_dir, file)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        lines = content.splitlines()
        found = False
        for line in reversed(lines):
            if "তথ্যসূত্র" in line:
                print(f"{file}: {line.strip()}")
                found = True
                break
        if not found:
            print(f"{file}: NOT FOUND")
