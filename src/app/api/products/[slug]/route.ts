import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const { data: product, error } = await supabase
      .from("products")
      .select("*, category:categories(name_en, name_ar, slug)")
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    if (error || !product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const { data: related } = await supabase
      .from("products")
      .select("*")
      .eq("category_id", product.category_id)
      .eq("is_active", true)
      .neq("id", product.id)
      .limit(4);

    const { data: reviews } = await supabase
      .from("reviews")
      .select("*")
      .eq("product_id", product.id)
      .eq("is_approved", true)
      .order("created_at", { ascending: false })
      .limit(10);

    return NextResponse.json({ product, related: related || [], reviews: reviews || [] });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
