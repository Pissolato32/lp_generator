import type { LandingPageConfig, HeroSection } from '../types';

export type BusinessType = 'saas' | 'ecommerce' | 'coaching' | 'lead-magnet' | 'webinar';

export interface TemplatePreset {
    id: string;
    name: string;
    businessType: BusinessType;
    description: string;
    config: Partial<LandingPageConfig>;
}

export const templatePresets: TemplatePreset[] = [
    {
        id: 'saas-startup',
        name: 'SaaS Startup',
        businessType: 'saas',
        description: 'Perfeito para produtos SaaS, apps e ferramentas online',
        config: {
            name: 'SaaS Landing Page',
            design: {
                primaryColor: '#0ea5e9',
                secondaryColor: '#8b5cf6',
                fontFamily: 'Inter',
                buttonStyle: 'rounded',
            },
            sections: [
                {
                    id: crypto.randomUUID(),
                    type: 'hero',
                    order: 0,
                    variant: 'split',
                    headline: 'Automatize Seu Trabalho em Minutos',
                    subheadline: 'A ferramenta que economiza 10 horas por semana da sua equipe',
                    ctaText: 'Começar Teste Grátis',
                    showForm: true,
                    formFields: [
                        {
                            id: crypto.randomUUID(),
                            type: 'email',
                            label: 'Email',
                            placeholder: 'seu@email.com',
                            required: true,
                        },
                    ],
                } as HeroSection,
            ],
            integrations: {
                webhookUrl: '',
            },
        },
    },
    {
        id: 'ecommerce-product',
        name: 'E-commerce Produto',
        businessType: 'ecommerce',
        description: 'Ideal para vendas de produtos físicos ou digitais',
        config: {
            name: 'Produto Landing Page',
            design: {
                primaryColor: '#f97316',
                secondaryColor: '#10b981',
                fontFamily: 'Inter',
                buttonStyle: 'pill',
            },
            sections: [
                {
                    id: crypto.randomUUID(),
                    type: 'hero',
                    order: 0,
                    variant: 'full-width',
                    headline: 'O Produto Que Vai Transformar Sua Rotina',
                    subheadline: 'Mais de 10.000 clientes satisfeitos. Garantia de 30 dias.',
                    ctaText: 'Comprar Agora',
                    ctaUrl: '#checkout',
                    showForm: false,
                } as HeroSection,
            ],
            integrations: {
                webhookUrl: '',
            },
        },
    },
    {
        id: 'coaching-course',
        name: 'Coaching & Cursos',
        businessType: 'coaching',
        description: 'Para coaches, consultores e criadores de cursos',
        config: {
            name: 'Curso Landing Page',
            design: {
                primaryColor: '#fbbf24',
                secondaryColor: '#1e40af',
                fontFamily: 'Inter',
                buttonStyle: 'rounded',
            },
            sections: [
                {
                    id: crypto.randomUUID(),
                    type: 'hero',
                    order: 0,
                    variant: 'vsl',
                    headline: 'Domine [Habilidade] em 90 Dias',
                    subheadline: 'O método passo a passo que já transformou a vida de +5.000 alunos',
                    ctaText: 'Quero Me Inscrever',
                    videoUrl: '',
                    showForm: true,
                    formFields: [
                        {
                            id: crypto.randomUUID(),
                            type: 'text',
                            label: 'Nome',
                            placeholder: 'Seu nome completo',
                            required: true,
                        },
                        {
                            id: crypto.randomUUID(),
                            type: 'email',
                            label: 'Email',
                            placeholder: 'seu@email.com',
                            required: true,
                        },
                    ],
                } as HeroSection,
            ],
            integrations: {
                webhookUrl: '',
            },
        },
    },
    {
        id: 'lead-magnet',
        name: 'Lead Magnet',
        businessType: 'lead-magnet',
        description: 'Para captura de leads com ebooks, guias e checklists',
        config: {
            name: 'Lead Magnet Landing Page',
            design: {
                primaryColor: '#0ea5e9',
                secondaryColor: '#d946ef',
                fontFamily: 'Inter',
                buttonStyle: 'rounded',
            },
            sections: [
                {
                    id: crypto.randomUUID(),
                    type: 'hero',
                    order: 0,
                    variant: 'split',
                    headline: 'Baixe Grátis: [Nome do Material]',
                    subheadline: 'O guia completo que vai te ensinar [benefício principal]',
                    ctaText: 'Quero Receber Grátis',
                    showForm: true,
                    formFields: [
                        {
                            id: crypto.randomUUID(),
                            type: 'text',
                            label: 'Nome',
                            placeholder: 'Seu nome',
                            required: true,
                        },
                        {
                            id: crypto.randomUUID(),
                            type: 'email',
                            label: 'Email',
                            placeholder: 'seu@email.com',
                            required: true,
                        },
                    ],
                } as HeroSection,
            ],
            integrations: {
                webhookUrl: '',
            },
        },
    },
    {
        id: 'webinar-registration',
        name: 'Webinar',
        businessType: 'webinar',
        description: 'Para inscrições em webinars e eventos online',
        config: {
            name: 'Webinar Landing Page',
            design: {
                primaryColor: '#dc2626',
                secondaryColor: '#fbbf24',
                fontFamily: 'Inter',
                buttonStyle: 'pill',
            },
            sections: [
                {
                    id: crypto.randomUUID(),
                    type: 'hero',
                    order: 0,
                    variant: 'full-width',
                    headline: 'Webinar Gratuito: [Tema]',
                    subheadline: 'Descubra como [benefício] em apenas 60 minutos',
                    ctaText: 'Garantir Minha Vaga',
                    showForm: true,
                    formFields: [
                        {
                            id: crypto.randomUUID(),
                            type: 'text',
                            label: 'Nome',
                            placeholder: 'Seu nome completo',
                            required: true,
                        },
                        {
                            id: crypto.randomUUID(),
                            type: 'email',
                            label: 'Email',
                            placeholder: 'seu@email.com',
                            required: true,
                        },
                    ],
                } as HeroSection,
            ],
            integrations: {
                webhookUrl: '',
            },
        },
    },
];

export function getTemplateByBusinessType(businessType: BusinessType): TemplatePreset[] {
    return templatePresets.filter((t) => t.businessType === businessType);
}

export function getTemplateById(id: string): TemplatePreset | undefined {
    return templatePresets.find((t) => t.id === id);
}
