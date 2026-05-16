import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lhnucgxjultsrkjvsjrz.supabase.co';
// Use process.env for the service key to ensure it only exists on the server side
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy_key_for_build';

if (!supabaseServiceKey) {
  console.warn("SUPABASE_SERVICE_ROLE_KEY is not set in environment variables.");
}

// Admin client — uses service_role key to bypass RLS for data reads
// MUST ONLY BE USED IN SERVER COMPONENTS OR API ROUTES
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});
