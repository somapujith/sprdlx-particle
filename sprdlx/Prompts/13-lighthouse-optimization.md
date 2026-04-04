# Prompt 13 — Lighthouse 90+ Optimization
# Category: Performance & Quality
# Stack: React + Vite + TypeScript
# Target: 90+ Performance, 95+ Accessibility, 95+ Best Practices, 95+ SEO

---

## CATEGORY 1 — PERFORMANCE

### Images
- Every <img> must have width + height (prevents CLS)
- Hero/LCP image: fetchPriority="high", NO loading="lazy"
- All below-fold images: loading="lazy" decoding="async"
- Add preload hint for LCP image in index.html:
  <link rel="preload" as="image" href="/hero.webp" />
- Convert all images to WebP (flag non-WebP for manual conversion)

### Fonts
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="preload" as="style"
  href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
  onload="this.rel='stylesheet'" />
<noscript>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter..." />
</noscript>
```
Add font-display: swap to all @font-face declarations.

### Code Splitting
All routes lazy-loaded. See prompt 12.

### Render-blocking
- All <script> tags: add defer (or type="module" which is auto-deferred)
- No synchronous scripts in <head>

### Vite Build
```ts
build: {
  rollupOptions: { output: { manualChunks: { 'react-vendor': ['react','react-dom'] } } },
  assetsInlineLimit: 4096,
  chunkSizeWarningLimit: 500,
  sourcemap: false,
}
```

---

## CATEGORY 2 — ACCESSIBILITY

See prompt 15 (Accessibility Audit) for full details.
Key items for Lighthouse score:
- Every <img> has alt attribute
- Every form input has associated <label>
- No outline:none without replacement focus style
- Page has <h1>, correct heading hierarchy
- Color contrast ≥ 4.5:1 for normal text

---

## CATEGORY 3 — BEST PRACTICES

### Security Headers (vercel.json or netlify _headers)
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" }
      ]
    },
    {
      "source": "/assets/(.*)",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }]
    }
  ]
}
```

### No Console Errors
Remove all console.log from production code:
→ Gate behind: if (import.meta.env.DEV) console.log(...)

### No HTTP Links
→ Change all http:// to https://

---

## CATEGORY 4 — SEO

### index.html HEAD (required)
```html
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>App Name — Short tagline</title>
<meta name="description" content="150-160 char description" />
<meta name="robots" content="index, follow" />
<link rel="canonical" href="https://yourdomain.com" />
<meta property="og:title" content="App Name" />
<meta property="og:description" content="Same as description" />
<meta property="og:image" content="https://yourdomain.com/og-image.png" />
<meta property="og:url" content="https://yourdomain.com" />
<meta property="og:type" content="website" />
<meta name="twitter:card" content="summary_large_image" />
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
```

### Per-page meta (react-helmet-async)
Install: npm install react-helmet-async
Every page component gets a <Helmet> block with unique title + description.

### public/robots.txt
```
User-agent: *
Allow: /
Sitemap: https://yourdomain.com/sitemap.xml
```

### public/sitemap.xml
One <url> entry for every public route.

### Link text
Replace all "click here", "read more" with descriptive text.

---

## SCORE TARGETS

| Category | Target | Biggest wins |
|---|---|---|
| Performance | 90+ | Code splitting, image optimization |
| Accessibility | 95+ | Labels, ARIA, contrast |
| Best Practices | 95+ | Security headers, no console errors |
| SEO | 95+ | Meta tags, robots.txt, descriptive links |

Run Lighthouse on production build, not dev server.
