import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { data: categories } = await supabaseAdmin
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true });

    return NextResponse.json({ categories: categories || [] });
  } catch (error) {
    return NextResponse.json({ categories: [] });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name_en, name_ar, slug, description_en, description_ar, image, sort_order } = body;
    const categorySlug = slug || name_en.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const { data, error } = await supabaseAdmin
      .from("categories")
      .insert({
        name_en,
        name_ar,
        slug: categorySlug,
        description_en: description_en || "",
        description_ar: description_ar || "",
        image: image || "",
        sort_order: sort_order || 0,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, category: data });
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
      .from("categories")
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
      .from("categories")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
