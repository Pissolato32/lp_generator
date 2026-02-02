import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

// Models ordered by rate limit efficiency (highest limits first)
// Lite models have 4K RPM and UNLIMITED daily requests - best for cost saving
const MODELS: string[] = [
    'gemini-2.0-flash-lite',    // 4K RPM, 4M TPM, Unlimited RPD - BEST
    'gemini-2.5-flash-lite',    // 4K RPM, 4M TPM, Unlimited RPD
    'gemini-2.0-flash',         // 2K RPM, 4M TPM, Unlimited RPD
    'gemini-2.5-flash',         // 1K RPM, 1M TPM, 10K RPD (fallback)
];

interface ModelState {
    rateLimitedUntil: number;
    consecutiveFailures: number;
}

export class AIService {
    private serverKey: string;
    private modelStates: Map<string, ModelState> = new Map();
    private currentModelIndex: number = 0;

    constructor() {
        this.serverKey = process.env.GOOGLE_API_KEY || '';
        if (!this.serverKey) {
            console.warn('GOOGLE_API_KEY not set. AI features will require user-provided key.');
        } else {
            console.log('AI Service: API key loaded successfully');
            console.log(`AI Service: Using smart model rotation with ${MODELS.length} models`);
        }
        
        // Initialize model states
        MODELS.forEach(model => {
            this.modelStates.set(model, { rateLimitedUntil: 0, consecutiveFailures: 0 });
        });
    }

    private getAvailableModel(): string {
        const now = Date.now();
        
        // Find first available model (not rate limited)
        for (let i = 0; i < MODELS.length; i++) {
            const modelIndex = (this.currentModelIndex + i) % MODELS.length;
            const model = MODELS[modelIndex];
            const state = this.modelStates.get(model)!;
            
            if (state.rateLimitedUntil < now) {
                return model;
            }
        }
        
        // All models rate limited - return the one that will be available soonest
        let soonestModel = MODELS[0];
        let soonestTime = Infinity;
        
        for (const model of MODELS) {
            const state = this.modelStates.get(model)!;
            if (state.rateLimitedUntil < soonestTime) {
                soonestTime = state.rateLimitedUntil;
                soonestModel = model;
            }
        }
        
        return soonestModel;
    }

    private markModelRateLimited(model: string, retryAfterMs: number = 60000): void {
        const state = this.modelStates.get(model)!;
        state.rateLimitedUntil = Date.now() + retryAfterMs;
        state.consecutiveFailures++;
        
        console.log(`AI Service: Model ${model} rate limited for ${retryAfterMs / 1000}s`);
        
        // Move to next model
        this.currentModelIndex = (MODELS.indexOf(model) + 1) % MODELS.length;
    }

    private markModelSuccess(model: string): void {
        const state = this.modelStates.get(model)!;
        state.consecutiveFailures = 0;
    }

    private getClient(modelName: string, userKey?: string): GenerativeModel {
        const key = userKey || this.serverKey;
        if (!key) {
            throw new Error('No API Key available. Please provide a key or configure the server.');
        }
        const genAI = new GoogleGenerativeAI(key);
        return genAI.getGenerativeModel({ model: modelName });
    }

    async generateContent(prompt: string, userKey?: string): Promise<string> {
        const maxRetries = MODELS.length + 1;
        let lastError: Error | null = null;

        for (let attempt = 0; attempt < maxRetries; attempt++) {
            const modelName = this.getAvailableModel();
            const state = this.modelStates.get(modelName)!;
            
            // If model is still rate limited, wait a bit
            const waitTime = state.rateLimitedUntil - Date.now();
            if (waitTime > 0 && waitTime < 5000) {
                await this.sleep(waitTime);
            }

            try {
                console.log(`AI Service: Trying ${modelName} (attempt ${attempt + 1}/${maxRetries})`);
                
                const model = this.getClient(modelName, userKey);
                const result = await model.generateContent(prompt);
                const response = await result.response;
                const text = response.text();
                
                this.markModelSuccess(modelName);
                console.log(`AI Service: Success with ${modelName}`);
                
                return text;
                
            } catch (error: unknown) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                lastError = error instanceof Error ? error : new Error(errorMessage);
                
                // Handle leaked key - critical error, don't retry
                if (errorMessage.includes('API key was reported as leaked')) {
                    console.error('CRITICAL: Google API Key was reported as leaked and disabled.');
                    throw new Error('Sua chave de API do Google foi desativada por segurança (vazamento detectado). Por favor, gere uma nova chave no Google AI Studio.');
                }
                
                // Handle rate limiting (429) - switch to next model
                if (errorMessage.includes('429') || errorMessage.includes('quota') || errorMessage.includes('Too Many Requests')) {
                    // Extract retry delay if provided
                    const retryMatch = errorMessage.match(/retry.*?(\d+)/i);
                    const retryAfter = retryMatch ? parseInt(retryMatch[1]) * 1000 : 60000;
                    
                    this.markModelRateLimited(modelName, Math.min(retryAfter, 120000));
                    continue; // Try next model
                }
                
                // Handle model not found (404) - switch to next model
                if (errorMessage.includes('404') || errorMessage.includes('not found')) {
                    console.warn(`AI Service: Model ${modelName} not available, trying next...`);
                    this.markModelRateLimited(modelName, 300000); // Mark unavailable for 5 min
                    continue;
                }
                
                // Other errors - log and try next model
                console.error(`AI Service Error with ${modelName}:`, errorMessage);
                this.markModelRateLimited(modelName, 10000); // Brief cooldown
            }
        }
        
        // All retries exhausted
        throw new Error(`AI generation failed after trying all models. Last error: ${lastError?.message || 'Unknown error'}`);
    }

    private sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Get current status of all models (for debugging/monitoring)
    getModelStatus(): Record<string, { available: boolean; rateLimitedFor?: number }> {
        const now = Date.now();
        const status: Record<string, { available: boolean; rateLimitedFor?: number }> = {};
        
        for (const model of MODELS) {
            const state = this.modelStates.get(model)!;
            const rateLimitedFor = Math.max(0, state.rateLimitedUntil - now);
            status[model] = {
                available: rateLimitedFor === 0,
                rateLimitedFor: rateLimitedFor > 0 ? Math.ceil(rateLimitedFor / 1000) : undefined
            };
        }
        
        return status;
    }
}

export const aiService = new AIService();
