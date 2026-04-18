/**
 * Focused screenshot: Wait for full particle load then capture hero
 */
import { chromium } from 'playwright';

const SCREENSHOTS_DIR = 'H:/Super Delux Project/Creativity/sprdlx/e2e-screenshots';

const browser = await chromium.launch({
  headless: true,
  args: ['--enable-gpu', '--use-angle=default', '--enable-webgl', '--no-sandbox'],
});

const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

await page.goto('http://localhost:5174/about', { waitUntil: 'networkidle', timeout: 30000 });

// Wait for loading screen to disappear (isEntryBlocking becomes false)
// The failsafe is 1500ms, so wait 2.5s post-navigation
await page.waitForTimeout(5000);

// Check if loading overlay is gone
const loadingState = await page.evaluate(() => {
  // Look for any loading overlay or cover element
  const covers = document.querySelectorAll('[class*="cover"], [class*="loading"], [class*="overlay"]');
  const canvas = document.querySelector('#about-hero canvas');
  const heroTitle = document.querySelector('h1');
  return {
    coverCount: covers.length,
    canvasWidth: canvas?.width,
    canvasHeight: canvas?.height,
    heroTitleText: heroTitle?.textContent?.trim().slice(0, 50),
  };
});
console.log('Loading state at 5s:', loadingState);

await page.screenshot({ path: `${SCREENSHOTS_DIR}/06-hero-fully-loaded.png`, fullPage: false });
console.log('Screenshot 06: Hero fully loaded');

// Wait even longer for particles
await page.waitForTimeout(5000);
await page.screenshot({ path: `${SCREENSHOTS_DIR}/07-hero-10s.png`, fullPage: false });
console.log('Screenshot 07: Hero at 10s');

// Check WebGL rendering with longer wait
const pixelCheck = await page.evaluate(() => {
  const canvases = document.querySelectorAll('canvas');
  const results = [];
  canvases.forEach((canvas, i) => {
    try {
      const gl = canvas.getContext('webgl') || canvas.getContext('webgl2');
      if (!gl) { results.push({ index: i, noContext: true }); return; }

      // Read pixels from center and corners
      const pixels = new Uint8Array(4);
      const cx = Math.floor(canvas.width / 2);
      const cy = Math.floor(canvas.height / 2);
      gl.readPixels(cx, cy, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

      // Also read top-right (where particles might glow)
      const pixels2 = new Uint8Array(4);
      gl.readPixels(Math.floor(canvas.width * 0.7), Math.floor(canvas.height * 0.3), 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels2);

      results.push({
        index: i,
        size: `${canvas.width}x${canvas.height}`,
        center: Array.from(pixels),
        topRight: Array.from(pixels2),
        centerAlpha: pixels[3],
        topRightAlpha: pixels2[3],
        anyRendering: pixels[3] > 0 || pixels2[3] > 0,
      });
    } catch (e) {
      results.push({ index: i, error: e.message });
    }
  });
  return results;
});

console.log('Pixel check at 10s:', JSON.stringify(pixelCheck, null, 2));

await browser.close();
