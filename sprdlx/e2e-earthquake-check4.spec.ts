import { test } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const SCREENSHOTS_DIR = 'h:/Super Delux Project/Creativity/sprdlx/e2e-screenshots';

test('Deep diagnosis of EarthquakeParticleHero WebGL rendering', async ({ page }) => {
  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  }

  await page.goto('http://localhost:5174/about', { waitUntil: 'domcontentloaded' });

  // Wait for About's isEntryBlocking overlay to clear (forceReveal fires at 1500ms)
  await page.waitForTimeout(5000);

  // Take Playwright screenshot (uses its own rendering pipeline, not WebGL readPixels)
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'playwright-screenshot.png') });

  // Deep canvas inspection
  const diagnosis = await page.evaluate(() => {
    const canvas = document.querySelector('canvas') as HTMLCanvasElement | null;
    if (!canvas) return { error: 'no canvas found' };

    const rect = canvas.getBoundingClientRect();

    // Check WebGL renderer info
    const gl = canvas.getContext('webgl2') as WebGL2RenderingContext | null ||
               canvas.getContext('webgl') as WebGLRenderingContext | null;

    if (!gl) return { error: 'no webgl context' };

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'unknown';
    const vendor = debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : 'unknown';

    // Check clear color
    const clearColor = gl.getParameter(gl.COLOR_CLEAR_VALUE);

    // Check if canvas is visible in DOM
    const style = window.getComputedStyle(canvas);

    // Check parent visibility
    let parent = canvas.parentElement;
    const parentStyles: string[] = [];
    while (parent && parentStyles.length < 5) {
      const s = window.getComputedStyle(parent);
      parentStyles.push(`${parent.tagName}.${parent.className.split(' ').join('.')}: opacity=${s.opacity} display=${s.display} visibility=${s.visibility}`);
      parent = parent.parentElement;
    }

    // Read pixels from multiple locations
    const allSamples: {pos: string; pixel: number[]}[] = [];
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        const px = new Uint8Array(4);
        const x = Math.floor(canvas.width * (col + 0.5) / 5);
        const y = Math.floor(canvas.height * (row + 0.5) / 5);
        gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px);
        if (px[0] > 0 || px[1] > 0 || px[2] > 0 || px[3] > 0) {
          allSamples.push({ pos: `${col},${row}`, pixel: Array.from(px) });
        }
      }
    }

    // Check if Three.js R3F is mounted
    const r3fRoot = (canvas as any).__r3f;

    return {
      canvasSize: { w: canvas.width, h: canvas.height },
      rectOnScreen: { top: rect.top, left: rect.left, w: rect.width, h: rect.height },
      canvasStyle: {
        display: style.display,
        visibility: style.visibility,
        opacity: style.opacity,
        position: style.position,
      },
      webglRenderer: renderer,
      webglVendor: vendor,
      clearColor: clearColor ? Array.from(clearColor as Float32Array) : null,
      nonBlackPixels: allSamples,
      parentStyles,
      r3fMounted: !!r3fRoot,
    };
  });

  console.log('=== DEEP DIAGNOSIS ===');
  console.log(JSON.stringify(diagnosis, null, 2));
});
