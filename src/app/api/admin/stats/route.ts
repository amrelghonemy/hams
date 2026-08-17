import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { verifyAdmin, unauthorized } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await verifyAdmin();
  if (!user) return unauthorized();

  try {
    const [productsRes, ordersRes, ordersListRes] = await Promise.all([
      supabaseAdmin.from("products").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("orders").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("orders").select("total, customer_phone, status"),
    ]);

    const products = productsRes.count || 0;
    const orders = ordersRes.count || 0;
    const ordersList = ordersListRes.data || [];
    const revenue = ordersList
      .filter((o: any) => o.status !== "cancelled")
      .reduce((sum: number, o: any) => sum + (o.total || 0), 0);
    const uniquePhones = new Set(ordersList.map((o: any) => o.customer_phone).filter(Boolean));
    const customers = uniquePhones.size;

    return NextResponse.json({ products, orders, revenue, customers });
  } catch (error) {
    return NextResponse.json({ products: 0, orders: 0, revenue: 0, customers: 0 });
  }
}
