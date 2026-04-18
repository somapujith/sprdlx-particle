/**
 * Generate optimized image URLs with compression
 * Supports WebP with fallback
 */
export function getOptimizedImageUrl(
  url: string,
  width: number,
  format: 'webp' | 'jpg' = 'webp'
): string {
  // If URL is from Unsplash, add optimization params
  if (url.includes('unsplash.com')) {
    return `${url}&w=${width}&q=75&fm=${format}&fit=crop`;
  }

  // For other CDNs, add custom logic as needed
  return url;
}

/**
 * Picture element with WebP fallback
 */
export function createPictureElement(
  src: string,
  alt: string,
  width: number = 800
): string {
  const webpUrl = getOptimizedImageUrl(src, width, 'webp');
  const jpgUrl = getOptimizedImageUrl(src, width, 'jpg');

  return `
    <picture>
      <source srcset="${webpUrl}" type="image/webp" />
      <source srcset="${jpgUrl}" type="image/jpeg" />
      <img src="${jpgUrl}" alt="${alt}" loading="lazy" />
    </picture>
  `;
}
