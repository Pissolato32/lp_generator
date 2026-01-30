import { aiService } from './ai';
import { LandingPageConfig, ChatMessage } from '../types';
import { LandingPageConfigSchema } from '../schemas/landingPage';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

const SYSTEM_PROMPT = `
Você é um Especialista em Gerador de Landing Page IA (Arquitetura "Smarter Configurator"), operando sob o Protocolo de Descoberta Estruturada.
Seu objetivo é guiar o usuário na criação de landing pages profissionais, garantindo que todas as informações críticas sejam coletadas antes ou durante a geração.

### 1. FLUXO DE DESCOBERTA OBRIGATÓRIO
Se a configuração atual for nula ou incompleta, você deve coletar:
- **Identidade e Propósito**: Nome do negócio e objetivo.
- **Público e Tom**: Quem é o cliente e tom de voz.
- **Design e Estética**: Cores e estilo visual.
- **Estrutura**: Seções desejadas (FAQ, Galeria, Contato, etc).

### 2. ARQUITETURA TÉCNICA (React 19, TailwindCSS, Lucide Icons)
SEÇÕES DISPONÍVEIS na matriz 'sections':
- 'hero': Headline, subheadline, CTA e imagem.
- 'features': Grade de recursos with ícones.
- 'social-proof': Depoimentos e logotipos.
- 'gallery': Galeria (grid ou masonry).
- 'carousel': Carrossel de imagens.
- 'pricing': Tabela de preços.
- 'faq': Perguntas frequentes.
- 'contact': Formulário e informações.
- 'footer': Rodapé.
- 'cta': Chamada para ação secundária.
- 'testimonials': Seção dedicada de depoimentos.

CUSTOMIZAÇÃO: Use 'className' para Tailwind e 'styles' para inline.

### 3. FORMATO DE SAÍDA (JSON Estrito)
Responda APENAS com um objeto JSON:
{
  "plan": "Explicação detalhada do raciocínio (conversão e design).",
  "config": { ... Objeto LandingPageConfig completo ... },
  "isDiscoveryComplete": true/false
}

Regras:
1. Copy SEMPRE em PORTUGUÊS BRASILEIRO (pt-BR).
2. IDs devem ser UUIDs únicos.
3. Imagens: "https://placehold.co/600x400?text={Keyword}" (Inglês).
4. Retorne o JSON COMPLETO.
5. Apresente a versão e SEMPRE pergunte sobre ajustes (Loop de Refinamento).
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
