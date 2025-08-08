import React, { useState, useEffect } from 'react';
import { X, User, Building, Shield, Save, Loader2 } from 'lucide-react';
import { ExhibitorData } from '@/types/exhibitor.type';
import { ExhibitorController } from '@/controllers/ExhibitorController';
import { BoothController } from '@/controllers/BoothController';
import { BoothSector } from '@/types/booth.type';
import ToastNotification from '@/components/common/ToastNotification';

interface EditExhibitorModalProps {
  exhibitor: ExhibitorData | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedExhibitor: ExhibitorData) => void;
}

const EditExhibitorModal: React.FC<EditExhibitorModalProps> = ({ 
  exhibitor, 
  isOpen, 
  onClose, 
  onSave 
}) => {
  const [formData, setFormData] = useState<Partial<ExhibitorData>>({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [sectors, setSectors] = useState<BoothSector[]>([]);
  const [sectorsLoading, setSectorsLoading] = useState(false);
  
  // Toast notification state
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState<'success' | 'error' | 'info' | 'warning'>('success');
  const [toastMessage, setToastMessage] = useState('');

  const exhibitorController = ExhibitorController.getInstance();
  const boothController = new BoothController();

  useEffect(() => {
    if (isOpen && exhibitor) {
      setFormData({
        first_name: exhibitor.first_name || '',
        last_name: exhibitor.last_name || '',
        email: exhibitor.email || '',
        phone: exhibitor.phone || '',
        company: exhibitor.company || '',
        local: exhibitor.local || '',
        booth_type: exhibitor.booth_type || '',
        verified: exhibitor.verified || false,
        is_active: exhibitor.is_active || true,
      });
      setErrors({});
      loadSectors();
    }
  }, [isOpen, exhibitor]);

  const loadSectors = async () => {
    try {
      setSectorsLoading(true);
      const sectorData = await boothController.getBoothSectors();
      setSectors(Array.isArray(sectorData) ? sectorData : []);
    } catch (error) {
      console.error('Failed to load sectors:', error);
      displayToast('error', 'Failed to load sectors');
    } finally {
      setSectorsLoading(false);
    }
  };

  // Auto-hide toast after 3 seconds
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const displayToast = (type: 'success' | 'error' | 'info' | 'warning', message: string) => {
    setToastType(type);
    setToastMessage(message);
    setShowToast(true);
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.first_name?.trim()) {
      newErrors.first_name = 'First name is required';
    }

    if (!formData.last_name?.trim()) {
      newErrors.last_name = 'Last name is required';
    }

    if (!formData.phone?.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.company?.trim()) {
      newErrors.company = 'Company name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof ExhibitorData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !exhibitor) {
      return;
    }

    setLoading(true);
    try {
      const updateData = {
        ...formData,
        user_id: exhibitor.user_id,
        email: exhibitor.email,
        user_type: exhibitor.user_type
      };

      await exhibitorController.updateExhibitor(exhibitor.user_id, updateData);
      
      // Create updated exhibitor object
      const updatedExhibitor: ExhibitorData = {
        ...exhibitor,
        ...formData,
        full_name: `${formData.first_name} ${formData.last_name}`.trim()
      };

      onSave(updatedExhibitor);
      displayToast('success', 'Exhibitor updated successfully!');
      onClose();
      
    } catch (error) {
      console.error('Error updating exhibitor:', error);
      displayToast('error', 'Failed to update exhibitor. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  if (!isOpen || !exhibitor) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Edit Exhibitor</h2>
            <p className="text-sm text-gray-600">Update exhibitor information</p>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-500" />
              Personal Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  id="first_name"
                  value={formData.first_name || ''}
                  onChange={(e) => handleInputChange('first_name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.first_name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter first name"
                />
                {errors.first_name && (
                  <p className="mt-1 text-sm text-red-600">{errors.first_name}</p>
                )}
              </div>

              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  id="last_name"
                  value={formData.last_name || ''}
                  onChange={(e) => handleInputChange('last_name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.last_name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter last name"
                />
                {errors.last_name && (
                  <p className="mt-1 text-sm text-red-600">{errors.last_name}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email || ''}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
                  placeholder="Email address"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone *
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter phone number"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>
            </div>
          </div>

          {/* Company Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <Building className="w-5 h-5 text-green-500" />
              Company Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name *
                </label>
                <input
                  type="text"
                  id="company"
                  value={formData.company || ''}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.company ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter company name"
                />
                {errors.company && (
                  <p className="mt-1 text-sm text-red-600">{errors.company}</p>
                )}
              </div>

              <div>
                <label htmlFor="local" className="block text-sm font-medium text-gray-700 mb-1">
                  Region
                </label>
                <select
                  id="local"
                  value={formData.local || ''}
                  onChange={(e) => handleInputChange('local', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select local/region</option>
                  <option value="LOCAL">Local</option>
                  <option value="INTERNATIONAL">International</option>
                </select>
              </div>

              <div>
                <label htmlFor="booth_type" className="block text-sm font-medium text-gray-700 mb-1">
                  Sector
                </label>
                <select
                  id="booth_type"
                  value={formData.booth_type || ''}
                  onChange={(e) => handleInputChange('booth_type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={sectorsLoading}
                >
                  <option value="">{sectorsLoading ? 'Loading sectors...' : 'Select sector'}</option>
                  {sectors
                    .filter(sector => {
                      const description = sector.description || sector.name || '';
                      return !description.toLowerCase().includes('hall');
                    })
                    .map((sector, idx) => (
                      <option key={sector.id || idx} value={sector.description || ''}>
                        {sector.description || sector.name || 'Unknown'}
                      </option>
                    ))}
                </select>
                {sectorsLoading && (
                  <p className="mt-1 text-xs text-gray-500">Loading sectors...</p>
                )}
              </div>
            </div>
          </div>

          {/* Account Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-500" />
              Account Settings
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="verified"
                    checked={formData.verified || false}
                    onChange={(e) => handleInputChange('verified', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="verified" className="ml-2 block text-sm text-gray-700">
                    Verified
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active || false}
                    onChange={(e) => handleInputChange('is_active', e.target.checked)}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
                    Active
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>

        {/* Toast Notification */}
        {showToast && (
          <ToastNotification
            toastType={toastType}
            toastMessage={toastMessage}
            setShowToast={setShowToast}
          />
        )}
      </div>
    </div>
  );
};

export default EditExhibitorModal; 