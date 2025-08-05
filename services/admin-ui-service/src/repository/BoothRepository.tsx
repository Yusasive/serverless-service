import axios from 'axios';
import { BOOTH_BASE_URL } from '../common/TextStrings';
import { BoothData, BoothTransaction, BoothStats, BoothSector } from '@/types/booth.type';
import { Response, NestedResponse } from '@/types/response.type';
import { TransactionData, TransactionStats } from '@/types/transaction.type';

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

  async getAllBooths(): Promise<NestedResponse<BoothData[]>> {
    try {
      const response = await this.axiosInstance.get<NestedResponse<BoothData[]>>('/booth/all');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to fetch booths');
      }
      throw error;
    }
  }

  async getBoothsBySector(sector: string): Promise<NestedResponse<BoothData[]>> {
    try {
      const response = await this.axiosInstance.get<NestedResponse<BoothData[]>>(`/booth/sector?sector=${sector}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to fetch booths by sector');
      }
      throw error;
    }
  }

  async getBoothSectors(): Promise<NestedResponse<BoothSector[]>> {
    try {
      const response = await this.axiosInstance.get<NestedResponse<BoothSector[]>>('/booth/sector');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to fetch booth sectors');
      }
      throw error;
    }
  }

  async getBoothStats(): Promise<Response<BoothStats>> {
    try {
      const response = await this.axiosInstance.get<Response<BoothStats>>('/booth/stats');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to fetch booth stats');
      }
      throw error;
    }
  }

  async getReservedBooths(): Promise<Response<BoothTransaction[]>> {
    try {
      const response = await this.axiosInstance.get<Response<BoothTransaction[]>>('/booth/reserved');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to fetch reserved booths');
      }
      throw error;
    }
  }

  async updatePaymentStatus(transactionId: number, status: string, updatedBy?: number): Promise<void> {
    try {
      await this.axiosInstance.patch('/booth/reservations', {
        transactionId,
        status,
        updatedBy
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to update payment status');
      }
      throw error;
    }
  }

  async cancelBoothReservation(transactionId: number): Promise<void> {
    try {
      await this.axiosInstance.delete(`/booth/reservations/${transactionId}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to cancel booth reservation');
      }
      throw error;
    }
  }

  async updateBooth(boothId: string, boothData: { category: string; status: string; sector: string }): Promise<BoothData> {
    try {
      const response = await this.axiosInstance.patch('/booth/update', {
        booth_id: boothId,
        category: boothData.category,
        status: boothData.status,
        sector: boothData.sector
      });
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to update booth');
      }
      throw error;
    }
  }

  async getAllTransactions(): Promise<NestedResponse<TransactionData[]>> {
    try {
      const response = await this.axiosInstance.get('/booth/all-reservations');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      throw error;
    }
  }

  async getTransactionById(id: number): Promise<TransactionData> {
    try {
      const response = await this.axiosInstance.get(`/booth/reservations/${id}`);
      return response.data || response;
    } catch (error) {
      console.error('Failed to fetch transaction:', error);
      throw error;
    }
  }

  async getTransactionStats(): Promise<TransactionStats> {
    try {
      const response = await this.axiosInstance.get('/booth/reservations/stats');
      return response.data || response;
    } catch (error) {
      console.error('Failed to fetch transaction stats:', error);
      throw error;
    }
  }


  // async exportTransactions(filters?: TransactionFilters): Promise<{ success: boolean; downloadUrl?: string; error?: string }> {
  //   try {
  //     const response = await this.axiosInstance.post('/booth/reservations/export', {
  //       method: 'POST',
  //       data: filters || {}
  //     });
  //     return { success: true, downloadUrl: response.downloadUrl };
  //   } catch (error) {
  //     console.error('Failed to export transactions:', error);
  //     return { 
  //       success: false, 
  //       error: error instanceof Error ? error.message : 'Failed to export transactions' 
  //     };
  //   }
  // }

  // async getPaymentDetails(transactionId: number): Promise<any> {
  //   try {
  //     const response = await this.axiosInstance.get(`${PAYMENT_SERVICE_URL}/admin/payments/transaction/${transactionId}`);
  //     return response.data;
  //   } catch (error) {
  //     console.error('Failed to fetch payment details:', error);
  //     return null;
  //   }
  // }
} 