import { UserRepository, LoginRequest, LoginResponse } from '../repository/UserRepository';
import { User } from '@/types/user.type';
import { CreateUserRequest } from '../repository/UserRepository';

export class UserController {
  private static instance: UserController;
  private repository: UserRepository;

  private constructor() {
    this.repository = UserRepository.getInstance();
  }

  public static getInstance(): UserController {
    if (!UserController.instance) {
      UserController.instance = new UserController();
    }
    return UserController.instance;
  }

  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async login(email: string, password: string): Promise<{ success: boolean; error?: string; data?: LoginResponse }> {
    try {
      // Validate email
      if (!email || !this.validateEmail(email)) {
        return {
          success: false,
          error: 'Please enter a valid email address'
        };
      }

      const request: LoginRequest = {
        email,
        password
      };

      const response = await this.repository.login(request);
      if (response.message === 'success' && response.data) {
        return {
          success: true,
          data: response.data
        };
      } else {
        return {
          success: false,
          error: 'Login failed'
        };
      }

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An error occurred during login'
      };
    }
  }

  async logout(): Promise<void> {
    await this.repository.logout();
  }

  async getUsers(): Promise<User[]> {
    try {
      const response = await this.repository.getUsers();
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  async createUser(user: CreateUserRequest): Promise<void> {
    try {
      await this.repository.createUser(user);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async getUserProfile(): Promise<{ success: boolean; error?: string; data?: User }> {
    try {
      const response = await this.repository.getUserProfile();
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An error occurred during profile update'
      };
    }
  }

  async updateUser(userData: Partial<User>): Promise<void> {
    try {
      await this.repository.updateUser(userData);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  async deleteUser(id: number): Promise<void> {
    try {
      await this.repository.deleteteUser(id);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  async getUserById(id: number): Promise<User> {
    try {
      const response = await this.repository.getUserById(id);
      // Handle different possible response structures
      if (response.data) {
        return response.data;
      } else if (response.message === 'success' && response.data) {
        return response.data;
      } else {
        throw new Error('Invalid response structure from user service');
      }
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      throw error;
    }
  }
}