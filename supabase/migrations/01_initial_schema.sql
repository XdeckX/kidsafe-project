-- Create videos table
create table videos (
  id bigint generated always as identity primary key,
  youtube_video_id text unique not null,
  title text not null,
  thumbnail text,
  duration text,
  channel_id text not null,
  category text,
  views text,
  published_at timestamptz,
  transcript_path text,
  created_at timestamptz default now()
);

-- Create child_approved_videos table for managing which videos are approved for which children
create table child_approved_videos (
  id bigint generated always as identity primary key,
  child_id text not null,
  video_id bigint references videos(id) not null,
  created_at timestamptz default now(),
  unique(child_id, video_id)
);

-- Create child_approved_channels table
create table child_approved_channels (
  id bigint generated always as identity primary key,
  child_id text not null,
  channel_id text not null,
  created_at timestamptz default now(),
  unique(child_id, channel_id)
);
