import puppeteer from 'puppeteer-core';
import fs from 'fs';

(async () => {
  const edgePaths = [
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  ];

  let executablePath = edgePaths.find(p => fs.existsSync(p));

  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));

  const cardTime = await page.$eval('.mini-showreel__time', el => el.textContent.trim());
  console.log('Card duration display:', cardTime);

  const card = await page.$('.mini-showreel__card');
  if (card) await card.click();
  await new Promise(r => setTimeout(r, 1500));

  const modalTimeDuration = await page.$eval('[data-player-time-duration]', el => el.textContent.trim());
  console.log('Modal duration display:', modalTimeDuration);

  const screenshotPath = 'C:/Users/balar/.gemini/antigravity/brain/33b81bc9-bdc5-4120-b4bd-6f28ec277924/duration_updated.png';
  await page.screenshot({ path: screenshotPath });
  console.log('Duration screenshot saved to:', screenshotPath);

  await browser.close();
})();
