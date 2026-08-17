import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const subtotal = parseFloat(searchParams.get("subtotal") || "0");

    if (!code) {
      return NextResponse.json({ error: "Code required" }, { status: 400 });
    }

    const { data: discount } = await supabase
      .from("discount_codes")
      .select("*")
      .eq("code", code)
      .eq("is_active", true)
      .single();

    if (!discount) {
      return NextResponse.json({ error: "Invalid code" }, { status: 404 });
    }

    if (discount.max_uses && discount.used_count >= discount.max_uses) {
      return NextResponse.json({ error: "Code expired" }, { status: 400 });
    }

    if (discount.expires_at && new Date(discount.expires_at) < new Date()) {
      return NextResponse.json({ error: "Code expired" }, { status: 400 });
    }

    if (subtotal < discount.min_order) {
      return NextResponse.json({ error: `Minimum order: ${discount.min_order}` }, { status: 400 });
    }

    let amount = 0;
    if (discount.type === "percentage") {
      amount = (subtotal * discount.value) / 100;
    } else {
      amount = Math.min(discount.value, subtotal);
    }

    return NextResponse.json({ discount: { amount, code: discount.code, type: discount.type, value: discount.value } });
  } catch (error) {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
