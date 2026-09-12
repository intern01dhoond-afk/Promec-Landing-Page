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

  // Get ScrollTrigger info for section #story pin
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

  // Scroll to Row 2 (Home Care Sofa Cleaning)
  await page.evaluate((y) => window.scrollTo(0, y + 2000), startY);
  await new Promise(r => setTimeout(r, 1200));

  const row2VideoStatus = await page.evaluate(() => {
    const v = document.querySelector('[data-story-video="2"]');
    return v ? {
      opacity: window.getComputedStyle(v).opacity,
      paused: v.paused,
      currentTime: v.currentTime,
      readyState: v.readyState,
      src: v.src
    } : null;
  });

  console.log('Row 2 Video Status:', row2VideoStatus);
  await page.screenshot({ path: path.join(__dirname, 'shot_row2_video_playing.png') });
  console.log('Saved shot_row2_video_playing.png');

  await browser.close();
  console.log('Verification Complete!');
})();
