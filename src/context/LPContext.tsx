import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import type { LandingPageConfig, Section, DesignConfig, IntegrationConfig } from '../types';

interface LPState {
    config: LandingPageConfig;
}

type LPAction =
    | { type: 'ADD_SECTION'; payload: Section }
    | { type: 'UPDATE_SECTION'; payload: { id: string; updates: Partial<Section> } }
    | { type: 'DELETE_SECTION'; payload: string }
    | { type: 'REORDER_SECTIONS'; payload: Section[] }
    | { type: 'UPDATE_DESIGN'; payload: Partial<DesignConfig> }
    | { type: 'UPDATE_INTEGRATIONS'; payload: Partial<IntegrationConfig> }
    | { type: 'LOAD_CONFIG'; payload: LandingPageConfig };

const initialState: LPState = {
    config: {
        id: crypto.randomUUID(),
        name: 'Nova Landing Page',
        sections: [],
        design: {
            primaryColor: '#0ea5e9',
            secondaryColor: '#d946ef',
            fontFamily: 'Inter',
            buttonStyle: 'rounded',
        },
        integrations: {},
        createdAt: new Date(),
        updatedAt: new Date(),
    },
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
                    sections: state.config.sections.map((section) =>
                        section.id === action.payload.id
                            ? { ...section, ...action.payload.updates }
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

    // Auto-save to localStorage
    React.useEffect(() => {
        localStorage.setItem('lp-config', JSON.stringify(state.config));
    }, [state.config]);

    // Load from localStorage on mount
    React.useEffect(() => {
        const saved = localStorage.getItem('lp-config');
        if (saved) {
            try {
                const config = JSON.parse(saved);
                dispatch({ type: 'LOAD_CONFIG', payload: config });
            } catch (error) {
                console.error('Failed to load saved config:', error);
            }
        }
    }, []);

    return (
        <LPContext.Provider value={{ state, dispatch }}>
            {children}
        </LPContext.Provider>
    );
}

export function useLPContext() {
    const context = useContext(LPContext);
    if (!context) {
        throw new Error('useLPContext must be used within LPProvider');
    }
    return context;
}
