import { useState } from 'react';
import NavigationHeader from '../../../components/navigation/NavigationHeader';
import CompleteProfile from '../../Profile/components/CompleteProfile';
import { Navigate, useNavigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import LoadingOverlay from '@/components/common/LoadingOverlay';
import OverviewTab from './OverviewTab';
import ComingSoon from '@/components/common/ComingSoon';
import { FaUsers, FaInfoCircle } from 'react-icons/fa';

const tabs = [
    'Overview',
    'Exhibitors',
    'Information Center',
  ];

export default function AttendeeDashboard() {
    const [activeTab, setActiveTab] = useState('Overview');
    const { user, loading } = useUser();
    const navigate = useNavigate();

    if (loading) {
        return <LoadingOverlay isLoading={true} message="Loading your dashboard..." />;
    }

    if (!user) {
       return <Navigate to="/login" replace state={{ message: "Session expired. Please log in again." }} />;
    }

    const handleCompleteProfile = () => {
      navigate('/attendee/dashboard');
    }


    if (!user?.firstName || !user?.lastName) {
      return (
          <div className="pt-16 bg-gradient-to-b from-gray-50 to-white min-h-screen">
              <NavigationHeader isAuthenticated={true} />
              <CompleteProfile onComplete={handleCompleteProfile} isExhibitor={false} />
          </div>
      );
    }
    
  return (
    <div className="pt-16 bg-gray-50 min-h-screen">
      <NavigationHeader isAuthenticated={true} />

      {/* Tabs */}
      <div className="px-6 mt-6">
        <div className="flex gap-4 border-b text-sm font-medium text-gray-600">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 ${
                activeTab === tab
                  ? 'border-b-2 border-green-600 text-green-700'
                  : 'hover:text-green-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      {/* Tab Content */}
      <div className="px-6 mt-4">
        {activeTab === 'Overview' && <OverviewTab />}
        {activeTab === 'Exhibitors' && (
          <ComingSoon 
            title="Exhibitors Directory"
            description="Connect with amazing exhibitors and discover innovative products and services at LITF 2025."
            icon={<FaUsers className="w-16 h-16" />}
            variant="section"
            showProgress={true}
            progressPercentage={60}
          />
        )}
        {activeTab === 'Information Center' && (
          <ComingSoon 
            title="Information Center"
            description="Access important announcements, guidelines, schedules, and support resources for LITF 2025."
            icon={<FaInfoCircle className="w-16 h-16" />}
            variant="feature"
            showProgress={true}
            progressPercentage={45}
          />
        )}
      </div>
    </div>
  );
}
