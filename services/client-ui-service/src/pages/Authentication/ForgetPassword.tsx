import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaCheckCircle } from 'react-icons/fa';
import { z } from 'zod';
import LoadingOverlay from '../../components/common/LoadingOverlay';
import { UserController } from '../../controllers/UserController';
import { CommunicationController } from '../../controllers/CommunicationController';
import { 
  forgotPasswordSchema,
  ForgotPasswordFormData
} from '../../types/formSchemas';
import { SendEmailRequest } from '@/repository/CommunicationRepository';
import { generatePasswordResetEmailHTML, PasswordResetEmailData } from '@/templates/passwordResetEmailTemplate';

type Step = 'email' | 'success';

const ForgetPassword: React.FC = () => {
  const navigate = useNavigate();
  const userController = UserController.getInstance();
  const communicationController = CommunicationController.getInstance();
  const [currentStep, setCurrentStep] = useState<Step>('email');
  const [isLoading, setIsLoading] = useState(false);
  const [emailFormData, setEmailFormData] = useState<ForgotPasswordFormData>({ email: '' });
  const [errors, setErrors] = useState<Partial<ForgotPasswordFormData & { submit: string }>>({});

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      const validatedData = forgotPasswordSchema.parse(emailFormData);
      
      const response = await userController.forgotPassword(validatedData.email);

      if (response.success && response.data) {
        const passwordResetEmailData: PasswordResetEmailData = {
            customerName: validatedData.email,
            resetToken: response.data.resetToken,
            resetUrl: `${window.location.origin}/reset-password?token=${response.data.resetToken}`,
            expiryTime: '30 minutes',
            companyName: 'Lagos International Trade Fair',
            companyEmail: 'info@lagosinternationaltradefair.com',
            companyPhone: '+2347005246724',
            companyAddress: 'Lagos International Trade Fair, Lagos, Nigeria',
            supportEmail: 'info@lagosinternationaltradefair.com',
            companyWebsite: 'https://www.lagosinternationaltradefair.com',
        };

        const emailRequest: SendEmailRequest = {
          to: [validatedData.email],
          subject: 'Reset Password',
          htmlBody: generatePasswordResetEmailHTML(passwordResetEmailData),
        };

        // Send Forget Password Email
        const emailResponse = await communicationController.sendEmail(emailRequest);
        if (emailResponse) {
          console.log("Email sent successfully");
          setCurrentStep('success');
        } else {
          setErrors({ submit: emailResponse.error || 'Failed to send reset email' });
        }
      } else {
        setErrors({ submit: response.error || 'Failed to send reset email' });
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

  const renderEmailStep = () => (
    <div className="max-w-md w-full">
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
          <FaEnvelope className="text-2xl text-primary-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Forgot Password?</h2>
        <p className="text-gray-600">
          Enter your email address and we'll send you a password reset link.
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
          Send Reset Link
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

  const renderSuccessStep = () => (
    <div className="max-w-md w-full text-center">
      <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
        <FaCheckCircle className="text-2xl text-green-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Check Your Email!</h2>
      <p className="text-gray-600 mb-8">
        We've sent a password reset link to <span className="font-medium">{emailFormData.email}</span>. 
        Please check your email and click the link to reset your password.
      </p>
      
      <button
        onClick={() => navigate('/login')}
        className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-4 rounded-lg font-medium transition duration-200"
      >
        Back to Login
      </button>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'email':
        return renderEmailStep();
      case 'success':
        return renderSuccessStep();
      default:
        return renderEmailStep();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950 p-4">
      <LoadingOverlay isLoading={isLoading} message={
        currentStep === 'email' ? 'Sending reset email...' : 'Processing...'
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

export default ForgetPassword;
