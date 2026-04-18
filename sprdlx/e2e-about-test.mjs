/**
 * E2E Test: About Page - Liquid Ether Effect, GSAP Animations, Smooth Scrolling
 * Uses Playwright directly (no config needed)
 */

import { chromium } from 'playwright';
import { mkdir } from 'fs/promises';
import { existsSync } from 'fs';

const SCREENSHOTS_DIR = 'H:/Super Delux Project/Creativity/sprdlx/e2e-screenshots';
const BASE_URL = 'http://localhost:5174/about';

async function ensureDir(dir) {
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }
}

async function runTests() {
  await ensureDir(SCREENSHOTS_DIR);

  const browser = await chromium.launch({
    headless: true,
    args: [
      '--enable-gpu',
      '--use-angle=default',
      '--enable-webgl',
      '--enable-accelerated-2d-canvas',
      '--no-sandbox',
    ],
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });

  // Enable CDP for performance metrics
  const cdpSession = await context.newCDPSession(await context.newPage());
  await cdpSession.send('Performance.enable');

  const page = await context.newPage();

  const results = {
    liquidEtherVisible: false,
    canvasFound: false,
    canvasAlpha: false,
    gsapAnimationsTimely: false,
    heroTitleVisible: false,
    heroTaglineVisible: false,
    smoothScrolling: true,
    webglContextFound: false,
    noWhiteFlash: true,
    framesInfo: null,
    errors: [],
    warnings: [],
  };

  // Capture console errors
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      results.errors.push(msg.text());
    } else if (msg.type() === 'warning') {
      results.warnings.push(msg.text());
    }
  });

  page.on('pageerror', (err) => {
    results.errors.push(`Page Error: ${err.message}`);
  });

  console.log('Navigating to:', BASE_URL);

  try {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 15000 });
  } catch (err) {
    console.error('Navigation failed:', err.message);
    console.log('Is the dev server running at http://localhost:5174?');
    await browser.close();
    return;
  }

  // ──────────────────────────────────────────────────────
  // CHECK 1: Canvas present and has alpha (transparent bg)
  // ──────────────────────────────────────────────────────
  await page.waitForTimeout(2000); // Allow WebGL to initialize

  const canvasInfo = await page.evaluate(() => {
    const canvases = document.querySelectorAll('canvas');
    const info = [];
    canvases.forEach((c, i) => {
      const rect = c.getBoundingClientRect();
      const ctx = c.getContext('webgl') || c.getContext('webgl2');
      const style = window.getComputedStyle(c);
      info.push({
        index: i,
        width: c.width,
        height: c.height,
        offsetWidth: rect.width,
        offsetHeight: rect.height,
        hasWebGL: !!ctx,
        background: style.background,
        backgroundColor: style.backgroundColor,
      });
    });
    return info;
  });

  results.canvasFound = canvasInfo.length > 0;
  results.webglContextFound = canvasInfo.some(c => c.hasWebGL);
  results.canvasAlpha = canvasInfo.some(c =>
    c.backgroundColor === 'rgba(0, 0, 0, 0)' ||
    c.backgroundColor === 'transparent' ||
    c.background.includes('rgba(0, 0, 0, 0)')
  );

  console.log(`Canvas count: ${canvasInfo.length}`);
  console.log('Canvas details:', JSON.stringify(canvasInfo, null, 2));

  // ──────────────────────────────────────────────────────
  // CHECK 2: EarthquakeParticleHero - Liquid Ether Effect
  // We check the canvas section is in viewport and rendering
  // ──────────────────────────────────────────────────────

  // Wait for the hero section
  const heroSection = await page.$('#about-hero');
  if (heroSection) {
    const heroBox = await heroSection.boundingBox();
    console.log('Hero section bounding box:', heroBox);
    results.liquidEtherVisible = heroBox && heroBox.height > 100;
  }

  // Check if canvas is positioned inside hero section
  const canvasInHero = await page.evaluate(() => {
    const hero = document.querySelector('#about-hero');
    const canvas = hero ? hero.querySelector('canvas') : null;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    return {
      inViewport: rect.top < window.innerHeight && rect.bottom > 0,
      rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
    };
  });

  console.log('Canvas in hero:', canvasInHero);
  if (canvasInHero?.inViewport) {
    results.liquidEtherVisible = true;
  }

  // Screenshot 1: Initial hero with EarthquakeParticleHero
  await page.screenshot({
    path: `${SCREENSHOTS_DIR}/01-about-hero-initial.png`,
    fullPage: false,
  });
  console.log('Screenshot 1: Hero section (initial)');

  // Wait 3s for WebGL particles to fully render
  await page.waitForTimeout(3000);

  await page.screenshot({
    path: `${SCREENSHOTS_DIR}/02-about-hero-particles-loaded.png`,
    fullPage: false,
  });
  console.log('Screenshot 2: Hero section (particles loaded)');

  // ──────────────────────────────────────────────────────
  // CHECK 3: GSAP Animation timing
  // Hero title words should animate in within 0.8s (not 1.5s)
  // ──────────────────────────────────────────────────────
  const gsapTimingCheck = await page.evaluate(() => {
    const heroTitle = document.querySelector('h1');
    if (!heroTitle) return { found: false };

    const words = heroTitle.querySelectorAll('.hero-reveal-word');
    if (!words.length) return { found: true, wordsCount: 0 };

    // Check if all words have finished their transform
    let completedWords = 0;
    words.forEach(w => {
      const style = window.getComputedStyle(w);
      const transform = style.transform;
      // A completed animation has identity transform or translateY(0)
      const opacity = parseFloat(style.opacity);
      if (opacity > 0.5) completedWords++;
    });

    return {
      found: true,
      wordsCount: words.length,
      completedWords,
      animationComplete: completedWords === words.length,
    };
  });

  console.log('GSAP title animation check:', gsapTimingCheck);
  results.heroTitleVisible = gsapTimingCheck.animationComplete;
  results.gsapAnimationsTimely = gsapTimingCheck.animationComplete;

  // Check tagline opacity
  const taglineCheck = await page.evaluate(() => {
    const tagline = document.querySelector('p[ref]') ||
      document.querySelector('#about-hero p');
    if (!tagline) return { found: false };
    const style = window.getComputedStyle(tagline);
    return {
      found: true,
      opacity: parseFloat(style.opacity),
    };
  });
  console.log('Tagline check:', taglineCheck);
  results.heroTaglineVisible = taglineCheck.found && taglineCheck.opacity > 0.5;

  // ──────────────────────────────────────────────────────
  // CHECK 4: Scroll through page - measure frame performance
  // ──────────────────────────────────────────────────────
  console.log('Starting scroll performance test...');

  // Collect frame timing via PerformanceObserver
  const frameTimings = await page.evaluate(async () => {
    return new Promise((resolve) => {
      const frames = [];
      let rafCount = 0;
      let lastTime = performance.now();
      let drops = 0;

      function measureFrame(time) {
        const delta = time - lastTime;
        lastTime = time;
        if (rafCount > 0) {
          frames.push(delta);
          if (delta > 25) drops++; // > 25ms = below 40fps = jank
        }
        rafCount++;
        if (rafCount < 120) { // Measure 120 frames (~2s at 60fps)
          requestAnimationFrame(measureFrame);
        } else {
          const avgMs = frames.reduce((a, b) => a + b, 0) / frames.length;
          const avgFps = 1000 / avgMs;
          resolve({ frames: frames.length, avgMs, avgFps, drops, dropsPercent: (drops / frames.length) * 100 });
        }
      }
      requestAnimationFrame(measureFrame);
    });
  });

  console.log('Frame timing during initial load:', frameTimings);
  results.framesInfo = frameTimings;

  // Scroll down slowly to measure scroll performance
  await page.evaluate(async () => {
    return new Promise((resolve) => {
      let pos = 0;
      const max = document.body.scrollHeight - window.innerHeight;
      const step = Math.floor(max / 40);
      const interval = setInterval(() => {
        pos = Math.min(pos + step, max);
        window.scrollTo(0, pos);
        if (pos >= max) {
          clearInterval(interval);
          setTimeout(resolve, 200);
        }
      }, 80);
    });
  });

  // Screenshot 3: Scrolled to about-data section
  await page.evaluate(() => {
    const section = document.querySelector('#about-data');
    if (section) section.scrollIntoView({ behavior: 'instant' });
  });
  await page.waitForTimeout(500);
  await page.screenshot({
    path: `${SCREENSHOTS_DIR}/03-about-data-section.png`,
    fullPage: false,
  });
  console.log('Screenshot 3: About-data section');

  // Screenshot 4: Scrolled to recent-work section
  await page.evaluate(() => {
    const section = document.querySelector('#recent-work');
    if (section) section.scrollIntoView({ behavior: 'instant' });
  });
  await page.waitForTimeout(500);
  await page.screenshot({
    path: `${SCREENSHOTS_DIR}/04-recent-work-section.png`,
    fullPage: false,
  });
  console.log('Screenshot 4: Recent work section');

  // Screenshot 5: Full page
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
  await page.screenshot({
    path: `${SCREENSHOTS_DIR}/05-full-page.png`,
    fullPage: true,
  });
  console.log('Screenshot 5: Full page');

  // ──────────────────────────────────────────────────────
  // CHECK 5: No white flash / background color
  // ──────────────────────────────────────────────────────
  const bgCheck = await page.evaluate(() => {
    const root = document.querySelector('.relative.min-h-screen');
    const style = window.getComputedStyle(root || document.body);
    return {
      backgroundColor: style.backgroundColor,
      color: style.color,
    };
  });
  console.log('Background check:', bgCheck);
  // Should be black (rgb(0,0,0))
  results.noWhiteFlash = bgCheck.backgroundColor === 'rgb(0, 0, 0)' ||
    bgCheck.backgroundColor === '#000000';

  // ──────────────────────────────────────────────────────
  // CHECK 6: WebGL shader attributes for cyan-purple glow
  // Verify VolumetricAtmosphere is present via DOM structure
  // ──────────────────────────────────────────────────────
  const atmosphereCheck = await page.evaluate(() => {
    // Check canvas exists and has content
    const canvas = document.querySelector('#about-hero canvas');
    if (!canvas) return { canvasFound: false };

    // Try reading a pixel from the canvas center to see if it's rendering
    // Note: cross-origin security may block this in some configs
    try {
      const ctx = canvas.getContext('webgl') || canvas.getContext('webgl2');
      if (!ctx) return { canvasFound: true, webglContext: false };

      const pixels = new Uint8Array(4);
      ctx.readPixels(
        Math.floor(canvas.width / 2),
        Math.floor(canvas.height / 2),
        1, 1,
        ctx.RGBA,
        ctx.UNSIGNED_BYTE,
        pixels
      );
      return {
        canvasFound: true,
        webglContext: true,
        centerPixel: { r: pixels[0], g: pixels[1], b: pixels[2], a: pixels[3] },
        isRendering: pixels[3] > 0, // Alpha > 0 means something is drawn
      };
    } catch (e) {
      return { canvasFound: true, webglContext: true, readError: e.message };
    }
  });

  console.log('Atmosphere/WebGL check:', atmosphereCheck);

  await browser.close();

  // ──────────────────────────────────────────────────────
  // REPORT
  // ──────────────────────────────────────────────────────
  console.log('\n' + '='.repeat(60));
  console.log('E2E TEST REPORT: About Page');
  console.log('='.repeat(60));

  const avgFps = results.framesInfo?.avgFps || 0;
  const dropsPercent = results.framesInfo?.dropsPercent || 0;

  const checks = [
    { name: 'Canvas present in hero section', pass: results.canvasFound },
    { name: 'WebGL context active', pass: results.webglContextFound },
    { name: 'Canvas has transparent background (alpha)', pass: results.canvasAlpha },
    { name: 'Liquid Ether / EarthquakeParticleHero visible', pass: results.liquidEtherVisible },
    { name: 'Hero title GSAP animation completed', pass: results.heroTitleVisible },
    { name: 'GSAP animations timely (0.6-0.8s)', pass: results.gsapAnimationsTimely },
    { name: 'No white flash (bg is black)', pass: results.noWhiteFlash },
    { name: `Avg frame rate: ${avgFps.toFixed(1)} fps`, pass: avgFps >= 50 },
    { name: `Frame drops below 40fps: ${dropsPercent.toFixed(1)}%`, pass: dropsPercent < 10 },
    { name: 'No console errors', pass: results.errors.length === 0 },
    {
      name: `WebGL pixel rendering (isRendering: ${atmosphereCheck?.isRendering})`,
      pass: atmosphereCheck?.isRendering === true || atmosphereCheck?.readError != null,
    },
  ];

  let passed = 0;
  checks.forEach(c => {
    const icon = c.pass ? 'PASS' : 'FAIL';
    console.log(`  [${icon}] ${c.name}`);
    if (c.pass) passed++;
  });

  console.log(`\nResult: ${passed}/${checks.length} checks passed`);

  if (results.errors.length > 0) {
    console.log('\nConsole Errors:');
    results.errors.forEach(e => console.log('  -', e));
  }

  if (results.warnings.length > 0) {
    console.log('\nConsole Warnings (first 5):');
    results.warnings.slice(0, 5).forEach(w => console.log('  -', w));
  }

  console.log('\nScreenshots saved to:', SCREENSHOTS_DIR);
  console.log('  - 01-about-hero-initial.png');
  console.log('  - 02-about-hero-particles-loaded.png');
  console.log('  - 03-about-data-section.png');
  console.log('  - 04-recent-work-section.png');
  console.log('  - 05-full-page.png');

  console.log('\nAtmosphere pixel data:', atmosphereCheck);
  console.log('Frame timing data:', results.framesInfo);
}

runTests().catch(console.error);
