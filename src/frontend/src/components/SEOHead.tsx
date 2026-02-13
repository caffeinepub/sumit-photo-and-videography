import { useEffect } from 'react';
import { updateMetaTags, PAGE_SEO_CONFIGS, type SEOConfig } from '../lib/seo';

interface SEOHeadProps {
  page: keyof typeof PAGE_SEO_CONFIGS;
  customConfig?: Partial<SEOConfig>;
}

export default function SEOHead({ page, customConfig }: SEOHeadProps) {
  useEffect(() => {
    const config = PAGE_SEO_CONFIGS[page];
    if (config) {
      updateMetaTags({ ...config, ...customConfig });
    }
  }, [page, customConfig]);

  return null;
}
