import { BoothRepository } from '../repository/BoothRepository';
import { BoothData, BoothTransaction, BoothStats, BoothSector } from '@/types/booth.type';
import { NestedResponse } from '@/types/response.type';
import { TransactionData, TransactionStats } from '@/types/transaction.type';


export class BoothController {
  private boothRepository: BoothRepository;

  constructor() {
    this.boothRepository = BoothRepository.getInstance();
  }

  async getAllBooths(): Promise<BoothData[]> {
    try {
      const response: NestedResponse<BoothData[]> = await this.boothRepository.getAllBooths();
      const boothArray = response?.data?.data;
      return (boothArray && Array.isArray(boothArray)) ? boothArray : [];
    } catch (error) {
      console.error('Controller: Error fetching all booths:', error);
      throw error;
    }
  }

  async getBoothsBySector(sector: string): Promise<BoothData[]> {
    try {
      const response: NestedResponse<BoothData[]> = await this.boothRepository.getBoothsBySector(sector);
      // Extract from nested response structure
      const boothArray = response?.data?.data;
      return (boothArray && Array.isArray(boothArray)) ? boothArray : [];
    } catch (error) {
      console.error('Error fetching booths by sector:', error);
      throw error;
    }
  }

  async getBoothSectors(): Promise<BoothSector[]> {
    try {
      const response: NestedResponse<BoothSector[]> = await this.boothRepository.getBoothSectors();
      const sectorArray = response?.data?.data;
      return (sectorArray && Array.isArray(sectorArray)) ? sectorArray : [];
    } catch (error) {
      console.error('Error fetching booth sectors:', error);
      throw error;
    }
  }

  async getBoothStats(): Promise<BoothStats | null> {
    try {
      const response = await this.boothRepository.getBoothStats();
      return response.data || null;
    } catch (error) {
      console.error('Error fetching booth stats:', error);
      throw error;
    }
  }

  async getReservedBooths(): Promise<BoothTransaction[]> {
    try {
      const response = await this.boothRepository.getReservedBooths();
      return response.data || [];
    } catch (error) {
      console.error('Error fetching reserved booths:', error);
      throw error;
    }
  }

  async updatePaymentStatus(transactionId: number, status: string, updatedBy?: number): Promise<void> {
    try {
      await this.boothRepository.updatePaymentStatus(transactionId, status, updatedBy);
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw error;
    }
  }

  async cancelBoothReservation(transactionId: number): Promise<void> {
    try {
      await this.boothRepository.cancelBoothReservation(transactionId);
    } catch (error) {
      console.error('Error canceling booth reservation:', error);
      throw error;
    }
  }

  async updateBooth(boothId: string, boothData: { category: string; status: string; sector: string }): Promise<BoothData> {
    try {
      const updatedBooth = await this.boothRepository.updateBooth(boothId, boothData);
      return updatedBooth;
    } catch (error) {
      console.error('Error updating booth:', error);
      throw error;
    }
  }

  async getAllTransactions(): Promise<TransactionData[]> {
    try {
      const transactions = await this.boothRepository.getAllTransactions();
      return transactions.data.data;
    } catch (error) {
      console.error('Error in getAllTransactions:', error);
      throw error;
    }
  }

  async getTransactionById(id: number): Promise<TransactionData> {
    try {
      return await this.boothRepository.getTransactionById(id);
    } catch (error) {
      console.error('Error in getTransactionById:', error);
      throw error;
    }
  }

  async getTransactionStats(): Promise<TransactionStats> {
    try {
      const stats = await this.boothRepository.getTransactionStats();
      return stats || {
        total: 0,
        pending: 0,
        paid: 0,
        failed: 0,
        abandoned: 0,
        byStatus: [],
        byMonth: []
      };
    } catch (error) {
      console.error('Error in getTransactionStats:', error);
      // Return default stats on error
      return {
        total: 0,
        pending: 0,
        paid: 0,
        refunded: 0,
        abandoned: 0,
        byStatus: [],
        byMonth: []
      };
    }
  }

  formatCurrency(amount: number, currency: string = 'NGN'): string {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  }

  // Helper method to get status badge color
  getStatusBadgeColor(status: string): string {
    const statusColors: { [key: string]: string } = {
      'active': 'bg-green-100 text-green-800',
      'inactive': 'bg-gray-100 text-gray-800',
      'expired': 'bg-red-100 text-red-800',
      'cancelled': 'bg-yellow-100 text-yellow-800',
      'pending': 'bg-blue-100 text-blue-800',
      'paid': 'bg-green-100 text-green-800',
      'failed': 'bg-red-100 text-red-800',
      'abandoned': 'bg-gray-100 text-gray-800',
      'processing': 'bg-yellow-100 text-yellow-800',
      'queued': 'bg-blue-100 text-blue-800',
      'reversed': 'bg-red-100 text-red-800',
      'success': 'bg-green-100 text-green-800',
      'refunded': 'bg-yellow-100 text-yellow-800'
    };
    return statusColors[status.toLowerCase()] || 'bg-gray-100 text-gray-800';
  }

  // Helper method to get status label
  getStatusLabel(status: string): string {
    const statusLabels: { [key: string]: string } = {
      'active': 'Active',
      'inactive': 'Inactive',
      'expired': 'Expired',
      'cancelled': 'Cancelled',
      'pending': 'Pending',
      'paid': 'Paid',
      'failed': 'Failed',
      'abandoned': 'Abandoned',
      'processing': 'Processing',
      'queued': 'Queued',
      'reversed': 'Reversed',
      'success': 'Success',
      'refunded': 'Refunded'
    };
    return statusLabels[status.toLowerCase()] || status;
  }
} 