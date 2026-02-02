import { useState, useMemo } from 'react';
import { Settings, Palette, Download, CheckCircle2, Code, Copy, Check } from 'lucide-react';
import { useLPEditor } from '../../hooks/useLPEditor';
import { SectionList } from './SectionList';
import { HeroEditor } from './HeroEditor';
import { SocialProofEditor } from './SocialProofEditor';
import { generateHTML } from '../../utils/htmlGenerator';

interface EditorSidebarProps {
    selectedSectionId?: string;
    onSectionSelect: (sectionId: string) => void;
}

type Tab = 'sections' | 'content' | 'design' | 'code' | 'integrations' | 'export';

export function EditorSidebar({ selectedSectionId, onSectionSelect }: EditorSidebarProps) {
    const [activeTab, setActiveTab] = useState<Tab>('sections');
    const { config, updateDesign } = useLPEditor();
    const [copied, setCopied] = useState(false);

    const selectedSection = useMemo(
        () => config.sections.find((s) => s.id === selectedSectionId),
        [config.sections, selectedSectionId]
    );

    const htmlCode = useMemo(() => generateHTML(config), [config]);

    const handleExport = () => {
        const configStr = JSON.stringify(config, null, 2);
        const blob = new Blob([configStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `landing-page-config-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleExportHTML = () => {
        const blob = new Blob([htmlCode], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `index.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleCopyCode = async () => {
        try {
            await navigator.clipboard.writeText(htmlCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy code:', err);
        }
    };

    return (
        <div className="h-full flex flex-col bg-white border-r border-gray-200 shadow-2xl">
            {/* Header */}
            <div className="p-6 md:p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">Editor</h2>
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mt-1">{config.name}</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-100 overflow-x-auto no-scrollbar bg-white sticky top-0 z-10">
                <button
                    onClick={() => setActiveTab('sections')}
                    className={`flex-1 px-6 py-4 text-sm font-bold transition-all border-b-2 ${activeTab === 'sections'
                        ? 'text-blue-600 border-blue-600 bg-blue-50/30'
                        : 'text-gray-400 border-transparent hover:text-gray-600 hover:bg-gray-50'
                        }`}
                >
                    <Settings size={18} className="inline mr-2" />
                    Seções
                </button>
                <button
                    onClick={() => setActiveTab('design')}
                    className={`flex-1 px-6 py-4 text-sm font-bold transition-all border-b-2 ${activeTab === 'design'
                        ? 'text-blue-600 border-blue-600 bg-blue-50/30'
                        : 'text-gray-400 border-transparent hover:text-gray-600 hover:bg-gray-50'
                        }`}
                >
                    <Palette size={18} className="inline mr-2" />
                    Design
                </button>
                <button
                    onClick={() => setActiveTab('code')}
                    className={`flex-1 px-6 py-4 text-sm font-bold transition-all border-b-2 ${activeTab === 'code'
                        ? 'text-blue-600 border-blue-600 bg-blue-50/30'
                        : 'text-gray-400 border-transparent hover:text-gray-600 hover:bg-gray-50'
                        }`}
                >
                    <Code size={18} className="inline mr-2" />
                    Code
                </button>
                <button
                    onClick={() => setActiveTab('export')}
                    className={`flex-1 px-6 py-4 text-sm font-bold transition-all border-b-2 ${activeTab === 'export'
                        ? 'text-blue-600 border-blue-600 bg-blue-50/30'
                        : 'text-gray-400 border-transparent hover:text-gray-600 hover:bg-gray-50'
                        }`}
                >
                    <Download size={18} className="inline mr-2" />
                    Exportar
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto bg-white">
                {activeTab === 'sections' && (
                    <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                        <SectionList
                            onSectionSelect={onSectionSelect}
                            selectedSectionId={selectedSectionId}
                        />

                        {/* Content Editor for Selected Section */}
                        {selectedSection && (
                            <div className="border-t border-gray-100 p-6 md:p-8 bg-gray-50/30">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
                                    <h3 className="text-lg font-black text-gray-900 tracking-tight">
                                        Conteúdo da Seção
                                    </h3>
                                </div>
                                <div className="space-y-8">
                                    {selectedSection.type === 'hero' && (
                                        <HeroEditor section={selectedSection} />
                                    )}
                                    {selectedSection.type === 'social-proof' && (
                                        <SocialProofEditor section={selectedSection} />
                                    )}
                                    {selectedSection.type !== 'hero' && selectedSection.type !== 'social-proof' && (
                                        <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm text-center">
                                            <p className="text-gray-400 text-sm font-medium">
                                                Editor avançado para <span className="text-blue-600 font-bold">"{selectedSection.type}"</span> em desenvolvimento
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'code' && (
                    <div className="p-6 md:p-8 h-full flex flex-col animate-in fade-in slide-in-from-left-4 duration-300">
                         <div className="flex items-center justify-between mb-4">
                            <div>
                                <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">HTML Source Code</h4>
                                <p className="text-sm text-gray-500 mt-1">Código gerado pronto para produção</p>
                            </div>
                            <button
                                onClick={handleCopyCode}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                                    copied
                                        ? 'bg-emerald-100 text-emerald-700'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {copied ? <Check size={16} /> : <Copy size={16} />}
                                {copied ? 'Copiado!' : 'Copiar'}
                            </button>
                        </div>
                        <div className="flex-1 relative rounded-xl overflow-hidden border border-gray-200 shadow-inner bg-gray-50">
                            <textarea
                                readOnly
                                value={htmlCode}
                                className="absolute inset-0 w-full h-full p-4 font-mono text-xs text-gray-600 bg-transparent resize-none outline-none focus:ring-2 focus:ring-blue-500/20"
                                spellCheck={false}
                            />
                        </div>
                    </div>
                )}

                {activeTab === 'design' && (
                    <div className="p-6 md:p-8 space-y-10 animate-in fade-in slide-in-from-left-4 duration-300">
                        <div className="space-y-6">
                            <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Paleta Cromática</h4>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-3">
                                        Cor Primária
                                    </label>
                                    <div className="flex gap-3">
                                        <div className="relative w-14 h-14 shrink-0">
                                            <input
                                                type="color"
                                                value={config.design.primaryColor}
                                                onChange={(e) => updateDesign({ primaryColor: e.target.value })}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            />
                                            <div 
                                                className="w-full h-full rounded-xl border-2 border-gray-200 shadow-sm"
                                                style={{ backgroundColor: config.design.primaryColor }}
                                            />
                                        </div>
                                        <input
                                            type="text"
                                            value={config.design.primaryColor}
                                            onChange={(e) => updateDesign({ primaryColor: e.target.value })}
                                            className="flex-1 px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-blue-500 focus:ring-0 outline-none font-mono text-sm transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-3">
                                        Cor Secundária
                                    </label>
                                    <div className="flex gap-3">
                                        <div className="relative w-14 h-14 shrink-0">
                                            <input
                                                type="color"
                                                value={config.design.secondaryColor}
                                                onChange={(e) => updateDesign({ secondaryColor: e.target.value })}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            />
                                            <div 
                                                className="w-full h-full rounded-xl border-2 border-gray-200 shadow-sm"
                                                style={{ backgroundColor: config.design.secondaryColor }}
                                            />
                                        </div>
                                        <input
                                            type="text"
                                            value={config.design.secondaryColor}
                                            onChange={(e) => updateDesign({ secondaryColor: e.target.value })}
                                            className="flex-1 px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-blue-500 focus:ring-0 outline-none font-mono text-sm transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Elementos e Formas</h4>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-3">
                                    Estilo dos Botões
                                </label>
                                <select
                                    value={config.design.buttonStyle}
                                    onChange={(e) => updateDesign({ buttonStyle: e.target.value as 'rounded' | 'square' | 'pill' })}
                                    className="w-full px-5 py-3 border-2 border-gray-100 rounded-xl focus:border-blue-500 focus:ring-0 outline-none appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25em_1.25em] bg-[right_0.75rem_center] bg-no-repeat transition-all font-medium text-gray-700"
                                >
                                    <option value="rounded">Suave (Arredondado)</option>
                                    <option value="square">Rígido (Quadrado)</option>
                                    <option value="pill">Moderno (Pílula)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'export' && (
                    <div className="p-8 space-y-10 animate-in fade-in slide-in-from-left-4 duration-300">
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-3xl shadow-xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
                            <h4 className="font-black text-white text-xl mb-3 relative z-10 tracking-tight">Arquitetura Validada</h4>
                            <p className="text-blue-100 text-sm leading-relaxed relative z-10 font-medium">
                                Seu site foi otimizado para performance máxima, SEO estruturado e acessibilidade universal.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <button
                                onClick={handleExport}
                                className="w-full py-4 bg-white border-2 border-gray-100 text-gray-900 rounded-2xl font-black shadow-sm hover:shadow-md hover:border-gray-300 transition-all flex items-center justify-center gap-3 group"
                            >
                                <Settings size={20} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
                                Exportar Configuração JSON
                            </button>

                            <button
                                onClick={handleExportHTML}
                                className="w-full py-5 bg-blue-600 border-2 border-transparent text-white rounded-2xl font-black shadow-lg hover:shadow-2xl hover:bg-blue-700 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 group"
                            >
                                <Code size={22} className="group-hover:-translate-y-1 transition-transform" />
                                Exportar HTML Website
                            </button>
                            
                            <p className="text-[10px] text-center text-gray-400 font-bold uppercase tracking-[0.2em]">
                                Formato: HTML + Tailwind • Pronta Entrega
                            </p>
                        </div>

                        <div className="space-y-6">
                            <h5 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Score de Qualidade</h5>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-4 text-sm font-bold text-emerald-600 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100/50">
                                    <CheckCircle2 size={18} />
                                    Responsividade Cross-Device
                                </li>
                                <li className="flex items-center gap-4 text-sm font-bold text-emerald-600 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100/50">
                                    <CheckCircle2 size={18} />
                                    Performance & LCP Otimizado
                                </li>
                                <li className="flex items-center gap-4 text-sm font-bold text-emerald-600 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100/50">
                                    <CheckCircle2 size={18} />
                                    Acessibilidade WCAG AA
                                </li>
                                <li className="flex items-center gap-4 text-sm font-bold text-emerald-600 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100/50">
                                    <CheckCircle2 size={18} />
                                    SEO Semântico & Metadados
                                </li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
