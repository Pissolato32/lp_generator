import React, { useState, useMemo } from 'react';
import { Send, Key, Loader2, Sparkles } from 'lucide-react';

interface WelcomeScreenProps {
    onStart: (message: string, userKey?: string) => Promise<void>;
    isLoading: boolean;
}

const PLACEHOLDER_TIPS = [
    "Quero uma landing page para meu curso de violão, tema escuro, estilo rock...",
    "Crie um site para uma agência de marketing digital minimalista e moderna.",
    "Preciso de uma página de vendas para um ebook de receitas fitness, cores vibrantes.",
    "Desenvolva um portfólio para fotógrafo de casamentos, elegante e clean.",
    "Gere um site para uma startup de tecnologia SaaS, foco em conversão e botões claros.",
    "Crie uma página para uma clínica de estética, transmitindo luxo e confiança.",
    "Landing page para lançamento de curso de investimentos, estilo corporativo sério.",
    "Site para uma pet shop local, divertido, colorido e amigável.",
    "Página para consultoria de RH, foco em recrutamento e seleção, tons de azul.",
    "Crie um site de pré-lançamento para um novo aplicativo de meditação, calmo e zen."
];

export function WelcomeScreen({ onStart, isLoading }: WelcomeScreenProps) {
    const [message, setMessage] = useState('');
    const [userKey, setUserKey] = useState('');
    const [showKeyInput, setShowKeyInput] = useState(false);

    // Seleciona um placeholder aleatório apenas uma vez ao montar
    const randomPlaceholder = useMemo(() => {
        return PLACEHOLDER_TIPS[Math.floor(Math.random() * PLACEHOLDER_TIPS.length)];
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim() && !isLoading) {
            void onStart(message, userKey);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 md:p-12 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
            </div>

            <div className="w-full max-w-4xl text-center space-y-16 md:space-y-24 relative z-10 py-12">
                <div className="space-y-8">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-[0.2em] mb-6 animate-fade-in">
                        <Sparkles size={14} />
                        Gerador de Landing Pages IA
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-[1.05] transition-all">
                        O que vamos <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">construir</span> hoje?
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed opacity-80">
                        Descreva sua ideia e deixe nossa IA arquitetar um site profissional em segundos, com design exclusivo e alta conversão.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
                    <div className="relative group">
                        <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-[2.5rem] blur-xl opacity-20 group-focus-within:opacity-40 transition duration-1000 group-focus-within:duration-200"></div>
                        <div className="relative">
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder={randomPlaceholder}
                                className="w-full p-10 md:p-14 bg-slate-800/90 backdrop-blur-2xl border-2 border-slate-700/50 rounded-[2.2rem] text-white placeholder-slate-500 focus:border-blue-500/50 focus:outline-none resize-none text-xl md:text-3xl min-h-[220px] shadow-2xl transition-all text-center leading-relaxed font-light"
                                disabled={isLoading}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSubmit(e);
                                    }
                                }}
                            />
                            <div className="absolute bottom-8 right-8 flex items-center gap-6">
                                <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] hidden lg:block opacity-60">
                                    Pressione Enter para criar
                                </span>
                                <button
                                    type="submit"
                                    disabled={isLoading || !message.trim()}
                                    className="p-5 bg-blue-600 rounded-2xl text-white hover:bg-blue-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-2xl shadow-blue-600/30 hover:scale-110 active:scale-90 hover:rotate-3"
                                >
                                    {isLoading ? <Loader2 className="animate-spin" size={28} /> : <Send size={28} />}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>

                <div className="flex justify-center flex-col items-center gap-8 pt-8">
                    <button
                        onClick={() => setShowKeyInput(!showKeyInput)}
                        className="text-[11px] font-black text-slate-500 hover:text-blue-400 flex items-center gap-3 transition-all uppercase tracking-[0.25em] group"
                    >
                        <Key size={14} className="group-hover:rotate-12 transition-transform" />
                        {showKeyInput ? 'Ocultar Configurações' : 'Configurações Avançadas / API Key'}
                    </button>

                    {showKeyInput && (
                        <div className="w-full max-w-md mx-auto animate-in fade-in slide-in-from-top-4 duration-300 p-6 bg-slate-800/50 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
                            <label className="block text-left text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">
                                Google Gemini API Key
                            </label>
                            <input
                                type="password"
                                value={userKey}
                                onChange={(e) => setUserKey(e.target.value)}
                                placeholder="AIza..."
                                className="w-full p-4 bg-slate-900/50 border border-slate-700 rounded-xl text-white text-sm focus:border-blue-500 outline-none placeholder:text-slate-700 transition-all shadow-inner"
                            />
                            <p className="text-[10px] text-slate-500 mt-4 leading-relaxed">
                                Sua chave é usada apenas localmente nesta sessão. <br/>
                                Deixe em branco para usar a chave padrão do servidor.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
