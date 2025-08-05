import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { Address } from "@/types/address.type";

interface AddressDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: Address) => void;
  initialValue?: Address;
}

export default function AddressDialog({ isOpen, onClose, onSave, initialValue }: AddressDialogProps) {
  const [address, setAddress] = useState<Address>({
    id: 0,
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    post_code: '',
    country: '',
    is_primary: false
  });

  useEffect(() => {
    if (initialValue) {
      setAddress(initialValue);
    } else {
      setAddress({
        id: 0,
        address_line1: '',
        address_line2: '',
        post_code: '',
        state: '',
        city: '',
        country: '',
        is_primary: false
      });
    }
  }, [initialValue, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg space-y-4">
          <Dialog.Title className="text-lg font-bold">
            {initialValue ? 'Edit Address' : 'Add New Address'}
          </Dialog.Title>

          <div className="space-y-3">
            <input 
              name="address_line1" 
              value={address.address_line1} 
              onChange={handleChange} 
              placeholder="Address Line 1" 
              className="w-full border rounded p-2" 
            />
            <input 
              name="address_line2" 
              value={address.address_line2} 
              onChange={handleChange} 
              placeholder="Address Line 2" 
              className="w-full border rounded p-2" 
            />
            <input 
              name="city" 
              value={address.city} 
              onChange={handleChange} 
              placeholder="City" 
              className="w-full border rounded p-2" 
            />
            <input 
              name="state" 
              value={address.state} 
              onChange={handleChange} 
              placeholder="State" 
              className="w-full border rounded p-2" 
            />
            <input 
              name="post_code" 
              value={address.post_code} 
              onChange={handleChange} 
              placeholder="Post Code" 
              className="w-full border rounded p-2" 
            />
            <input 
              name="country" 
              value={address.country} 
              onChange={handleChange} 
              placeholder="Country" 
              className="w-full border rounded p-2" 
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button onClick={onClose} className="text-gray-500 hover:underline">Cancel</button>
            <button onClick={() => onSave(address)} className="bg-primary-600 text-white px-4 py-2 rounded-lg">Save</button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
