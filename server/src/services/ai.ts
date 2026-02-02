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

// Exponential backoff configuration (Google recommended)
const BACKOFF_CONFIG = {
    initialDelayMs: 1000,       // Start with 1 second
    maxDelayMs: 60000,          // Cap at 60 seconds
    multiplier: 2,              // Double each retry
    jitterFactor: 0.2,          // Add 20% random jitter
};

interface ModelState {
    rateLimitedUntil: number;
    consecutiveFailures: number;
}

export class AIService {
    private serverKey: string;
    private modelStates: Map<string, ModelState> = new Map();

    constructor() {
        this.serverKey = process.env.GOOGLE_API_KEY || '';
        if (!this.serverKey) {
            console.warn('GOOGLE_API_KEY not set. AI features will require user-provided key.');
        } else {
            console.log('AI Service: API key loaded successfully');
            console.log(`AI Service: Primary model: ${MODELS[0]}`);
        }
        
        // Initialize model states
        MODELS.forEach(model => {
            this.modelStates.set(model, { rateLimitedUntil: 0, consecutiveFailures: 0 });
        });
    }

    // Truncated exponential backoff with jitter (Google recommended)
    private calculateBackoff(attempt: number): number {
        const delay = Math.min(
            BACKOFF_CONFIG.initialDelayMs * Math.pow(BACKOFF_CONFIG.multiplier, attempt),
            BACKOFF_CONFIG.maxDelayMs
        );
        // Add jitter to prevent thundering herd
        const jitter = delay * BACKOFF_CONFIG.jitterFactor * (Math.random() - 0.5) * 2;
        return Math.floor(delay + jitter);
    }

    private getAvailableModels(): string[] {
        const now = Date.now();
        return MODELS.filter(model => {
            const state = this.modelStates.get(model)!;
            return state.rateLimitedUntil < now;
        });
    }

    private markModelRateLimited(model: string, retryAfterMs: number): void {
        const state = this.modelStates.get(model)!;
        state.rateLimitedUntil = Date.now() + retryAfterMs;
        state.consecutiveFailures++;
        console.log(`AI Service: ${model} rate limited for ${Math.ceil(retryAfterMs / 1000)}s`);
    }

    private markModelSuccess(model: string): void {
        const state = this.modelStates.get(model)!;
        state.consecutiveFailures = 0;
        state.rateLimitedUntil = 0;
    }

    private getClient(modelName: string, userKey?: string): GenerativeModel {
        const key = userKey || this.serverKey;
        if (!key) {
            throw new Error('No API Key available. Please provide a key or configure the server.');
        }
        const genAI = new GoogleGenerativeAI(key);
        return genAI.getGenerativeModel({ model: modelName });
    }

    private extractRetryDelay(errorMessage: string): number | null {
        // Try to extract retry delay from error message
        // Format: "retry in X.XXXs" or "retryDelay: Xs"
        const patterns = [
            /retry.*?in\s*(\d+\.?\d*)s/i,
            /retryDelay.*?(\d+)s/i,
            /(\d+)\s*seconds?/i,
        ];
        
        for (const pattern of patterns) {
            const match = errorMessage.match(pattern);
            if (match) {
                return Math.ceil(parseFloat(match[1]) * 1000);
            }
        }
        return null;
    }

    async generateContent(prompt: string, userKey?: string): Promise<string> {
        const maxAttempts = MODELS.length * 2; // Allow retries across models
        let lastError: Error | null = null;
        let globalAttempt = 0;

        while (globalAttempt < maxAttempts) {
            // Get available models (not rate limited)
            let availableModels = this.getAvailableModels();
            
            // If all models are rate limited, wait for the shortest cooldown
            if (availableModels.length === 0) {
                const now = Date.now();
                let shortestWait = Infinity;
                let nextModel = MODELS[0];
                
                for (const model of MODELS) {
                    const state = this.modelStates.get(model)!;
                    const wait = state.rateLimitedUntil - now;
                    if (wait < shortestWait) {
                        shortestWait = wait;
                        nextModel = model;
                    }
                }
                
                if (shortestWait > 0 && shortestWait < 30000) {
                    console.log(`AI Service: All models rate limited. Waiting ${Math.ceil(shortestWait / 1000)}s...`);
                    await this.sleep(shortestWait);
                }
                availableModels = [nextModel];
            }

            // Try each available model
            for (const modelName of availableModels) {
                globalAttempt++;
                
                try {
                    console.log(`AI Service: Trying ${modelName} (attempt ${globalAttempt}/${maxAttempts})`);
                    
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
                        console.error('CRITICAL: Google API Key was reported as leaked.');
                        throw new Error('Sua chave de API do Google foi desativada por segurança. Gere uma nova chave no Google AI Studio.');
                    }
                    
                    // Handle rate limiting (429)
                    if (errorMessage.includes('429') || errorMessage.includes('quota') || 
                        errorMessage.includes('Too Many Requests') || errorMessage.includes('Resource exhausted')) {
                        
                        // Extract retry delay from response or use exponential backoff
                        const extractedDelay = this.extractRetryDelay(errorMessage);
                        const backoffDelay = this.calculateBackoff(this.modelStates.get(modelName)!.consecutiveFailures);
                        const retryAfter = extractedDelay || backoffDelay;
                        
                        this.markModelRateLimited(modelName, Math.min(retryAfter, 120000));
                        console.log(`AI Service: ${modelName} hit rate limit, switching model...`);
                        continue; // Try next model
                    }
                    
                    // Handle model not found (404)
                    if (errorMessage.includes('404') || errorMessage.includes('not found') || 
                        errorMessage.includes('does not exist')) {
                        console.warn(`AI Service: ${modelName} not available`);
                        this.markModelRateLimited(modelName, 600000); // 10 min for unavailable models
                        continue;
                    }
                    
                    // Other errors - brief cooldown and try next
                    console.error(`AI Service: ${modelName} error:`, errorMessage.substring(0, 200));
                    this.markModelRateLimited(modelName, this.calculateBackoff(0));
                }
            }
        }
        
        // All retries exhausted
        throw new Error(`Falha ao gerar conteúdo após ${maxAttempts} tentativas. Tente novamente em alguns minutos.`);
    }

    private sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

export const aiService = new AIService();
