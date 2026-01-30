import { StorageAdapter } from './adapter';
import { SessionData } from '../types';

export class MemoryStorage implements StorageAdapter {
    private sessions: Map<string, SessionData> = new Map();

    async getSession(id: string): Promise<SessionData | null> {
        return this.sessions.get(id) || null;
    }

    async saveSession(session: SessionData): Promise<void> {
        this.sessions.set(session.id, session);
    }

    async deleteSession(id: string): Promise<void> {
        this.sessions.delete(id);
    }
}
