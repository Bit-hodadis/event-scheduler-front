import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { InputField } from '../common/InputField.tsx';
import { Button } from '../common/Button.tsx';
import { AiOutlineUser, AiOutlineMail, AiOutlineLock } from 'react-icons/ai';
import { useSignupMutation } from '../../services/auth.service';
import { signupSchema, type SignupFormData } from '../../schemas/auth.schema';
import { useToast } from '../../context/ToastContext.jsx';


export const SignupForm = ({onSignup}: {onSignup: () => void}) => {
  const [signup, { isLoading }] = useSignupMutation();
  const methods = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema)
  });
 const toast = useToast()
  const { handleSubmit, setError, formState: { errors } } = methods;

  const onSubmit = async (data: SignupFormData) => {
    try {
      const result = await signup({firstName:data.firstName, lastName:data.lastName, username:data.username, email:data.email, password:data.password, confirmPassword: data.confirmPassword}).unwrap();
     toast.success('Signup successful now You can login');
     onSignup()
      // Handle successful signup (e.g., redirect to login)
      console.log('Signup successful:', result);
    } catch (error) {
      toast.error(error?.data?.email||error?.data?.username||'Signup failed');
      console.error('Signup error:', error);
      // Handle API errors
      if (error.status === 409) {
        setError('email', {
          type: 'manual',
          message: 'Email already exists',
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
    <div className="max-w-lg mx-auto  space-y-6 bg-white p-8 pb-10 rounded-2xl shadow">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Create your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">

        <FormProvider {...methods}>
          <form className="mt-6 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-4">
            <InputField
              name="firstName"
              type="text"
              label="First Name"
              placeholder="Enter your first name"
              frontIcon={AiOutlineUser}
            />
            <InputField
              name="lastName"
              type="text"
              label="Last Name"
              placeholder="Enter your last name"
              frontIcon={AiOutlineUser}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
          <InputField
            name="username"
            type="text"
            label="Username"
            placeholder="Choose a username"
            frontIcon={AiOutlineUser}
            fullWidth
          />

          <InputField
            name="email"
            type="email"
            label="Email address"
            placeholder="Enter your email"
            frontIcon={AiOutlineMail}
            fullWidth
          />
</div>
<div className="grid grid-cols-2 gap-4">
          <InputField
            name="password"
            type="password"
            label="Password"
            placeholder="Enter your password"
            frontIcon={AiOutlineLock}
            fullWidth
          />

          <InputField
            name="confirmPassword"
            type="password"
            label="Confirm Password"
            placeholder="Confirm your password"
            frontIcon={AiOutlineLock}
            fullWidth
          />
</div>          <div>
            <Button
              type="submit"
              isLoading={isLoading}
              fullWidth
              size="lg"
              className="bg-primary-600 hover:bg-primary-700 text-white"
            >
              Sign up
            </Button>
            {errors.root && (
              <div className="text-red-500 text-sm text-center mt-2">
                {errors.root.message}
              </div>
            )}
          </div>
        </form>
        </FormProvider>
      </div>
    </div>
  );
};
