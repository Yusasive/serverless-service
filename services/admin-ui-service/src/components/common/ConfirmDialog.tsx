import React from 'react';

interface ConfirmDialogProps {
  message: string;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  message,
  isOpen,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
            <svg
              className="h-6 w-6 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m0-4h.01M12 18h.01"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Are you sure?</h3>
          <p className="text-sm text-gray-600 mb-6">{message}</p>
          <div className="flex justify-center gap-4">
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
