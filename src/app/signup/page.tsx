'use client';
import * as React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useAuth, useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Scale, UserPlus } from 'lucide-react';
import Link from 'next/link';

const signupSchema = z
  .object({
    email: z.string().email('Email không hợp lệ'),
    password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu không khớp',
    path: ['confirmPassword'],
  });

type SignupSchema = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [isSigningUp, setIsSigningUp] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
  });

  React.useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  const onSubmit: SubmitHandler<SignupSchema> = async (data) => {
    setIsSigningUp(true);
    try {
      await createUserWithEmailAndPassword(auth, data.email, data.password);
      toast({
        title: 'Đăng ký thành công!',
        description: 'Đang chuyển hướng đến trang tổng quan...',
      });
      // The useEffect above will handle the redirect
    } catch (error: any) {
      console.error(error);
      let description = 'Đã có lỗi xảy ra. Vui lòng thử lại.';
      if (error.code === 'auth/email-already-in-use') {
        description = 'Email này đã được sử dụng. Vui lòng chọn email khác.';
      }
      toast({
        variant: 'destructive',
        title: 'Đăng ký thất bại',
        description,
      });
    } finally {
      setIsSigningUp(false);
    }
  };

  if (isUserLoading || user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-950">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader className="text-center">
          <UserPlus className="mx-auto h-10 w-10 text-primary" />
          <CardTitle className="text-2xl">Đăng ký tài khoản</CardTitle>
          <CardDescription>
            Nhập thông tin của bạn để tạo tài khoản mới
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                {...register('email')}
                disabled={isSigningUp}
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                {...register('password')}
                disabled={isSigningUp}
              />
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...register('confirmPassword')}
                disabled={isSigningUp}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isSigningUp}>
              {isSigningUp && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Đăng ký
            </Button>
          </form>
        </CardContent>
         <CardFooter className="text-sm text-center block">
          <p>
            Đã có tài khoản?{' '}
            <Link href="/login" className="underline">
              Đăng nhập ngay
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
