
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { LogIn } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface LoginFormProps {
  onLoginSuccess: (userData: any) => void;
}

const loginSchema = z.object({
  email: z.string().email({ message: '请输入有效的邮箱地址' }),
  password: z.string().min(6, { message: '密码至少需要6个字符' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    
    try {
      console.log('尝试登录:', data.email);
      // 使用Supabase进行登录
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      
      if (error) {
        console.error('登录错误详情:', error);
        throw error;
      }
      
      console.log('登录成功，用户数据:', authData.user);
      
      if (authData.user) {
        // 获取用户详细资料
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('username, total_words, studied_days')
          .eq('id', authData.user.id)
          .single();
        
        if (profileError) {
          console.log('获取用户资料失败，使用默认值:', profileError);
        }
        
        const userData = {
          id: authData.user.id,
          email: authData.user.email,
          username: profileData?.username || authData.user.email?.split('@')[0] || '用户',
          totalWords: profileData?.total_words || 0,
          studiedDays: profileData?.studied_days || 0,
        };
        
        toast({
          title: "登录成功",
          description: `欢迎回来，${userData.username}!`,
        });
        
        onLoginSuccess(userData);
      }
    } catch (error: any) {
      console.error('登录失败:', error);
      
      let errorMessage = "登录失败";
      if (error.message.includes("Invalid login credentials")) {
        errorMessage = "邮箱或密码不正确";
      } else if (error.message.includes("Email not confirmed")) {
        errorMessage = "邮箱未验证，请查收验证邮件";
      } else {
        errorMessage = error.message || "发生未知错误，请稍后重试";
      }
      
      toast({
        title: "登录失败",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-center mb-6">登录账号</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>邮箱</FormLabel>
                <FormControl>
                  <Input placeholder="请输入邮箱" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>密码</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="请输入密码" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            className="w-full bg-teal-500 hover:bg-teal-600"
            disabled={isLoading}
          >
            {isLoading ? (
              <span>登录中...</span>
            ) : (
              <>
                <LogIn className="h-4 w-4 mr-2" />
                登录
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default LoginForm;
