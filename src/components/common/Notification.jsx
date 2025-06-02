import { toast } from 'react-hot-toast';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ExclamationTriangleIcon, 
  InformationCircleIcon 
} from '@heroicons/react/24/outline';

const createNotification = {
  success: (message, options = {}) => {
    return toast.success(message, {
      duration: 3000,
      position: 'top-right',
      className: 'bg-white shadow-lg rounded-lg p-4 border-l-4 border-green-500',
      icon: <CheckCircleIcon className="w-6 h-6 text-green-500" />,
      ...options,
    });
  },

  error: (message, options = {}) => {
    return toast.error(message, {
      duration: 4000,
      position: 'top-right',
      className: 'bg-white shadow-lg rounded-lg p-4 border-l-4 border-red-500',
      icon: <XCircleIcon className="w-6 h-6 text-red-500" />,
      ...options,
    });
  },

  warning: (message, options = {}) => {
    return toast(message, {
      duration: 3500,
      position: 'top-right',
      className: 'bg-white shadow-lg rounded-lg p-4 border-l-4 border-yellow-500',
      icon: <ExclamationTriangleIcon className="w-6 h-6 text-yellow-500" />,
      ...options,
    });
  },

  info: (message, options = {}) => {
    return toast(message, {
      duration: 3000,
      position: 'top-right',
      className: 'bg-white shadow-lg rounded-lg p-4 border-l-4 border-blue-500',
      icon: <InformationCircleIcon className="w-6 h-6 text-blue-500" />,
      ...options,
    });
  },

  promise: async (promise, messages = {}, options = {}) => {
    const defaultMessages = {
      loading: 'Processing...',
      success: 'Operation completed successfully',
      error: 'Operation failed'
    };

    return toast.promise(
      promise,
      {
        loading: messages.loading || defaultMessages.loading,
        success: messages.success || defaultMessages.success,
        error: (err) => messages.error || err.message || defaultMessages.error,
      },
      {
        className: 'bg-white shadow-lg rounded-lg p-4',
        success: {
          duration: 3000,
          icon: <CheckCircleIcon className="w-6 h-6 text-green-500" />,
          className: 'border-l-4 border-green-500',
        },
        error: {
          duration: 4000,
          icon: <XCircleIcon className="w-6 h-6 text-red-500" />,
          className: 'border-l-4 border-red-500',
        },
        loading: {
          icon: null,
          className: 'border-l-4 border-blue-500',
        },
        ...options,
      }
    );
  },

  // Custom notification for CRUD operations
  crud: {
    created: (entity = 'Item') => {
      return createNotification.success(`${entity} created successfully`);
    },
    updated: (entity = 'Item') => {
      return createNotification.success(`${entity} updated successfully`);
    },
    deleted: (entity = 'Item') => {
      return createNotification.success(`${entity} deleted successfully`);
    },
    failed: (operation = 'Operation', error = 'An error occurred') => {
      return createNotification.error(`${operation} failed: ${error}`);
    }
  },

  // Dismiss all notifications
  dismissAll: () => toast.dismiss(),

  // Custom notification with action buttons
  withAction: (message, actions = [], options = {}) => {
    return toast(
      (t) => (
        <div className="flex items-center justify-between min-w-[300px]">
          <span className="flex-1">{message}</span>
          <div className="flex items-center space-x-2 ml-4">
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={() => {
                  action.onClick();
                  if (action.dismiss !== false) toast.dismiss(t.id);
                }}
                className={`px-2 py-1 text-sm font-medium rounded ${
                  action.variant === 'primary'
                    ? 'bg-primary text-white hover:bg-primary-dark'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {action.text}
              </button>
            ))}
          </div>
        </div>
      ),
      {
        duration: 5000,
        position: 'top-right',
        className: 'bg-white shadow-lg rounded-lg p-4',
        ...options,
      }
    );
  }
};

export default createNotification;
