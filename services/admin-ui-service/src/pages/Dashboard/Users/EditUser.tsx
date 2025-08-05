import { useState, useEffect } from 'react';
import LoadingOverlay from '@/components/common/LoadingOverlay';
import { User } from '@/types/user.type';
import { UserController } from '@/controllers/UserController';

interface EditUserProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    user: User;
}

const EditUser: React.FC<EditUserProps> = ({ isOpen, onClose, onSuccess, user }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
    });

    useEffect(() => {
        setFormData({
            first_name: user.first_name || '',
            last_name: user.last_name || '',
        });
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await UserController.getInstance().updateUser({
                ...user,
                first_name: formData.first_name,
                last_name: formData.last_name,
            });
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error updating user:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <LoadingOverlay isLoading={isLoading} message="Saving changes..." />
                
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900">Edit User</h2>
                    <p className="mt-1 text-sm text-gray-600">
                        Update user information.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            disabled
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-50 text-gray-500"
                            value={user.email || ''}
                        />
                    </div>

                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            disabled
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-50 text-gray-500"
                            value={user.phone || ''}
                        />
                    </div>

                    <div>
                        <label htmlFor="user_type" className="block text-sm font-medium text-gray-700">
                            User Type
                        </label>
                        <input
                            type="text"
                            id="user_type"
                            disabled
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-50 text-gray-500"
                            value={user.userType || ''}
                        />
                    </div>

                    {/* First Name Field (Editable) */}
                    <div>
                        <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                            First Name
                        </label>
                        <input
                            type="text"
                            id="first_name"
                            required
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                            value={formData.first_name}
                            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                        />
                    </div>

                    {/* Last Name Field (Editable) */}
                    <div>
                        <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                            Last Name
                        </label>
                        <input
                            type="text"
                            id="last_name"
                            required
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                            value={formData.last_name}
                            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                        />
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditUser;