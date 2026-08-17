import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { verifyAdmin, unauthorized } from "@/lib/auth";

export const dynamic = "force-dynamic";

const DEFAULTS: Record<string, string> = {
  meta_pixel_id: "",
  meta_access_token: "",
  meta_test_event_code: "",
  ga_measurement_id: "",
  tiktok_pixel_id: "",
  snapchat_pixel_id: "",
};

export async function GET() {
  const user = await verifyAdmin();
  if (!user) return unauthorized();

  try {
    const { data } = await supabaseAdmin.from("marketing_settings").select("key, value");
    const settings: Record<string, string> = { ...DEFAULTS };
    (data || []).forEach((row: any) => { settings[row.key] = row.value; });
    return NextResponse.json({ settings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const user = await verifyAdmin();
  if (!user) return unauthorized();

  try {
    const body = await request.json();
    const updates = Object.entries(body).filter(([k]) => k in DEFAULTS);
    for (const [key, value] of updates) {
      await supabaseAdmin
        .from("marketing_settings")
        .upsert({ key, value: value || "", updated_at: new Date().toISOString() }, { onConflict: "key" });
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
