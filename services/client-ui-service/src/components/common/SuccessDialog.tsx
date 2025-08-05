import React, { useEffect } from 'react';

interface SuccessDialogProps {
  message: string;
  onRedirect: () => void;
  isOpen: boolean;
  showButton?: boolean;
  buttonText?: string;
  autoRedirect?: boolean;
}

const SuccessDialog: React.FC<SuccessDialogProps> = ({ 
  message, 
  onRedirect, 
  isOpen, 
  showButton = true, 
  buttonText = 'Continue',
  autoRedirect = false 
}) => {
  useEffect(() => {
    if (isOpen && autoRedirect) {
      const timer = setTimeout(() => {
        onRedirect();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onRedirect, autoRedirect]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Success!</h3>
          <p className="text-sm text-gray-500 mb-4">{message}</p>
          {showButton && (
            <button
              onClick={onRedirect}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-md transition"
            >
              {buttonText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuccessDialog; 