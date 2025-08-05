export interface TransactionData {
  transactionId: number;
  totalAmount: number;
  remark: string;
  boothTransStatus: string;
  paymentStatus: string;
  validityPeriodDays: number;
  reservationDate: Date;
  expirationDate: Date;
  validityStatus: string;
  createdBy?: number;
  updatedBy?: number;
  createdAt: Date;
  updatedAt: Date;
  userId?: number;
  booths: TransactionBoothItem[];
}

export interface TransactionBoothItem {
  id: number;
  sector: string;
  boothNum: string;
  boothPrice: number;
  boothType: string;
  boothStatus: string;
}

export interface TransactionStats {
  total: number;
  pending: number;
  paid: number;
  refunded: number;
  abandoned: number;
  byStatus: Array<{ status: string; count: number }>;
  byMonth: Array<{ month: string; count: number; amount: number }>;
}

export interface TransactionFilters {
  status?: string;
  paymentStatus?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  searchTerm?: string;
  userId?: number;
}

export enum TransactionStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  REFUNDED = 'refunded',
  ABANDONED = 'abandoned',
  PROCESSING = 'processing',
  QUEUED = 'queued',
  REVERSED = 'reversed',
  SUCCESS = 'success'
} 