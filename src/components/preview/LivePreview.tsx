import type { Section } from '../../types';
import { HeroSection } from '../sections/HeroSection';
import { SocialProofSection } from '../sections/SocialProofSection';

interface LivePreviewProps {
    sections: Section[];
    primaryColor: string;
    onSectionClick?: (sectionId: string) => void;
}

export function LivePreview({ sections, primaryColor, onSectionClick }: LivePreviewProps) {
    const sortedSections = [...sections].sort((a, b) => a.order - b.order);

    return (
        <div className="w-full h-full overflow-y-auto bg-white">
            {sortedSections.length === 0 ? (
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
                            <HeroSection section={section} primaryColor={primaryColor} />
                        )}

                        {section.type === 'social-proof' && (
                            <SocialProofSection section={section} primaryColor={primaryColor} />
                        )}

                        {section.type === 'faq' && (
                            <div className="min-h-[400px] bg-white flex items-center justify-center">
                                <p className="text-gray-500">FAQ Section (Em desenvolvimento)</p>
                            </div>
                        )}

                        {section.type === 'pricing' && (
                            <div className="min-h-[400px] bg-gray-50 flex items-center justify-center">
                                <p className="text-gray-500">Pricing Section (Em desenvolvimento)</p>
                            </div>
                        )}

                        {section.type === 'footer' && (
                            <div className="min-h-[200px] bg-gray-900 flex items-center justify-center">
                                <p className="text-gray-400">Footer Section (Em desenvolvimento)</p>
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
        footer: 'Rodapé',
    };
    return labels[type] || type;
}
