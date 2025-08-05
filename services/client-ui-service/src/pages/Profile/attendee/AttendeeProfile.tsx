import NavigationHeader from "@/components/navigation/NavigationHeader";
import ProfileHeader from "@/pages/Profile/components/ProfileHeader";
import CompleteProfile from "@/pages/Profile/components/CompleteProfile";
import ProfileNavigation from "@/pages/Profile/components/ProfileNavigation";
import ComingSoon from "@/pages/Profile/components/ComingSoon";
import AboutSection from "@/pages/Profile/components/AboutSection";
import EditProfile from "@/pages/Profile/components/EditProfile";
import { Navigate, useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import LoadingOverlay from "@/components/common/LoadingOverlay";
import { useState } from "react";
import { User } from "@/types/user.type";
import AccountSettings from "../components/AccountSettings";

export default function AttendeeProfile() {
    const { user, loading, refreshUser } = useUser();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('about');

    if (loading) {
        return <LoadingOverlay isLoading={true} message="Loading your profile"/>;
    }

    if (!user) {
       return <Navigate to="/login" replace state={{ message: "Session expired. Please log in again." }} />;
    }

    const handleCompleteProfile = () => {
       navigate('/attendee/dashboard');
    }

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
    };

    const handleSaveProfile = async (updatedUser: Partial<User>) => {
        console.log('updatedUser', updatedUser);
        // try {
        //     await updateUser(user.id, updatedUser);
        //     await refreshUser();
        //     toast.success('Profile updated successfully');
        // } catch (error) {
        //     toast.error('Failed to update profile');
        //     throw error;
        // }
    };

    if (!user?.firstName || !user?.lastName) {
        return (
            <div className="pt-16 bg-gradient-to-b from-gray-50 to-white min-h-screen">
                <NavigationHeader isAuthenticated={true} />
                <CompleteProfile onComplete={handleCompleteProfile} isExhibitor={false} />
            </div>
        );
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'about':
                return <AboutSection user={user} />;
            case 'edit':
                return <EditProfile user={user} onSave={handleSaveProfile} refreshUser={refreshUser} />;
            case 'settings':
                return <AccountSettings user={user} />;
            default:
                return <ComingSoon title={getTabTitle(activeTab)} />;
        }
    };

    const getTabTitle = (tabId: string) => {
        const titles: { [key: string]: string } = {
            about: 'About',
            edit: 'Edit Profile',
            settings: 'Account Settings'
        };
        return titles[tabId] || 'Page';
    };

    return (
        <div className="pt-16 bg-gradient-to-b from-gray-50 to-white min-h-screen">
            <NavigationHeader isAuthenticated={true} />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                {/* Profile Card */}
                <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                    <ProfileHeader
                        name={`${user?.firstName} ${user?.lastName}`}
                        role={user?.userType}
                        location={user?.address?.[0]?.city || 'Not specified'}
                        country={user?.address?.[0]?.country || 'Not specified'}
                        phone={user?.phone}
                        email={user?.email}
                        profileImage={user?.profileImage}
                    />

                    <ProfileNavigation 
                        userType="attendee" 
                        onTabChange={handleTabChange}
                        activeTab={activeTab}
                    />
                    
                    {/* Content Section */}
                    <div className="mt-8">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
}
  