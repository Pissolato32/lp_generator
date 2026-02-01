import { useState, useEffect, memo, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { CarouselSection as CarouselSectionType } from '../../types';

interface CarouselSectionProps {
    section: CarouselSectionType;
    primaryColor: string;
}

export const CarouselSection = memo(function CarouselSection({ section, primaryColor }: CarouselSectionProps) {
    const [activeIndex, setActiveIndex] = useState(0);

    const nextSlide = useCallback(() => {
        setActiveIndex((prev) => (prev + 1) % section.items.length);
    }, [section.items.length]);

    const prevSlide = useCallback(() => {
        setActiveIndex((prev) => (prev - 1 + section.items.length) % section.items.length);
    }, [section.items.length]);

    useEffect(() => {
        if (section.autoPlay && section.items.length > 1) {
            const interval = setInterval(nextSlide, 5000);
            return () => clearInterval(interval);
        }
    }, [section.autoPlay, section.items.length, nextSlide]);

    if (!section.items || section.items.length === 0) return null;

    return (
        <section className="py-20 bg-white border-b border-gray-100 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4">
                {section.title && (
                    <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">{section.title}</h2>
                )}

                <div className="relative group">
                    <div 
                        className="flex transition-transform duration-500 ease-out"
                        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
                    >
                        {section.items.map((item) => (
                            <div key={item.id} className="w-full flex-shrink-0 px-4">
                                <div className="relative aspect-[21/9] rounded-3xl overflow-hidden shadow-2xl shadow-gray-200">
                                    <img 
                                        src={item.imageUrl} 
                                        alt={item.title ?? ''}
                                        className="w-full h-full object-cover"
                                    />
                                    {(item.title || item.description) && (
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8 md:p-16">
                                            {item.title && <h3 className="text-3xl md:text-5xl font-bold text-white mb-4">{item.title}</h3>}
                                            {item.description && <p className="text-lg text-gray-200 max-w-2xl">{item.description}</p>}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {section.items.length > 1 && (
                        <>
                            <button 
                                onClick={prevSlide}
                                className="absolute left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 shadow-lg flex items-center justify-center text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button 
                                onClick={nextSlide}
                                className="absolute right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 shadow-lg flex items-center justify-center text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>

                            <div className="flex justify-center gap-2 mt-8">
                                {section.items.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveIndex(i)}
                                        className="w-3 h-3 rounded-full transition-all"
                                        style={{ 
                                            backgroundColor: i === activeIndex ? primaryColor : `${primaryColor}20`,
                                            width: i === activeIndex ? '24px' : '12px'
                                        }}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
});
