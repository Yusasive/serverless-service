import axios from "axios";
import { PAYMENT_BASE_URL } from "@/common/TextStrings";

export interface MakePaymentRequest {
    transaction_id?: number;
    amount: number;
    email: string;
    currency: string;
    user_id: number;
}

export interface VerifyPaymentRequest {
    reference: string;
}

export interface VerifyPaymentResponse {
    id: number;
    amount: number;
    currency: string;
    payStackstatus: string;
    reference?: string;
    user_id: number;
    email: string;
    transactionId: number;

}

export interface PaymentResponse {
    payment: {
        amount: number;
        currency: string;
        email: string;
        status: string;
        reference: string;
        user_id: number;
        id: number;
        // transaction_id?: number
    };
    authorization_url: string;
}


export class PaymentRepository {
    private static instance: PaymentRepository;
    private baseUrl: string;
    private axiosInstance;
    
    private constructor() {
        if (import.meta.env.VITE_ENVIRONMENT === 'dev' || import.meta.env.VITE_ENVIRONMENT === 'prod') {
            this.baseUrl = import.meta.env.VITE_SERVICE_BASE_URL + '/payment';
        } else {
            this.baseUrl = PAYMENT_BASE_URL;
        }
      this.axiosInstance = axios.create({
        baseURL: this.baseUrl,
        withCredentials: true
      });
    }

    public static getInstance(): PaymentRepository {
        if (!PaymentRepository.instance) {
          PaymentRepository.instance = new PaymentRepository();
        }
        return PaymentRepository.instance;
    }

    async makePayment(request: MakePaymentRequest): Promise<PaymentResponse> {
        try {
            const response = await this.axiosInstance.post('/make-payment', request);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Payment failed');
            }
            throw error;
        }
    }

    async verifyPayment(request: VerifyPaymentRequest): Promise<VerifyPaymentResponse> {
        try {
            const response = await this.axiosInstance.post('/verify-payment', request);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Payment verification failed');
            }
            throw error;
        }
    }
}  