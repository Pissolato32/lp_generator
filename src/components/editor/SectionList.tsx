import { useState, useMemo, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { useLPEditor } from '../../hooks/useLPEditor';
import { SectionType } from '../../types';
import { SectionListItem } from './SectionListItem';

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

    const handleMoveUp = useCallback((index: number) => {
        if (index > 0) {
            moveSection(index, index - 1);
        }
    }, [moveSection]);

    const handleMoveDown = useCallback((index: number) => {
        if (index < config.sections.length - 1) {
            moveSection(index, index + 1);
        }
    }, [moveSection, config.sections.length]);

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
                        <SectionListItem
                            key={section.id}
                            section={section}
                            index={index}
                            isSelected={selectedSectionId === section.id}
                            isFirst={index === 0}
                            isLast={index === sortedSections.length - 1}
                            onSelect={onSectionSelect}
                            onMoveUp={handleMoveUp}
                            onMoveDown={handleMoveDown}
                            onDelete={deleteSection}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
