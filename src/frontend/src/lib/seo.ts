// SEO utility functions for dynamic meta tags and Open Graph support

export interface SEOConfig {
  title: string;
  description: string;
  keywords: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  canonical?: string;
}

const DEFAULT_SEO: SEOConfig = {
  title: 'Sumit Photo and Videography - Professional Photography & Videography Services',
  description: 'Professional photography and videography services by Sumit. Specializing in events, special moments, and high-quality visual storytelling.',
  keywords: 'photography, videography, professional photographer, event photography, special moments, photo gallery, wedding photography, portrait photography',
  ogImage: '/assets/generated/sumit-logo-transparent.dim_200x200.png',
  twitterCard: 'summary_large_image',
};

export function updateMetaTags(config: Partial<SEOConfig>) {
  const seoConfig = { ...DEFAULT_SEO, ...config };
  const baseUrl = window.location.origin;

  // Update title
  document.title = seoConfig.title;

  // Update or create meta tags
  updateMetaTag('description', seoConfig.description);
  updateMetaTag('keywords', seoConfig.keywords);

  // Open Graph tags
  updateMetaTag('og:title', seoConfig.ogTitle || seoConfig.title, 'property');
  updateMetaTag('og:description', seoConfig.ogDescription || seoConfig.description, 'property');
  updateMetaTag('og:image', seoConfig.ogImage ? `${baseUrl}${seoConfig.ogImage}` : `${baseUrl}${DEFAULT_SEO.ogImage}`, 'property');
  updateMetaTag('og:url', seoConfig.ogUrl || window.location.href, 'property');
  updateMetaTag('og:type', 'website', 'property');
  updateMetaTag('og:site_name', 'Sumit Photo and Videography', 'property');
  updateMetaTag('og:locale', 'en_US', 'property');

  // Twitter Card tags
  updateMetaTag('twitter:card', seoConfig.twitterCard || DEFAULT_SEO.twitterCard || 'summary_large_image');
  updateMetaTag('twitter:title', seoConfig.ogTitle || seoConfig.title);
  updateMetaTag('twitter:description', seoConfig.ogDescription || seoConfig.description);
  updateMetaTag('twitter:image', seoConfig.ogImage ? `${baseUrl}${seoConfig.ogImage}` : `${baseUrl}${DEFAULT_SEO.ogImage}`);

  // Canonical URL
  updateLinkTag('canonical', seoConfig.canonical || window.location.href);

  // Language
  document.documentElement.lang = 'en';
}

function updateMetaTag(name: string, content: string, attribute: 'name' | 'property' = 'name') {
  let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
  
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }
  
  element.content = content;
}

function updateLinkTag(rel: string, href: string) {
  let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
  
  if (!element) {
    element = document.createElement('link');
    element.rel = rel;
    document.head.appendChild(element);
  }
  
  element.href = href;
}

// Page-specific SEO configurations
export const PAGE_SEO_CONFIGS: Record<string, SEOConfig> = {
  home: {
    title: 'Sumit Photo and Videography - Professional Photography & Videography Services',
    description: 'Professional photography and videography services by Sumit. Specializing in events, special moments, and high-quality visual storytelling.',
    keywords: 'photography, videography, professional photographer, event photography, special moments, photo gallery, wedding photography',
    ogImage: '/assets/generated/cinematic-hero-bg.dim_1200x800.jpg',
  },
  photos: {
    title: 'Photo Gallery - Sumit Photo and Videography',
    description: 'Browse our stunning photo gallery featuring professional photography work by Sumit. High-quality images available for viewing and download.',
    keywords: 'photo gallery, professional photos, photography portfolio, image gallery, downloadable photos, wedding photos, event photos',
    ogImage: '/assets/generated/cinematic-gallery-bg.dim_1200x600.jpg',
  },
  videos: {
    title: 'Video Gallery - Sumit Photo and Videography',
    description: 'Explore our professional video gallery showcasing videography work by Sumit. High-quality videos with full-screen playback.',
    keywords: 'video gallery, professional videos, videography portfolio, video playback, cinematic videos, wedding videos, event videos',
    ogImage: '/assets/generated/cinematic-video-hero.dim_800x600.jpg',
  },
  events: {
    title: 'Events - Sumit Photo and Videography',
    description: 'View our event photography gallery featuring weddings, celebrations, and special occasions captured by Sumit.',
    keywords: 'event photography, wedding photography, celebration photos, event gallery, professional events, event coverage',
    ogImage: '/assets/generated/cinematic-event-hero.dim_800x600.jpg',
  },
  specialMoments: {
    title: 'Special Moments - Sumit Photo and Videography',
    description: 'Discover our Special Moments gallery featuring intimate and memorable photography by Sumit. Beautiful moments captured professionally.',
    keywords: 'special moments, intimate photography, memorable photos, special occasions, professional moments, family photography',
    ogImage: '/assets/generated/cinematic-special-moments-bg.dim_800x600.jpg',
  },
  contact: {
    title: 'Contact - Sumit Photo and Videography',
    description: 'Get in touch with Sumit for professional photography and videography services. Contact information and social media links.',
    keywords: 'contact photographer, photography services, videography contact, professional photographer contact, hire photographer',
    ogImage: '/assets/generated/portfolio-showcase.dim_800x600.jpg',
  },
};
