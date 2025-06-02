import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../common/Button.tsx';
import { InputField } from '../common/InputField.tsx';
import { AiOutlineMail, AiOutlineLock } from 'react-icons/ai';
import { useLoginMutation } from '../../services/auth.service';
import { loginSchema, type LoginFormData } from '../../schemas/auth.schema';

export const LoginForm = () => {
  const [login, { isLoading }] = useLoginMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await login(data).unwrap();
      // Handle successful login (e.g., redirect to dashboard)
      console.log('Login successful:', result);
    } catch (error) {
      console.error('Login error:', error);
      // Handle API errors
      if (error.status === 401) {
        setError('root', {
          type: 'manual',
          message: 'Invalid email or password',
        });
      } else {
        setError('root', {
          type: 'manual',
          message: 'An error occurred. Please try again.',
        });
      }
    }
  };

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-2xl shadow-xl">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
          <p className="mt-2 text-sm text-gray-600">Please sign in to your account</p>
        </div>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <InputField
              {...register('email')}
              type="email"
              label="Email address"
              placeholder="Enter your email"
              error={errors.email}
              frontIcon={AiOutlineMail}
              fullWidth
            />
            <InputField
              {...register('password')}
              type="password"
              label="Password"
              placeholder="Enter your password"
              error={errors.password}
              frontIcon={AiOutlineLock}
              fullWidth
            />
          </div>

          {errors.root && (
            <div className="text-red-500 text-sm text-center">
              {errors.root.message}
            </div>
          )}

          <div>
            <Button
              type="submit"
              isLoading={isLoading}
              fullWidth
              size="lg"
              className="bg-primary-600 hover:bg-primary-700 text-white"
            >
              Sign in
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
