import { SessionData } from '../types';

export interface StorageAdapter {
    getSession(id: string): Promise<SessionData | null>;
    saveSession(session: SessionData): Promise<void>;
    deleteSession(id: string): Promise<void>;
}
