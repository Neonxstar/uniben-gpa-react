-- ================================================
-- UNIBEN GPA Calculator - Supabase Database Schema
-- ================================================
-- Run this SQL in Supabase SQL Editor (Dashboard > SQL Editor > New Query)

-- ================================================
-- 1. COURSES TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS courses (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  credit_unit INTEGER NOT NULL CHECK (credit_unit > 0),
  grade TEXT NOT NULL,
  is_forecasted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster user queries
CREATE INDEX IF NOT EXISTS idx_courses_user_id ON courses(user_id);

-- ================================================
-- 2. SEMESTERS TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS semesters (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  units INTEGER NOT NULL CHECK (units >= 0),
  gpa NUMERIC(3, 2) NOT NULL CHECK (gpa >= 0 AND gpa <= 5),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster user queries
CREATE INDEX IF NOT EXISTS idx_semesters_user_id ON semesters(user_id);

-- ================================================
-- 3. ROW LEVEL SECURITY (RLS)
-- ================================================

-- Enable RLS on courses
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- Users can only see their own courses
CREATE POLICY "Users can view own courses" ON courses
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own courses
CREATE POLICY "Users can insert own courses" ON courses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own courses
CREATE POLICY "Users can update own courses" ON courses
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own courses
CREATE POLICY "Users can delete own courses" ON courses
  FOR DELETE USING (auth.uid() = user_id);

-- Enable RLS on semesters
ALTER TABLE semesters ENABLE ROW LEVEL SECURITY;

-- Users can only see their own semesters
CREATE POLICY "Users can view own semesters" ON semesters
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own semesters
CREATE POLICY "Users can insert own semesters" ON semesters
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own semesters
CREATE POLICY "Users can update own semesters" ON semesters
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own semesters
CREATE POLICY "Users can delete own semesters" ON semesters
  FOR DELETE USING (auth.uid() = user_id);

-- ================================================
-- 4. UPDATED_AT TRIGGER
-- ================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON courses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_semesters_updated_at
  BEFORE UPDATE ON semesters
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- DONE! Your database is ready.
-- ================================================
