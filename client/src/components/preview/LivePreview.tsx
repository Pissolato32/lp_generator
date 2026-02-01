import { useMemo } from 'react';
import type { Section } from '../../types';
import { HeroSection } from '../sections/HeroSection';
import { SocialProofSection } from '../sections/SocialProofSection';
import { ContactSection } from '../sections/ContactSection';
import { FeaturesSection } from '../sections/FeaturesSection';
import { GallerySection } from '../sections/GallerySection';
import { CarouselSection } from '../sections/CarouselSection';
import { TestimonialsSection } from '../sections/TestimonialsSection';
import { CtaSection } from '../sections/CtaSection';
import { FaqSection } from '../sections/FaqSection';
import { PricingSection } from '../sections/PricingSection';
import { FooterSection } from '../sections/FooterSection';

interface LivePreviewProps {
    sections: Section[];
    primaryColor: string;
    onSectionClick?: (sectionId: string) => void;
}

export function LivePreview({ sections, primaryColor, onSectionClick }: LivePreviewProps) {
    const sortedSections = useMemo(() => {
        if (!sections || !Array.isArray(sections)) return [];
        
        // Normaliza os tipos das seções caso a IA use nomes de interfaces
        const normalized = sections.map(s => ({
            ...s,
            type: s.type.replace(/Section$/i, '').toLowerCase() as any
        }));

        return [...normalized].sort((a, b) => a.order - b.order);
    }, [sections]);

    return (
        <div className="w-full h-full overflow-y-auto bg-white">
            {!sortedSections || sortedSections.length === 0 ? (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-400 mb-2">
                            Nenhuma seção adicionada
                        </h2>
                        <p className="text-gray-500">
                            Adicione seções usando o painel lateral
                        </p>
                    </div>
                </div>
            ) : (
                sortedSections.map((section) => (
                    <div
                        key={section.id}
                        onClick={() => onSectionClick?.(section.id)}
                        className="cursor-pointer hover:ring-4 hover:ring-blue-400 transition-all relative group"
                    >
                        {/* Section type indicator */}
                        <div className="absolute top-4 left-4 z-20 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                            {getSectionLabel(section.type)}
                        </div>

                        {section.type === 'hero' && (
                            <HeroSection section={section as any} primaryColor={primaryColor} />
                        )}

                        {section.type === 'social-proof' && (
                            <SocialProofSection section={section as any} primaryColor={primaryColor} />
                        )}

                        {section.type === 'faq' && (
                            <FaqSection section={section as any} primaryColor={primaryColor} />
                        )}

                        {section.type === 'pricing' && (
                            <PricingSection section={section as any} primaryColor={primaryColor} />
                        )}

                        {section.type === 'contact' && (
                            <ContactSection section={section as any} primaryColor={primaryColor} />
                        )}

                        {section.type === 'features' && (
                            <FeaturesSection section={section as any} primaryColor={primaryColor} />
                        )}

                        {section.type === 'gallery' && (
                            <GallerySection section={section as any} primaryColor={primaryColor} />
                        )}

                        {section.type === 'carousel' && (
                            <CarouselSection section={section as any} primaryColor={primaryColor} />
                        )}

                        {section.type === 'testimonials' && (
                            <TestimonialsSection section={section as any} primaryColor={primaryColor} />
                        )}

                        {section.type === 'cta' && (
                            <CtaSection section={section as any} primaryColor={primaryColor} />
                        )}

                        {section.type === 'footer' && (
                            <FooterSection section={section as any} primaryColor={primaryColor} />
                        )}

                        {/* Fallback para tipos não mapeados ou renderização vazia */}
                        {!['hero', 'social-proof', 'faq', 'pricing', 'contact', 'features', 'gallery', 'carousel', 'testimonials', 'cta', 'footer'].includes(section.type) && (
                            <div className="py-20 px-4 bg-gray-50 border-2 border-dashed border-gray-200 text-center">
                                <p className="text-gray-400 font-medium">Seção do tipo "{section.type}" ainda não visualizada</p>
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
}

function getSectionLabel(type: string): string {
    const labels: Record<string, string> = {
        hero: 'Hero',
        'social-proof': 'Prova Social',
        faq: 'FAQ',
        pricing: 'Preços',
        contact: 'Contato',
        features: 'Destaques',
        gallery: 'Galeria',
        carousel: 'Banner/Slide',
        testimonials: 'Depoimentos',
        cta: 'Chamada para Ação',
        footer: 'Rodapé',
    };
    return labels[type] || type;
}
