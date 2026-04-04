# Prompt 29 — SEO Complete Setup
# Category: Documentation / Visibility
# Stack: React + Vite + TypeScript

Make this project fully discoverable by search engines and social platforms.

---

## STEP 1 — index.html HEAD

Replace the existing <head> with this complete version:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <!-- Primary SEO -->
  <title>App Name — Short tagline (under 60 chars)</title>
  <meta name="description" content="150-160 character description. Include your primary keyword." />
  <meta name="keywords" content="keyword1, keyword2, keyword3" />
  <meta name="author" content="Your Name or Company" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="https://yourdomain.com" />

  <!-- Open Graph (Facebook, LinkedIn, WhatsApp) -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://yourdomain.com" />
  <meta property="og:title" content="App Name — Short tagline" />
  <meta property="og:description" content="Same as meta description" />
  <meta property="og:image" content="https://yourdomain.com/og-image.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:site_name" content="App Name" />
  <meta property="og:locale" content="en_US" />

  <!-- Twitter / X Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@yourhandle" />
  <meta name="twitter:creator" content="@yourhandle" />
  <meta name="twitter:title" content="App Name — Short tagline" />
  <meta name="twitter:description" content="Same as meta description" />
  <meta name="twitter:image" content="https://yourdomain.com/og-image.png" />

  <!-- Favicons -->
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
  <link rel="manifest" href="/site.webmanifest" />
  <meta name="theme-color" content="#3b82f6" />

  <!-- Structured data -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "App Name",
    "url": "https://yourdomain.com",
    "description": "What the app does",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
  }
  </script>
</head>
```

---

## STEP 2 — Per-page meta with react-helmet-async

Install: npm install react-helmet-async

Wrap in main.tsx:
```tsx
import { HelmetProvider } from 'react-helmet-async';
<HelmetProvider><App /></HelmetProvider>
```

Every page component gets a Helmet block:
```tsx
import { Helmet } from 'react-helmet-async';

export default function Dashboard() {
  return (
    <>
      <Helmet>
        <title>Dashboard — App Name</title>
        <meta name="description" content="Manage your account, view analytics, and track performance." />
        <link rel="canonical" href="https://yourdomain.com/dashboard" />
        <meta property="og:title" content="Dashboard — App Name" />
        <meta property="og:url" content="https://yourdomain.com/dashboard" />
      </Helmet>
      {/* page content */}
    </>
  );
}
```

---

## STEP 3 — public/robots.txt

```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /dashboard/  # if auth-gated
Sitemap: https://yourdomain.com/sitemap.xml
```

---

## STEP 4 — public/sitemap.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://yourdomain.com/</loc>
    <lastmod>2025-01-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://yourdomain.com/about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://yourdomain.com/pricing</loc>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>
```

---

## STEP 5 — public/site.webmanifest

```json
{
  "name": "App Name",
  "short_name": "App",
  "description": "Short description",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#3b82f6",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

---

## STEP 6 — Link text audit

Find and fix:
- <a>Click here</a> → <a>Read the documentation</a>
- <a>Read more</a> → <a>Read more about our pricing</a>
- <a href="#"> with onClick → use <button>
- External links: add rel="noopener noreferrer" + target="_blank"

---

## OG IMAGE

Create a 1200×630px image at public/og-image.png.
It should show: your app name, tagline, and brand colors.
Tools: Figma, Canva, or a Next.js OG image generator.

---

## DELIVERY

1. Updated index.html
2. main.tsx with HelmetProvider
3. Every page component with Helmet block
4. public/robots.txt
5. public/sitemap.xml (one entry per public route)
6. public/site.webmanifest
7. List of link text violations found and fixed
