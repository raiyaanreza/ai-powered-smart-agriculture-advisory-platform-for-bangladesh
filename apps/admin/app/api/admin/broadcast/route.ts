import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { authenticateAdmin } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const auth = await authenticateAdmin(request);
    if (!auth.authenticated) return auth.response;

    const { title, message, type, target } = await request.json();
    if (!title || !message || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("notifications")
      .insert([{
        title,
        message,
        type: type.toLowerCase(),
        target_role: target === "All Users" ? "all" : "farmer"
      }]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
