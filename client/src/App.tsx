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
            } catch (error) {
                console.error('Failed to restore session:', error);
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
    } catch (error) {
        console.error('Chat error:', error);
        alert('Erro ao gerar página. Tente novamente.');
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
    } catch (error) {
        console.error('Chat error:', error);
        alert('Falha ao atualizar a página.');
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
  if (config.sections.length === 0 && !isLoading) {
    return <WelcomeScreen onStart={handleStartChat} isLoading={isLoading} />;
  }

  // If loading initially (first prompt)
  if (config.sections.length === 0 && isLoading) {
      return (
          <div className="min-h-screen bg-slate-900 flex items-center justify-center flex-col gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              <p className="text-white text-lg animate-pulse">Gerando sua obra-prima...</p>
          </div>
      );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Top Toolbar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Gerador de LP
          </h1>
          <div className="h-6 w-px bg-gray-300" />

          <div className="flex bg-gray-100 p-1 rounded-lg">
             <button
                onClick={() => setIsChatMode(true)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                    isChatMode ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
             >
                <MessageSquare size={16} />
                Chat IA
             </button>
             <button
                onClick={() => setIsChatMode(false)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                    !isChatMode ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
             >
                <Settings size={16} />
                Avançado
             </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
           <div className="hidden md:flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setPreviewMode('desktop')}
              className={`p-1.5 rounded transition-colors ${previewMode === 'desktop' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
            >
              <Monitor size={18} />
            </button>
            <button
              onClick={() => setPreviewMode('tablet')}
              className={`p-1.5 rounded transition-colors ${previewMode === 'tablet' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
            >
              <Tablet size={18} />
            </button>
            <button
              onClick={() => setPreviewMode('mobile')}
              className={`p-1.5 rounded transition-colors ${previewMode === 'mobile' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
            >
              <Smartphone size={18} />
            </button>
          </div>

          <button
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm"
          >
            <Download size={16} />
            Exportar
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar (Chat or Editor) */}
        <div className="w-full md:w-[400px] shrink-0 border-r border-gray-200 bg-white z-0 relative">
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
        <div className="flex-1 flex items-center justify-center p-4 md:p-8 overflow-hidden bg-slate-100">
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
