-- Run this in the Supabase SQL Editor after creating your project

-- Create videos table
CREATE TABLE IF NOT EXISTS videos (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  youtube_video_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  thumbnail TEXT,
  duration TEXT,
  channel_id TEXT NOT NULL,
  channel_name TEXT,
  category TEXT,
  views TEXT,
  published_at TIMESTAMPTZ,
  transcript_path TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create child_approved_videos table for managing which videos are approved for which children
CREATE TABLE IF NOT EXISTS child_approved_videos (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  child_id TEXT NOT NULL,
  video_id BIGINT REFERENCES videos(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(child_id, video_id)
);

-- Create child_approved_channels table
CREATE TABLE IF NOT EXISTS child_approved_channels (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  child_id TEXT NOT NULL,
  channel_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(child_id, channel_id)
);

-- Create child_profiles table to store child profile information
CREATE TABLE IF NOT EXISTS child_profiles (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  external_id TEXT UNIQUE NOT NULL,  -- ID used in the frontend
  name TEXT NOT NULL,
  avatar_color TEXT,
  pin TEXT,
  age INTEGER,
  parent_id TEXT NOT NULL,  -- Reference to the auth.users table
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create channels table to store channel information
CREATE TABLE IF NOT EXISTS channels (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  channel_id TEXT UNIQUE NOT NULL,  -- YouTube channel ID
  name TEXT NOT NULL,
  thumbnail TEXT,
  description TEXT,
  subscriber_count TEXT,
  video_count TEXT,
  safe BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create row level security policies
-- These will apply once you enable RLS on these tables

-- Enable RLS on all tables
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE child_approved_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE child_approved_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE child_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE channels ENABLE ROW LEVEL SECURITY;

-- Videos policies
CREATE POLICY "Videos are viewable by anyone" 
  ON videos FOR SELECT USING (true);

-- Child approved videos policies
CREATE POLICY "Child approved videos are viewable by parent" 
  ON child_approved_videos FOR SELECT 
  USING (auth.uid() = (SELECT parent_id FROM child_profiles WHERE external_id = child_id));

CREATE POLICY "Parents can insert child approved videos" 
  ON child_approved_videos FOR INSERT 
  WITH CHECK (auth.uid() = (SELECT parent_id FROM child_profiles WHERE external_id = child_id));

CREATE POLICY "Parents can delete child approved videos" 
  ON child_approved_videos FOR DELETE 
  USING (auth.uid() = (SELECT parent_id FROM child_profiles WHERE external_id = child_id));

-- Child approved channels policies
CREATE POLICY "Child approved channels are viewable by parent" 
  ON child_approved_channels FOR SELECT 
  USING (auth.uid() = (SELECT parent_id FROM child_profiles WHERE external_id = child_id));

CREATE POLICY "Parents can insert child approved channels" 
  ON child_approved_channels FOR INSERT 
  WITH CHECK (auth.uid() = (SELECT parent_id FROM child_profiles WHERE external_id = child_id));

CREATE POLICY "Parents can delete child approved channels" 
  ON child_approved_channels FOR DELETE 
  USING (auth.uid() = (SELECT parent_id FROM child_profiles WHERE external_id = child_id));

-- Child profiles policies
CREATE POLICY "Child profiles are viewable by parent" 
  ON child_profiles FOR SELECT 
  USING (auth.uid() = parent_id);

CREATE POLICY "Parents can insert child profiles" 
  ON child_profiles FOR INSERT 
  WITH CHECK (auth.uid() = parent_id);

CREATE POLICY "Parents can update child profiles" 
  ON child_profiles FOR UPDATE 
  USING (auth.uid() = parent_id);

CREATE POLICY "Parents can delete child profiles" 
  ON child_profiles FOR DELETE 
  USING (auth.uid() = parent_id);

-- Channels policies
CREATE POLICY "Channels are viewable by anyone" 
  ON channels FOR SELECT USING (true);
