import logging
import shutil
import os
import re
from typing import List
from fastapi import FastAPI, UploadFile, File, HTTPException, Header, Depends, Request
from pydantic import BaseModel
from ultralytics import YOLO

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class Prediction(BaseModel):
    class_name: str
    confidence: float


class PredictionResponse(BaseModel):
    predictions: List[Prediction]
    summary: dict

async def verify_internal_token(request: Request, x_internal_token: str = Header(None)):
    if request.url.path in ("/health", "/docs", "/openapi.json"):
        return True
    secret = os.environ["INTERNAL_SHARED_SECRET"]
    if not x_internal_token or x_internal_token != secret:
        raise HTTPException(status_code=403, detail="Forbidden: Invalid internal token")
    return True

app = FastAPI(title="disease-corn-service", dependencies=[Depends(verify_internal_token)])

try:
    model = YOLO('../../models/corn-disease/best.pt')
except Exception as e:
    model = None
    logger.error("Could not load model: %s", e)

@app.post("/predict", response_model=PredictionResponse)
async def predict(file: UploadFile = File(...)):
    if not model:
        raise HTTPException(status_code=500, detail="Model not loaded")

    safe_filename = re.sub(r'[^\w\-.]', '_', os.path.basename(file.filename or "upload"))
    file_location = f"temp_{safe_filename}"
    with open(file_location, "wb+") as file_object:
        shutil.copyfileobj(file.file, file_object)

    try:
        results = model.predict(file_location)
        if not results or len(results) == 0:
            return PredictionResponse(predictions=[], summary={"class": "Unknown", "confidence": 0.0})

        result = results[0]
        predictions = []
        for box in result.boxes:
            predicted_class = result.names[int(box.cls[0])]
            confidence = float(box.conf[0])
            predictions.append(Prediction(class_name=predicted_class, confidence=confidence))

        summary = {"class": predictions[0].class_name, "confidence": predictions[0].confidence} if predictions else {"class": "Unknown", "confidence": 0.0}
        return PredictionResponse(predictions=predictions, summary=summary)
    finally:
        os.remove(file_location)

@app.get("/health")
def health():
    return {"status": "ok", "service": "disease-corn-service"}

@app.get("/metrics")
def metrics():
    """Prometheus-compatible metrics endpoint"""
    from fastapi.responses import Response
    return Response(
        content='# HELP service_up Whether the service is up\n# TYPE service_up gauge\nservice_up{service="disease-corn-service"} 1\n',
        media_type="text/plain",
    )
