import { memo } from 'react';
import type { PricingSection as PricingSectionType } from '../../types';

interface PricingSectionProps {
    section: PricingSectionType;
    primaryColor: string;
}

export const PricingSection = memo(function PricingSection({ section, primaryColor }: PricingSectionProps) {
    return (
        <div className="py-20 px-4 bg-gray-50 border-b border-gray-100">
            <div className="max-w-7xl mx-auto text-center">
                <h2 className="text-4xl font-bold mb-12">Nossos Planos</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    {section.tiers?.map((tier) => (
                        <div key={tier.id} className={`p-8 rounded-2xl bg-white shadow-sm border-2 ${tier.highlighted ? 'border-blue-500 scale-105' : 'border-transparent'}`}>
                            <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
                            <div className="text-3xl font-bold mb-4">{tier.price}<span className="text-sm text-gray-500 font-normal">{tier.period}</span></div>
                            <ul className="text-left space-y-3 mb-8">
                                {tier.features?.map((f: string, i: number) => (
                                    <li key={`${tier.id}-feat-${i}`} className="flex items-center gap-2 text-gray-600">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <button className="w-full py-3 rounded-lg font-bold text-white transition-colors" style={{ backgroundColor: primaryColor }}>
                                {tier.ctaText}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
});
