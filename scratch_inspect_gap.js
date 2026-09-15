import puppeteer from 'puppeteer-core';
import path from 'path';
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

  await page.evaluate(() => {
    const footer = document.querySelector('.aqua-footer');
    if (footer) footer.scrollIntoView();
    if (window.ScrollTrigger) window.ScrollTrigger.update();
  });
  await new Promise(r => setTimeout(r, 800));

  const artifactDir = 'C:\\Users\\balar\\.gemini\\antigravity\\brain\\33b81bc9-bdc5-4120-b4bd-6f28ec277924';
  const outPath = path.join(artifactDir, 'gap_before.png');
  await page.screenshot({ path: outPath });
  console.log(`Saved screenshot to ${outPath}`);

  await browser.close();
})();
