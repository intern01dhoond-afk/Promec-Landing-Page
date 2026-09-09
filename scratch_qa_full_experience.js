import puppeteer from 'puppeteer-core';
import path from 'path';
import { fileURLToPath } from 'url';

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const OUT = 'C:\\Users\\balar\\.gemini\\antigravity\\brain\\ba63f837-3a34-4286-b5a3-a435d218e523';
const delay = (ms) => new Promise(r => setTimeout(r, ms));

async function testViewport(browser, name, width, height) {
  console.log(`\n================ Testing ${name} (${width}x${height}) ================`);
  const page = await browser.newPage();
  await page.setViewport({ width, height });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 30000 });
  await delay(2000);

  // Check horizontal overflow
  const overflow = await page.evaluate(() => {
    return {
      hasOverflow: document.documentElement.scrollWidth > window.innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth
    };
  });
  console.log(`Horizontal overflow check:`, overflow.hasOverflow ? 'FAIL' : 'PASS', `(scrollWidth: ${overflow.scrollWidth}, innerWidth: ${overflow.innerWidth})`);

  if (name === 'Desktop') {
    // Disable lenis for discrete position captures
    await page.evaluate(() => {
      if (window.__lenis) window.__lenis.destroy();
      document.documentElement.style.scrollBehavior = 'auto';
    });

    const scrollSteps = [
      { name: 'qa_01_hero_initial', y: 0 },
      { name: 'qa_02_hero_scrub_mid', y: 1300 },
      { name: 'qa_03_hero_scrub_end', y: 2600 },
      { name: 'qa_04_handoff_pullback_start', y: 2800 },
      { name: 'qa_05_handoff_pullback_mid', y: 3100 },
      { name: 'qa_06_handoff_settled_cat1', y: 3500 },
      { name: 'qa_07_story_cat2', y: 4400 },
      { name: 'qa_08_story_cat4', y: 6100 },
      { name: 'qa_09_reverse_back_to_handoff', y: 2900 },
      { name: 'qa_10_reverse_back_to_hero', y: 2000 },
    ];

    for (const step of scrollSteps) {
      await page.evaluate((y) => window.scrollTo(0, y), step.y);
      await delay(700);
      await page.screenshot({ path: path.join(OUT, `${step.name}.png`) });
      console.log(`  Captured ${step.name} at y=${step.y}`);
    }
  } else {
    // Tablet / Mobile screenshot
    await page.evaluate(() => window.scrollTo(0, 0));
    await delay(500);
    await page.screenshot({ path: path.join(OUT, `qa_${name.toLowerCase()}_hero.png`) });
    await page.evaluate(() => window.scrollTo(0, 1500));
    await delay(500);
    await page.screenshot({ path: path.join(OUT, `qa_${name.toLowerCase()}_story.png`) });
    console.log(`  Captured ${name} responsive screenshots`);
  }

  await page.close();
}

async function run() {
  const browser = await puppeteer.launch({
    executablePath: EDGE,
    headless: true,
    args: ['--window-size=1440,900']
  });

  await testViewport(browser, 'Desktop', 1440, 900);
  await testViewport(browser, 'Tablet', 768, 1024);
  await testViewport(browser, 'Mobile', 375, 812);

  await browser.close();
  console.log('\nAll QA tests completed successfully!');
}

run().catch(console.error);
