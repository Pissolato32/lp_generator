import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { v4 as uuidv4, validate as isUUID } from 'uuid';
import { z } from 'zod';
import { storage } from './storage';
import { hybridAgentService } from './services/hybridAgent';
import { ChatMessage, SessionData } from './types';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const isDev = process.env.NODE_ENV !== 'production';

// Trust proxy for Render (handles rate limiter X-Forwarded-For)
app.set('trust proxy', true);

// Security middleware
app.use(helmet({
    contentSecurityPolicy: isDev ? false : undefined,
}));

// CORS configuration
const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || [];
app.use(cors({
    origin: isDev 
        ? true 
        : (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
    credentials: true,
    methods: ['GET', 'POST'],
}));

// Rate limiting for chat endpoint
const chatLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX || '30', 10),
    message: { error: 'Muitas requisições. Aguarde alguns minutos e tente novamente.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Request body size limit
app.use(express.json({ limit: '1mb' }));

// Input validation schemas
const ChatRequestSchema = z.object({
    message: z.string().min(1).max(5000),
    sessionId: z.string().uuid().optional(),
    userKey: z.string().max(200).optional(),
});

app.get('/api/health', (_req, res) => {
    res.json({ 
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
    });
});

app.get('/api/session/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validate session ID format
        if (!isUUID(id)) {
            res.status(400).json({ error: 'Invalid session ID format' });
            return;
        }
        
        const session = await storage.getSession(id);
        if (!session) {
            res.status(404).json({ error: 'Session not found' });
            return;
        }
        res.json(session);
    } catch (error) {
        console.error('Get Session Error:', error);
        res.status(500).json({ error: 'Failed to retrieve session' });
    }
});

app.post('/api/chat', chatLimiter, async (req, res) => {
    try {
        // Validate input
        const validation = ChatRequestSchema.safeParse(req.body);
        if (!validation.success) {
            res.status(400).json({ 
                error: 'Dados inválidos: ' + validation.error.errors.map(e => e.message).join(', ')
            });
            return;
        }
        
        const { message, sessionId, userKey } = validation.data;

        let session: SessionData;

        if (sessionId) {
            const existing = await storage.getSession(sessionId);
            if (existing) {
                session = existing;
            } else {
                // Session expired or lost
                session = {
                    id: uuidv4(),
                    messages: [],
                    lpConfig: null,
                    createdAt: Date.now(),
                    updatedAt: Date.now()
                };
            }
        } else {
            session = {
                id: uuidv4(),
                messages: [],
                lpConfig: null,
                createdAt: Date.now(),
                updatedAt: Date.now()
            };
        }

        // Add user message
        const userMsg: ChatMessage = {
            role: 'user',
            content: message,
            timestamp: Date.now()
        };
        session.messages.push(userMsg);

        // Process with Hybrid Agent (uses pre-built blocks + AI)
        const { config: newConfig, explanation } = await hybridAgentService.processRequest(
            message,
            session.messages,
            session.lpConfig,
            userKey
        );

        // Update Session
        session.lpConfig = newConfig;
        session.updatedAt = Date.now();

        session.messages.push({
            role: 'assistant',
            content: explanation,
            timestamp: Date.now()
        });

        await storage.saveSession(session);

        res.json({ session, config: newConfig });

    } catch (error: unknown) {
        console.error('Chat Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
        // Don't expose internal error details in production
        res.status(500).json({ 
            error: isDev ? errorMessage : 'Ocorreu um erro ao processar sua solicitação.'
        });
    }
});

const startServer = (p: number | string) => {
    const server = app.listen(p, () => {
        console.log(`Server running on port ${p} (${isDev ? 'development' : 'production'})`);
    }).on('error', (err: NodeJS.ErrnoException) => {
        if (err.code === 'EADDRINUSE') {
            console.log(`Port ${p} in use, trying port ${Number(p) + 1}...`);
            startServer(Number(p) + 1);
        } else {
            console.error('Server startup error:', err);
        }
    });
    
    return server;
};

startServer(port);
