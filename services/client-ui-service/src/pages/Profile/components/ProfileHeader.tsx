import { FaHome, FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface ProfileHeaderProps {
    name: string;
    role: string;
    location: string;
    country: string;
    phone: string;
    email: string;
    profileImage: string;
    isExhibitor?: boolean;
    company?: string;
    sector?: string;
}

export default function ProfileHeader({
    name,
    role,
    location,
    country,
    phone,
    email,
    company,
    profileImage,
    sector,
    isExhibitor = false,
}: ProfileHeaderProps) {
    const navigate = useNavigate();

    return (
        <div className="flex justify-between items-start mb-6">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Profile Image */}
                <div className="relative">
                    <div className="w-40 h-40 rounded-2xl overflow-hidden border-4 border-white shadow-lg">
                        {profileImage ? (
                            <img
                                src={profileImage}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                <FaUserCircle className="text-gray-400 text-4xl" />
                            </div>
                        )}
                    </div>
                </div>

                {/* User Info */}
                <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-800">{company}</h3>
                    <div className="flex flex-wrap items-center text-sm text-gray-600 gap-4 mt-3">
                        <span className="bg-gray-100 px-3 py-1 rounded-full">{role}</span>
                        <span className="flex items-center gap-1.5">📍 {location}</span>
                        <span className="flex items-center gap-1.5">🏳️ {country}</span>
                        <span className="flex items-center gap-1.5">🏢 {sector}</span>
                    </div>
                    <div className="mt-6 space-y-3">
                        <div className="flex items-center gap-3 text-gray-600 hover:text-green-600 transition-colors">
                            <span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">📞</span>
                            <span>{phone}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-600 hover:text-green-600 transition-colors">
                            <span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">📧</span>
                            <span>{email}</span>
                        </div>
                        {isExhibitor && (
                            <div className="flex items-center gap-3 text-gray-600 hover:text-green-600 transition-colors">
                                <span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">🔗</span>
                                <span>{name}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <button 
                onClick={() => navigate(isExhibitor ? '/exhibitor/dashboard' : '/attendee/dashboard')}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <FaHome className="mr-2 text-lg"/>
                Go to Dashboard
            </button>
        </div>
    );
} 