import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogType?: 'website' | 'article';
  ogImage?: string;
  noIndex?: boolean;
  schema?: Record<string, unknown> | Record<string, unknown>[];
}

const BASE_URL = 'https://sprdlx.com';
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.png`;

export function useSEO({
  title,
  description,
  canonical,
  ogType = 'website',
  ogImage = DEFAULT_OG_IMAGE,
  noIndex = false,
  schema,
}: SEOProps): void {
  useEffect(() => {
    // Title
    document.title = title;

    const setMeta = (selector: string, content: string) => {
      let el = document.querySelector<HTMLMetaElement>(selector);
      if (!el) {
        el = document.createElement('meta');
        // Parse attribute from selector e.g. meta[name="description"] → name="description"
        const nameMatch = selector.match(/\[name="([^"]+)"\]/);
        const propMatch = selector.match(/\[property="([^"]+)"\]/);
        if (nameMatch) el.setAttribute('name', nameMatch[1]);
        if (propMatch) el.setAttribute('property', propMatch[1]);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    const canonicalUrl = canonical ? `${BASE_URL}${canonical}` : `${BASE_URL}${window.location.pathname}`;

    setMeta('meta[name="description"]', description);
    setMeta('meta[name="robots"]', noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1');

    setMeta('meta[property="og:title"]', title);
    setMeta('meta[property="og:description"]', description);
    setMeta('meta[property="og:type"]', ogType);
    setMeta('meta[property="og:url"]', canonicalUrl);
    setMeta('meta[property="og:image"]', ogImage);

    setMeta('meta[name="twitter:title"]', title);
    setMeta('meta[name="twitter:description"]', description);
    setMeta('meta[name="twitter:image"]', ogImage);

    // Canonical link
    let canonicalEl = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonicalEl) {
      canonicalEl = document.createElement('link');
      canonicalEl.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.setAttribute('href', canonicalUrl);

    // JSON-LD schema injection
    if (schema) {
      const schemas = Array.isArray(schema) ? schema : [schema];
      const existingScripts = document.querySelectorAll('script[data-schema="page"]');
      existingScripts.forEach((s) => s.remove());

      schemas.forEach((s) => {
        const scriptEl = document.createElement('script');
        scriptEl.type = 'application/ld+json';
        scriptEl.setAttribute('data-schema', 'page');
        scriptEl.textContent = JSON.stringify(s);
        document.head.appendChild(scriptEl);
      });
    }
  }, [title, description, canonical, ogType, ogImage, noIndex, schema]);
}
