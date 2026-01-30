import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const MODEL_NAME = 'gemini-2.0-flash'; // Atualizado para a versão disponível

export class AIService {
    private serverKey: string;

    constructor() {
        this.serverKey = process.env.GOOGLE_API_KEY || '';
        if (!this.serverKey) {
            console.warn('SERVER_SIDE_KEY (GOOGLE_API_KEY) not set. AI features might fail unless user provides their own key.');
        } else {
            // Log apenas os primeiros caracteres para segurança
            console.log('AI Service: Key carregada com sucesso (', this.serverKey.substring(0, 6), '...)');
        }
    }

    private getClient(userKey?: string): GenerativeModel {
        const key = userKey || this.serverKey;
        if (!key) {
            throw new Error('No API Key available. Please provide a key or configure the server.');
        }
        const genAI = new GoogleGenerativeAI(key);
        // Tentar usar o modelo configurado, mas com fallback se necessário
        return genAI.getGenerativeModel({ model: MODEL_NAME });
    }

    async generateContent(prompt: string, userKey?: string): Promise<string> {
        try {
            const model = this.getClient(userKey);
            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error: any) {
            const errorMessage = error.message || '';
            
            // Tratamento específico para chave vazada (Leaked Key)
            if (errorMessage.includes('API key was reported as leaked')) {
                console.error('CRÍTICO: Sua Google API Key foi detectada como vazada e desativada pelo Google.');
                throw new Error('Sua chave de API do Google foi desativada por segurança (vazamento detectado). Por favor, gere uma nova chave no Google AI Studio e atualize seu arquivo .env.');
            }

            // Se falhar com 404 (modelo não encontrado), tenta fallback para gemini-2.0-flash-lite
            if (errorMessage.includes('404') || errorMessage.includes('not found')) {
                console.warn('AI Service: Modelo principal falhou. Tentando fallback para gemini-2.0-flash-lite...');
                try {
                    const key = userKey || this.serverKey;
                    const genAI = new GoogleGenerativeAI(key);
                    const fallbackModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });
                    const result = await fallbackModel.generateContent(prompt);
                    const response = await result.response;
                    return response.text();
                } catch (fallbackError: any) {
                    console.error('AI Service: Fallback também falhou:', fallbackError);
                    throw new Error(`AI Generation failed (including fallback): ${fallbackError.message}`);
                }
            }
            console.error('AI Service Error:', error);
            throw new Error(`AI Generation failed: ${error.message || 'Unknown error'}`);
        }
    }
}

export const aiService = new AIService();
