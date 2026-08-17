import { NextResponse } from "next/server";
import db from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const products = db.prepare(`
      SELECT p.*, c.name_en as category_name_en, c.name_ar as category_name_ar
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.created_at DESC
    `).all();
    return NextResponse.json({ products });
  } catch (error) {
    return NextResponse.json({ products: [] });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name_en, name_ar, slug, description_en, description_ar, price, sale_price, category_id, sku, stock, sizes, colors, images, is_new, is_bestseller, is_active } = body;

    const productSlug = slug || name_en.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    const result = db.prepare(`
      INSERT INTO products (name_en, name_ar, slug, description_en, description_ar, price, sale_price, category_id, sku, stock, sizes, colors, images, is_new, is_bestseller, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(name_en, name_ar, productSlug, description_en || "", description_ar || "", price, sale_price, category_id || null, sku || "", stock || 0, sizes || "[]", colors || "[]", images || "[]", is_new || 0, is_bestseller || 0, is_active !== undefined ? is_active : 1);

    return NextResponse.json({ success: true, id: result.lastInsertRowid });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    db.prepare("DELETE FROM products WHERE id = ?").run(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
