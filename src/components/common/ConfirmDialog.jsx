import React from 'react';
import Modal from './Modal';
import Button from './Button';

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  showInput = false,
  inputValue = '',
  onInputChange = () => {},
  inputPlaceholder = 'Enter your response...',
  isLoading = false,
}) => {
  const getButtonColors = () => {
    return 'bg-primary-600 hover:bg-primary-700 focus:ring-primary-500';
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
    >
      <div className="space-y-4">
        <p className="text-sm text-gray-500">
          {message}
        </p>

        {showInput && (
          <div>
            <textarea
              value={inputValue}
              onChange={onInputChange}
              placeholder={inputPlaceholder}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            />
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            variant="primary"
            className={getButtonColors()}
            onClick={onConfirm}
            disabled={isLoading || (showInput && !inputValue.trim())}
          >
            {isLoading ? 'Processing...' : confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
