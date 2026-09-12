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
  await delay(2000);

  // Destroy Lenis smooth scroll for test and scroll to story section
  await page.evaluate(() => {
    if (window.__lenis) window.__lenis.destroy();
    const story = document.getElementById('story');
    if (story) {
      const top = story.getBoundingClientRect().top + window.scrollY;
      window.scrollTo(0, top + 100);
    }
    const row = document.querySelector('[data-story-row="1"]');
    if (row) row.classList.add('is-video-active');
    const v = document.querySelector('[data-story-video="1"]');
    if (v) v.play();
  });
  await delay(2000);
  await delay(1000);

  const screenshotPath = 'C:\\Users\\balar\\.gemini\\antigravity\\brain\\906d7ae0-c5ee-4886-a815-7be28d298c26\\measure_video_active.png';
  await page.screenshot({ path: screenshotPath });
  console.log('Saved screenshot to:', screenshotPath);

  await browser.close();
}

run().catch(console.error);
