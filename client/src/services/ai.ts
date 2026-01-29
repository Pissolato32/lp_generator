import { LandingPageConfig, Section, HeroSection, SocialProofSection, FAQSection, PricingSection, FooterSection } from '../types';

export interface UserInput {
    productName: string;
    productDescription: string;
    targetAudience: string;
    goal: 'lead' | 'sales' | 'branding';
    tone: 'formal' | 'informal' | 'aggressive' | 'minimalist';
}

export async function generateLPConfig(input: UserInput): Promise<LandingPageConfig> {
    // Simulate AI delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const { productName, productDescription, tone } = input;

    // Helper to generate IDs
    const uuid = () => crypto.randomUUID();

    // Tone adjustments (simple implementation)
    const isAggressive = tone === 'aggressive';
    const isFormal = tone === 'formal';

    // Generate Hero Section
    const hero: HeroSection = {
        id: uuid(),
        type: 'hero',
        order: 0,
        variant: 'full-width',
        headline: isAggressive
            ? `PARE DE PERDER DINHEIRO. USE O ${productName.toUpperCase()} AGORA.`
            : `Transforme sua vida com ${productName}`,
        subheadline: productDescription,
        ctaText: isAggressive ? 'COMPRAR AGORA' : 'Começar Gratuitamente',
        showForm: input.goal === 'lead',
        formFields: input.goal === 'lead' ? [
            {
                id: uuid(),
                type: 'email',
                label: 'Seu melhor e-mail',
                placeholder: 'exemplo@email.com',
                required: true
            }
        ] : [],
    };

    // Generate Social Proof
    const socialProof: SocialProofSection = {
        id: uuid(),
        type: 'social-proof',
        order: 1,
        showRatings: true,
        testimonials: [
            {
                id: uuid(),
                name: 'Maria Silva',
                role: 'Empreendedora',
                content: `O ${productName} mudou completamente a forma como trabalho. Recomendo demais!`,
                rating: 5
            },
            {
                id: uuid(),
                name: 'Carlos Santos',
                role: 'Marketing Digital',
                content: 'Simples, direto e eficiente. Exatamente o que eu precisava.',
                rating: 5
            }
        ]
    };

    // Generate FAQ
    const faq: FAQSection = {
        id: uuid(),
        type: 'faq',
        order: 2,
        items: [
            {
                id: uuid(),
                question: `O que é o ${productName}?`,
                answer: productDescription
            },
            {
                id: uuid(),
                question: 'Tem garantia?',
                answer: 'Sim, oferecemos 7 dias de garantia incondicional.'
            },
            {
                id: uuid(),
                question: 'Como recebo acesso?',
                answer: 'O acesso é enviado imediatamente para o seu e-mail após a confirmação.'
            }
        ]
    };

    // Generate Pricing (if sales)
    const sections: Section[] = [hero, socialProof, faq];

    if (input.goal === 'sales') {
        const pricing: PricingSection = {
            id: uuid(),
            type: 'pricing',
            order: 3,
            tiers: [
                {
                    id: uuid(),
                    name: 'Básico',
                    price: 'R$ 97',
                    period: 'único',
                    features: ['Acesso ao produto', 'Suporte básico'],
                    ctaText: 'Comprar Básico',
                    highlighted: false
                },
                {
                    id: uuid(),
                    name: 'Premium',
                    price: 'R$ 197',
                    period: 'único',
                    features: ['Acesso completo', 'Suporte VIP', 'Mentoria mensal'],
                    ctaText: 'Comprar Premium',
                    highlighted: true
                }
            ]
        };
        sections.splice(2, 0, pricing); // Insert before FAQ
    }

    // Generate Footer
    const footer: FooterSection = {
        id: uuid(),
        type: 'footer',
        order: 99,
        copyrightText: `© ${new Date().getFullYear()} ${productName}. Todos os direitos reservados.`,
        legalLinks: [
            { text: 'Termos de Uso', url: '#' },
            { text: 'Privacidade', url: '#' }
        ]
    };
    sections.push(footer);

    // Re-index orders
    sections.forEach((s, i) => s.order = i);

    return {
        id: uuid(),
        name: `LP - ${productName}`,
        sections,
        design: {
            primaryColor: isFormal ? '#1e293b' : '#3b82f6',
            secondaryColor: isFormal ? '#64748b' : '#8b5cf6',
            fontFamily: 'Inter',
            buttonStyle: 'rounded'
        },
        integrations: {},
        createdAt: new Date(),
        updatedAt: new Date()
    };
}
