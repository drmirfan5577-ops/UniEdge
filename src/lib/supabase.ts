import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: { eventsPerSecond: 10 },
  },
});

export type SupabaseMessage = {
  id: string;
  chat_id: string;
  sender_id: string | null;
  content: string;
  type: "text" | "image" | "video" | "audio" | "doc" | "voice";
  media_url: string | null;
  reply_to: string | null;
  status: "sent" | "delivered" | "read";
  is_deleted: boolean;
  reactions: { emoji: string; user_id: string }[];
  created_at: string;
};

export type SupabaseMediaUpload = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  media_url: string;
  thumbnail_url: string | null;
  type: "video" | "short" | "audio";
  resolution: string;
  duration: number;
  views: number;
  likes: number;
  category: string;
  tags: string[];
  is_public: boolean;
  created_at: string;
};
