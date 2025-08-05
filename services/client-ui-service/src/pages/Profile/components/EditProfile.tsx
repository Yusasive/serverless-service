import { useEffect, useState, useCallback } from "react";
import { User } from "@/types/user.type";
import { Address } from "@/types/address.type";
import { CheckCircle, Pencil, Trash2 } from "lucide-react";
import AddressDialog from "./AddressDialog";
import { UserController } from "@/controllers/UserController";
import LoadingOverlay from "@/components/common/LoadingOverlay";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import ToastNotification from "@/components/common/ToastNotification";
import PhoneInput from "@/components/common/PhoneInput";

interface EditProfileProps {
  user: User;
  onSave: (updatedUser: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<User | null>;
}

export default function EditProfile({ user, onSave, refreshUser }: EditProfileProps) {
  const [showAddressDialog, setShowAddressDialog] = useState(false);
  const [editingAddressIndex, setEditingAddressIndex] = useState<number | null>(null);
  const [initialAddress, setInitialAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState<string>('success');
  const [toastMessage, setToastMessage] = useState<string>('');
  const [confirmationMessage, setConfirmationMessage] = useState<string>('');
  const [confirmAction, setConfirmAction] = useState<string>('');
  const [confirmActionFunction, setConfirmActionFunction] = useState<(() => Promise<void>) | null>(null);
  const [formData, setFormData] = useState({
    first_name: user.firstName || "",
    last_name: user.lastName || "",
    email: user.email || "",
    phone: user.phone || "",
    company: user.company || "",
    user_type: user.userType || "",
  });

  const [addresses, setAddresses] = useState<Address[]>(
    user.address?.map(addr => ({
      id: addr.id,
      address_line1: addr.address_line1,
      address_line2: addr.address_line2,
      city: addr.city,
      country: addr.country,
      post_code: addr.post_code,
      state: addr.state,
      is_primary: addr.is_primary || false
    })) || []
  );

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showToast) {
      timer = setTimeout(() => {
        setShowToast(false);
      }, 3000); // Hide after 3 seconds
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [showToast]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ToastComponent = () => (
    showToast && (
      <ToastNotification toastType={toastType} toastMessage={toastMessage} setShowToast={setShowToast} />
    )
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Memoize the phone onChange function to prevent infinite re-renders
  const handlePhoneChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, phone: value }));
  }, []);

  const handleAddAddress = () => {
    setEditingAddressIndex(null);
    setShowAddressDialog(true);
  };

  const handleEditAddress = (index: number) => {
    setInitialAddress(addresses[index]);
    setEditingAddressIndex(index);
    setShowAddressDialog(true);
  };

  const handleAddressSave = async (updatedAddress: Address) => {
    setLoading(true);
    try {
      if (editingAddressIndex !== null) {
        const addressRequest = {
          address_line1: updatedAddress.address_line1,
          address_line2: updatedAddress.address_line2,
          city: updatedAddress.city,
          state: updatedAddress.state,
          country: updatedAddress.country,
          post_code: updatedAddress.post_code
        };
        const response = await UserController.getInstance().updateAddress(addresses[editingAddressIndex].id.toString(), addressRequest);
        if (response.success) {
          const newAddresses = [...addresses];
          newAddresses[editingAddressIndex] = updatedAddress;
          setAddresses(newAddresses);
          setToastType('success');
          setToastMessage('Address updated successfully');
          setShowToast(true);
        }
      } else {
        const addressRequest = {
          address_line1: updatedAddress.address_line1,
          address_line2: updatedAddress.address_line2,
          city: updatedAddress.city,
          state: updatedAddress.state,
          country: updatedAddress.country,
          post_code: updatedAddress.post_code
        };
        const response = await UserController.getInstance().addAddress(addressRequest);
        console.log('response', response);
        if (response.success && response.data) {
          const newAddress: Address = {
            id: response.data.id,
            address_line1: response.data.address_line1,
            address_line2: response.data.address_line2 || '',
            city: response.data.city,
            state: response.data.state,
            country: response.data.country,
            post_code: response.data.post_code || '',
            is_primary: response.data.is_primary
          };
          setAddresses(prevAddresses => [...prevAddresses, newAddress]);
          setToastType('success');
          setToastMessage('Address added successfully');
          setShowToast(true);
        }
      }
      await refreshUser();
    } catch (error) {
      setToastType('error');
      setToastMessage('Failed to add address. Please try again.');
      setShowToast(true);
      setError('Failed to save changes. Please try again.');
    } finally {
      setLoading(false);
    }
    setShowAddressDialog(false);
    setEditingAddressIndex(null);
  };

  const handleConfirmDeleteAddress = async (index: number) => {
    setConfirmationMessage('Are you sure you want to delete this address?');
    setConfirmAction('Delete');
    setConfirmActionFunction(() => () =>handleRemoveAddress(index));
    setShowConfirmationDialog(true);
    setEditingAddressIndex(index);
  };

  const handleConfirmSetPrimary = (index: number) => {
    if (index === undefined || index === null) {
      console.error('Invalid address index');
      return;
    }
    
    setConfirmationMessage('Are you sure you want to set this address as primary?');
    setConfirmAction('Set Primary');
    setConfirmActionFunction(() => () => handleSetPrimary(index));
    setShowConfirmationDialog(true);
    setEditingAddressIndex(index);
  };

  const handleRemoveAddress = async (index: number) => {
    const response = await UserController.getInstance().deleteAddress(addresses[index].id.toString());
    if (response.success) {
      const newAddresses = addresses.filter((_, i) => i !== index);
      setAddresses(newAddresses);
      setToastType('success');
      setToastMessage('Address deleted successfully');
      setShowToast(true);
      refreshUser();
    } else {
      setToastType('error');
      setToastMessage('Failed to delete address. Please try again.');
      setShowToast(true);
    }
    setShowConfirmationDialog(false);
    setEditingAddressIndex(null);
  };

  const handleSetPrimary = async (index: number) => {
    if (index === undefined || index === null) {
      console.error('Invalid address index');
      return;
    }
    
    const addressToUpdate = addresses[index];
    if (!addressToUpdate) {
      console.error('Address not found');
      return;
    }

    setLoading(true);
    try {
      const response = await UserController.getInstance().setPrimaryAddress(addressToUpdate.id.toString());
      if (response.success) {
        // Update local state
        const newAddresses = addresses.map((addr, i) => ({
          ...addr,
          is_primary: i === index
        }));
        setAddresses(newAddresses);
        setToastType('success');
        setToastMessage('Primary address updated successfully');
        setShowToast(true);
        // Refresh user data to get updated addresses
        await refreshUser();
      }
    } catch (error) {
      setToastType('error');
      setToastMessage('Failed to update primary address');
      setShowToast(true);
    } finally {
      setLoading(false);
      setShowConfirmationDialog(false);
      setEditingAddressIndex(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await onSave({
        ...formData,
      });
    } catch (err) {
      setError('Failed to save changes. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-16 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <LoadingOverlay isLoading={loading} />
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Edit Profile</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
              disabled
            />
          </div>

          {/* Phone */}
          <PhoneInput
            value={formData.phone}
            onChange={handlePhoneChange}
            label="Phone"
            placeholder="Enter phone number"
          />

          {/* Company */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
              disabled
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg shadow hover:bg-opacity-90 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {/* Address Section */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Addresses</h3>
            <button
              type="button"
              onClick={handleAddAddress}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition duration-200"
            >
              Add Address
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {[...addresses].sort((a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0)).map((address) => (
              <div key={address.id.toString()} className={`relative p-4 rounded-lg border shadow-sm bg-white`}>
                {/* Primary checkmark */}
                {address.is_primary && (
                  <div className="absolute top-2 right-2 text-green-600">
                    <CheckCircle size={20} />
                  </div>
                )}

                <div className="text-sm text-gray-700 space-y-1">
                  <p className="font-medium">{address.address_line1}</p>
                  {address.address_line2 && <p>{address.address_line2}</p>}
                  <p>{[address.city, address.state, address.post_code, address.country]
                      .filter(Boolean)
                      .join(' , ')}</p>
                </div>

                <div className="flex gap-3 mt-4 text-sm text-gray-500">
                  <button
                    type="button"
                    onClick={() => handleEditAddress(addresses.findIndex(addr => addr.id === address.id))}
                    className="hover:text-blue-600 flex items-center gap-1"
                  >
                    <Pencil size={16} /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleConfirmDeleteAddress(addresses.findIndex(addr => addr.id === address.id))}
                    className="hover:text-red-600 flex items-center gap-1"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                  {!address.is_primary && (
                    <button
                      type="button"
                      onClick={() => handleConfirmSetPrimary(addresses.findIndex(addr => addr.id === address.id))}
                      className="hover:text-green-600 flex items-center gap-1"
                    >
                      <CheckCircle size={16} /> Make Primary
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {error && (
            <div className="mt-4 text-sm text-red-600">
              {error}
            </div>
          )}
        </div>

        {/* Address Dialog */}
        <AddressDialog
          isOpen={showAddressDialog}
          onClose={() => {
            setShowAddressDialog(false);
            setEditingAddressIndex(null);
            setInitialAddress(null);
          }}
          onSave={handleAddressSave}
          initialValue={initialAddress || undefined}
        />
      </form>

      {showConfirmationDialog && (
        <ConfirmDialog
          isOpen={showConfirmationDialog}
          onCancel={() => {
            setShowConfirmationDialog(false);
            setEditingAddressIndex(null);
            setConfirmActionFunction(null);
          }}
          onConfirm={confirmActionFunction || (() => {})}
          message={confirmationMessage}
          confirmText={confirmAction}
          cancelText="Cancel"
        />
      )}

      <ToastComponent />
    </div>
  );
}
