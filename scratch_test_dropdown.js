import puppeteer from 'puppeteer-core';
import path from 'path';

async function testScrollRotation() {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  await page.goto('http://localhost:3001', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2000));

  const artifactDir = 'C:\\Users\\balar\\.gemini\\antigravity\\brain\\1911ebc7-dbd7-46db-baf8-02db9557062d';

  // 1. Initial screenshot at top of page (should be stationary frame 0)
  await page.screenshot({ path: path.join(artifactDir, 'hero_scroll_0.png') });
  console.log('Captured hero_scroll_0.png');

  // 2. Scroll down 800px (mid-rotation)
  await page.evaluate(() => window.scrollTo({ top: 800, behavior: 'instant' }));
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(artifactDir, 'hero_scroll_800.png') });
  console.log('Captured hero_scroll_800.png');

  // 3. Scroll down 1800px (further rotation)
  await page.evaluate(() => window.scrollTo({ top: 1800, behavior: 'instant' }));
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(artifactDir, 'hero_scroll_1800.png') });
  console.log('Captured hero_scroll_1800.png');

  await browser.close();
}

testScrollRotation().catch(console.error);
