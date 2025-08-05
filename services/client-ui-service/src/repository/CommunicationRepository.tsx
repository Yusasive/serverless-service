import axios from 'axios';
import { EMAIL_BASE_URL } from '../common/TextStrings';

export interface EmailAttachment {
    filename: string;
    content: string;
    contentType: string;
}

export interface SendEmailRequest {
    to: string[];
    subject: string;
    htmlBody: string;
    textBody?: string;
    from?: string;
    replyTo?: string[];
    cc?: string[];
    bcc?: string[];
    attachments?: EmailAttachment[];
}

export class CommunicationRepository {
    private static instance: CommunicationRepository;
    private baseUrl: string;
    private axiosInstance;

    private constructor() {
        if (import.meta.env.VITE_ENVIRONMENT === 'dev' || import.meta.env.VITE_ENVIRONMENT === 'prod') {
            this.baseUrl = import.meta.env.VITE_SERVICE_BASE_URL + '/comm';
        } else {
            this.baseUrl = EMAIL_BASE_URL;
        }
        this.axiosInstance = axios.create({
            baseURL: this.baseUrl,
            withCredentials: true
        });
    }

    public static getInstance(): CommunicationRepository {
        if (!CommunicationRepository.instance) {
            CommunicationRepository.instance = new CommunicationRepository();
        }
        return CommunicationRepository.instance;
    }

    async sendEmail(email: SendEmailRequest) {
        try {
            const response = await this.axiosInstance.post('/email/send', email);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data.message || 'Email sending failed');
            }
            throw error;
        }
    }
}