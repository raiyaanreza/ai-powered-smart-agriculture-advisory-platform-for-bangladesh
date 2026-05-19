import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { image, language = "bn", userId } = body;

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
      }
    } catch (e) {
      console.warn("Could not reach local agent-orchestrator, falling back to pure Gemini:", e);
    }

    // Step 2: Use backend Advisory Service to enrich the diagnosis with treatments
    let diagnosis;
    try {
      const advisoryRes = await fetch("http://127.0.0.1:8000/advisory/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          yolo_crop: yoloCrop,
          yolo_disease: yoloDisease,
          yolo_confidence: yoloConfidence,
          language,
          image_data: base64Data
        })
      });
      
      if (!advisoryRes.ok) {
         throw new Error(`Advisory service failed: ${advisoryRes.statusText}`);
      }
      diagnosis = await advisoryRes.json();
    } catch (e) {
      console.error("Advisory service call failed:", e);
      return NextResponse.json({ error: "Failed to process image through backend" }, { status: 500 });
    }

    // Hard-fix for Rice bug: Ensure we use the actual detected crop
    const finalCrop = yoloCrop !== "Unknown" ? yoloCrop : diagnosis.crop;

    // Save to DB using service role to bypass RLS for demo
    if (userId) {
      const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY! || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      await supabaseAdmin.from("diagnoses").insert([{
        farmer_id: userId,
        crop_type: finalCrop, // Correctly saving the crop type
        disease_detected: diagnosis.disease,
        confidence_score: diagnosis.confidence,
        severity: diagnosis.severity,
        expert_notes: diagnosis.description,
        image_url: image.substring(0, 100) 
      }]);
    }

    return NextResponse.json({ ...diagnosis, crop: finalCrop });
  } catch (error: any) {
    console.error("Diagnosis Error:", error);
    return NextResponse.json({ error: "Failed to process image" }, { status: 500 });
  }
}
