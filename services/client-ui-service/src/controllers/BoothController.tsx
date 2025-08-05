import { NavigateFunction } from 'react-router-dom';
import { 
  BoothRepository, 
  BoothItemInput, 
  CreateBoothReservationRequest,
  BoothTransaction,
  AvailabilityCheck,
  BoothItem,
  BoothStatistics,
  BoothFilters,
  UpdateTransactionStatusRequest
} from '../repository/BoothRepository';

// Additional types for controller responses
interface ControllerResponse<T = any> {
  success: boolean;
  error?: string;
  data?: T;
}

interface PaymentProcessingData {
  reservationIds: number[];
  paymentInfo: any;
  personalInfo: any;
  financialDetails: any;
}

export class BoothController {
  private static instance: BoothController;
  private repository: BoothRepository;
  private navigate: NavigateFunction | null = null;

  private constructor() {
    this.repository = BoothRepository.getInstance();
  }

  public setNavigate(navigate: NavigateFunction) {
    this.navigate = navigate;
  }

  public checkAuthAndRedirect() {
    if (this.navigate) {
      this.navigate('/login');
    }
  }

  public static getInstance(): BoothController {
    if (!BoothController.instance) {
      BoothController.instance = new BoothController();
    }
    return BoothController.instance;
  }

  async checkBoothAvailability(booths: BoothItemInput[]): Promise<ControllerResponse<AvailabilityCheck>> {
    try {
      const response = await this.repository.checkBoothAvailability(booths);
      
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An error occurred while checking booth availability'
      };
    }
  }

  async createBoothReservation(reservationData: CreateBoothReservationRequest): Promise<ControllerResponse<BoothTransaction>> {
    try {
      // Validate input data
      if (!reservationData.booths || reservationData.booths.length === 0) {
        return {
          success: false,
          error: 'At least one booth must be selected for reservation'
        };
      }

      // Check availability first
      // const availabilityCheck = await this.repository.checkBoothAvailability(reservationData.booths);
      
      // if (!availabilityCheck.available) {
      //   return {
      //     success: false,
      //     error: `Some booths are not available: ${availabilityCheck.conflicts.map(c => `${c.sector}-${c.boothNum}`).join(', ')}`
      //   };
      // }

      const response = await this.repository.createBoothReservation(reservationData);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An error occurred while creating booth reservation'
      };
    }
  }

  async getUserReservations(): Promise<ControllerResponse<BoothTransaction[]>> {
    try {
      const response = await this.repository.getUserBoothReservations();
      
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An error occurred while fetching user reservations'
      };
    }
  }

  async getBoothTransactionById(transactionId: number): Promise<ControllerResponse<BoothTransaction>> {
    try {
      if (!transactionId || transactionId <= 0) {
        return {
          success: false,
          error: 'Invalid transaction ID provided'
        };
      }

      const response = await this.repository.getBoothTransactionById(transactionId);
      
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An error occurred while fetching booth transaction'
      };
    }
  }

  async cancelBoothReservation(transactionId: number): Promise<ControllerResponse<boolean>> {
    try {
      if (!transactionId || transactionId <= 0) {
        return {
          success: false,
          error: 'Invalid transaction ID provided'
        };
      }

      // First check if the reservation exists and can be cancelled
      const transactionCheck = await this.repository.getBoothTransactionById(transactionId);
      
      if (transactionCheck.payment_status === 'paid') {
        return {
          success: false,
          error: 'Cannot cancel a paid reservation'
        };
      }

      if (transactionCheck.validity_status === 'expired') {
        return {
          success: false,
          error: 'Reservation has already expired'
        };
      }

      const response = await this.repository.cancelBoothReservation(transactionId);
      
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An error occurred while cancelling booth reservation'
      };
    }
  }

  async getAllReservedBooths(filters?: BoothFilters): Promise<ControllerResponse<BoothItem[]>> {
    try {
      const response = await this.repository.getAllReservedBooths(filters);
      
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An error occurred while fetching reserved booths'
      };
    }
  }

  async getBoothStatistics(): Promise<ControllerResponse<BoothStatistics>> {
    try {
      const response = await this.repository.getBoothStatistics();
      
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An error occurred while fetching booth statistics'
      };
    }
  }

  async updateBoothTransactionStatus(updateData: UpdateTransactionStatusRequest): Promise<ControllerResponse<BoothTransaction>> {
    try {
      if (!updateData.transactionId || updateData.transactionId <= 0) {
        return {
          success: false,
          error: 'Invalid transaction ID provided'
        };
      }

      if (!updateData.status) {
        return {
          success: false,
          error: 'Status is required for update'
        };
      }

      const response = await this.repository.updateBoothTransactionStatus(updateData);
      
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An error occurred while updating transaction status'
      };
    }
  }

  async processBoothPayment(paymentData: PaymentProcessingData): Promise<ControllerResponse<any>> {
    try {
      if (!paymentData.reservationIds || paymentData.reservationIds.length === 0) {
        return {
          success: false,
          error: 'At least one reservation ID is required for payment processing'
        };
      }

      if (!paymentData.paymentInfo || !paymentData.financialDetails) {
        return {
          success: false,
          error: 'Payment information and financial details are required'
        };
      }

      const response = await this.repository.processBoothPayment(paymentData);
      
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An error occurred while processing booth payment'
      };
    }
  }

  async checkReservationValidity(reservationIds?: number[]): Promise<ControllerResponse<{
    validReservations: Array<{
      id: number;
      status: string;
      expirationDate: string;
    }>;
  }>> {
    try {
      const response = await this.repository.checkReservationValidity(reservationIds);
      
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An error occurred while checking reservation validity'
      };
    }
  }

  // Utility methods
  validateBoothInput(booth: BoothItemInput): boolean {
    return Boolean(
      booth.sector?.trim() && 
      booth.boothNum?.trim() && 
      booth.boothPrice?.trim() && 
      booth.boothType?.trim()
    );
  }

  validateBoothsInput(booths: BoothItemInput[]): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!booths || booths.length === 0) {
      errors.push('At least one booth must be provided');
      return { valid: false, errors };
    }

    booths.forEach((booth, index) => {
      if (!this.validateBoothInput(booth)) {
        errors.push(`Booth ${index + 1}: All fields (sector, boothNum, boothPrice, boothType) are required`);
      }
    });

    return {
      valid: errors.length === 0,
      errors
    };
  }

  formatBoothIdentifier(sector: string, boothNum: string): string {
    return `${sector}-${boothNum}`;
  }

  calculateTotalPrice(booths: BoothItemInput[]): number {
    return booths.reduce((total, booth) => {
      const price = parseFloat(booth.boothPrice) || 0;
      return total + price;
    }, 0);
  }

  isReservationActive(transaction: BoothTransaction): boolean {
    return (
      transaction.booth_trans_status === 'active' &&
      transaction.validity_status === 'active' &&
      new Date(transaction.expiration_date) > new Date()
    );
  }

  isReservationExpired(transaction: BoothTransaction): boolean {
    return (
      transaction.validity_status === 'expired' ||
      new Date(transaction.expiration_date) <= new Date()
    );
  }

  canCancelReservation(transaction: BoothTransaction): boolean {
    return (
      this.isReservationActive(transaction) &&
      transaction.payment_status !== 'paid'
    );
  }

  getDaysUntilExpiration(transaction: BoothTransaction): number {
    const expirationDate = new Date(transaction.expiration_date);
    const currentDate = new Date();
    const diffTime = expirationDate.getTime() - currentDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  }

  async getBoothsDatabySectionName(sectionName: string): Promise<BoothItem[]> {
    const response = await this.repository.getBoothsDatabySectionName(sectionName);
    
    // Handle different response structures
    if (response && typeof response === 'object') {
      // If response has a data property, extract it
      if ('data' in response && Array.isArray((response as any).data)) {
        return (response as any).data;
      }
      // If response is already an array, return it
      if (Array.isArray(response)) {
        return response;
      }
      // If response has success and data properties
      if ('success' in response && 'data' in response && Array.isArray((response as any).data)) {
        return (response as any).data;
      }
    }
    
    // Fallback: return empty array if response structure is unexpected
    console.warn('Unexpected response structure from getBoothsDatabySectionName:', response);
    return [];
  }
}