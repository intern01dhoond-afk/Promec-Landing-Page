import puppeteer from 'puppeteer-core';
import path from 'path';

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const delay = (ms) => new Promise(r => setTimeout(r, ms));

async function run() {
  const browser = await puppeteer.launch({
    executablePath: EDGE,
    headless: true,
    args: ['--window-size=1440,900']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await delay(2500);

  const brainDir = 'C:\\Users\\balar\\.gemini\\antigravity\\brain\\906d7ae0-c5ee-4886-a815-7be28d298c26';

  // 1. Hero top
  await page.screenshot({ path: path.join(brainDir, 'qa_01_hero_top.png') });
  console.log('Saved qa_01_hero_top.png');

  // Disable Lenis for precise scroll testing
  await page.evaluate(() => {
    if (window.__lenis) window.__lenis.destroy();
  });

  // Get story section top position
  const storyTop = await page.evaluate(() => {
    const s = document.getElementById('story');
    return s ? s.getBoundingClientRect().top + window.scrollY : 800;
  });

  // 2. Midway scroll (50% handoff)
  await page.evaluate((top) => {
    window.scrollTo(0, top / 2);
  }, storyTop);
  await delay(800);
  await page.screenshot({ path: path.join(brainDir, 'qa_02_handoff_midway.png') });
  console.log('Saved qa_02_handoff_midway.png');

  // 3. Almost landed (95% handoff)
  await page.evaluate((top) => {
    window.scrollTo(0, top - 30);
  }, storyTop);
  await delay(800);
  await page.screenshot({ path: path.join(brainDir, 'qa_03_handoff_almost_landed.png') });
  console.log('Saved qa_03_handoff_almost_landed.png');

  // 4. Fully landed & video playing (top top)
  await page.evaluate((top) => {
    window.scrollTo(0, top + 10);
  }, storyTop);
  await delay(1200);
  await page.screenshot({ path: path.join(brainDir, 'qa_04_video_active.png') });
  console.log('Saved qa_04_video_active.png');

  await browser.close();
}

run().catch(console.error);
