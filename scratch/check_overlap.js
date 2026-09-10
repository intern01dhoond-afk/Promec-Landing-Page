const puppeteer = require('puppeteer-core');
const fs = require('fs');

(async () => {
  const executablePath = 
    fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe') ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' :
    fs.existsSync('C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe') ? 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe' :
    fs.existsSync('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe') ? 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe' :
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe';

  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    defaultViewport: { width: 1366, height: 768 }
  });
  const page = await browser.newPage();

  console.log('Navigating to http://localhost:3000/...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2' });

  // Scroll to Row 2
  await page.evaluate(() => {
    const row2 = document.querySelector('[data-story-row="2"]');
    if (row2) row2.scrollIntoView({ block: 'center' });
  });
  await new Promise(r => setTimeout(r, 600));

  await page.screenshot({ path: 'C:/Users/balar/.gemini/antigravity/brain/5ccb36fd-07b9-419c-af3f-e852dd5f39d5/scratch/row2_new_blue_model.png' });

  // Scroll to Row 4
  await page.evaluate(() => {
    const row4 = document.querySelector('[data-story-row="4"]');
    if (row4) row4.scrollIntoView({ block: 'center' });
  });
  await new Promise(r => setTimeout(r, 600));

  await page.screenshot({ path: 'C:/Users/balar/.gemini/antigravity/brain/5ccb36fd-07b9-419c-af3f-e852dd5f39d5/scratch/row4_new_blue_model.png' });

  console.log('Screenshots saved successfully!');
  await browser.close();
})();
