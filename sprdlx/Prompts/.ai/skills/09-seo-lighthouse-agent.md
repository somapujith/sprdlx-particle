# Skill: SEO + Lighthouse Agent
# Agent: FRONTEND — every page, index.html, and build config
# Stack: React + Vite + TypeScript
# Target: Lighthouse 90+ on all 4 categories

---

## INDEX.HTML — REQUIRED BASELINE

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <!-- Primary SEO -->
  <title>App Name — Short tagline</title>
  <meta name="description" content="150-160 character description of the page." />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="https://yourdomain.com" />

  <!-- Open Graph -->
  <meta property="og:title" content="App Name" />
  <meta property="og:description" content="Same as meta description" />
  <meta property="og:image" content="https://yourdomain.com/og-image.png" />
  <meta property="og:url" content="https://yourdomain.com" />
  <meta property="og:type" content="website" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="App Name" />
  <meta name="twitter:description" content="Same as meta description" />
  <meta name="twitter:image" content="https://yourdomain.com/og-image.png" />

  <!-- Favicon -->
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

  <!-- Font preconnect — before font link -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    rel="preload"
    as="style"
    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
    onload="this.rel='stylesheet'"
  />
  <noscript>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" />
  </noscript>

  <!-- Structured data -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "App Name",
    "url": "https://yourdomain.com",
    "description": "What the app does",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web"
  }
  </script>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>
```

---

## PER-PAGE META TAGS — react-helmet-async

Install: `npm install react-helmet-async`

```tsx
// src/main.tsx
import { HelmetProvider } from 'react-helmet-async';
root.render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);

// src/pages/Dashboard.tsx — every page gets its own Helmet
import { Helmet } from 'react-helmet-async';

export default function Dashboard() {
  return (
    <>
      <Helmet>
        <title>Dashboard — App Name</title>
        <meta name="description" content="Manage your account and view analytics." />
        <link rel="canonical" href="https://yourdomain.com/dashboard" />
        <meta property="og:title" content="Dashboard — App Name" />
        <meta property="og:url" content="https://yourdomain.com/dashboard" />
      </Helmet>
      {/* page content */}
    </>
  );
}
```

Rules:
- Every page in `src/pages/` MUST have a `<Helmet>` block.
- `<title>` format: `Page Name — App Name`
- `<meta name="description">` must be 120-160 characters.
- `<link rel="canonical">` must point to the page's full URL.

---

## PUBLIC FILES

### public/robots.txt
```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Sitemap: https://yourdomain.com/sitemap.xml
```

### public/sitemap.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://yourdomain.com/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://yourdomain.com/dashboard</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <!-- Add a <url> for every public route -->
</urlset>
```

---

## SECURITY HEADERS — public/_headers (Netlify) or vercel.json

### Netlify — public/_headers
```
/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()

/assets/*
  Cache-Control: public, max-age=31536000, immutable
```

### Vercel — vercel.json
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options",  "value": "nosniff" },
        { "key": "X-Frame-Options",         "value": "DENY" },
        { "key": "Referrer-Policy",         "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy",      "value": "camera=(), microphone=(), geolocation=()" }
      ]
    },
    {
      "source": "/assets/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```

---

## CORE WEB VITALS RULES

### LCP (Largest Contentful Paint) — target < 2.5s
- Hero image must have `fetchPriority="high"` and NO `loading="lazy"`
- Add `<link rel="preload" as="image" href="/hero.webp" />` in `<head>`
- All routes must be code-split (see performance-agent.md)
- No render-blocking scripts in `<head>`

### CLS (Cumulative Layout Shift) — target < 0.1
- All images must have explicit `width` and `height`
- Font loading must use `font-display: swap`
- Reserve space for dynamic content (skeleton loaders)
- No content injected above existing content after load

### INP (Interaction to Next Paint) — target < 200ms
- Long event handlers must be broken up with `setTimeout` or `startTransition`
- Heavy synchronous work must be deferred: `React.startTransition(() => setState(...))`
- Avoid re-rendering large lists — paginate or virtualize (> 100 items)

---

## LINK TEXT — SEO AND ACCESSIBILITY

```tsx
// ❌ Never — meaningless to screen readers and search engines
<a href="/docs">Click here</a>
<a href="/pricing">Read more</a>
<a href="/about">Learn more</a>

// ✅ Always — descriptive
<a href="/docs">Read the API documentation</a>
<a href="/pricing">View pricing plans</a>
<a href="/about">Learn about our team</a>

// ✅ External links
<a href="https://external.com" target="_blank" rel="noopener noreferrer"
   aria-label="Open GitHub repository (opens in new tab)">
  GitHub
</a>
```

---

## LIGHTHOUSE SCORE TARGETS

| Category | Target | Key factors |
|---|---|---|
| Performance | 90+ | Code splitting, image optimization, font loading |
| Accessibility | 95+ | ARIA, contrast, semantic HTML, keyboard nav |
| Best Practices | 95+ | HTTPS, no console errors, security headers |
| SEO | 95+ | Meta tags, robots.txt, sitemap, descriptive links |

Run Lighthouse in Chrome DevTools → Lighthouse tab → select all categories → Analyze.
Always run on a production build (`npm run build && npm run preview`), not dev server.
