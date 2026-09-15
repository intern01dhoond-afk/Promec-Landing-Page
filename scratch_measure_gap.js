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

  const distanceInfo = await page.evaluate(() => {
    const cta = document.querySelector('.aqua-cta-banner');
    const footer = document.querySelector('.aqua-footer');

    const ctaRect = cta.getBoundingClientRect();
    const footerRect = footer.getBoundingClientRect();

    return {
      ctaBottom: ctaRect.bottom + window.scrollY,
      footerTop: footerRect.top + window.scrollY,
      gapPx: (footerRect.top + window.scrollY) - (ctaRect.bottom + window.scrollY)
    };
  });

  console.log('Distance Info:', distanceInfo);
  await browser.close();
})();
