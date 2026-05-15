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
        model_name = os.getenv("GEMINI_MODEL_NAME", "gemini-3.1-flash-lite")
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

        content = [message]
        if image_data:
            content.append({"mime_type": "image/jpeg", "data": image_data})

        try:
            response = await chat.send_message_async(content)

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
            print(f"Error in Gemini: {str(e)}")
            return ChatResponse(text=f"Error: {str(e)}")


gemini_service = GeminiAdvisoryService()
