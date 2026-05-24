import os
import re

sources_dir = r"e:\agri-ai-platform\models\sources"
output_path = r"e:\agri-ai-platform\scratch\body_citations_audit.txt"

with open(output_path, 'w', encoding='utf-8') as out:
    for root, dirs, files in os.walk(sources_dir):
        for file in files:
            if file.endswith('.md'):
                filepath = os.path.join(root, file)
                relpath = os.path.relpath(filepath, sources_dir)
                with open(filepath, 'r', encoding='utf-8') as f:
                    lines = f.readlines()
                
                # Check bottom lines (last 10 lines)
                bottom_section = "".join(lines[-10:])
                # Also check if there are other citations
                body_text = "".join(lines)
                
                # Find author, editor, reference, source keywords
                source_mentions = []
                for line in lines:
                    if any(kw in line for kw in ["তথ্যসূত্র", "লেখক", "প্রকাশক", "উৎস", "Source", "Author", "Publisher", "Citation", "Reference"]):
                        # exclude yaml frontmatter lines
                        if not re.match(r'^[a-z_]+:', line.strip()) and "---" not in line:
                            source_mentions.append(line.strip())
                
                out.write(f"File: {relpath}\n")
                out.write(f"--- BOTTOM 5 LINES ---\n")
                for bl in lines[-5:]:
                    out.write(f"  {bl.strip()}\n")
                out.write(f"--- DETECTED SOURCE LINES ({len(source_mentions)}) ---\n")
                for sm in source_mentions[:10]: # Limit to 10
                    out.write(f"  {sm}\n")
                out.write("=" * 60 + "\n\n")
