import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { BoothController } from "../controllers/BoothController";
import { initializeBoothData } from "../pages/Dashboard/exhibitor/shared/components/BoothsData/boothDataManager";

// Type definitions based on backend repository structure
// Update BoothItem interface to match API response
export interface BoothItem {
  id: number;
  boothTransactionId?: number;
  sector: string;
  boothNum: string;
  boothPrice: number | string;
  boothType: string;
  boothStatus: string;
  
  // Allow any additional properties to handle API variations
  [key: string]: any;
}


// Update your booth-slice.ts file with these type fixes

// First, update the interface to match the API response structure
export interface BoothTransaction {
  id: number;
  transactionId?: number; // Make this optional since API uses 'id'
  remark: string;
  boothTransStatus: string; // Changed from booth_trans_status
  paymentStatus: string; // Changed from payment_status
  validityPeriodDays: number; // Changed from validity_period_days
  validityStatus: string; // Changed from validity_status
  reservationDate: string; // Changed from reservation_date
  expirationDate: string; // Changed from expiration_date
  totalAmount: number | string; // API sometimes returns string
  boothCount: number;
  createdBy?: number; // Make optional
  updatedBy?: number; // Make optional
  createdAt?: string; // Make optional
  updatedAt?: string; // Make optional
  booths: BoothItem[]; // Changed from booth_items
  creator?: {
    id: number;
    name: string;
    email: string;
  };
   // Add the missing property that TypeScript expects
 
}

export interface CreateReservationResponse {
  message: string;
  data: {
    transactionId: number;
    reservationDetails: BoothTransaction; // Now this works!
  };
}

export interface GetReservationsResponse {
  message: string;
  data: {
    success: boolean;
    data: BoothTransaction[];
  };
}

export interface BoothItemInput {
  sector: string;
  boothNum: string;
  boothPrice: string;
  boothType: string;
}

export interface AvailabilityCheck {
  available: boolean;
  conflicts: Array<{ 
    sector: string; 
    boothNum: string;
  }>;
}

export interface CreateReservationData {
  booths: BoothItemInput[];
  boothAmount: string; // Optional, can be calculated
  remark?: string;
  validityPeriodDays?: number;
  personalInfo?: any;
}

export interface BoothStatistics {
  totalReserved: number;
  bySector: Array<{ sector: string; count: number }>;
  byPaymentStatus: Array<{ paymentStatus: string; count: number }>;
  byValidityStatus: Array<{ validityStatus: string; count: number }>;
}

export interface BoothState {
  booths: BoothTransaction[];
  boothTransactions: BoothTransaction[];
  reservationIds: number[];
  availabilityCheck: AvailabilityCheck | null;
  statistics: BoothStatistics | null;
  allReservedBooths: BoothItem[];
  loading: boolean;
  error: string | null;
  selectedSector: string | null;
  checkingAvailability: boolean;
  creatingReservation: boolean;
  cancelingReservation: boolean;
  fetchingReservations: boolean;
  lastCreatedReservation: BoothTransaction | null;
}


// Initialize controller
const boothController = BoothController.getInstance();

// Async thunks
export const checkBoothAvailability = createAsyncThunk(
  'booth/checkBoothAvailability',
  async (booths: BoothItemInput[], { rejectWithValue }) => {
    try {
      const response = await boothController.checkBoothAvailability(booths);
      if (!response.data) {
        return rejectWithValue('No availability data returned from server');
      }
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to check booth availability');
    }
  }
);

// 4. Update the async thunk return types
export const createBoothReservation = createAsyncThunk(
  'booth/createBoothReservation',
  async (data: CreateReservationData, { rejectWithValue }) => {
    try {
      const { booths, boothAmount,remark = '', validityPeriodDays = 7, personalInfo } = data;
      
      const payload = {
        booths,
        boothAmount: boothAmount, // Use the correct property name
        remark,
        validityPeriodDays,
        personalInfo
      };
      
      const response = await boothController.createBoothReservation(payload);
      if (!response.data) {
        console.log("Reservation Response", response);
        if (response.error) {
          return rejectWithValue(response.error);
        }
        return rejectWithValue('No reservation data returned from server');
      }
      return response.data; // This should match CreateReservationResponse structure
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create booth reservation');
    }
  }
);

export const getUserBoothReservations = createAsyncThunk(
  'booth/getUserBoothReservations',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Starting getUserBoothReservations - initializing booth data...');
      
      // Initialize booth data from backend first
      await initializeBoothData();
      console.log('Booth data initialization completed');
      
      const response = await boothController.getUserReservations();
      if (!response.data) {
        return rejectWithValue('No reservation data returned from server');
      }
      console.log('User reservations fetched:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error in getUserBoothReservations:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user reservations');
    }
  }
);

export const cancelBoothReservation = createAsyncThunk(
  'booth/cancelBoothReservation',
  async (transactionId: number, { rejectWithValue }) => {
    try {
      const response = await boothController.cancelBoothReservation(transactionId);
      if (typeof response.data !== 'boolean') {
        return rejectWithValue('No cancellation result returned from server');
      }
      return { transactionId, success: response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to cancel booth reservation');
    }
  }
);

export const getAllReservedBooths = createAsyncThunk(
  'booth/getAllReservedBooths',
  async (
    args: {
      filters?: {
        sector?: string;
        boothType?: string;
        paymentStatus?: string;
        validityStatus?: string;
        includeExpired?: boolean;
      };
    } = {},
    { rejectWithValue }
  ) => {
    const { filters } = args;
    try {
      const response = await boothController.getAllReservedBooths(filters);
      return response.data ?? [];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch reserved booths');
    }
  }
);

export const getBoothStatistics = createAsyncThunk(
  'booth/getBoothStatistics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await boothController.getBoothStatistics();
      if (!response.data) {
        return rejectWithValue('No booth statistics data returned from server');
      }
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch booth statistics');
    }
  }
);

export const updateBoothTransactionStatus = createAsyncThunk(
  'booth/updateBoothTransactionStatus',
  async (data: {
    transactionId: number;
    status: string;
    paymentStatus?: string;
  }, { rejectWithValue }) => {
    try {
      const { transactionId, status, paymentStatus } = data;
      const response = await boothController.updateBoothTransactionStatus({
        transactionId,
        status,
        paymentStatus
      });
      if (!response.data) {
        return rejectWithValue('No booth transaction data returned from server');
      }
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update transaction status');
    }
  }
);

// Initial state
const initialState: BoothState = {
   booths: [],
  

  error: null,
  boothTransactions: [],
  reservationIds: [],
  availabilityCheck: null,
  statistics: null,
  allReservedBooths: [],
  loading: false,

  selectedSector: null,
  checkingAvailability: false,
  creatingReservation: false,
  cancelingReservation: false,
  fetchingReservations: false,
  lastCreatedReservation: null,
};

// Create slice
const boothSlice = createSlice({
  name: 'booth',
  initialState,
  reducers: {
    setSelectedSector: (state, action: PayloadAction<string | null>) => {
      state.selectedSector = action.payload;
    },
    clearAvailabilityCheck: (state) => {
      state.availabilityCheck = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetBoothState: () => initialState,
   
  // updatePaymentStatus: (state, action: PayloadAction<{transactionId: string, status: string}>) => {
    //  const { transactionId, status } = action.payload;
      
      // Update boothTransactions
    //  state.boothTransactions = state.boothTransactions.map(transaction => {
        // You might need to match by reference or transaction ID
        // Adjust this condition based on how you store payment reference
        // if (transaction.id.toString() === transactionId || 
        //     transaction.transactionId?.toString() === transactionId) {
        //   return {
        //     ...transaction,
        //     paymentStatus: status
        //   };
        // }
        // return transaction;
  //    });
      
      // Also update the booths array (if it's separate)
  //     state.booths = state.booths.map(transaction => {
  //       if (transaction.id.toString() === transactionId ||  transaction.transactionId?.toString() === transactionId) {
  //         return {
  //           ...transaction,
  //           paymentStatus: status
  //         };
  //       }
  //       return transaction;
  //     });
  // }
  },
  extraReducers: (builder) => {
    builder
       // Check Booth Availability
      .addCase(checkBoothAvailability.pending, (state) => {
        state.checkingAvailability = true;
        state.error = null;
        state.availabilityCheck = null;
      })
      .addCase(checkBoothAvailability.fulfilled, (state, action) => {
        state.checkingAvailability = false;
        state.availabilityCheck = action.payload;
      })
      .addCase(checkBoothAvailability.rejected, (state, action) => {
        state.checkingAvailability = false;
        state.error = action.payload as string;
        state.availabilityCheck = null;
      })

      // Create Booth Reservation - FIXED VERSION
      .addCase(createBoothReservation.pending, (state) => {
        state.creatingReservation = true;
        state.loading = true;
        state.error = null;
      })
      .addCase(createBoothReservation.fulfilled, (state, action) => {
        state.creatingReservation = false;
        state.loading = false;
        
        // Handle the API response structure properly
        let reservationData: BoothTransaction;
        
        // Check if response has nested reservationDetails
        if (action.payload && typeof action.payload === 'object') {
          if ('reservationDetails' in action.payload) {
            reservationData = (action.payload as any).reservationDetails;
          } else {
            reservationData = action.payload as any;
          }
          
          state.lastCreatedReservation = reservationData;
          
          // Add new reservation to the list
          state.boothTransactions.unshift(reservationData);
          
          // Add reservation ID to the list
          const reservationId = reservationData.id || reservationData.transactionId;
          if (reservationId && !state.reservationIds.includes(reservationId)) {
            state.reservationIds.push(reservationId);
          }
          
        }
        
        // Clear availability check since booths are now reserved
        state.availabilityCheck = null;
      })
      .addCase(createBoothReservation.rejected, (state, action) => {
        state.creatingReservation = false;
        state.loading = false;
        state.error = action.payload as string;
      })
     // Get User Booth Reservations - FIXED
    .addCase(getUserBoothReservations.pending, (state) => {
      state.fetchingReservations = true;
      state.loading = true;
      state.error = null;
    })
    .addCase(getUserBoothReservations.fulfilled, (state, action) => {
      state.fetchingReservations = false;
      state.loading = false;
      
      // FIXED: Handle the API response structure properly with type safety
      const payload = action.payload as any;
      
      // Try different possible response structures
      const reservationsData = 
        Array.isArray(payload) ? payload :
        Array.isArray(payload?.data) ? payload.data :
        Array.isArray(payload?.data?.data) ? payload.data.data :
        [];
      
      state.boothTransactions = reservationsData;
      state.booths = reservationsData;
      state.reservationIds = reservationsData.map((transaction: any) => transaction.id);
    })
    .addCase(getUserBoothReservations.rejected, (state, action) => {
      state.fetchingReservations = false;
      state.loading = false;
      state.error = action.payload as string;
    })
       // Cancel Booth Reservation
      .addCase(cancelBoothReservation.pending, (state) => {
        state.cancelingReservation = true;
        state.error = null;
      })
      .addCase(cancelBoothReservation.fulfilled, (state, action) => {
        state.cancelingReservation = false;
        const { transactionId } = action.payload;
        
        // Update the transaction status in the list
        state.boothTransactions = state.boothTransactions.map(transaction => {
          if (transaction.id === transactionId) {
            return {
              ...transaction,
              validityStatus: 'expired',
              boothTransStatus: 'inactive'
            };
          }
          return transaction;
        });
        
        // Remove from reservation IDs if completely cancelled
        state.reservationIds = state.reservationIds.filter(id => id !== transactionId);
      })
           .addCase(cancelBoothReservation.rejected, (state, action) => {
        state.cancelingReservation = false;
        state.error = action.payload as string;
      })
     // Get All Reserved Booths - FIXED
    .addCase(getAllReservedBooths.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getAllReservedBooths.fulfilled, (state, action) => {
  state.loading = false;
  
  // Simple fix: Use type assertion to bypass the type checking
  state.allReservedBooths = (Array.isArray(action.payload) ? action.payload : []) as any[];
})
    .addCase(getAllReservedBooths.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
     // Get Booth Statistics
      .addCase(getBoothStatistics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBoothStatistics.fulfilled, (state, action) => {
        state.loading = false;
        state.statistics = action.payload;
      })
      .addCase(getBoothStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

     // Update Booth Transaction Status
      .addCase(updateBoothTransactionStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBoothTransactionStatus.fulfilled, (state, action) => {
        state.loading = false;
        
        // Update the specific transaction in the list
        state.boothTransactions = state.boothTransactions.map(transaction => {
          if (transaction.id === action.payload.id) {
            return { ...transaction, ...action.payload };
          }
          return transaction;
        });
      })
      .addCase(updateBoothTransactionStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

// Selectors
export const selectBoothTransactions = (state: { booth: BoothState }) => state.booth.boothTransactions;
export const selectReservationIds = (state: { booth: BoothState }) => state.booth.reservationIds;
export const selectAvailabilityCheck = (state: { booth: BoothState }) => state.booth.availabilityCheck;
export const selectBoothStatistics = (state: { booth: BoothState }) => state.booth.statistics;
export const selectAllReservedBooths = (state: { booth: BoothState }) => state.booth.allReservedBooths;
export const selectBoothLoading = (state: { booth: BoothState }) => state.booth.loading;
export const selectBoothError = (state: { booth: BoothState }) => state.booth.error;
export const selectSelectedSector = (state: { booth: BoothState }) => state.booth.selectedSector;
export const selectLastCreatedReservation = (state: { booth: BoothState }) => state.booth.lastCreatedReservation;

// Update helper selectors to use correct field names
export const selectActiveReservations = (state: { booth: BoothState }) => 
  state.booth.boothTransactions.filter(transaction => 
    transaction.boothTransStatus === 'active' && 
    transaction.validityStatus === 'active'
  );

export const selectPaidReservations = (state: { booth: BoothState }) => 
  state.booth.boothTransactions.filter(transaction => 
    transaction.paymentStatus === 'paid'
  );

export const selectPendingPaymentReservations = (state: { booth: BoothState }) => 
  state.booth.boothTransactions.filter(transaction => 
    transaction.paymentStatus === 'pending' && 
    transaction.validityStatus === 'active'
  );

export const selectReservationById = (state: { booth: BoothState }, id: number) => 
  state.booth.boothTransactions.find(transaction => transaction.id === id);

export const { 
  setSelectedSector, 
  clearAvailabilityCheck, 
  clearError, 
  resetBoothState ,
  // updatePaymentStatus // ADD THIS EXPORT
} = boothSlice.actions;

export default boothSlice.reducer;