import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [productsRes, ordersRes, revenueRes, customersRes] = await Promise.all([
      supabaseAdmin.from("products").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("orders").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("orders").select("total").neq("status", "cancelled"),
      supabaseAdmin.from("orders").select("customer_phone"),
    ]);

    const products = productsRes.count || 0;
    const orders = ordersRes.count || 0;
    const revenue = (revenueRes.data || []).reduce((sum: number, o: any) => sum + (o.total || 0), 0);

    const uniquePhones = new Set((customersRes.data || []).map((o: any) => o.customer_phone));
    const customers = uniquePhones.size;

    return NextResponse.json({
      products,
      orders,
      revenue,
      customers,
    });
  } catch (error) {
    return NextResponse.json({ products: 0, orders: 0, revenue: 0, customers: 0 });
  }
}
