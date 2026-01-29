export type SectionType =
    | 'hero'
    | 'social-proof'
    | 'faq'
    | 'pricing'
    | 'footer';

export type HeroVariant = 'full-width' | 'split' | 'video-bg' | 'vsl';

export interface BaseSection {
    id: string;
    type: SectionType;
    order: number;
}

export interface FormField {
    id: string;
    type: 'text' | 'email' | 'tel' | 'textarea';
    label: string;
    placeholder: string;
    required: boolean;
}

export interface HeroSection extends BaseSection {
    type: 'hero';
    variant: HeroVariant;
    headline: string;
    subheadline: string;
    ctaText: string;
    ctaUrl?: string;
    backgroundImage?: string;
    videoUrl?: string;
    showForm: boolean;
    formFields?: FormField[];
}

export interface Testimonial {
    id: string;
    name: string;
    role: string;
    content: string;
    avatar?: string;
    rating?: number;
}

export interface SocialProofSection extends BaseSection {
    type: 'social-proof';
    testimonials: Testimonial[];
    logos?: string[];
    showRatings: boolean;
}

export interface FAQItem {
    id: string;
    question: string;
    answer: string;
}

export interface FAQSection extends BaseSection {
    type: 'faq';
    items: FAQItem[];
    defaultOpen?: string;
}

export interface PricingTier {
    id: string;
    name: string;
    price: string;
    period: string;
    features: string[];
    ctaText: string;
    ctaUrl?: string;
    highlighted?: boolean;
}

export interface PricingSection extends BaseSection {
    type: 'pricing';
    tiers: PricingTier[];
}

export interface SocialLink {
    platform: string;
    url: string;
}

export interface LegalLink {
    text: string;
    url: string;
}

export interface FooterSection extends BaseSection {
    type: 'footer';
    finalCtaText?: string;
    finalCtaUrl?: string;
    socialLinks?: SocialLink[];
    legalLinks?: LegalLink[];
    copyrightText: string;
}

export type Section =
    | HeroSection
    | SocialProofSection
    | FAQSection
    | PricingSection
    | FooterSection;

export interface DesignConfig {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    buttonStyle: 'rounded' | 'square' | 'pill';
}

export interface IntegrationConfig {
    webhookUrl?: string;
    emailService?: 'mailchimp' | 'convertkit' | 'activecampaign';
    emailApiKey?: string;
    gtmId?: string;
    facebookPixelId?: string;
    stripeKey?: string;
    paypalClientId?: string;
    hotmartProductId?: string;
}

export interface LandingPageConfig {
    id: string;
    name: string;
    sections: Section[];
    design: DesignConfig;
    integrations: IntegrationConfig;
    createdAt: Date;
    updatedAt: Date;
}

// Server specific types

export interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: number;
}

export interface SessionData {
    id: string;
    messages: ChatMessage[];
    lpConfig: LandingPageConfig | null;
    createdAt: number;
    updatedAt: number;
}
