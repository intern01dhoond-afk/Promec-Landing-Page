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

  // 1. Hero & Navbar
  await page.screenshot({ path: path.join(artifactDir, 'diag_01_hero.png') });

  // 2. Section 2
  await page.evaluate(() => window.scrollTo(0, 3000));
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(artifactDir, 'diag_02_section2.png') });

  // 3. Section 3
  await page.evaluate(() => {
    const el = document.getElementById('solutions-showcase');
    if (el) el.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(artifactDir, 'diag_03_section3.png') });

  // 4. Section 4
  await page.evaluate(() => {
    const el = document.getElementById('engineering');
    if (el) el.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(artifactDir, 'diag_04_section4.png') });

  // 5. Section 5 & Footer
  await page.evaluate(() => {
    const el = document.getElementById('testimonials');
    if (el) el.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(artifactDir, 'diag_05_section5.png') });

  await browser.close();
  console.log('Saved all diagnostic screenshots');
}

run().catch(console.error);
