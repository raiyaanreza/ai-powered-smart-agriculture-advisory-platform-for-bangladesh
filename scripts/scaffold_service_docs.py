import os

services = [
    "auth-service",
    "crop-routing-service",
    "disease-rice-service",
    "disease-brassica-service",
    "disease-corn-service",
    "disease-potato-service",
    "disease-wheat-service",
    "rag-service",
    "analytics-service",
    "notification-service",
    "report-service"
]

readme_template = """# {service_name}

This microservice is a modular component of the AgriVision AI Agriculture Platform.

## 📡 Port & Context
* **Base Endpoint**: http://localhost:{port}
* **Tech Stack**: FastAPI, Uvicorn, Python 3.12

## 🚀 Setup & Dev
1. Activate virtual environment.
2. Run standard local launch:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port {port}
   ```
"""

agents_template = """# AGENTS.md - Local Rules for {service_name}

> **Role**: AI Local Coding Guidelines

1. **Service Boundaries**:
   - Maintain strict separation of concerns. Do not cross-import packages from other services directly.
2. **Schema Validity**:
   - Pydantic models inside `app/schemas/` serve as contract enforcement tools.
3. **Database Boundaries**:
   - All external repository calls must utilize standard db repositories patterns.
"""

# Map ports
port_map = {
    "auth-service": 8004,
    "crop-routing-service": 8002,
    "disease-rice-service": 8010,
    "disease-brassica-service": 8011,
    "disease-corn-service": 8012,
    "disease-potato-service": 8013,
    "disease-wheat-service": 8014,
    "rag-service": 8008,
    "analytics-service": 8006,
    "notification-service": 8005,
    "report-service": 8007
}

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

for s in services:
    service_path = os.path.join(base_dir, "services", s)
    if os.path.exists(service_path):
        port = port_map.get(s, 8000)
        
        # Write README
        with open(os.path.join(service_path, "README.md"), "w", encoding="utf-8") as f:
            f.write(readme_template.format(service_name=s, port=port))
            
        # Write AGENTS.md
        with open(os.path.join(service_path, "AGENTS.md"), "w", encoding="utf-8") as f:
            f.write(agents_template.format(service_name=s))

print("Scaffolding of service-level docs completed successfully.")
