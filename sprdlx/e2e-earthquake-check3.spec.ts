import { test } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const SCREENSHOTS_DIR = 'h:/Super Delux Project/Creativity/sprdlx/e2e-screenshots';

test('EarthquakeParticleHero - wait for hero to actually reveal', async ({ page }) => {
  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  }

  const consoleMessages: string[] = [];
  page.on('console', (msg) => {
    consoleMessages.push(`[${msg.type()}] ${msg.text()}`);
  });

  // Navigate without networkidle so timers start immediately
  await page.goto('http://localhost:5174/about', { waitUntil: 'domcontentloaded' });

  // Wait for loading overlay to fade away (opacity: 0 = hero should be visible)
  // The isEntryBlocking overlay has aria-hidden="true" and opacity transitions
  // LoadingScreen runs 3200ms + 1150ms fade = ~4350ms, plus forceReveal at 1500ms within About
  // So we expect reveal around 4-5s after load

  // Poll for overlay to become transparent
  let overlayGone = false;
  for (let i = 0; i < 20; i++) {
    await page.waitForTimeout(1000);
    const opacity = await page.evaluate(() => {
      // Check the fixed black overlay in About.tsx (z-[9999])
      const overlays = Array.from(document.querySelectorAll('[aria-hidden="true"]'));
      const fixedBlack = overlays.find(el => {
        const s = window.getComputedStyle(el);
        return s.position === 'fixed' && s.backgroundColor.includes('0, 0, 0');
      }) as HTMLElement | null;
      return fixedBlack ? window.getComputedStyle(fixedBlack).opacity : 'not-found';
    });

    const loadingScreenGone = await page.evaluate(() => {
      // LoadingScreen is the Framer motion div with bg-[#0a0a0a]
      const el = document.querySelector('.fixed.inset-0.z-50') as HTMLElement | null;
      if (!el) return 'removed';
      return window.getComputedStyle(el).opacity;
    });

    console.log(`t=${i+1}s: overlay=${opacity}, loadingScreen=${loadingScreenGone}`);

    if (opacity === '0' || opacity === 'not-found') {
      overlayGone = true;
      console.log(`Hero revealed at t=${i+1}s`);
      break;
    }
  }

  // Take screenshot after hero reveal (or timeout)
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'hero-revealed.png'), fullPage: false });

  // Sample canvas pixels
  const pixelResult = await page.evaluate(() => {
    const canvases = Array.from(document.querySelectorAll('canvas'));
    const results = canvases.map((canvas, i) => {
      const rect = canvas.getBoundingClientRect();
      const gl = (canvas.getContext('webgl2') || canvas.getContext('webgl')) as WebGLRenderingContext | null;
      if (!gl) return { index: i, error: 'no webgl', rect: { w: rect.width, h: rect.height } };

      const pixels = new Uint8Array(4);
      const cx = Math.floor(canvas.width / 2);
      const cy = Math.floor(canvas.height / 2);
      gl.readPixels(cx, cy, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

      // Sample a grid of points
      const gridSamples: number[][] = [];
      for (let row = 1; row <= 4; row++) {
        for (let col = 1; col <= 4; col++) {
          const px = new Uint8Array(4);
          gl.readPixels(
            Math.floor(canvas.width * (col / 5)),
            Math.floor(canvas.height * (row / 5)),
            1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px
          );
          gridSamples.push(Array.from(px));
        }
      }
      const anyNonBlack = gridSamples.some(p => p[0] > 5 || p[1] > 5 || p[2] > 5);

      return {
        index: i,
        size: { w: canvas.width, h: canvas.height },
        rect: { w: Math.round(rect.width), h: Math.round(rect.height), top: Math.round(rect.top) },
        centerPixel: Array.from(pixels),
        anyNonBlack,
        nonBlackSamples: gridSamples.filter(p => p[0] > 5 || p[1] > 5 || p[2] > 5),
      };
    });
    return results;
  });

  console.log('=== CANVAS PIXEL ANALYSIS ===');
  console.log(JSON.stringify(pixelResult, null, 2));
  console.log('Hero overlay gone:', overlayGone);
  console.log('All console messages (errors/warnings):');
  consoleMessages.filter(m => m.includes('[error]')).forEach(m => console.log(m));
});
