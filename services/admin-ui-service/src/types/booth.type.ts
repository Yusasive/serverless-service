export interface BoothData {
  id: number;
  booth_name: string;
  status: string;
  size: string;
  category: string;
  price: number;
  sqm: number;
  booth_id: string;
  grid_position: object;
  coords: number[][];
  booked_by?: number;
  bookdate?: Date | null;
  booth_type?: BoothType;
  sector: string;
  sector_description?: string;
  updated_by?: number;
}

export interface BoothType {
  id: number;
  name: string;
  description: string;
}

export interface BoothItem {
  id: number;
  booth_transaction_id: number;
  sector: string;
  booth_num: string;
  booth_price: number;
  booth_type: string;
  booth_status: string;
}

export interface BoothTransaction {
  id: number;
  booth_amount: number;
  remark: string;
  booth_trans_status: string;
  payment_status: string;
  validity_period_days: number;
  reservation_date: Date;
  expiration_date: Date;
  validity_status: string;
  created_by?: number;
  updated_by?: number;
  created_at: Date;
  updated_at: Date;
  user_id?: number;
  booth_items: BoothItem[];
}

export interface BoothStats {
  totalReserved: number;
  bySector: Array<{ sector: string; count: number }>;
  byPaymentStatus: Array<{ paymentStatus: string; count: number }>;
  byValidityStatus: Array<{ validityStatus: string; count: number }>;
}

export interface BoothSector {
  id: number;
  name: string;
  description: string;
} 