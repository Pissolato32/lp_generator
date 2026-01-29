import { aiService } from './ai';
import { LandingPageConfig, ChatMessage } from '../types';
import { v4 as uuidv4 } from 'uuid';

const SYSTEM_PROMPT = `
You are an expert Landing Page Generator AI.
Your goal is to generate or modify a JSON configuration for a landing page based on user instructions.

Current Stack: React, TailwindCSS, Lucide Icons.

Output Format: JSON ONLY. Do not include markdown code blocks. Just the raw JSON string.
The JSON must strictly follow the LandingPageConfig interface defined in the codebase.

Image Strategy:
For any image URL (backgrounds, testimonials, etc), YOU MUST USE:
"https://placehold.co/600x400?text={Keyword}"
Replace {Keyword} with a relevant English keyword for that section (e.g., "Guitar", "Coding", "Meeting").
Do NOT invent other URLs.

Behavior:
1. If this is the first request, generate a full LandingPageConfig.
2. If there is an existing config, modify it based on the user's request.
3. Be creative with copy if the user is vague.
4. Ensure all IDs are unique strings.
5. Maintain the existing structure unless explicitly asked to change it.
6. Return the COMPLETE updated JSON, not just the diff.
`;

export class AgentService {
    async processRequest(
        message: string,
        history: ChatMessage[],
        currentConfig: LandingPageConfig | null,
        userKey?: string
    ): Promise<LandingPageConfig> {
        // Construct context
        let prompt = `${SYSTEM_PROMPT}\n\n`;

        if (currentConfig) {
            prompt += `CURRENT CONFIG:\n${JSON.stringify(currentConfig, null, 2)}\n\n`;
        } else {
            prompt += `CURRENT CONFIG: null (Create a new one)\n\n`;
        }

        prompt += `CHAT HISTORY:\n`;
        history.forEach(msg => {
            prompt += `${msg.role.toUpperCase()}: ${msg.content}\n`;
        });

        prompt += `USER NEW REQUEST: ${message}\n`;
        prompt += `\nGenerate the updated (or new) JSON config:`;

        const response = await aiService.generateContent(prompt, userKey);

        // Clean up response (remove markdown if model ignores instruction)
        const cleanResponse = response.replace(/```json/g, '').replace(/```/g, '').trim();

        try {
            const config = JSON.parse(cleanResponse);

            // Ensure basic fields if missing (fallback)
            if (!config.id) config.id = uuidv4();
            if (!config.createdAt) config.createdAt = new Date().toISOString();
            if (!config.updatedAt) config.updatedAt = new Date().toISOString();

            return config;
        } catch (e) {
            console.error('Failed to parse AI response:', cleanResponse);
            throw new Error('AI generated invalid JSON. Please try again.');
        }
    }
}

export const agentService = new AgentService();
