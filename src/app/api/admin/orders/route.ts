import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { verifyAdmin, unauthorized } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await verifyAdmin();
  if (!user) return unauthorized();
  try {
    const { data: orders } = await supabaseAdmin
      .from("orders")
      .select("*, items:order_items(*)")
      .order("created_at", { ascending: false })
      .limit(50);

    return NextResponse.json({ orders: orders || [] });
  } catch (error) {
    return NextResponse.json({ orders: [] });
  }
}

export async function PATCH(request: Request) {
  const user = await verifyAdmin();
  if (!user) return unauthorized();
  try {
    const { id, status } = await request.json();

    const { error } = await supabaseAdmin
      .from("orders")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
