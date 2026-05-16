import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    console.log("Seeding mock data via API...");

    // 1. Mock Profiles
    const { data: users } = await supabaseAdmin.from('profiles').select('id').limit(1);
    const userId = users && users.length > 0 ? users[0].id : null;

    // 2. Mock Diagnoses
    const mockDiagnoses = [
      {
        farmer_id: userId,
        crop_detected: "Rice",
        disease_detected: "Rice - Blast",
        confidence_score: 0.92,
        severity: "High",
        expert_notes: "Apply Tricyclazole 75 WP at 0.6 g/L water.",
        district: "Bogura",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
      },
      {
        farmer_id: userId,
        crop_detected: "Potato",
        disease_detected: "Potato - Late Blight",
        confidence_score: 0.88,
        severity: "High",
        expert_notes: "Spray Mancozeb at 2g/L at 7-day intervals.",
        district: "Munshiganj",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
      }
    ];

    await supabaseAdmin.from('diagnoses').upsert(mockDiagnoses);

    // 3. Mock Reports
    const mockReports = [
      {
        disease_name: "Rice Blast",
        latitude: 24.8481,
        longitude: 89.3730,
        severity: "High",
        location_name: "Bogura",
        created_at: new Date().toISOString()
      },
      {
        disease_name: "Potato Late Blight",
        latitude: 23.5422,
        longitude: 90.5348,
        severity: "Medium",
        location_name: "Munshiganj",
        created_at: new Date().toISOString()
      }
    ];

    await supabaseAdmin.from('reports').upsert(mockReports);

    return NextResponse.json({ success: true, message: "Data seeded successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
