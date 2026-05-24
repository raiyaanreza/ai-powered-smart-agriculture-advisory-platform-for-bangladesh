import os

def list_dirs(path, depth=0):
    if not os.path.exists(path):
        return
    for item in os.listdir(path):
        item_path = os.path.join(path, item)
        if os.path.isdir(item_path):
            if item in ["node_modules", ".next", ".git", "components", "features", "lib", "hooks", "styles"]:
                continue
            print("  " * depth + f"- {item}")
            list_dirs(item_path, depth + 1)
        elif item.endswith((".tsx", ".ts")) and not item.endswith((".d.ts", ".test.tsx", ".spec.ts")):
            print("  " * depth + f"  {item}")

print("Web Pages:")
list_dirs(r"e:\agri-ai-platform\apps\web")

print("\nAdmin Pages:")
list_dirs(r"e:\agri-ai-platform\apps\admin")
