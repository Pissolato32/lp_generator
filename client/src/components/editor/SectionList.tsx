import { useState, useMemo } from 'react';
import { Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { useLPEditor } from '../../hooks/useLPEditor';
import { SectionType, Section } from '../../types';

interface SectionListProps {
    onSectionSelect: (sectionId: string) => void;
    selectedSectionId?: string;
}

export function SectionList({ onSectionSelect, selectedSectionId }: SectionListProps) {
    const { config, addSection, deleteSection, moveSection } = useLPEditor();
    const [showAddMenu, setShowAddMenu] = useState(false);

    const handleAddSection = (type: SectionType) => {
        const newId = addSection(type);
        onSectionSelect(newId);
        setShowAddMenu(false);
    };

    const handleMoveUp = (index: number) => {
        if (index > 0) {
            moveSection(index, index - 1);
        }
    };

    const handleMoveDown = (index: number) => {
        if (index < config.sections.length - 1) {
            moveSection(index, index + 1);
        }
    };

    const sortedSections = useMemo(() => {
        return [...config.sections].sort((a, b) => a.order - b.order);
    }, [config.sections]);

    return (
        <div className="p-4 space-y-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Seções</h3>
                <button
                    onClick={() => setShowAddMenu(!showAddMenu)}
                    className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    title="Adicionar seção"
                >
                    <Plus size={20} />
                </button>
            </div>

            {/* Add Section Menu */}
            {showAddMenu && (
                <div className="bg-white border-2 border-blue-500 rounded-lg p-3 space-y-2 animate-scale-in">
                    <button
                        onClick={() => handleAddSection('hero')}
                        className="w-full text-left px-4 py-2 rounded hover:bg-blue-50 transition-colors"
                    >
                        🎯 Hero Section
                    </button>
                    <button
                        onClick={() => handleAddSection('social-proof')}
                        className="w-full text-left px-4 py-2 rounded hover:bg-blue-50 transition-colors"
                    >
                        ⭐ Prova Social
                    </button>
                    <button
                        onClick={() => handleAddSection('faq')}
                        className="w-full text-left px-4 py-2 rounded hover:bg-blue-50 transition-colors"
                    >
                        ❓ FAQ
                    </button>
                    <button
                        onClick={() => handleAddSection('pricing')}
                        className="w-full text-left px-4 py-2 rounded hover:bg-blue-50 transition-colors"
                    >
                        💰 Preços
                    </button>
                    <button
                        onClick={() => handleAddSection('footer')}
                        className="w-full text-left px-4 py-2 rounded hover:bg-blue-50 transition-colors"
                    >
                        📄 Rodapé
                    </button>
                </div>
            )}

            {/* Section List */}
            <div className="space-y-2">
                {sortedSections.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-8">
                        Nenhuma seção adicionada.<br />Clique no + para começar.
                    </p>
                ) : (
                    sortedSections.map((section, index) => (
                        <div
                            key={section.id}
                            className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${selectedSectionId === section.id
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                            onClick={() => onSectionSelect(section.id)}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900">
                                        {getSectionIcon(section.type)} {getSectionLabel(section.type)}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {getSectionPreview(section)}
                                    </p>
                                </div>

                                <div className="flex items-center gap-1 ml-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleMoveUp(index);
                                        }}
                                        disabled={index === 0}
                                        className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
                                        title="Mover para cima"
                                    >
                                        <ChevronUp size={16} />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleMoveDown(index);
                                        }}
                                        disabled={index === sortedSections.length - 1}
                                        className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
                                        title="Mover para baixo"
                                    >
                                        <ChevronDown size={16} />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (confirm('Deseja realmente excluir esta seção?')) {
                                                deleteSection(section.id);
                                            }
                                        }}
                                        className="p-1 hover:bg-red-100 text-red-600 rounded"
                                        title="Excluir"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

function getSectionIcon(type: string): string {
    const icons: Record<string, string> = {
        hero: '🎯',
        'social-proof': '⭐',
        faq: '❓',
        pricing: '💰',
        footer: '📄',
    };
    return icons[type] || '📦';
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

function getSectionPreview(section: Section): string {
    if (section.type === 'hero') {
        return section.headline?.substring(0, 30) || 'Sem título';
    }
    return '';
}
