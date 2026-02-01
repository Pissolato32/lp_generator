import { memo } from 'react';
import type { GallerySection as GallerySectionType } from '../../types';

interface GallerySectionProps {
    section: GallerySectionType;
    primaryColor: string;
}

export const GallerySection = memo(function GallerySection({ section }: GallerySectionProps) {
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

                <div className={`grid gap-4 ${section.layout === 'masonry' ? 'columns-1 md:columns-2 lg:columns-3' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
                    {section.images?.map((image) => (
                        <div 
                            key={image.id} 
                            className={`relative group overflow-hidden rounded-2xl bg-gray-200 ${section.layout === 'masonry' ? 'mb-4 break-inside-avoid' : 'aspect-square'}`}
                        >
                            <img 
                                src={image.url} 
                                alt={image.alt}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            {image.caption && (
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                    <p className="text-white font-medium">{image.caption}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
});
