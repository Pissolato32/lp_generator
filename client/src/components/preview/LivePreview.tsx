import { useMemo } from 'react';
import type { Section } from '../../types';
import { HeroSection } from '../sections/HeroSection';
import { SocialProofSection } from '../sections/SocialProofSection';
import { ContactSection } from '../sections/ContactSection';
import { FeaturesSection } from '../sections/FeaturesSection';
import { GallerySection } from '../sections/GallerySection';
import { CarouselSection } from '../sections/CarouselSection';

interface LivePreviewProps {
    sections: Section[];
    primaryColor: string;
    onSectionClick?: (sectionId: string) => void;
}

export function LivePreview({ sections, primaryColor, onSectionClick }: LivePreviewProps) {
    const sortedSections = useMemo(() => {
        if (!sections || !Array.isArray(sections)) return [];
        return [...sections].sort((a, b) => a.order - b.order);
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
                            <div className="py-20 px-4 bg-white border-b border-gray-100">
                                <div className="max-w-3xl mx-auto">
                                    <h2 className="text-3xl font-bold text-center mb-12">Perguntas Frequentes</h2>
                                    <div className="space-y-6">
                                        {(section as any).items?.map((item: any) => (
                                            <div key={item.id} className="border-b border-gray-100 pb-4">
                                                <h3 className="text-lg font-semibold mb-2">{item.question}</h3>
                                                <p className="text-gray-600">{item.answer}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {section.type === 'pricing' && (
                            <div className="py-20 px-4 bg-gray-50 border-b border-gray-100">
                                <div className="max-w-7xl mx-auto text-center">
                                    <h2 className="text-4xl font-bold mb-12">Nossos Planos</h2>
                                    <div className="grid md:grid-cols-3 gap-8">
                                        {(section as any).tiers?.map((tier: any) => (
                                            <div key={tier.id} className={`p-8 rounded-2xl bg-white shadow-sm border-2 ${tier.highlighted ? 'border-blue-500 scale-105' : 'border-transparent'}`}>
                                                <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
                                                <div className="text-3xl font-bold mb-4">{tier.price}<span className="text-sm text-gray-500 font-normal">{tier.period}</span></div>
                                                <ul className="text-left space-y-3 mb-8">
                                                    {tier.features?.map((f: string, i: number) => (
                                                        <li key={i} className="flex items-center gap-2 text-gray-600">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                                            {f}
                                                        </li>
                                                    ))}
                                                </ul>
                                                <button className="w-full py-3 rounded-lg font-bold text-white transition-colors" style={{ backgroundColor: primaryColor }}>
                                                    {tier.ctaText}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
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

                        {section.type === 'footer' && (
                            <footer className="py-12 px-4 bg-gray-900 text-white">
                                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center">
                                    <div>
                                        <p className="text-gray-400">{(section as any).copyrightText}</p>
                                    </div>
                                    <div className="flex gap-4 md:justify-end">
                                        {(section as any).socialLinks?.map((link: any, i: number) => (
                                            <a key={i} href={link.url} className="text-gray-400 hover:text-white transition-colors">
                                                {link.platform}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </footer>
                        )}

                        {/* Fallback para tipos não mapeados ou renderização vazia */}
                        {!['hero', 'social-proof', 'faq', 'pricing', 'contact', 'features', 'gallery', 'carousel', 'footer'].includes(section.type) && (
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
        footer: 'Rodapé',
    };
    return labels[type] || type;
}
