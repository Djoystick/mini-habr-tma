/**
 * Supabase database types inferred from actual project usage.
 * Do not add columns that are not used in the codebase.
 * Each table includes Relationships: [] to satisfy GenericTable.
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type UserRole = 'user' | 'moderator' | 'admin';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          telegram_id: number;
          username: string | null;
          first_name: string | null;
          last_name: string | null;
          photo_url: string | null;
          role: UserRole;
          created_at: string;
        };
        Insert: {
          id?: string;
          telegram_id: number;
          username?: string | null;
          first_name?: string | null;
          last_name?: string | null;
          photo_url?: string | null;
          role?: UserRole;
          created_at?: string;
        };
        Update: {
          id?: string;
          telegram_id?: number;
          username?: string | null;
          first_name?: string | null;
          last_name?: string | null;
          photo_url?: string | null;
          role?: UserRole;
          created_at?: string;
        };
        Relationships: [];
      };
      posts: {
        Row: {
          id: number;
          title: string;
          subtitle: string | null;
          content: string;
          created_at: string;
          author_id: string;
        };
        Insert: {
          id?: number;
          title: string;
          subtitle?: string | null;
          content: string;
          created_at?: string;
          author_id: string;
        };
        Update: {
          id?: number;
          title?: string;
          subtitle?: string | null;
          content?: string;
          created_at?: string;
          author_id?: string;
        };
        Relationships: [];
      };
      comments: {
        Row: {
          id: number;
          post_id: number;
          author_id: string;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: number;
          post_id: number;
          author_id: string;
          content: string;
          created_at?: string;
        };
        Update: {
          id?: number;
          post_id?: number;
          author_id?: string;
          content?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      reactions: {
        Row: {
          id: number;
          post_id: number;
          user_id: string;
          reaction_type: 'like' | 'fire' | 'bookmark';
        };
        Insert: {
          id?: number;
          post_id: number;
          user_id: string;
          reaction_type: 'like' | 'fire' | 'bookmark';
        };
        Update: {
          id?: number;
          post_id?: number;
          user_id?: string;
          reaction_type?: 'like' | 'fire' | 'bookmark';
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: UserRole;
    };
  };
}
