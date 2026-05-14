import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { image, language = "bn" } = await req.json();

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Initialize Gemini 3.1 Flash Lite
    const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite" });

    const prompt = `
      Act as an expert plant pathologist. Analyze this crop image.
      Provide the diagnosis in ${language === "bn" ? "Bangla" : "English"}.
      
      BE CONCISE AND TOKEN-SAVING. Use this JSON format:
      {
        "crop": "Crop Name",
        "disease": "Disease Name",
        "pathogen": "Scientific name of pathogen",
        "confidence": 0.95,
        "severity": "Low|Medium|High",
        "description": "Short description",
        "treatment_en": ["Step 1 EN", "Step 2 EN"],
        "treatment_bn": ["Step 1 BN", "Step 2 BN"],
        "prevention": "One sentence tip"
      }
    `;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: image.split(",")[1], // Remove "data:image/jpeg;base64,"
          mimeType: "image/jpeg",
        },
      },
    ]);

    const responseText = result.response.text();
    // Clean potential markdown code blocks
    const jsonStr = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    const diagnosis = JSON.parse(jsonStr);

    return NextResponse.json(diagnosis);
  } catch (error: any) {
    console.error("Diagnosis Error:", error);
    return NextResponse.json({ error: "Failed to process image" }, { status: 500 });
  }
}
