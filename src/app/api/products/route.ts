import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort") || "newest";
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    let query = supabase.from("products").select("*", { count: "exact" }).eq("is_active", true);

    if (category) {
      const { data: cat } = await supabase.from("categories").select("id").eq("slug", category).single();
      if (cat) {
        query = query.eq("category_id", cat.id);
      }
    }

    if (search) {
      query = query.or(`name_en.ilike.%${search}%,name_ar.ilike.%${search}%,tags.cs.{${search}}`);
    }

    if (minPrice) {
      const mp = parseFloat(minPrice);
      query = query.or(`and(sale_price.is.not.null,sale_price.gte.${mp}),and(sale_price.is.null,price.gte.${mp})`);
    }

    if (maxPrice) {
      const mp = parseFloat(maxPrice);
      query = query.or(`and(sale_price.is.not.null,sale_price.lte.${mp}),and(sale_price.is.null,price.lte.${mp})`);
    }

    switch (sort) {
      case "price_asc":
        query = query.order("price", { ascending: true });
        break;
      case "price_desc":
        query = query.order("price", { ascending: false });
        break;
      case "top_rated":
        query = query.order("rating", { ascending: false });
        break;
      case "bestseller":
        query = query.order("is_bestseller", { ascending: false });
        break;
      default:
        query = query.order("created_at", { ascending: false });
    }

    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data: products, count, error } = await query;

    if (error) throw error;

    return NextResponse.json({
      products: products || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
