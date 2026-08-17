import { NextResponse } from "next/server";
import db from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort") || "newest";
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sizes = searchParams.get("sizes");
    const colors = searchParams.get("colors");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    let query = "SELECT * FROM products WHERE is_active = 1";
    const params: any[] = [];

    if (category) {
      query += " AND category_id = (SELECT id FROM categories WHERE slug = ?)";
      params.push(category);
    }

    if (search) {
      query += " AND (name_en LIKE ? OR name_ar LIKE ? OR tags LIKE ?)";
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }

    if (minPrice) {
      query += " AND (sale_price IS NOT NULL AND sale_price >= ? OR (sale_price IS NULL AND price >= ?))";
      params.push(parseFloat(minPrice), parseFloat(minPrice));
    }

    if (maxPrice) {
      query += " AND (sale_price IS NOT NULL AND sale_price <= ? OR (sale_price IS NULL AND price <= ?))";
      params.push(parseFloat(maxPrice), parseFloat(maxPrice));
    }

    // Sort
    switch (sort) {
      case "price_asc":
        query += " ORDER BY COALESCE(sale_price, price) ASC";
        break;
      case "price_desc":
        query += " ORDER BY COALESCE(sale_price, price) DESC";
        break;
      case "newest":
        query += " ORDER BY created_at DESC";
        break;
      case "top_rated":
        query += " ORDER BY rating DESC, review_count DESC";
        break;
      case "bestseller":
        query += " ORDER BY is_bestseller DESC, review_count DESC";
        break;
      default:
        query += " ORDER BY created_at DESC";
    }

    // Count total
    const countQuery = query.replace("SELECT *", "SELECT COUNT(*) as total");
    const countResult = db.prepare(countQuery).get(...params) as any;
    const total = countResult?.total || 0;

    // Pagination
    query += " LIMIT ? OFFSET ?";
    params.push(limit, (page - 1) * limit);

    const products = db.prepare(query).all(...params);

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
