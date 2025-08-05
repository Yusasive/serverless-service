import axios from 'axios';
import { BOOTH_BASE_URL } from '@/common/TextStrings';

// Enums
export enum BoothStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed'
}

export enum ValidityStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  PAID = 'paid'
}

export enum BoothTransactionStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

// Request interfaces
export interface BoothItemInput {
  sector: string;
  boothNum: string;
  boothPrice: string;
  boothType: string;
}

export interface CreateBoothReservationRequest {
  booths: BoothItemInput[];
 
 boothAmount: string;
  remark?: string;
  validityPeriodDays?: number;
  personalInfo?: any;
}

export interface BoothFilters {
  sector?: string;
  boothType?: string;
  paymentStatus?: string;
  validityStatus?: string;
  includeExpired?: boolean;
}

export interface UpdateTransactionStatusRequest {
  transactionId: number;
  status: string;
  paymentStatus?: string;
}

// Response interfaces
export interface BoothItem {
  id: number;
  booth_transaction_id: number;
  sector: string;
  booth_num: string;
  booth_price: string;
  booth_type: string;
  booth_status: string;
  created_at: string;
  updated_at: string;
}

export interface BoothTransaction {
  id: number;
  remark: string;
  boothsAmount: string;
  booth_trans_status: string;
  payment_status: string;
  validity_period_days: number;
  validity_status: string;
  reservation_date: string;
  expiration_date: string;
  created_by: number;
  updated_by: number;
  created_at: string;
  updated_at: string;
  booth_items: BoothItem[];
  creator?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface AvailabilityCheck {
  available: boolean;
  conflicts: Array<{
    sector: string;
    boothNum: string;
  }>;
}

export interface BoothStatistics {
  totalReserved: number;
  bySector: Array<{
    sector: string;
    count: number;
  }>;
  byPaymentStatus: Array<{
    paymentStatus: string;
    count: number;
  }>;
  byValidityStatus: Array<{
    validityStatus: string;
    count: number;
  }>;
}

export interface CreateReservationResponse {
  message: string;
  data: BoothTransaction;
}

export interface ApiResponse<T = any> {
  message: string;
  data: T;
  success?: boolean;
}

export class BoothRepository {
  private static instance: BoothRepository;
  private baseUrl: string;
  private axiosInstance;
  
  private constructor() {
    if (import.meta.env.VITE_ENVIRONMENT === 'dev' || import.meta.env.VITE_ENVIRONMENT === 'prod') {
      this.baseUrl = import.meta.env.VITE_SERVICE_BASE_URL + '/booth';
    } else {
      this.baseUrl = BOOTH_BASE_URL;
    }
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      withCredentials: true
    });
  }

  public static getInstance(): BoothRepository {
    if (!BoothRepository.instance) {
      BoothRepository.instance = new BoothRepository();
    }
    return BoothRepository.instance;
  }

  async checkBoothAvailability(booths: BoothItemInput[]): Promise<AvailabilityCheck> {
    try {
      const response = await this.axiosInstance.post<AvailabilityCheck>(
        '/availability/check',
        { booths }
      );
      console.log('Booth availability check:', response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to check booth availability');
      }
      throw error;
    }
  }

  async createBoothReservation(request: CreateBoothReservationRequest): Promise<CreateReservationResponse> {
    try {
      const response = await this.axiosInstance.post<CreateReservationResponse>(
        'booth/reserve',
        request,
        {
          withCredentials: true
        }
      );
      console.log('Booth reservation created:', response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to create booth reservation');
      }
      throw error;
    }
  }

  async getUserBoothReservations(): Promise<BoothTransaction[]> {
    try {
      const response = await this.axiosInstance.get<ApiResponse<BoothTransaction[]>>(
        'booth/reservations',
        {
          withCredentials: true
        }
      );
      console.log('User booth reservations 2028:', response.data);
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to fetch user reservations');
      }
      throw error;
    }
  }

  async getBoothTransactionById(transactionId: number): Promise<BoothTransaction> {
    try {
      const response = await this.axiosInstance.get<ApiResponse<BoothTransaction>>(
        `/reservations/${transactionId}`,
        {
          withCredentials: true
        }
      );
      console.log('Booth transaction details:', response.data);
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to fetch booth transaction');
      }
      throw error;
    }
  }

  async cancelBoothReservation(transactionId: number): Promise<boolean> {
    try {
      const response = await this.axiosInstance.delete<ApiResponse<boolean>>(
        `/reservations/${transactionId}`,
        {
          withCredentials: true
        }
      );
      console.log('Booth reservation cancelled:', response.data);
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to cancel booth reservation');
      }
      throw error;
    }
  }

  async getAllReservedBooths(filters?: BoothFilters): Promise<BoothItem[]> {
    try {
      const params = new URLSearchParams();
      
      if (filters?.sector) params.append('sector', filters.sector);
      if (filters?.boothType) params.append('boothType', filters.boothType);
      if (filters?.paymentStatus) params.append('paymentStatus', filters.paymentStatus);
      if (filters?.validityStatus) params.append('validityStatus', filters.validityStatus);
      if (filters?.includeExpired !== undefined) {
        params.append('includeExpired', filters.includeExpired.toString());
      }

      const response = await this.axiosInstance.get<ApiResponse<BoothItem[]>>(
        `/booths/reserved?${params.toString()}`,
        {
          withCredentials: true
        }
      );
      console.log('All reserved booths:', response.data);
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to fetch reserved booths');
      }
      throw error;
    }
  }

  async getBoothStatistics(): Promise<BoothStatistics> {
    try {
      const response = await this.axiosInstance.get<ApiResponse<BoothStatistics>>(
        '/statistics',
        {
          withCredentials: true
        }
      );
      console.log('Booth statistics:', response.data);
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to fetch booth statistics');
      }
      throw error;
    }
  }

  async updateBoothTransactionStatus(request: UpdateTransactionStatusRequest): Promise<BoothTransaction> {
    try {
    
      const response = await this.axiosInstance.patch<ApiResponse<BoothTransaction>>(
        `booth/reservations`,
        request,
        {
          withCredentials: true
        }
      );
      console.log('Transaction status updated:', response.data);
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to update transaction status');
      }
      throw error;
    }
  }

  async processBoothPayment(paymentData: {
    reservationIds: number[];
    paymentInfo: any;
    personalInfo: any;
    financialDetails: any;
  }): Promise<any> {
    try {
      const response = await this.axiosInstance.post<ApiResponse<any>>(
        '/payments/process',
        paymentData,
        {
          withCredentials: true
        }
      );
      console.log('Booth payment processed:', response.data);
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to process booth payment');
      }
      throw error;
    }
  }

  async checkReservationValidity(reservationIds?: number[]): Promise<{
    validReservations: Array<{
      id: number;
      status: string;
      expirationDate: string;
    }>;
  }> {
    try {
      const response = await this.axiosInstance.post<ApiResponse<{
        validReservations: Array<{
          id: number;
          status: string;
          expirationDate: string;
        }>;
      }>>(
        '/reservations/check-validity',
        { reservationIds },
        {
          withCredentials: true
        }
      );
      console.log('Reservation validity check:', response.data);
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to check reservation validity');
      }
      throw error;
    }
  }

  async getBoothsDatabySectionName(sector: string): Promise<BoothItem[]> {
    try {
      const response = await this.axiosInstance.get<ApiResponse<BoothItem[]>>(
        `/booth/sector?sector=${sector}`,
        {
          withCredentials: true
        }
      );
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to fetch booth data by section name');
      }
      throw error;
    }
  }
}
