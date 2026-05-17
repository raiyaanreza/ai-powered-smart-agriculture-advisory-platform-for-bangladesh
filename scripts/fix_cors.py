import os
import glob

def fix_cors():
    for filepath in glob.glob('services/*/app/main.py'):
        with open(filepath, 'r') as f:
            content = f.read()
        
        target = 'allow_origins=["*"]'
        if target in content:
            replacement = 'allow_origins=os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:3001").split(",")'
            content = content.replace(target, replacement)
            
            # Ensure os is imported
            if 'import os' not in content:
                content = 'import os\n' + content
                
            with open(filepath, 'w') as f:
                f.write(content)
            print(f'Fixed CORS in {filepath}')

if __name__ == '__main__':
    fix_cors()
