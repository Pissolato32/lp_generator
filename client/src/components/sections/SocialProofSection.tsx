import { memo } from 'react';
import { Star } from 'lucide-react';
import type { SocialProofSection as SocialProofSectionType } from '../../types';

interface SocialProofSectionProps {
    section: SocialProofSectionType;
    primaryColor?: string;
}

export const SocialProofSection = memo(function SocialProofSection({ section, primaryColor = '#0ea5e9' }: SocialProofSectionProps) {
    const { testimonials, logos, showRatings } = section;

    // Renderizar avaliação em estrelas
    const renderStars = (rating: number) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        size={16}
                        className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                    />
                ))}
            </div>
        );
    };

    return (
        <section className="py-20 px-4 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                {/* Cabeçalho */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        O Que Nossos Clientes Dizem
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Veja como estamos transformando negócios ao redor do mundo
                    </p>
                </div>

                {/* Grade de Depoimentos */}
                {testimonials && testimonials.length > 0 && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                        {testimonials.map((testimonial) => (
                            <div
                                key={testimonial.id}
                                className="bg-white p-8 rounded-2xl shadow-soft hover:shadow-soft-lg transition-all duration-300 animate-fade-in"
                            >
                                {/* Avaliação */}
                                {showRatings && testimonial.rating && (
                                    <div className="mb-4">{renderStars(testimonial.rating)}</div>
                                )}

                                {/* Conteúdo */}
                                <p className="text-gray-700 mb-6 leading-relaxed">
                                    "{testimonial.content}"
                                </p>

                                {/* Autor */}
                                <div className="flex items-center gap-4">
                                    {testimonial.avatar ? (
                                        <img
                                            src={testimonial.avatar}
                                            alt={testimonial.name}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div
                                            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                                            style={{ backgroundColor: primaryColor }}
                                        >
                                            {testimonial.name.charAt(0)}
                                        </div>
                                    )}
                                    <div>
                                        <p className="font-semibold text-gray-900">{testimonial.name}</p>
                                        <p className="text-sm text-gray-600">{testimonial.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Mural de Logos */}
                {logos && logos.length > 0 && (
                    <div className="border-t border-gray-200 pt-16">
                        <p className="text-center text-gray-600 mb-8 font-medium">
                            Empresas que confiam em nós
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
                            {logos.map((logo, index) => (
                                <div
                                    // eslint-disable-next-line react-x/no-array-index-key
                                    key={index}
                                    className="flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
                                >
                                    <img
                                        src={logo}
                                        alt={`Cliente ${index + 1}`}
                                        className="max-h-12 w-auto"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {(!testimonials || testimonials.length === 0) && (!logos || logos.length === 0) && (
                    <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-gray-300">
                        <p className="text-gray-500 text-lg">
                            Adicione depoimentos ou logos de clientes no editor
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
});
