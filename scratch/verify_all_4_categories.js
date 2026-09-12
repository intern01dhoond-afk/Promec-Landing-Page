const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

(async () => {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  let executablePath = fs.existsSync(edgePath) ? edgePath : (fs.existsSync(chromePath) ? chromePath : null);

  const browser = await puppeteer.launch({
    executablePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));

  const info = await page.evaluate(() => {
    if (typeof ScrollTrigger !== 'undefined') {
      const triggers = ScrollTrigger.getAll();
      const t = triggers.find(tr => tr.vars && tr.vars.pin && tr.trigger && tr.trigger.id === 'story');
      if (t) return { start: t.start, end: t.end };
    }
    return null;
  });

  const startY = info ? info.start : 3500;
  console.log('Story Start Y:', startY);

  // 1. Category 1 (Car & Bike Care - Row 1)
  await page.evaluate((y) => window.scrollTo(0, y + 200), startY);
  await new Promise(r => setTimeout(r, 1000));
  const cat1 = await page.evaluate(() => {
    const v = document.querySelector('[data-story-video="1"]');
    return v ? { opacity: window.getComputedStyle(v).opacity, paused: v.paused, time: v.currentTime, src: v.src } : null;
  });
  console.log('Category 1 (Car Wash):', cat1);
  await page.screenshot({ path: path.join(__dirname, 'shot_all4_cat1.png') });

  // 2. Category 2 (Home Care Sofa - Row 2)
  await page.evaluate((y) => window.scrollTo(0, y + 1100), startY);
  await new Promise(r => setTimeout(r, 1000));
  const cat2 = await page.evaluate(() => {
    const v = document.querySelector('[data-story-video="2"]');
    return v ? { opacity: window.getComputedStyle(v).opacity, paused: v.paused, time: v.currentTime, src: v.src } : null;
  });
  console.log('Category 2 (Sofa Cleaning):', cat2);
  await page.screenshot({ path: path.join(__dirname, 'shot_all4_cat2.png') });

  // 3. Category 3 (Gig Workers Motorcycle Foam Wash - Row 3)
  await page.evaluate((y) => window.scrollTo(0, y + 2100), startY);
  await new Promise(r => setTimeout(r, 1000));
  const cat3 = await page.evaluate(() => {
    const v = document.querySelector('[data-story-video="3"]');
    return v ? { opacity: window.getComputedStyle(v).opacity, paused: v.paused, time: v.currentTime, src: v.src } : null;
  });
  console.log('Category 3 (Motorcycle Foam Wash):', cat3);
  await page.screenshot({ path: path.join(__dirname, 'shot_all4_cat3.png') });

  // 4. Category 4 (Corporate Care Office Carpet Vacuum - Row 4)
  await page.evaluate((y) => window.scrollTo(0, y + 3100), startY);
  await new Promise(r => setTimeout(r, 1000));
  const cat4 = await page.evaluate(() => {
    const v = document.querySelector('[data-story-video="4"]');
    return v ? { opacity: window.getComputedStyle(v).opacity, paused: v.paused, time: v.currentTime, src: v.src } : null;
  });
  console.log('Category 4 (Office Carpet Vacuuming):', cat4);
  await page.screenshot({ path: path.join(__dirname, 'shot_all4_cat4.png') });

  await browser.close();
  console.log('All 4 Categories Automated Verification Complete!');
})();
