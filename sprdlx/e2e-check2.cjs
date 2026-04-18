const { chromium } = require('./node_modules/playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:5174/about', { waitUntil: 'networkidle', timeout: 20000 });
  // Wait longer for the GLB to load and loading screen to hide
  await page.waitForTimeout(8000);

  await page.screenshot({ path: 'screenshot2-hero.png', clip: { x: 0, y: 0, width: 1440, height: 900 } });

  await page.evaluate(() => window.scrollTo({ top: window.innerHeight, behavior: 'instant' }));
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'screenshot2-about-data.png', clip: { x: 0, y: 0, width: 1440, height: 900 } });

  await page.evaluate(() => window.scrollTo({ top: window.innerHeight * 2, behavior: 'instant' }));
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'screenshot2-recent-work.png', clip: { x: 0, y: 0, width: 1440, height: 900 } });

  await browser.close();
  console.log('Done');
})().catch(e => { console.error(e.message); process.exit(1); });
