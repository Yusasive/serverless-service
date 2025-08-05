import { MakePaymentRequest, PaymentRepository, PaymentResponse, VerifyPaymentRequest, VerifyPaymentResponse } from "@/repository/PaymentRepository";

export class PaymentController {
    private static instance: PaymentController;
    private repository: PaymentRepository;

    private constructor() {
        this.repository = PaymentRepository.getInstance();
    }

    public static getInstance(): PaymentController {
        if (!PaymentController.instance) {
            PaymentController.instance = new PaymentController();
        }
        return PaymentController.instance;
    }

    async makePayment(request: MakePaymentRequest): Promise<{ success: boolean; error?: string; data?: PaymentResponse }> {
        try {
            const response = await this.repository.makePayment(request);
            return {
                success: true,
                data: response
            }
        } catch (error) {
            throw error;
        }
    }

    async verifyPayment(request: VerifyPaymentRequest): Promise<{ success: boolean; error?: string; data?: VerifyPaymentResponse }> {
        try {
            const response = await this.repository.verifyPayment(request);
            return {
                success: true,
                data: response
            }
        } catch (error) {
            throw error;
        }
    }
}
