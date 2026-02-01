import { memo } from 'react';
import { Star } from 'lucide-react';
import type { Testimonial } from '../../types';

interface TestimonialsSectionProps {
    section: {
        id: string;
        type: 'testimonials';
        title?: string;
        subtitle?: string;
        testimonials: Testimonial[];
    };
    primaryColor: string;
}

export const TestimonialsSection = memo(function TestimonialsSection({ section }: TestimonialsSectionProps) {
    return (
        <section className="py-20 px-4 bg-gray-50 border-b border-gray-100">
            <div className="max-w-7xl mx-auto">
                {(section.title ?? section.subtitle) && (
                    <div className="text-center mb-16">
                        {section.title && <h2 className="text-4xl font-bold text-gray-900 mb-4">{section.title}</h2>}
                        {section.subtitle && (
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                {section.subtitle}
                            </p>
                        )}
                    </div>
                )}

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {section.testimonials?.map((t) => (
                        <div key={t.id} className="p-8 rounded-3xl bg-white border border-gray-100 shadow-sm transition-all hover:shadow-xl hover:shadow-gray-200/50">
                            <div className="flex gap-1 mb-6">
                                {[...Array(t.rating ?? 5)].map((_, i) => (
                                    <Star key={`star-${i}`} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>
                            <p className="text-gray-700 leading-relaxed mb-8 italic">
                                "{t.content}"
                            </p>
                            <div className="flex items-center gap-4">
                                {t.avatar ? (
                                    <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-400">
                                        {t.name.charAt(0)}
                                    </div>
                                )}
                                <div>
                                    <h4 className="font-bold text-gray-900">{t.name}</h4>
                                    <p className="text-sm text-gray-500">{t.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
});
