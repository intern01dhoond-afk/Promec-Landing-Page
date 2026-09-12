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

  // Measure overlay vs video machine alignment
  await page.evaluate(() => {
    if (window.__lenis) window.__lenis.destroy();
    const story = document.getElementById('story');
    if (story) {
      const top = story.getBoundingClientRect().top + window.scrollY;
      window.scrollTo(0, top); // exactly top top
    }

    // Force video active and uspTransition visible at opacity 0.6 to visually check overlap
    const row = document.querySelector('[data-story-row="1"]');
    if (row) row.classList.add('is-video-active');
    
    const transition = document.querySelector('[data-usp-transition]');
    const card = document.querySelector('[data-usp-transition-card]');
    if (transition && card) {
      transition.style.display = 'block';
      transition.style.visibility = 'visible';
      transition.style.opacity = '1';

      // Test coordinates
      const w = window.innerWidth * 0.275;
      const h = w * 1.18;
      const x = window.innerWidth * 0.655;
      const y = window.innerHeight * 0.19;

      card.style.position = 'fixed';
      card.style.left = '0px';
      card.style.top = '0px';
      card.style.transform = `translate3d(${x}px, ${y}px, 0px)`;
      card.style.width = `${w}px`;
      card.style.height = `${h}px`;
      card.style.opacity = '0.7'; // semi-transparent to check exact alignment
      card.style.zIndex = '9999';
    }
  });
  await delay(1500);

  const screenshotPath = 'C:\\Users\\balar\\.gemini\\antigravity\\brain\\906d7ae0-c5ee-4886-a815-7be28d298c26\\perfect_alignment_check.png';
  await page.screenshot({ path: screenshotPath });
  console.log('Saved screenshot to:', screenshotPath);

  await browser.close();
}

run().catch(console.error);
