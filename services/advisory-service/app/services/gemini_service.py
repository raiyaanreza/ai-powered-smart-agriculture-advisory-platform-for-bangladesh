import os
import asyncio
import httpx
import google.generativeai as genai
from app.schemas.chat import ChatResponse, Diagnosis, TreatmentStep, CropAnalysisResponse
from packages.prompts.advisory import ADVISORY_SYSTEM_PROMPT
import json
from dotenv import load_dotenv

load_dotenv()

RAG_SERVICE_URL = os.getenv("RAG_SERVICE_URL", "http://localhost:8008")
INTERNAL_SECRET = os.getenv("INTERNAL_SHARED_SECRET", "super-secret-internal-key-2026")


async def _fetch_rag_context(query: str, crop: str = None) -> str:
    """Call rag-service to retrieve grounding context for the farmer's query."""
    try:
        async with httpx.AsyncClient(timeout=8.0) as client:
            payload = {"query": query, "top_k": 3, "include_formatted": True}
            if crop:
                payload["crop"] = crop
            resp = await client.post(
                f"{RAG_SERVICE_URL}/rag/query",
                json=payload,
                headers={"X-Internal-Token": INTERNAL_SECRET},
            )
            if resp.status_code == 200:
                data = resp.json()
                return data.get("formatted_context") or ""
    except Exception as e:
        print(f"[RAG] Context retrieval skipped: {e}")
    return ""


class GeminiAdvisoryService:
    def __init__(self):
        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
        model_name = "gemini-3.1-flash-lite"
        self.model = genai.GenerativeModel(
            model_name=model_name, system_instruction=ADVISORY_SYSTEM_PROMPT
        )

    async def get_response(
        self, message: str, history: list = None, image_data: str = None
    ) -> ChatResponse:
        # Convert history format to Gemini SDK format
        formatted_history = []
        if history:
            for msg in history:
                formatted_history.append(
                    {
                        "role": "model" if msg.role == "assistant" else "user",
                        "parts": [msg.content],
                    }
                )

        # Start chat with history
        chat = self.model.start_chat(history=formatted_history)

        # ── RAG Grounding ──────────────────────────────────────────────────────
        rag_context = await _fetch_rag_context(message)
        if rag_context:
            grounded_message = (
                f"{rag_context}\n\n"
                "---\n"
                "Use the above official agricultural reference context to answer "
                "the following question accurately. If the context does not cover "
                "the topic, answer from your general agricultural knowledge but "
                "clearly note it is not from the official BARI/BRRI handbooks.\n\n"
                f"Farmer's Question: {message}"
            )
        else:
            grounded_message = message
        # ───────────────────────────────────────────────────────────────────────

        content = [grounded_message]
        if image_data:
            content.append({"mime_type": "image/jpeg", "data": image_data})

        try:
            response = await asyncio.to_thread(chat.send_message, content)

            # Simple parsing for JSON if the model returns it
            if "{" in response.text and "}" in response.text:
                try:
                    json_str = response.text[
                        response.text.find("{") : response.text.rfind("}") + 1
                    ]
                    data = json.loads(json_str)
                    return ChatResponse(
                        text=data.get("text", response.text),
                        diagnosis=data.get("diagnosis"),
                    )
                except:
                    pass

            return ChatResponse(text=response.text)
        except Exception as e:
            err_msg = str(e).encode('ascii', errors='ignore').decode('ascii')
            print(f"Error in Gemini: {type(e).__name__} - {err_msg}")
            return ChatResponse(text=f"Error: {type(e).__name__}")

    async def generate_crop_analysis(
        self, crops: list, soil_type: str, district: str, season: str
    ) -> CropAnalysisResponse:
        prompt = f"""
        Provide a detailed, expert crop analysis for a farmer in Bangladesh with the following details:
        - Cultivated Crops: {', '.join(crops)}
        - Soil Type: {soil_type}
        - Region/District: {district}
        - Current Season/Sowing context: {season}
        
        You must return a highly precise and practical agricultural advisory. Focus specifically on the agricultural context of {district} district in Bangladesh, prioritizing local climatic conditions, crop calendar constraints, and localized soil properties.
        
        Tailor your response according to the CropAnalysisResponse schema structure.
        For disease prevention, name specific common agricultural brands popular in Bangladesh (such as Nativo, Trooper, Amistar Top, etc.) as a last resort.
        """
        
        model_name = "gemini-3.1-flash-lite"
        structured_model = genai.GenerativeModel(
            model_name=model_name,
            system_instruction="You are a senior agronomist and crop advisor specializing in agricultural cultivation in Bangladesh.",
        )
        
        try:
            response = await asyncio.to_thread(
                structured_model.generate_content,
                prompt,
                generation_config=genai.GenerationConfig(
                    response_mime_type="application/json",
                    response_schema=CropAnalysisResponse
                )
            )
            
            data = json.loads(response.text)
            return CropAnalysisResponse(**data)
        except Exception as e:
            err_msg = str(e).encode('ascii', errors='ignore').decode('ascii')
            print(f"Error in generating structured crop analysis: {type(e).__name__} - {err_msg}")
            # Fallback mock data in case of quota or model issues
            return CropAnalysisResponse(
                summary=f"কৃষি বিশ্লেষণ: {district} জেলায় {', '.join(crops)} চাষাবাদ বিষয়ক পরামর্শ।",
                soil_fertilizer={
                    "suitability": f"আপনার নির্বাচিত '{soil_type}' মাটি {', '.join(crops)} চাষের জন্য মাঝারি থেকে উচ্চ উপযোগী। মাটিতে জৈব সারের পরিমাণ বৃদ্ধির মাধ্যমে আরও ভালো ফলন পাওয়া সম্ভব।",
                    "npk_ratio": "সুপারিশকৃত এনপিকে (NPK) সারের অনুপাত: ১২০:৮০:৬০ কেজি প্রতি হেক্টর। ইউরিয়া সার সমান ৩টি কিস্তিতে প্রয়োগ করতে হবে।",
                    "organic_matter": "জমি তৈরির শেষ সময়ে প্রতি শতকে অন্তত ৫০-৬০ কেজি পচা গোবর সার অথবা কেঁচো সার (ভার্মিকম্পোস্ট) প্রয়োগ করুন।"
                },
                disease_risks=[
                    {
                        "crop_name": c,
                        "disease_name": "ছত্রাকজনিত পাতা ঝলসানো রোগ (Leaf Blight)",
                        "prevention": "সুস্থ ও প্রত্যয়িত বীজ ব্যবহার করুন, জমি পরিষ্কার রাখুন এবং অতিরিক্ত ইউরিয়া সার প্রয়োগ থেকে বিরত থাকুন।",
                        "chemical_treatment": "আক্রান্ত হলে শেষ উপায় হিসেবে 'Nativo' (নেটিভো) অথবা 'Amistar Top' প্রতি লিটার পানিতে ০.৫ গ্রাম মিশিয়ে স্প্রে করুন।"
                    } for c in crops
                ],
                calendar=[
                    {
                        "stage": "জমি প্রস্তুতি",
                        "timeline": "প্রথম ১-২ সপ্তাহ",
                        "instructions": "জমি ৩-৪ টি আড়াআড়ি চাষ ও মই দিয়ে মাটির ঢেলা ভেঙে সমান করে নিন এবং জৈব সার মাটির সাথে ভালোভাবে মিশিয়ে দিন।"
                    },
                    {
                        "stage": "বীজ বপন / চারা রোপণ",
                        "timeline": "৩য় সপ্তাহ",
                        "instructions": "সঠিক দূরত্বে এবং গভীরতায় বীজ বপন করুন। লাইনে বপন করলে পরিচর্যা ও সার দিতে সুবিধা হবে।"
                    },
                    {
                        "stage": "পরিচর্যা ও সেচ",
                        "timeline": "৪র্থ থেকে ৮ম সপ্তাহ",
                        "instructions": "প্রথম ও দ্বিতীয় চাপান সার (ইউরিয়া) প্রয়োগ করুন এবং আগাছা পরিষ্কার রেখে প্রয়োজন অনুযায়ী হালকা সেচ দিন।"
                    },
                    {
                        "stage": "ফসল সংগ্রহ",
                        "timeline": "১২শ থেকে ১৬শ সপ্তাহ",
                        "instructions": "ধান গাছের ৮০% শীষ সোনালী বর্ণ ধারণ করলে অথবা অন্যান্য ফসল উপযুক্ত পরিপক্কতা লাভ করলে ফসল কেটে নিন।"
                    }
                ],
                yield_projection=f"{district} জেলার আবহাওয়ায় সঠিক পরিচর্যায় প্রতি হেক্টরে আনুমানিক ৪.৫ থেকে ৫.৮ মেট্রিক টন ফলন আশা করা যায়।",
                climate_outlook="Reproductive বা ফুল আসার সময়ে আকস্মিক উচ্চ তাপমাত্রা বা অনাকাঙ্ক্ষিত ভারী বৃষ্টিপাত এড়াতে বপন কালীন সময়সূচী কঠোরভাবে মেনে চলুন।"
            )

    async def generate_diagnosis(self, yolo_crop: str, yolo_disease: str, yolo_confidence: float, language: str, image_data: str) -> dict:
        prompt = f"""
        Act as an expert plant pathologist. Analyze this crop image.
        Provide the diagnosis in { "Bangla" if language == "bn" else "English" }.
        
        The AI vision model has pre-identified this as:
        Crop: {yolo_crop}
        Condition/Disease: {yolo_disease}
        (Confidence: {yolo_confidence})
        
        If the vision model says "Unknown", rely entirely on the image to make your own judgment.
        
        BE CONCISE. Use this JSON format:
        {{
          "crop": "Crop Name",
          "disease": "Disease Name",
          "pathogen": "Scientific name",
          "confidence": 0.95,
          "severity": "Low|Medium|High",
          "description": "Short description",
          "treatment_en": ["Step 1 EN"],
          "treatment_bn": ["Step 1 BN"],
          "prevention": "One sentence tip"
        }}
        """

        model_name = "gemini-3.1-flash-lite"
        model = genai.GenerativeModel(model_name=model_name)
        
        content = [prompt]
        if image_data:
            content.append({"mime_type": "image/jpeg", "data": image_data})

        try:
            response = await asyncio.to_thread(model.generate_content, content)
            responseText = response.text
            jsonStr = responseText.replace("```json", "").replace("```", "").strip()
            return json.loads(jsonStr)
        except Exception as e:
            print(f"Error in generating diagnosis: {e}")
            raise

gemini_service = GeminiAdvisoryService()
