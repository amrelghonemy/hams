import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { verifyAdmin, unauthorized } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const user = await verifyAdmin();
  if (!user) return unauthorized();

  try {
    // Create analytics_events table
    const { error: e1 } = await supabaseAdmin.rpc("exec_sql", {
      sql: `
        CREATE TABLE IF NOT EXISTS analytics_events (
          id BIGSERIAL PRIMARY KEY,
          event_name TEXT NOT NULL,
          event_data JSONB DEFAULT '{}'::jsonb,
          page_url TEXT,
          user_agent TEXT,
          ip_address TEXT,
          visitor_id TEXT,
          session_id TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `,
    });

    // If exec_sql doesn't exist, try direct SQL via the REST API
    // Fallback: we'll create the tables using raw SQL through the Supabase SQL API
    if (e1) {
      // Try the /rest/v1 approach with raw SQL
      const { error: e2 } = await supabaseAdmin
        .from("analytics_events")
        .select("id")
        .limit(1);

      if (e2 && e2.code === "42P01") {
        // Table doesn't exist, we need the user to run the migration manually
        return NextResponse.json({
          success: false,
          message: "Tables not found. Please run the migration SQL in your Supabase dashboard SQL Editor.",
          sql: `
CREATE TABLE IF NOT EXISTS analytics_events (
  id BIGSERIAL PRIMARY KEY,
  event_name TEXT NOT NULL,
  event_data JSONB DEFAULT '{}'::jsonb,
  page_url TEXT, user_agent TEXT, ip_address TEXT,
  visitor_id TEXT, session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_analytics_events_name ON analytics_events(event_name);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created ON analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_events_visitor ON analytics_events(visitor_id);

CREATE TABLE IF NOT EXISTS marketing_settings (
  id BIGSERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
INSERT INTO marketing_settings (key, value) VALUES
  ('meta_pixel_id', ''), ('meta_access_token', ''), ('meta_test_event_code', ''),
  ('ga_measurement_id', ''), ('tiktok_pixel_id', ''), ('snapchat_pixel_id', '')
ON CONFLICT (key) DO NOTHING;
          `,
        });
      }
    }

    // Tables exist or were created, verify marketing_settings
    const { data, error: e3 } = await supabaseAdmin
      .from("marketing_settings")
      .select("key");

    if (e3) {
      return NextResponse.json({ success: false, error: e3.message });
    }

    return NextResponse.json({
      success: true,
      message: "Migration complete",
      tables: { marketing_settings: data?.length || 0 },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
