import { NextResponse } from "next/server";
import db from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const product = db.prepare(`
      SELECT p.*, c.name_en as category_name_en, c.name_ar as category_name_ar, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.slug = ? AND p.is_active = 1
    `).get(slug);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Get related products
    const related = db.prepare(`
      SELECT * FROM products
      WHERE category_id = ? AND id != ? AND is_active = 1
      ORDER BY RANDOM() LIMIT 4
    `).all((product as any).category_id, (product as any).id);

    // Get reviews
    const reviews = db.prepare(`
      SELECT * FROM reviews WHERE product_id = ? AND is_approved = 1
      ORDER BY created_at DESC LIMIT 10
    `).all((product as any).id);

    return NextResponse.json({ product, related, reviews });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
