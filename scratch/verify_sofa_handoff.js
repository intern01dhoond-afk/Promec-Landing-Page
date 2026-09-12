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
      if (t) {
        return { start: t.start, end: t.end };
      }
    }
    return null;
  });

  const startY = info ? info.start : 3500;
  console.log('Story Start Y:', startY);

  // 1. Initial Hero
  await page.screenshot({ path: path.join(__dirname, 'shot_01_hero.png') });

  // 2. Row 1 Static (Car & Bike Care)
  await page.evaluate((y) => window.scrollTo(0, y + 150), startY);
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(__dirname, 'shot_02_row1_car_static.png') });

  // 3. Row 1 Handoff Device landing on Right
  await page.evaluate((y) => window.scrollTo(0, y + 600), startY);
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(__dirname, 'shot_03_row1_car_handoff.png') });

  // 4. Row 1 Video Active & Playing
  await page.evaluate((y) => window.scrollTo(0, y + 1100), startY);
  await new Promise(r => setTimeout(r, 800));
  const row1VideoStatus = await page.evaluate(() => {
    const v = document.querySelector('[data-story-video="1"]');
    return v ? { opacity: window.getComputedStyle(v).opacity, paused: v.paused, currentTime: v.currentTime } : null;
  });
  console.log('Row 1 Video Status:', row1VideoStatus);
  await page.screenshot({ path: path.join(__dirname, 'shot_04_row1_car_video_active.png') });

  // 5. Scroll further to Row 2 (Home Care Sofa Cleaning)
  await page.evaluate((y) => window.scrollTo(0, y + 2200), startY);
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(__dirname, 'shot_05_row2_homecare_sofa.png') });

  await browser.close();
  console.log('Category 1 & Category 2 Verification Complete!');
})();
