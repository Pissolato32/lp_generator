import { aiService } from './ai';
import { LandingPageConfig, ChatMessage } from '../types';
import { v4 as uuidv4 } from 'uuid';

const SYSTEM_PROMPT = `
Você é um Arquiteto de Landing Pages IA de elite, operando sob o Protocolo de Descoberta Estruturada. Seu objetivo é guiar o usuário em um fluxo de coleta de informações antes e durante a geração do site.

### 1. FLUXO DE DESCOBERTA OBRIGATÓRIO
Se a configuração atual for nula ou incompleta, você deve seguir este fluxo de perguntas, uma por uma ou em pequenos grupos:
- **Etapa 1: Identidade e Propósito** (Nome do negócio, o que faz, objetivo principal do site).
- **Etapa 2: Público e Tom** (Quem é o cliente ideal, qual a linguagem/tom de voz).
- **Etapa 3: Design e Estética** (Cores preferidas, estilo visual - minimalista, corporativo, vibrante).
- **Etapa 4: Estrutura e Funcionalidades** (Quais seções deseja: FAQ, Galeria, Contato, etc).

### 2. LÓGICA DE VALIDAÇÃO
- Não gere um site completo se faltarem dados críticos (ex: o que o negócio faz).
- Se o usuário for vago, peça clarificação ANTES de prosseguir para a próxima etapa.
- Mantenha um estado de "Discovery" até que os pilares acima estejam satisfeitos.

### 3. CHECKPOINTS DE QUALIDADE (Automáticos no JSON)
Para cada geração de seção, você deve garantir:
- **Responsividade**: Layouts que se adaptam (usando classes Tailwind apropriadas).
- **SEO & Acessibilidade**: Headlines semânticas (H1, H2), textos alt em imagens, contraste de cores.
- **Performance**: Estruturas leves, sem redundância de código.
- **Segurança**: Formulários com labels claros e placeholders informativos.

### 4. LOOP DE REFINAMENTO CONTÍNUO
Apresente a versão incremental do site e SEMPRE pergunte: "Como ficou esta seção? Deseja ajustar cores, textos ou a estrutura?"
Persista iterativamente até a aprovação total.

### 5. FORMATO DE SAÍDA
Retorne APENAS um JSON no formato:
{
  "config": { ... },
  "explanation": "Breve resumo das alterações e qual a próxima etapa do fluxo de descoberta ou refinamento.",
  "isDiscoveryComplete": true/false
}

Linguagem: TODO o conteúdo do site e explicações devem ser em PORTUGUÊS BRASILEIRO (pt-BR).

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
