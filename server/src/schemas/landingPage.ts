import { z } from 'zod';

// Base Types
export const SectionTypeSchema = z.enum([
  'hero',
  'social-proof',
  'faq',
  'pricing',
  'contact',
  'features',
  'gallery',
  'carousel',
  'footer'
]);

export const HeroVariantSchema = z.enum(['full-width', 'split', 'video-bg', 'vsl']);

export const BaseSectionSchema = z.object({
  id: z.string(),
  type: SectionTypeSchema,
  order: z.number(),
  className: z.string().optional(),
  styles: z.record(z.string()).optional(),
});

// Helper Types
export const FormFieldSchema = z.object({
  id: z.string(),
  type: z.enum(['text', 'email', 'tel', 'textarea']),
  label: z.string(),
  placeholder: z.string(),
  required: z.boolean(),
});

// Section Implementations

// Hero
export const HeroSectionSchema = BaseSectionSchema.extend({
  type: z.literal('hero'),
  variant: HeroVariantSchema,
  headline: z.string(),
  subheadline: z.string(),
  ctaText: z.string(),
  ctaUrl: z.string().optional(),
  backgroundImage: z.string().optional(),
  videoUrl: z.string().optional(),
  showForm: z.boolean(),
  formFields: z.array(FormFieldSchema).optional(),
});

// Features
export const FeatureItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  icon: z.string().optional(),
});

export const FeaturesSectionSchema = BaseSectionSchema.extend({
  type: z.literal('features'),
  title: z.string(),
  subtitle: z.string().optional(),
  items: z.array(FeatureItemSchema),
  columns: z.union([z.literal(2), z.literal(3), z.literal(4)]),
});

// Gallery
export const GalleryImageSchema = z.object({
  id: z.string(),
  url: z.string(),
  alt: z.string(),
  caption: z.string().optional(),
});

export const GallerySectionSchema = BaseSectionSchema.extend({
  type: z.literal('gallery'),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  images: z.array(GalleryImageSchema),
  layout: z.enum(['grid', 'masonry']),
});

// Carousel
export const CarouselItemSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string(),
  link: z.string().optional(),
});

export const CarouselSectionSchema = BaseSectionSchema.extend({
  type: z.literal('carousel'),
  title: z.string().optional(),
  items: z.array(CarouselItemSchema),
  autoPlay: z.boolean(),
});

// Contact
export const ContactSectionSchema = BaseSectionSchema.extend({
  type: z.literal('contact'),
  title: z.string(),
  subtitle: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  showForm: z.boolean(),
  formFields: z.array(FormFieldSchema).optional(),
  ctaText: z.string().optional(),
});

// Social Proof
export const TestimonialSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  content: z.string(),
  avatar: z.string().optional(),
  rating: z.number().optional(),
});

export const SocialProofSectionSchema = BaseSectionSchema.extend({
  type: z.literal('social-proof'),
  testimonials: z.array(TestimonialSchema),
  logos: z.array(z.string()).optional(),
  showRatings: z.boolean(),
});

// FAQ
export const FAQItemSchema = z.object({
  id: z.string(),
  question: z.string(),
  answer: z.string(),
});

export const FAQSectionSchema = BaseSectionSchema.extend({
  type: z.literal('faq'),
  items: z.array(FAQItemSchema),
  defaultOpen: z.string().optional(),
});

// Pricing
export const PricingTierSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.string(),
  period: z.string(),
  features: z.array(z.string()),
  ctaText: z.string(),
  ctaUrl: z.string().optional(),
  highlighted: z.boolean().optional(),
});

export const PricingSectionSchema = BaseSectionSchema.extend({
  type: z.literal('pricing'),
  tiers: z.array(PricingTierSchema),
});

// Footer
export const SocialLinkSchema = z.object({
  platform: z.string(),
  url: z.string(),
});

export const LegalLinkSchema = z.object({
  text: z.string(),
  url: z.string(),
});

export const FooterSectionSchema = BaseSectionSchema.extend({
  type: z.literal('footer'),
  finalCtaText: z.string().optional(),
  finalCtaUrl: z.string().optional(),
  socialLinks: z.array(SocialLinkSchema).optional(),
  legalLinks: z.array(LegalLinkSchema).optional(),
  copyrightText: z.string(),
});

// Union Section
export const SectionSchema = z.discriminatedUnion('type', [
  HeroSectionSchema,
  SocialProofSectionSchema,
  FAQSectionSchema,
  PricingSectionSchema,
  FooterSectionSchema,
  FeaturesSectionSchema,
  GallerySectionSchema,
  CarouselSectionSchema,
  ContactSectionSchema,
]);

// Configurations
export const DesignConfigSchema = z.object({
  primaryColor: z.string(),
  secondaryColor: z.string(),
  fontFamily: z.string(),
  buttonStyle: z.enum(['rounded', 'square', 'pill']),
});

export const IntegrationConfigSchema = z.object({
  webhookUrl: z.string().optional(),
  emailService: z.enum(['mailchimp', 'convertkit', 'activecampaign']).optional(),
  emailApiKey: z.string().optional(),
  gtmId: z.string().optional(),
  facebookPixelId: z.string().optional(),
  stripeKey: z.string().optional(),
  paypalClientId: z.string().optional(),
  hotmartProductId: z.string().optional(),
});

export const LandingPageConfigSchema = z.object({
  id: z.string(),
  name: z.string(),
  sections: z.array(SectionSchema),
  design: DesignConfigSchema,
  integrations: IntegrationConfigSchema,
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type LandingPageConfigInput = z.infer<typeof LandingPageConfigSchema>;
