import axios from 'axios';
import { USER_BASE_URL } from '../common/TextStrings';
import { User } from '../types/user.type';
import { Address } from '../types/address.type';
import { CompanyRep } from '../types/companyRep.types';

export interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  message?: string;
}

export enum UserRole {
  ATTENDEE = 'ATTENDEE',
  EXHIBITOR = 'EXHIBITOR',
  STAFF = 'STAFF'
}

export enum UserRegistrationRole {
  ATTENDEE = 'ATTENDEE',
  EXHIBITOR = 'EXHIBITOR',
}

export interface LoginRequest {
  email: string;
  password: string;
  user_type: UserRole;
  staffId?: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  user_type: UserRegistrationRole;
  company_name?: string;
  phone: string;
  local?: string;
  referral_code?: string;
}

export interface CreateUserProfileRequest {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  country: string;
  email: string;
  phone: string;
  company?: string;
  user_type: string;
  local?: string;
  boothPreference?: string;
  boothType?: string;
}



export interface RegisterResponse {
  message: string;
  data: {
    _id: number;
    email: string;
    userType: string;
    verificationCode: number;
  }
}

export interface AddAddressRequest {
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  country: string;
  post_code?: string;
}


export class UserRepository {
  private static instance: UserRepository;
  private baseUrl: string;
  private axiosInstance;
  
  private constructor() {
    if (import.meta.env.VITE_ENVIRONMENT === 'dev' || import.meta.env.VITE_ENVIRONMENT === 'prod') {
      this.baseUrl = import.meta.env.VITE_SERVICE_BASE_URL + '/user';
    } else {
      this.baseUrl = USER_BASE_URL;
    }
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      withCredentials: true
    });
  }

  public static getInstance(): UserRepository {
    if (!UserRepository.instance) {
      UserRepository.instance = new UserRepository();
    }
    return UserRepository.instance;
  }

  async login(request: LoginRequest): Promise<User> {
    try {
      const response = await this.axiosInstance.post<User>(
        '/client/login',
        request
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Login failed');
      }
      throw error;
    }
  }

  async register(request: RegisterRequest): Promise<RegisterResponse> {
    try {
      const response = await this.axiosInstance.post<RegisterResponse>(
        '/client/register',
        request
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Registration failed');
      }
      throw error;
    }
  }

  async createProfile(request: CreateUserProfileRequest): Promise<{message: string, data: User}> {
    try {
      const response = await this.axiosInstance.post('/profile', request, {
        withCredentials: true
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)){
        throw new Error(error.response?.data.message || 'Profile update failed')
      }
      throw error;
    }
  }

  async getUserProfile(): Promise<ApiResponse<User>> {
    try {
      const response = await this.axiosInstance.get('/profile', {
        withCredentials: true
      });
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)){
        throw new Error(error.response?.data.message || 'Profile update failed')
      }
      throw error;
    }
  }

  async updateUser(updatedUser: Partial<User>): Promise<{ success: boolean; error?: string; data?: User }> {
    try {
      const response = await this.axiosInstance.patch(`/profile`, updatedUser, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {   
      if (axios.isAxiosError(error)){
        throw new Error(error.response?.data.message || 'Profile update failed')
      }
      throw error;
    }
  }

  async updateTwoFactor(twoFactorEnabled: boolean): Promise<{ success: boolean; error?: string; message?: string }> {
    try {
      const response = await this.axiosInstance.patch(`/two-factor`, { twoFactorEnabled }, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {   
      if (axios.isAxiosError(error)){
        throw new Error(error.response?.data.message || 'Two-factor authentication update failed')
      }
      throw error;
    }
  }

  async generateTwoFactorCode(email: string): Promise<{ success: boolean; error?: string; data?: { verificationCode: number } }> {
    try {
      const response = await this.axiosInstance.post(`/two-factor/generate-code`, { email }, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {   
      if (axios.isAxiosError(error)){
        throw new Error(error.response?.data.message || 'Failed to generate two-factor code')
      }
      throw error;
    }
  }

  async verifyTwoFactor(email: string, code: string): Promise<{ success: boolean; error?: string; data?: any }> {
    try {
      const response = await this.axiosInstance.post(`/two-factor/verify-code`, { email, code }, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {   
      if (axios.isAxiosError(error)){
        throw new Error(error.response?.data.message || 'Failed to verify two-factor code')
      }
      throw error;
    }
  }


  async addAddress(request: AddAddressRequest): Promise<{ success: boolean; error?: string; data?: Address }> {
    try {
      const response = await this.axiosInstance.post('/profile/address', request, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)){
        throw new Error(error.response?.data.message || 'Address update failed')
      }
      throw error;
    }
  }

  async updateAddress(address_id: string,request: AddAddressRequest): Promise<{ success: boolean; error?: string; data?: User }> {
    try {
      const response = await this.axiosInstance.patch(`/profile/address/${address_id}`, request, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)){
        throw new Error(error.response?.data.message || 'Address update failed')
      }
      throw error;
    }
  }

  async deleteAddress(address_id: string): Promise<{ success: boolean; error?: string; data?: User }> {
    try {
      const response = await this.axiosInstance.delete(`/profile/address/${address_id}`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)){
        throw new Error(error.response?.data.message || 'Address update failed')
      }
      throw error;
    }
  }

  async setPrimaryAddress(address_id: string): Promise<{ success: boolean; error?: string; data?: User }> {
    try {
      const response = await this.axiosInstance.patch(`/profile/address/${address_id}/primary`, {}, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)){
        throw new Error(error.response?.data.message || 'Address update failed')
      }
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await this.axiosInstance.post('/logout', {}, {
        withCredentials: true
      });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  async getCompanyReps(): Promise<ApiResponse<CompanyRep[]>> {
    try {
      const response = await this.axiosInstance.get('/company-reps', {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)){
        throw new Error(error.response?.data.message || 'Server Unavailable')
      }
      throw error;
    }
  }

  async addCompanyRep(request: CompanyRep): Promise<ApiResponse<CompanyRep>> {
    console.log("Company Rep Request", request);
    try {
      const response = await this.axiosInstance.post('/company-reps', request, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)){
        throw new Error(error.response?.data.message || 'Server Unavailable')
      }
      throw error;
    }
  }

  async deleteCompanyRep(id: number): Promise<ApiResponse<CompanyRep>> {
    try {
      const response = await this.axiosInstance.delete(`/company-reps/${id}`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)){
        throw new Error(error.response?.data.message || 'Server Unavailable')
      }
      throw error;
    }
  }
  
  async updateCompanyRep(id: number, request: Partial<CompanyRep>): Promise<ApiResponse<CompanyRep>> {
    try {
      const response = await this.axiosInstance.patch(`/company-reps/${id}`, request, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)){
        throw new Error(error.response?.data.message || 'Server Unavailable')
      }
      throw error;
    }
  }

  async getCompanyRepById(id: number): Promise<ApiResponse<CompanyRep>> {
    try {
      const response = await this.axiosInstance.get(`/company-reps/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)){
        throw new Error(error.response?.data.message || 'Server Unavailable')
      }
      throw error;
    }
  }

  // Password reset methods
  async forgotPassword(email: string): Promise<{ message: string, data: { resetToken: string } }> {
    try {
      const response = await this.axiosInstance.post('/forgot-password', { email });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to send reset code');
      }
      throw error;
    }
  }

  async verifyResetCode(email: string, code: string): Promise<{ message: string }> {
    try {
      const response = await this.axiosInstance.post('/verify-reset-code', { email, code });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Invalid verification code');
      }
      throw error;
    }
  }

  async resetPassword(email: string, code: string, newPassword: string): Promise<{ message: string }> {
    try {
      const response = await this.axiosInstance.post('/reset-password', { 
        email, 
        code, 
        newPassword 
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to reset password');
      }
      throw error;
    }
  }

  async validateResetToken(token: string): Promise<{ message: string, data: { email: string } }> {
    try {
      const response = await this.axiosInstance.get(`/validate-reset-token?token=${token}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Invalid or expired reset token');
      }
      throw error;
    }
  }

  async resetPasswordWithToken(token: string, newPassword: string): Promise<{ message: string }> {
    try {
      const response = await this.axiosInstance.post('/reset-password', { 
        token, 
        newPassword 
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to reset password');
      }
      throw error;
    }
  }

  async verifyEmail(email: string, code: string): Promise<{ message: string }> {
    try {
      const response = await this.axiosInstance.post('/verify-email', {
        email,
        code
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Email verification failed');
      }
      throw error;
    }
  }

  async resendVerificationCode(email: string): Promise<ApiResponse<{ message: string, verificationCode: number }>> {
    try {
      const response = await this.axiosInstance.post('/resend-verification', {
        email
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to resend verification code');
      }
      throw error;
    }
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<{ success: boolean; error?: string; message?: string }> {
    try {
      const response = await this.axiosInstance.patch('/change-password', {
        oldPassword,
        newPassword
      }, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to change password');
      }
      throw error;
    }
  }
}