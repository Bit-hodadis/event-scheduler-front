import React, { forwardRef } from 'react';
import { FieldError } from 'react-hook-form';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: FieldError;
  helperText?: string;
  fullWidth?: boolean;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  { 
    label, 
    error, 
    helperText, 
    fullWidth = false,
    className = '', 
    id,
    rows = 4,
    ...props 
  }, 
  ref
) {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');
    const isError = !!error;

    const baseStyles = 'block rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm';
    const errorStyles = isError ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500' : '';
    const widthStyles = fullWidth ? 'w-full' : '';

    return (
      <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
        {label && (
          <label htmlFor={textareaId} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={`${baseStyles} ${errorStyles} ${widthStyles}`}
          aria-invalid={isError}
          aria-describedby={isError ? `${textareaId}-error` : undefined}
          {...props}
        />
        {(error || helperText) && (
          <p 
            className={`mt-1 text-sm ${isError ? 'text-red-600' : 'text-gray-500'}`}
            id={isError ? `${textareaId}-error` : undefined}
          >
            {error?.message || helperText}
          </p>
        )}
      </div>
    );
  }
);
