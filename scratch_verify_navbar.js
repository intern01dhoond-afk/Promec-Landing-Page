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

  // Hover mouse over Category element box center
  const el = await page.$('#category-dropdown-root p');
  if (el) {
    const box = await el.boundingBox();
    if (box) {
      console.log(`Moving mouse to box: x=${box.x}, y=${box.y}`);
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  // Screenshot: Category hover dropdown active
  await page.screenshot({ path: path.join(artifactDir, 'navbar_category_dropdown.png'), fullPage: false });
  console.log('Captured navbar_category_dropdown.png');

  await browser.close();
}

run().catch(console.error);
