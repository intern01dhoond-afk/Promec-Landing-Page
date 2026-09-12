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
  await new Promise(r => setTimeout(r, 1200));

  // Check Hero Section video state on initial load
  const heroVideoStatus = await page.evaluate(() => {
    const v = document.querySelector('.cover-video');
    const wrapper = document.querySelector('.hero__video');
    return {
      wrapperOpacity: wrapper ? window.getComputedStyle(wrapper).opacity : null,
      wrapperVisibility: wrapper ? window.getComputedStyle(wrapper).visibility : null,
      paused: v ? v.paused : true,
      currentTime: v ? v.currentTime : 0,
      readyState: v ? v.readyState : 0
    };
  });

  console.log('Hero Video Initial Status:', heroVideoStatus);
  await page.screenshot({ path: path.join(__dirname, 'shot_hero_direct_video.png') });
  console.log('Saved shot_hero_direct_video.png');

  // Check Section 2 Row 1 video state on entry
  const info = await page.evaluate(() => {
    if (typeof ScrollTrigger !== 'undefined') {
      const triggers = ScrollTrigger.getAll();
      const t = triggers.find(tr => tr.vars && tr.vars.pin && tr.trigger && tr.trigger.id === 'story');
      if (t) return { start: t.start, end: t.end };
    }
    return null;
  });

  const startY = info ? info.start : 3500;
  await page.evaluate((y) => window.scrollTo(0, y + 200), startY);
  await new Promise(r => setTimeout(r, 1000));

  const sec2Row1VideoStatus = await page.evaluate(() => {
    const v = document.querySelector('[data-story-video="1"]');
    return v ? {
      opacity: window.getComputedStyle(v).opacity,
      paused: v.paused,
      currentTime: v.currentTime,
      readyState: v.readyState
    } : null;
  });

  console.log('Section 2 Row 1 Video Status:', sec2Row1VideoStatus);
  await page.screenshot({ path: path.join(__dirname, 'shot_sec2_row1_direct_video.png') });
  console.log('Saved shot_sec2_row1_direct_video.png');

  await browser.close();
  console.log('Verification complete!');
})();
