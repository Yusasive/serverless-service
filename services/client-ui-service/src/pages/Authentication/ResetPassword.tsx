import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaLock, FaEye, FaEyeSlash, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { z } from 'zod';
import LoadingOverlay from '../../components/common/LoadingOverlay';
import { UserController } from '../../controllers/UserController';
import { 
  resetPasswordSchema,
  ResetPasswordFormData
} from '../../types/formSchemas';

type Step = 'validating' | 'reset' | 'success' | 'error';

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userController = UserController.getInstance();
  const [currentStep, setCurrentStep] = useState<Step>('validating');
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [resetFormData, setResetFormData] = useState<ResetPasswordFormData>({
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Partial<ResetPasswordFormData & { submit: string }>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (!tokenParam) {
      setErrorMessage('Reset token is missing. Please request a new password reset link.');
      setCurrentStep('error');
      return;
    }
    setToken(tokenParam);
    validateToken(tokenParam);
  }, [searchParams]);

  const validateToken = async (resetToken: string) => {
    setIsLoading(true);
    try {
      const response = await userController.validateResetToken(resetToken);
      if (response.success && response.data) {
        setUserEmail(response.data.email);
        setCurrentStep('reset');
      } else {
        setErrorMessage(response.error || 'Invalid or expired reset token');
        setCurrentStep('error');
      }
    } catch (error) {
      setErrorMessage('Invalid or expired reset token. Please request a new password reset link.');
      setCurrentStep('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      const validatedData = resetPasswordSchema.parse(resetFormData);
      
      const response = await userController.resetPasswordWithToken(token, validatedData.password);
      
      if (response.success) {
        setCurrentStep('success');
      } else {
        setErrors({ submit: response.error || 'Failed to reset password' });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.errors.reduce((acc, err) => {
          if (err.path[0]) {
            const field = err.path[0] as keyof ResetPasswordFormData;
            acc[field] = err.message;
          }
          return acc;
        }, {} as Partial<ResetPasswordFormData>);
        setErrors(fieldErrors);
      } else {
        setErrors({ submit: error instanceof Error ? error.message : 'An error occurred' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderValidatingStep = () => (
    <div className="max-w-md w-full text-center">
      <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Validating Reset Link</h2>
      <p className="text-gray-600">
        Please wait while we validate your password reset link...
      </p>
    </div>
  );

  const renderResetStep = () => (
    <div className="max-w-md w-full">
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
          <FaLock className="text-2xl text-primary-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Reset Your Password</h2>
        <p className="text-gray-600">
          Enter your new password below.
        </p>
        {userEmail && (
          <p className="text-sm text-gray-500 mt-2">
            Resetting password for: <span className="font-medium">{userEmail}</span>
          </p>
        )}
      </div>

      {errors.submit && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-4">
          {errors.submit}
        </div>
      )}

      <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={resetFormData.password}
              onChange={(e) => setResetFormData({ ...resetFormData, password: e.target.value })}
              placeholder="Enter your new password"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={resetFormData.confirmPassword}
              onChange={(e) => setResetFormData({ ...resetFormData, confirmPassword: e.target.value })}
              placeholder="Confirm your new password"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-4 rounded-lg font-medium transition duration-200"
        >
          Reset Password
        </button>
      </form>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="max-w-md w-full text-center">
      <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
        <FaCheckCircle className="text-2xl text-green-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Password Reset Successfully!</h2>
      <p className="text-gray-600 mb-8">
        Your password has been updated successfully. You can now log in with your new password.
      </p>
      
      <button
        onClick={() => navigate('/login')}
        className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-4 rounded-lg font-medium transition duration-200"
      >
        Go to Login
      </button>
    </div>
  );

  const renderErrorStep = () => (
    <div className="max-w-md w-full text-center">
      <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <FaExclamationTriangle className="text-2xl text-red-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Invalid Reset Link</h2>
      <p className="text-gray-600 mb-8">
        {errorMessage}
      </p>
      
      <div className="space-y-3">
        <button
          onClick={() => navigate('/forget-password')}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-4 rounded-lg font-medium transition duration-200"
        >
          Request New Reset Link
        </button>
        
        <button
          onClick={() => navigate('/login')}
          className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-4 rounded-lg font-medium transition duration-200"
        >
          Back to Login
        </button>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'validating':
        return renderValidatingStep();
      case 'reset':
        return renderResetStep();
      case 'success':
        return renderSuccessStep();
      case 'error':
        return renderErrorStep();
      default:
        return renderValidatingStep();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950 p-4">
      <LoadingOverlay isLoading={isLoading} message={
        currentStep === 'validating' ? 'Validating reset link...' : 
        currentStep === 'reset' ? 'Resetting password...' : 'Processing...'
      } />
      
      {/* White card */}
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full relative">
        {/* Logo */}
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
          <img
            onClick={() => navigate('/')}
            src="/images/litf_logo.png"
            alt="LITF Logo"
            className="w-20 h-20 rounded-full shadow-md bg-white p-1 hover:cursor-pointer"
          />
        </div>

        {/* Extra space for the logo */}
        <div className="h-12" />

        {renderCurrentStep()}
      </div>
    </div>
  );
};

export default ResetPassword;
