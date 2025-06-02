import React, { useState, forwardRef } from 'react';
import { useFormContext, Controller, FieldError } from 'react-hook-form';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

interface IconComponentProps {
  size?: number;
}

interface InputFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  name: string;
  label?: string;
  type?: 'text' | 'password' | 'email' | 'number';
  placeholder?: string;
  frontIcon?: React.ComponentType<IconComponentProps>;
  endIcon?: React.ComponentType<IconComponentProps>;
  error?: FieldError;
  fullWidth?: boolean;
  className?: string;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  function InputField(
    {
      name,
      label,
      type = 'text',
      placeholder,
      frontIcon: FrontIcon,
      endIcon: EndIcon,
      error,
      fullWidth = false,
      ...rest
    }: InputFieldProps,
    ref: React.ForwardedRef<HTMLInputElement>
  ) {
    const [showPassword, setShowPassword] = useState(false);
    const formContext = useFormContext();

    // If form context is not available, render a plain input field
    if (!formContext) {
      return (
        <div className={`mb-4 ${fullWidth ? 'w-full' : ''}`}>
          {label && (
            <label
              htmlFor={name}
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {label}
            </label>
          )}
          <div className="relative">
            {FrontIcon && (
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                {React.createElement(FrontIcon, { size: 20 })}
              </div>
            )}
            <input
              type={type === 'password' && showPassword ? 'text' : type}
              id={name}
              ref={ref}
              placeholder={placeholder}
              className={`w-full px-3 py-2 ${FrontIcon ? 'pl-10' : 'pl-3'} ${
                EndIcon || type === 'password' ? 'pr-10' : 'pr-3'
              } border ${error ? 'border-red-500' : 'border-primary-500'} rounded-md focus:outline-none focus:ring-[1px] focus:ring-primary-500`}
              {...rest}
            />
            {type === 'password' ? (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showPassword ? (
                  <AiFillEyeInvisible size={20} />
                ) : (
                  <AiFillEye size={20} />
                )}
              </button>
            ) : EndIcon ? (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                {React.createElement(EndIcon, { size: 20 })}
              </div>
            ) : null}
          </div>
          {error && (
            <p className="text-red-500 text-sm mt-1">{error.message}</p>
          )}
        </div>
      );
    }

    // If form context is available, use Controller
    const {
      control,
      formState: { errors },
    } = formContext;

    return (
      <div className={`mb-4 ${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label
            htmlFor={name}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
        )}
        <Controller
          name={name}
          control={control}
          defaultValue=""
          render={({ field }) => (
            <div className="relative">
              {FrontIcon && (
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  {React.createElement(FrontIcon, { size: 20 })}
                </div>
              )}
              <input
                {...field}
                {...rest}
                type={type === 'password' && showPassword ? 'text' : type}
                id={name}
                placeholder={placeholder}
                className={`w-full px-3 py-2 ${FrontIcon ? 'pl-10' : 'pl-3'} ${
                  EndIcon || type === 'password' ? 'pr-10' : 'pr-3'
                } border ${
                  errors[name] || error
                    ? 'border-red-500'
                    : 'border-primary-500 focus:border-primary-500'
                } rounded-md focus:outline-none focus:ring-[1px] focus:ring-primary-500`}
              />
              {type === 'password' ? (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showPassword ? (
                    <AiFillEyeInvisible size={20} />
                  ) : (
                    <AiFillEye size={20} />
                  )}
                </button>
              ) : EndIcon ? (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  {React.createElement(EndIcon, { size: 20 })}
                </div>
              ) : null}
            </div>
          )}
        />
        {(errors[name] || error) && (
          <p className="text-red-500 text-sm mt-1">
            {(errors[name]?.message || error?.message) as string}
          </p>
        )}
      </div>
    );
  }
);

InputField.displayName = 'InputField';
