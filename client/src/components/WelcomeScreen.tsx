import React, { useState } from 'react';
import { Send, Key, Loader2 } from 'lucide-react';

interface WelcomeScreenProps {
    onStart: (message: string, userKey?: string) => Promise<void>;
    isLoading: boolean;
}

export function WelcomeScreen({ onStart, isLoading }: WelcomeScreenProps) {
    const [message, setMessage] = useState('');
    const [userKey, setUserKey] = useState('');
    const [showKeyInput, setShowKeyInput] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim() && !isLoading) {
            void onStart(message, userKey);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-2xl text-center space-y-8">
                <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
                    O que vamos construir hoje?
                </h1>
                <p className="text-xl text-slate-400">
                    Descreva a landing page dos seus sonhos e eu a gerarei em segundos.
                </p>

                <form onSubmit={handleSubmit} className="w-full space-y-4">
                    <div className="relative">
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Quero uma landing page para meu curso de violão, tema escuro, estilo rock..."
                            className="w-full p-6 pr-16 bg-slate-800 border-2 border-slate-700 rounded-2xl text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none resize-none text-lg min-h-[120px] shadow-xl"
                            disabled={isLoading}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSubmit(e);
                                }
                            }}
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !message.trim()}
                            className="absolute bottom-4 right-4 p-3 bg-blue-600 rounded-xl text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                        </button>
                    </div>
                </form>

                <div className="flex justify-center flex-col items-center gap-4">
                    <button
                        onClick={() => setShowKeyInput(!showKeyInput)}
                        className="text-sm text-slate-500 hover:text-slate-300 flex items-center gap-2 transition-colors"
                    >
                        <Key size={14} />
                        {showKeyInput ? 'Ocultar Chave de API' : 'Possui sua própria Chave de API?'}
                    </button>

                    {showKeyInput && (
                        <div className="w-full max-w-md mx-auto animate-in fade-in slide-in-from-top-4 duration-200">
                            <input
                                type="password"
                                value={userKey}
                                onChange={(e) => setUserKey(e.target.value)}
                                placeholder="Cole sua Chave de API do Gemini aqui (opcional)"
                                className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:border-blue-500 outline-none placeholder:text-slate-600"
                            />
                            <p className="text-xs text-slate-500 mt-2">
                                Sua chave é usada apenas para esta sessão e não é armazenada em nossos servidores.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
