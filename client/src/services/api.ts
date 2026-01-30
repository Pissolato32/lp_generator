import { SessionData, ChatResponse, ErrorResponse } from '../types';

const getApiUrl = () => {
    const envUrl = import.meta.env.VITE_API_URL as string;
    if (envUrl) return envUrl;
    
    // Se estiver em desenvolvimento local, tenta a 3001 e 3002
    return 'http://localhost:3001/api';
};

const API_URL = getApiUrl();

// Função auxiliar para tentar fetch em múltiplas portas se falhar
async function fetchWithFallback(path: string, options: RequestInit): Promise<Response> {
    try {
        const response = await fetch(`${API_URL}${path}`, options);
        if (response.ok || response.status < 500) return response;
        throw new Error('Server error');
    } catch (err) {
        // Se falhar na 3001, tenta na 3002 (fallback local)
        if (API_URL.includes('3001')) {
            const fallbackUrl = API_URL.replace('3001', '3002');
            console.log(`Falha na porta 3001, tentando fallback na ${fallbackUrl}`);
            return fetch(`${fallbackUrl}${path}`, options);
        }
        throw err;
    }
}

export async function chatWithAgent(message: string, sessionId?: string, userKey?: string): Promise<ChatResponse> {
    const response = await fetchWithFallback('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, sessionId, userKey }),
    });

    if (!response.ok) {
        const errorData = (await response.json().catch(() => ({}))) as ErrorResponse;
        throw new Error(errorData.error ?? 'Failed to chat with agent');
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
