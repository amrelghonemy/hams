import { NextResponse } from "next/server";
import db from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const categories = db.prepare("SELECT * FROM categories ORDER BY sort_order").all();
    return NextResponse.json({ categories });
  } catch (error) {
    return NextResponse.json({ categories: [] });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name_en, name_ar, slug, description_en, description_ar } = body;
    const categorySlug = slug || name_en.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const result = db.prepare(`
      INSERT INTO categories (name_en, name_ar, slug, description_en, description_ar)
      VALUES (?, ?, ?, ?, ?)
    `).run(name_en, name_ar, categorySlug, description_en || "", description_ar || "");

    return NextResponse.json({
      success: true,
      category: { id: result.lastInsertRowid, name_en, name_ar, slug: categorySlug },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
