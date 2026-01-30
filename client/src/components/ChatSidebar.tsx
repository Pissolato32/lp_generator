import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Bot, User, Info, CheckCircle2 } from 'lucide-react';
import { ChatMessage } from '../types';

interface ChatSidebarProps {
    messages: ChatMessage[];
    onSendMessage: (message: string) => Promise<void>;
    isLoading: boolean;
}

export function ChatSidebar({ messages, onSendMessage, isLoading }: ChatSidebarProps) {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() && !isLoading) {
            const msg = input;
            setInput(''); // Optimistic clear
            void onSendMessage(msg);
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800 w-full md:w-[380px]">
            {/* Header com Status do Fluxo */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/80 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-xl">
                        <Bot className="text-blue-500" size={22} />
                    </div>
                    <div>
                        <h2 className="font-black text-white tracking-tight text-lg">Arquiteto IA</h2>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Protocolo de Descoberta</p>
                    </div>
                </div>
                <div className="px-3 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-black rounded-full border border-blue-500/20 uppercase tracking-[0.15em] animate-pulse">
                    Live
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-10 scrollbar-thin scrollbar-thumb-slate-700 hover:scrollbar-thumb-slate-600 transition-all">
                {messages.length === 0 && (
                    <div className="text-center py-20 px-6 space-y-6">
                        <div className="w-20 h-20 bg-slate-800 rounded-3xl mx-auto flex items-center justify-center shadow-2xl border border-slate-700/50">
                            <Bot size={40} className="text-blue-500" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-white font-bold text-lg italic">"O design é a alma de tudo."</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Olá! Sou seu Arquiteto de IA. <br/>
                                Descreva seu projeto e vamos transformá-lo em realidade agora mesmo.
                            </p>
                        </div>
                    </div>
                )}
                {messages.map((msg, idx) => (
                    <div
                        key={`${msg.timestamp}-${idx}`}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}
                    >
                        <div
                            className={`max-w-[90%] p-5 md:p-6 rounded-[1.5rem] shadow-2xl transition-all hover:scale-[1.02] ${
                                msg.role === 'user'
                                    ? 'bg-blue-600 text-white rounded-br-none shadow-blue-600/20'
                                    : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700 shadow-black/40'
                            }`}
                        >
                            <div className="flex items-start gap-4">
                                {msg.role === 'assistant' && (
                                    <div className="shrink-0 p-1.5 bg-blue-500/10 rounded-lg mt-1">
                                        <Bot size={18} className="text-blue-400" />
                                    </div>
                                )}
                                <div className="space-y-3">
                                    <p className="text-[15px] leading-relaxed whitespace-pre-wrap font-medium">{msg.content}</p>
                                    
                                    {/* Indicadores Visuais de Etapa/Qualidade */}
                                    {msg.role === 'assistant' && (
                                        <div className="flex flex-wrap gap-3 pt-2">
                                            <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-900/50 px-2 py-1 rounded-md">
                                                <Info size={12} />
                                                Requirement
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[10px] font-black text-emerald-500/80 uppercase tracking-widest bg-emerald-500/5 px-2 py-1 rounded-md border border-emerald-500/10">
                                                <CheckCircle2 size={12} />
                                                Verified
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {msg.role === 'user' && (
                                    <div className="shrink-0 p-1.5 bg-white/10 rounded-lg mt-1">
                                        <User size={18} className="text-white" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start animate-pulse">
                        <div className="bg-slate-800 p-5 rounded-[1.5rem] rounded-bl-none border border-slate-700 flex items-center gap-4 shadow-xl">
                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                <Loader2 className="animate-spin text-blue-500" size={20} />
                            </div>
                            <span className="text-sm text-slate-300 font-bold tracking-tight">Arquitetando soluções...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-6 md:p-8 border-t border-slate-800 bg-slate-900/80 backdrop-blur-xl">
                <form onSubmit={handleSubmit} className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur opacity-0 group-focus-within:opacity-20 transition duration-500"></div>
                    <div className="relative">
                        <textarea
                            rows={1}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSubmit(e);
                                }
                            }}
                            placeholder="Descreva seu negócio ou peça ajustes..."
                            className="w-full p-5 pr-14 bg-slate-800 border-2 border-slate-700/50 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-base resize-none transition-all shadow-2xl"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            className="absolute right-3.5 bottom-3.5 p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-500 disabled:opacity-20 disabled:grayscale transition-all shadow-lg shadow-blue-600/20 hover:scale-110 active:scale-90"
                        >
                            <Send size={20} />
                        </button>
                    </div>
                </form>
                <div className="mt-4 flex justify-between items-center px-2">
                    <div className="flex gap-4">
                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em]">
                            SEO
                        </p>
                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em]">
                            UI/UX
                        </p>
                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em]">
                            PERF
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" />
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500/60 animate-bounce delay-150" />
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500/30 animate-bounce delay-300" />
                    </div>
                </div>
            </div>
        </div>
    );
}
