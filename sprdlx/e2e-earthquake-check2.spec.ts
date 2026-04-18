import { test } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const SCREENSHOTS_DIR = 'h:/Super Delux Project/Creativity/sprdlx/e2e-screenshots';

test('EarthquakeParticleHero after loading screen completes', async ({ page }) => {
  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  }

  const consoleErrors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(`[error] ${msg.text()}`);
    }
  });

  // Navigate with networkidle to catch GLB load
  await page.goto('http://localhost:5174/about', { waitUntil: 'networkidle' });

  // Wait for loading screen to complete (3200ms animation + 1150ms fade + buffer)
  await page.waitForTimeout(6000);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'after-loading-6s.png'), fullPage: false });

  // Wait more to let Three.js render fully
  await page.waitForTimeout(5000);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'after-loading-11s.png'), fullPage: false });

  // Sample pixels from the canvas
  const result = await page.evaluate(() => {
    const canvas = document.querySelector('canvas') as HTMLCanvasElement | null;
    if (!canvas) return { error: 'no canvas' };

    const rect = canvas.getBoundingClientRect();

    // Try to get pixel data from multiple sample points
    const gl = (canvas.getContext('webgl2') || canvas.getContext('webgl')) as WebGLRenderingContext | null;
    if (!gl) return { error: 'no webgl', rect };

    const samples: { x: number; y: number; pixel: number[] }[] = [];
    const points = [
      [0.5, 0.5],   // center
      [0.3, 0.5],   // left-center
      [0.7, 0.5],   // right-center
      [0.5, 0.3],   // top-center
      [0.5, 0.7],   // bottom-center
    ];

    for (const [xRatio, yRatio] of points) {
      const pixels = new Uint8Array(4);
      const cx = Math.floor(canvas.width * xRatio);
      const cy = Math.floor(canvas.height * yRatio);
      gl.readPixels(cx, cy, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
      samples.push({ x: Math.round(xRatio * 100), y: Math.round(yRatio * 100), pixel: Array.from(pixels) });
    }

    // Check if page overlay (the black blocking div) is transparent
    const overlay = document.querySelector('[aria-hidden="true"]') as HTMLElement | null;
    const overlayOpacity = overlay ? window.getComputedStyle(overlay).opacity : 'unknown';

    return {
      canvasSize: { w: canvas.width, h: canvas.height },
      rect: { w: rect.width, h: rect.height },
      samples,
      overlayOpacity,
    };
  });

  console.log('=== POST-LOADING RESULTS ===');
  console.log(JSON.stringify(result, null, 2));
  console.log('Console errors:', consoleErrors.length > 0 ? consoleErrors : 'NONE');

  // Check if any pixel has non-zero color (meaning something is rendered)
  if ('samples' in result && result.samples) {
    const anyNonBlack = result.samples.some(s => s.pixel[0] > 5 || s.pixel[1] > 5 || s.pixel[2] > 5);
    console.log('Any non-black pixels rendered:', anyNonBlack);
    if (!anyNonBlack) {
      console.log('WARNING: All sampled pixels are black/transparent - globe may be invisible');
    }
  }
});
