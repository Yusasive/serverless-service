import React, { useState, useEffect } from 'react';
import { X, User, Building, Mail, Calendar, MapPin, Tag, Ruler, Clock } from 'lucide-react';
import { BoothData } from '@/types/booth.type';
import { UserController } from '@/controllers/UserController';
import { User as UserType } from '@/types/user.type';

interface ViewBoothModalProps {
  booth: BoothData | null;
  isOpen: boolean;
  onClose: () => void;
}

const ViewBoothModal: React.FC<ViewBoothModalProps> = ({ booth, isOpen, onClose }) => {
  const [userData, setUserData] = useState<UserType | null>(null);
  const [updatedByUserData, setUpdatedByUserData] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(false);
  const [updatedByLoading, setUpdatedByLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatedByError, setUpdatedByError] = useState<string | null>(null);

  const userController = UserController.getInstance();

  useEffect(() => {
    if (isOpen && booth) {
      if (booth.booked_by) {
        fetchUserData();
      } else {
        setUserData(null);
        setError(null);
      }
      
      if (booth.updated_by) {
        fetchUpdatedByUserData();
      } else {
        setUpdatedByUserData(null);
        setUpdatedByError(null);
      }
    }
  }, [isOpen, booth]);

  const fetchUserData = async () => {
    if (!booth?.booked_by) return;
    
    try {
      setLoading(true);
      setError(null);
      const user = await userController.getUserById(booth.booked_by);
      setUserData(user);
    } catch (err) {
      setError(`Failed to load user information: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchUpdatedByUserData = async () => {
    if (!booth?.updated_by) return;
    
    try {
      setUpdatedByLoading(true);
      setUpdatedByError(null);
      const user = await userController.getUserById(booth.updated_by);
      setUpdatedByUserData(user);
    } catch (err) {
      setUpdatedByError(`Failed to load last modified user information: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setUpdatedByLoading(false);
    }
  };

//   const formatPrice = (price: number) => {
//     return new Intl.NumberFormat('en-NG', {
//       style: 'currency',
//       currency: 'NGN',
//       minimumFractionDigits: 0,
//     }).format(price);
//   };

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'reserved':
        return 'bg-yellow-100 text-yellow-800';
      case 'booked':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available':
        return 'Available';
      case 'reserved':
        return 'Reserved';
      case 'booked':
        return 'Booked';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const isStaffUser = (userType: string) => {
    return ['admin', 'super_admin', 'organizer', 'staff', 'organizer_staff', 'super_admin'].includes(userType.toLowerCase());
  };

  const getUserDisplayName = (user: UserType) => {
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    } else if (user.first_name) {
      return user.first_name;
    } else if (user.last_name) {
      return user.last_name;
    } else {
      return 'N/A';
    }
  };

  if (!isOpen || !booth) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Booth Details</h2>
            <p className="text-sm text-gray-600">View complete booth information</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Booth Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Booth Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Tag className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Booth ID</p>
                      <p className="text-gray-900">{booth.booth_id}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Building className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Booth Name</p>
                      <p className="text-gray-900">{booth.booth_name}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-purple-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Sector</p>
                      <p className="text-gray-900">{booth.sector_description || booth.sector || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-xs font-bold text-gray-600">S</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Status</p>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booth.status)}`}>
                        {getStatusLabel(booth.status)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Specifications</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Ruler className="w-5 h-5 text-orange-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Size</p>
                      <p className="text-gray-900">{booth.size}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Tag className="w-5 h-5 text-indigo-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Category</p>
                      <p className="text-gray-900">{booth.category}</p>
                    </div>
                  </div>

                  {/* <div className="flex items-center space-x-3">
                    <DollarSign className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Price</p>
                      <p className="text-gray-900">{formatPrice(booth.price)}</p>
                    </div>
                  </div> */}

                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-xs font-bold text-gray-600">㎡</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Area (SQM)</p>
                      <p className="text-gray-900">{booth.sqm} m²</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Information */}
          {(booth.status === 'booked' || booth.status === 'reserved') && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Booking Information</h3>
              
              {loading && (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                  <span className="ml-2 text-gray-600">Loading user information...</span>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {userData && !loading && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <User className="w-5 h-5 text-blue-500" />
                    <span className="text-sm font-medium text-gray-700">
                      {isStaffUser(userData.user_type) ? 'Staff Member' : 'Exhibitor'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Name:</span>
                        <span className="text-sm font-medium text-gray-900">{getUserDisplayName(userData)}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Email:</span>
                        <span className="text-sm font-medium text-gray-900">{userData.email}</span>
                      </div>

                      {!isStaffUser(userData.user_type) && userData.company && (
                        <div className="flex items-center space-x-2">
                          <Building className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">Company:</span>
                          <span className="text-sm font-medium text-gray-900">{userData.company}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Booked Date:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {formatDate(booth.bookdate)}
                        </span>
                      </div>

                      {userData.phone && (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-xs font-bold text-gray-600">📞</span>
                          </div>
                          <span className="text-sm text-gray-600">Phone:</span>
                          <span className="text-sm font-medium text-gray-900">{userData.phone}</span>
                        </div>
                      )}

                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-xs font-bold text-gray-600">👤</span>
                        </div>
                        <span className="text-sm text-gray-600">User Type:</span>
                        <span className="text-sm font-medium text-gray-900 capitalize">
                          {userData.user_type.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Last Modified By Section */}
          {booth.updated_by && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Last Modified By</h3>
              
              {updatedByLoading && (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                  <span className="ml-2 text-gray-600">Loading user information...</span>
                </div>
              )}

              {updatedByError && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <p className="text-sm text-red-700">{updatedByError}</p>
                </div>
              )}

              {updatedByUserData && !updatedByLoading && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <Clock className="w-5 h-5 text-blue-500" />
                    <span className="text-sm font-medium text-gray-700">
                      {isStaffUser(updatedByUserData.user_type) ? 'Staff Member' : 'Exhibitor'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Name:</span>
                        <span className="text-sm font-medium text-gray-900">{getUserDisplayName(updatedByUserData)}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Email:</span>
                        <span className="text-sm font-medium text-gray-900">{updatedByUserData.email}</span>
                      </div>

                      {!isStaffUser(updatedByUserData.user_type) && updatedByUserData.company && (
                        <div className="flex items-center space-x-2">
                          <Building className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">Company:</span>
                          <span className="text-sm font-medium text-gray-900">{updatedByUserData.company}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      {updatedByUserData.phone && (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-xs font-bold text-gray-600">📞</span>
                          </div>
                          <span className="text-sm text-gray-600">Phone:</span>
                          <span className="text-sm font-medium text-gray-900">{updatedByUserData.phone}</span>
                        </div>
                      )}

                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-xs font-bold text-gray-600">👤</span>
                        </div>
                        <span className="text-sm text-gray-600">User Type:</span>
                        <span className="text-sm font-medium text-gray-900 capitalize">
                          {updatedByUserData.user_type.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Available Booth Message */}
          {booth.status === 'available' && (
            <div className="border-t border-gray-200 pt-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-xs font-bold">✓</span>
                  </div>
                  <span className="text-sm font-medium text-green-800">This booth is available for booking</span>
                </div>
                <p className="text-sm text-green-700 mt-1">
                  No user has booked or reserved this booth yet.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewBoothModal; 