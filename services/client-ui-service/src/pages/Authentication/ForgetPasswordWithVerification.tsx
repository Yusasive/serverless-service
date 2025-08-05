import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaEye, FaEyeSlash, FaLock, FaCheckCircle } from 'react-icons/fa';
import { z } from 'zod';
import LoadingOverlay from '../../components/common/LoadingOverlay';
import { UserController } from '../../controllers/UserController';
import { CommunicationController } from '../../controllers/CommunicationController';
import { 
  forgotPasswordSchema, 
  resetPasswordSchema, 
  ForgotPasswordFormData,
  ResetPasswordFormData,
} from '../../types/formSchemas';
import { SendEmailRequest } from '@/repository/CommunicationRepository';
import { generatePasswordResetEmailHTML, PasswordResetEmailData } from '@/templates/passwordResetEmailTemplate';

type Step = 'email' | 'verification' | 'reset' | 'success';

const ForgetPasswordWithVerification: React.FC = () => {
  const navigate = useNavigate();
  const userController = UserController.getInstance();
  const communicationController = CommunicationController.getInstance();
  const [currentStep, setCurrentStep] = useState<Step>('email');
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [emailFormData, setEmailFormData] = useState<ForgotPasswordFormData>({ email: '' });
  const [resetFormData, setResetFormData] = useState<ResetPasswordFormData>({
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Partial<ForgotPasswordFormData & ResetPasswordFormData & { submit: string; verificationCode: string }>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      const validatedData = forgotPasswordSchema.parse(emailFormData);
      
      const response = await userController.forgotPassword(validatedData.email);
      
      if (response.success && response.data) {
        setEmail(validatedData.email);
        setCurrentStep('verification');

        const passwordResetEmailData: PasswordResetEmailData = {
            customerName: validatedData.email,
            resetToken: response.data.resetToken,
            resetUrl: `${process.env.REACT_APP_FRONTEND_URL}/reset-password?token=${response.data.resetToken}`,
            expiryTime: '30 minutes',
            companyName: 'Lagos International Trade Fair',
            companyEmail: 'info@lagosinternationaltradefair.com',
            companyPhone: '+234 803 300 0000',
            companyAddress: 'Lagos International Trade Fair, Lagos, Nigeria',
            supportEmail: 'info@lagosinternationaltradefair.com',
            companyWebsite: 'https://shop.lagosinternationaltradefair.com',
        };

        const emailRequest: SendEmailRequest = {
          to: [validatedData.email],
          subject: 'Reset Password',
          htmlBody: generatePasswordResetEmailHTML(passwordResetEmailData),
        };

        // Send Forget Password Email
        const emailResponse = await communicationController.sendEmail(emailRequest);
        if (emailResponse.success) {
          console.log("Email sent successfully");
          setCurrentStep('verification');
        } else {
          setErrors({ submit: emailResponse.error || 'Failed to send verification code' });
        }
      } else {
        setErrors({ submit: response.error || 'Failed to send verification code' });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.errors.reduce((acc, err) => {
          if (err.path[0]) {
            const field = err.path[0] as keyof ForgotPasswordFormData;
            acc[field] = err.message;
          }
          return acc;
        }, {} as Partial<ForgotPasswordFormData>);
        setErrors(fieldErrors);
      } else {
        setErrors({ submit: error instanceof Error ? error.message : 'An error occurred' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      if (!verificationCode.trim()) {
        setErrors({ verificationCode: 'Please enter the verification code' });
        return;
      }

      const response = await userController.verifyResetCode(email, verificationCode);
      
      if (response.success) {
        setCurrentStep('reset');
      } else {
        setErrors({ submit: response.error || 'Invalid verification code' });
      }
    } catch (error) {
      setErrors({ submit: error instanceof Error ? error.message : 'Invalid verification code' });
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
      
      const response = await userController.resetPassword(email, verificationCode, validatedData.password);
      
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

  const resendVerificationCode = async () => {
    setIsLoading(true);
    try {
      const response = await userController.resendVerificationCode(email);
      
      if (!response.success) {
        setErrors({ submit: response.error || 'Failed to resend verification code' });
      }
      // TODO: Add success toast notification
    } catch (error) {
      setErrors({ submit: 'Failed to resend verification code' });
    } finally {
      setIsLoading(false);
    }
  };

  const renderEmailStep = () => (
    <div className="max-w-md w-full">
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
          <FaEnvelope className="text-2xl text-primary-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Forgot Password?</h2>
        <p className="text-gray-600">
          Enter your email address and we'll send you a verification code to reset your password.
        </p>
      </div>

      {errors.submit && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-4">
          {errors.submit}
        </div>
      )}

      <form onSubmit={handleEmailSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              value={emailFormData.email}
              onChange={(e) => setEmailFormData({ ...emailFormData, email: e.target.value })}
              placeholder="Enter your email address"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            />
            <FaEnvelope className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-4 rounded-lg font-medium transition duration-200"
        >
          Send Verification Code
        </button>
      </form>

      <div className="text-center mt-6">
        <button
          onClick={() => navigate('/login')}
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          Back to Login
        </button>
      </div>
    </div>
  );

  const renderVerificationStep = () => (
    <div className="max-w-md w-full">
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
          <FaEnvelope className="text-2xl text-primary-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Check Your Email</h2>
        <p className="text-gray-600 mb-4">
          We've sent a verification code to <span className="font-medium">{email}</span>
        </p>
        <p className="text-sm text-gray-500">
          Enter the 6-digit code from your email to continue.
        </p>
      </div>

      {errors.submit && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-4">
          {errors.submit}
        </div>
      )}

      <form onSubmit={handleVerificationSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Verification Code
          </label>
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="Enter 6-digit code"
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-center text-lg font-mono ${
              errors.verificationCode ? 'border-red-500' : 'border-gray-300'
            }`}
            maxLength={6}
            required
          />
          {errors.verificationCode && (
            <p className="text-red-500 text-sm mt-1">{errors.verificationCode}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-4 rounded-lg font-medium transition duration-200"
        >
          Verify Code
        </button>
      </form>

      <div className="text-center mt-6 space-y-3">
        <button
          onClick={resendVerificationCode}
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          Resend Code
        </button>
        <div>
          <button
            onClick={() => setCurrentStep('email')}
            className="text-gray-600 hover:text-gray-700"
          >
            Use different email
          </button>
        </div>
      </div>
    </div>
  );

  const renderResetStep = () => (
    <div className="max-w-md w-full">
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
          <FaLock className="text-2xl text-primary-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Create New Password</h2>
        <p className="text-gray-600">
          Your password must be at least 8 characters long and include uppercase, lowercase, number, and special character.
        </p>
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
              placeholder="Enter new password"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 pr-10 ${
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
              placeholder="Confirm new password"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 pr-10 ${
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
        Your password has been updated. You can now sign in with your new password.
      </p>
      
      <button
        onClick={() => navigate('/login')}
        className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-4 rounded-lg font-medium transition duration-200"
      >
        Sign In
      </button>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'email':
        return renderEmailStep();
      case 'verification':
        return renderVerificationStep();
      case 'reset':
        return renderResetStep();
      case 'success':
        return renderSuccessStep();
      default:
        return renderEmailStep();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950 p-4">
      <LoadingOverlay isLoading={isLoading} message={
        currentStep === 'email' ? 'Sending verification code...' :
        currentStep === 'verification' ? 'Verifying code...' :
        currentStep === 'reset' ? 'Resetting password...' :
        'Processing...'
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

export default ForgetPasswordWithVerification; 