import { LandingPageConfig, SessionData } from '../types';

const getApiUrl = () => {
    const envUrl = import.meta.env.VITE_API_URL as string;
    if (envUrl) return envUrl;
    
    // Tenta carregar a porta salva ou assume a 3001
    const savedPort = localStorage.getItem('lp_api_port') || '3001';
    return `http://localhost:${savedPort}/api`;
};

let API_URL = getApiUrl();

// Função auxiliar para tentar fetch em múltiplas portas se falhar
async function fetchWithFallback(path: string, options: RequestInit): Promise<Response> {
    try {
        const response = await fetch(`${API_URL}${path}`, options);
        if (response.ok || response.status < 500) return response;
        throw new Error('Server error');
    } catch (err) {
        // Se falhar na porta atual, tenta a outra
        const currentPort = API_URL.includes('3001') ? '3001' : '3002';
        const fallbackPort = currentPort === '3001' ? '3002' : '3001';
        const fallbackUrl = `http://localhost:${fallbackPort}/api`;
        
        try {
            // Silencia o erro de conexão no console do navegador built-in para evitar poluição de logs
            const response = await fetch(`${fallbackUrl}${path}`, options);
            if (response.ok || response.status < 500) {
                // Se o fallback funcionou, atualiza a porta global para futuras requisições
                API_URL = fallbackUrl;
                localStorage.setItem('lp_api_port', fallbackPort);
                return response;
            }
            throw new Error('Server error');
        } catch (fallbackErr) {
            // Se ambos falharem, reporta um erro genérico silencioso ou tratado
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
