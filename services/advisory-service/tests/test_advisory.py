import os
import sys

# Insert service path to avoid conflicts in monorepo test collection
service_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if service_dir not in sys.path:
    sys.path.insert(0, service_dir)

from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, patch
from app.main import app

client = TestClient(app)

# Setup internal authorization headers
INTERNAL_TOKEN = "super-secret-internal-key-2026"
headers = {"X-Internal-Token": INTERNAL_TOKEN}

def test_advisory_unauthorized():
    # If no token is provided, it should fail with 403 Forbidden
    response = client.post("/advisory/chat", json={
        "message": "Hello",
        "history": [],
        "language": "en"
    })
    assert response.status_code == 403

@patch("app.main.gemini_service")
def test_advisory_chat(mock_gemini):
    # Mock return value for gemini advisory service
    from app.schemas.chat import ChatResponse
    mock_response = ChatResponse(text="Mocked AI Response")
    mock_gemini.get_response = AsyncMock(return_value=mock_response)
    
    response = client.post("/advisory/chat", json={
        "message": "Hello",
        "history": [],
        "language": "en"
    }, headers=headers)
    
    assert response.status_code == 200
    assert response.json()["text"] == "Mocked AI Response"

@patch("app.main.gemini_service")
def test_crop_analysis(mock_gemini):
    # Mock return value for crop analysis
    from app.schemas.chat import CropAnalysisResponse, SoilFertilizerAdvisory, DiseaseRisk, CalendarMilestone
    mock_response = CropAnalysisResponse(
        summary="Good prospects",
        soil_fertilizer=SoilFertilizerAdvisory(
            suitability="Highly suitable",
            npk_ratio="120:60:40",
            organic_matter="High"
        ),
        disease_risks=[
            DiseaseRisk(
                crop_name="Rice",
                disease_name="Rice Blast",
                prevention="Use resistant seeds",
                chemical_treatment="Fungicide"
            )
        ],
        calendar=[
            CalendarMilestone(
                stage="Sowing",
                timeline="Dec-Jan",
                instructions="Sow early"
            )
        ],
        yield_projection="5 Tons/ha",
        climate_outlook="Favorable"
    )
    mock_gemini.generate_crop_analysis = AsyncMock(return_value=mock_response)
    
    response = client.post("/advisory/crop-analysis", json={
        "crops": ["Rice"],
        "soil_type": "Clay",
        "district": "Dhaka",
        "season": "Rabi"
    }, headers=headers)
    
    assert response.status_code == 200
    assert response.json()["yield_projection"] == "5 Tons/ha"
