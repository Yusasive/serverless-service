import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { RoleController } from '@/controllers/RoleController';
import LoadingPage from '@/components/common/LoadingPage';
import Breadcrumb from '@/components/common/Breadcrumb';
import { PermissionGroup } from '@/types/role.type';
import SuccessDialog from '@/components/common/SuccessDialog';
import { useUser } from "@/context/UserContext";

const CreateRole: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<{ status: number; message: string } | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        permissions: [] as string[]
    });
    const [permissionGroups, setPermissionGroups] = useState<PermissionGroup[]>([]);
    const [successDialog, setSuccessDialog] = useState(false);
    const { user } = useUser();



    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                const permissions = await RoleController.getInstance().getPermissions();
                setPermissionGroups(permissions);
            } catch (error: any) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchPermissions();
    }, []);

    const handleCheckbox = (key: string) => {
        setFormData((prev) => ({
            ...prev,
            permissions: prev.permissions.includes(key)
                ? prev.permissions.filter(p => p !== key)
                : [...prev.permissions, key]
        }));
    };

    const handleSelectAll = (group: string) => {
        const groupPermissions = permissionGroups.find(pg => pg.permissionType?.name === group)?.permissions?.map(p => p.id.toString()) || [];
        const allSelected = groupPermissions.every(p => formData.permissions.includes(p));

        setFormData((prev) => ({
            ...prev,
            permissions: allSelected
                ? prev.permissions.filter(p => !groupPermissions.includes(p))
                : [...new Set([...prev.permissions, ...groupPermissions])]
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!user) {
            // Make the user re login
            navigate('/login');
            return;
        }

        try {
            await RoleController.getInstance().createRole({
                ...formData,
                created_by: user.userType
            });
            setSuccessDialog(true);
            // navigate('/dashboard/roles');
        } catch (err: any) {
            setError({
                status: err.status || 500,
                message: err.message || 'An unexpected error occurred'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <LoadingPage isLoading={loading} error={error}>
            <SuccessDialog 
                isOpen={successDialog}
                message="Role created successfully! You will be redirected to the roles page."
                onRedirect={() => navigate('/dashboard/roles')}
                buttonText="Continue"
                showButton={true}
                autoRedirect={false}
            />
            <div className="container mx-auto py-6">
                <Breadcrumb
                    items={[
                        { label: 'Roles', path: '/dashboard/roles' },
                        { label: 'Create' }
                    ]}
                />
                <h1 className="text-3xl font-bold text-green-800 mb-2">Create Role</h1>
                <p className="text-gray-600 mb-6">Role name should be unique and descriptive</p>

                <Card>
                    <CardHeader>
                        <CardTitle>Create New Role</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="name">Role Name</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value.toUpperCase() })}
                                        placeholder="Enter role name"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="description">Description</Label>
                                    <Input
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            const capitalized = value.charAt(0).toUpperCase() + value.slice(1);
                                            setFormData({ ...formData, description: capitalized });
                                        }}
                                        placeholder="Enter role description"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="bg-blue-100 border border-blue-300 rounded-md p-4">
                                <p className="text-blue-800 font-medium">
                                    Select the permissions this role should have. Group them by module for easier management.
                                </p>
                            </div>

                            {permissionGroups.map((group) => (
                                <div key={group.permissionType?.id?.toString() || group.permissionType?.name || 'default'} className="border rounded-md p-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="font-semibold">{group.permissionType?.name || 'Unnamed Group'}</h3>
                                        <button
                                            type="button"
                                            onClick={() => handleSelectAll(group.permissionType?.name || '')}
                                            className="text-primary-900 text-sm hover:underline"
                                        >
                                            Select All
                                        </button>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-2">
                                        {group.permissions?.map((perm) => (
                                            <label key={perm.id} className="flex items-start space-x-2 text-sm">
                                                <Checkbox
                                                    id={perm.id.toString()}
                                                    checked={formData.permissions.includes(perm.id.toString())}
                                                    onCheckedChange={() => handleCheckbox(perm.id.toString())}
                                                />
                                                <div>
                                                    <span className="font-medium">{perm.name}</span> <span className="text-gray-500">({perm.action})</span>
                                                    <div className="text-gray-600 text-xs">{perm.description}</div>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            <div className="flex justify-end space-x-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => navigate('/dashboard/roles')}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit">
                                    Create Role
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </LoadingPage>
    );
};

export default CreateRole;
