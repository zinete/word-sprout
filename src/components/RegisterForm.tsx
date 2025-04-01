
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserPlus } from 'lucide-react';
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

interface RegisterFormProps {
  onRegisterSuccess: () => void;
}

const registerSchema = z.object({
  username: z.string().min(2, { message: '用户名至少需要2个字符' }),
  email: z.string().email({ message: '请输入有效的邮箱地址' }),
  password: z.string().min(6, { message: '密码至少需要6个字符' }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegisterSuccess }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    
    try {
      console.log('尝试注册:', data.email);
      
      // 使用Supabase进行注册
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            username: data.username,
          }
        }
      });
      
      if (error) {
        console.error('注册错误详情:', error);
        throw error;
      }
      
      console.log('注册成功，用户数据:', authData);
      
      if (authData.user) {
        // 创建用户资料
        await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            username: data.username,
            email: data.email,
            total_words: 0,
            studied_days: 0,
          });
        
        toast({
          title: "注册成功",
          description: "请验证您的邮箱以完成注册",
        });
        
        onRegisterSuccess();
      }
    } catch (error: any) {
      console.error('注册失败:', error);
      
      let errorMessage = "注册失败";
      if (error.message.includes("User already registered")) {
        errorMessage = "该邮箱已注册，请直接登录";
      } else {
        errorMessage = error.message || "发生未知错误，请稍后重试";
      }
      
      toast({
        title: "注册失败",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-center mb-6">注册账号</h2>
      
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
              <span>注册中...</span>
            ) : (
              <>
                <UserPlus className="h-4 w-4 mr-2" />
                注册
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default RegisterForm;
