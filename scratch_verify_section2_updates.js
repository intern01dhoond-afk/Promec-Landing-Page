import puppeteer from 'puppeteer-core';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const OUT = 'C:\\Users\\balar\\.gemini\\antigravity\\brain\\ba63f837-3a34-4286-b5a3-a435d218e523';

const delay = (ms) => new Promise(r => setTimeout(r, ms));

async function run() {
  const browser = await puppeteer.launch({
    executablePath: EDGE,
    headless: true,
    args: ['--window-size=1440,900']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 30000 });
  await delay(2500);

  await page.evaluate(() => {
    if (window.__lenis) { window.__lenis.destroy(); }
    document.documentElement.style.scrollBehavior = 'auto';
  });

  // Check row positions
  const rowPositions = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('#story [data-story-row]'));
    return rows.map((r, i) => {
      const rect = r.getBoundingClientRect();
      const text = r.querySelector('.aqua-story__text-col');
      const textRect = text ? text.getBoundingClientRect() : null;
      return {
        idx: i + 1,
        badge: r.querySelector('.aqua-story__badge')?.textContent?.trim(),
        top: window.scrollY + rect.top,
        height: rect.height,
        centerScrollY: window.scrollY + rect.top - (900 - rect.height) / 2
      };
    });
  });

  console.log('=== ROW POSITIONS ===', rowPositions);

  const capturePoints = [
    { name: 'final_01_cat1_autocare', y: Math.round(rowPositions[0].centerScrollY), desc: 'Category 01 centered' },
    { name: 'final_02_cat2_homecare', y: Math.round(rowPositions[1].centerScrollY), desc: 'Category 02 centered' },
    { name: 'final_03_cat3_gigworkers', y: Math.round(rowPositions[2].centerScrollY), desc: 'Category 03 centered' },
    { name: 'final_04_cat4_facilitycare', y: Math.round(rowPositions[3].centerScrollY), desc: 'Category 04 centered' },
  ];

  for (const pt of capturePoints) {
    await page.evaluate((y) => window.scrollTo(0, y), pt.y);
    await delay(900);
    console.log(`\nCaptured ${pt.name} at y=${pt.y}`);
    await page.screenshot({ path: path.join(OUT, `${pt.name}.png`) });
  }

  await browser.close();
  console.log('\nAll captures completed successfully!');
}

run().catch(console.error);
