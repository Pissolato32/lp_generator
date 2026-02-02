import { SessionData, ChatResponse } from '../types';

const getApiUrl = (): string => {
    // Use environment variable if set
    const envUrl = import.meta.env.VITE_API_URL;
    if (envUrl) return envUrl;
    
    // In production without env var, assume same domain with /api path
    if (import.meta.env.PROD) {
        return '/api';
    }
    
    // Development fallback - try saved port or default
    const savedPort = localStorage.getItem('lp_api_port') ?? '3001';
    return `http://localhost:${savedPort}/api`;
};

let API_URL = getApiUrl();

// Extract error message from response
async function extractErrorMessage(response: Response, defaultMsg: string): Promise<string> {
    try {
        const data = await response.json();
        if (data && typeof data === 'object' && 'error' in data && typeof data.error === 'string') {
            return data.error;
        }
    } catch {
        // ignore JSON parse errors
    }
    return defaultMsg;
}

// Helper function to try multiple ports if connection fails (dev only)
async function fetchWithFallback(path: string, options: RequestInit): Promise<Response> {
    try {
        const response = await fetch(`${API_URL}${path}`, options);
        return response; // Return all responses, handle errors in calling function
    } catch {
        // Network error - only try fallback in development
        if (import.meta.env.PROD) {
            throw new Error('Não foi possível conectar ao servidor. Tente novamente.');
        }
        
        const currentPort = API_URL.includes('3001') ? '3001' : '3002';
        const fallbackPort = currentPort === '3001' ? '3002' : '3001';
        const fallbackUrl = `http://localhost:${fallbackPort}/api`;
        
        try {
            const response = await fetch(`${fallbackUrl}${path}`, options);
            API_URL = fallbackUrl;
            localStorage.setItem('lp_api_port', fallbackPort);
            return response;
        } catch {
            throw new Error('Não foi possível conectar ao servidor. Verifique se o backend está rodando.');
        }
    }
}

export async function chatWithAgent(message: string, sessionId?: string, userKey?: string): Promise<ChatResponse> {
    const response = await fetchWithFallback('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, sessionId, userKey }),
    });

    if (!response.ok) {
        const errorMessage = await extractErrorMessage(response, 'Erro ao gerar página. Tente novamente.');
        throw new Error(errorMessage);
    }

    return response.json() as Promise<ChatResponse>;
}

export async function getSession(sessionId: string): Promise<SessionData> {
    const response = await fetchWithFallback(`/session/${sessionId}`, {
        method: 'GET',
    });

    if (!response.ok) {
        throw new Error('Session not found');
    }

    return response.json() as Promise<SessionData>;
}
