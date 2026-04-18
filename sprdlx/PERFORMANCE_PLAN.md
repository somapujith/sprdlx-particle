# Performance Optimization Plan

## Phase 1: Code Splitting & Lazy Loading

### Route-level code splitting
- Dynamic import About route
- Lazy load Canvas component
- Load Spline async

### Lazy 3D on scroll
- Intersection Observer for Canvas
- Don't render until visible

## Phase 2: 3D Optimization

### Canvas improvements
- Reduce DPR for low-end devices
- Pause render when tab inactive
- Dispose materials/textures on unmount
- Use InstancedMesh for repeated objects

### Spline optimization
- Compress GLB models with Draco
- Load model only on demand
- Cache Spline asset

## Phase 3: Animation Performance

### Reduce simultaneous animators
- GSAP + Framer Motion conflict = double-dispatch
- Move non-critical animations to CSS
- Batch ScrollTrigger queries

### Use requestAnimationFrame wisely
- No `setInterval` for scroll (use RAF)
- Throttle pointer events

## Phase 4: Network & Caching

### Asset compression
- WebP images with fallback
- Draco compression for GLB
- Minify SVG

### Browser caching
- Cache-Control headers
- Service Worker for offline

## Phase 5: Device-Aware Rendering

### Detect low-end devices
- Reduce FPS on mobile
- Lower polygon count on old browsers
- Disable shadows/post-processing

### Memory optimization
- Unload 3D when navigating away
- Clear WebGL context

---

## Expected Gains

| Metric | Current | Target |
|--------|---------|--------|
| FCP | ~3.5s | ~1.8s |
| LCP | ~4.2s | ~2.5s |
| CLS | 0.15 | <0.10 |
| CPU (3D scene) | 45% | <20% |

