import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  UserIcon, 
  BuildingOfficeIcon, 
  PhoneIcon, 
  EnvelopeIcon, 
  QrCodeIcon,
  MapPinIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';
import { FaUser, FaStore, FaQrcode } from 'react-icons/fa';
import { UserController } from '@/controllers/UserController';

const QRCodeDisplay: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [data, setData] = useState<any>(null);
  const [fullData, setFullData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const userController = UserController.getInstance();

  useEffect(() => {
    const encodedData = searchParams.get('data');
    if (encodedData) {
      try {
        const decodedData = JSON.parse(decodeURIComponent(encodedData));
        setData(decodedData);
        
        // If this is an exhibitor with companyRepId, fetch full data from database
        if (decodedData.companyRepId && (decodedData.type === 'exhibitor' || decodedData.userType === 'EXHIBITOR')) {
          fetchCompanyRepData(decodedData.companyRepId);
        } else {
          setFullData(decodedData);
        }
      } catch (err) {
        setError('Invalid QR code data');
      }
    } else {
      setError('No data found in QR code');
    }
    setLoading(false);
  }, [searchParams]);

  // Fetch full company representative data from database
  const fetchCompanyRepData = async (companyRepId: string) => {
    try {
      const response = await userController.getCompanyRepById(Number(companyRepId));
      setFullData(response.data);
    } catch (error) {
      console.error('Error fetching company rep data:', error);
      setFullData(data); // Fallback to QR data only
    }
  };

  if (loading || (data && !fullData)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {data && !fullData ? 'Loading full profile data...' : 'Loading QR code data...'}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <QrCodeIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">QR Code Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
        </div>
      </div>
    );
  }

  // Use fullData for display, fallback to data if fullData is not available
  const displayData = fullData || data;

  const getUserTypeInfo = () => {
    if (!displayData) return { type: 'unknown', title: 'Unknown User', icon: UserIcon, color: 'gray' };
    
    // Check for visitor QR code
    if (displayData.type === 'visitor' || displayData.userType === 'ATTENDEE') {
      return {
        type: 'visitor',
        title: 'Visitor Information',
        icon: FaUser,
        color: 'green',
        gradient: 'from-green-600 to-green-700',
        bgColor: 'bg-green-50',
        textColor: 'text-green-700',
        accentColor: 'text-red-600'
      };
    }
    
    // Check for exhibitor QR code
    if (displayData.type === 'exhibitor' || displayData.userType === 'EXHIBITOR' || displayData.company || displayData.company_name) {
      return {
        type: 'exhibitor',
        title: 'Exhibitor Information',
        icon: FaStore,
        color: 'green',
        gradient: 'from-green-600 to-green-700',
        bgColor: 'bg-green-50',
        textColor: 'text-green-700',
        accentColor: 'text-red-600'
      };
    }
    
    // Check for company representative
    if (displayData.name && (displayData.company || displayData.company_name)) {
      return {
        type: 'representative',
        title: 'Company Representative',
        icon: BuildingOfficeIcon,
        color: 'green',
        gradient: 'from-green-600 to-green-700',
        bgColor: 'bg-green-50',
        textColor: 'text-green-700',
        accentColor: 'text-red-600'
      };
    }
    
    return { type: 'unknown', title: 'User Information', icon: UserIcon, color: 'gray' };
  };

  const userTypeInfo = getUserTypeInfo();
  const IconComponent = userTypeInfo.icon;

  // Helper function to get company name from various possible fields
  const getCompanyName = () => {
    return displayData.company || displayData.company_name || null;
  };

  // Helper function to get display name
  const getDisplayName = () => {
    return displayData.name || `${displayData.firstName || ''} ${displayData.lastName || ''}`.trim() || 'Unknown';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <QrCodeIcon className="h-8 w-8 text-red-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {userTypeInfo.title}
                </h1>
                <p className="text-gray-600">Scanned QR Code Information</p>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${userTypeInfo.bgColor} ${userTypeInfo.textColor}`}>
              {userTypeInfo.type.toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* User Header */}
          <div className={`bg-gradient-to-r ${userTypeInfo.gradient} px-6 py-8 text-white`}>
            <div className="flex items-center space-x-4">
              {displayData.photo ? (
                <img
                  src={displayData.photo}
                  alt={getDisplayName()}
                  className="w-20 h-20 rounded-full border-4 border-white/20 object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : null}
              <div className={`w-20 h-20 rounded-full border-4 border-white/20 bg-white/20 flex items-center justify-center ${displayData.photo ? 'hidden' : ''}`}>
                <IconComponent className="w-10 h-10" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">
                  {getDisplayName()}
                </h2>
                {getCompanyName() && (
                  <p className="text-blue-100 text-lg">{getCompanyName()}</p>
                )}
                {displayData.phone && (
                  <p className="text-blue-100 flex items-center mt-1">
                    <PhoneIcon className="w-4 h-4 mr-2" />
                    {displayData.phone}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="p-6">
            <div className="space-y-6">
              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <UserIcon className="w-5 h-5 mr-2 text-red-600" />
                  Contact Information
                </h3>
                
                <div className="space-y-3">
                  {displayData.email && (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <EnvelopeIcon className="w-5 h-5 text-red-600" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{displayData.email}</p>
                      </div>
                    </div>
                  )}

                  {displayData.phone && (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <PhoneIcon className="w-5 h-5 text-red-600" />
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium">{displayData.phone}</p>
                      </div>
                    </div>
                  )}

                  {displayData.location && (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <MapPinIcon className="w-5 h-5 text-red-600" />
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="font-medium">{displayData.location}</p>
                      </div>
                    </div>
                  )}

                  {getCompanyName() && (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <BuildingOfficeIcon className="w-5 h-5 text-red-600" />
                      <div>
                        <p className="text-sm text-gray-500">Company</p>
                        <p className="font-medium">{getCompanyName()}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Event Information */}
              {displayData.event && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <CalendarIcon className="w-5 h-5 mr-2 text-red-600" />
                    Event Information
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <FaQrcode className="w-5 h-5 text-red-600" />
                      <div>
                        <p className="text-sm text-gray-500">Event</p>
                        <p className="font-medium">{displayData.event}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* User Type Specific Information */}
              {userTypeInfo.type === 'visitor' && (
                <div className="space-y-4">                  
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-green-700">
                      <strong>Welcome to LITF 2025!</strong> This visitor QR code provides quick access to the trade fair. 
                    </p>
                  </div>
                </div>
              )}

              {userTypeInfo.type === 'exhibitor' && (
                <div className="space-y-4">                  
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-green-700">
                      <strong>Exhibitor Access:</strong> This QR code grants access to exhibitor area and booth features. 
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @media print {
            .no-print {
              display: none !important;
            }
            body {
              background: white !important;
            }
            .bg-gray-50 {
              background: white !important;
            }
            .shadow-md {
              box-shadow: none !important;
            }
          }
        `
      }} />
    </div>
  );
};

export default QRCodeDisplay; 