import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import LoginForm from "@/components/LoginForm";
import RegisterForm from "@/components/RegisterForm";
import Navbar from "@/components/Navbar";

const Auth = () => {
  const [showLoginForm, setShowLoginForm] = useState(true);
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // 如果用户已登录，自动跳转到个人资料页面
  useEffect(() => {
    if (user && !loading) {
      navigate("/profile");
    }
  }, [user, loading, navigate]);

  const handleLoginSuccess = (userData) => {
    toast({
      title: "登录成功",
      description: `欢迎回来，${
        userData.username || userData.email?.split("@")[0] || "用户"
      }！`,
    });
    navigate("/profile");
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
        <h1 className="text-xl font-bold">
          {showLoginForm ? "登录账户" : "注册账户"}
        </h1>
      </header>

      <main className="container max-w-md mx-auto p-4">
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
      </main>

      <Navbar />
    </div>
  );
};

export default Auth;
