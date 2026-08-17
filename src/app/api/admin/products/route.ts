import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { data: products } = await supabaseAdmin
      .from("products")
      .select("*, category:categories(name_en, name_ar)")
      .order("created_at", { ascending: false });

    return NextResponse.json({ products: products || [] });
  } catch (error) {
    return NextResponse.json({ products: [] });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name_en, name_ar, slug, description_en, description_ar,
      price, sale_price, category_id, sku, stock,
      sizes, colors, images, is_new, is_bestseller, is_active,
      tags, meta_title_en, meta_title_ar, meta_description_en, meta_description_ar,
    } = body;

    const productSlug = slug || name_en.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    const { data, error } = await supabaseAdmin
      .from("products")
      .insert({
        name_en,
        name_ar,
        slug: productSlug,
        description_en: description_en || "",
        description_ar: description_ar || "",
        price,
        sale_price: sale_price || null,
        category_id: category_id || null,
        sku: sku || "",
        stock: stock || 0,
        sizes: sizes || [],
        colors: colors || [],
        images: images || [],
        is_new: is_new || false,
        is_bestseller: is_bestseller || false,
        is_active: is_active !== undefined ? is_active : true,
        tags: tags || [],
        meta_title_en: meta_title_en || "",
        meta_title_ar: meta_title_ar || "",
        meta_description_en: meta_description_en || "",
        meta_description_ar: meta_description_ar || "",
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, id: data.id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const { error } = await supabaseAdmin
      .from("products")
      .update(updates)
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const { error } = await supabaseAdmin
      .from("products")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
