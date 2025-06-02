import React, { useContext } from 'react';
import { MoonIcon, SunIcon } from '@heroicons/react/24/solid';
import { ThemeContext } from '../../contexts/ThemeContext';

const ThemeToggle = ({ className = '', iconClassName = '' }) => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleTheme}
      className={`
        group relative flex items-center justify-center 
        w-12 h-12 rounded-full transition-all duration-300 ease-in-out
        ${isDarkMode 
          ? 'bg-gray-700 hover:bg-gray-600' 
          : 'bg-gray-100 hover:bg-gray-200'
        }
        focus:outline-none focus:ring-2 focus:ring-offset-2
        ${isDarkMode 
          ? 'focus:ring-gray-600' 
          : 'focus:ring-gray-300'
        }
        ${className}
      `}
      aria-label="Toggle dark mode"
    >
      <div className="relative w-6 h-6">
        <SunIcon 
          className={`
            absolute top-0 left-0 w-6 h-6 
            transform transition-all duration-500 ease-in-out
            ${isDarkMode 
              ? 'rotate-90 opacity-0 scale-50' 
              : 'rotate-0 opacity-100 scale-100'
            }
            text-yellow-500
            ${iconClassName}
          `}
        />
        <MoonIcon 
          className={`
            absolute top-0 left-0 w-6 h-6 
            transform transition-all duration-500 ease-in-out
            ${isDarkMode 
              ? 'rotate-0 opacity-100 scale-100' 
              : '-rotate-90 opacity-0 scale-50'
            }
            text-indigo-600
            ${iconClassName}
          `}
        />
      </div>
    </button>
  );
};

export default ThemeToggle;
