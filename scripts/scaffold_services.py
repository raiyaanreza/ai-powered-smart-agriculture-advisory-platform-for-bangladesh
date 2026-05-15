import os
import shutil

services = {
    "crop-routing": "models/crop-classifier/best.pt",
    "disease-brassica": "models/brassica-disease/best.pt",
    "disease-corn": "models/corn-disease/best.pt",
    "disease-potato": "models/potato-disease/best.pt",
    "disease-rice": "models/rice-disease/best.pt",
    "disease-wheat": "models/wheat-disease/best.pt",
}

main_template = """from fastapi import FastAPI, UploadFile, File, HTTPException
import shutil
import os
from ultralytics import YOLO

app = FastAPI(title="{name}-service")

try:
    model = YOLO('../../{model_path}')
except Exception as e:
    model = None
    print("Could not load model: " + str(e))

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if not model:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    file_location = f"temp_{{file.filename}}"
    with open(file_location, "wb+") as file_object:
        shutil.copyfileobj(file.file, file_object)
        
    try:
        results = model.predict(file_location)
        if not results or len(results) == 0:
            return {{"predictions": []}}
            
        result = results[0]
        predictions = []
        for box in result.boxes:
            predicted_class = result.names[int(box.cls[0])]
            confidence = float(box.conf[0])
            predictions.append({{"class": predicted_class, "confidence": confidence}})
            
        summary = predictions[0] if predictions else {{"class": "Unknown", "confidence": 0.0}}
        return {{"predictions": predictions, "summary": summary}}
    finally:
        os.remove(file_location)

@app.get("/health")
def health():
    return {{"status": "ok"}}
"""

for s, model_path in services.items():
    app_dir = os.path.join("services", f"{s}-service", "app")
    os.makedirs(app_dir, exist_ok=True)
    with open(os.path.join(app_dir, "main.py"), "w") as f:
        f.write(main_template.format(name=s, model_path=model_path))

print("Scaffolded FastAPI services for models.")
