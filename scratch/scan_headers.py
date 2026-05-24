import os
from pathlib import Path

sources_dir = Path("models/sources")
md_files = list(sources_dir.glob("**/*.md"))

output_file = Path("scratch/scan_results.txt")

with open(output_file, "w", encoding="utf-8") as out:
    out.write(f"Total markdown files found: {len(md_files)}\n")
    out.write("-" * 80 + "\n")

    for idx, fp in enumerate(sorted(md_files), 1):
        try:
            text = fp.read_text(encoding="utf-8")
            
            # Extract frontmatter
            metadata = {}
            content = text
            if text.strip().startswith("---"):
                parts = text.split("---", 2)
                if len(parts) >= 3:
                    frontmatter_text = parts[1]
                    content = parts[2]
                    for line in frontmatter_text.splitlines():
                        if ":" in line:
                            key, val = line.split(":", 1)
                            metadata[key.strip()] = val.strip().strip('"').strip("'")
                            
            # Get first 3 non-empty lines of body
            body_lines = [line.strip() for line in content.splitlines() if line.strip()]
            body_snippet = " / ".join(body_lines[:3])
            
            out.write(f"{idx}. Path: {fp.relative_to(sources_dir)}\n")
            out.write(f"   Crop: {metadata.get('crop', 'None')}\n")
            out.write(f"   Disease/Pest: {metadata.get('disease_pest_name', 'None')}\n")
            out.write(f"   Citation: {metadata.get('academic_citation', 'None')}\n")
            out.write(f"   Snippet: {body_snippet[:150]}\n")
            out.write("-" * 80 + "\n")
        except Exception as e:
            out.write(f"{idx}. Error reading {fp.name}: {e}\n")
            out.write("-" * 80 + "\n")

print("Scan complete. Results written to scratch/scan_results.txt")
