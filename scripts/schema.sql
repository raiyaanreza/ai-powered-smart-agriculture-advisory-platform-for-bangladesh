-- AgriVision Platform - Full Database Schema
-- Run this in Supabase SQL Editor FIRST before seeding

-- ─────────────────────────────────────────────
-- 1. PROFILES (farmers + admins)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name         TEXT,
  email             TEXT UNIQUE,
  role              TEXT DEFAULT 'farmer' CHECK (role IN ('farmer','admin','user')),
  is_verified       BOOLEAN DEFAULT FALSE,
  district          TEXT,
  phone             TEXT,
  farm_size_acres   NUMERIC(6,2),
  primary_crop      TEXT,
  avatar_url        TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- 2. DIAGNOSES
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS diagnoses (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id         UUID REFERENCES profiles(id) ON DELETE CASCADE,
  crop_detected     TEXT NOT NULL,
  disease_detected  TEXT NOT NULL,
  confidence_score  NUMERIC(4,3),
  severity          TEXT CHECK (severity IN ('Low','Medium','High')),
  district          TEXT,
  latitude          NUMERIC(9,6),
  longitude         NUMERIC(9,6),
  expert_reviewed   BOOLEAN DEFAULT FALSE,
  ai_recommendation TEXT,
  image_url         TEXT,
  notes             TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_diagnoses_farmer   ON diagnoses(farmer_id);
CREATE INDEX IF NOT EXISTS idx_diagnoses_date     ON diagnoses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_diagnoses_disease  ON diagnoses(disease_detected);

-- ─────────────────────────────────────────────
-- 3. OUTBREAK REPORTS (GIS map)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reports (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  disease_name        TEXT NOT NULL,
  crop                TEXT,
  latitude            NUMERIC(9,6) NOT NULL,
  longitude           NUMERIC(9,6) NOT NULL,
  severity            TEXT CHECK (severity IN ('Low','Medium','High')),
  location_name       TEXT,
  affected_area_acres NUMERIC(8,2),
  reported_by         TEXT,
  status              TEXT DEFAULT 'active' CHECK (status IN ('active','monitoring','resolved')),
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_date   ON reports(created_at DESC);

-- ─────────────────────────────────────────────
-- 4. DISEASES LIBRARY
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS diseases (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  "nameBn"    TEXT,
  crop        TEXT NOT NULL,
  type        TEXT,
  severity    TEXT CHECK (severity IN ('Low','Medium','High')),
  image       TEXT,
  description TEXT,
  symptoms    TEXT[],
  management  TEXT[],
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- 5. NOTIFICATIONS / ALERTS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  message     TEXT NOT NULL,
  type        TEXT DEFAULT 'info' CHECK (type IN ('info','warning','critical')),
  target_role TEXT DEFAULT 'all' CHECK (target_role IN ('all','farmer','user','admin')),
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_date ON notifications(created_at DESC);

-- ─────────────────────────────────────────────
-- 6. ANALYTICS DAILY AGGREGATES
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS analytics_daily (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date               DATE UNIQUE NOT NULL,
  total_diagnoses    INTEGER DEFAULT 0,
  total_users_active INTEGER DEFAULT 0,
  disease_breakdown  JSONB,
  top_district       TEXT,
  avg_confidence     NUMERIC(4,3),
  created_at         TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analytics_date ON analytics_daily(date DESC);

-- ─────────────────────────────────────────────
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- ─────────────────────────────────────────────
ALTER TABLE profiles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagnoses      ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports        ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications  ENABLE ROW LEVEL SECURITY;
ALTER TABLE diseases       ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_daily ENABLE ROW LEVEL SECURITY;

-- Public read for diseases, notifications, reports
CREATE POLICY "public_read_diseases"       ON diseases       FOR SELECT USING (true);
CREATE POLICY "public_read_notifications"  ON notifications  FOR SELECT USING (true);
CREATE POLICY "public_read_reports"        ON reports        FOR SELECT USING (true);
CREATE POLICY "public_read_analytics"      ON analytics_daily FOR SELECT USING (true);

-- Farmers can read all profiles; write only their own
CREATE POLICY "profiles_read_all"   ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_write_own"  ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Farmers read own diagnoses; admins see all
CREATE POLICY "diagnoses_farmer_read" ON diagnoses FOR SELECT 
  USING (auth.uid() = farmer_id OR 
         EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "diagnoses_farmer_insert" ON diagnoses FOR INSERT 
  WITH CHECK (auth.uid() = farmer_id);

-- Service role bypass (for seeding)
CREATE POLICY "service_role_all_profiles"   ON profiles       FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_role_all_diagnoses"  ON diagnoses      FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_role_all_reports"    ON reports        FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_role_all_notif"      ON notifications  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_role_all_diseases"   ON diseases       FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_role_all_analytics"  ON analytics_daily FOR ALL USING (auth.role() = 'service_role');

-- ─────────────────────────────────────────────
-- 8. REALTIME SUBSCRIPTIONS
-- ─────────────────────────────────────────────
ALTER PUBLICATION supabase_realtime ADD TABLE reports;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE diagnoses;
