// types.ts

export interface Permission {
    id: number;
    name: string;
    action: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}
  
export interface RolePermission {
    id: number;
    roleId: number;
    permissionId: number;
    createdAt: string;
    updatedAt: string;
    permission: Permission;
}

export interface PermissionType {
    id: number;
    name: string;
    description: string;
    created_by: string;
    createdAt: string;
    updatedAt: string;
    isActive: boolean;
}
  
export interface Role {
    id: number;
    name: string;
    description: string;
    created_by: string;
    createdAt: string;
    updatedAt: string;
    isActive: boolean;
    rolePermissions: RolePermission[];
}

export interface PermissionGroup {
    permissionType: PermissionType;
    permissions: Permission[];
}
  