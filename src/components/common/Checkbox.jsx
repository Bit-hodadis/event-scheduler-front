import React from 'react';

const Checkbox = ({
  name,
  label,
  description,
  disabled = false,
  checked = false,
  onChange = () => {},
  className = '',
}) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <input
        type="checkbox"
        id={name}
        name={name}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className={`
          h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary 
          ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
        `}
      />
      
      {(label || description) && (
        <div className="flex flex-col">
          {label && (
            <label 
              htmlFor={name}
              className={`text-sm font-medium ${disabled ? 'text-gray-400' : 'text-gray-700'}`}
            >
              {label}
            </label>
          )}
          
          {description && (
            <p className={`text-xs ${disabled ? 'text-gray-300' : 'text-gray-500'}`}>
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Checkbox;
