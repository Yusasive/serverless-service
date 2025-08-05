import { NavigateFunction } from 'react-router-dom';
import { UserRepository, LoginRequest, RegisterRequest, RegisterResponse, CreateUserProfileRequest} from '../repository/UserRepository';
import { User } from '../types/user.type';
import { AddAddressRequest } from '../repository/UserRepository';
import { Address } from '../types/address.type';
import { CompanyRep } from '../types/companyRep.types';

export class UserController {
  private static instance: UserController;
  private repository: UserRepository;
  private navigate: NavigateFunction | null = null;

  private constructor() {
    this.repository = UserRepository.getInstance();
  }

  public setNavigate(navigate: NavigateFunction) {
    this.navigate = navigate;
  }

  public checkAuthAndRedirect() {
    if (this.navigate) {
      this.navigate('/login');
    }
  }

  public static getInstance(): UserController {
    if (!UserController.instance) {
      UserController.instance = new UserController();
    }
    return UserController.instance;
  }

  async login(loginData: LoginRequest): Promise<{ success: boolean; error?: string; data?: User }> {
    try {

      const response = await this.repository.login(loginData);

      return {
        success: true,
        data: response
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An error occurred during login'
      };
    }
  }

  async register(registerData: RegisterRequest): Promise<{ success: boolean; error?: string; data?: RegisterResponse }> {
    try {
      const response = await this.repository.register(registerData);
      return {
        success: true,
        data: response
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An error occurred during registration'
      };
    }
  }

  async logout(): Promise<void> {
    await this.repository.logout();
  }

  async createProfile(profileData: CreateUserProfileRequest): Promise<{ success: boolean; error?: string; data?: User }> {
    try{
      const response = await this.repository.createProfile(profileData);
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
 

  validateInitialProfile(user: User): boolean {
    return Boolean(user.firstName?.trim() && user.lastName?.trim());
  }

  async updateUser(updatedUser: Partial<User>): Promise<{ success: boolean; error?: string; data?: User }> {
    try {
      const response = await this.repository.updateUser(updatedUser);
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

  async updateTwoFactor(twoFactorEnabled: boolean): Promise<{ success: boolean; error?: string; message?: string }> {
    try {
      const response = await this.repository.updateTwoFactor(twoFactorEnabled);
      return {
        success: true,
        message: response.message
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An error occurred while updating two-factor authentication'
      };
    }
  }

  async generateTwoFactorCode(email: string): Promise<{ success: boolean; error?: string; data?: { verificationCode: number } }> {
    try {
      const response = await this.repository.generateTwoFactorCode(email);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An error occurred while generating two-factor code'
      };
    }
  }

  async verifyTwoFactor(email: string, code: string): Promise<{ success: boolean; error?: string; data?: any }> {
    try {
      const response = await this.repository.verifyTwoFactor(email, code);
      
      if (response.data) {
        return {
          success: true,
          data: response.data
        };
      } else {
        return {
          success: true,
          data: response
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An error occurred while verifying two-factor code'
      };
    }
  }

  async addAddress(addressData: AddAddressRequest): Promise<{ success: boolean; error?: string; data?: Address }> {
    try {
      const response = await this.repository.addAddress(addressData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An error occurred during address update'
      };
    }
  }

  async updateAddress(address_id: string, addressData: AddAddressRequest): Promise<{ success: boolean; error?: string; data?: User }> {
    try {
      const response = await this.repository.updateAddress(address_id, addressData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An error occurred during address update'
      };
    }
  }

  async deleteAddress(address_id: string): Promise<{ success: boolean; error?: string; data?: User }> {
    try {
      const response = await this.repository.deleteAddress(address_id);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An error occurred during address update'
      };
    }
  }

  async setPrimaryAddress(address_id: string): Promise<{ success: boolean; error?: string; data?: User }> {
    try {
      const response = await this.repository.setPrimaryAddress(address_id);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An error occurred during address update'
      };
    }
  }

  async getCompanyReps(): Promise<{ success: boolean; error?: string; data?: CompanyRep[] }> {
    try {
      const response = await this.repository.getCompanyReps();
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An error occurred during company rep update'
      };
    }
  }

  async addCompanyRep(companyRep: CompanyRep): Promise<{ success: boolean; error?: string; data?: CompanyRep }> {
    try {
      const response = await this.repository.addCompanyRep(companyRep);
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An error occurred during company rep update'
      };
    }
  }

  async deleteCompanyRep(id: number): Promise<{ success: boolean; error?: string; data?: CompanyRep }> {
    try {
      const response = await this.repository.deleteCompanyRep(id);
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An error occurred during company rep update'
      };
    }
  }

  async updateCompanyRep(id: number, companyRep: Partial<CompanyRep>): Promise<{ success: boolean; error?: string; data?: CompanyRep }> {
    try {
      const response = await this.repository.updateCompanyRep(id, companyRep);
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An error occurred during company rep update'
      };
    }
  }

  async getCompanyRepById(id: number): Promise<{ success: boolean; error?: string; data?: CompanyRep }> {
    try {
      const response = await this.repository.getCompanyRepById(id);
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An error occurred while fetching company rep'
      };
    }
  }

  // Password reset methods
  async forgotPassword(email: string): Promise<{ success: boolean; error?: string; data?: { resetToken: string } }> {
    try {
      const response = await this.repository.forgotPassword(email);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An error occurred while sending reset code'
      };
    }
  }

  async verifyResetCode(email: string, code: string): Promise<{ success: boolean; error?: string; message?: string }> {
    try {
      const response = await this.repository.verifyResetCode(email, code);
      return {
        success: true,
        message: response.message
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Invalid verification code'
      };
    }
  }

  async resetPassword(email: string, code: string, newPassword: string): Promise<{ success: boolean; error?: string; message?: string }> {
    try {
      const response = await this.repository.resetPassword(email, code, newPassword);
      return {
        success: true,
        message: response.message
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An error occurred while resetting password'
      };
    }
  }

  async validateResetToken(token: string): Promise<{ success: boolean; error?: string; data?: { email: string } }> {
    try {
      const response = await this.repository.validateResetToken(token);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Invalid or expired reset token'
      };
    }
  }

  async resetPasswordWithToken(token: string, newPassword: string): Promise<{ success: boolean; error?: string; message?: string }> {
    try {
      const response = await this.repository.resetPasswordWithToken(token, newPassword);
      return {
        success: true,
        message: response.message
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An error occurred while resetting password'
      };
    }
  }

  async verifyEmail(email: string, code: string): Promise<{ success: boolean; error?: string; message?: string }> {
    try {
      const response = await this.repository.verifyEmail(email, code);
      return {
        success: true,
        message: response.message
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Email verification failed'
      };
    }
  }

  async resendVerificationCode(email: string): Promise<{ success: boolean; error?: string; message?: string; data?: { verificationCode: number } }> {
    try {
      const response = await this.repository.resendVerificationCode(email);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to resend verification code'
      };
    }
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<{ success: boolean; error?: string; message?: string }> {
    try {
      const response = await this.repository.changePassword(oldPassword, newPassword);
      return {
        success: true,
        message: response.message
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An error occurred while changing password'
      };
    }
  }
}
