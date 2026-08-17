import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { data: orders } = await supabaseAdmin
      .from("orders")
      .select("customer_name, customer_email, customer_phone, total");

    const customerMap = new Map<string, any>();

    for (const order of orders || []) {
      const key = order.customer_phone;
      if (!customerMap.has(key)) {
        customerMap.set(key, {
          name: order.customer_name,
          email: order.customer_email,
          phone: order.customer_phone,
          order_count: 0,
          total_spent: 0,
        });
      }
      const c = customerMap.get(key);
      c.order_count += 1;
      c.total_spent += order.total || 0;
    }

    const customers = Array.from(customerMap.values()).sort(
      (a, b) => b.total_spent - a.total_spent
    );

    return NextResponse.json({ customers });
  } catch (error) {
    return NextResponse.json({ customers: [] });
  }
}
