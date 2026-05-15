const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lhnucgxjultsrkjvsjrz.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxobnVjZ3hqdWx0c3JranZzanJ6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODc4Mjg4OSwiZXhwIjoyMDk0MzU4ODg5fQ.ohLFbWBtaXkf8V-vTV_8kN38vpi6dv9Y7A0S98cvi14';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const diseases = [
  { id: "rice-blb", name: "Bacterial Leaf Blight", nameBn: "ব্যাকটেরিয়াজনিত পাতা পোড়া", crop: "Rice", type: "Bacterial", severity: "High", image: "/assets/diseases/rice/rice_bacterial_leaf_blight.jpg" },
  { id: "rice-brown-spot", name: "Brown Spot", nameBn: "বাদামী দাগ রোগ", crop: "Rice", type: "Fungal", severity: "Medium", image: "/assets/diseases/rice/rice_brown_spot.jpg" },
  { id: "rice-leaf-blast", name: "Leaf Blast", nameBn: "পাতা ব্লাস্ট", crop: "Rice", type: "Fungal", severity: "High", image: "/assets/diseases/rice/rice_leaf_blast.jpg" },
  { id: "rice-leaf-scald", name: "Leaf Scald", nameBn: "পাতা পোড়া", crop: "Rice", type: "Fungal", severity: "Medium", image: "/assets/diseases/rice/rice_leaf_scald.jpg" },
  { id: "rice-narrow-brown", name: "Narrow Brown Leaf Spot", nameBn: "সংকীর্ণ বাদামী দাগ", crop: "Rice", type: "Fungal", severity: "Low", image: "/assets/diseases/rice/rice_narrow_brown_leaf_spot.jpg" },
  { id: "rice-hispa", name: "Rice Hispa", nameBn: "ধানের পামরি পোকা", crop: "Rice", type: "Pest", severity: "High", image: "/assets/diseases/rice/rice_rice_hispa.jpg" },
  { id: "rice-sheath-blight", name: "Sheath Blight", nameBn: "খোল পচা রোগ", crop: "Rice", type: "Fungal", severity: "High", image: "/assets/diseases/rice/rice_sheath_blight.jpg" },
  { id: "rice-healthy", name: "Healthy Rice", nameBn: "সুস্থ ধান", crop: "Rice", type: "Healthy", severity: "Low", image: "/assets/diseases/rice/rice_healthy_leaf.jpg" },
  { id: "cabbage-alternaria", name: "Cabbage Alternaria Spot", nameBn: "বাঁধাকপির অল্টারনারিয়া দাগ", crop: "Brassica", type: "Fungal", severity: "Medium", image: "/assets/diseases/brassica/cabbage_alternaria_spot.jpg" },
  { id: "cabbage-black-rot", name: "Cabbage Black Rot", nameBn: "বাঁধাকপির কালো পচা", crop: "Brassica", type: "Bacterial", severity: "High", image: "/assets/diseases/brassica/cabbage_black_rot.jpg" },
  { id: "potato-early-blight", name: "Potato Early Blight", nameBn: "আলুর আগাম ধ্বসা", crop: "Potato", type: "Fungal", severity: "Medium", image: "/assets/diseases/potato/potato_early_blight.jpg" },
  { id: "potato-late-blight", name: "Potato Late Blight", nameBn: "আলুর নাবী ধ্বসা", crop: "Potato", type: "Fungal", severity: "High", image: "/assets/diseases/potato/potato_late_blight.jpg" }
];

async function syncDiseases() {
  console.log("Syncing diseases library with correct image paths...");
  
  for (const disease of diseases) {
    const { error } = await supabase
      .from('diseases')
      .upsert(disease, { onConflict: 'id' });
    
    if (error) console.error(`Error syncing ${disease.id}:`, error.message);
    else console.log(`Synced ${disease.id}`);
  }
  
  console.log("Sync complete.");
}

syncDiseases();
