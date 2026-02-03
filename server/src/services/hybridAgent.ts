import { aiService } from './ai';
import { LandingPageConfig, ChatMessage, SectionType } from '../types';
import { LandingPageConfigSchema } from '../schemas/landingPage';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { prebuiltBlockService } from './prebuiltBlocks';

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

export class HybridAgentService {
  async processRequest(
    message: string,
    history: ChatMessage[],
    currentConfig: LandingPageConfig | null,
    userKey?: string
  ): Promise<{ config: LandingPageConfig; explanation: string }> {
    // First, try to use pre-built blocks to satisfy the request
    const relevantBlocks = prebuiltBlockService.getRelevantBlocks(message);
    
    // If we have relevant pre-built blocks and no current config, use them as a base
    if (!currentConfig && relevantBlocks.length > 0) {
      console.log(`[HybridAgent] Found ${relevantBlocks.length} relevant pre-built blocks, using as base`);
      
      // Create a basic config with pre-built blocks
      const prebuiltConfig = this.createConfigFromBlocks(relevantBlocks, message);
      
      // If we have a good match, return early with pre-built config
      if (relevantBlocks.length >= 2) {
        return {
          config: prebuiltConfig,
          explanation: `Baseado em sua solicitação "${message}", criei uma landing page com ${relevantBlocks.length} seções pré-construídas.`
        };
      }
    }

    // If no pre-built blocks match well, or we need to modify an existing config,
    // fall back to AI for detailed customization
    return this.processWithAI(message, history, currentConfig, userKey);
  }

  private createConfigFromBlocks(blocks: any[], message: string): LandingPageConfig {
    // Create a basic config with pre-built sections
    const sections = blocks.map((block, index) => {
      const blockInstance = prebuiltBlockService.instantiateBlock(block, { order: index });
      return blockInstance;
    });

    return {
      id: uuidv4(),
      name: message.substring(0, 50) || 'Nova Landing Page',
      sections,
      design: {
        primaryColor: '#3b82f6',
        secondaryColor: '#8b5cf6',
        fontFamily: 'Inter',
        buttonStyle: 'rounded'
      },
      integrations: {},
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  private async processWithAI(
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
          console.log(`[HybridAgent] Retry attempt ${attempts + 1} due to validation error.`);
        }

        const response = await aiService.generateContent(currentPrompt, userKey);
        
        // Clean the response to extract JSON
        const cleanResponse = this.cleanJsonResponse(response);
        
        // 1. Parse JSON
        let result;
        try {
          result = JSON.parse(cleanResponse);
        } catch (e) {
          // Try to extract JSON from markdown-like content
          const jsonMatch = response.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            try {
              result = JSON.parse(jsonMatch[0]);
            } catch {
              throw new Error(`JSON Syntax Error: ${(e as Error).message}`);
            }
          } else {
            throw new Error(`JSON Syntax Error: ${(e as Error).message}`);
          }
        }

        // Handle legacy format or missing plan
        const configRaw = result.config || result;
        const explanation = result.plan || result.explanation || "Atualizei a landing page.";

        // 2. Validate with Zod
        // Ensure required fields if missing before validation to help the AI (optional, but good for robustness)
        if (!configRaw.id) configRaw.id = uuidv4();
        if (!configRaw.name) configRaw.name = 'Nova Landing Page';
        if (!configRaw.createdAt) configRaw.createdAt = new Date().toISOString();
        if (!configRaw.updatedAt) configRaw.updatedAt = new Date().toISOString();
        if (!configRaw.design) configRaw.design = {
          primaryColor: '#3b82f6',
          secondaryColor: '#8b5cf6',
          fontFamily: 'Inter',
          buttonStyle: 'rounded'
        };
        if (!configRaw.integrations) configRaw.integrations = {};

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
          console.error('[HybridAgent] Max attempts reached. Last error:', lastError);
          
          // If AI fails, try to use pre-built blocks as fallback
          const fallbackBlocks = prebuiltBlockService.getRelevantBlocks(message);
          if (fallbackBlocks.length > 0) {
            console.log(`[HybridAgent] Using fallback pre-built blocks after AI failure`);
            return {
              config: this.createConfigFromBlocks(fallbackBlocks, message),
              explanation: `Devido a um erro no processamento, criei uma landing page com blocos pré-construídos baseados em sua solicitação: "${message}".`
            };
          }
          
          throw new Error(`Não consegui gerar uma configuração válida após ${maxAttempts} tentativas. Erro: ${lastError}`);
        }
      }
    }

    throw new Error('Erro inesperado no loop do agente.');
  }
  
  private cleanJsonResponse(response: string): string {
    // Remove markdown code blocks
    let clean = response.replace(/```json/g, '').replace(/```/g, '').trim();
    
    // Try to find the JSON object
    const jsonStart = clean.indexOf('{');
    const jsonEnd = clean.lastIndexOf('}');
    
    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
      clean = clean.substring(jsonStart, jsonEnd + 1);
    }
    
    // Remove any trailing non-JSON content
    let braceCount = 0;
    let lastValidIndex = -1;
    for (let i = 0; i < clean.length; i++) {
      const char = clean[i];
      if (char === '{') {
        braceCount++;
      } else if (char === '}') {
        braceCount--;
        if (braceCount === 0) {
          lastValidIndex = i;
        }
      }
    }
    
    if (lastValidIndex !== -1) {
      clean = clean.substring(0, lastValidIndex + 1);
    }
    
    return clean.trim();
  }
}

export const hybridAgentService = new HybridAgentService();