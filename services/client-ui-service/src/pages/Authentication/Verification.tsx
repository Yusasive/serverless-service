import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import LoadingOverlay from '../../components/common/LoadingOverlay';
import SuccessDialog from '../../components/common/SuccessDialog';
import { FaEnvelope, FaShieldAlt, FaCheckCircle } from 'react-icons/fa';
import { UserController } from '../../controllers/UserController';
import { CommunicationController } from '../../controllers/CommunicationController';
import { generateVerificationEmailHTML } from '@/templates/sendverificationEmailTemplate';
import { useUser } from '../../context/UserContext';

interface VerificationFormData {
  email: string;
  code: string;
}

const Verification: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const isTwoFactor = searchParams.get('twoFactor') === 'true';
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [submitError, setSubmitError] = useState<string>('');
  const userController = UserController.getInstance();
  const communicationController = CommunicationController.getInstance();
  const { setUser } = useUser();
  
  const [formData, setFormData] = useState<VerificationFormData>({
    email: email,
    code: '',
  });
  
  const [errors, setErrors] = useState<Partial<VerificationFormData>>({});

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSubmitError('');
    setIsLoading(true);

    try {
      if (!formData.code || formData.code.length !== 6) {
        setErrors({ code: 'Please enter a valid 6-digit verification code' });
        return;
      }

      let result;
      if (isTwoFactor) {
        result = await userController.verifyTwoFactor(formData.email, formData.code);
        
        if (result.success && result.data) {
          const userData = (result.data as any).data || result.data;
          
          setUser(userData);
          
          switch (userData.userType.toLowerCase()) {
            case 'exhibitor':
              navigate('/exhibitor/dashboard');
              break;
            case 'attendee':
              navigate('/attendee/dashboard');
              break;
            case 'staff':
              navigate('/staff/dashboard');
              break;
            default:
              navigate('/');
              break;
          }
        } else {
          console.error("2FA verification failed:", result.error);
          setSubmitError(result.error || 'Two-factor verification failed');
        }
      } else {
        result = await userController.verifyEmail(formData.email, formData.code);
        
        if (result.success) {
          setShowSuccess(true);
        } else {
          setSubmitError(result.error || 'Verification failed');
        }
      }
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResendLoading(true);
    setSubmitError('');

    try {
      let result;
      let verificationCode;
      
      if (isTwoFactor) {
        setSubmitError('Please go back to login and try again to get a new code');
        setResendLoading(false);
        return;
      } else {
        result = await userController.resendVerificationCode(formData.email);
        if (result.success && result.data) {
          verificationCode = result.data.verificationCode;
        }
      }

      if (result.success && result.data && verificationCode) {
        try {
          const emailData = {
            customerName: formData.email.split('@')[0],
            verificationCode: verificationCode.toString(),
            expiryTime: '30 minutes',
            companyName: 'Lagos International Trade Fair',
            companyEmail: 'info@lagosinternationaltradefair.com',
            companyPhone: '+234 803 300 0000',
            companyAddress: 'Lagos International Trade Fair, Lagos, Nigeria',
            supportEmail: 'info@lagosinternationaltradefair.com',
            companyWebsite: 'https://shop.lagosinternationaltradefair.com',
          };

          const emailRequest = {
            to: [formData.email],
            subject: isTwoFactor ? 'LITF 2025 - New Two-Factor Authentication Code' : 'LITF 2025 - New Verification Code',
            htmlBody: generateVerificationEmailHTML(emailData),
          };

          await communicationController.sendEmail(emailRequest);
          setCountdown(60);
        } catch (emailError) {
          console.error('Error sending verification email:', emailError);
          setSubmitError('Failed to send verification email');
        }
      } else {
        setSubmitError(result.error || 'Failed to resend verification code');
      }
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to resend verification code');
    } finally {
      setResendLoading(false);
    }
  };

  const handleRedirect = () => {
    navigate('/login');
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6); // Only allow digits, max 6
    setFormData({ ...formData, code: value });
    if (errors.code) {
      setErrors({ ...errors, code: undefined });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950 p-4 pt-20">
      <LoadingOverlay isLoading={isLoading} message={isTwoFactor ? "Verifying your code..." : "Verifying your email..."} />
      <SuccessDialog 
        isOpen={showSuccess}
        message="Email verified successfully! You can now sign in to your account."
        onRedirect={handleRedirect}
        buttonText="Sign In"
        autoRedirect={false}
      />
      
      {/* White card */}
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full relative">
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

        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 mb-4">
            {isTwoFactor ? (
              <FaShieldAlt className="h-8 w-8 text-primary-600" />
            ) : (
              <FaEnvelope className="h-8 w-8 text-primary-600" />
            )}
          </div>
          <h2 className="text-2xl font-bold text-primary-600 mb-2">
            {isTwoFactor ? 'Two-Factor Authentication' : 'Verify Your Email'}
          </h2>
          <p className="text-gray-500">
            We've sent a 6-digit verification code to
          </p>
          <p className="text-gray-700 font-medium">{formData.email}</p>
        </div>

        {/* Error Message */}
        {submitError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{submitError}</p>
          </div>
        )}

        {/* Verification Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Code Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Verification Code
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.code}
                onChange={handleCodeChange}
                placeholder="Enter 6-digit code"
                className={`w-full border rounded-lg px-4 py-3 text-center text-lg font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-primary-400 ${
                  errors.code ? 'border-red-500' : 'border-gray-300'
                }`}
                maxLength={6}
                autoComplete="one-time-code"
              />
              {formData.code.length === 6 && !errors.code && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <FaCheckCircle className="h-5 w-5 text-green-500" />
                </div>
              )}
            </div>
            {errors.code && (
              <p className="text-red-500 text-sm mt-1">{errors.code}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={formData.code.length !== 6 || isLoading}
            className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition duration-200"
          >
            {isLoading ? 'Verifying...' : (isTwoFactor ? 'Verify Code' : 'Verify Email')}
          </button>
        </form>

        {/* Resend Code Section - Only show for email verification, not 2FA */}
        {!isTwoFactor && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-2">
              Didn't receive the code?
            </p>
            {countdown > 0 ? (
              <p className="text-sm text-gray-500">
                Resend available in {countdown} seconds
              </p>
            ) : (
              <button
                onClick={handleResendCode}
                disabled={resendLoading}
                className="text-primary-600 hover:text-primary-700 font-medium text-sm disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                {resendLoading ? 'Sending...' : 'Resend Code'}
              </button>
            )}
          </div>
        )}

        {/* Back to Login */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/login')}
            className="text-sm text-gray-600 hover:text-gray-800 font-medium"
          >
            ← Back to Sign In
          </button>
        </div>

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <FaShieldAlt className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Security Notice</p>
              <p>
                {isTwoFactor 
                  ? "This two-factor authentication code will expire in 10 minutes for your security. Keep your account safe by never sharing this code."
                  : "This verification code will expire in 30 minutes for your security. If you didn't request this code, please ignore this email."
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verification;
