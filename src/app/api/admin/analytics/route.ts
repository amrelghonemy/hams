import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { verifyAdmin, unauthorized } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const user = await verifyAdmin();
  if (!user) return unauthorized();

  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get("days") || "30");
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

    // Get event counts by type
    let events: any[] = [];
    const eventsResult = await supabaseAdmin
      .from("analytics_events")
      .select("event_name, created_at")
      .gte("created_at", since)
      .order("created_at", { ascending: false });
    if (!eventsResult.error) events = eventsResult.data || [];

    // Aggregate events by type
    const eventCounts: Record<string, number> = {};
    const dailyEvents: Record<string, Record<string, number>> = {};

    events.forEach((e: any) => {
      eventCounts[e.event_name] = (eventCounts[e.event_name] || 0) + 1;
      const day = e.created_at.split("T")[0];
      if (!dailyEvents[day]) dailyEvents[day] = {};
      dailyEvents[day][e.event_name] = (dailyEvents[day][e.event_name] || 0) + 1;
    });

    // Get order stats
    let orders: any[] = [];
    const ordersResult = await supabaseAdmin
      .from("orders")
      .select("id, total, status, created_at")
      .gte("created_at", since);
    if (!ordersResult.error) orders = ordersResult.data || [];

    const totalRevenue = orders.reduce((sum: number, o: any) => sum + (o.total || 0), 0);
    const totalOrders = orders.length;
    const completedOrders = orders.filter((o: any) => o.status === "delivered").length;

    // Get product views from events
    const viewContentEvents = events.filter((e: any) => e.event_name === "view_content");
    const addToCartEvents = events.filter((e: any) => e.event_name === "add_to_cart");
    const purchaseEvents = events.filter((e: any) => e.event_name === "purchase");

    // Conversion funnel
    const pageViews = events.filter((e: any) => e.event_name === "page_view").length;

    return NextResponse.json({
      summary: {
        totalEvents: events.length,
        pageViews,
        productViews: viewContentEvents.length,
        addToCarts: addToCartEvents.length,
        purchases: purchaseEvents.length,
        totalRevenue,
        totalOrders,
        completedOrders,
        conversionRate: pageViews > 0 ? ((purchaseEvents.length / pageViews) * 100).toFixed(2) : "0.00",
        cartAbandonmentRate: addToCartEvents.length > 0
          ? (((addToCartEvents.length - purchaseEvents.length) / addToCartEvents.length) * 100).toFixed(2)
          : "0.00",
      },
      eventCounts,
      dailyEvents,
      recentOrders: orders.slice(0, 10),
      period: { days, since },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
