import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { verifyAdmin, unauthorized } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await verifyAdmin();
  if (!user) return unauthorized();
  try {
    const { data: discounts } = await supabaseAdmin
      .from("discount_codes")
      .select("*")
      .order("created_at", { ascending: false });

    return NextResponse.json({ discounts: discounts || [] });
  } catch (error) {
    return NextResponse.json({ discounts: [] });
  }
}

export async function POST(request: Request) {
  const user = await verifyAdmin();
  if (!user) return unauthorized();
  try {
    const body = await request.json();
    const { code, type, value, min_order, max_uses, expires_at } = body;

    const { data, error } = await supabaseAdmin
      .from("discount_codes")
      .insert({
        code,
        type,
        value,
        min_order: min_order || 0,
        max_uses: max_uses || null,
        expires_at: expires_at || null,
        used_count: 0,
        is_active: true,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, discount: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const user = await verifyAdmin();
  if (!user) return unauthorized();
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const { error } = await supabaseAdmin
      .from("discount_codes")
      .update(updates)
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const user = await verifyAdmin();
  if (!user) return unauthorized();
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const { error } = await supabaseAdmin
      .from("discount_codes")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
