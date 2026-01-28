import { useState } from 'react';
import { Wand2, X, Loader2 } from 'lucide-react';
import { useLPContext } from '../../context/LPContext';
import { generateLPConfig, UserInput } from '../../services/ai';

interface GeneratorWizardProps {
    isOpen: boolean;
    onClose: () => void;
}

export function GeneratorWizard({ isOpen, onClose }: GeneratorWizardProps) {
    const { dispatch } = useLPContext();
    const [isGenerating, setIsGenerating] = useState(false);
    const [formData, setFormData] = useState<UserInput>({
        productName: '',
        productDescription: '',
        targetAudience: '',
        goal: 'lead',
        tone: 'formal'
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsGenerating(true);

        try {
            const config = await generateLPConfig(formData);

            if (confirm('Sua Landing Page foi gerada! Deseja substituir o conteúdo atual?')) {
                dispatch({ type: 'LOAD_CONFIG', payload: config });
                onClose();
            }
        } catch (error) {
            console.error('Error generating LP:', error);
            alert('Ocorreu um erro ao gerar sua página. Tente novamente.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden animate-scale-in flex flex-col">
                {/* Header */}
                <div className="bg-linear-to-r from-purple-600 to-indigo-600 p-6 text-white shrink-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Wand2 size={28} />
                            <div>
                                <h2 className="text-2xl font-bold">Gerador de Landing Page com IA</h2>
                                <p className="text-purple-100 text-sm">Responda algumas perguntas e deixe a mágica acontecer</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                            disabled={isGenerating}
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Form */}
                <div className="p-6 overflow-y-auto flex-1">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nome do Produto ou Serviço
                            </label>
                            <input
                                type="text"
                                name="productName"
                                value={formData.productName}
                                onChange={handleChange}
                                placeholder="Ex: Curso de Marketing Digital, Consultoria Financeira..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Descreva seu Produto
                            </label>
                            <textarea
                                name="productDescription"
                                value={formData.productDescription}
                                onChange={handleChange}
                                placeholder="O que ele faz? Quais os principais benefícios? Seja detalhado."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all h-32 resize-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Público Alvo
                            </label>
                            <input
                                type="text"
                                name="targetAudience"
                                value={formData.targetAudience}
                                onChange={handleChange}
                                placeholder="Ex: Pequenos empreendedores, Estudantes universitários..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Objetivo da Página
                                </label>
                                <select
                                    name="goal"
                                    value={formData.goal}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                                >
                                    <option value="lead">Capturar Leads</option>
                                    <option value="sales">Venda Direta</option>
                                    <option value="branding">Branding / Institucional</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tom de Voz
                                </label>
                                <select
                                    name="tone"
                                    value={formData.tone}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                                >
                                    <option value="formal">Formal & Profissional</option>
                                    <option value="informal">Informal & Amigável</option>
                                    <option value="aggressive">Agressivo / Vendas</option>
                                    <option value="minimalist">Minimalista</option>
                                </select>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer Actions */}
                <div className="border-t border-gray-200 p-6 bg-gray-50 shrink-0 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors font-medium"
                        disabled={isGenerating}
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isGenerating || !formData.productName || !formData.productDescription}
                        className={`
                            px-8 py-2 bg-linear-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold shadow-lg
                            transform transition-all flex items-center gap-2
                            ${isGenerating || !formData.productName || !formData.productDescription
                                ? 'opacity-70 cursor-not-allowed'
                                : 'hover:scale-105 hover:shadow-xl'}
                        `}
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                Gerando Mágica...
                            </>
                        ) : (
                            <>
                                <Wand2 size={20} />
                                Gerar Landing Page
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
