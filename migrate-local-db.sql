-- Local database migration script for EcoLens
-- Run this in your local PostgreSQL database to add missing columns and tables

-- Add missing columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS daily_scans_used INTEGER NOT NULL DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_scan_date TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS suspicious_activity BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS account_status TEXT DEFAULT 'active';
ALTER TABLE users ADD COLUMN IF NOT EXISTS security_level INTEGER NOT NULL DEFAULT 1;

-- Create missing analytics tables
CREATE TABLE IF NOT EXISTS environmental_impact (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  total_co2_saved INTEGER NOT NULL DEFAULT 0,
  total_water_saved INTEGER NOT NULL DEFAULT 0,
  total_energy_saved INTEGER NOT NULL DEFAULT 0,
  trees_saved INTEGER NOT NULL DEFAULT 0,
  landfill_diverted INTEGER NOT NULL DEFAULT 0,
  recycling_score INTEGER NOT NULL DEFAULT 0,
  weekly_impact_data JSONB,
  monthly_impact_data JSONB,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS habit_analytics (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  date DATE NOT NULL,
  detections_count INTEGER NOT NULL DEFAULT 0,
  coins_earned INTEGER NOT NULL DEFAULT 0,
  time_spent_minutes INTEGER NOT NULL DEFAULT 0,
  favorite_time TEXT,
  location_data JSONB,
  item_types JSONB,
  mood_rating INTEGER,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS user_reminders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  reminder_type TEXT NOT NULL,
  frequency TEXT NOT NULL,
  message TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_sent TIMESTAMP,
  next_scheduled TIMESTAMP,
  custom_schedule JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS personal_goals (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  goal_type TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_value INTEGER NOT NULL,
  current_progress INTEGER NOT NULL DEFAULT 0,
  title TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  end_date TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add missing columns to detections table if needed
ALTER TABLE detections ADD COLUMN IF NOT EXISTS image_hash TEXT;
ALTER TABLE detections ADD COLUMN IF NOT EXISTS is_verified BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE detections ADD COLUMN IF NOT EXISTS verification_image_url TEXT;
ALTER TABLE detections ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'pending';
ALTER TABLE detections ADD COLUMN IF NOT EXISTS verification_attempts INTEGER NOT NULL DEFAULT 0;
ALTER TABLE detections ADD COLUMN IF NOT EXISTS bin_photo_url TEXT;
ALTER TABLE detections ADD COLUMN IF NOT EXISTS bin_photo_hash TEXT;
ALTER TABLE detections ADD COLUMN IF NOT EXISTS proof_in_bin_status TEXT DEFAULT 'pending';
ALTER TABLE detections ADD COLUMN IF NOT EXISTS object_match_score INTEGER NOT NULL DEFAULT 0;
ALTER TABLE detections ADD COLUMN IF NOT EXISTS bin_verification_attempts INTEGER NOT NULL DEFAULT 0;
ALTER TABLE detections ADD COLUMN IF NOT EXISTS fraud_score INTEGER NOT NULL DEFAULT 0;
ALTER TABLE detections ADD COLUMN IF NOT EXISTS ip_address TEXT;
ALTER TABLE detections ADD COLUMN IF NOT EXISTS user_agent TEXT;

-- Add missing columns to transactions table if needed  
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS metadata JSONB;

-- Show tables to confirm
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;