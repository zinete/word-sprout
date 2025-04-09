import { useState, useEffect, useCallback } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { AuthUser } from "@/types/auth";

export const useAuthProvider = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("username, total_words, studied_days")
        .eq("id", userId)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching profile:", error);
      return null;
    }
  }, []);

  const createUserProfile = useCallback(
    async (userId: string, email: string, username?: string) => {
      const defaultUsername = username || email.split("@")[0] || "用户";
      try {
        const { error } = await supabase.from("profiles").insert({
          id: userId,
          username: defaultUsername,
          email,
          total_words: 0,
          studied_days: 0,
        });

        if (error) throw error;

        return {
          username: defaultUsername,
          total_words: 0,
          studied_days: 0,
        };
      } catch (error) {
        console.error("Error creating profile:", error);
        return null;
      }
    },
    []
  );

  const handleSession = useCallback(
    async (currentSession: Session | null) => {
      try {
        setSession(currentSession);

        if (!currentSession) {
          setUser(null);
          return;
        }

        const userId = currentSession.user.id;
        const email = currentSession.user.email!;

        let profile = await fetchUserProfile(userId);
        if (!profile) {
          profile = await createUserProfile(userId, email);
        }

        if (profile) {
          setUser({
            id: userId,
            email: email,
            username: profile.username,
            totalWords: profile.total_words,
            studiedDays: profile.studied_days,
          });
        }
      } catch (error) {
        console.error("Session handling error:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    },
    [fetchUserProfile, createUserProfile]
  );

  useEffect(() => {
    const initAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        await handleSession(session);

        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(async (_, session) => {
          await handleSession(session);
        });

        return () => subscription.unsubscribe();
      } catch (error) {
        console.error("Auth initialization error:", error);
        setLoading(false);
      }
    };

    initAuth();
  }, [handleSession]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string, username: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username } },
    });

    if (error) throw error;
    if (data.user) {
      await createUserProfile(data.user.id, email, username);
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const updateUserProfile = async (data: Partial<AuthUser>) => {
    if (!user?.id) throw new Error("No authenticated user");

    const updates = {
      ...(data.username && { username: data.username }),
      ...(data.totalWords !== undefined && { total_words: data.totalWords }),
      ...(data.studiedDays !== undefined && { studied_days: data.studiedDays }),
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user.id);

    if (error) throw error;
    setUser({ ...user, ...data });
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
