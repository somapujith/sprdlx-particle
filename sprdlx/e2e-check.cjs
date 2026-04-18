const { chromium } = require('./node_modules/playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:5174/about', { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(3000);

  await page.screenshot({ path: 'screenshot-hero.png', clip: { x: 0, y: 0, width: 1440, height: 900 } });

  await page.evaluate(() => window.scrollTo({ top: window.innerHeight, behavior: 'instant' }));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'screenshot-about-data.png', clip: { x: 0, y: 0, width: 1440, height: 900 } });

  await page.evaluate(() => window.scrollTo({ top: window.innerHeight * 2, behavior: 'instant' }));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'screenshot-recent-work.png', clip: { x: 0, y: 0, width: 1440, height: 900 } });

  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'screenshot-fullpage.png', fullPage: true });

  const results = await page.evaluate(() => {
    const hero = document.getElementById('about-hero');
    const aboutData = document.getElementById('about-data');
    const recentWork = document.getElementById('recent-work');
    
    return {
      hero: hero ? window.getComputedStyle(hero).backgroundColor : 'not found',
      aboutData: aboutData ? window.getComputedStyle(aboutData).backgroundColor : 'not found',
      recentWork: recentWork ? window.getComputedStyle(recentWork).backgroundColor : 'not found',
      body: window.getComputedStyle(document.body).backgroundColor,
    };
  });

  console.log(JSON.stringify(results, null, 2));
  await browser.close();
})().catch(e => { console.error(e.message); process.exit(1); });
