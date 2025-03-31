
import { supabase } from '@/integrations/supabase/client';

// 用户类型定义
export interface UserData {
  id: string;
  username: string;
  created_at: string;
}

// 用户学习进度类型定义
export interface UserProgressDB {
  id: string;
  user_id: string;
  studied_days: number;
  last_study_date: string;
  total_words: number;
  created_at?: string;
  updated_at?: string;
}

// 类别进度类型定义
export interface CategoryProgressDB {
  id: string;
  user_id: string;
  category_id: number;
  name: string;
  progress: number;
  created_at?: string;
  updated_at?: string;
}

// 单词进度类型定义
export interface WordProgressDB {
  id: string;
  user_id: string;
  category_id: number;
  word_id: number;
  learned: boolean;
  review_count: number;
  last_review_date: string;
  created_at?: string;
  updated_at?: string;
}

export { supabase };
