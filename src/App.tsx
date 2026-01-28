import { useState } from 'react';
import { Download, Eye, EyeOff, Monitor, Tablet, Smartphone, Sparkles, Wand2 } from 'lucide-react';
import { LPProvider } from './context/LPContext';
import { useLPEditor } from './hooks/useLPEditor';
import { EditorSidebar } from './components/editor/EditorSidebar';
import { LivePreview } from './components/preview/LivePreview';
import { TemplateModal } from './components/templates/TemplateModal';
import { GeneratorWizard } from './components/generator/GeneratorWizard';

function AppContent() {
  const [selectedSectionId, setSelectedSectionId] = useState<string>();
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showPreview, setShowPreview] = useState(true);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showGeneratorWizard, setShowGeneratorWizard] = useState(false);
  const { config } = useLPEditor();

  const previewWidths = {
    desktop: '100%',
    tablet: '768px',
    mobile: '375px',
  };

  const handleExport = () => {
    alert('Funcionalidade de exportação será implementada em breve!');
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Top Toolbar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            LP Generator
          </h1>
          <div className="h-6 w-px bg-gray-300" />
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPreviewMode('desktop')}
              className={`p-2 rounded transition-colors ${previewMode === 'desktop'
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-600 hover:bg-gray-100'
                }`}
              title="Desktop"
            >
              <Monitor size={20} />
            </button>
            <button
              onClick={() => setPreviewMode('tablet')}
              className={`p-2 rounded transition-colors ${previewMode === 'tablet'
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-600 hover:bg-gray-100'
                }`}
              title="Tablet"
            >
              <Tablet size={20} />
            </button>
            <button
              onClick={() => setPreviewMode('mobile')}
              className={`p-2 rounded transition-colors ${previewMode === 'mobile'
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-600 hover:bg-gray-100'
                }`}
              title="Mobile"
            >
              <Smartphone size={20} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowGeneratorWizard(true)}
            className="px-4 py-2 bg-linear-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-lg shadow-soft hover:shadow-soft-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
          >
            <Wand2 size={18} />
            Gerar com IA
          </button>
          <button
            onClick={() => setShowTemplateModal(true)}
            className="px-4 py-2 bg-white text-gray-700 border border-gray-200 font-semibold rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <Sparkles size={18} />
            Templates
          </button>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
          >
            {showPreview ? <EyeOff size={18} /> : <Eye size={18} />}
            {showPreview ? 'Ocultar' : 'Mostrar'} Preview
          </button>
          <button
            onClick={handleExport}
            className="px-6 py-2 bg-linear-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-soft hover:shadow-soft-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
          >
            <Download size={18} />
            Exportar
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor Sidebar */}
        <div className="w-96 shrink-0">
          <EditorSidebar
            selectedSectionId={selectedSectionId}
            onSectionSelect={setSelectedSectionId}
          />
        </div>

        {/* Live Preview */}
        {showPreview && (
          <div className="flex-1 flex items-center justify-center p-8 overflow-hidden">
            <div
              className="bg-white shadow-2xl rounded-lg overflow-hidden h-full transition-all duration-300"
              style={{ width: previewWidths[previewMode] }}
            >
              <LivePreview
                sections={config.sections}
                primaryColor={config.design.primaryColor}
                onSectionClick={setSelectedSectionId}
              />
            </div>
          </div>
        )}

        {/* Empty State when preview is hidden */}
        {!showPreview && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Eye size={64} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">
                Preview oculto. Clique em "Mostrar Preview" para visualizar.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Template Modal */}
      <TemplateModal
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
      />

      {/* Generator Wizard */}
      <GeneratorWizard
        isOpen={showGeneratorWizard}
        onClose={() => setShowGeneratorWizard(false)}
      />
    </div>
  );
}

function App() {
  return (
    <LPProvider>
      <AppContent />
    </LPProvider>
  );
}

export default App;
