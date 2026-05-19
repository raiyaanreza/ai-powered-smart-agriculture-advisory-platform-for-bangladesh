import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { authenticateAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET stats and pending farmers list
export async function GET(request: Request) {
  try {
    const auth = await authenticateAdmin(request);
    if (!auth.authenticated) return auth.response;

    const [usersCountRes, diagCountRes, pendingRes] = await Promise.all([
      supabaseAdmin.from("profiles").select("*", { count: 'exact', head: true }),
      supabaseAdmin.from("diagnoses").select("*", { count: 'exact', head: true }),
      supabaseAdmin.from("profiles").select("*").eq("role", "farmer").eq("is_verified", false)
    ]);

    if (usersCountRes.error) return NextResponse.json({ error: usersCountRes.error.message }, { status: 500 });
    if (diagCountRes.error) return NextResponse.json({ error: diagCountRes.error.message }, { status: 500 });
    if (pendingRes.error) return NextResponse.json({ error: pendingRes.error.message }, { status: 500 });

    return NextResponse.json({
      totalUsers: usersCountRes.count || 0,
      diagnosesCount: diagCountRes.count || 0,
      pendingFarmers: pendingRes.data || []
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST to verify/approve a farmer
export async function POST(request: Request) {
  try {
    const auth = await authenticateAdmin(request);
    if (!auth.authenticated) return auth.response;

    const { farmerId, approve } = await request.json();
    if (!farmerId) {
      return NextResponse.json({ error: "Missing farmerId" }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("profiles")
      .update({ is_verified: approve, role: approve ? "farmer" : "user" })
      .eq("id", farmerId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
