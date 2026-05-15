import os
import shutil
from typing import Annotated, TypedDict, Optional
from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel
from langgraph.graph import StateGraph, END
from langgraph.graph.message import add_messages
from ultralytics import YOLO

app = FastAPI(title="agent-orchestrator")


######################################################################
# Define LangGraph State
######################################################################
class AgentState(TypedDict):
    image_path: str
    crop_type: Optional[str]
    disease_prediction: Optional[dict]


######################################################################
# Model Loading (Isolated here for local deployment simplicity)
# In production, these would be separate network services.
######################################################################
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(current_dir, "..", "..", ".."))

try:
    print(f"Loading Crop Classifier from: {os.path.join(project_root, 'models', 'crop-classifier', 'best.pt')}")
    CROP_ROUTER_MODEL = YOLO(
        os.path.join(project_root, "models", "crop-classifier", "best.pt")
    )
    print("Crop Classifier loaded successfully.")
except Exception as e:
    print(f"CRITICAL ERROR: Failed to load crop classifier. {e}")
    CROP_ROUTER_MODEL = None

DISEASE_MODELS = {}


def get_disease_model(crop_name: str) -> YOLO:
    if crop_name in DISEASE_MODELS:
        return DISEASE_MODELS[crop_name]

    model_paths = {
        "Brassica": os.path.join(project_root, "models", "brassica-disease", "best.pt"),
        "Corn": os.path.join(project_root, "models", "corn-disease", "best.pt"),
        "Potato": os.path.join(project_root, "models", "potato-disease", "best.pt"),
        "Rice": os.path.join(project_root, "models", "rice-disease", "best.pt"),
        "Wheat": os.path.join(project_root, "models", "wheat-disease", "best.pt"),
    }

    path = model_paths.get(crop_name)
    if not path:
        print(f"Error: No model path defined for crop: {crop_name}")
        return None
        
    if not os.path.exists(path):
        print(f"Error: Model file NOT FOUND at: {path}")
        return None

    print(f"Lazy loading disease model for {crop_name} from {path}...")
    try:
        model = YOLO(path)
        DISEASE_MODELS[crop_name] = model
        print(f"Successfully loaded model for {crop_name}")
        return model
    except Exception as e:
        print(f"FAILED to load {crop_name} model: {e}")
        return None


######################################################################
# LangGraph Nodes
######################################################################
def node_classify_crop(state: AgentState):
    """Identifies the crop from the image."""
    print("Executing Node: Classify Crop")
    image_path = state["image_path"]
    if not CROP_ROUTER_MODEL:
        return {"crop_type": "Unknown"}

    results = CROP_ROUTER_MODEL.predict(image_path)
    if not results or len(results) == 0:
        return {"crop_type": "Unknown"}

    result = results[0]
    if getattr(result, "probs", None) is not None:
        predicted_class = result.names[result.probs.top1]
    elif getattr(result, "boxes", None) is not None and len(result.boxes) > 0:
        best_box = max(result.boxes, key=lambda b: b.conf[0])
        predicted_class = result.names[int(best_box.cls[0])]
    else:
        return {"crop_type": "Unknown"}

    print(f"Crop Identified: {predicted_class}")
    return {"crop_type": predicted_class}


def node_diagnose_disease(state: AgentState):
    """Diagnoses the disease based on the identified crop."""
    print("Executing Node: Diagnose Disease")
    crop_type = state["crop_type"]
    image_path = state["image_path"]

    if crop_type == "Unknown":
        return {"disease_prediction": {"error": "Could not identify crop type."}}

    model = get_disease_model(crop_type)
    if not model:
        return {
            "disease_prediction": {
                "error": f"No disease model available for {crop_type}."
            }
        }

    results = model.predict(image_path)
    if not results or len(results) == 0:
        return {"disease_prediction": {"class": "Healthy/Unknown", "confidence": 0.0}}

    result = results[0]

    if getattr(result, "probs", None) is not None:
        predicted_disease = result.names[result.probs.top1]
        confidence = float(result.probs.top1conf)
    elif getattr(result, "boxes", None) is not None and len(result.boxes) > 0:
        best_box = max(result.boxes, key=lambda b: b.conf[0])
        predicted_disease = result.names[int(best_box.cls[0])]
        confidence = float(best_box.conf[0])
    else:
        return {"disease_prediction": {"class": "Healthy/Unknown", "confidence": 0.0}}

    return {
        "disease_prediction": {
            "disease_class": predicted_disease,
            "confidence": confidence,
        }
    }


def should_diagnose(state: AgentState):
    """Conditional edge router."""
    if state.get("crop_type") in ["Unknown", None]:
        return "end"
    return "diagnose"


######################################################################
# Build Graph
######################################################################
workflow = StateGraph(AgentState)
workflow.add_node("classify", node_classify_crop)
workflow.add_node("diagnose", node_diagnose_disease)

workflow.set_entry_point("classify")
workflow.add_conditional_edges(
    "classify", should_diagnose, {"end": END, "diagnose": "diagnose"}
)
workflow.add_edge("diagnose", END)

orchestrator_app = workflow.compile()


######################################################################
# API Endpoint
######################################################################
@app.post("/diagnose")
async def diagnose(file: UploadFile = File(...)):
    print(f"Received file: {file.filename}")
    file_location = f"temp_{file.filename}"
    try:
        with open(file_location, "wb+") as file_object:
            shutil.copyfileobj(file.file, file_object)

        # Execute LangGraph
        initial_state = {"image_path": file_location}
        final_state = orchestrator_app.invoke(initial_state)

        return {
            "crop": final_state.get("crop_type"),
            "diagnosis": final_state.get("disease_prediction"),
        }
    finally:
        if os.path.exists(file_location):
            os.remove(file_location)


@app.get("/health")
def health():
    return {"status": "ok"}
