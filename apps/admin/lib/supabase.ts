import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lhnucgxjultsrkjvsjrz.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxobnVjZ3hqdWx0c3JranZzanJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3ODI4ODksImV4cCI6MjA5NDM1ODg4OX0.O6TIB_MO5Ss0Sl5C7TXjg9z2Xhp9IT_UsWsPz1_34PE';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Standard client — uses real anon key so Supabase Auth works correctly
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client — uses service_role key to bypass RLS for all data reads
export const supabaseAdmin = typeof window === 'undefined' && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    })
  : null as any;
