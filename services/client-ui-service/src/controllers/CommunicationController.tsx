import { CommunicationRepository, SendEmailRequest } from "../repository/CommunicationRepository";

export class CommunicationController {
    private static instance: CommunicationController;
    private repository: CommunicationRepository;

    private constructor() {
        this.repository = CommunicationRepository.getInstance();
    }
    
    public static getInstance(): CommunicationController {
        if (!CommunicationController.instance) {
            CommunicationController.instance = new CommunicationController();
        }
        return CommunicationController.instance;
    }
    
    
    public async sendEmail(email: SendEmailRequest) {
        try {
            const response = await this.repository.sendEmail(email);
            return response;
        } catch (error) {
            throw error;
        }
    }
}