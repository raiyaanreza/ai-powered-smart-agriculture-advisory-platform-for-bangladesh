import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lhnucgxjultsrkjvsjrz.supabase.co';
// WARNING: Do not put your service_role key here. 
// This anon key is safe for public client-side use.
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxobnVjZ3hqdWx0c3JranZzanJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3ODI4ODksImV4cCI6MjA5NDM1ODg4OX0.O6TIB_MO5Ss0Sl5C7TXjg9z2Xhp9IT_UsWsPz1_34PE';

// Standard client — uses real anon key so Supabase Auth works correctly
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
