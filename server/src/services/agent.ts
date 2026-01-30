import { aiService } from './ai';
import { LandingPageConfig, ChatMessage } from '../types';
import { LandingPageConfigSchema } from '../schemas/landingPage';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

const SYSTEM_PROMPT = `
Você é um Especialista em Gerador de Landing Page IA (Arquitetura "Smarter Configurator").
Seu objetivo é gerar ou modificar uma configuração JSON para uma landing page com base nas instruções do usuário.

Stack Atual: React 19, TailwindCSS, Lucide Icons.

SEÇÕES DISPONÍVEIS:
Você pode usar qualquer uma das seguintes seções na matriz 'sections':
- 'hero': Seção principal com headline, subheadline, CTA e imagem/vídeo.
- 'features': Grade de recursos/benefícios com ícones.
- 'social-proof': Depoimentos e logotipos.
- 'gallery': Galeria de imagens (grid ou masonry).
- 'carousel': Carrossel de imagens/conteúdo.
- 'pricing': Tabela de preços.
- 'faq': Perguntas frequentes.
- 'contact': Formulário de contato e informações.
- 'footer': Rodapé com links.

CUSTOMIZAÇÃO DE ESTILO (AVANÇADO):
Todas as seções possuem campos opcionais 'className' (string) e 'styles' (objeto).
- Use 'className' para injetar classes utilitárias do TailwindCSS diretamente no container da seção. Ex: "bg-slate-900 text-white py-20".
- Use 'styles' para estilos inline específicos se necessário.

Formato de Saída (JSON Estrito):
Responda APENAS com um objeto JSON seguindo esta estrutura exata:
{
  "plan": "Uma explicação textual detalhada do seu raciocínio. Descreva passo a passo o que você vai fazer e por que (focando em conversão e design).",
  "config": { ... Objeto LandingPageConfig completo ... }
}

Regras:
1. "plan" vem ANTES de "config". Pense antes de agir.
2. Toda a copy DEVE ser em PORTUGUÊS BRASILEIRO (pt-BR).
3. IDs devem ser UUIDs únicos.
4. Imagens: Use "https://placehold.co/600x400?text={Keyword}" (Keyword em Inglês).
5. Retorne o JSON COMPLETO da config, não diffs.
6. Se falhar na validação, você receberá os erros e deverá corrigir.

Lembre-se: Você é um engenheiro de software sênior e especialista em marketing. Suas escolhas devem ser justificadas no "plan".
`;

export class AgentService {
    async processRequest(
        message: string,
        history: ChatMessage[],
        currentConfig: LandingPageConfig | null,
        userKey?: string
    ): Promise<{ config: LandingPageConfig; explanation: string }> {
        // Construct initial context
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

        let attempts = 0;
        const maxAttempts = 3;
        let lastError = '';

        while (attempts < maxAttempts) {
            try {
                let currentPrompt = prompt;
                if (lastError) {
                    currentPrompt += `\n\nERRO NA TENTATIVA ANTERIOR:\n${lastError}\n\nCORRIJA O JSON E TENTE NOVAMENTE.`;
                    console.log(`[Agent] Retry attempt ${attempts + 1} due to validation error.`);
                }

                const response = await aiService.generateContent(currentPrompt, userKey);
                const cleanResponse = response.replace(/```json/g, '').replace(/```/g, '').trim();

                // 1. Parse JSON
                let result;
                try {
                    result = JSON.parse(cleanResponse);
                } catch (e) {
                    throw new Error(`JSON Syntax Error: ${(e as Error).message}`);
                }

                // Handle legacy format or missing plan
                const configRaw = result.config || result;
                const explanation = result.plan || result.explanation || "Atualizei a landing page.";

                // 2. Validate with Zod
                // Ensure basic fields if missing before validation to help the AI (optional, but good for robustness)
                if (!configRaw.id) configRaw.id = uuidv4();
                if (!configRaw.createdAt) configRaw.createdAt = new Date().toISOString();
                if (!configRaw.updatedAt) configRaw.updatedAt = new Date().toISOString();

                const validation = LandingPageConfigSchema.safeParse(configRaw);

                if (!validation.success) {
                    // Format Zod errors for the LLM
                    const errorMessages = validation.error.errors.map(err => {
                        return `Path: ${err.path.join('.')}, Message: ${err.message}`;
                    }).join('\n');
                    throw new Error(`Schema Validation Failed:\n${errorMessages}`);
                }

                // Success!
                return {
                    config: validation.data as LandingPageConfig, // Return the clean, typed data
                    explanation: explanation
                };

            } catch (e) {
                lastError = (e as Error).message;
                attempts++;
                if (attempts >= maxAttempts) {
                    console.error('[Agent] Max attempts reached. Last error:', lastError);
                    throw new Error(`Não consegui gerar uma configuração válida após ${maxAttempts} tentativas. Erro: ${lastError}`);
                }
            }
        }

        throw new Error('Erro inesperado no loop do agente.');
    }
}

export const agentService = new AgentService();
