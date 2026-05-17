from pydantic import BaseModel
from typing import List, Optional

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = []
    image_data: Optional[str] = None  # Base64 image if any

class TreatmentStep(BaseModel):
    label: str
    action: str
    status: Optional[str] = None

class Diagnosis(BaseModel):
    title: str
    description: str
    steps: List[TreatmentStep]

class ChatResponse(BaseModel):
    text: str
    diagnosis: Optional[Diagnosis] = None

class SoilFertilizerAdvisory(BaseModel):
    suitability: str
    npk_ratio: str
    organic_matter: str

class DiseaseRisk(BaseModel):
    crop_name: str
    disease_name: str
    prevention: str
    chemical_treatment: str

class CalendarMilestone(BaseModel):
    stage: str
    timeline: str
    instructions: str

class CropAnalysisResponse(BaseModel):
    summary: str
    soil_fertilizer: SoilFertilizerAdvisory
    disease_risks: List[DiseaseRisk]
    calendar: List[CalendarMilestone]
    yield_projection: str
    climate_outlook: str

class CropAnalysisRequest(BaseModel):
    crops: List[str]
    soil_type: str
    district: str
    season: str


