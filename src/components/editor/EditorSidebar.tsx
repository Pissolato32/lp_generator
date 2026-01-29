import { useState } from 'react';
import { Settings, Palette, Plug } from 'lucide-react';
import { useLPEditor } from '../../hooks/useLPEditor';
import { SectionList } from './SectionList';
import { HeroEditor } from './HeroEditor';
import { SocialProofEditor } from './SocialProofEditor';

interface EditorSidebarProps {
    selectedSectionId?: string;
    onSectionSelect: (sectionId: string) => void;
}

type Tab = 'sections' | 'content' | 'design' | 'integrations';

export function EditorSidebar({ selectedSectionId, onSectionSelect }: EditorSidebarProps) {
    const [activeTab, setActiveTab] = useState<Tab>('sections');
    const { config, updateDesign, updateIntegrations } = useLPEditor();

    const selectedSection = config.sections.find((s) => s.id === selectedSectionId);

    return (
        <div className="h-full flex flex-col bg-white border-r border-gray-200">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Editor</h2>
                <p className="text-sm text-gray-500">{config.name}</p>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('sections')}
                    className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'sections'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    <Settings size={18} className="inline mr-1" />
                    Seções
                </button>
                <button
                    onClick={() => setActiveTab('design')}
                    className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'design'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    <Palette size={18} className="inline mr-1" />
                    Design
                </button>
                <button
                    onClick={() => setActiveTab('integrations')}
                    className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'integrations'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    <Plug size={18} className="inline mr-1" />
                    Integrações
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
                {activeTab === 'sections' && (
                    <div>
                        <SectionList
                            onSectionSelect={onSectionSelect}
                            selectedSectionId={selectedSectionId}
                        />

                        {/* Content Editor for Selected Section */}
                        {selectedSection && (
                            <div className="border-t border-gray-200 p-4">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Editar Conteúdo
                                </h3>
                                {selectedSection.type === 'hero' && (
                                    <HeroEditor section={selectedSection} />
                                )}
                                {selectedSection.type === 'social-proof' && (
                                    <SocialProofEditor section={selectedSection} />
                                )}
                                {selectedSection.type !== 'hero' && selectedSection.type !== 'social-proof' && (
                                    <p className="text-gray-500 text-sm">
                                        Editor para esta seção em desenvolvimento
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'design' && (
                    <div className="p-4 space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Cor Primária
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="color"
                                    value={config.design.primaryColor}
                                    onChange={(e) => updateDesign({ primaryColor: e.target.value })}
                                    className="w-16 h-10 rounded border border-gray-300 cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={config.design.primaryColor}
                                    onChange={(e) => updateDesign({ primaryColor: e.target.value })}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Cor Secundária
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="color"
                                    value={config.design.secondaryColor}
                                    onChange={(e) => updateDesign({ secondaryColor: e.target.value })}
                                    className="w-16 h-10 rounded border border-gray-300 cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={config.design.secondaryColor}
                                    onChange={(e) => updateDesign({ secondaryColor: e.target.value })}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Estilo dos Botões
                            </label>
                            <select
                                value={config.design.buttonStyle}
                                onChange={(e) => updateDesign({ buttonStyle: e.target.value as 'rounded' | 'square' | 'pill' })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option value="rounded">Arredondado</option>
                                <option value="square">Quadrado</option>
                                <option value="pill">Pílula</option>
                            </select>
                        </div>
                    </div>
                )}

                {activeTab === 'integrations' && (
                    <div className="p-4 space-y-6">
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-sm font-medium text-blue-900 mb-1">
                                🔗 Webhook Universal (Recomendado)
                            </p>
                            <p className="text-xs text-blue-700">
                                Configure um webhook genérico para enviar dados do formulário para qualquer plataforma (Zapier, Make, n8n, etc.)
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                URL do Webhook
                            </label>
                            <input
                                type="url"
                                value={config.integrations.webhookUrl ?? ''}
                                onChange={(e) => updateIntegrations({ webhookUrl: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="https://hooks.zapier.com/..."
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Os dados do formulário serão enviados via POST para esta URL
                            </p>
                        </div>

                        <hr className="my-6" />

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Google Tag Manager ID
                            </label>
                            <input
                                type="text"
                                value={config.integrations.gtmId ?? ''}
                                onChange={(e) => updateIntegrations({ gtmId: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="GTM-XXXXXXX"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Facebook Pixel ID
                            </label>
                            <input
                                type="text"
                                value={config.integrations.facebookPixelId ?? ''}
                                onChange={(e) => updateIntegrations({ facebookPixelId: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="123456789012345"
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
