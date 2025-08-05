import { Role } from '@/types/role.type';
import { RoleRepository } from '../repository/RoleRepository';
import { PermissionGroup } from '@/types/role.type';

export class RoleController {
    private static instance: RoleController;
    private repository: RoleRepository;

    private constructor() {
        this.repository = RoleRepository.getInstance();
    }

    public static getInstance(): RoleController {
        if (!RoleController.instance) {
            RoleController.instance = new RoleController();
        }
        return RoleController.instance;
    }

    async getRoles(): Promise<Role[]> {
        try {
            const roles = await this.repository.getRoles();
            return roles;
        } catch (error) {
            console.error('Error fetching roles:', error);
            throw error;
        }
    }

    async createRole(roleData: { name: string; description: string; permissions: string[]; created_by: string }): Promise<Role> {
        try {
            const role = await this.repository.createRole(roleData);
            return role;
        } catch (error) {
            console.error('Error creating role:', error);
            throw error;
        }
    }

    async getPermissions(): Promise<PermissionGroup[]> {
        try {
            const permissions = await this.repository.getPermissions();
            return permissions;
        } catch (error) {
            console.error('Error fetching permissions:', error);
            throw error;
        }
    }

    async getRoleById(id: number): Promise<Role> {
        try {
            const role = await this.repository.getRoleById(id);
            return role;
        } catch (error) {
            console.error('Error fetching role by id:', error);
            throw error;
        }
    }

    async deleteRole(id: number): Promise<void> {
        try {
            await this.repository.deleteRole(id);
        } catch (error) {
            console.error('Error deleting role:', error);
            throw error;
        }
    }

    async updateRole(id: number, roleData: { name: string; description: string; permissions: string[] }): Promise<Role> {
        try {
            const role = await this.repository.updateRole(id, roleData);
            return role;
        } catch (error) {
            console.error('Error updating role:', error);
            throw error;
        }
    }
}