
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
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

interface LoginFormProps {
  onLoginSuccess: (userData: any) => void;
}

interface LoginFormValues {
  username: string;
  password: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    
    try {
      // 临时模拟登录，后续需要更换为真实的API调用
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 模拟登录成功
      const mockUserData = {
        username: data.username,
        totalWords: 42,
        studiedDays: 5,
      };
      
      // 存储登录状态到本地存储
      localStorage.setItem('wordAppUser', JSON.stringify(mockUserData));
      
      onLoginSuccess(mockUserData);
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "登录失败",
        description: "用户名或密码不正确",
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
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>用户名</FormLabel>
                <FormControl>
                  <Input placeholder="请输入用户名" {...field} />
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
