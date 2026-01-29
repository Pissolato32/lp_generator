import { LandingPageConfig, SessionData } from '../types';

const API_URL = (import.meta.env.VITE_API_URL as string) ?? 'http://localhost:3001/api';

interface ChatResponse {
    session: SessionData;
    config: LandingPageConfig;
}

interface ErrorResponse {
    error?: string;
}

export async function chatWithAgent(message: string, sessionId?: string, userKey?: string): Promise<ChatResponse> {
    const response = await fetch(`${API_URL}/chat`, {
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
    const response = await fetch(`${API_URL}/session/${sessionId}`);

    if (!response.ok) {
        throw new Error('Session not found');
    }

    return response.json() as Promise<SessionData>;
}
