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
