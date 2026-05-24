import os

for root, dirs, files in os.walk(r"e:\agri-ai-platform"):
    for file in files:
        if "fix" in file or "stub" in file:
            print(os.path.join(root, file))
