import puppeteer from 'puppeteer-core';
import fs from 'fs';

const possiblePaths = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
];

let executablePath = possiblePaths.find(p => fs.existsSync(p));

(async () => {
  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1000));

  console.log('--- Initial Top Viewport ---');
  let states = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.aqua-story__row-bg-video')).map((v, i) => ({
      row: i + 1,
      src: v.src,
      paused: v.paused,
      readyState: v.readyState
    }));
  });
  console.log(states);

  console.log('\n--- Scrolling to Section 2 (Y = 3200) ---');
  await page.evaluate(() => {
    window.scrollTo(0, 3200);
    if (window.ScrollTrigger) window.ScrollTrigger.update();
  });
  await new Promise(r => setTimeout(r, 1500));

  states = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.aqua-story__row-bg-video')).map((v, i) => ({
      row: i + 1,
      src: v.src,
      paused: v.paused,
      readyState: v.readyState
    }));
  });
  console.log(states);

  await browser.close();
})();
