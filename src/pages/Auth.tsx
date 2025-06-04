import React, { useState } from 'react';
import { LoginForm } from '../components/auth/LoginForm';
import { SignupForm } from '../components/auth/SignupForm';

export const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-white">
      <div className=" mx-auto pt-8">
        {isLogin ? <LoginForm /> : <SignupForm onSignup={()=>setIsLogin(true)} />}
        <div className="mt-6 text-center">
          <p className="text-sm text-black">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="font-semibold text-primary-600 hover:text-primary-700 underline underline-offset-2"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
