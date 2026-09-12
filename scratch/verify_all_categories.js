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

  // 1. Category 1 (Car & Bike Care)
  await page.evaluate((y) => window.scrollTo(0, y + 200), startY);
  await new Promise(r => setTimeout(r, 1000));

  const cat1Status = await page.evaluate(() => {
    const v = document.querySelector('[data-story-video="1"]');
    const usp = document.querySelector('[data-usp-transition]');
    return {
      videoOpacity: v ? window.getComputedStyle(v).opacity : null,
      videoPaused: v ? v.paused : true,
      videoTime: v ? v.currentTime : 0,
      uspDisplay: usp ? window.getComputedStyle(usp).display : null
    };
  });
  console.log('Category 1 Status:', cat1Status);
  await page.screenshot({ path: path.join(__dirname, 'shot_cat1_car.png') });

  // 2. Category 2 (Home Care)
  await page.evaluate((y) => window.scrollTo(0, y + 1200), startY);
  await new Promise(r => setTimeout(r, 1000));

  const cat2Status = await page.evaluate(() => {
    const v = document.querySelector('[data-story-video="2"]');
    return v ? {
      videoOpacity: window.getComputedStyle(v).opacity,
      videoPaused: v.paused,
      videoTime: v.currentTime,
      src: v.src
    } : null;
  });
  console.log('Category 2 Status:', cat2Status);
  await page.screenshot({ path: path.join(__dirname, 'shot_cat2_sofa.png') });

  // 3. Category 3 (Gig Workers SUV Wash)
  await page.evaluate((y) => window.scrollTo(0, y + 2200), startY);
  await new Promise(r => setTimeout(r, 1000));

  const cat3Status = await page.evaluate(() => {
    const v = document.querySelector('[data-story-video="3"]');
    return v ? {
      videoOpacity: window.getComputedStyle(v).opacity,
      videoPaused: v.paused,
      videoTime: v.currentTime,
      src: v.src
    } : null;
  });
  console.log('Category 3 Status:', cat3Status);
  await page.screenshot({ path: path.join(__dirname, 'shot_cat3_suv.png') });

  await browser.close();
  console.log('All 3 Categories Verification Complete!');
})();
