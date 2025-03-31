
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
import { supabase } from '@/lib/supabase';

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
      // 使用Supabase进行登录
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      
      if (error) {
        throw error;
      }
      
      if (authData.user) {
        // 获取用户详细资料
        const { data: profileData } = await supabase
          .from('profiles')
          .select('username, total_words, studied_days')
          .eq('id', authData.user.id)
          .single();
        
        const userData = {
          id: authData.user.id,
          email: authData.user.email,
          username: profileData?.username || authData.user.email?.split('@')[0] || '用户',
          totalWords: profileData?.total_words || 0,
          studiedDays: profileData?.studied_days || 0,
        };
        
        onLoginSuccess(userData);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "登录失败",
        description: error.message || "用户名或密码不正确",
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
