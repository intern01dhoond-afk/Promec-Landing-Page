import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const possiblePaths = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
];

let executablePath = possiblePaths.find(p => fs.existsSync(p));

(async () => {
  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Navigating to http://localhost:3000/...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });

  // Wait 4 seconds for 1080p frames preload
  await new Promise(r => setTimeout(r, 4000));

  const artifactDir = 'C:\\Users\\balar\\.gemini\\antigravity\\brain\\ba63f837-3a34-4286-b5a3-a435d218e523';

  const steps = [
    { scrollY: 0, name: 'hero_360_000.png' },
    { scrollY: 650, name: 'hero_360_025.png' },
    { scrollY: 1300, name: 'hero_360_050.png' },
    { scrollY: 1950, name: 'hero_360_075.png' },
    { scrollY: 2600, name: 'hero_360_100.png' }
  ];

  for (const step of steps) {
    const info = await page.evaluate((y) => {
      window.scrollTo(0, y);
      if (window.lenis) {
        window.lenis.scrollTo(y, { immediate: true });
      }
      if (window.ScrollTrigger) {
        window.ScrollTrigger.update();
      }

      const stList = window.ScrollTrigger ? window.ScrollTrigger.getAll() : [];
      const heroPinnedSt = stList.find(st => st.pin && st.vars && st.vars.trigger && (st.vars.trigger.id === 'overview' || (st.vars.trigger.getAttribute && st.vars.trigger.getAttribute('data-hero') !== null)));

      return {
        y,
        actualScrollY: window.scrollY,
        progress: heroPinnedSt ? heroPinnedSt.progress : null
      };
    }, step.scrollY);

    console.log(`Scroll step Y=${step.scrollY}:`, info);

    await new Promise(r => setTimeout(r, 600));

    const outPath = path.join(artifactDir, step.name);
    await page.screenshot({ path: outPath });
    console.log(`Saved screenshot: ${step.name}`);
  }

  await browser.close();
  console.log('Hero 360 rotation verification completed!');
})();
