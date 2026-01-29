import Redis from 'ioredis';
import { StorageAdapter } from './adapter';
import { SessionData } from '../types';

export class RedisStorage implements StorageAdapter {
    private redis: Redis;
    private ttl: number = 24 * 60 * 60; // 24 hours

    constructor(connectionString: string) {
        this.redis = new Redis(connectionString);
    }

    async getSession(id: string): Promise<SessionData | null> {
        const data = await this.redis.get(`session:${id}`);
        if (!data) return null;
        return JSON.parse(data);
    }

    async saveSession(session: SessionData): Promise<void> {
        await this.redis.set(
            `session:${session.id}`,
            JSON.stringify(session),
            'EX',
            this.ttl
        );
    }

    async deleteSession(id: string): Promise<void> {
        await this.redis.del(`session:${id}`);
    }
}
