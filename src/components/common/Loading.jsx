import React from 'react';
import PropTypes from 'prop-types';

const LoadingSpinner = ({ 
  size = 'md', 
  variant = 'primary', 
  fullScreen = false, 
  className = '',
  message = 'Loading...'
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const variantClasses = {
    primary: 'text-primary border-primary',
    secondary: 'text-secondary border-secondary',
    success: 'text-green-500 border-green-500',
    danger: 'text-red-500 border-red-500',
    warning: 'text-yellow-500 border-yellow-500',
    info: 'text-blue-500 border-blue-500'
  };

  const containerClasses = fullScreen 
    ? 'fixed inset-0 z-[9999] flex items-center justify-center bg-white/50 backdrop-blur-sm' 
    : 'flex items-center justify-center';

  return (
    <div className={`${containerClasses} ${className}`}>
      <div className="flex flex-col items-center justify-center space-y-4">
        <div 
          className={`
            ${sizeClasses[size]} 
            ${variantClasses[variant]} 
            border-4 border-t-transparent 
            rounded-full 
            animate-spin
          `}
        />
        {message && (
          <p className={`text-${variant} text-sm font-medium`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

const LoadingBar = ({ 
  progress = 50, 
  variant = 'primary', 
  size = 'md',
  className = '',
  message = 'Loading...'
}) => {
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  const variantClasses = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    success: 'bg-green-500',
    danger: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500'
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center space-x-2">
        <div className="flex-grow bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`
              ${sizeClasses[size]} 
              ${variantClasses[variant]} 
              transition-all duration-300 ease-in-out
            `}
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-sm text-gray-600">{progress}%</span>
      </div>
      {message && (
        <p className="text-xs text-gray-500 mt-1 text-center">
          {message}
        </p>
      )}
    </div>
  );
};

const LoadingDots = ({ 
  variant = 'primary', 
  size = 'md',
  className = '',
  message = 'Loading...'
}) => {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  const variantClasses = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    success: 'bg-green-500',
    danger: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="flex space-x-2">
        {[1, 2, 3].map((dot) => (
          <div 
            key={dot}
            className={`
              ${sizeClasses[size]} 
              ${variantClasses[variant]} 
              rounded-full 
              animate-bounce 
              opacity-0
              animate-[bounce_0.6s_infinite]
              animate-delay-${dot * 100}
            `}
          />
        ))}
      </div>
      {message && (
        <span className={`ml-2 text-sm text-${variant}`}>
          {message}
        </span>
      )}
    </div>
  );
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  variant: PropTypes.oneOf(['primary', 'secondary', 'success', 'danger', 'warning', 'info']),
  fullScreen: PropTypes.bool,
  className: PropTypes.string,
  message: PropTypes.string
};

LoadingBar.propTypes = {
  progress: PropTypes.number,
  variant: PropTypes.oneOf(['primary', 'secondary', 'success', 'danger', 'warning', 'info']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
  message: PropTypes.string
};

LoadingDots.propTypes = {
  variant: PropTypes.oneOf(['primary', 'secondary', 'success', 'danger', 'warning', 'info']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
  message: PropTypes.string
};

export { LoadingSpinner, LoadingBar, LoadingDots };
