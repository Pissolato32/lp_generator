import { memo } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import type { ContactSection as ContactSectionType } from '../../types';

interface ContactSectionProps {
    section: ContactSectionType;
    primaryColor: string;
}

export const ContactSection = memo(function ContactSection({ section, primaryColor }: ContactSectionProps) {
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

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Informações de Contato */}
                    <div className="space-y-8">
                        <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-6">
                            {section.email && (
                                <div className="flex items-start gap-4 p-6 rounded-2xl bg-gray-50 border border-gray-100">
                                    <div className="p-3 rounded-xl bg-white shadow-sm" style={{ color: primaryColor }}>
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">E-mail</h4>
                                        <p className="text-gray-600">{section.email}</p>
                                    </div>
                                </div>
                            )}

                            {section.phone && (
                                <div className="flex items-start gap-4 p-6 rounded-2xl bg-gray-50 border border-gray-100">
                                    <div className="p-3 rounded-xl bg-white shadow-sm" style={{ color: primaryColor }}>
                                        <Phone className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">Telefone</h4>
                                        <p className="text-gray-600">{section.phone}</p>
                                    </div>
                                </div>
                            )}

                            {section.address && (
                                <div className="flex items-start gap-4 p-6 rounded-2xl bg-gray-50 border border-gray-100">
                                    <div className="p-3 rounded-xl bg-white shadow-sm" style={{ color: primaryColor }}>
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">Endereço</h4>
                                        <p className="text-gray-600">{section.address}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Formulário de Contato */}
                    {section.showForm && (
                        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
                            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                                <div className="grid sm:grid-cols-2 gap-6">
                                    {section.formFields?.map((field) => (
                                        <div key={field.id} className={field.type === 'textarea' ? 'sm:col-span-2' : ''}>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                {field.label}
                                                {field.required && <span className="text-red-500 ml-1">*</span>}
                                            </label>
                                            {field.type === 'textarea' ? (
                                                <textarea
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-offset-2 transition-all outline-none min-h-[120px]"
                                                    placeholder={field.placeholder}
                                                    required={field.required}
                                                    style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
                                                />
                                            ) : (
                                                <input
                                                    type={field.type}
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-offset-2 transition-all outline-none"
                                                    placeholder={field.placeholder}
                                                    required={field.required}
                                                    style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <button
                                    type="submit"
                                    className="w-full py-4 rounded-xl font-bold text-white shadow-lg shadow-offset-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                    style={{ 
                                        backgroundColor: primaryColor,
                                        boxShadow: `0 10px 15px -3px ${primaryColor}40`
                                    }}
                                >
                                    {section.ctaText ?? 'Enviar Mensagem'}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
});
