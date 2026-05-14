const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://lhnucgxjultsrkjvsjrz.supabase.co";
const serviceRoleKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxobnVjZ3hqdWx0c3JranZzanJ6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODc4Mjg4OSwiZXhwIjoyMDk0MzU4ODg5fQ.ohLFbWBtaXkf8V-vTV_8kN38vpi6dv9Y7A0S98cvi14";

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function checkUser() {
  const email = 'khanraiyanibnereza@gmail.com';
  
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) {
    console.error("Error listing users:", listError);
    return;
  }

  const user = users.find(u => u.email === email);
  if (!user) {
    console.log("User not found in Auth");
    return;
  }
  
  console.log("Auth User:", JSON.stringify(user, null, 2));

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileError) {
    console.error("Error fetching profile:", profileError);
  } else {
    console.log("Profile Data:", JSON.stringify(profile, null, 2));
  }
}

checkUser();
