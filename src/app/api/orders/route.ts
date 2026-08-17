import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { generateOrderNumber } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      customer_name,
      customer_email,
      customer_phone,
      governorate,
      city,
      area,
      street,
      building,
      apartment,
      address_notes,
      items,
      payment_method,
      discount_code,
      notes,
    } = body;

    if (!customer_name || !customer_phone || !items?.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const { data: product } = await supabaseAdmin
        .from("products")
        .select("*")
        .eq("id", item.product_id)
        .single();

      if (!product) continue;

      const price = product.sale_price || product.price;
      const itemTotal = price * item.quantity;
      subtotal += itemTotal;

      const images = Array.isArray(product.images) ? product.images : [];

      orderItems.push({
        product_id: product.id,
        product_name_en: product.name_en,
        product_name_ar: product.name_ar,
        product_image: images[0] || "",
        size: item.size || "",
        color: item.color || "",
        quantity: item.quantity,
        price,
      });
    }

    let discount_amount = 0;
    if (discount_code) {
      const { data: discount } = await supabaseAdmin
        .from("discount_codes")
        .select("*")
        .eq("code", discount_code)
        .eq("is_active", true)
        .single();

      if (discount) {
        if (discount.type === "percentage") {
          discount_amount = (subtotal * discount.value) / 100;
        } else {
          discount_amount = Math.min(discount.value, subtotal);
        }
        await supabaseAdmin
          .from("discount_codes")
          .update({ used_count: discount.used_count + 1 })
          .eq("id", discount.id);
      }
    }

    const shipping_cost = subtotal >= 500 ? 0 : 50;
    const total = subtotal - discount_amount + shipping_cost;
    const order_number = generateOrderNumber();

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        order_number,
        customer_name,
        customer_email: customer_email || "",
        customer_phone,
        governorate,
        city,
        area,
        street,
        building,
        apartment,
        address_notes,
        subtotal,
        shipping_cost,
        discount_amount,
        total,
        payment_method: payment_method || "cod",
        notes,
      })
      .select()
      .single();

    if (orderError) throw orderError;

    const orderItemsToInsert = orderItems.map((item) => ({
      order_id: order.id,
      ...item,
    }));

    if (orderItemsToInsert.length > 0) {
      const { error: itemsError } = await supabaseAdmin
        .from("order_items")
        .insert(orderItemsToInsert);

      if (itemsError) throw itemsError;
    }

    for (const item of orderItems) {
      const { data: prod } = await supabaseAdmin
        .from("products")
        .select("stock")
        .eq("id", item.product_id)
        .single();

      if (prod) {
        await supabaseAdmin
          .from("products")
          .update({ stock: prod.stock - item.quantity })
          .eq("id", item.product_id);
      }
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        order_number,
        total,
      },
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderNumber = searchParams.get("order_number");
    const phone = searchParams.get("phone");

    if (orderNumber && phone) {
      const { data: order, error } = await supabaseAdmin
        .from("orders")
        .select("*")
        .eq("order_number", orderNumber)
        .eq("customer_phone", phone)
        .single();

      if (error || !order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      const { data: items } = await supabaseAdmin
        .from("order_items")
        .select("*")
        .eq("order_id", order.id);

      return NextResponse.json({ order, items: items || [] });
    }

    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
