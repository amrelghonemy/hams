import { NextResponse } from "next/server";
import db from "@/lib/db";
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

    // Calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = db.prepare("SELECT * FROM products WHERE id = ?").get(item.product_id) as any;
      if (!product) continue;

      const price = product.sale_price || product.price;
      const itemTotal = price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        product_id: product.id,
        product_name_en: product.name_en,
        product_name_ar: product.name_ar,
        product_image: JSON.parse(product.images || "[]")[0] || "",
        size: item.size || "",
        color: item.color || "",
        quantity: item.quantity,
        price,
      });
    }

    // Apply discount
    let discount_amount = 0;
    if (discount_code) {
      const discount = db.prepare(
        "SELECT * FROM discount_codes WHERE code = ? AND is_active = 1"
      ).get(discount_code) as any;

      if (discount) {
        if (discount.type === "percentage") {
          discount_amount = (subtotal * discount.value) / 100;
        } else {
          discount_amount = Math.min(discount.value, subtotal);
        }
        db.prepare("UPDATE discount_codes SET used_count = used_count + 1 WHERE id = ?").run(discount.id);
      }
    }

    const shipping_cost = subtotal >= 500 ? 0 : 50;
    const total = subtotal - discount_amount + shipping_cost;
    const order_number = generateOrderNumber();

    // Create order
    const result = db.prepare(`
      INSERT INTO orders (order_number, customer_name, customer_email, customer_phone,
        governorate, city, area, street, building, apartment, address_notes,
        subtotal, shipping_cost, discount_amount, total, payment_method, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      order_number, customer_name, customer_email || "", customer_phone,
      governorate, city, area, street, building, apartment, address_notes,
      subtotal, shipping_cost, discount_amount, total, payment_method || "cod", notes
    );

    const orderId = result.lastInsertRowid;

    // Create order items
    const insertItem = db.prepare(`
      INSERT INTO order_items (order_id, product_id, product_name_en, product_name_ar,
        product_image, size, color, quantity, price)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const item of orderItems) {
      insertItem.run(
        orderId, item.product_id, item.product_name_en, item.product_name_ar,
        item.product_image, item.size, item.color, item.quantity, item.price
      );

      // Update stock
      db.prepare("UPDATE products SET stock = stock - ? WHERE id = ?")
        .run(item.quantity, item.product_id);
    }

    return NextResponse.json({
      success: true,
      order: {
        id: orderId,
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
      const order = db.prepare(`
        SELECT * FROM orders WHERE order_number = ? AND customer_phone = ?
      `).get(orderNumber, phone);

      if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      const items = db.prepare("SELECT * FROM order_items WHERE order_id = ?").get((order as any).id);
      return NextResponse.json({ order, items: [items] });
    }

    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
