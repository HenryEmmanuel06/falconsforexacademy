import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Blog {
  id: string;
  blog_title: string;
  blog_content: string;
  blog_author: string;
  blog_image: string | null;
  user_id: string;
  created_at: string;
}
