import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import type { LandingPageConfig, Section, DesignConfig, IntegrationConfig, ChatMessage } from '../types';

interface LPState {
    config: LandingPageConfig;
    sessionId: string | null;
    messages: ChatMessage[];
    isChatMode: boolean;
}

type LPAction =
    | { type: 'ADD_SECTION'; payload: Section }
    | { type: 'UPDATE_SECTION'; payload: { id: string; updates: Partial<Section> } }
    | { type: 'DELETE_SECTION'; payload: string }
    | { type: 'REORDER_SECTIONS'; payload: Section[] }
    | { type: 'UPDATE_DESIGN'; payload: Partial<DesignConfig> }
    | { type: 'UPDATE_INTEGRATIONS'; payload: Partial<IntegrationConfig> }
    | { type: 'LOAD_CONFIG'; payload: LandingPageConfig }
    | { type: 'SET_SESSION'; payload: { sessionId: string; messages: ChatMessage[] } }
    | { type: 'ADD_MESSAGE'; payload: ChatMessage }
    | { type: 'SET_CHAT_MODE'; payload: boolean };

const initialState: LPState = {
    config: {
        id: crypto.randomUUID(),
        name: 'Minha Landing Page',
        sections: [],
        design: {
            primaryColor: '#0ea5e9',
            secondaryColor: '#8b5cf6',
            fontFamily: 'Inter',
            buttonStyle: 'rounded',
        },
        integrations: {},
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    sessionId: null,
    messages: [],
    isChatMode: true,
};

function lpReducer(state: LPState, action: LPAction): LPState {
    switch (action.type) {
        case 'ADD_SECTION':
            return {
                ...state,
                config: {
                    ...state.config,
                    sections: [...state.config.sections, action.payload],
                    updatedAt: new Date(),
                },
            };
        case 'UPDATE_SECTION':
            return {
                ...state,
                config: {
                    ...state.config,
                    sections: state.config.sections.map((s) =>
                        s.id === action.payload.id ? { ...s, ...action.payload.updates } : s
                    ),
                    updatedAt: new Date(),
                },
            };
        case 'DELETE_SECTION':
            return {
                ...state,
                config: {
                    ...state.config,
                    sections: state.config.sections.filter((s) => s.id !== action.payload),
                    updatedAt: new Date(),
                },
            };
        case 'REORDER_SECTIONS':
            return {
                ...state,
                config: {
                    ...state.config,
                    sections: action.payload,
                    updatedAt: new Date(),
                },
            };
        case 'UPDATE_DESIGN':
            return {
                ...state,
                config: {
                    ...state.config,
                    design: { ...state.config.design, ...action.payload },
                    updatedAt: new Date(),
                },
            };
        case 'UPDATE_INTEGRATIONS':
            return {
                ...state,
                config: {
                    ...state.config,
                    integrations: { ...state.config.integrations, ...action.payload },
                    updatedAt: new Date(),
                },
            };
        case 'LOAD_CONFIG':
            return {
                ...state,
                config: action.payload,
            };
        case 'SET_SESSION':
            return {
                ...state,
                sessionId: action.payload.sessionId,
                messages: action.payload.messages,
            };
        case 'ADD_MESSAGE':
            return {
                ...state,
                messages: [...state.messages, action.payload],
            };
        case 'SET_CHAT_MODE':
            return {
                ...state,
                isChatMode: action.payload,
            };
        default:
            return state;
    }
}

interface LPContextType {
    state: LPState;
    dispatch: React.Dispatch<LPAction>;
}

const LPContext = createContext<LPContextType | undefined>(undefined);

export function LPProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(lpReducer, initialState);

    // Auto-save session ID to localStorage
    useEffect(() => {
        if (state.sessionId) {
            localStorage.setItem('lp-session-id', state.sessionId);
        }
    }, [state.sessionId]);

    return (
        <LPContext.Provider value={{ state, dispatch }}>
            {children}
        </LPContext.Provider>
    );
}

export function useLPContext() {
    const context = useContext(LPContext);
    if (context === undefined) {
        throw new Error('useLPContext must be used within a LPProvider');
    }
    return context;
}
