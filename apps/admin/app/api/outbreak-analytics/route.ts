import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { authenticateAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const auth = await authenticateAdmin(request);
    if (!auth.authenticated) return auth.response;

    const [reportsRes, diagnosesRes] = await Promise.all([
      supabaseAdmin.from("reports").select("*").order("created_at", { ascending: false }),
      supabaseAdmin.from("diagnoses").select("disease_detected, confidence_score, created_at").order("created_at", { ascending: false }).limit(200),
    ]);
    
    if (reportsRes.error) {
      return NextResponse.json({ error: reportsRes.error.message }, { status: 500 });
    }
    
    if (diagnosesRes.error) {
      return NextResponse.json({ error: diagnosesRes.error.message }, { status: 500 });
    }
    
    return NextResponse.json({
      reports: reportsRes.data || [],
      diagnoses: diagnosesRes.data || []
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
