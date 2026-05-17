import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="analytics-service", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:3001").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "healthy", "service": "analytics-service"}

@app.get("/analytics/outbreaks")
async def get_outbreaks_telemetry():
    """Returns geospatial agricultural disease outbreak analytics"""
    return {
        "success": True,
        "outbreaks": [
            {"id": 1, "crop": "Rice", "disease": "Blast", "district": "Dhaka", "latitude": 23.8103, "longitude": 90.4125, "cases": 12, "severity": "High"},
            {"id": 2, "crop": "Wheat", "disease": "Rust", "district": "Rajshahi", "latitude": 24.3636, "longitude": 88.6241, "cases": 4, "severity": "Medium"},
            {"id": 3, "crop": "Potato", "disease": "Late Blight", "district": "Bogura", "latitude": 24.8461, "longitude": 89.3730, "cases": 23, "severity": "High"}
        ]
    }

@app.get("/analytics/diagnoses")
async def get_diagnoses_metrics():
    """Returns dynamic model detection metrics"""
    return {
        "success": True,
        "metrics": {
            "total_diagnoses": 132,
            "average_confidence": 0.92,
            "system_online_percentage": 99.8,
            "accuracy_by_crop": {
                "Rice": 0.94,
                "Wheat": 0.89,
                "Potato": 0.96,
                "Corn": 0.91,
                "Brassica": 0.88
            }
        }
    }
