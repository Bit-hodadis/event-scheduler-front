import React from 'react';
import PropTypes from 'prop-types';
import { 
  MagnifyingGlassIcon, 
  FolderOpenIcon, 
  DocumentIcon, 
  DatabaseIcon 
} from '@heroicons/react/24/outline';

const NoResult = ({ 
  type = 'default', 
  title, 
  message, 
  action, 
  onAction,
  className = '',
  fullScreen = false
}) => {
  const typeConfig = {
    default: {
      icon: DocumentIcon,
      iconColor: 'text-gray-400',
      titleColor: 'text-gray-800',
      messageColor: 'text-gray-600',
      bgColor: 'bg-gray-50'
    },
    search: {
      icon: MagnifyingGlassIcon,
      iconColor: 'text-blue-400',
      titleColor: 'text-blue-800',
      messageColor: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    empty: {
      icon: FolderOpenIcon,
      iconColor: 'text-green-400',
      titleColor: 'text-green-800',
      messageColor: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    database: {
      icon: DatabaseIcon,
      iconColor: 'text-purple-400',
      titleColor: 'text-purple-800',
      messageColor: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  };

  const { 
    icon: Icon, 
    iconColor, 
    titleColor, 
    messageColor, 
    bgColor 
  } = typeConfig[type] || typeConfig.default;

  const containerClasses = fullScreen 
    ? 'fixed inset-0 z-[9999] flex items-center justify-center bg-white' 
    : 'w-full';

  const defaultTitle = {
    default: 'No Results Found',
    search: 'No Search Results',
    empty: 'No Data Available',
    database: 'No Records'
  }[type];

  const defaultMessage = {
    default: 'There are no items to display.',
    search: 'Try adjusting your search terms.',
    empty: 'This section appears to be empty.',
    database: 'No records have been added yet.'
  }[type];

  return (
    <div className={`${containerClasses} ${className}`}>
      <div 
        className={`
          ${bgColor} 
          rounded-lg 
          p-6 
          max-w-md 
          mx-auto 
          text-center 
          flex 
          flex-col 
          items-center 
          justify-center
          space-y-4
        `}
      >
        <div className={`p-4 rounded-full ${bgColor}`}>
          <Icon 
            className={`
              ${iconColor} 
              w-16 
              h-16 
              stroke-current 
              stroke-[1.5]
            `} 
          />
        </div>

        <div>
          <h3 
            className={`
              ${titleColor} 
              text-lg 
              font-semibold 
              mb-2
            `}
          >
            {title || defaultTitle}
          </h3>
          
          <p 
            className={`
              ${messageColor} 
              text-sm 
              mb-4
            `}
          >
            {message || defaultMessage}
          </p>
        </div>

        {action && onAction && (
          <button
            onClick={onAction}
            className={`
              px-4 
              py-2 
              text-sm 
              font-medium 
              rounded-md 
              transition-colors 
              duration-200 
              ${type === 'search' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 
                type === 'empty' ? 'bg-green-600 hover:bg-green-700 text-white' : 
                type === 'database' ? 'bg-purple-600 hover:bg-purple-700 text-white' : 
                'bg-gray-600 hover:bg-gray-700 text-white'}
            `}
          >
            {action}
          </button>
        )}
      </div>
    </div>
  );
};

NoResult.propTypes = {
  type: PropTypes.oneOf(['default', 'search', 'empty', 'database']),
  title: PropTypes.string,
  message: PropTypes.string,
  action: PropTypes.string,
  onAction: PropTypes.func,
  className: PropTypes.string,
  fullScreen: PropTypes.bool
};

export default NoResult;
