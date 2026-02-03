import { LandingPageConfig, ChatMessage, SectionType } from '../types';
import { v4 as uuidv4 } from 'uuid';

export interface PrebuiltBlock {
  id: string;
  type: SectionType;
  name: string;
  description: string;
  template: any; // Will be filled with specific section template
  tags: string[];
}

export class PrebuiltBlockService {
  private blocks: Record<SectionType, PrebuiltBlock[]> = {
    hero: [
      {
        id: 'hero-full-width',
        type: 'hero',
        name: 'Full Width Hero',
        description: 'Large headline with subheadline and CTA',
        template: {
          id: '',
          type: 'hero',
          order: 0,
          variant: 'full-width',
          headline: 'Transform Your Business with Our Solution',
          subheadline: 'Join thousands of satisfied customers who have revolutionized their workflow',
          ctaText: 'Get Started',
          ctaUrl: '#',
          backgroundImage: 'https://placehold.co/1200x600?text=Hero+Background',
          showForm: false,
          formFields: []
        },
        tags: ['business', 'professional', 'wide']
      },
      {
        id: 'hero-split',
        type: 'hero',
        name: 'Split Layout Hero',
        description: 'Image on one side, text and CTA on the other',
        template: {
          id: '',
          type: 'hero',
          order: 0,
          variant: 'split',
          headline: 'Innovative Solutions for Modern Problems',
          subheadline: 'Our cutting-edge technology delivers results you can measure',
          ctaText: 'Try Free Demo',
          ctaUrl: '#',
          backgroundImage: 'https://placehold.co/600x400?text=Product+Image',
          showForm: false,
          formFields: []
        },
        tags: ['split', 'modern', 'product']
      }
    ],
    'social-proof': [
      {
        id: 'social-proof-testimonials',
        type: 'social-proof',
        name: 'Customer Testimonials',
        description: 'Display customer testimonials and company logos',
        template: {
          id: '',
          type: 'social-proof',
          order: 1,
          testimonials: [
            {
              id: 'testimonial-1',
              name: 'John Doe',
              role: 'CEO, Company Inc.',
              content: 'This product completely transformed our business operations.',
              avatar: 'https://placehold.co/80x80?text=JD',
              rating: 5
            }
          ],
          logos: [
            'https://placehold.co/120x60?text=Logo+1',
            'https://placehold.co/120x60?text=Logo+2',
            'https://placehold.co/120x60?text=Logo+3'
          ],
          showRatings: true
        },
        tags: ['testimonials', 'ratings', 'logos']
      }
    ],
    features: [
      {
        id: 'features-grid',
        type: 'features',
        name: 'Feature Grid',
        description: '3-column grid showcasing key features',
        template: {
          id: '',
          type: 'features',
          order: 2,
          title: 'Amazing Features',
          subtitle: 'Everything you need to succeed',
          items: [
            {
              id: 'feature-1',
              title: 'Easy Integration',
              description: 'Connect with your existing tools in minutes',
              icon: 'Zap'
            },
            {
              id: 'feature-2',
              title: 'Secure Platform',
              description: 'Enterprise-grade security for your peace of mind',
              icon: 'Shield'
            },
            {
              id: 'feature-3',
              title: '24/7 Support',
              description: 'Our team is always ready to help',
              icon: 'Headphones'
            }
          ],
          columns: 3
        },
        tags: ['grid', 'icons', 'benefits']
      }
    ],
    pricing: [
      {
        id: 'pricing-table',
        type: 'pricing',
        name: 'Simple Pricing Table',
        description: 'Three-tier pricing with clear value proposition',
        template: {
          id: '',
          type: 'pricing',
          order: 3,
          tiers: [
            {
              id: 'tier-basic',
              name: 'Basic',
              price: '$19',
              period: '/month',
              features: [
                'Up to 5 users',
                '1GB storage',
                'Email support'
              ],
              ctaText: 'Get Started',
              ctaUrl: '#',
              highlighted: false
            },
            {
              id: 'tier-pro',
              name: 'Professional',
              price: '$49',
              period: '/month',
              features: [
                'Up to 20 users',
                '10GB storage',
                'Priority support',
                'Advanced features'
              ],
              ctaText: 'Try Free',
              ctaUrl: '#',
              highlighted: true
            },
            {
              id: 'tier-enterprise',
              name: 'Enterprise',
              price: '$99',
              period: '/month',
              features: [
                'Unlimited users',
                'Unlimited storage',
                '24/7 dedicated support',
                'Custom integrations'
              ],
              ctaText: 'Contact Sales',
              ctaUrl: '#',
              highlighted: false
            }
          ]
        },
        tags: ['table', 'tiers', 'value']
      }
    ],
    faq: [
      {
        id: 'faq-basic',
        type: 'faq',
        name: 'Basic FAQ',
        description: 'Common questions with expandable answers',
        template: {
          id: '',
          type: 'faq',
          order: 4,
          items: [
            {
              id: 'faq-1',
              question: 'How does it work?',
              answer: 'Our platform connects seamlessly with your existing systems to provide instant value.'
            },
            {
              id: 'faq-2',
              question: 'What is your refund policy?',
              answer: 'We offer a 30-day money-back guarantee on all plans.'
            },
            {
              id: 'faq-3',
              question: 'Can I change plans later?',
              answer: 'Yes, you can upgrade or downgrade at any time.'
            }
          ],
          defaultOpen: 'faq-1'
        },
        tags: ['questions', 'answers', 'support']
      }
    ],
    contact: [
      {
        id: 'contact-form',
        type: 'contact',
        name: 'Contact Form',
        description: 'Simple contact form with business information',
        template: {
          id: '',
          type: 'contact',
          order: 5,
          title: 'Get in Touch',
          subtitle: 'Have questions? We\'re here to help.',
          email: 'contact@example.com',
          phone: '+1 (555) 123-4567',
          address: '123 Business Ave, Suite 100, City, Country',
          showForm: true,
          formFields: [
            {
              id: 'name-field',
              type: 'text',
              label: 'Name',
              placeholder: 'Your name',
              required: true
            },
            {
              id: 'email-field',
              type: 'email',
              label: 'Email',
              placeholder: 'Your email',
              required: true
            },
            {
              id: 'message-field',
              type: 'textarea',
              label: 'Message',
              placeholder: 'How can we help you?',
              required: true
            }
          ],
          ctaText: 'Send Message'
        },
        tags: ['form', 'information', 'support']
      }
    ],
    gallery: [
      {
        id: 'gallery-grid',
        type: 'gallery',
        name: 'Image Gallery Grid',
        description: 'Responsive grid of portfolio or product images',
        template: {
          id: '',
          type: 'gallery',
          order: 6,
          title: 'Our Work',
          subtitle: 'See what we\'ve accomplished',
          images: [
            {
              id: 'img-1',
              url: 'https://placehold.co/400x300?text=Project+1',
              alt: 'Project 1',
              caption: 'Project 1 Description'
            },
            {
              id: 'img-2',
              url: 'https://placehold.co/400x300?text=Project+2',
              alt: 'Project 2',
              caption: 'Project 2 Description'
            },
            {
              id: 'img-3',
              url: 'https://placehold.co/400x300?text=Project+3',
              alt: 'Project 3',
              caption: 'Project 3 Description'
            }
          ],
          layout: 'grid'
        },
        tags: ['portfolio', 'images', 'projects']
      }
    ],
    carousel: [
      {
        id: 'carousel-showcase',
        type: 'carousel',
        name: 'Image Carousel',
        description: 'Rotating showcase of products or services',
        template: {
          id: '',
          type: 'carousel',
          order: 7,
          title: 'Featured Products',
          items: [
            {
              id: 'slide-1',
              title: 'Product Feature 1',
              description: 'Description of the amazing feature',
              imageUrl: 'https://placehold.co/800x400?text=Product+1'
            },
            {
              id: 'slide-2',
              title: 'Product Feature 2',
              description: 'Another great feature worth highlighting',
              imageUrl: 'https://placehold.co/800x400?text=Product+2'
            },
            {
              id: 'slide-3',
              title: 'Product Feature 3',
              description: 'Final feature that seals the deal',
              imageUrl: 'https://placehold.co/800x400?text=Product+3'
            }
          ],
          autoPlay: true
        },
        tags: ['slider', 'products', 'showcase']
      }
    ],
    testimonials: [
      {
        id: 'testimonials-grid',
        type: 'testimonials',
        name: 'Testimonial Grid',
        description: 'Grid of customer testimonials with ratings',
        template: {
          id: '',
          type: 'testimonials',
          order: 8,
          title: 'What Our Customers Say',
          subtitle: 'Don\'t just take our word for it',
          testimonials: [
            {
              id: 'cust-testimonial-1',
              name: 'Sarah Johnson',
              role: 'Marketing Director',
              content: 'This platform helped increase our conversion rate by 40% in just two months.',
              avatar: 'https://placehold.co/80x80?text=SJ',
              rating: 5
            },
            {
              id: 'cust-testimonial-2',
              name: 'Michael Chen',
              role: 'CTO',
              content: 'Implementation was seamless and the ROI was immediate.',
              avatar: 'https://placehold.co/80x80?text=MC',
              rating: 5
            }
          ]
        },
        tags: ['reviews', 'feedback', 'success']
      }
    ],
    cta: [
      {
        id: 'cta-primary',
        type: 'cta',
        name: 'Primary Call to Action',
        description: 'Bold section encouraging user action',
        template: {
          id: '',
          type: 'cta',
          order: 9,
          title: 'Ready to Get Started?',
          subtitle: 'Join thousands of satisfied customers today',
          ctaText: 'Sign Up Now',
          ctaUrl: '#',
          variant: 'primary'
        },
        tags: ['action', 'conversion', 'button']
      }
    ],
    footer: [
      {
        id: 'footer-standard',
        type: 'footer',
        name: 'Standard Footer',
        description: 'Professional footer with links and copyright',
        template: {
          id: '',
          type: 'footer',
          order: 10,
          finalCtaText: 'Subscribe to our newsletter',
          finalCtaUrl: '#',
          socialLinks: [
            { platform: 'Twitter', url: '#' },
            { platform: 'LinkedIn', url: '#' },
            { platform: 'Facebook', url: '#' }
          ],
          legalLinks: [
            { text: 'Privacy Policy', url: '#' },
            { text: 'Terms of Service', url: '#' },
            { text: 'Cookie Policy', url: '#' }
          ],
          copyrightText: '© 2026 Your Company. All rights reserved.'
        },
        tags: ['links', 'legal', 'copyright']
      }
    ]
  };

  getBlocksByType(type: SectionType): PrebuiltBlock[] {
    return this.blocks[type] || [];
  }

  getBlockById(id: string, type: SectionType): PrebuiltBlock | undefined {
    return this.getBlocksByType(type).find(block => block.id === id);
  }

  instantiateBlock(block: PrebuiltBlock, overrides: Partial<any> = {}): any {
    const instance = JSON.parse(JSON.stringify(block.template));
    instance.id = overrides.id || uuidv4();

    // Apply overrides
    Object.assign(instance, overrides);
    
    return instance;
  }

  // Get relevant blocks based on user request
  getRelevantBlocks(userRequest: string): PrebuiltBlock[] {
    const requestLower = userRequest.toLowerCase();
    const relevantBlocks: PrebuiltBlock[] = [];

    // Iterate through all section types explicitly
    const allTypes: SectionType[] = [
      'hero', 'social-proof', 'faq', 'pricing', 'contact', 
      'features', 'gallery', 'carousel', 'testimonials', 'cta', 'footer'
    ];

    for (const type of allTypes) {
      const blocks = this.blocks[type];
      if (!blocks) continue;

      for (const block of blocks) {
        // Check if any tag matches the request
        const tagMatch = block.tags.some(tag => requestLower.includes(tag.toLowerCase()));
        if (tagMatch) {
          relevantBlocks.push(block);
          continue;
        }

        // Check if block name/description matches
        if (block.name.toLowerCase().includes(requestLower) || 
            block.description.toLowerCase().includes(requestLower)) {
          relevantBlocks.push(block);
          continue;
        }
      }
    }

    return relevantBlocks;
  }
}

export const prebuiltBlockService = new PrebuiltBlockService();