
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, BookOpenText, LogOut, BookMarked, Save } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ProgressBar from '@/components/ProgressBar';
import { categories } from '@/data/wordData';
import { useToast } from '@/hooks/use-toast';
import LoginForm from '@/components/LoginForm';
import RegisterForm from '@/components/RegisterForm';

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(true);
  const [userData, setUserData] = useState({
    username: '用户001',
    totalWords: 42,
    studiedDays: 5,
  });

  // 这里应该从本地存储或者状态管理中获取用户学习进度
  const studiedCategories = [
    { id: 1, name: '基础词汇', progress: 60 },
    { id: 2, name: '动物名称', progress: 30 },
  ];

  const handleLogout = () => {
    // 实际应用中应该调用注销API
    setIsLoggedIn(false);
    toast({
      title: "已注销",
      description: "您已成功退出登录",
    });
  };

  const handleSaveProgress = () => {
    // 实际应用中应该调用保存API
    toast({
      title: "保存成功",
      description: "您的学习进度已保存",
    });
  };

  const handleLoginSuccess = (userData: any) => {
    setIsLoggedIn(true);
    setUserData({
      username: userData.username || '用户001',
      totalWords: userData.totalWords || 42,
      studiedDays: userData.studiedDays || 5,
    });
    toast({
      title: "登录成功",
      description: "欢迎回来！" + (userData.username || '用户001'),
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

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white p-4 shadow-sm">
        <h1 className="text-xl font-bold">我的账户</h1>
      </header>

      <main className="container max-w-md mx-auto p-4">
        {isLoggedIn ? (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-teal-400 to-blue-400 rounded-xl p-5 text-white">
              <div className="flex items-center mb-4">
                <div className="bg-white/20 p-3 rounded-full mr-3">
                  <User className="h-8 w-8" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{userData.username}</h2>
                  <p className="opacity-90">已学习 {userData.totalWords} 个单词</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-white/20 p-3 rounded-lg">
                  <p className="text-sm opacity-90">学习天数</p>
                  <p className="text-xl font-bold">{userData.studiedDays} 天</p>
                </div>
                <div className="bg-white/20 p-3 rounded-lg">
                  <p className="text-sm opacity-90">单词数量</p>
                  <p className="text-xl font-bold">{userData.totalWords}</p>
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
