import { AuthRepository, VerificationTokenResponse, VerificationCodeResponse } from '../repository/AuthRepository';

export class AuthController {
  private static instance: AuthController;
  private repository: AuthRepository;

  private constructor() {
    this.repository = AuthRepository.getInstance();
  }

  public static getInstance(): AuthController {
    if (!AuthController.instance) {
      AuthController.instance = new AuthController();
    }
    return AuthController.instance;
  }

  async getVerificationToken(): Promise<{ success: boolean; error?: string; data?: VerificationTokenResponse }> {
    try {
      const response = await this.repository.getVerificationToken();
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get verification code'
      };
    }
  }

  async verifyCode(code: string): Promise<{ success: boolean; error?: string; data?: VerificationCodeResponse }> {
    try {
      if (!code || code.length !== 6) {
        return {
          success: false,
          error: 'Please enter a valid 6-digit verification code'
        };
      }

      const response = await this.repository.verifyCode(code);
      
      // Store token and user data after successful verification
      if (response.data) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user_id', response.data._id.toString());
        localStorage.setItem('user_type', response.data.userType);
      }

      return {
        success: true,
        data: response
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Code verification failed'
      };
    }
  }

  isAuthenticated(): boolean {
    return localStorage.getItem('token') !== null;
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_type');
  }
}