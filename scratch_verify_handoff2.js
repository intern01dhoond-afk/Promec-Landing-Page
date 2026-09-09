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

  // Disable smooth scrolling for precise positioning
  await page.evaluate(() => {
    if (window.__lenis) { window.__lenis.destroy(); }
    document.documentElement.style.scrollBehavior = 'auto';
  });

  const positions = [
    { name: 'fix_01_hero_end', y: 2600, desc: 'Hero pin end - product stage should be hidden' },
    { name: 'fix_02_handoff_start', y: 2800, desc: 'Handoff zone start - product fading in, hero fading out' },
    { name: 'fix_03_handoff_mid', y: 3100, desc: 'Handoff mid - product visible, scaling down' },
    { name: 'fix_04_card1_settled', y: 3600, desc: 'Card 01 settled - product at right position' },
    { name: 'fix_05_card2', y: 4500, desc: 'Card 02 - product at left' },
    { name: 'fix_06_reverse_3100', y: 3100, desc: 'Reverse to handoff mid' },
    { name: 'fix_07_reverse_hero', y: 2000, desc: 'Reverse back into hero - canvas visible' },
  ];

  for (const pos of positions) {
    await page.evaluate((y) => window.scrollTo(0, y), pos.y);
    await delay(900);
    
    // Get diagnostics
    const diag = await page.evaluate(() => {
      const stage = document.querySelector('[data-story-product-stage]');
      const traveler = document.querySelector('[data-story-product-traveler]');
      const canvas = document.querySelector('.hero__canvas');
      const stageStyles = stage ? getComputedStyle(stage) : null;
      const canvasStyles = canvas ? getComputedStyle(canvas) : null;
      return {
        scrollY: window.scrollY,
        stageOpacity: stageStyles ? stageStyles.opacity : 'N/A',
        stageVisibility: stageStyles ? stageStyles.visibility : 'N/A',
        travelerTransform: traveler ? getComputedStyle(traveler).transform : 'N/A',
        canvasOpacity: canvasStyles ? canvasStyles.opacity : 'N/A',
        canvasVisibility: canvasStyles ? canvasStyles.visibility : 'N/A'
      };
    });

    console.log(`\n--- ${pos.name} (scrollY=${pos.y}) ---`);
    console.log(`  ${pos.desc}`);
    console.log(`  Stage: opacity=${diag.stageOpacity}, visibility=${diag.stageVisibility}`);
    console.log(`  Canvas: opacity=${diag.canvasOpacity}, visibility=${diag.canvasVisibility}`);
    console.log(`  Traveler transform: ${diag.travelerTransform}`);

    await page.screenshot({ path: path.join(OUT, `${pos.name}.png`) });
  }

  await browser.close();
  console.log('\nDone! Screenshots saved.');
}

run().catch(console.error);
