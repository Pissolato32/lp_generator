import { memo } from 'react';
import type { FooterSection as FooterSectionType } from '../../types';

interface FooterSectionProps {
    section: FooterSectionType;
    primaryColor?: string;
}

export const FooterSection = memo(function FooterSection({ section }: FooterSectionProps) {
    return (
        <footer className="py-12 px-4 bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center">
                <div>
                    <p className="text-gray-400">{section.copyrightText}</p>
                </div>
                <div className="flex gap-4 md:justify-end">
                    {section.socialLinks?.map((link) => (
                        <a key={link.platform + link.url} href={link.url} className="text-gray-400 hover:text-white transition-colors">
                            {link.platform}
                        </a>
                    ))}
                </div>
            </div>
        </footer>
    );
});
