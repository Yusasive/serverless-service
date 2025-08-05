import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaStore } from 'react-icons/fa';
import { useUser } from '@/context/UserContext';
import { UserRole } from '@/repository/UserRepository';
import SelectExibitorLocal from './SelectExibitorLocal';
import LoadingOverlay from '@/components/common/LoadingOverlay';

const roleOptions = [
  {
    value: 'EXHIBITOR',
    label: 'Exhibitor',
    description: 'Showcase your products and services at the trade fair',
    icon: <FaStore />,
  },
  {
    value: 'ATTENDEE',
    label: 'Visitor',
    description: 'Visit and explore the trade fair as a visitor',
    icon: <FaUser />,
  },
];

const SelectRole: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useUser();
  const [showExhibitorDialog, setShowExhibitorDialog] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (!loading && user) {
      setPageLoading(false);
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
          setPageLoading(false);
          navigate('/');
          break;
      }
    } else if (!loading && !user) {
      setPageLoading(false);
    }
  }, [user, loading, navigate]);

  const handleRoleSelect = (role: UserRole) => {
    if (role === UserRole.EXHIBITOR) {
      setShowExhibitorDialog(true);
      return;
    }
    navigate(`/register?role=${role}`);
  };

  // Show loading overlay while checking auth
  if (pageLoading) {
    return (
      <LoadingOverlay isLoading={pageLoading} />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950 p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full relative">
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

        {/* Content */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-primary-600 mb-2">Choose Your Role</h2>
          <p className="text-gray-500">Select how you want to participate in the trade fair</p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {roleOptions.map((role) => (
            <div
              key={role.value}
              onClick={() => handleRoleSelect(role.value as UserRole)}
              className="cursor-pointer border rounded-lg p-6 hover:border-primary-400 transition-all hover:shadow-md"
            >
              <div className="text-primary-600 text-4xl mb-4 flex justify-center">
                {role.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 text-center mb-2">
                {role.label}
              </h3>
              <p className="text-gray-500 text-center text-sm">
                {role.description}
              </p>
            </div>
          ))}
        </div>

        {/* Back to Login */}
        <div className="mt-8 text-center flex items-center justify-center gap-2">
          <p className="text-gray-500">Already have an account?</p>
          <button
            onClick={() => navigate('/login')}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Sign In
          </button>
        </div>
      </div>

      {/* Exhibitor Type Selection Dialog */}
      {showExhibitorDialog && (
        <SelectExibitorLocal onClose={() => setShowExhibitorDialog(false)} />
      )}
    </div>
  );
};

export default SelectRole; 