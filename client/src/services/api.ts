import { SessionData, ChatResponse, ErrorResponse } from '../types';

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

// Helper function to try multiple ports if connection fails (dev only)
async function fetchWithFallback(path: string, options: RequestInit): Promise<Response> {
    try {
        const response = await fetch(`${API_URL}${path}`, options);
        if (response.ok || response.status < 500) return response;
        throw new Error('Server error');
    } catch {
        // Only try fallback ports in development
        if (import.meta.env.PROD) {
            throw new Error('Não foi possível conectar ao servidor.');
        }
        
        const currentPort = API_URL.includes('3001') ? '3001' : '3002';
        const fallbackPort = currentPort === '3001' ? '3002' : '3001';
        const fallbackUrl = `http://localhost:${fallbackPort}/api`;
        
        try {
            const response = await fetch(`${fallbackUrl}${path}`, options);
            if (response.ok || response.status < 500) {
                API_URL = fallbackUrl;
                localStorage.setItem('lp_api_port', fallbackPort);
                return response;
            }
            throw new Error('Server error');
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
        const errorData: unknown = await response.json().catch(() => ({}));
        const errorMessage = (
            typeof errorData === 'object' && 
            errorData !== null && 
            'error' in errorData && 
            typeof (errorData as ErrorResponse).error === 'string'
        ) ? (errorData as ErrorResponse).error : 'Failed to chat with agent';
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
