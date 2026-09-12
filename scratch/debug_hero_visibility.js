const puppeteer = require('puppeteer-core');
const fs = require('fs');

async function debugHero() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const executablePath = fs.existsSync(edgePath) ? edgePath : chromePath;

  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    defaultViewport: { width: 1440, height: 900 }
  });

  const page = await browser.newPage();

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));

  const info = await page.evaluate(() => {
    const targets = [
      '.hero',
      '.hero__overlay',
      '.hero-overlay__grid',
      '.home-hero__header',
      '.home-hero__video',
      '.mini-showreel'
    ];

    return targets.map(sel => {
      const el = document.querySelector(sel);
      if (!el) return { sel, status: 'NOT FOUND' };
      const cs = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return {
        sel,
        inlineStyle: el.getAttribute('style'),
        opacity: cs.opacity,
        visibility: cs.visibility,
        display: cs.display,
        zIndex: cs.zIndex,
        rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height }
      };
    });
  });

  console.log(JSON.stringify(info, null, 2));

  await browser.close();
}

debugHero().catch(console.error);
