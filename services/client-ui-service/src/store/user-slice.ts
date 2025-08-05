import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Type definitions
export interface User {
  _id?: string;
  name?: string;
  email?: string;
  phone?: string;
  userType?: 'attendee' | 'exhibitor' | 'litf_staff';
  token?: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}



export interface Booth {
  _id: string;
  sector: string;
  boothNum: string;
  boothPrice: string;
  boothType: string;
  paymentStatus?: 'pending' | 'paid' | 'failed';
  reservationDate?: string;
  expirationDate?: string;
  validityPeriodDays?: number;
  validityStatus?: 'active' | 'expired' | 'paid';
  transactionId?: string;
  transactionReference?: string;
  paymentDate?: string;
  data?: any;
}

export interface ValidityInfo {
  reservationDate: string;
  expirationDate: string;
  validityPeriodDays: number;
  validityStatus: 'active' | 'expired' | 'paid';
}

export interface PaymentDetails {
  paymentId: string;
  transactionId: string;
  transactionReference: string;
  amount: number;
  currency: string;
  status: string;
  paymentDate: string;
}

export interface PaymentHistory extends PaymentDetails {
  timestamp: string;
}

export interface BoothState {
 

  booths: Booth[];
  loading: boolean;
  error: string | null;
  paymentStatus: 'idle' | 'processing' | 'successful' | 'failed' | null;
  selectedSector: string | null;
  reservationIds: string[];
  validityPeriods: Record<string, ValidityInfo>;
  pendingPayments: string[];
  expiredReservations: string[];
  lastPayment?: PaymentDetails;
  lastPaymentError?: any;
  paymentToken?: string | null;
  paymentHistory?: PaymentHistory[];
  twoFactorRequired?: boolean;
  tempToken?: string | null;
  twoFactorEmail?: string;
  staffPermissions?: string[];
  staffDepartment?: string;
  staffPosition?: string;
}

// Initial state
const initialState: BoothState = {

  booths: [],
  loading: false,
  error: null,
  paymentStatus: null,
  selectedSector: null,
  reservationIds: [],
  validityPeriods: {},
  pendingPayments: [],
  expiredReservations: [],
};

// Create slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setSelectedSector: (state, action: PayloadAction<string | null>) => {
      state.selectedSector = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder   
  }
});

export const { setSelectedSector } = userSlice.actions;
export default userSlice.reducer;