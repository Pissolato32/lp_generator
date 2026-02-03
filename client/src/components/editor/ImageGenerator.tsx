import { useState } from 'react';
import { Image, Sparkles, Lock, Loader2 } from 'lucide-react';
import { nanoBananoService } from '../../services/nanoBanano';

interface ImageGeneratorProps {
    isPremium?: boolean;
}

export function ImageGenerator({ isPremium = false }: ImageGeneratorProps) {
    const [prompt, setPrompt] = useState('');
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        if (!prompt) return;
        setIsLoading(true);
        try {
            const url = await nanoBananoService.generateImage(prompt);
            setGeneratedImage(url);
        } catch (error) {
            console.error('Failed to generate image', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6 relative">
            {!isPremium && (
                <div className="absolute inset-0 z-20 bg-white/60 backdrop-blur-xs flex flex-col items-center justify-center text-center p-6 rounded-xl border-2 border-dashed border-purple-200">
                    <div className="bg-purple-100 p-4 rounded-full mb-4">
                        <Lock className="w-8 h-8 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Recurso VIP</h3>
                    <p className="text-sm text-gray-600 mb-4 max-w-xs">
                        A geração de imagens com IA "Nano Banano" está disponível apenas no plano Pro.
                    </p>
                    <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                        Fazer Upgrade Agora
                    </button>
                </div>
            )}

            <div className={`space-y-6 ${!isPremium ? 'opacity-50 pointer-events-none filter blur-[2px]' : ''}`}>
                <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                    <div className="flex items-center gap-3 mb-2">
                        <Sparkles className="w-5 h-5 text-purple-600" />
                        <h3 className="font-bold text-gray-900">Nano Banano AI</h3>
                    </div>
                    <p className="text-xs text-gray-500">
                        Descreva a imagem que você quer e nossa IA criará algo único para seu site.
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                        Prompt da Imagem
                    </label>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Ex: Um escritório moderno com plantas, estilo minimalista..."
                        className="w-full h-32 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-0 outline-none resize-none text-sm"
                    />
                </div>

                <button
                    onClick={() => { void handleGenerate(); }}
                    disabled={isLoading || !prompt}
                    className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="animate-spin w-5 h-5" />
                            Gerando...
                        </>
                    ) : (
                        <>
                            <Image className="w-5 h-5" />
                            Gerar Imagem
                        </>
                    )}
                </button>

                {generatedImage && (
                    <div className="mt-6 space-y-3 animate-in fade-in slide-in-from-bottom-4">
                        <div className="relative aspect-video rounded-xl overflow-hidden border border-gray-200 bg-gray-100 group">
                            <img
                                src={generatedImage}
                                alt="Generated"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <button className="px-4 py-2 bg-white text-gray-900 rounded-lg text-xs font-bold hover:bg-gray-100">
                                    Usar no Site
                                </button>
                                <button className="px-4 py-2 bg-white/20 backdrop-blur-md text-white rounded-lg text-xs font-bold hover:bg-white/30">
                                    Baixar
                                </button>
                            </div>
                        </div>
                        <p className="text-xs text-center text-gray-400">
                            Imagem gerada por Nano Banano v1.0
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
