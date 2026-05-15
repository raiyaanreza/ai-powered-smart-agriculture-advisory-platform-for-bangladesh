import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const diseases = [
    { id: "rice-blb", name: "Bacterial Leaf Blight", nameBn: "ব্যাকটেরিয়াজনিত পাতা পোড়া", crop: "Rice", type: "Bacterial", severity: "High", image: "/assets/diseases/rice/rice_bacterial_leaf_blight.jpg" },
    { id: "rice-brown-spot", name: "Brown Spot", nameBn: "বাদামী দাগ রোগ", crop: "Rice", type: "Fungal", severity: "Medium", image: "/assets/diseases/rice/rice_brown_spot.jpg" },
    { id: "rice-leaf-blast", name: "Leaf Blast", nameBn: "পাতা ব্লাস্ট", crop: "Rice", type: "Fungal", severity: "High", image: "/assets/diseases/rice/rice_leaf_blast.jpg" },
    { id: "rice-leaf-scald", name: "Leaf Scald", nameBn: "পাতা পোড়া", crop: "Rice", type: "Fungal", severity: "Medium", image: "/assets/diseases/rice/rice_leaf_scald.jpg" },
    { id: "rice-narrow-brown", name: "Narrow Brown Leaf Spot", nameBn: "সংকীর্ণ বাদামী দাগ", crop: "Rice", type: "Fungal", severity: "Low", image: "/assets/diseases/rice/rice_narrow_brown_leaf_spot.jpg" },
    { id: "rice-hispa", name: "Rice Hispa", nameBn: "ধানের পামরি পোকা", crop: "Rice", type: "Pest", severity: "High", image: "/assets/diseases/rice/rice_rice_hispa.jpg" },
    { id: "rice-sheath-blight", name: "Sheath Blight", nameBn: "খোল পচা রোগ", crop: "Rice", type: "Fungal", severity: "High", image: "/assets/diseases/rice/rice_sheath_blight.jpg" },
    { id: "rice-healthy", name: "Healthy Rice", nameBn: "সুস্থ ধান", crop: "Rice", type: "Healthy", severity: "Low", image: "/assets/diseases/rice/rice_healthy_leaf.jpg" }
  ];

  try {
    for (const disease of diseases) {
      await supabaseAdmin.from('diseases').upsert(disease);
    }
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
