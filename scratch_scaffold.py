import os
from pathlib import Path

base_dir = Path(r"e:\agri-ai-platform\services")

services_to_update = ["api-gateway", "advisory-service", "agent-orchestrator"]

standard_folders = [
    "app/api",
    "app/core",
    "app/domain",
    "app/schemas",
    "app/services",
    "app/repositories",
    "app/workers",
    "tests"
]

for service in services_to_update:
    service_path = base_dir / service
    
    # Create standard folders and __init__.py
    for folder in standard_folders:
        folder_path = service_path / folder
        folder_path.mkdir(parents=True, exist_ok=True)
        init_file = folder_path / "__init__.py"
        if not init_file.exists():
            init_file.touch()

    # Create empty/basic AGENTS.md
    agents_file = service_path / "AGENTS.md"
    if not agents_file.exists():
        agents_file.write_text(f"# Agents instructions for {service}\n\nMaintain standard directory structure and contract-first API development.\n", encoding="utf-8")

    # Create empty/basic README.md
    readme_file = service_path / "README.md"
    if not readme_file.exists():
        readme_file.write_text(f"# {service}\n\nFastAPI microservice for AgriVision.\n", encoding="utf-8")

    # Dockerfile for advisory-service and agent-orchestrator
    dockerfile = service_path / "Dockerfile"
    if not dockerfile.exists():
        docker_content = f"""FROM python:3.12-slim

WORKDIR /workspace

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
"""
        dockerfile.write_text(docker_content, encoding="utf-8")
