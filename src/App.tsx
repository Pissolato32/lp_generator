import { useState } from 'react';
import { LPProvider } from './context/LPContext';
import { EditorSidebar } from './components/editor/EditorSidebar';
import { GeneratorWizard } from './components/generator/GeneratorWizard';
import { TemplateModal } from './components/templates/TemplateModal';
import { useLPContext } from './context/LPContext';
import { Wand2, Layout, Eye, Save } from 'lucide-react';

function EditorLayout() {
  const { state } = useLPContext();
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState<string | undefined>();

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar de Edição */}
      <EditorSidebar 
        onSectionSelect={setSelectedSectionId} 
        selectedSectionId={selectedSectionId} 
      />

      {/* Área de Visualização/Preview */}
      <main className="flex-1 overflow-y-auto relative bg-gray-200 p-8">
        <div className="max-w-5xl mx-auto bg-white shadow-2xl min-h-full rounded-t-xl overflow-hidden">
          {state.config.sections.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-20 text-gray-500">
              <Layout size={64} className="mb-4 opacity-20" />
              <h2 className="text-xl font-medium">Sua Landing Page está vazia</h2>
              <p className="mt-2">Use o gerador de IA ou adicione seções manualmente.</p>
              <button
                onClick={() => setIsGeneratorOpen(true)}
                className="mt-6 flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all"
              >
                <Wand2 size={20} />
                Gerar com IA
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {state.config.sections.map((section) => (
                <div 
                  key={section.id} 
                  className={`relative group ${selectedSectionId === section.id ? 'ring-2 ring-blue-500' : ''}`}
                  onClick={() => setSelectedSectionId(section.id)}
                >
                  {/* Aqui seriam renderizados os componentes reais das seções */}
                  <div className="p-12 text-center">
                    <span className="text-xs font-bold uppercase tracking-widest text-blue-500">{section.type}</span>
                    <h3 className="text-lg font-medium mt-1">Componente de Seção: {section.type}</h3>
                    <p className="text-sm text-gray-400">ID: {section.id}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Barra de Ações Flutuante */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-white/80 backdrop-blur-md p-2 rounded-full shadow-lg border border-white/20">
          <button 
            onClick={() => setIsGeneratorOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-all"
          >
            <Wand2 size={16} />
            Gerar IA
          </button>
          <button 
            onClick={() => setIsTemplateModalOpen(true)}
            className="flex items-center gap-2 bg-white text-gray-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-100 transition-all"
          >
            <Layout size={16} />
            Templates
          </button>
          <div className="w-px h-6 bg-gray-200 mx-1" />
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-all">
            <Eye size={20} />
          </button>
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-all">
            <Save size={20} />
          </button>
        </div>
      </main>

      {/* Modais */}
      <GeneratorWizard 
        isOpen={isGeneratorOpen} 
        onClose={() => setIsGeneratorOpen(false)} 
      />
      <TemplateModal 
        isOpen={isTemplateModalOpen} 
        onClose={() => setIsTemplateModalOpen(false)} 
      />
    </div>
  );
}

function App() {
  return (
    <LPProvider>
      <EditorLayout />
    </LPProvider>
  );
}

export default App;
