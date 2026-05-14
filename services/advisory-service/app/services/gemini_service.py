import os
import google.generativeai as genai
from app.schemas.chat import ChatResponse, Diagnosis, TreatmentStep
from packages.prompts.advisory import ADVISORY_SYSTEM_PROMPT
import json
from dotenv import load_dotenv

load_dotenv()

class GeminiAdvisoryService:
    def __init__(self):
        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
        self.model = genai.GenerativeModel(
            model_name="gemini-flash-latest",
            system_instruction=ADVISORY_SYSTEM_PROMPT
        )

    async def get_response(self, message: str, history: list = None, image_data: str = None) -> ChatResponse:
        content = [message]
        
        if image_data:
            content.append({
                "mime_type": "image/jpeg",
                "data": image_data
            })
            
        chat = self.model.start_chat(history=[])
        response = await chat.send_message_async(content)
        
        # Simple parsing for JSON if the model returns it
        try:
            # Look for JSON block in the response if system prompt asks for it
            if "{" in response.text and "}" in response.text:
                json_str = response.text[response.text.find("{"):response.text.rfind("}")+1]
                data = json.loads(json_str)
                return ChatResponse(
                    text=data.get("text", response.text),
                    diagnosis=data.get("diagnosis")
                )
        except:
            pass

        return ChatResponse(text=response.text)

gemini_service = GeminiAdvisoryService()
