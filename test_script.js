const puppeteer = require('./node_modules/puppeteer-core');
(async () => {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const browser = await puppeteer.launch({ executablePath: edgePath, headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });

  // Category 1: Autocare
  await page.evaluate(() => {
    const row1 = document.querySelector('[data-story-row="1"]');
    if (row1) row1.scrollIntoView({ block: 'center' });
  });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: 'C:/Users/balar/.gemini/antigravity/brain/5ccb36fd-07b9-419c-af3f-e852dd5f39d5/scratch/cat1_autocare_yellow.png' });

  // Category 2: Home Care
  await page.evaluate(() => {
    const row2 = document.querySelector('[data-story-row="2"]');
    if (row2) row2.scrollIntoView({ block: 'center' });
  });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: 'C:/Users/balar/.gemini/antigravity/brain/5ccb36fd-07b9-419c-af3f-e852dd5f39d5/scratch/cat2_homecare_blue.png' });

  // Category 3: Gig Workers
  await page.evaluate(() => {
    const row3 = document.querySelector('[data-story-row="3"]');
    if (row3) row3.scrollIntoView({ block: 'center' });
  });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: 'C:/Users/balar/.gemini/antigravity/brain/5ccb36fd-07b9-419c-af3f-e852dd5f39d5/scratch/cat3_gigworkers_yellow.png' });

  // Category 4: Corporate Care
  await page.evaluate(() => {
    const row4 = document.querySelector('[data-story-row="4"]');
    if (row4) row4.scrollIntoView({ block: 'center' });
  });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: 'C:/Users/balar/.gemini/antigravity/brain/5ccb36fd-07b9-419c-af3f-e852dd5f39d5/scratch/cat4_corporate_blue.png' });

  await browser.close();
})();
