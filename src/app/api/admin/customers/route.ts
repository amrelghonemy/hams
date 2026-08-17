import { NextResponse } from "next/server";
import db from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const customers = db.prepare(`
      SELECT
        customer_name as name,
        customer_email as email,
        customer_phone as phone,
        COUNT(*) as order_count,
        SUM(total) as total_spent
      FROM orders
      GROUP BY customer_phone
      ORDER BY total_spent DESC
    `).all();
    return NextResponse.json({ customers });
  } catch (error) {
    return NextResponse.json({ customers: [] });
  }
}
