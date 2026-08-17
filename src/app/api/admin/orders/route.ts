import { NextResponse } from "next/server";
import db from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const orders = db.prepare(`
      SELECT * FROM orders ORDER BY created_at DESC LIMIT 50
    `).all();
    return NextResponse.json({ orders });
  } catch (error) {
    return NextResponse.json({ orders: [] });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, status } = await request.json();
    db.prepare("UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(status, id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
