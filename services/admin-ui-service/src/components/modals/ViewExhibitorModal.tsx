import React, { useState, useEffect } from 'react';
import { X, User, Building, Mail, Phone, MapPin, Shield, Star, Globe } from 'lucide-react';
import { ExhibitorData } from '@/types/exhibitor.type';
import Badge from '@/components/ui/Badge';

interface ViewExhibitorModalProps {
  exhibitor: ExhibitorData | null;
  isOpen: boolean;
  onClose: () => void;
}

const ViewExhibitorModal: React.FC<ViewExhibitorModalProps> = ({ exhibitor, isOpen, onClose }) => {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && exhibitor) {
      setError(null);
    }
  }, [isOpen, exhibitor]);

//   const formatDate = (date: Date | string | null | undefined) => {
//     if (!date) return 'N/A';
//     return new Date(date).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//     });
//   };

  const getVerificationBadge = (verified: boolean) => {
    return (
      <Badge className={verified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
        {verified ? 'Verified' : 'Unverified'}
      </Badge>
    );
  };

  const getActiveStatusBadge = (isActive: boolean) => {
    return (
      <Badge className={isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
        {isActive ? 'Active' : 'Inactive'}
      </Badge>
    );
  };

  const getUserTypeBadge = (userType: string) => {
    const typeColors: { [key: string]: string } = {
      exhibitor: 'bg-blue-100 text-blue-800',
      admin: 'bg-purple-100 text-purple-800',
      super_admin: 'bg-red-100 text-red-800',
      organizer: 'bg-orange-100 text-orange-800',
      staff: 'bg-gray-100 text-gray-800',
      organizer_staff: 'bg-indigo-100 text-indigo-800',
    };

    const color = typeColors[userType.toLowerCase()] || 'bg-gray-100 text-gray-800';
    return (
      <Badge className={color}>
        {userType.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const renderRating = (rating?: number) => {
    if (!rating) return <span className="text-gray-500">No rating</span>;
    
    return (
      <div className="flex items-center space-x-1">
        <span className="text-sm font-medium">{rating}</span>
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      </div>
    );
  };

  if (!isOpen || !exhibitor) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Exhibitor Details</h2>
            <p className="text-sm text-gray-600">View complete exhibitor information</p>
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
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Basic Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Personal Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Full Name</p>
                      <p className="text-gray-900">{exhibitor.full_name || `${exhibitor.first_name || ''} ${exhibitor.last_name || ''}`.trim() || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-gray-900">{exhibitor.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-purple-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Phone</p>
                      <p className="text-gray-900">{exhibitor.phone || 'N/A'}</p>
                    </div>
                  </div>

                  {exhibitor.gender && (
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-pink-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Gender</p>
                        <p className="text-gray-900 capitalize">{exhibitor.gender}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-indigo-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">User Type</p>
                      <div className="mt-1">
                        {getUserTypeBadge(exhibitor.user_type)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Account Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Verification Status</p>
                      <div className="mt-1">
                        {getVerificationBadge(exhibitor.verified)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-xs font-bold text-gray-600">A</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Account Status</p>
                      <div className="mt-1">
                        {getActiveStatusBadge(exhibitor.is_active)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-xs font-bold text-gray-600">2F</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Two-Factor Authentication</p>
                      <div className="mt-1">
                        <Badge className={exhibitor.two_factor_enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {exhibitor.two_factor_enabled ? 'Enabled' : 'Disabled'}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* {exhibitor.registration_date && (
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-orange-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Registration Date</p>
                        <p className="text-gray-900">{formatDate(exhibitor.registration_date)}</p>
                      </div>
                    </div>
                  )} */}
                </div>
              </div>
            </div>
          </div>

          {/* Company Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Company Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Building className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Company Name</p>
                    <p className="text-gray-900">{exhibitor.company || 'N/A'}</p>
                  </div>
                </div>

                {exhibitor.local && (
                  <div className="flex items-center space-x-3">
                    <Globe className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Local/Region</p>
                      <p className="text-gray-900">{exhibitor.local}</p>
                    </div>
                  </div>
                )}

                {/* {exhibitor.booth_preference && (
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-purple-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Booth Preference</p>
                      <p className="text-gray-900">{exhibitor.booth_preference}</p>
                    </div>
                  </div>
                )} */}
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-indigo-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Sector</p>
                    <p className="text-gray-900">{exhibitor.booth_type || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Rating</p>
                    <div className="mt-1">
                      {renderRating(exhibitor.rating)}
                    </div>
                  </div>
                </div>

                {exhibitor.booth_count !== undefined && (
                  <div className="flex items-center space-x-3">
                    <Building className="w-5 h-5 text-orange-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Booth Count</p>
                      <p className="text-gray-900">{exhibitor.booth_count}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Address Information */}
          {exhibitor.address && exhibitor.address.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Address Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {exhibitor.address.map((addr, index) => (
                  <div key={addr.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-gray-900">
                        {addr.is_primary ? 'Primary Address' : `Address ${index + 1}`}
                      </h4>
                      {addr.is_primary && (
                        <Badge className="bg-blue-100 text-blue-800">Primary</Badge>
                      )}
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>{addr.address_line1}</p>
                      {addr.address_line2 && <p>{addr.address_line2}</p>}
                      <p>{addr.city}, {addr.state} {addr.post_code}</p>
                      <p>{addr.country}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

                     {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Additional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-600">ID</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">User ID</p>
                    <p className="text-gray-900">{exhibitor.user_id}</p>
                  </div>
                </div>

                {exhibitor.stripe_id && (
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-xs font-bold text-gray-600">S</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Stripe ID</p>
                      <p className="text-gray-900 font-mono text-sm">{exhibitor.stripe_id}</p>
                    </div>
                  </div>
                )}

                {exhibitor.payment_id && (
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-xs font-bold text-gray-600">P</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Payment ID</p>
                      <p className="text-gray-900 font-mono text-sm">{exhibitor.payment_id}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                {exhibitor.parent_exhibitor_id && (
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-indigo-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Parent Exhibitor ID</p>
                      <p className="text-gray-900">{exhibitor.parent_exhibitor_id}</p>
                    </div>
                  </div>
                )}

                {exhibitor.pin_code && (
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-xs font-bold text-gray-600">PIN</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">PIN Code</p>
                      <p className="text-gray-900 font-mono">{exhibitor.pin_code}</p>
                    </div>
                  </div>
                )}

                {exhibitor.status && (
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-xs font-bold text-gray-600">S</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Status</p>
                      <p className="text-gray-900 capitalize">{exhibitor.status}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewExhibitorModal; 