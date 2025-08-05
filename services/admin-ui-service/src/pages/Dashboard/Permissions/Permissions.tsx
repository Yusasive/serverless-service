import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Breadcrumb from '@/components/common/Breadcrumb';
import { RoleController } from '@/controllers/RoleController';
import { PermissionGroup } from '@/types/role.type';
import LoadingPage from '@/components/common/LoadingPage';

const Permissions: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{ status: number; message: string } | null>(null);
  const [permissionGroups, setPermissionGroups] = useState<PermissionGroup[]>([]);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const permissions = await RoleController.getInstance().getPermissions();
        setPermissionGroups(permissions);
      } catch (error: any) {
        setError({
          status: error.status || 500,
          message: error.message || 'Failed to load permissions',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, []);

  return (
    <LoadingPage 
      isLoading={loading} 
      error={error}
      loadingMessage="Loading permissions..."
    >
      <div className="container mx-auto py-6">
        <Breadcrumb
          items={[
            { label: 'All Permissions' },
          ]}
        />

        <h1 className="text-3xl font-bold text-green-800 mb-2">All Permissions</h1>
        <p className="text-gray-600 mb-6">
          View all permissions available in the system grouped by category.
        </p>

        <Card>
          <CardHeader>
            <CardTitle>Permission Groups</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {permissionGroups.map((group) => (
              <div
                key={group.permissionType?.id?.toString() || group.permissionType?.name || 'group'}
                className="border rounded-md p-4 bg-gray-100"
              >
                <h3 className="font-semibold mb-3 text-lg text-primary-900">
                  {group.permissionType?.name || 'Unnamed Group'}
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {group.permissions?.map((perm) => (
                    <div key={perm.id} className="p-3 border rounded bg-gray-300">
                      <div className="font-medium">{perm.name}</div>
                      <div className="text-gray-500 text-sm">Action: {perm.action}</div>
                      <div className="text-gray-600 text-xs">{perm.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </LoadingPage>
  );
};

export default Permissions;
