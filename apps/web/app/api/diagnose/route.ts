import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { image, language = "bn" } = await req.json();

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const base64Data = image.split(",")[1];
    
    // Step 1: Query the LangGraph Orchestrator (YOLO .pt models)
    let yoloCrop = "Unknown";
    let yoloDisease = "Unknown";
    let yoloConfidence = 0.0;
    
    try {
      const buffer = Buffer.from(base64Data, 'base64');
      const formData = new FormData();
      formData.append("file", new Blob([buffer], { type: "image/jpeg" }), "upload.jpg");
      
      const orchestratorRes = await fetch("http://127.0.0.1:8000/diagnose", {
        method: "POST",
        body: formData,
      });
      
      if (orchestratorRes.ok) {
        const orchData = await orchestratorRes.json();
        yoloCrop = orchData.crop || "Unknown";
        if (orchData.diagnosis && orchData.diagnosis.disease_class) {
          yoloDisease = orchData.diagnosis.disease_class;
          yoloConfidence = orchData.diagnosis.confidence || 0.0;
        }
      } else {
        console.warn("Orchestrator returned error, falling back to pure Gemini:", await orchestratorRes.text());
      }
    } catch (e) {
      console.warn("Could not reach local agent-orchestrator, falling back to pure Gemini:", e);
    }

    // Step 2: Use Gemini to enrich the diagnosis with treatments
    const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite" });

    const prompt = `
      Act as an expert plant pathologist. Analyze this crop image.
      Provide the diagnosis in ${language === "bn" ? "Bangla" : "English"}.
      
      The AI vision model has pre-identified this as:
      Crop: ${yoloCrop}
      Condition/Disease: ${yoloDisease}
      (Confidence: ${yoloConfidence})
      
      If the vision model says "Unknown", rely entirely on the image to make your own judgment.
      If the vision model provides a specific crop and disease, base your treatment plan on that, but visually verify it makes sense.

      BE CONCISE AND TOKEN-SAVING. Use this JSON format strictly:
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
          data: base64Data,
          mimeType: "image/jpeg",
        },
      },
    ]);

    const responseText = result.response.text();
    const jsonStr = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    const diagnosis = JSON.parse(jsonStr);

    // Override with YOLO confidence if YOLO was successful and confident
    if (yoloDisease !== "Unknown" && yoloConfidence > 0.5) {
        diagnosis.crop = yoloCrop !== "Unknown" ? yoloCrop : diagnosis.crop;
        diagnosis.disease = yoloDisease;
        diagnosis.confidence = yoloConfidence;
    }

    // Save to DB if userId is provided
    const { userId } = await req.json().catch(() => ({})); 
    
    if (userId) {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      await supabase.from("diagnoses").insert([{
        farmer_id: userId,
        disease_detected: `${diagnosis.crop} - ${diagnosis.disease}`,
        confidence_score: diagnosis.confidence,
        severity: diagnosis.severity,
        expert_notes: diagnosis.treatment_en?.[0] || diagnosis.description,
        image_url: image.substring(0, 50) 
      }]);
    }

    return NextResponse.json(diagnosis);
  } catch (error: any) {
    console.error("Diagnosis Error:", error);
    return NextResponse.json({ error: "Failed to process image" }, { status: 500 });
  }
}
