// Tipos principais para o Gerador de Landing Page

export type SectionType =
    | 'hero'
    | 'social-proof'
    | 'faq'
    | 'pricing'
    | 'contact'
    | 'features'
    | 'gallery'
    | 'carousel'
    | 'testimonials'
    | 'cta'
    | 'footer';

export type HeroVariant = 'full-width' | 'split' | 'video-bg' | 'vsl';

export interface BaseSection {
    id: string;
    type: SectionType;
    order: number;
    className?: string;
    styles?: Record<string, string>;
}

export interface FeatureItem {
    id: string;
    title: string;
    description: string;
    icon?: string;
}

export interface FeaturesSection extends BaseSection {
    type: 'features';
    title: string;
    subtitle?: string;
    items: FeatureItem[];
    columns: 2 | 3 | 4;
}

export interface GalleryImage {
    id: string;
    url: string;
    alt: string;
    caption?: string;
}

export interface GallerySection extends BaseSection {
    type: 'gallery';
    title?: string;
    subtitle?: string;
    images: GalleryImage[];
    layout: 'grid' | 'masonry';
}

export interface CarouselItem {
    id: string;
    title?: string;
    description?: string;
    imageUrl: string;
    link?: string;
}

export interface CarouselSection extends BaseSection {
    type: 'carousel';
    title?: string;
    items: CarouselItem[];
    autoPlay: boolean;
}

export interface TestimonialsSection extends BaseSection {
    type: 'testimonials';
    title?: string;
    subtitle?: string;
    testimonials: Testimonial[];
}

export interface CtaSection extends BaseSection {
    type: 'cta';
    title: string;
    subtitle?: string;
    ctaText: string;
    ctaUrl?: string;
    variant?: 'light' | 'dark' | 'primary';
}

export interface FormField {
    id: string;
    type: 'text' | 'email' | 'tel' | 'textarea';
    label: string;
    placeholder: string;
    required: boolean;
}

export interface ContactSection extends BaseSection {
    type: 'contact';
    title: string;
    subtitle?: string;
    email?: string;
    phone?: string;
    address?: string;
    showForm: boolean;
    formFields?: FormField[];
    ctaText?: string;
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
    | FooterSection
    | FeaturesSection
    | GallerySection
    | CarouselSection
    | ContactSection;

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

export type ExportFormat = 'html' | 'react' | 'wordpress';

export type CopyFramework = 'aida' | 'pas' | 'fab';

export interface CopyTemplate {
    framework: CopyFramework;
    niche: string;
    headline: string;
    subheadline: string;
    ctaText: string;
}

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

export interface ChatResponse {
    session: SessionData;
    config: LandingPageConfig;
}

export interface ErrorResponse {
    error: string;
}
