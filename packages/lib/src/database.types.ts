// Generated types from Supabase
// We'll replace this with actual generated types once the Supabase project is set up

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      child_profiles: {
        Row: {
          id: string
          parent_id: string
          name: string
          birth_year: number | null
          avatar_color: string | null
          created_at: string
        }
        Insert: {
          id?: string
          parent_id: string
          name: string
          birth_year?: number | null
          avatar_color?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          parent_id?: string
          name?: string
          birth_year?: number | null
          avatar_color?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "child_profiles_parent_id_fkey"
            columns: ["parent_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      channels: {
        Row: {
          id: string
          child_id: string
          channel_id: string
          channel_name: string
          thumbnail_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          child_id: string
          channel_id: string
          channel_name: string
          thumbnail_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          child_id?: string
          channel_id?: string
          channel_name?: string
          thumbnail_url?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "channels_child_id_fkey"
            columns: ["child_id"]
            referencedRelation: "child_profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          plan: string
          status: string
          stripe_customer_id: string
          stripe_subscription_id: string
          current_period_end: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          plan: string
          status: string
          stripe_customer_id: string
          stripe_subscription_id: string
          current_period_end: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          plan?: string
          status?: string
          stripe_customer_id?: string
          stripe_subscription_id?: string
          current_period_end?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      videos: {
        Row: {
          id: string
          youtube_video_id: string
          channel_id: string
          title: string
          description: string | null
          thumbnail_url: string | null
          published_at: string
          safe: boolean | null
          loud_score: number | null
          age_rating: string | null
          category: string | null
          analysis_status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          youtube_video_id: string
          channel_id: string
          title: string
          description?: string | null
          thumbnail_url?: string | null
          published_at: string
          safe?: boolean | null
          loud_score?: number | null
          age_rating?: string | null
          category?: string | null
          analysis_status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          youtube_video_id?: string
          channel_id?: string
          title?: string
          description?: string | null
          thumbnail_url?: string | null
          published_at?: string
          safe?: boolean | null
          loud_score?: number | null
          age_rating?: string | null
          category?: string | null
          analysis_status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "videos_channel_id_fkey"
            columns: ["channel_id"]
            referencedRelation: "channels"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
