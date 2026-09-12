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

  // 1. Row 1 with text gradient card
  await page.evaluate((y) => window.scrollTo(0, y + 200), startY);
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(__dirname, 'shot_seamless_row1.png') });

  // 2. Transition boundary between Row 1 and Row 2
  await page.evaluate((y) => window.scrollTo(0, y + 700), startY);
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(__dirname, 'shot_seamless_transition.png') });

  // 3. Row 2 with text gradient card
  await page.evaluate((y) => window.scrollTo(0, y + 1200), startY);
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(__dirname, 'shot_seamless_row2.png') });

  await browser.close();
  console.log('Seamless video verification complete!');
})();
