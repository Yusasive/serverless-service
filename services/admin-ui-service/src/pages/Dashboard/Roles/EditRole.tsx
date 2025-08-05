import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import Breadcrumb from '@/components/common/Breadcrumb';
import SuccessDialog from '@/components/common/SuccessDialog';
import LoadingPage from '@/components/common/LoadingPage';
import { RoleController } from '@/controllers/RoleController';
import { RolePermission, PermissionGroup } from '@/types/role.type';

const EditRole: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [successDialog, setSuccessDialog] = useState(false);
  const [error, setError] = useState<{ status: number; message: string } | null>(null);
  const [permissionGroups, setPermissionGroups] = useState<PermissionGroup[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: [] as string[],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const role = await RoleController.getInstance().getRoleById(Number(id));
        const groups = await RoleController.getInstance().getPermissions(); // grouped permissions

        setFormData({
          name: role.name,
          description: role.description,
          permissions: role.rolePermissions.map((p: RolePermission) => p.permissionId.toString()),
        });

        setPermissionGroups(groups);
      } catch (err: any) {
        setError({
          status: err.status || 500,
          message: err.message || 'An unexpected error occurred',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleCheckbox = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(id)
        ? prev.permissions.filter((p) => p !== id)
        : [...prev.permissions, id],
    }));
  };

  const handleSelectAll = (groupPermissions: string[]) => {
    const allSelected = groupPermissions.every((id) => formData.permissions.includes(id));

    setFormData((prev) => ({
      ...prev,
      permissions: allSelected
        ? prev.permissions.filter((p) => !groupPermissions.includes(p))
        : [...new Set([...prev.permissions, ...groupPermissions])],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await RoleController.getInstance().updateRole(Number(id), {
        name: formData.name,
        description: formData.description,
        permissions: formData.permissions
      });
      setSuccessDialog(true);
    } catch (err: any) {
      setError({
        status: err.status || 500,
        message: err.message || 'An unexpected error occurred',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoadingPage isLoading={loading} error={error}>
      <SuccessDialog
        isOpen={successDialog}
        message="Role permissions updated successfully!"
        onRedirect={() => setSuccessDialog(false)}
        buttonText="Back to Roles"
        showButton={true}
        autoRedirect={false}
      />

      <div className="container mx-auto py-6">
        <Breadcrumb
          items={[
            { label: 'Roles', path: '/dashboard/roles' },
            { label: 'Edit Role' },
          ]}
        />

        <h1 className="text-3xl font-bold text-green-800 mb-2">Edit Role</h1>
        <p className="text-gray-600 mb-6">You can update the permissions for this role below.</p>

        <Card>
          <CardHeader>
            <CardTitle>Role Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Role Name</Label>
                  <Input id="name" value={formData.name} disabled />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input id="description" value={formData.description} disabled />
                </div>
              </div>

              <div className="bg-blue-100 border border-blue-300 rounded-md p-4">
                <p className="text-blue-800 font-medium">Check or uncheck the permissions for this role.</p>
              </div>

              {permissionGroups.map((group) => {
                const groupIds = group.permissions.map((p) => p.id.toString());

                return (
                  <div key={group.permissionType.name} className="border rounded-md p-4 mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold">{group.permissionType.name}</h3>
                      <button
                        type="button"
                        onClick={() => handleSelectAll(groupIds)}
                        className="text-primary-900 text-sm hover:underline"
                      >
                        Select All
                      </button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-2">
                      {group.permissions.map((perm) => (
                        <label key={perm.id} className="flex items-start space-x-2 text-sm">
                          <Checkbox
                            id={perm.id.toString()}
                            checked={formData.permissions.includes(perm.id.toString())}
                            onCheckedChange={() => handleCheckbox(perm.id.toString())}
                          />
                          <div>
                            <span className="font-medium">{perm.name}</span>{' '}
                            <span className="text-gray-500">({perm.action})</span>
                            <div className="text-gray-600 text-xs">{perm.description}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}

              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={() => navigate('/dashboard/roles')}>
                  Cancel
                </Button>
                <Button type="submit">Update Permissions</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </LoadingPage>
  );
};

export default EditRole;
