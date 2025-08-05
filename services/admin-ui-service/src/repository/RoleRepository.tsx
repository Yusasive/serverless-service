import axios, { AxiosInstance } from 'axios';
import { AUTH_BASE_URL } from '../common/TextStrings';
import { PermissionGroup, Role, PermissionType } from '@/types/role.type';

export class RoleRepository {
    private static instance: RoleRepository;
    private baseUrl: string;
    private axiosInstance: AxiosInstance;

    private constructor() {
        if (import.meta.env.VITE_ENVIRONMENT === 'dev' || import.meta.env.VITE_ENVIRONMENT === 'prod') {
            this.baseUrl = import.meta.env.VITE_SERVICE_BASE_URL + '/auth';
        } else {
            this.baseUrl = AUTH_BASE_URL;
        }
        this.axiosInstance = axios.create({
            baseURL: this.baseUrl,
            withCredentials: true
        });
    }

    public static getInstance(): RoleRepository {
        if (!RoleRepository.instance) {
            RoleRepository.instance = new RoleRepository();
        }
        return RoleRepository.instance;
    }

    async getRoles(): Promise<Role[]> {
        try {
            const response = await this.axiosInstance.get<Role[]>('/roles', {
                withCredentials: true
            });
            return response.data;
        } catch (error: any) {
            if (error.response) {
                throw {
                    status: error.response.status,
                    message: error.response.data.message || 'Failed to fetch roles'
                };
            }
            throw {
                status: 500,
                message: 'An unexpected error occurred'
            };
        }
    }

    async createRole(roleData: { name: string; description: string; permissions: string[] }): Promise<Role> {
        try {
            const response = await this.axiosInstance.post<Role>('/roles', roleData, {
                withCredentials: true
            });
            return response.data;
        } catch (error: any) {
            if (error.response) {
                throw {
                    status: error.response.status,
                    message: error.response.data.message || 'Failed to create role'
                };
            }
            throw {
                status: 500,
                message: 'An unexpected error occurred'
            };
        }
    }

    async deleteRole(id: number): Promise<void> {
        try {
            await this.axiosInstance.delete(`/roles/${id}`, {
                withCredentials: true
            });
        } catch (error: any) {
            if (error.response) {
                throw {
                    status: error.response.status,
                    message: error.response.data.message || 'Failed to delete role'
                };
            }
            throw {
                status: 500,
                message: 'An unexpected error occurred'
            };
        }
    }

    async getRoleById(id: number): Promise<Role> {
        try {
            const response = await this.axiosInstance.get<Role>(`/roles/${id}`, {
                withCredentials: true
            });
            return response.data;
        } catch (error: any) {
            if (error.response) {
                throw {
                    status: error.response.status,
                    message: error.response.data.message || 'Failed to fetch role by id'
                };
            }
            throw {
                status: 500,
                message: 'An unexpected error occurred'
            };
        }
    }

    async getPermissions(): Promise<PermissionGroup[]> {
        try {
            const response = await this.axiosInstance.get<PermissionType[]>('/permissions', {
                withCredentials: true
            });
            return response.data.map(permissionType => ({
                permissionType: {
                    id: permissionType.id,
                    name: permissionType.name,
                    description: permissionType.description,
                    created_by: permissionType.created_by,
                    createdAt: permissionType.createdAt,
                    updatedAt: permissionType.updatedAt,
                    isActive: permissionType.isActive
                },
                permissions: (permissionType as any).permissions || []
            }));
        } catch (error: any) {
            if (error.response) {
                throw {
                    status: error.response.status,
                    message: error.response.data.message || 'Failed to fetch permissions'
                };
            }
            throw {
                status: 500,
                message: 'An unexpected error occurred'
            };
        }
    }

    async updateRole(id: number, roleData: { name: string; description: string; permissions: string[] }): Promise<Role> {
        console.log(roleData);
        try {
            const response = await this.axiosInstance.put<Role>(`/roles/${id}`, roleData, {
                withCredentials: true
            });
            return response.data;
        } catch (error: any) {
            if (error.response) {
                throw {
                    status: error.response.status,
                    message: error.response.data.message || 'Failed to update role'
                };
            }
            throw {
                status: 500,
                message: 'An unexpected error occurred'
            };
        }
    }

}
    
    
    
