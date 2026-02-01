import { memo } from 'react';
import type { FAQSection as FAQSectionType } from '../../types';

interface FaqSectionProps {
    section: FAQSectionType;
    primaryColor?: string;
}

export const FaqSection = memo(function FaqSection({ section }: FaqSectionProps) {
    return (
        <div className="py-20 px-4 bg-white border-b border-gray-100">
            <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-12">Perguntas Frequentes</h2>
                <div className="space-y-6">
                    {section.items?.map((item) => (
                        <div key={item.id} className="border-b border-gray-100 pb-4">
                            <h3 className="text-lg font-semibold mb-2">{item.question}</h3>
                            <p className="text-gray-600">{item.answer}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
});
