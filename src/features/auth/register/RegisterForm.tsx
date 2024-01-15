import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { trpc } from '@/lib/trpc/client';
import {
  AuthCredentials,
  zAuthCredentials,
} from '@/server/config/schemas/Auth';

const RegisterForm = () => {
  const router = useRouter();
  const { mutate: userRegister, isLoading } = trpc.auth.register.useMutation({
    onSuccess: () => {
      router.push('/login');
      toast.success('Success', {
        description: 'Account created successfully',
        className: 'bg-green-600',
      });
    },
    onError: () => {
      toast.error('Error', {
        description: 'Error',
        className: 'bg-red-600',
      });
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthCredentials>({
    resolver: zodResolver(zAuthCredentials()),
  });

  const onSubmit = ({ name, email, password }: AuthCredentials) => {
    userRegister({ name, email, password });
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-5 text-lg">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            disabled={isLoading}
            {...register('name')}
          />
          {errors?.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            placeholder="name@example.com"
            type="email"
            disabled={isLoading}
            {...register('email')}
          />
          {errors?.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            disabled={isLoading}
            {...register('password')}
          />
          {errors?.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        <Button
          className="h-12 text-lg mt-2"
          type="submit"
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Register
        </Button>
      </div>
    </form>
  );
};

export default RegisterForm;
