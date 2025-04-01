
import { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthUser } from '@/types/auth';

export const useAuthProvider = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 获取当前会话
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // 设置认证状态变化监听器
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        if (session) {
          await fetchUserProfile(session.user.id);
        } else {
          setUser(null);
          setLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username, total_words, studied_days')
        .eq('id', userId)
        .single();

      if (error) {
        throw error;
      }

      if (data && session) {
        setUser({
          id: userId,
          email: session.user?.email,
          username: data.username || session.user?.email?.split('@')[0] || '用户',
          totalWords: data.total_words || 0,
          studiedDays: data.studied_days || 0,
        });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, username: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username },
        },
      });
      
      if (error) {
        throw error;
      }

      if (data.user) {
        // 创建用户资料
        await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            username,
            email,
            total_words: 0,
            studied_days: 0,
          });
      }
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const updateUserProfile = async (data: Partial<AuthUser>) => {
    try {
      if (!user || !user.id) {
        throw new Error('No authenticated user');
      }

      const updates = {
        ...(data.username && { username: data.username }),
        ...(data.totalWords !== undefined && { total_words: data.totalWords }),
        ...(data.studiedDays !== undefined && { studied_days: data.studiedDays }),
        updated_at: new Date().toISOString(), // Convert Date to ISO string
      };

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      // 更新本地状态
      setUser({
        ...user,
        ...data,
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  return {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    updateUserProfile,
  };
};
