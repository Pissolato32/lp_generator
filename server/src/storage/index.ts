import { StorageAdapter } from './adapter';
import { MemoryStorage } from './memory';
import { RedisStorage } from './redis';
import dotenv from 'dotenv';

dotenv.config();

const useRedis = process.env.USE_REDIS === 'true' && process.env.REDIS_URL;

export const storage: StorageAdapter = useRedis
    ? new RedisStorage(process.env.REDIS_URL!)
    : new MemoryStorage();

export * from './adapter';
export * from './memory';
export * from './redis';
