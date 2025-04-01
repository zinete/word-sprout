
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
import { useAuth } from '@/context/AuthContext';

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
  const { signIn, user } = useAuth();

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
      // 使用Auth上下文进行登录
      await signIn(data.email, data.password);
      
      // 登录后，user会通过AuthContext自动更新
      // 但因为异步更新，这里不一定能立即获取到最新user
      // 所以显示成功消息就可以了，相关数据会自动更新
      toast({
        title: "登录成功",
        description: "欢迎回来!",
      });
      
      // 由于身份验证状态现在由全局AuthContext管理，
      // onLoginSuccess回调可能不再必要，但为保持API兼容性，仍然调用它
      if (user) {
        onLoginSuccess(user);
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
