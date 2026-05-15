import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lhnucgxjultsrkjvsjrz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxobnVjZ3hqdWx0c3JranZzanJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3ODI4ODksImV4cCI6MjA5NDM1ODg4OX0.O6TIB_MO5Ss0Sl5C7TXjg9z2Xhp9IT_UsWsPz1_34PE';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxobnVjZ3hqdWx0c3JranZzanJ6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODc4Mjg4OSwiZXhwIjoyMDk0MzU4ODg5fQ.ohLFbWBtaXkf8V-vTV_8kN38vpi6dv9Y7A0S98cvi14';

// Standard client — uses real anon key so Supabase Auth works correctly
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client — uses service_role key to bypass RLS for data reads
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});
