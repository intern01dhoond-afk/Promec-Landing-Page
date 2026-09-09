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

  // Wait 3 seconds for preloader
  await new Promise(r => setTimeout(r, 3000));

  const artifactDir = 'C:\\Users\\balar\\.gemini\\antigravity\\brain\\ba63f837-3a34-4286-b5a3-a435d218e523';

  // Test transition handoff steps down and back up
  const steps = [
    { scrollY: 2600, name: 'handoff_01_hero_end.png', label: 'Hero end / Section 2 at bottom' },
    { scrollY: 2900, name: 'handoff_02_entering.png', label: 'Mid-handoff pull-back & glide' },
    { scrollY: 3300, name: 'handoff_03_card1_settled.png', label: 'Card 01 Right position settled' },
    { scrollY: 4200, name: 'handoff_04_card2_left.png', label: 'Card 02 Left position' },
    // Scroll back up into Hero to verify reverse handoff
    { scrollY: 2600, name: 'handoff_05_reverse_up.png', label: 'Scroll back UP into Hero 360 end' },
    { scrollY: 1300, name: 'handoff_06_hero_360_mid.png', label: 'Scroll back UP into Hero 360 rotation' }
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

      const traveler = document.querySelector('[data-story-product-traveler]');
      return {
        targetY: y,
        actualY: window.scrollY,
        travelerTransform: traveler ? getComputedStyle(traveler).transform : null
      };
    }, step.scrollY);

    console.log(`Step [${step.label}]:`, info);

    await new Promise(r => setTimeout(r, 600));

    const outPath = path.join(artifactDir, step.name);
    await page.screenshot({ path: outPath });
    console.log(`Saved screenshot: ${step.name}`);
  }

  await browser.close();
  console.log('Transition handoff verification completed!');
})();
