import React, { useState, useEffect } from 'react';
import { BoothData } from '@/types/booth.type';

interface EditBoothModalProps {
  booth: BoothData | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedBooth: Partial<BoothData>) => void;
  loading?: boolean;
}

const EditBoothModal: React.FC<EditBoothModalProps> = ({
  booth,
  isOpen,
  onClose,
  onSave,
  loading = false
}) => {
  const [formData, setFormData] = useState<Partial<BoothData>>({});

  useEffect(() => {
    if (booth) {
      setFormData({
        booth_id: booth.booth_id,
        status: booth.status,
        category: booth.category,
        sector: booth.sector
      });
    }
  }, [booth]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (booth) {
      onSave({
        id: booth.id,
        ...formData
      });
    }
  };

  const handleClose = () => {
    setFormData({});
    onClose();
  };

  if (!isOpen || !booth) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={handleClose} />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Edit Booth: {booth.sector} {booth.booth_name}
            </h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Read-only fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Booth ID
                </label>
                <input
                  type="text"
                  value={booth.booth_id}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Booth Name
                </label>
                <input
                  type="text"
                  value={booth.booth_name}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Size
                </label>
                <input
                  type="text"
                  value={booth.size}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SQM
                </label>
                <input
                  type="text"
                  value={booth.sqm}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price
                </label>
                <input
                  type="text"
                  value={new Intl.NumberFormat('en-NG', {
                    style: 'currency',
                    currency: 'NGN',
                    minimumFractionDigits: 0,
                  }).format(booth.price)}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Booked By
                </label>
                <input
                  type="text"
                  value={booth.booked_by || 'N/A'}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                />
              </div>

              {/* Editable fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.status || ''}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="">Select Status</option>
                  <option value="available">Available</option>
                  <option value="reserved">Reserved</option>
                  <option value="booked">Booked</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.category || ''}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Ordinary">Ordinary</option>
                  <option value="Premium">Premium</option>
                </select>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditBoothModal; 