-- Add pgvector extension
create extension if not exists vector;

-- Add AI-related columns to videos table
alter table videos
  add column embedding vector(768),
  add column safe boolean,
  add column age_rating text,
  add column loud_score int,
  add column junk_score int,
  add column analysis_notes text,
  add column analyzed_at timestamptz;

-- Create AI queue table
create table ai_queue (
  id bigint generated always as identity primary key,
  youtube_video_id text unique,
  status text default 'pending',
  created_at timestamptz default now()
);

-- Add RLS policies
alter table ai_queue enable row level security;
create policy "service role only" on ai_queue for all
  using (auth.role() = 'service_role');
