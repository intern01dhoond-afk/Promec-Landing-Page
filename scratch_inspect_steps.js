import puppeteer from 'puppeteer-core';
import path from 'path';
import { fileURLToPath } from 'url';

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

  // Inject experimental handoff timeline in page
  await page.evaluate(() => {
    const storySection = document.getElementById("story");
    const productStage = document.querySelector("[data-story-product-stage]");
    const productTraveler = document.querySelector("[data-story-product-traveler]");
    const productFrame = document.querySelector(".aqua-story__product-frame");
    const productTag = document.querySelector(".aqua-story__product-tag");
    const card1Text = document.querySelector('[data-story-row="1"] .aqua-story__text-col');
    const heroCanvas = document.querySelector('.hero__canvas');

    // Kill previous handoff / pin triggers on storySection
    ScrollTrigger.getAll().forEach(st => {
      if (st.vars.trigger === storySection && (st.vars.start === 'top 100%' || st.vars.start === 'top 95%' || st.vars.start === 'top top')) {
        // keep storyTL if needed, or inspect
      }
    });
  });

  // Take test screenshots between 2600 and 3600
  const steps = [2600, 2750, 2900, 3100, 3300, 3550];
  for (const y of steps) {
    await page.evaluate((pos) => window.scrollTo(0, pos), y);
    await delay(700);
    await page.screenshot({ path: path.join(OUT, `test_step_${y}.png`) });
    console.log(`Captured test_step_${y}.png`);
  }

  await browser.close();
}

run().catch(console.error);
