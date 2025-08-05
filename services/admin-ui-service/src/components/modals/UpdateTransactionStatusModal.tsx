import React, { useState } from 'react';
import { X, AlertTriangle, CheckCircle } from 'lucide-react';
import { TransactionData } from '@/types/transaction.type';
import { useUser } from '@/context/UserContext';

interface UpdateTransactionStatusModalProps {
  transaction: TransactionData | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: (transactionId: number, newStatus: string, updatedBy: number) => Promise<void>;
}

const UpdateTransactionStatusModal: React.FC<UpdateTransactionStatusModalProps> = ({
  transaction,
  isOpen,
  onClose,
  onStatusUpdate
}) => {
  const { user } = useUser();
  const [selectedStatus, setSelectedStatus] = useState<string>('paid');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transaction || !user) return;

    try {
      setLoading(true);
      setError(null);
      await onStatusUpdate(transaction.transactionId, selectedStatus, user.user_id);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update transaction status');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedStatus('paid');
    setError(null);
    setLoading(false);
    onClose();
  };

  if (!isOpen || !transaction) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Update Payment Status</h2>
            <p className="text-sm text-gray-600">Transaction ID: {transaction.transactionId}</p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <AlertTriangle className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-blue-500 mr-2" />
                <span className="text-sm font-medium text-blue-800">Current Status</span>
              </div>
              <p className="text-sm text-blue-700 mt-1">
                Payment Status: <span className="font-semibold capitalize">{transaction.paymentStatus}</span>
              </p>
              <p className="text-sm text-blue-700">
                Transaction Status: <span className="font-semibold capitalize">{transaction.boothTransStatus}</span>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  New Payment Status
                </label>
                <select
                  id="status"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full bg-white border border-gray-300 text-sm rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={loading}
                >
                  <option value="paid">Paid</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex">
                  <AlertTriangle className="h-5 w-5 text-yellow-400" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">Important Note</h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        Changing the payment status to "Paid" will also update the transaction status 
                        and mark the associated booths as booked. This action cannot be easily undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading || !user}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Updating...
              </div>
            ) : (
              'Update Status'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateTransactionStatusModal; 