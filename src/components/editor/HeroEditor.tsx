import { HeroSection } from '../../types';
import { useLPEditor } from '../../hooks/useLPEditor';

interface HeroEditorProps {
    section: HeroSection;
}

export function HeroEditor({ section }: HeroEditorProps) {
    const { updateSection } = useLPEditor();

    const handleUpdate = (field: keyof HeroSection, value: string | boolean) => {
        updateSection(section.id, { [field]: value });
    };

    return (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Variante
                </label>
                <select
                    value={section.variant}
                    onChange={(e) => handleUpdate('variant', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                    <option value="full-width">Largura Total</option>
                    <option value="split">Layout Dividido</option>
                    <option value="video-bg">Vídeo de Fundo</option>
                    <option value="vsl">VSL (Video Sales Letter)</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título Principal
                </label>
                <input
                    type="text"
                    value={section.headline}
                    onChange={(e) => handleUpdate('headline', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Seu título impactante"
                />
                <p className="text-xs text-gray-500 mt-1">
                    {section.headline.length} caracteres
                </p>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subtítulo
                </label>
                <textarea
                    value={section.subheadline}
                    onChange={(e) => handleUpdate('subheadline', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                    placeholder="Descrição complementar"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Texto do CTA
                </label>
                <input
                    type="text"
                    value={section.ctaText}
                    onChange={(e) => handleUpdate('ctaText', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Ex: Começar Agora"
                />
            </div>

            {!section.showForm && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        URL do CTA (opcional)
                    </label>
                    <input
                        type="url"
                        value={section.ctaUrl ?? ''}
                        onChange={(e) => handleUpdate('ctaUrl', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="https://..."
                    />
                </div>
            )}

            {(section.variant === 'vsl' || section.variant === 'video-bg') && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        URL do Vídeo
                    </label>
                    <input
                        type="url"
                        value={section.videoUrl ?? ''}
                        onChange={(e) => handleUpdate('videoUrl', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="YouTube, Vimeo ou URL direta"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Suporta YouTube, Vimeo ou arquivos MP4
                    </p>
                </div>
            )}

            {(section.variant === 'full-width' || section.variant === 'split') && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Imagem de Fundo/Lateral
                    </label>
                    <input
                        type="url"
                        value={section.backgroundImage ?? ''}
                        onChange={(e) => handleUpdate('backgroundImage', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="URL da imagem"
                    />
                </div>
            )}

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <input
                    type="checkbox"
                    id="showForm"
                    checked={section.showForm}
                    onChange={(e) => handleUpdate('showForm', e.target.checked)}
                    className="w-5 h-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-500"
                />
                <label htmlFor="showForm" className="text-sm font-medium text-gray-700 cursor-pointer">
                    Exibir formulário de captura
                </label>
            </div>

            {section.showForm && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-900 font-medium mb-2">
                        📝 Formulário de Captura
                    </p>
                    <p className="text-xs text-blue-700">
                        Os campos do formulário serão enviados para o webhook configurado na aba Integrações.
                    </p>
                </div>
            )}
        </div>
    );
}
