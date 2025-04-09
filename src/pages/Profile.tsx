import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, LogOut, BookMarked, Save } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ProgressBar from "@/components/ProgressBar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useStudyProgress } from "@/hooks/useStudyProgress";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading, signOut } = useAuth();
  const {
    categories,
    loading: categoriesLoading,
    refreshCategories,
  } = useStudyProgress(user?.id);

  // 如果用户未登录且加载完成，则跳转到登录页面
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "已注销",
        description: "您已成功退出登录",
      });
      navigate("/auth");
    } catch (error) {
      toast({
        title: "注销失败",
        description: "退出登录过程中发生错误",
        variant: "destructive",
      });
    }
  };

  const handleSaveProgress = () => {
    toast({
      title: "进度已保存",
      description: "您的学习进度会自动保存",
    });
  };

  // 如果用户未登录，不渲染内容（会被useEffect重定向）
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white p-4 shadow-sm">
        <h1 className="text-xl font-bold">我的账户</h1>
      </header>

      <main className="container max-w-md mx-auto p-4">
        {authLoading || categoriesLoading ? (
          <div className="bg-white h-full rounded-xl p-5 shadow-sm flex items-center justify-center">
            <div className="text-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-teal-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">加载中...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-teal-400 to-blue-400 rounded-xl p-5 text-white">
              <div className="flex items-center mb-4">
                <div className="bg-white/20 p-3 rounded-full mr-3">
                  <User className="h-8 w-8" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{user.username}</h2>
                  <p className="opacity-90">{user.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-white/20 p-3 rounded-lg">
                  <p className="text-sm opacity-90">学习天数</p>
                  <p className="text-xl font-bold">{user.studiedDays} 天</p>
                </div>
                <div className="bg-white/20 p-3 rounded-lg">
                  <p className="text-sm opacity-90">单词数量</p>
                  <p className="text-xl font-bold">{user.totalWords}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">学习进度</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSaveProgress}
                >
                  <Save className="h-4 w-4 mr-2" />
                  保存进度
                </Button>
              </div>

              {categories.length > 0 ? (
                <div className="space-y-4">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="bg-gray-50 p-3 rounded-lg"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                          <BookMarked className="h-5 w-5 text-teal-500 mr-2" />
                          <span className="font-medium">{category.name}</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {category.progress}%
                        </span>
                      </div>
                      <ProgressBar current={category.progress} total={100} />
                    </div>
                  ))}
                </div>
              ) : (
                <Alert>
                  <AlertDescription>
                    您还没有学习任何类别的单词，请前往学习页面开始学习。
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <Button
              variant="outline"
              className="w-full border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              退出登录
            </Button>
          </div>
        )}
      </main>

      <Navbar />
    </div>
  );
};

export default Profile;
