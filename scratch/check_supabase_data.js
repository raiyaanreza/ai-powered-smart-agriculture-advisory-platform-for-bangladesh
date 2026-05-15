const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: 'e:/agri-ai-platform/apps/web/.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function checkData() {
  console.log("Checking Supabase tables for data...");
  
  const tables = ['profiles', 'diagnoses', 'reports', 'farms'];
  
  for (const table of tables) {
    const { count, error } = await supabaseAdmin
      .from(table)
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error(`Error checking table ${table}:`, error.message);
    } else {
      console.log(`Table '${table}': ${count} rows`);
    }
  }

  // Check recent diagnoses
  const { data: recent, error: recErr } = await supabaseAdmin
    .from('diagnoses')
    .select('*')
    .limit(5);
  
  if (recent) {
    console.log("\nRecent 5 diagnoses:");
    console.table(recent.map(d => ({
      id: d.id,
      crop: d.crop_detected,
      disease: d.disease_detected,
      created_at: d.created_at
    })));
  }
}

checkData();
