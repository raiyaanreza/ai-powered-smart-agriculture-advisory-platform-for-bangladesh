import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request: Request) {
  try {
    const { updates } = await request.json();
    if (!updates || !updates.id) {
      return NextResponse.json({ error: "Missing updates content or user ID" }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('profiles')
      .upsert(updates);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
