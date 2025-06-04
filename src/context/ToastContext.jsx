import React, { createContext, useContext, useState, useCallback } from 'react';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ExclamationTriangleIcon, 
  InformationCircleIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((type, message, duration = 3000) => {
    const id = Date.now();
    
    const toast = {
      id,
      type,
      message,
      icon: getIcon(type),
      color: getColor(type)
    };

    setToasts(prev => [...prev, toast]);

    if (duration !== Infinity) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const success = useCallback((message, duration) => {
    return addToast('success', message, duration);
  }, [addToast]);

  const error = useCallback((message, duration) => {
    return addToast('error', message, duration);
  }, [addToast]);

  const warning = useCallback((message, duration) => {
    return addToast('warning', message, duration);
  }, [addToast]);

  const info = useCallback((message, duration) => {
    return addToast('info', message, duration);
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ success, error, warning, info, removeToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2 w-full max-w-sm">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`
              ${toast.color.bg}
              ${toast.color.border}
              p-4 rounded-lg shadow-lg 
              transform transition-all duration-300 ease-in-out
              translate-x-0 opacity-100
              hover:translate-x-1
              flex items-center justify-between
            `}
            role="alert"
          >
            <div className="flex items-center space-x-3">
              <div className={toast.color.icon}>
                {toast.icon}
              </div>
              <p className={`text-sm font-medium ${toast.color.text}`}>
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className={`
                ${toast.color.closeButton}
                rounded-lg p-1.5
                hover:bg-opacity-20
                transition-colors duration-200
              `}
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

function getIcon(type) {
  const className = "w-5 h-5";
  switch (type) {
    case 'success':
      return <CheckCircleIcon className={className} />;
    case 'error':
      return <XCircleIcon className={className} />;
    case 'warning':
      return <ExclamationTriangleIcon className={className} />;
    case 'info':
      return <InformationCircleIcon className={className} />;
    default:
      return null;
  }
}

function getColor(type) {
  switch (type) {
    case 'success':
      return {
        bg: 'bg-green-50',
        border: 'border-l-4 border-green-500',
        text: 'text-green-800',
        icon: 'text-green-500',
        closeButton: 'text-green-500 hover:bg-green-500'
      };
    case 'error':
      return {
        bg: 'bg-red-50',
        border: 'border-l-4 border-red-500',
        text: 'text-red-800',
        icon: 'text-red-500',
        closeButton: 'text-red-500 hover:bg-red-500'
      };
    case 'warning':
      return {
        bg: 'bg-yellow-50',
        border: 'border-l-4 border-yellow-500',
        text: 'text-yellow-800',
        icon: 'text-yellow-500',
        closeButton: 'text-yellow-500 hover:bg-yellow-500'
      };
    case 'info':
      return {
        bg: 'bg-blue-50',
        border: 'border-l-4 border-blue-500',
        text: 'text-blue-800',
        icon: 'text-blue-500',
        closeButton: 'text-blue-500 hover:bg-blue-500'
      };
    default:
      return {};
  }
}

export const toast = {
  success: (message, duration) => {
    const { success } = useToast();
    return success(message, duration);
  },
  error: (message, duration) => {
    const { error } = useToast();
    return error(message, duration);
  },
  warning: (message, duration) => {
    const { warning } = useToast();
    return warning(message, duration);
  },
  info: (message, duration) => {
    const { info } = useToast();
    return info(message, duration);
  }
};
