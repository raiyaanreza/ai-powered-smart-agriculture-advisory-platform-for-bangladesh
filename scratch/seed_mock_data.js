const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: 'e:/agri-ai-platform/apps/web/.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedData() {
  console.log("Seeding mock data for demonstration...");

  // 1. Mock Profiles
  const { data: users, error: userError } = await supabase.from('profiles').select('id');
  if (userError) console.error("Error fetching users:", userError.message);
  
  const userId = users && users.length > 0 ? users[0].id : '00000000-0000-0000-0000-000000000000';

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
    },
    {
      farmer_id: userId,
      crop_detected: "Brassica",
      disease_detected: "Brassica - Alternaria Leaf Spot",
      confidence_score: 0.75,
      severity: "Medium",
      expert_notes: "Ensure proper spacing and remove infected leaves.",
      district: "Dinajpur",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString()
    }
  ];

  const { error: diagError } = await supabase.from('diagnoses').upsert(mockDiagnoses, { onConflict: 'disease_detected,created_at' });
  if (diagError) console.error("Error seeding diagnoses:", diagError.message);
  else console.log("Seeded diagnoses successfully.");

  // 3. Mock Reports (for the Outbreak Map)
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
    },
    {
      disease_name: "Wheat Rust",
      latitude: 25.6217,
      longitude: 88.6354,
      severity: "High",
      location_name: "Dinajpur",
      created_at: new Date().toISOString()
    }
  ];

  const { error: reportError } = await supabase.from('reports').upsert(mockReports, { onConflict: 'disease_name,location_name' });
  if (reportError) console.error("Error seeding reports:", reportError.message);
  else console.log("Seeded reports successfully.");

  console.log("Seeding complete.");
}

seedData();
