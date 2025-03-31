
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { User } from 'lucide-react';
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

interface RegisterFormProps {
  onRegisterSuccess: () => void;
}

interface RegisterFormValues {
  username: string;
  password: string;
  confirmPassword: string;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegisterSuccess }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterFormValues>({
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    
    if (data.password !== data.confirmPassword) {
      form.setError('confirmPassword', {
        type: 'manual',
        message: '两次输入的密码不一致',
      });
      setIsLoading(false);
      return;
    }
    
    try {
      // 临时模拟注册，后续需要更换为真实的API调用
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 模拟注册成功
      onRegisterSuccess();
    } catch (error) {
      console.error('Register error:', error);
      toast({
        title: "注册失败",
        description: "注册过程中发生错误，请稍后再试",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-center mb-6">注册新账号</h2>
      
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
          
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>确认密码</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="请再次输入密码" {...field} />
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
                <User className="h-4 w-4 mr-2" />
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
