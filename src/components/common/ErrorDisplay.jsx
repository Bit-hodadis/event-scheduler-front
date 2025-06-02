import React from "react";
import PropTypes from "prop-types";
import {
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

const ErrorDisplay = ({
  type = "error",
  title,
  message,
  details,
  onRetry,
  onClose,
  fullScreen = false,
  className = "",
}) => {
  const typeConfig = {
    error: {
      icon: XCircleIcon,
      iconColor: "text-red-500",
      titleColor: "text-red-800",
      bgColor: "bg-red-50",
      borderColor: "border-red-400",
    },
    warning: {
      icon: ExclamationTriangleIcon,
      iconColor: "text-yellow-500",
      titleColor: "text-yellow-800",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-400",
    },
    info: {
      icon: InformationCircleIcon,
      iconColor: "text-primary",
      titleColor: "text-primary",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-400",
    },
    validation: {
      icon: ExclamationCircleIcon,
      iconColor: "text-orange-500",
      titleColor: "text-orange-800",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-400",
    },
  };

  const {
    icon: Icon,
    iconColor,
    titleColor,
    bgColor,
    borderColor,
  } = typeConfig[type] || typeConfig.error;

  const containerClasses = fullScreen
    ? "fixed inset-0 z-[9999] flex items-center justify-center bg-white/50 backdrop-blur-sm"
    : "w-full";

  return (
    <div className={`${containerClasses} ${className}`}>
      <div
        className={`
          ${bgColor} 
          ${borderColor} 
          border 
          rounded-lg 
          p-4 
          max-w-md 
          mx-auto 
          shadow-md
        `}
      >
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Icon className={`h-6 w-6 ${iconColor} mr-3 mt-1`} />
          </div>
          <div className="flex-1">
            {title && (
              <h3
                className={`
                  ${titleColor} 
                  text-sm 
                  font-medium 
                  mb-2
                `}
              >
                {title}
              </h3>
            )}

            {message && <p className="text-sm text-gray-700 mb-2">{message}</p>}

            {details && (
              <details className="text-xs text-gray-600 bg-white/50 rounded p-2 mt-2">
                <summary className="cursor-pointer">Show Error Details</summary>
                <pre className="overflow-x-auto max-h-40 overflow-y-auto mt-2">
                  {typeof details === "object"
                    ? JSON.stringify(details, null, 2)
                    : details}
                </pre>
              </details>
            )}

            <div className="mt-4 flex space-x-2">
              {onRetry && (
                <button
                  onClick={onRetry}
                  className={`
                    inline-flex 
                    items-center 
                    px-3 
                    py-1.5 
                    border 
                    border-transparent 
                    text-xs 
                    font-medium 
                    rounded 
                    shadow-sm 
                    text-white 
                    ${
                      type === "error"
                        ? "bg-red-600 hover:bg-red-700"
                        : type === "warning"
                        ? "bg-yellow-600 hover:bg-yellow-700"
                        : type === "info"
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-orange-600 hover:bg-orange-700"
                    }
                  `}
                >
                  Retry
                </button>
              )}

              {onClose && (
                <button
                  onClick={onClose}
                  className="
                    inline-flex 
                    items-center 
                    px-3 
                    py-1.5 
                    border 
                    border-gray-300 
                    text-xs 
                    font-medium 
                    rounded 
                    text-gray-700 
                    bg-white 
                    hover:bg-gray-50
                  "
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ErrorDisplay.propTypes = {
  type: PropTypes.oneOf(["error", "warning", "info", "validation"]),
  title: PropTypes.string,
  message: PropTypes.string,
  details: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array,
  ]),
  onRetry: PropTypes.func,
  onClose: PropTypes.func,
  fullScreen: PropTypes.bool,
  className: PropTypes.string,
};

export default ErrorDisplay;
