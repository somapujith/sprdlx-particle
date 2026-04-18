import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const SCREENSHOTS_DIR = 'h:/Super Delux Project/Creativity/sprdlx/e2e-screenshots';

test('EarthquakeParticleHero visibility check on /about', async ({ page }) => {
  // Ensure screenshots dir exists
  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  }

  const consoleErrors: string[] = [];
  const networkRequests: { url: string; status: number | null; failed: boolean }[] = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error' || msg.type() === 'warning') {
      consoleErrors.push(`[${msg.type()}] ${msg.text()}`);
    }
  });

  page.on('requestfailed', (request) => {
    networkRequests.push({ url: request.url(), status: null, failed: true });
  });

  page.on('response', (response) => {
    if (response.url().includes('.glb')) {
      networkRequests.push({ url: response.url(), status: response.status(), failed: false });
    }
  });

  // Navigate to /about
  await page.goto('http://localhost:5174/about', { waitUntil: 'domcontentloaded' });

  // Wait 5 seconds then screenshot
  await page.waitForTimeout(5000);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'about-5s.png'), fullPage: false });

  // Wait 5 more seconds (10s total)
  await page.waitForTimeout(5000);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'about-10s.png'), fullPage: false });

  // Wait 5 more seconds (15s total)
  await page.waitForTimeout(5000);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'about-15s.png'), fullPage: false });

  // Check for canvas element (Three.js renders into canvas)
  const canvas = page.locator('canvas').first();
  const canvasVisible = await canvas.isVisible().catch(() => false);

  // Check WebGL context via evaluate
  const webglStatus = await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return 'NO_CANVAS';
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) return 'NO_WEBGL';
    return 'WEBGL_OK';
  });

  // Get canvas bounding box and pixel data
  const canvasPixelData = await page.evaluate(() => {
    const canvas = document.querySelector('canvas') as HTMLCanvasElement;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();

    // Sample center pixel via gl.readPixels
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl') as WebGLRenderingContext | null;
    if (!gl) return { rect: { width: rect.width, height: rect.height }, centerPixel: null };

    const pixels = new Uint8Array(4);
    const cx = Math.floor(canvas.width / 2);
    const cy = Math.floor(canvas.height / 2);
    (gl as WebGLRenderingContext).readPixels(cx, cy, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

    return {
      rect: { width: rect.width, height: rect.height },
      centerPixel: Array.from(pixels),
      canvasWidth: canvas.width,
      canvasHeight: canvas.height,
    };
  });

  console.log('=== EARTHQUAKE PARTICLE HERO TEST RESULTS ===');
  console.log('Canvas visible:', canvasVisible);
  console.log('WebGL status:', webglStatus);
  console.log('Canvas data:', JSON.stringify(canvasPixelData, null, 2));
  console.log('Console errors:', consoleErrors.length > 0 ? consoleErrors : 'NONE');
  console.log('GLB network requests:', networkRequests.filter(r => r.url.includes('.glb')));

  // Basic assertions
  expect(canvasVisible, 'Canvas should be visible on the page').toBe(true);
  expect(webglStatus, 'WebGL context should be available').toBe('WEBGL_OK');
});
