import { aiService } from './ai';
import { LandingPageConfig, ChatMessage } from '../types';
import { v4 as uuidv4 } from 'uuid';

const SYSTEM_PROMPT = `
Você é um Especialista em Gerador de Landing Page IA.
Seu objetivo é gerar ou modificar uma configuração JSON para uma landing page com base nas instruções do usuário.

Stack Atual: React, TailwindCSS, Lucide Icons.

Formato de Saída: APENAS JSON. Não inclua blocos de código markdown. Apenas a string JSON bruta.
O JSON deve seguir rigorosamente a interface LandingPageConfig definida na base de código.

Linguagem:
Toda a copy da landing page (headlines, subheadlines, textos de botões, conteúdo de seções, etc.) DEVE ser em PORTUGUÊS BRASILEIRO (pt-BR).

Estratégia de Imagens:
Para qualquer URL de imagem (fundos, depoimentos, etc), VOCÊ DEVE USAR:
"https://placehold.co/600x400?text={Keyword}"
Substitua {Keyword} por uma palavra-chave relevante em INGLÊS para essa seção (ex: "Guitar", "Coding", "Meeting").
Não invente outras URLs.

Comportamento:
1. Se este for o primeiro pedido, gere uma LandingPageConfig completa.
2. Se houver uma configuração existente, modifique-a com base no pedido do usuário.
3. Seja criativo com a copy se o usuário for vago.
4. Garanta que todos os IDs sejam strings únicas (UUIDs).
5. Mantenha a estrutura existente a menos que seja explicitamente solicitado para mudar.
6. Retorne o JSON ATUALIZADO COMPLETO, não apenas o diff.
7. SEJA PROATIVO: Se você fizer mudanças de design (cores, fontes), explique brevemente o porquê na mensagem de resposta (se houver um campo para isso, caso contrário, apenas garanta que o JSON reflita as melhores práticas de conversão).
8. Se o usuário pedir algo ambíguo, tente interpretar da melhor forma para conversão, mas você pode sugerir melhorias no próximo turno.
`;

export class AgentService {
    async processRequest(
        message: string,
        history: ChatMessage[],
        currentConfig: LandingPageConfig | null,
        userKey?: string
    ): Promise<{ config: LandingPageConfig; explanation: string }> {
        // Construct context
        let prompt = `${SYSTEM_PROMPT}\n\n`;

        if (currentConfig) {
            prompt += `CONFIGURAÇÃO ATUAL:\n${JSON.stringify(currentConfig, null, 2)}\n\n`;
        } else {
            prompt += `CONFIGURAÇÃO ATUAL: null (Criar uma nova)\n\n`;
        }

        prompt += `HISTÓRICO DO CHAT:\n`;
        history.forEach(msg => {
            prompt += `${msg.role.toUpperCase()}: ${msg.content}\n`;
        });

        prompt += `NOVO PEDIDO DO USUÁRIO: ${message}\n`;
        prompt += `\nInstrução Especial: Além do JSON da configuração, eu preciso que você forneça uma breve explicação (máximo 2 frases) do que foi alterado ou por que foi feito dessa forma, focando em conversão e design. 
        Formato de Resposta Esperado:
        {
          "config": { ... },
          "explanation": "Explicação em pt-BR aqui"
        }
        `;

        const response = await aiService.generateContent(prompt, userKey);

        // Clean up response (remove markdown if model ignores instruction)
        const cleanResponse = response.replace(/```json/g, '').replace(/```/g, '').trim();

        try {
            const result = JSON.parse(cleanResponse);
            const config = result.config || result; // Fallback if it didn't wrap in {config, explanation}
            const explanation = result.explanation || 'Atualizei a landing page conforme solicitado.';

            // Ensure basic fields if missing (fallback)
            if (!config.id) config.id = uuidv4();
            if (!config.createdAt) config.createdAt = new Date().toISOString();
            if (!config.updatedAt) config.updatedAt = new Date().toISOString();

            return { config, explanation };
        } catch (e) {
            console.error('Failed to parse AI response:', cleanResponse);
            throw new Error('A IA gerou um JSON inválido. Por favor, tente novamente.');
        }
    }
}

export const agentService = new AgentService();
