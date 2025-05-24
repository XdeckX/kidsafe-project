// Common types used throughout the application

// User/Parent types
export interface Parent {
  id: string;
  email: string;
  name?: string;
  created_at: string;
  subscription_plan?: 'single' | 'family' | null;
  subscription_status?: 'active' | 'trialing' | 'canceled' | null;
  subscription_period_end?: string | null;
}

// Child profile types
export interface ChildProfile {
  id: string;
  parent_id: string;
  name: string;
  birth_year?: number | null;
  avatar_color?: string | null;
  created_at: string;
}

// YouTube channel types
export interface Channel {
  id: string;
  child_id: string;
  channel_id: string; // YouTube channel ID
  channel_name: string;
  thumbnail_url?: string | null;
  created_at: string;
}

// Video types
export interface Video {
  id: string;
  youtube_video_id: string;
  channel_id: string;
  title: string;
  description?: string;
  thumbnail_url?: string;
  published_at: string;
  safe: boolean | null; // null means pending review
  loud_score?: number;
  age_rating?: string;
  category?: 'educational' | 'entertainment' | 'junk' | 'inappropriate';
  analysis_status?: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
}

// AI analysis result type
export interface VideoAnalysisResult {
  safe: boolean;
  loud_score: number;
  age_rating: string;
  category: 'educational' | 'entertainment' | 'junk' | 'inappropriate';
  reason?: string;
}

// Subscription types
export interface Subscription {
  id: string;
  user_id: string;
  plan: 'single' | 'family';
  status: 'active' | 'trialing' | 'canceled' | 'past_due';
  stripe_customer_id: string;
  stripe_subscription_id: string;
  current_period_end: string;
  created_at: string;
}
