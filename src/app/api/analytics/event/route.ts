import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
const META_TEST_EVENT_CODE = process.env.META_TEST_EVENT_CODE;

function hashData(data: string): string {
  return crypto.createHash("sha256").update(data.toLowerCase().trim()).digest("hex");
}

async function sendToMeta(events: any[]) {
  if (!META_PIXEL_ID || !META_ACCESS_TOKEN) return null;

  const url = `https://graph.facebook.com/v21.0/${META_PIXEL_ID}/events?access_token=${META_ACCESS_TOKEN}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      data: events,
      ...(META_TEST_EVENT_CODE && { test_event_code: META_TEST_EVENT_CODE }),
    }),
  });

  return response.json();
}

function buildEvent(event_name: string, event_data: Record<string, any>, event_id: string) {
  const now = Math.floor(Date.now() / 1000);

  const base: any = {
    event_name,
    event_time: now,
    event_id,
    action_source: "website",
    event_source_url: event_data.page || "https://hams-style.vercel.app",
    user_data: {
      fbp: event_data._fbp || undefined,
      fbc: event_data._fbc || undefined,
      client_ip_address: event_data._ip || undefined,
      client_user_agent: event_data._ua || undefined,
    },
  };

  if (event_data.email) {
    base.user_data.em = hashData(event_data.email);
  }
  if (event_data.phone) {
    base.user_data.ph = hashData(event_data.phone);
  }

  switch (event_name) {
    case "PageView":
      base.custom_data = { content_name: event_data.page };
      break;
    case "ViewContent":
      base.custom_data = {
        content_ids: [event_data.id],
        content_type: "product",
        content_name: event_data.name,
        value: event_data.price,
        currency: "EGP",
      };
      break;
    case "AddToCart":
      base.custom_data = {
        content_ids: [event_data.id],
        content_type: "product",
        content_name: event_data.name,
        value: event_data.price * (event_data.quantity || 1),
        currency: "EGP",
        contents: [{ id: event_data.id, quantity: event_data.quantity || 1, item_price: event_data.price }],
      };
      break;
    case "InitiateCheckout":
      base.custom_data = {
        content_ids: (event_data.products || []).map((p: any) => p.id),
        num_items: (event_data.products || []).reduce((s: number, p: any) => s + (p.quantity || 1), 0),
        value: event_data.value,
        currency: "EGP",
      };
      break;
    case "Purchase":
      base.custom_data = {
        content_ids: (event_data.products || []).map((p: any) => p.id),
        content_type: "product",
        num_items: (event_data.products || []).reduce((s: number, p: any) => s + (p.quantity || 1), 0),
        value: event_data.value,
        currency: "EGP",
        order_id: event_data.orderId,
      };
      break;
    case "Search":
      base.custom_data = { search_string: event_data.query };
      break;
    default:
      base.custom_data = event_data;
      break;
  }

  return base;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { event_name, event_data = {} } = body;

    if (!event_name) {
      return NextResponse.json({ error: "event_name required" }, { status: 400 });
    }

    const event_id = crypto.randomUUID();
    const event = buildEvent(event_name, event_data, event_id);

    let metaResult = null;
    if (META_PIXEL_ID && META_ACCESS_TOKEN) {
      metaResult = await sendToMeta([event]);
    }

    return NextResponse.json({ success: true, event_id, meta: metaResult });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
