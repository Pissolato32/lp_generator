import * as Icons from 'lucide-react';
import type { FeaturesSection as FeaturesSectionType } from '../../types';

interface FeaturesSectionProps {
    section: FeaturesSectionType;
    primaryColor: string;
}

export function FeaturesSection({ section, primaryColor }: FeaturesSectionProps) {
    const gridCols = {
        2: 'md:grid-cols-2',
        3: 'md:grid-cols-3',
        4: 'md:grid-cols-2 lg:grid-cols-4',
    }[section.columns || 3];

    return (
        <section className="py-20 px-4 bg-white border-b border-gray-100">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">{section.title}</h2>
                    {section.subtitle && (
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            {section.subtitle}
                        </p>
                    )}
                </div>

                <div className={`grid gap-8 ${gridCols}`}>
                    {section.items?.map((item) => {
                        const IconComponent = (Icons as any)[item.icon || 'Star'] || Icons.Star;
                        return (
                            <div key={item.id} className="p-8 rounded-2xl bg-gray-50 border border-gray-100 transition-all hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1">
                                <div 
                                    className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center mb-6"
                                    style={{ color: primaryColor }}
                                >
                                    <IconComponent className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
