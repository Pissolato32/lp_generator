import { useState } from 'react';
import { Plus, Trash2, Star } from 'lucide-react';
import { useLPEditor } from '../../hooks/useLPEditor';
import type { SocialProofSection, Testimonial } from '../../types';

interface SocialProofEditorProps {
    section: SocialProofSection;
}

export function SocialProofEditor({ section }: SocialProofEditorProps) {
    const { updateSection } = useLPEditor();

    const addTestimonial = () => {
        const newTestimonial: Testimonial = {
            id: crypto.randomUUID(),
            name: 'Nome do Cliente',
            role: 'Cargo, Empresa',
            content: 'Depoimento incrível sobre o produto ou serviço...',
            rating: 5,
        };

        updateSection(section.id, {
            testimonials: [...section.testimonials, newTestimonial],
        });
    };

    const updateTestimonial = (id: string, updates: Partial<Testimonial>) => {
        updateSection(section.id, {
            testimonials: section.testimonials.map((t) =>
                t.id === id ? { ...t, ...updates } : t
            ),
        });
    };

    const removeTestimonial = (id: string) => {
        updateSection(section.id, {
            testimonials: section.testimonials.filter((t) => t.id !== id),
        });
    };

    const [newLogoUrl, setNewLogoUrl] = useState('');

    const addLogo = () => {
        if (newLogoUrl.trim()) {
            updateSection(section.id, {
                logos: [...(section.logos ?? []), newLogoUrl.trim()],
            });
            setNewLogoUrl('');
        }
    };

    const removeLogo = (index: number) => {
        updateSection(section.id, {
            logos: section.logos?.filter((_, i) => i !== index),
        });
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Configurações</h3>

                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={section.showRatings}
                        onChange={(e) => updateSection(section.id, { showRatings: e.target.checked })}
                        className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-sm text-gray-700">Mostrar avaliações (estrelas)</span>
                </label>
            </div>

            {/* Testimonials */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-900">Depoimentos</h3>
                    <button
                        onClick={addTestimonial}
                        className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus size={16} />
                        Adicionar
                    </button>
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto">
                    {section.testimonials.map((testimonial, index) => (
                        <div
                            key={testimonial.id}
                            className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-gray-500">
                                    Depoimento #{index + 1}
                                </span>
                                <button
                                    onClick={() => removeTestimonial(testimonial.id)}
                                    className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-xs text-gray-600 mb-1">Nome</label>
                                    <input
                                        type="text"
                                        value={testimonial.name}
                                        onChange={(e) => updateTestimonial(testimonial.id, { name: e.target.value })}
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-600 mb-1">Cargo/Empresa</label>
                                    <input
                                        type="text"
                                        value={testimonial.role}
                                        onChange={(e) => updateTestimonial(testimonial.id, { role: e.target.value })}
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs text-gray-600 mb-1">Depoimento</label>
                                <textarea
                                    value={testimonial.content}
                                    onChange={(e) => updateTestimonial(testimonial.id, { content: e.target.value })}
                                    rows={3}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs text-gray-600 mb-1">Avatar (URL)</label>
                                <input
                                    type="text"
                                    value={testimonial.avatar ?? ''}
                                    onChange={(e) => updateTestimonial(testimonial.id, { avatar: e.target.value })}
                                    placeholder="https://exemplo.com/avatar.jpg"
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            {section.showRatings && (
                                <div>
                                    <label className="block text-xs text-gray-600 mb-2">
                                        Avaliação: {testimonial.rating ?? 5} estrelas
                                    </label>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                onClick={() => updateTestimonial(testimonial.id, { rating: star })}
                                                className="p-1 hover:scale-110 transition-transform"
                                            >
                                                <Star
                                                    size={20}
                                                    className={
                                                        star <= (testimonial.rating ?? 5)
                                                            ? 'fill-yellow-400 text-yellow-400'
                                                            : 'text-gray-300'
                                                    }
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

                    {section.testimonials.length === 0 && (
                        <p className="text-sm text-gray-500 text-center py-4">
                            Nenhum depoimento adicionado
                        </p>
                    )}
                </div>
            </div>

            {/* Logos */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-900">Logos de Clientes</h3>
                </div>

                {/* Add Logo Input */}
                <div className="flex gap-2 mb-3">
                    <input
                        type="url"
                        value={newLogoUrl}
                        onChange={(e) => setNewLogoUrl(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addLogo()}
                        placeholder="https://exemplo.com/logo.png"
                        className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <button
                        onClick={addLogo}
                        className="flex items-center gap-1 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
                    >
                        <Plus size={16} />
                        Adicionar
                    </button>
                </div>

                <div className="space-y-2">
                    {section.logos?.map((logo, index) => (
                        <div
                            // eslint-disable-next-line react-x/no-array-index-key
                            key={index}
                            className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-200"
                        >
                            <img src={logo} alt={`Logo ${index + 1}`} className="w-12 h-12 object-contain" />
                            <input
                                type="text"
                                value={logo}
                                onChange={(e) => {
                                    const newLogos = [...(section.logos ?? [])];
                                    newLogos[index] = e.target.value;
                                    updateSection(section.id, { logos: newLogos });
                                }}
                                className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                            <button
                                onClick={() => removeLogo(index)}
                                className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}

                    {(!section.logos || section.logos.length === 0) && (
                        <p className="text-sm text-gray-500 text-center py-4">
                            Nenhum logo adicionado
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
