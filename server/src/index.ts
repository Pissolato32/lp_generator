import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { storage } from './storage';
import { agentService } from './services/agent';
import { ChatMessage, SessionData } from './types';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001; // Default to 3001 to avoid conflict with Vite 5173 or 3000

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.get('/api/session/:id', async (req, res) => {
    try {
        const session = await storage.getSession(req.params.id);
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

app.post('/api/chat', async (req, res) => {
    try {
        const { message, sessionId, userKey } = req.body;

        if (!message) {
            res.status(400).json({ error: 'Message is required' });
            return;
        }

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

        // Process with Agent
        const newConfig = await agentService.processRequest(
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
            content: 'I have updated the landing page based on your request.',
            timestamp: Date.now()
        });

        await storage.saveSession(session);

        res.json({ session, config: newConfig });

    } catch (error: any) {
        console.error('Chat Error:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
