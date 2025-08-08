import { useState, useEffect } from 'react';
import { UserType } from '@/types/user.type';
import { Role } from '@/types/role.type';
import LoadingOverlay from '@/components/common/LoadingOverlay';
import { UserController } from '@/controllers/UserController';
import { RoleController } from '@/controllers/RoleController';

interface CreateUserProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const CreateUser: React.FC<CreateUserProps> = ({ isOpen, onClose, onSuccess }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [roles, setRoles] = useState<Role[]>([]);
    const [loadingRoles, setLoadingRoles] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        phone: '',
        role_id: 0, // Changed from user_type to role_id
        password: 'Welcome@123' // Default password
    });

    // Fetch roles when component mounts
    useEffect(() => {
        const fetchRoles = async () => {
            setLoadingRoles(true);
            try {
                const fetchedRoles = await RoleController.getInstance().getRoles();
                // Filter out Attendee and Exhibitor roles
                const filteredRoles = fetchedRoles.filter(role => 
                    !role.name.toLowerCase().includes('attendee') && 
                    !role.name.toLowerCase().includes('exhibitor')
                );
                setRoles(filteredRoles);
                // Set default role if available
                if (filteredRoles.length > 0) {
                    setFormData(prev => ({ ...prev, role_id: filteredRoles[0].id }));
                }
            } catch (error) {
                console.error('Error fetching roles:', error);
            } finally {
                setLoadingRoles(false);
            }
        };

        if (isOpen) {
            fetchRoles();
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const selectedRole = roles.find(role => role.id === formData.role_id);
            if (!selectedRole) {
                throw new Error('Please select a valid role');
            }

            const userData = {
                email: formData.email,
                phone: formData.phone,
                user_type: UserType.Staff,
                password: formData.password,
                role: selectedRole.name,
            };

            await UserController.getInstance().createUser(userData);
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error creating user:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <LoadingOverlay isLoading={isLoading} message="Creating user..." />
                
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900">Create New User</h2>
                    <p className="mt-1 text-sm text-gray-600">
                        Create a new user account.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email Field */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            required
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    {/* Phone Field */}
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            required
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>

                    {/* Role Field */}
                    <div>
                        <label htmlFor="role_id" className="block text-sm font-medium text-gray-700">
                            Role
                        </label>
                        {loadingRoles ? (
                            <div className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-50">
                                Loading roles...
                            </div>
                        ) : (
                            <select
                                id="role_id"
                                required
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                                value={formData.role_id}
                                onChange={(e) => setFormData({ ...formData, role_id: parseInt(e.target.value) })}
                            >
                                <option value={0}>Select a role</option>
                                {roles.map((role) => (
                                    <option key={role.id} value={role.id}>
                                        {role.name} - {role.description}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    {/* Password Field */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Default Password
                        </label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                            <input
                                type="text"
                                id="password"
                                readOnly
                                className="block w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-50 text-gray-500"
                                value={formData.password}
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    const newPassword = Math.random().toString(36).slice(-8);
                                    setFormData({ ...formData, password: newPassword });
                                }}
                                className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            >
                                Generate New
                            </button>
                        </div>
                        <p className="mt-2 text-sm text-gray-500">
                            This is the default password that will be used for the first login.
                        </p>
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
                            disabled={loadingRoles || formData.role_id === 0}
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            Create User
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateUser;