import { NextResponse } from "next/server";
import db from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const discounts = db.prepare("SELECT * FROM discount_codes ORDER BY created_at DESC").all();
    return NextResponse.json({ discounts });
  } catch (error) {
    return NextResponse.json({ discounts: [] });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, type, value, min_order, max_uses, expires_at } = body;

    const result = db.prepare(`
      INSERT INTO discount_codes (code, type, value, min_order, max_uses, expires_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(code, type, value, min_order || 0, max_uses || null, expires_at || null);

    return NextResponse.json({
      success: true,
      discount: { id: result.lastInsertRowid, code, type, value, used_count: 0, is_active: 1 },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
