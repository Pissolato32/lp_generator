import { memo } from 'react';

interface CtaSectionProps {
    section: {
        id: string;
        type: 'cta';
        title: string;
        subtitle?: string;
        ctaText: string;
        ctaUrl?: string;
        variant?: 'light' | 'dark' | 'primary';
    };
    primaryColor: string;
}

export const CtaSection = memo(function CtaSection({ section, primaryColor }: CtaSectionProps) {
    const variants = {
        light: 'bg-white text-gray-900 border-gray-100',
        dark: 'bg-gray-900 text-white border-transparent',
        primary: 'text-white border-transparent',
    };

    const bgStyle = section.variant === 'primary' ? { backgroundColor: primaryColor } : {};

    return (
        <section 
            className={`py-20 px-4 border-b text-center ${variants[section.variant || 'primary']}`}
            style={bgStyle}
        >
            <div className="max-w-4xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-bold mb-6">{section.title}</h2>
                {section.subtitle && (
                    <p className={`text-xl mb-10 opacity-90 ${section.variant === 'light' ? 'text-gray-600' : 'text-gray-200'}`}>
                        {section.subtitle}
                    </p>
                )}
                <button
                    className={`px-10 py-4 rounded-2xl font-bold text-lg transition-all hover:scale-105 active:scale-95 shadow-xl`}
                    style={{ 
                        backgroundColor: section.variant === 'primary' ? 'white' : primaryColor,
                        color: section.variant === 'primary' ? primaryColor : 'white',
                        boxShadow: `0 10px 15px -3px ${section.variant === 'primary' ? 'rgba(0,0,0,0.1)' : primaryColor + '40'}`
                    }}
                >
                    {section.ctaText}
                </button>
            </div>
        </section>
    );
});
