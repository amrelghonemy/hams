import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { data } = await supabaseAdmin
      .from("marketing_settings")
      .select("key, value");

    const settings: Record<string, string> = {};
    (data || []).forEach((row: any) => {
      if (row.value) settings[row.key] = row.value;
    });

    return NextResponse.json(settings, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
    });
  } catch {
    return NextResponse.json({});
  }
}
