-- Run this in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/ltujuteownvobmqdaenn/sql

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
  ('meta_pixel_id', ''),
  ('meta_access_token', ''),
  ('meta_test_event_code', ''),
  ('ga_measurement_id', ''),
  ('tiktok_pixel_id', ''),
  ('snapchat_pixel_id', '')
ON CONFLICT (key) DO NOTHING;
