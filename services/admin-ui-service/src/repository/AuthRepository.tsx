import axios from 'axios';
import { AUTH_BASE_URL } from '../common/TextStrings';

export interface VerificationTokenResponse {
  message: string;
}

export interface VerificationCodeResponse {
  message: string;
  data: {
    token: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    phone: string;
    userType: string;
    _id: number;
  };
}

export class AuthRepository {
  private static instance: AuthRepository;
  private baseUrl: string;

  private constructor() {
    if (import.meta.env.VITE_ENVIRONMENT === 'dev' || import.meta.env.VITE_ENVIRONMENT === 'prod') {
      this.baseUrl = import.meta.env.VITE_SERVICE_BASE_URL + '/auth';
    } else {
      this.baseUrl = AUTH_BASE_URL;
    }
  }

  public static getInstance(): AuthRepository {
    if (!AuthRepository.instance) {
      AuthRepository.instance = new AuthRepository();
    }
    return AuthRepository.instance;
  }

  async getVerificationToken(): Promise<VerificationTokenResponse> {
    try {
      const response = await axios.get<VerificationTokenResponse>(
        `${this.baseUrl}/auth/verification-token`
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to get verification code');
      }
      throw error;
    }
  }

  async verifyCode(code: string): Promise<VerificationCodeResponse> {
    try {
      const response = await axios.post<VerificationCodeResponse>(
        `${this.baseUrl}/auth/verify-code`,
        { code }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Code verification failed');
      }
      throw error;
    }
  }
}
