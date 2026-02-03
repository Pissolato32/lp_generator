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

        // Sanitize the data to match expected schema
        const sanitizedConfig = this.sanitizeConfigData(configRaw);

        // 2. Validate with Zod
        // Ensure required fields if missing before validation to help the AI (optional, but good for robustness)
        if (!sanitizedConfig.id) sanitizedConfig.id = uuidv4();
        if (!sanitizedConfig.name) sanitizedConfig.name = 'Nova Landing Page';
        if (!sanitizedConfig.createdAt) sanitizedConfig.createdAt = new Date().toISOString();
        if (!sanitizedConfig.updatedAt) sanitizedConfig.updatedAt = new Date().toISOString();
        if (!sanitizedConfig.design) sanitizedConfig.design = {
          primaryColor: '#3b82f6',
          secondaryColor: '#8b5cf6',
          fontFamily: 'Inter',
          buttonStyle: 'rounded'
        };
        if (!sanitizedConfig.integrations) sanitizedConfig.integrations = {};

        const validation = LandingPageConfigSchema.safeParse(sanitizedConfig);

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

  private sanitizeConfigData(config: any): any {
    const sanitized = JSON.parse(JSON.stringify(config)); // Deep clone

    // Sanitize name
    if (!sanitized.name || typeof sanitized.name !== 'string') {
      sanitized.name = 'Nova Landing Page';
    }

    // Sanitize sections
    if (sanitized.sections && Array.isArray(sanitized.sections)) {
      sanitized.sections = sanitized.sections.map((section: any) => {
        // Ensure section has required fields
        if (!section.id) section.id = uuidv4();
        if (!section.type) section.type = 'hero';
        if (typeof section.order !== 'number') section.order = 0;

        // Sanitize specific section types
        switch (section.type) {
          case 'hero':
            // Validate variant
            const validHeroVariants = ['full-width', 'split', 'video-bg', 'vsl'];
            if (!validHeroVariants.includes(section.variant)) {
              section.variant = 'full-width'; // Default to valid variant
            }
            // Ensure showForm exists
            if (typeof section.showForm !== 'boolean') {
              section.showForm = false;
            }
            break;

          case 'gallery':
            // Convert string images to objects if needed
            if (section.images && Array.isArray(section.images)) {
              section.images = section.images.map((img: any) => {
                if (typeof img === 'string') {
                  return {
                    id: uuidv4(),
                    url: img,
                    alt: 'Image',
                    caption: ''
                  };
                } else if (typeof img === 'object' && img.url) {
                  if (!img.id) img.id = uuidv4();
                  if (!img.alt) img.alt = 'Image';
                  if (!img.caption) img.caption = '';
                  return img;
                }
                return {
                  id: uuidv4(),
                  url: 'https://placehold.co/400x300?text=Placeholder',
                  alt: 'Placeholder',
                  caption: ''
                };
              });
            }
            break;

          case 'contact':
            // Sanitize form fields
            if (section.formFields && Array.isArray(section.formFields)) {
              section.formFields = section.formFields.map((field: any) => {
                if (typeof field === 'object') {
                  if (!field.id) field.id = uuidv4();
                  if (!field.label) field.label = 'Field';
                  if (!field.placeholder) field.placeholder = 'Enter value';
                  if (typeof field.required !== 'boolean') field.required = false;
                  if (!field.type) field.type = 'text';
                  return field;
                }
                return {
                  id: uuidv4(),
                  type: 'text',
                  label: 'Field',
                  placeholder: 'Enter value',
                  required: false
                };
              });
            }
            break;

          case 'social-proof':
            // Sanitize testimonials and logos
            if (!section.testimonials || !Array.isArray(section.testimonials)) {
              section.testimonials = [];
            }
            if (!section.logos || !Array.isArray(section.logos)) {
              section.logos = [];
            }
            if (typeof section.showRatings !== 'boolean') {
              section.showRatings = true;
            }
            break;

          case 'features':
            // Sanitize items
            if (!section.items || !Array.isArray(section.items)) {
              section.items = [];
            }
            if (typeof section.columns !== 'number' || ![2, 3, 4].includes(section.columns)) {
              section.columns = 3;
            }
            break;

          case 'pricing':
            // Sanitize tiers
            if (!section.tiers || !Array.isArray(section.tiers)) {
              section.tiers = [];
            }
            break;

          case 'faq':
            // Sanitize items
            if (!section.items || !Array.isArray(section.items)) {
              section.items = [];
            }
            break;

          case 'carousel':
            // Sanitize items
            if (!section.items || !Array.isArray(section.items)) {
              section.items = [];
            }
            if (typeof section.autoPlay !== 'boolean') {
              section.autoPlay = true;
            }
            break;

          case 'testimonials':
            // Sanitize testimonials
            if (!section.testimonials || !Array.isArray(section.testimonials)) {
              section.testimonials = [];
            }
            break;

          case 'cta':
            if (typeof section.variant !== 'string') {
              section.variant = 'primary';
            }
            break;

          case 'footer':
            if (!section.socialLinks || !Array.isArray(section.socialLinks)) {
              section.socialLinks = [];
            }
            if (!section.legalLinks || !Array.isArray(section.legalLinks)) {
              section.legalLinks = [];
            }
            if (!section.copyrightText) {
              section.copyrightText = '© 2026 Your Company. All rights reserved.';
            }
            break;
        }

        return section;
      });
    }

    // Sanitize design
    if (!sanitized.design || typeof sanitized.design !== 'object') {
      sanitized.design = {
        primaryColor: '#3b82f6',
        secondaryColor: '#8b5cf6',
        fontFamily: 'Inter',
        buttonStyle: 'rounded'
      };
    } else {
      if (!sanitized.design.primaryColor) sanitized.design.primaryColor = '#3b82f6';
      if (!sanitized.design.secondaryColor) sanitized.design.secondaryColor = '#8b5cf6';
      if (!sanitized.design.fontFamily) sanitized.design.fontFamily = 'Inter';
      if (!sanitized.design.buttonStyle) sanitized.design.buttonStyle = 'rounded';
    }

    // Sanitize integrations
    if (!sanitized.integrations || typeof sanitized.integrations !== 'object') {
      sanitized.integrations = {};
    }

    return sanitized;
  }
}

export const hybridAgentService = new HybridAgentService();