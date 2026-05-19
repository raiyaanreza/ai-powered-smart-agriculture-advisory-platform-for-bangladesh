import os
from fastapi import FastAPI, UploadFile, File, HTTPException, Header, Depends, Request
import shutil
from ultralytics import YOLO

async def verify_internal_token(request: Request, x_internal_token: str = Header(None)):
    if request.url.path in ("/health", "/docs", "/openapi.json"):
        return True
    secret = os.getenv("INTERNAL_SHARED_SECRET", "super-secret-internal-key-2026")
    if not x_internal_token or x_internal_token != secret:
        raise HTTPException(status_code=403, detail="Forbidden: Invalid internal token")
    return True

app = FastAPI(title="crop-routing-service", dependencies=[Depends(verify_internal_token)])

try:
    model = YOLO('../../models/crop-classifier/best.pt')
except Exception as e:
    model = None
    print("Could not load model: " + str(e))

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if not model:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    file_location = f"temp_{file.filename}"
    with open(file_location, "wb+") as file_object:
        shutil.copyfileobj(file.file, file_object)
        
    try:
        results = model.predict(file_location)
        if not results or len(results) == 0:
            return {"predictions": []}
            
        result = results[0]
        predictions = []
        for box in result.boxes:
            predicted_class = result.names[int(box.cls[0])]
            confidence = float(box.conf[0])
            predictions.append({"class": predicted_class, "confidence": confidence})
            
        summary = predictions[0] if predictions else {"class": "Unknown", "confidence": 0.0}
        return {"predictions": predictions, "summary": summary}
    finally:
        os.remove(file_location)

@app.get("/health")
def health():
    return {"status": "ok"}
