
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, BookOpenText, LogOut, BookMarked, Save } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ProgressBar from '@/components/ProgressBar';
import { useToast } from '@/hooks/use-toast';
import LoginForm from '@/components/LoginForm';
import RegisterForm from '@/components/RegisterForm';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading, signOut, updateUserProfile } = useAuth();
  const [showLoginForm, setShowLoginForm] = useState(true);
  const [studiedCategories, setStudiedCategories] = useState<{ id: number; name: string; progress: number }[]>([]);

  // 获取用户学习过的类别
  useEffect(() => {
    const fetchStudiedCategories = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('category_progress')
            .select('category_id, name, progress')
            .eq('user_id', user.id);
            
          if (error) {
            throw error;
          }
          
          if (data) {
            setStudiedCategories(data.map(category => ({
              id: category.category_id,
              name: category.name,
              progress: category.progress
            })));
          }
        } catch (error) {
          console.error('Error fetching studied categories:', error);
        }
      }
    };
    
    if (user) {
      fetchStudiedCategories();
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "已注销",
        description: "您已成功退出登录",
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "注销失败",
        description: "退出登录过程中发生错误",
        variant: "destructive",
      });
    }
  };

  const handleSaveProgress = async () => {
    if (!user) return;
    
    try {
      // 这里我们只需要让用户知道他们的进度已经自动保存了
      toast({
        title: "进度已保存",
        description: "您的学习进度会自动保存",
      });
    } catch (error) {
      console.error('Save progress error:', error);
      toast({
        title: "保存失败",
        description: "保存进度过程中发生错误",
        variant: "destructive",
      });
    }
  };

  const handleLoginSuccess = (userData: any) => {
    toast({
      title: "登录成功",
      description: "欢迎回来！" + (userData.username || userData.email),
    });
  };

  const handleRegisterSuccess = () => {
    setShowLoginForm(true);
    toast({
      title: "注册成功",
      description: "请使用新账号登录",
    });
  };

  const toggleAuthForm = () => {
    setShowLoginForm(!showLoginForm);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-teal-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white p-4 shadow-sm">
        <h1 className="text-xl font-bold">我的账户</h1>
      </header>

      <main className="container max-w-md mx-auto p-4">
        {user ? (
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
              
              {studiedCategories.length > 0 ? (
                <div className="space-y-4">
                  {studiedCategories.map(category => (
                    <div key={category.id} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                          <BookMarked className="h-5 w-5 text-teal-500 mr-2" />
                          <span className="font-medium">{category.name}</span>
                        </div>
                        <span className="text-sm text-gray-500">{category.progress}%</span>
                      </div>
                      <ProgressBar 
                        current={category.progress} 
                        total={100} 
                      />
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
        ) : (
          <div className="bg-white rounded-xl p-5 shadow-sm">
            {showLoginForm ? (
              <LoginForm onLoginSuccess={handleLoginSuccess} />
            ) : (
              <RegisterForm onRegisterSuccess={handleRegisterSuccess} />
            )}
            
            <div className="mt-4 text-center">
              <button 
                onClick={toggleAuthForm}
                className="text-teal-600 text-sm underline"
              >
                {showLoginForm ? "没有账号？立即注册" : "已有账号？立即登录"}
              </button>
            </div>
          </div>
        )}
      </main>

      <Navbar />
    </div>
  );
};

export default Profile;
