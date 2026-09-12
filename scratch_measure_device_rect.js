import puppeteer from 'puppeteer-core';
import path from 'path';

async function run() {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const htmlPath = 'file:///' + path.resolve('index.html').replace(/\\/g, '/');
  await page.goto(htmlPath, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));

  // Get exact bounding rect of the row-bg container vs the video device in full bleed
  const rects = await page.evaluate(() => {
    const bg = document.querySelector('.aqua-story__row-bg');
    const img = document.querySelector('.aqua-story__row-bg-img');
    const row = document.querySelector('[data-story-row="1"]');
    return {
      bgRect: bg ? bg.getBoundingClientRect() : null,
      imgRect: img ? img.getBoundingClientRect() : null,
      rowRect: row ? row.getBoundingClientRect() : null,
      winW: window.innerWidth,
      winH: window.innerHeight
    };
  });

  console.log('DOM Measurements:', JSON.stringify(rects, null, 2));

  await browser.close();
}

run().catch(console.error);
