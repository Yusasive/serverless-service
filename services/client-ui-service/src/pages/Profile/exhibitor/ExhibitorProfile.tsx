import NavigationHeader from "@/components/navigation/NavigationHeader";
import ProfileHeader from "@/pages/Profile/components/ProfileHeader";
import CompleteProfile from "@/pages/Profile/components/CompleteProfile";
import ProfileNavigation from "@/pages/Profile/components/ProfileNavigation";
import ComingSoon from "@/pages/Profile/components/ComingSoon";
import AboutSection from "@/pages/Profile/components/AboutSection";
import EditProfile from "@/pages/Profile/components/EditProfile";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import LoadingOverlay from "@/components/common/LoadingOverlay";
import { useState, useEffect } from "react";
import { User } from "@/types/user.type";
import AccountSettings from "../components/AccountSettings";
import { UserController } from "@/controllers/UserController";
import ToastNotification from "@/components/common/ToastNotification";

export default function ExhibitorProfile() {
    const { user, loading, refreshUser } = useUser();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState(() => searchParams.get('tab') || 'about');
    const userController = UserController.getInstance();
    const [saveLoading, setSaveLoading] = useState(false);
    
    // Toast notification state
    const [showToast, setShowToast] = useState(false);
    const [toastType, setToastType] = useState<'success' | 'error'>('success');
    const [toastMessage, setToastMessage] = useState('');

    if (loading) {
        return <LoadingOverlay isLoading={true} message="Loading your profile"/>;
    }

    if (!user) {
       return <Navigate to="/login" replace state={{ message: "Session expired. Please log in again." }} />;
    }

    const handleCompleteProfile = () => {
       navigate('/exhibitor/dashboard');
    }

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        setSearchParams({ tab });
    };

    // Sync URL with activeTab state
    useEffect(() => {
        const tabFromUrl = searchParams.get('tab');
        if (tabFromUrl && tabFromUrl !== activeTab) {
            setActiveTab(tabFromUrl);
        }
    }, [searchParams, activeTab]);

    // Auto-hide toast after 3 seconds
    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => {
                setShowToast(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showToast]);

    const handleSaveProfile = async (updatedUser: Partial<User>) => {
        setSaveLoading(true);
        try {
            await userController.updateUser(updatedUser);
            
            // Show success message immediately
            setToastType('success');
            setToastMessage('Profile updated successfully!');
            setShowToast(true);

            await refreshUser();
            
        } catch (error) {
            console.log('error', error);
            setToastType('error');
            setToastMessage('Failed to update profile. Please try again.');
            setShowToast(true);
            throw error;
        } finally {
            setSaveLoading(false);
        }
    };

    if (!user?.firstName || !user?.lastName) {
        return (
            <div className="pt-16 bg-gradient-to-b from-gray-50 to-white min-h-screen">
                <NavigationHeader isAuthenticated={true} />
                <CompleteProfile onComplete={handleCompleteProfile} isExhibitor={true} />
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
            <LoadingOverlay isLoading={saveLoading} />
            <NavigationHeader isAuthenticated={true} />
            
            {/* Toast Notification */}
            {showToast && (
                <ToastNotification 
                    toastType={toastType} 
                    toastMessage={toastMessage} 
                    setShowToast={setShowToast} 
                />
            )}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                {/* Profile Card */}
                <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                    <ProfileHeader
                        name={`${user?.firstName} ${user?.lastName}`}
                        role={user?.userType}
                        location={user?.address?.find(addr => addr.is_primary)?.city || 'Not specified'}
                        country={user?.address?.find(addr => addr.is_primary)?.country || 'Not specified'}
                        phone={user?.phone}
                        email={user?.email}
                        isExhibitor={true}
                        company={user?.company || 'Not specified'}
                        profileImage={user?.profileImage}
                        sector={user?.boothType}
                    />

                    <ProfileNavigation 
                        userType="exhibitor" 
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
  