import React from 'react';
import { BoothTransaction } from '../../../store/booth-slice';

interface Props {
  open: boolean;
  onClose: () => void;
  reservation: BoothTransaction | null;
  onPayNow?: (reservation: BoothTransaction) => void;
}

const ReservationDetailsDialog: React.FC<Props> = ({ open, onClose, reservation, onPayNow }) => {
  if (!open || !reservation) return null;

  // Helper to format price
  const formatPrice = (amount: number | string) => {
    const num = typeof amount === 'string'
      ? parseInt(amount.replace(/[^\d]/g, '')) || 0
      : amount || 0;
    return `₦${num.toLocaleString()}`;
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr; // fallback if invalid
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const calculateExpirationDate = (reservationDate?: string) => {
    if (!reservationDate) return null;
    const date = new Date(reservationDate);
    if (isNaN(date.getTime())) return null;
    
    const expirationDate = new Date(date);
    expirationDate.setDate(expirationDate.getDate() + 3);
    return expirationDate;
  };

  const getStatusColor = (status?: string, type: 'payment' | 'validity' = 'payment') => {
    if (!status) return 'text-gray-600 bg-gray-100';
    
    const statusLower = status.toLowerCase().trim();
    
    // Handle payment status specifically
    if (type === 'payment') {
      switch (statusLower) {
        case 'paid':
        case 'completed':
        case 'success':
          return 'text-green-600 bg-green-100';
        case 'pending':
        case 'processing':
        case 'awaiting':
          return 'text-yellow-600 bg-yellow-100';
        case 'failed':
        case 'cancelled':
        case 'expired':
          return 'text-red-600 bg-red-100';
        default:
          return 'text-gray-600 bg-gray-100';
      }
    }
    
    // Handle validity status
    if (type === 'validity') {
      switch (statusLower) {
        case 'valid':
        case 'active':
        case 'confirmed':
          return 'text-green-600 bg-green-100';
        case 'pending':
        case 'processing':
          return 'text-yellow-600 bg-yellow-100';
        case 'expired':
        case 'invalid':
        case 'cancelled':
          return 'text-red-600 bg-red-100';
        default:
          return 'text-gray-600 bg-gray-100';
      }
    }
    
    return 'text-gray-600 bg-gray-100';
  };

  const getStatusIcon = (status?: string, type: 'payment' | 'validity' = 'payment') => {
    if (!status) return '•';
    
    const statusLower = status.toLowerCase().trim();
    
    // Handle payment status specifically
    if (type === 'payment') {
      switch (statusLower) {
        case 'paid':
        case 'completed':
        case 'success':
          return '✓';
        case 'pending':
        case 'processing':
        case 'awaiting':
          return '⏳';
        case 'failed':
        case 'cancelled':
        case 'expired':
          return '✗';
        default:
          return '•';
      }
    }
    
    // Handle validity status
    if (type === 'validity') {
      switch (statusLower) {
        case 'valid':
        case 'active':
        case 'confirmed':
          return '✓';
        case 'pending':
        case 'processing':
          return '⏳';
        case 'expired':
        case 'invalid':
        case 'cancelled':
          return '✗';
        default:
          return '•';
      }
    }
    
    return '•';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col transform transition-all duration-300 ease-out">
        {/* Header */}
        <div className="flex justify-between items-center p-8 pb-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Booking Details</h2>
              <p className="text-sm text-gray-500">Transaction #{reservation.transactionId || reservation.id}</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 pt-6">
          <div className="space-y-6">
            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-700">Payment Status</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(reservation.paymentStatus, 'payment')}`}>
                        <span className="mr-1">{getStatusIcon(reservation.paymentStatus?.toLowerCase(), 'payment')}</span>
                        {reservation.paymentStatus}
                      </span>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    {formatPrice(reservation.totalAmount)}
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-700">Validity Status</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(reservation.validityStatus, 'validity')}`}>
                        <span className="mr-1">{getStatusIcon(reservation.validityStatus, 'validity')}</span>
                        {reservation.validityStatus}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Reservation Date</p>
                    <p className="text-sm font-medium text-gray-900">{formatDate(reservation.reservationDate)}</p>
                  </div>
                </div>

                {reservation.paymentStatus?.toLowerCase() !== 'paid' && reservation.paymentStatus?.toLowerCase() !== 'completed' && reservation.paymentStatus?.toLowerCase() !== 'success' && (
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Expiration Date</p>
                      <p className="text-sm font-medium text-gray-900">{formatDate(calculateExpirationDate(reservation.reservationDate)?.toISOString())}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Transaction ID</p>
                    <p className="text-sm font-medium text-gray-900">#{reservation.transactionId || reservation.id}</p>
                  </div>
                </div>

                {reservation.remark && (
                  <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mt-0.5">
                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Remark</p>
                      <p className="text-sm font-medium text-gray-900">{reservation.remark}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Booth Details */}
            {reservation.booths && reservation.booths.length > 0 && (
              <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                <div className="flex items-center space-x-2 mb-3">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <h3 className="text-lg font-semibold text-green-800">Reserved Booths</h3>
                </div>
                <div className="space-y-2">
                  {reservation.booths.map((booth, idx) => (
                    <div key={booth.id || idx} className="flex items-center justify-between p-3 bg-white rounded-lg border border-green-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-green-600">{idx + 1}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{booth.sector} - {booth.boothNum}</p>
                          <p className="text-xs text-gray-500">{booth.boothType}</p>
                        </div>
                      </div>
                      {/* <div className="text-right">
                        <p className="text-sm font-bold text-green-600">{formatPrice(booth.boothPrice)}</p>
                      </div> */}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 pt-6 border-t border-gray-200 flex justify-end gap-3 flex-shrink-0">
          {reservation.paymentStatus?.toLowerCase() === 'pending' && onPayNow && (
            <button
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
              onClick={() => onPayNow(reservation)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <span>Pay Now</span>
            </button>
          )}
          <button 
            onClick={onClose} 
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-medium transition-all duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReservationDetailsDialog;