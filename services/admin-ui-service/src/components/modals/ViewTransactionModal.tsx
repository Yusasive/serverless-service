import React, { useState, useEffect } from 'react';
import { X, CreditCard, Calendar, DollarSign, User, Building, Mail, Phone, MapPin, Clock, FileText, Edit } from 'lucide-react';
import { TransactionData } from '@/types/transaction.type';
import { User as UserType } from '@/types/user.type';
import { UserController } from '@/controllers/UserController';
import Badge from '@/components/ui/Badge';
import LoadingOverlay from '@/components/common/LoadingOverlay';

interface ViewTransactionModalProps {
  transaction: TransactionData | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus?: (transaction: TransactionData) => void;
}

const ViewTransactionModal: React.FC<ViewTransactionModalProps> = ({ transaction, isOpen, onClose, onUpdateStatus }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [updatedByUser, setUpdatedByUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(false);
  const [updatedByLoading, setUpdatedByLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatedByError, setUpdatedByError] = useState<string | null>(null);

  const userController = UserController.getInstance();

  useEffect(() => {
    if (isOpen && transaction) {
      setError(null);
      setUpdatedByError(null);
      loadUserData();
      if (transaction.updatedBy) {
        loadUpdatedByUserData();
      }
    }
  }, [isOpen, transaction]);

  const loadUserData = async () => {
    if (!transaction?.userId) return;

    try {
      setLoading(true);
      const userData = await userController.getUserById(transaction.userId);
      setUser(userData);
    } catch (err) {
      console.warn('Failed to load user data:', err);
      setError('Failed to load user information');
    } finally {
      setLoading(false);
    }
  };

  const loadUpdatedByUserData = async () => {
    if (!transaction?.updatedBy) return;

    try {
      setUpdatedByLoading(true);
      const userData = await userController.getUserById(transaction.updatedBy);
      setUpdatedByUser(userData);
    } catch (err) {
      console.warn('Failed to load updated by user data:', err);
      setUpdatedByError('Failed to load last modified user information');
    } finally {
      setUpdatedByLoading(false);
    }
  };

  const formatCurrency = (amount: number, currency: string = 'NGN'): string => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    const statusColors: { [key: string]: string } = {
      active: 'bg-green-100 text-green-800',
      expired: 'bg-orange-100 text-orange-800',
      cancelled: 'bg-gray-100 text-gray-800',
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      refunded: 'bg-red-100 text-red  -800'
    };

    const color = statusColors[status.toLowerCase()] || 'bg-gray-100 text-gray-800';
    return (
      <Badge className={color}>
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const getBoothStatusBadge = (status: string) => {
    const statusColors: { [key: string]: string } = {
      available: 'bg-green-100 text-green-800',
      reserved: 'bg-yellow-100 text-yellow-800',
      occupied: 'bg-blue-100 text-blue-800',
      unavailable: 'bg-red-100 text-red-800',
    };

    const color = statusColors[status.toLowerCase()] || 'bg-gray-100 text-gray-800';
    return (
      <Badge className={color}>
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  if (!isOpen || !transaction) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Transaction Details</h2>
            <p className="text-sm text-gray-600">Transaction ID: {transaction.transactionId}</p>
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

          {/* Transaction Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <CreditCard className="w-5 h-5 text-blue-500 mr-2" />
              Transaction Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-xs font-bold text-blue-600">ID</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Transaction ID</p>
                    <p className="text-gray-900 font-mono">{transaction.transactionId}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <DollarSign className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Amount</p>
                    <p className="text-gray-900 font-semibold">{formatCurrency(transaction.totalAmount)}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-purple-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Remark</p>
                    <p className="text-gray-900">{transaction.remark || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-600">S</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Transaction Status</p>
                    <div className="mt-1">
                      {getStatusBadge(transaction.boothTransStatus)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-600">P</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Payment Status</p>
                    <div className="mt-1">
                      {getStatusBadge(transaction.paymentStatus)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-600">V</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Validity Status</p>
                    <div className="mt-1">
                      {getStatusBadge(transaction.validityStatus)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Reservation Date</p>
                    <p className="text-gray-900">{formatDate(transaction.reservationDate)}</p>
                  </div>
                </div>

                                 <div className="flex items-center space-x-3">
                   <Clock className="w-5 h-5 text-red-500" />
                   <div>
                     <p className="text-sm font-medium text-gray-500">Expiration Date</p>
                     <p className="text-gray-900">{formatDate(new Date(new Date(transaction.reservationDate).getTime() + (3 * 24 * 60 * 60 * 1000)))}</p>
                   </div>
                 </div>

                                 <div className="flex items-center space-x-3">
                   <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center">
                     <span className="text-xs font-bold text-gray-600">D</span>
                   </div>
                   <div>
                     <p className="text-sm font-medium text-gray-500">Validity Period</p>
                     <p className="text-gray-900">3 days</p>
                   </div>
                 </div>
              </div>
            </div>
          </div>

          {/* Booth Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <Building className="w-5 h-5 text-green-500 mr-2" />
              Booth Information ({transaction.booths?.length || 0} booths)
            </h3>
            {transaction.booths && transaction.booths.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {transaction.booths.map((booth, index) => (
                  <div key={booth.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-gray-900">Booth {index + 1}</h4>
                      {getBoothStatusBadge(booth.boothStatus)}
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Sector:</span>
                        <span className="text-gray-900 font-medium">{booth.sector || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Booth Number:</span>
                        <span className="text-gray-900 font-medium">{booth.boothNum}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Booth Type:</span>
                        <span className="text-gray-900 font-medium">{booth.boothType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Price:</span>
                        <span className="text-gray-900 font-medium">{formatCurrency(booth.boothPrice)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Building className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No booth information available</p>
              </div>
            )}
          </div>

          {/* Last Modified By Section */}
          {transaction.updatedBy && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <Clock className="w-5 h-5 text-blue-500 mr-2" />
                Last Modified By
              </h3>
              
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

              {updatedByUser && !updatedByLoading && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Name:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {`${updatedByUser.first_name || ''} ${updatedByUser.last_name || ''}`.trim() || 'N/A'}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Email:</span>
                        <span className="text-sm font-medium text-gray-900">{updatedByUser.email}</span>
                      </div>

                      {updatedByUser.company && (
                        <div className="flex items-center space-x-2">
                          <Building className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">Company:</span>
                          <span className="text-sm font-medium text-gray-900">{updatedByUser.company}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      {updatedByUser.phone && (
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">Phone:</span>
                          <span className="text-sm font-medium text-gray-900">{updatedByUser.phone}</span>
                        </div>
                      )}

                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-xs font-bold text-gray-600">👤</span>
                        </div>
                        <span className="text-sm text-gray-600">User Type:</span>
                        <span className="text-sm font-medium text-gray-900 capitalize">
                          {updatedByUser.user_type.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* User Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <User className="w-5 h-5 text-purple-500 mr-2" />
              User Information
            </h3>
            {loading ? (
              <div className="flex justify-center py-8">
                <LoadingOverlay isLoading={true} message="Loading user information..." />
              </div>
            ) : user ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">Personal Information</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <User className="w-5 h-5 text-blue-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Full Name</p>
                          <p className="text-gray-900">{`${user.first_name || ''} ${user.last_name || ''}`.trim() || 'N/A'}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Mail className="w-5 h-5 text-green-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Email</p>
                          <p className="text-gray-900">{user.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Phone className="w-5 h-5 text-purple-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Phone</p>
                          <p className="text-gray-900">{user.phone || 'N/A'}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Building className="w-5 h-5 text-orange-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Company</p>
                          <p className="text-gray-900">{user.company || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                                     <div>
                     <h4 className="text-md font-medium text-gray-900 mb-3">Address Information</h4>
                     {user.address && user.address.length > 0 ? (
                       (() => {
                         const primaryAddress = user.address.find(addr => addr.is_primary) || user.address[0];
                         return (
                           <div className="bg-gray-50 rounded-lg p-3">
                             <div className="flex items-center justify-between mb-2">
                               <h5 className="text-sm font-medium text-gray-900">Primary Address</h5>
                               <Badge className="bg-blue-100 text-blue-800">Primary</Badge>
                             </div>
                             <div className="space-y-1 text-sm text-gray-600">
                               <p>{primaryAddress.address_line1}</p>
                               {primaryAddress.address_line2 && <p>{primaryAddress.address_line2}</p>}
                               <p>{primaryAddress.city}, {primaryAddress.state} {primaryAddress.post_code}</p>
                               <p>{primaryAddress.country}</p>
                             </div>
                           </div>
                         );
                       })()
                     ) : (
                       <div className="text-center py-4 text-gray-500">
                         <MapPin className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                         <p>No address information available</p>
                       </div>
                     )}
                   </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <User className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No user information available</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            {onUpdateStatus && (
              <button
                onClick={() => onUpdateStatus(transaction)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center space-x-2"
              >
                <Edit className="w-4 h-4" />
                <span>Update Status</span>
              </button>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewTransactionModal; 