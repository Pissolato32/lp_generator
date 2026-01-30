import React, { createContext, useReducer, ReactNode, use } from 'react';
import { LandingPageConfig, Section, ChatMessage } from '../types';

export interface LPState {
    config: LandingPageConfig;
    sessionId?: string;
    messages: ChatMessage[];
    isChatMode: boolean;
}

export type LPAction =
    | { type: 'ADD_SECTION'; payload: Section }
    | { type: 'UPDATE_SECTION'; payload: { id: string; updates: Partial<Section> } }
    | { type: 'DELETE_SECTION'; payload: string }
    | { type: 'REORDER_SECTIONS'; payload: Section[] }
    | { type: 'MOVE_SECTION'; payload: { fromIndex: number; toIndex: number } }
    | { type: 'UPDATE_DESIGN'; payload: Partial<LandingPageConfig['design']> }
    | { type: 'UPDATE_INTEGRATIONS'; payload: Partial<LandingPageConfig['integrations']> }
    | { type: 'LOAD_CONFIG'; payload: LandingPageConfig }
    | { type: 'SET_SESSION'; payload: { sessionId: string; messages: ChatMessage[] } }
    | { type: 'ADD_MESSAGE'; payload: ChatMessage }
    | { type: 'SET_CHAT_MODE'; payload: boolean };

const initialState: LPState = {
    config: {
        id: '1',
        name: 'Minha Landing Page',
        sections: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        design: {
            primaryColor: '#3b82f6',
            secondaryColor: '#1e293b',
            fontFamily: 'Inter',
            buttonStyle: 'rounded',
        },
        integrations: {},
    },
    isChatMode: true,
    messages: [],
};

function lpReducer(state: LPState, action: LPAction): LPState {
    switch (action.type) {
        case 'ADD_SECTION':
            return {
                ...state,
                config: {
                    ...state.config,
                    sections: [...state.config.sections, action.payload] as Section[],
                    updatedAt: new Date(),
                },
            };

        case 'UPDATE_SECTION':
            return {
                ...state,
                config: {
                    ...state.config,
                    sections: state.config.sections.map((section) =>
                        section.id === action.payload.id
                            ? ({ ...section, ...action.payload.updates } as Section)
                            : section
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
                    sections: action.payload.map((section, index) => ({
                        ...section,
                        order: index,
                    })),
                    updatedAt: new Date(),
                },
            };

        case 'MOVE_SECTION': {
            const newSections = [...state.config.sections];
            const [moved] = newSections.splice(action.payload.fromIndex, 1);
            newSections.splice(action.payload.toIndex, 0, moved);

            return {
                ...state,
                config: {
                    ...state.config,
                    sections: newSections.map((section, index) => ({
                        ...section,
                        order: index,
                    })) as Section[],
                    updatedAt: new Date(),
                },
            };
        }

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

interface LPContextValue {
    state: LPState;
    dispatch: React.Dispatch<LPAction>;
}

const LPContext = createContext<LPContextValue | undefined>(undefined);

export function LPProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(lpReducer, initialState);

    // Auto-save session ID to localStorage
    React.useEffect(() => {
        if (state.sessionId) {
            localStorage.setItem('lp-session-id', state.sessionId);
        }
    }, [state.sessionId]);

    return (
        <LPContext value={{ state, dispatch }}>
            {children}
        </LPContext>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLPContext() {
    const context = use(LPContext);
    if (!context) {
        throw new Error('useLPContext must be used within LPProvider');
    }
    return context;
}
