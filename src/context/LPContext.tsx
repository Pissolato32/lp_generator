import React, { createContext, use, useReducer, ReactNode, useRef } from 'react';
import type { LandingPageConfig, Section, DesignConfig, IntegrationConfig } from '../types';

interface LPState {
    config: LandingPageConfig;
}

type LPAction =
    | { type: 'ADD_SECTION'; payload: Section }
    | { type: 'UPDATE_SECTION'; payload: { id: string; updates: Partial<Section> } }
    | { type: 'DELETE_SECTION'; payload: string }
    | { type: 'REORDER_SECTIONS'; payload: Section[] }
    | { type: 'MOVE_SECTION'; payload: { fromIndex: number; toIndex: number } }
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
                            ? { ...section, ...action.payload.updates }
                            : section
                    ) as Section[],
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
                    })),
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

    // Keep ref updated for unmount save
    const configRef = useRef(state.config);
    React.useEffect(() => {
        configRef.current = state.config;
    });

    // Auto-save to localStorage
    React.useEffect(() => {
        const handler = setTimeout(() => {
            localStorage.setItem('lp-config', JSON.stringify(state.config));
        }, 1000);

        return () => {
            clearTimeout(handler);
        };
    }, [state.config]);

    // Save on unmount to prevent data loss
    React.useEffect(() => {
        return () => {
            localStorage.setItem('lp-config', JSON.stringify(configRef.current));
        };
    }, []);

    // Load from localStorage on mount
    React.useEffect(() => {
        const saved = localStorage.getItem('lp-config');
        if (saved) {
            try {
                const config = JSON.parse(saved) as LandingPageConfig;
                dispatch({ type: 'LOAD_CONFIG', payload: config });
            } catch (error) {
                console.error('Failed to load saved config:', error);
            }
        }
    }, []);

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
