import React, { useEffect, useRef } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

const sizes = {
  sm: "max-w-md",
  md: "max-w-xl",
  lg: "max-w-2xl",
  80: "max-w-[80vw]",
  70: "max-w-[70vw]",
  90: "max-w-[90vw]",
  60: "max-w-[60vw]",
  xl: "max-w-4xl",
  full: "max-w-full",
};

const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = "md",
  showClose = true,
  preventClose = false,
  footer,
  className = "",
}) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && !preventClose) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose, preventClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !preventClose) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onClick={handleBackdropClick}
    >
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity" />

        {/* Modal panel */}
        <div
          ref={modalRef}
          className={`w-full ${sizes[size]} transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all max-h-[95vh] flex flex-col ${className}`}
        >
          {/* Header - Fixed */}
          {(title || showClose) && (
            <div className="flex justify-between items-start p-6 border-b border-gray-200 flex-shrink-0">
              <div>
                {title && (
                  <h3 className="text-lg font-semibold text-gray-900">
                    {title}
                  </h3>
                )}
                {description && (
                  <p className="mt-1 text-sm text-gray-500">{description}</p>
                )}
              </div>
              {showClose && !preventClose && (
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              )}
            </div>
          )}

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="min-h-0">{children}</div>
          </div>

          {/* Footer - Fixed */}
          {footer && (
            <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200 flex-shrink-0">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
