// components/Register.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { UserController } from '../../controllers/UserController';
import { CommunicationController } from '../../controllers/CommunicationController';
import LoadingOverlay from '../../components/common/LoadingOverlay';
import { registerSchema, RegisterFormData } from '../../types/formSchemas';
import { z } from 'zod';
import { RegisterRequest, UserRegistrationRole } from '@/repository/UserRepository';
import { useUser } from '@/context/UserContext';
import { FaGift, FaEye, FaEyeSlash } from 'react-icons/fa';
import { generateVerificationEmailHTML } from '@/templates/sendverificationEmailTemplate';
import PhoneInput from '@/components/common/PhoneInput';

// Terms Modal Component
const TermsModal: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white max-w-2xl w-full max-h-[80vh] overflow-y-auto rounded-xl shadow-lg p-6 relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-2xl">&times;</button>
        <h2 className="text-2xl font-bold mb-4 text-green-800">Terms and Conditions for Participation</h2>
        <ol className="list-decimal pl-6 space-y-4 text-gray-800">
          <li>
            <span className="font-semibold text-red-600">Application & Payment</span>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Participation is confirmed only after full payment and a completed application form.</li>
              <li>Allocation of space is first come, first served.</li>
              <li>Payments are non-refundable, even if an exhibitor cancels or fails to attend.</li>
            </ul>
          </li>
          <li>
            <span className="font-semibold text-red-600">Exhibition Booths & Space</span>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Exhibitors must stick to their allocated spaces.</li>
              <li>Sharing or subletting of space is prohibited.</li>
              <li>Booth designs must be approved in advance and must not obstruct other exhibitors.</li>
            </ul>
          </li>
          <li>
            <span className="font-semibold text-red-600">Setup & Dismantling</span>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Booth setup must be completed before the opening.</li>
              <li>Exhibitors may not dismantle before the official closing of the fair.</li>
            </ul>
          </li>
          <li>
            <span className="font-semibold text-red-600">Conduct & Use of Premises</span>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Exhibitors are responsible for the cleanliness and security of their booths.</li>
              <li>Offensive or dangerous displays are not allowed.</li>
              <li>Noise levels must be kept within acceptable limits.</li>
            </ul>
          </li>
          <li>
            <span className="font-semibold text-red-600">Security & Insurance</span>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>General security will be provided, but exhibitors are advised to secure their valuables.</li>
              <li>The organizers are not liable for losses, damages, or injuries.</li>
            </ul>
          </li>
          <li>
            <span className="font-semibold text-red-600">Advertising & Promotions</span>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>All promotional materials and activities within the fairgrounds must be approved by the organizers.</li>
              <li>Loud music, live performances, or mascots need special permission.</li>
            </ul>
          </li>
          <li>
            <span className="font-semibold text-red-600">Compliance</span>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Exhibitors must comply with all local laws, safety, and fire regulations.</li>
              <li>The organizers reserve the right to remove non-compliant exhibitors.</li>
            </ul>
          </li>
          <li>
            <span className="font-semibold text-red-600">Force Majeure</span>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>The organizers are not liable for cancellations or disruptions due to events beyond their control (e.g., natural disasters, government action).</li>
            </ul>
          </li>
          <li>
            <span className="font-semibold text-red-600">Disputes</span>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Any disputes will be resolved under Nigeria law.</li>
            </ul>
          </li>
        </ol>
      </div>
    </div>
  );
};



const Register: React.FC = () => {
  const { user, loading } = useUser();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role')?.toUpperCase() || 'ATTENDEE';
  const local = searchParams.get('local')?.toUpperCase() || 'LOCAL';
  const referralCode = searchParams.get('ref');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const userController = UserController.getInstance();
  const communicationController = CommunicationController.getInstance();
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    password: '',
    confirm_password: '',
    phone: '',
  });

  const [errors, setErrors] = useState<Partial<RegisterFormData>>({});
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  // Memoize the phone onChange function to prevent infinite re-renders
  const handlePhoneChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, phone: value }));
  }, []);

  const passwordConstraints = [
    { label: 'At least 8 characters', regex: /.{8,}/ },
    { label: 'At least one uppercase letter', regex: /[A-Z]/ },
    { label: 'At least one lowercase letter', regex: /[a-z]/ },
    { label: 'At least one number', regex: /[0-9]/ },
    { label: 'At least one special character', regex: /[^A-Za-z0-9]/ },
  ];

  const checkPasswordConstraint = (password: string, regex: RegExp) => {
    return regex.test(password);
  };

  useEffect(() => {
    if (!loading && user) {
      switch (user.userType.toLowerCase()) {
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
    }

  }, [user, loading, navigate]);

  const handleRegister = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      const validatedData = registerSchema.parse(formData);
      const userRole: UserRegistrationRole = role as UserRegistrationRole;

      const registerRequest: RegisterRequest = {
        email: validatedData.email,
        password: validatedData.password,
        user_type: userRole,
        phone: validatedData.phone,
        company_name: formData.company_name,
        local: local,
        referral_code: referralCode || undefined
      };
      
      const result = await userController.register(registerRequest);

      if (result.success && result.data) {
        // Send verification email
        try {
          const emailData = {
            customerName: validatedData.email.split('@')[0], // Use email prefix as name
            verificationCode: result.data.data.verificationCode.toString(),
            expiryTime: '30 minutes',
            companyName: 'Lagos International Trade Fair',
            companyEmail: 'info@lagosinternationaltradefair.com',
            companyPhone: '+234 803 300 0000',
            companyAddress: 'Lagos International Trade Fair, Lagos, Nigeria',
            supportEmail: 'info@lagosinternationaltradefair.com',
            companyWebsite: 'https://shop.lagosinternationaltradefair.com',
          };

          const emailRequest = {
            to: [validatedData.email],
            subject: 'Welcome to LITF 2025 - Verify Your Email',
            htmlBody: generateVerificationEmailHTML(emailData),
          };

          await communicationController.sendEmail(emailRequest);
        } catch (emailError) {
          console.error('Error sending verification email:', emailError);
          // Don't fail registration if email fails
        }

        // Redirect to verification page with email
        navigate(`/verification?email=${encodeURIComponent(validatedData.email)}`);
      } else {
        setErrors({ submit: result.error || 'An error occurred during registration' });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<RegisterFormData> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof RegisterFormData] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        setErrors({ submit: error instanceof Error ? error.message : 'An error occurred during registration' });
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950 p-4 pt-20">
      <LoadingOverlay isLoading={isLoading} message="Registering your account..." />
      {/* White card */}
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative mx-auto">
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

        {/* Referral Banner */}
        {referralCode && (
          <div className="mb-6 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <FaGift className="w-5 h-5 text-green-600 mr-3" />
              <div>
                <h3 className="font-semibold text-green-800">You've been invited!</h3>
                <p className="text-sm text-green-700">
                  A friend has invited you to join LITF 2025. You'll get special benefits!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Registration Form */}
        <div>
          <h2 className="text-2xl font-bold text-primary-600 mb-2">Create Account</h2>
          <div className="flex flex-col items-start space-y-2 mt-4">
            <div className="text-sm text-gray-600">
                Already have an account?{' '}
                <button
                  onClick={() => navigate('/login')}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Sign in
                </button>
              </div>
            </div>

          {errors.submit && (
            <div className="text-red-500 text-sm text-center mb-4">{errors.submit}</div>
          )}

          <div className="mt-6">
            <form className="space-y-4" onSubmit={handleRegister}>
              <div>
                <label className="text-sm text-gray-600">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full border rounded-md px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-primary-400 ${errors.email ? 'border-red-500' : ''}`}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="text-sm text-gray-600">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={`w-full border rounded-md px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-primary-400 pr-12 ${
                      errors.password ? 'border-red-500' : ''
                    }`}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-primary-600 p-1"
                  >
                    {showPassword ? <FaEye className="w-5 h-5 text-gray-400" /> : <FaEyeSlash className="w-5 h-5 text-gray-300" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                {formData.password && (
                  <div className="mt-2 space-y-1">
                    {passwordConstraints.map((constraint, index) => (
                      <p
                        key={index}
                        className={`text-xs ${
                          checkPasswordConstraint(formData.password, constraint.regex)
                            ? 'text-green-600'
                            : 'text-red-500'
                        }`}
                      >
                        {checkPasswordConstraint(formData.password, constraint.regex) ? '✓ ' : '✗ '}
                        {constraint.label}
                      </p>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="text-sm text-gray-600">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirm_password"
                    value={formData.confirm_password}
                    onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                    className={`w-full border rounded-md px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-primary-400 pr-12 ${
                      errors.password ? 'border-red-500' : ''
                    }`}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-primary-600 p-1"
                  >
                    {showConfirmPassword ? <FaEye className="w-5 h-5 text-gray-400" /> : <FaEyeSlash className="w-5 h-5 text-gray-300" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                {errors.confirm_password && <p className="text-red-500 text-xs mt-1">{errors.confirm_password}</p>}
                {formData.confirm_password && (
                  <p className={`text-xs mt-1 ${formData.password === formData.confirm_password ? 'text-green-600' : 'text-red-500'}`}>
                    {formData.password === formData.confirm_password ? '✓ Passwords match' : '✗ Passwords do not match'}
                  </p>
                )}
              </div>

              <PhoneInput
                value={formData.phone}
                onChange={handlePhoneChange}
                error={errors.phone}
              />

              {role === 'EXHIBITOR' && (
                <div>
                  <label className="text-sm text-gray-600">Company Name</label>
                  <input
                    type="text"
                    name="company_name"
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                    className="w-full border rounded-md px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-primary-400"
                  />
                </div>
              )}

              <div className="flex items-start space-x-2 mt-4">
                <input
                  type="checkbox"
                  id="terms"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-1"
                />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  I agree to the{' '}
                  <button type="button" className="text-primary-600 hover:text-primary-700 underline" onClick={() => setShowTerms(true)}>
                    Terms and Conditions
                  </button>
                </label>
              </div>

              <TermsModal open={showTerms} onClose={() => setShowTerms(false)} />

              <button
                type="submit"
                disabled={!termsAccepted}
                className={`w-full py-2 rounded-md transition ${
                  termsAccepted
                    ? 'bg-primary-600 hover:bg-primary-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Create Account
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
