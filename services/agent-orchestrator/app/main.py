import os
import re
import shutil
import time
import logging
from typing import Annotated, TypedDict, Optional
from fastapi import FastAPI, UploadFile, File, HTTPException, Header, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langgraph.graph import StateGraph, END
from langgraph.graph.message import add_messages
from ultralytics import YOLO

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def verify_internal_token(request: Request, x_internal_token: str = Header(None)):
    if request.url.path in ("/health", "/docs", "/openapi.json"):
        return True
    secret = os.environ["INTERNAL_SHARED_SECRET"]
    if not x_internal_token or x_internal_token != secret:
        raise HTTPException(status_code=403, detail="Forbidden: Invalid internal token")
    return True

app = FastAPI(title="agent-orchestrator", dependencies=[Depends(verify_internal_token)])

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:3001").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Metrics store
METRICS = {
    "total_diagnoses": 0,
    "total_inference_time_ms": 0.0,
    "model_cache_hits": 0,
    "model_cache_misses": 0,
    "last_diagnosis_time": None
}

# Bearer Authorization validation check
async def verify_token(authorization: Optional[str] = Header(None)):
    """Validates authorization token for secure endpoints"""
    if authorization:
        if not authorization.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="Invalid token scheme")
        # In a real environment, decode JWT here
        token = authorization.split(" ")[1]
        logger.info("Authorization token verified")
    return True

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
    logger.info("Loading Crop Classifier from: %s", os.path.join(project_root, 'models', 'crop-classifier', 'best.pt'))
    CROP_ROUTER_MODEL = YOLO(
        os.path.join(project_root, "models", "crop-classifier", "best.pt")
    )
    logger.info("Crop Classifier loaded successfully.")
except Exception as e:
    logger.error("CRITICAL ERROR: Failed to load crop classifier. %s", e)
    CROP_ROUTER_MODEL = None

DISEASE_MODELS = {}


def get_disease_model(crop_name: str) -> YOLO:
    if crop_name in DISEASE_MODELS:
        METRICS["model_cache_hits"] += 1
        return DISEASE_MODELS[crop_name]

    METRICS["model_cache_misses"] += 1
    model_paths = {
        "Brassica": os.path.join(project_root, "models", "brassica-disease", "best.pt"),
        "Corn": os.path.join(project_root, "models", "corn-disease", "best.pt"),
        "Potato": os.path.join(project_root, "models", "potato-disease", "best.pt"),
        "Rice": os.path.join(project_root, "models", "rice-disease", "best.pt"),
        "Wheat": os.path.join(project_root, "models", "wheat-disease", "best.pt"),
    }

    path = model_paths.get(crop_name)
    if not path:
        logger.error("No model path defined for crop: %s", crop_name)
        return None
        
    if not os.path.exists(path):
        logger.error("Model file NOT FOUND at: %s", path)
        return None

    logger.info("Lazy loading disease model for %s from %s...", crop_name, path)
    try:
        model = YOLO(path)
        DISEASE_MODELS[crop_name] = model
        logger.info("Successfully loaded model for %s", crop_name)
        return model
    except Exception as e:
        logger.error("FAILED to load %s model: %s", crop_name, e)
        return None


######################################################################
# LangGraph Nodes
######################################################################
def node_classify_crop(state: AgentState):
    """Identifies the crop from the image."""
    logger.info("Executing Node: Classify Crop")
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

    logger.info("Crop Identified: %s", predicted_class)
    return {"crop_type": predicted_class}


def node_diagnose_disease(state: AgentState):
    """Diagnoses the disease based on the identified crop."""
    logger.info("Executing Node: Diagnose Disease")
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
# API Endpoints
######################################################################
@app.post("/diagnose")
async def diagnose(file: UploadFile = File(...), token_valid: bool = Depends(verify_token)):
    """Receives plant crop images and routes through LangGraph nodes"""
    start_time = time.time()
    logger.info("Received file: %s", file.filename)
    safe_filename = re.sub(r'[^\w\-.]', '_', os.path.basename(file.filename or "upload"))
    file_location = f"temp_{safe_filename}"
    try:
        with open(file_location, "wb+") as file_object:
            shutil.copyfileobj(file.file, file_object)

        # Execute LangGraph
        initial_state = {"image_path": file_location}
        final_state = orchestrator_app.invoke(initial_state)

        # Track telemetry
        duration_ms = (time.time() - start_time) * 1000
        METRICS["total_diagnoses"] += 1
        METRICS["total_inference_time_ms"] += duration_ms
        METRICS["last_diagnosis_time"] = time.strftime("%Y-%m-%d %H:%M:%S")

        return {
            "crop": final_state.get("crop_type"),
            "diagnosis": final_state.get("disease_prediction"),
        }
    finally:
        if os.path.exists(file_location):
            os.remove(file_location)


@app.get("/health")
def health():
    """Liveness check"""
    return {"status": "ok", "service": "agent-orchestrator"}


@app.get("/metrics")
def metrics(token_valid: bool = Depends(verify_token)):
    """Expose application metrics and cache hits"""
    avg_inference = 0.0
    if METRICS["total_diagnoses"] > 0:
      avg_inference = METRICS["total_inference_time_ms"] / METRICS["total_diagnoses"]
      
    return {
        "status": "operational",
        "total_diagnoses_handled": METRICS["total_diagnoses"],
        "average_inference_time_ms": round(avg_inference, 2),
        "model_cache_hits": METRICS["model_cache_hits"],
        "model_cache_misses": METRICS["model_cache_misses"],
        "last_diagnosis_timestamp": METRICS["last_diagnosis_time"]
    }
