import { NextResponse } from "next/server";
import db from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const products = db.prepare("SELECT COUNT(*) as count FROM products").get() as any;
    const orders = db.prepare("SELECT COUNT(*) as count FROM orders").get() as any;
    const revenue = db.prepare("SELECT COALESCE(SUM(total), 0) as total FROM orders WHERE status != 'cancelled'").get() as any;
    const customers = db.prepare("SELECT COUNT(DISTINCT customer_phone) as count FROM orders").get() as any;

    return NextResponse.json({
      products: products?.count || 0,
      orders: orders?.count || 0,
      revenue: revenue?.total || 0,
      customers: customers?.count || 0,
    });
  } catch (error) {
    return NextResponse.json({ products: 0, orders: 0, revenue: 0, customers: 0 });
  }
}
