import { useMemo } from 'react';
import type { 
    Section, 
    SectionType,
    HeroSection as HeroSectionType,
    SocialProofSection as SocialProofSectionType,
    FAQSection as FAQSectionType,
    PricingSection as PricingSectionType,
    ContactSection as ContactSectionType,
    FeaturesSection as FeaturesSectionType,
    GallerySection as GallerySectionType,
    CarouselSection as CarouselSectionType,
    TestimonialsSection as TestimonialsSectionType,
    CtaSection as CtaSectionType,
    FooterSection as FooterSectionType,
} from '../../types';
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

// Normalize AI-generated section types (e.g., "HeroSection" -> "hero")
function normalizeType(type: string): SectionType {
    const normalized = type.replace(/Section$/i, '').toLowerCase();
    const validTypes: Record<string, SectionType> = {
        'hero': 'hero',
        'social-proof': 'social-proof',
        'socialproof': 'social-proof',
        'faq': 'faq',
        'pricing': 'pricing',
        'contact': 'contact',
        'features': 'features',
        'gallery': 'gallery',
        'carousel': 'carousel',
        'testimonials': 'testimonials',
        'cta': 'cta',
        'footer': 'footer',
    };
    return validTypes[normalized] ?? (normalized as SectionType);
}

export function LivePreview({ sections, primaryColor, onSectionClick }: LivePreviewProps) {
    const sortedSections = useMemo(() => {
        if (!sections || !Array.isArray(sections)) return [];

        // Normalize section types and sort by order
        return sections
            .map(s => {
                const normalizedType = normalizeType(s.type);
                return normalizedType === s.type ? s : { ...s, type: normalizedType };
            })
            .sort((a, b) => a.order - b.order);
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
                            <HeroSection section={section as HeroSectionType} primaryColor={primaryColor} />
                        )}

                        {section.type === 'social-proof' && (
                            <SocialProofSection section={section as SocialProofSectionType} primaryColor={primaryColor} />
                        )}

                        {section.type === 'faq' && (
                            <FaqSection section={section as FAQSectionType} primaryColor={primaryColor} />
                        )}

                        {section.type === 'pricing' && (
                            <PricingSection section={section as PricingSectionType} primaryColor={primaryColor} />
                        )}

                        {section.type === 'contact' && (
                            <ContactSection section={section as ContactSectionType} primaryColor={primaryColor} />
                        )}

                        {section.type === 'features' && (
                            <FeaturesSection section={section as FeaturesSectionType} primaryColor={primaryColor} />
                        )}

                        {section.type === 'gallery' && (
                            <GallerySection section={section as GallerySectionType} primaryColor={primaryColor} />
                        )}

                        {section.type === 'carousel' && (
                            <CarouselSection section={section as CarouselSectionType} primaryColor={primaryColor} />
                        )}

                        {section.type === 'testimonials' && (
                            <TestimonialsSection section={section as TestimonialsSectionType} primaryColor={primaryColor} />
                        )}

                        {section.type === 'cta' && (
                            <CtaSection section={section as CtaSectionType} primaryColor={primaryColor} />
                        )}

                        {section.type === 'footer' && (
                            <FooterSection section={section as FooterSectionType} primaryColor={primaryColor} />
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
