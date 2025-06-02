import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { InputField } from '../common/InputField.tsx';
import { Button } from '../common/Button.tsx';
import { AiOutlineUser, AiOutlineMail, AiOutlineLock } from 'react-icons/ai';
import { useSignupMutation } from '../../services/auth.service';
import { signupSchema, type SignupFormData } from '../../schemas/auth.schema';



export const SignupForm = () => {
  const [signup, { isLoading }] = useSignupMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema)
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      const result = await signup(data).unwrap();
      // Handle successful signup (e.g., redirect to login)
      console.log('Signup successful:', result);
    } catch (error) {
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
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Create your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Sign up
          </h2>
          <p className="mt-2 text-sm text-gray-600">Join us! Please enter your details.</p>
        </div>
        <form className="mt-6 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-4">
            <InputField
              {...register('firstName')}
              type="text"
              label="First Name"
              placeholder="Enter your first name"
              error={errors.firstName}
              frontIcon={AiOutlineUser}
            />
            <InputField
              {...register('lastName')}
              type="text"
              label="Last Name"
              placeholder="Enter your last name"
              error={errors.lastName}
              frontIcon={AiOutlineUser}
            />
          </div>

          <InputField
            {...register('username')}
            type="text"
            label="Username"
            placeholder="Choose a username"
            error={errors.username}
            frontIcon={AiOutlineUser}
            fullWidth
          />

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

          <InputField
            {...register('confirmPassword')}
            type="password"
            label="Confirm Password"
            placeholder="Confirm your password"
            error={errors.confirmPassword}
            frontIcon={AiOutlineLock}
            fullWidth
          />

          <div>
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
      </div>
    </div>
  );
};
