import { useCallback } from 'react';
import { useLPContext } from '../context/LPContext';
import type { Section, SectionType, HeroSection, DesignConfig, IntegrationConfig } from '../types';

export function useLPEditor() {
    const { state, dispatch } = useLPContext();

    const addSection = useCallback((type: SectionType) => {
        const newSection = createDefaultSection(type, state.config.sections.length);
        dispatch({ type: 'ADD_SECTION', payload: newSection });
        return newSection.id;
    }, [dispatch, state.config.sections.length]);

    const updateSection = useCallback((id: string, updates: Partial<Section>) => {
        dispatch({ type: 'UPDATE_SECTION', payload: { id, updates } });
    }, [dispatch]);

    const deleteSection = useCallback((id: string) => {
        dispatch({ type: 'DELETE_SECTION', payload: id });
    }, [dispatch]);

    const moveSection = useCallback((fromIndex: number, toIndex: number) => {
        dispatch({ type: 'MOVE_SECTION', payload: { fromIndex, toIndex } });
    }, [dispatch]);

    const updateDesign = useCallback((updates: Partial<DesignConfig>) => {
        dispatch({ type: 'UPDATE_DESIGN', payload: updates });
    }, [dispatch]);

    const updateIntegrations = useCallback((updates: Partial<IntegrationConfig>) => {
        dispatch({ type: 'UPDATE_INTEGRATIONS', payload: updates });
    }, [dispatch]);

    return {
        config: state.config,
        addSection,
        updateSection,
        deleteSection,
        moveSection,
        updateDesign,
        updateIntegrations,
    };
}

function createDefaultSection(type: SectionType, order: number): Section {
    const baseSection = {
        id: crypto.randomUUID(),
        type,
        order,
    };

    switch (type) {
        case 'hero':
            return {
                ...baseSection,
                type: 'hero',
                variant: 'full-width',
                headline: 'Transforme Seu Negócio Hoje',
                subheadline: 'Descubra a solução que vai revolucionar seus resultados',
                ctaText: 'Começar Agora',
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
            } as HeroSection;

        case 'social-proof':
            return {
                ...baseSection,
                type: 'social-proof',
                testimonials: [
                    {
                        id: crypto.randomUUID(),
                        name: 'João Silva',
                        role: 'CEO, Empresa X',
                        content: 'Esta solução transformou completamente nosso negócio!',
                        rating: 5,
                    },
                ],
                showRatings: true,
            };

        case 'faq':
            return {
                ...baseSection,
                type: 'faq',
                items: [
                    {
                        id: crypto.randomUUID(),
                        question: 'Como funciona?',
                        answer: 'Nossa solução é simples e intuitiva...',
                    },
                ],
            };

        case 'pricing':
            return {
                ...baseSection,
                type: 'pricing',
                tiers: [
                    {
                        id: crypto.randomUUID(),
                        name: 'Básico',
                        price: 'R$ 97',
                        period: '/mês',
                        features: ['Feature 1', 'Feature 2', 'Feature 3'],
                        ctaText: 'Começar',
                        highlighted: false,
                    },
                    {
                        id: crypto.randomUUID(),
                        name: 'Pro',
                        price: 'R$ 197',
                        period: '/mês',
                        features: ['Tudo do Básico', 'Feature 4', 'Feature 5', 'Suporte Premium'],
                        ctaText: 'Começar',
                        highlighted: true,
                    },
                ],
            };

        case 'footer':
            return {
                ...baseSection,
                type: 'footer',
                copyrightText: '© 2026 Sua Empresa. Todos os direitos reservados.',
                socialLinks: [],
                legalLinks: [
                    { text: 'Política de Privacidade', url: '#' },
                    { text: 'Termos de Uso', url: '#' },
                ],
            };

        default:
            throw new Error('Unknown section type');
    }
}
