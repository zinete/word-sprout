import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface StudyCategory {
  id: number;
  name: string;
  progress: number;
}

export const useStudyProgress = (userId: string | undefined) => {
  const [categories, setCategories] = useState<StudyCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchCategories = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("category_progress")
        .select("category_id, name, progress")
        .eq("user_id", userId);

      if (error) throw error;

      setCategories(
        data?.map((category) => ({
          id: category.category_id,
          name: category.name,
          progress: category.progress,
        })) || []
      );
    } catch (error) {
      console.error("Error fetching studied categories:", error);
      toast({
        title: "获取学习进度失败",
        description: "请稍后重试",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [userId]);

  return {
    categories,
    loading,
    refreshCategories: fetchCategories,
  };
};
