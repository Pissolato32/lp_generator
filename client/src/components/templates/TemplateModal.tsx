import { useState, useMemo } from 'react';
import { Sparkles, X } from 'lucide-react';
import { templatePresets, type TemplatePreset } from '../../utils/templatePresets';
import { useLPContext } from '../../context/LPContext';
import { LandingPageConfig } from '../../types';

interface TemplateModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function TemplateModal({ isOpen, onClose }: TemplateModalProps) {
    const { dispatch } = useLPContext();
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    const filteredTemplates = useMemo(() => {
        return selectedCategory === 'all'
            ? templatePresets
            : templatePresets.filter((t) => t.businessType === selectedCategory);
    }, [selectedCategory]);

    if (!isOpen) return null;

    const categories = [
        { id: 'all', name: 'Todos', icon: '🎯' },
        { id: 'saas', name: 'SaaS', icon: '💻' },
        { id: 'ecommerce', name: 'E-commerce', icon: '🛍️' },
        { id: 'coaching', name: 'Coaching', icon: '🎓' },
        { id: 'lead-magnet', name: 'Lead Magnet', icon: '🎁' },
        { id: 'webinar', name: 'Webinar', icon: '📺' },
    ];

    const handleSelectTemplate = (template: TemplatePreset) => {
        if (confirm(`Deseja aplicar o template "${template.name}"? Isso substituirá sua configuração atual.`)) {
            const newConfig = {
                ...template.config,
                id: crypto.randomUUID(),
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            dispatch({ type: 'LOAD_CONFIG', payload: newConfig as LandingPageConfig });
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden animate-scale-in">
                {/* Header */}
                <div className="bg-linear-to-r from-blue-600 to-purple-600 p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Sparkles size={28} />
                            <div>
                                <h2 className="text-2xl font-bold">Templates Profissionais</h2>
                                <p className="text-blue-100 text-sm">Comece com um modelo otimizado para seu negócio</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Category Filter */}
                <div className="border-b border-gray-200 p-4 bg-gray-50">
                    <div className="flex gap-2 overflow-x-auto">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${selectedCategory === cat.id
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'bg-white text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                {cat.icon} {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Templates Grid */}
                <div className="p-6 overflow-y-auto max-h-[60vh]">
                    <div className="grid md:grid-cols-2 gap-4">
                        {filteredTemplates.map((template) => (
                            <div
                                key={template.id}
                                className="border-2 border-gray-200 rounded-xl p-5 hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer group"
                                onClick={() => handleSelectTemplate(template)}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                        {template.name}
                                    </h3>
                                    <div
                                        className="w-8 h-8 rounded-full"
                                        style={{ backgroundColor: template.config.design?.primaryColor }}
                                    />
                                </div>
                                <p className="text-sm text-gray-600 mb-4">{template.description}</p>

                                {/* Preview */}
                                <div className="bg-gray-100 rounded-lg p-3 text-xs space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                                        <span className="text-gray-700 font-medium">
                                            {template.config.sections?.[0]?.type === 'hero'
                                                ? template.config.sections[0].headline
                                                : 'Headline'}
                                        </span>
                                    </div>
                                    <div className="text-gray-500 line-clamp-2">
                                        {template.config.sections?.[0]?.type === 'hero'
                                            ? template.config.sections[0].subheadline
                                            : 'Subheadline'}
                                    </div>
                                    <div
                                        className="inline-block px-3 py-1 rounded text-white font-medium"
                                        style={{ backgroundColor: template.config.design?.primaryColor }}
                                    >
                                        {template.config.sections?.[0]?.type === 'hero'
                                            ? template.config.sections[0].ctaText
                                            : 'CTA'}
                                    </div>
                                </div>

                                <button className="mt-4 w-full py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors opacity-0 group-hover:opacity-100">
                                    Usar Este Template
                                </button>
                            </div>
                        ))}
                    </div>

                    {filteredTemplates.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500">Nenhum template encontrado nesta categoria</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 p-4 bg-gray-50 flex justify-between items-center">
                    <p className="text-sm text-gray-600">
                        💡 Dica: Você pode personalizar qualquer template depois de aplicá-lo
                    </p>
                    <button
                        onClick={onClose}
                        className="px-6 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
}
