import puppeteer from 'puppeteer-core';
import path from 'path';

async function run() {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1500));

  const artifactDir = 'C:\\Users\\balar\\.gemini\\antigravity\\brain\\ba63f837-3a34-4286-b5a3-a435d218e523';

  // 1. Initial State: Transparent floating navbar over Hero
  await page.screenshot({ path: path.join(artifactDir, 'navbar_transparent_initial.png'), fullPage: false });
  console.log('Saved navbar_transparent_initial.png');

  // 2. Scroll down to Section 2 (#story)
  await page.evaluate(() => {
    window.scrollTo(0, 2800);
  });
  await new Promise(r => setTimeout(r, 1200));

  // Screenshot: Scrolled floating dark glass pill bar
  await page.screenshot({ path: path.join(artifactDir, 'navbar_glass_scrolled.png'), fullPage: false });
  console.log('Saved navbar_glass_scrolled.png');

  await browser.close();
}

run().catch(console.error);
