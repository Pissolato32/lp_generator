import { useState } from 'react';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { HeroSection as HeroSectionType } from '../../types';

interface HeroSectionProps {
    section: HeroSectionType;
    primaryColor?: string;
    webhookUrl?: string;
}

export function HeroSection({ section, primaryColor = '#0ea5e9', webhookUrl }: HeroSectionProps) {
    const {
        variant,
        headline,
        subheadline,
        ctaText,
        ctaUrl,
        backgroundImage,
        videoUrl,
        showForm,
        formFields = [],
    } = section;

    const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = e.currentTarget;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        const submitAsync = async () => {
            if (!webhookUrl) {
                console.log('Form submitted (no webhook configured)');
                setFormStatus('success');
                // Reset status after 3 seconds for demo purposes if no webhook
                setTimeout(() => setFormStatus('idle'), 3000);
                return;
            }

            setFormStatus('submitting');
            setErrorMessage(null);

            try {
                const response = await fetch(webhookUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });

                if (!response.ok) {
                    throw new Error('Failed to submit form');
                }

                setFormStatus('success');
            } catch (error) {
                console.error('Form submission error:', error);
                setFormStatus('error');
                setErrorMessage('Erro ao enviar formulário. Tente novamente.');
            }
        };

        void submitAsync();
    };

    const renderSuccessMessage = () => (
        <div className="bg-green-50 text-green-800 p-6 rounded-lg text-center animate-fade-in w-full max-w-md mx-auto">
            <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-600" />
            <p className="font-semibold text-lg">Inscrição realizada!</p>
            <p>Obrigado pelo seu interesse.</p>
        </div>
    );

    const renderErrorMessage = () => (
        errorMessage && (
            <div className="bg-red-50 text-red-800 p-3 rounded-lg flex items-center gap-2 animate-fade-in text-sm">
                <AlertCircle size={16} className="shrink-0" />
                <p>{errorMessage}</p>
            </div>
        )
    );

    // Full-width variant
    if (variant === 'full-width') {
        return (
            <section
                className="relative min-h-screen flex items-center justify-center px-4 py-20"
                style={{
                    backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="absolute inset-0 bg-black/40" />
                <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
                        {headline}
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 text-white/90 animate-slide-up">
                        {subheadline}
                    </p>

                    <div className="flex justify-center w-full">
                        {showForm ? (
                            formStatus === 'success' ? (
                                renderSuccessMessage()
                            ) : (
                                <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4 animate-scale-in">
                                    {formFields.map((field) => (
                                        <input
                                            key={field.id}
                                            name={field.label}
                                            type={field.type}
                                            placeholder={field.placeholder}
                                            required={field.required}
                                            className="w-full px-6 py-4 rounded-lg text-gray-900 text-lg focus:ring-4 focus:ring-white/50 outline-none"
                                            style={{ borderColor: primaryColor }}
                                            disabled={formStatus === 'submitting'}
                                        />
                                    ))}
                                    {renderErrorMessage()}
                                    <button
                                        type="submit"
                                        disabled={formStatus === 'submitting'}
                                        className="w-full px-8 py-4 text-white text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                                        style={{ backgroundColor: primaryColor }}
                                    >
                                        {formStatus === 'submitting' ? <Loader2 className="animate-spin" /> : ctaText}
                                    </button>
                                </form>
                            )
                        ) : (
                            <a
                                href={ctaUrl ?? '#'}
                                className="inline-block px-12 py-5 text-white text-xl font-bold rounded-lg shadow-soft-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 animate-scale-in"
                                style={{ backgroundColor: primaryColor }}
                            >
                                {ctaText}
                            </a>
                        )}
                    </div>
                </div>
            </section>
        );
    }

    // Split layout variant
    if (variant === 'split') {
        return (
            <section className="min-h-screen flex items-center px-4 py-20">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                    <div className="animate-slide-up">
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
                            {headline}
                        </h1>
                        <p className="text-xl text-gray-600 mb-8">
                            {subheadline}
                        </p>

                        {showForm ? (
                            formStatus === 'success' ? (
                                renderSuccessMessage()
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {formFields.map((field) => (
                                        <input
                                            key={field.id}
                                            name={field.label}
                                            type={field.type}
                                            placeholder={field.placeholder}
                                            required={field.required}
                                            className="w-full px-6 py-4 rounded-lg border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 text-lg"
                                            style={{ borderColor: primaryColor, '--tw-ring-color': primaryColor } as React.CSSProperties}
                                            disabled={formStatus === 'submitting'}
                                        />
                                    ))}
                                    {renderErrorMessage()}
                                    <button
                                        type="submit"
                                        disabled={formStatus === 'submitting'}
                                        className="w-full px-8 py-4 text-white text-lg font-semibold rounded-lg shadow-soft hover:shadow-soft-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                                        style={{ backgroundColor: primaryColor }}
                                    >
                                        {formStatus === 'submitting' ? <Loader2 className="animate-spin" /> : ctaText}
                                    </button>
                                </form>
                            )
                        ) : (
                            <a
                                href={ctaUrl ?? '#'}
                                className="inline-block px-10 py-4 text-white text-lg font-bold rounded-lg shadow-soft hover:shadow-soft-lg transform hover:scale-105 transition-all duration-200"
                                style={{ backgroundColor: primaryColor }}
                            >
                                {ctaText}
                            </a>
                        )}
                    </div>

                    <div className="animate-fade-in">
                        {backgroundImage ? (
                            <img
                                src={backgroundImage}
                                alt="Hero"
                                className="w-full h-auto rounded-2xl shadow-soft-lg"
                            />
                        ) : (
                            <div className="w-full h-96 bg-linear-to-br from-blue-400 to-purple-500 rounded-2xl shadow-soft-lg" />
                        )}
                    </div>
                </div>
            </section>
        );
    }

    // Video background variant
    if (variant === 'video-bg') {
        return (
            <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
                {videoUrl && (
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover"
                    >
                        <source src={videoUrl} type="video/mp4" />
                    </video>
                )}
                <div className="absolute inset-0 bg-black/50" />

                <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
                        {headline}
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 text-white/90 animate-slide-up">
                        {subheadline}
                    </p>

                    <div className="flex justify-center w-full">
                        {showForm && (
                            formStatus === 'success' ? (
                                renderSuccessMessage()
                            ) : (
                                <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4 bg-white/10 backdrop-blur-lg p-8 rounded-2xl animate-scale-in">
                                    {formFields.map((field) => (
                                        <input
                                            key={field.id}
                                            name={field.label}
                                            type={field.type}
                                            placeholder={field.placeholder}
                                            required={field.required}
                                            className="w-full px-6 py-4 rounded-lg text-gray-900 text-lg focus:ring-4 focus:ring-white/50 outline-none"
                                            disabled={formStatus === 'submitting'}
                                        />
                                    ))}
                                    {renderErrorMessage()}
                                    <button
                                        type="submit"
                                        disabled={formStatus === 'submitting'}
                                        className="w-full px-8 py-4 text-white text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                                        style={{ backgroundColor: primaryColor }}
                                    >
                                        {formStatus === 'submitting' ? <Loader2 className="animate-spin" /> : ctaText}
                                    </button>
                                </form>
                            )
                        )}
                    </div>
                </div>
            </section>
        );
    }

    // VSL (Video Sales Letter) variant
    if (variant === 'vsl') {
        return (
            <section className="min-h-screen flex items-center justify-center px-4 py-20 bg-gray-50">
                <div className="max-w-5xl mx-auto text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 text-gray-900 animate-fade-in">
                        {headline}
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 mb-8 animate-slide-up">
                        {subheadline}
                    </p>

                    {/* Video Player */}
                    <div className="relative w-full aspect-video mb-8 rounded-2xl overflow-hidden shadow-soft-lg animate-scale-in">
                        {videoUrl ? (
                            videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be') ? (
                                <iframe
                                    className="w-full h-full"
                                    src={getYouTubeEmbedUrl(videoUrl)}
                                    title="Video"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            ) : videoUrl.includes('vimeo.com') ? (
                                <iframe
                                    className="w-full h-full"
                                    src={getVimeoEmbedUrl(videoUrl)}
                                    title="Video"
                                    allow="autoplay; fullscreen; picture-in-picture"
                                    allowFullScreen
                                />
                            ) : (
                                <video
                                    controls
                                    className="w-full h-full"
                                    src={videoUrl}
                                />
                            )
                        ) : (
                            <div className="w-full h-full bg-linear-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                                <p className="text-white text-xl">Adicione a URL do vídeo</p>
                            </div>
                        )}
                    </div>

                    {/* CTA Below Video */}
                    <div className="flex justify-center w-full">
                        {showForm ? (
                            formStatus === 'success' ? (
                                renderSuccessMessage()
                            ) : (
                                <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4 animate-scale-in">
                                    {formFields.map((field) => (
                                        <input
                                            key={field.id}
                                            name={field.label}
                                            type={field.type}
                                            placeholder={field.placeholder}
                                            required={field.required}
                                            className="w-full px-6 py-4 rounded-lg border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 text-lg"
                                            style={{ borderColor: primaryColor }}
                                            disabled={formStatus === 'submitting'}
                                        />
                                    ))}
                                    {renderErrorMessage()}
                                    <button
                                        type="submit"
                                        disabled={formStatus === 'submitting'}
                                        className="w-full px-8 py-5 text-white text-xl font-bold rounded-lg shadow-soft-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                                        style={{ backgroundColor: primaryColor }}
                                    >
                                        {formStatus === 'submitting' ? <Loader2 className="animate-spin" /> : ctaText}
                                    </button>
                                </form>
                            )
                        ) : (
                            <a
                                href={ctaUrl ?? '#'}
                                className="inline-block px-12 py-5 text-white text-xl font-bold rounded-lg shadow-soft-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 animate-scale-in"
                                style={{ backgroundColor: primaryColor }}
                            >
                                {ctaText}
                            </a>
                        )}
                    </div>
                </div>
            </section>
        );
    }

    return null;
}

// Helper functions for video embeds
function getYouTubeEmbedUrl(url: string): string {
    const videoId = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/.exec(url)?.[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
}

function getVimeoEmbedUrl(url: string): string {
    const videoId = /vimeo\.com\/(\d+)/.exec(url)?.[1];
    return videoId ? `https://player.vimeo.com/video/${videoId}` : url;
}
