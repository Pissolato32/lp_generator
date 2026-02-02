import { useState, useEffect } from 'react';
import { Download, Monitor, Tablet, Smartphone, MessageSquare, Settings } from 'lucide-react';
import { LPProvider, useLPContext } from './context/LPContext';
import { useLPEditor } from './hooks/useLPEditor';
import { EditorSidebar } from './components/editor/EditorSidebar';
import { LivePreview } from './components/preview/LivePreview';
import { WelcomeScreen } from './components/WelcomeScreen';
import { ChatSidebar } from './components/ChatSidebar';
import { chatWithAgent, getSession } from './services/api';

function AppContent() {
  const [selectedSectionId, setSelectedSectionId] = useState<string>();
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isLoading, setIsLoading] = useState(false);
  const { state, dispatch } = useLPContext();
  const { config } = useLPEditor();

  const [isChatMode, setIsChatMode] = useState(true);
  const [userKey, setUserKey] = useState<string>();

  // Load session on mount
  useEffect(() => {
    const loadSession = async () => {
        const savedSessionId = localStorage.getItem('lp-session-id');
        if (savedSessionId) {
            try {
                const session = await getSession(savedSessionId);
                if (session.lpConfig) {
                    dispatch({ type: 'LOAD_CONFIG', payload: session.lpConfig });
                }
                dispatch({ type: 'SET_SESSION', payload: { sessionId: session.id, messages: session.messages } });
            } catch (error: unknown) {
                // If error is "Session not found", just clear localStorage silently
                const errorMessage = error instanceof Error ? error.message : '';
                if (errorMessage === 'Session not found') {
                    console.warn('Sessão expirada ou não encontrada no servidor. Iniciando nova sessão.');
                } else {
                    console.error('Falha ao restaurar sessão:', error);
                }
                localStorage.removeItem('lp-session-id');
            }
        }
    };
    void loadSession();
  }, [dispatch]);

  const handleStartChat = async (message: string, userKey?: string) => {
    setIsLoading(true);
    if (userKey) setUserKey(userKey);
    try {
        const { session, config } = await chatWithAgent(message, undefined, userKey);
        dispatch({ type: 'LOAD_CONFIG', payload: config });
        dispatch({ type: 'SET_SESSION', payload: { sessionId: session.id, messages: session.messages } });
        localStorage.setItem('lp-session-id', session.id);
    } catch (error: unknown) {
        console.error('Chat error:', error);
        const errMsg = error instanceof Error ? error.message : '';
        const errorMessage = errMsg.includes('API Key') 
            ? 'Chave de API não configurada. Por favor, insira uma chave nas configurações ou configure o servidor.'
            : 'Erro ao gerar página. Tente novamente.';
        alert(errorMessage);
    } finally {
        setIsLoading(false);
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!state.sessionId) return;
    setIsLoading(true);

    // Optimistic update for UI
    dispatch({
        type: 'ADD_MESSAGE',
        payload: { role: 'user', content: message, timestamp: Date.now() }
    });

    try {
        const { session, config } = await chatWithAgent(message, state.sessionId, userKey);
        dispatch({ type: 'LOAD_CONFIG', payload: config });
        dispatch({ type: 'SET_SESSION', payload: { sessionId: session.id, messages: session.messages } });
        localStorage.setItem('lp-session-id', session.id);
    } catch (error: unknown) {
        console.error('Chat error:', error);
        const errMsg = error instanceof Error ? error.message : '';
        const errorMessage = errMsg.includes('API Key') 
            ? 'Chave de API não configurada. Por favor, insira uma chave nas configurações ou configure o servidor.'
            : 'Falha ao atualizar a página.';
        alert(errorMessage);
    } finally {
        setIsLoading(false);
    }
  };

  const previewWidths = {
    desktop: '100%',
    tablet: '768px',
    mobile: '375px',
  };

  // If no sections (and not loading), show Welcome Screen
  if (!config?.sections?.length && !isLoading) {
    return <WelcomeScreen onStart={handleStartChat} isLoading={isLoading} />;
  }

  // If loading initially (first prompt)
  if (!config?.sections?.length && isLoading) {
      return (
          <div className="min-h-screen bg-slate-900 flex items-center justify-center flex-col gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              <p className="text-white text-lg animate-pulse">Gerando sua obra-prima...</p>
          </div>
      );
  }

  // Safe access to design properties
  const primaryColor = config?.design?.primaryColor || '#3b82f6';

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Top Toolbar */}
      <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tighter">
            LP Architect
          </h1>
          <div className="h-8 w-px bg-gray-200" />

          <div className="flex bg-gray-100 p-1.5 rounded-xl border border-gray-200/50 shadow-inner">
             <button
                onClick={() => setIsChatMode(true)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2.5 ${
                    isChatMode ? 'bg-white text-blue-600 shadow-md scale-105' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                }`}
             >
                <MessageSquare size={18} />
                Chat IA
             </button>
             <button
                onClick={() => setIsChatMode(false)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2.5 ${
                    !isChatMode ? 'bg-white text-blue-600 shadow-md scale-105' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                }`}
             >
                <Settings size={18} />
                Editor
             </button>
          </div>
        </div>

        <div className="flex items-center gap-6">
           <div className="hidden lg:flex items-center gap-2 bg-gray-100 p-1.5 rounded-xl border border-gray-200/50">
            <button
              onClick={() => setPreviewMode('desktop')}
              className={`p-2 rounded-lg transition-all ${previewMode === 'desktop' ? 'bg-white shadow-md text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
              title="Desktop"
            >
              <Monitor size={20} />
            </button>
            <button
              onClick={() => setPreviewMode('tablet')}
              className={`p-2 rounded-lg transition-all ${previewMode === 'tablet' ? 'bg-white shadow-md text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
              title="Tablet"
            >
              <Tablet size={20} />
            </button>
            <button
              onClick={() => setPreviewMode('mobile')}
              className={`p-2 rounded-lg transition-all ${previewMode === 'mobile' ? 'bg-white shadow-md text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
              title="Mobile"
            >
              <Smartphone size={20} />
            </button>
          </div>

          <button
            className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all flex items-center gap-2.5 text-sm shadow-lg shadow-blue-600/20 hover:scale-105 active:scale-95"
          >
            <Download size={18} />
            Exportar
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar (Chat or Editor) */}
        <div className="w-full md:w-[420px] shrink-0 border-r border-gray-200 bg-white z-0 relative shadow-xl">
            {isChatMode ? (
                <ChatSidebar
                    messages={state.messages}
                    onSendMessage={handleSendMessage}
                    isLoading={isLoading}
                />
            ) : (
                <EditorSidebar
                    selectedSectionId={selectedSectionId}
                    onSectionSelect={setSelectedSectionId}
                />
            )}
        </div>

        {/* Live Preview */}
        <div className="flex-1 flex items-center justify-center p-8 md:p-16 lg:p-24 overflow-hidden bg-slate-50 relative">
            {/* Background pattern for preview area */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
            
            <div
              className="bg-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] rounded-2xl overflow-hidden h-full transition-all duration-500 ease-in-out border border-gray-200/50"
              style={{ width: previewWidths[previewMode] }}
            >
              <LivePreview
                sections={config.sections}
                primaryColor={primaryColor}
                onSectionClick={setSelectedSectionId}
              />
            </div>
        </div>
      </div>
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
