import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const MODEL_NAME = 'gemini-1.5-flash';

export class AIService {
    private serverKey: string;

    constructor() {
        this.serverKey = process.env.GOOGLE_API_KEY || '';
        if (!this.serverKey) {
            console.warn('SERVER_SIDE_KEY (GOOGLE_API_KEY) not set. AI features might fail unless user provides their own key.');
        }
    }

    private getClient(userKey?: string): GenerativeModel {
        const key = userKey || this.serverKey;
        if (!key) {
            throw new Error('No API Key available. Please provide a key or configure the server.');
        }
        const genAI = new GoogleGenerativeAI(key);
        return genAI.getGenerativeModel({ model: MODEL_NAME });
    }

    async generateContent(prompt: string, userKey?: string): Promise<string> {
        try {
            const model = this.getClient(userKey);
            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error: any) {
            console.error('AI Service Error:', error);
            throw new Error(`AI Generation failed: ${error.message || 'Unknown error'}`);
        }
    }
}

export const aiService = new AIService();
