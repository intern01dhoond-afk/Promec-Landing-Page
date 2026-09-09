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

  // Scroll to section 4 (#engineering)
  await page.evaluate(() => {
    const sec4 = document.getElementById('engineering');
    if (sec4) {
      sec4.scrollIntoView();
    }
  });

  await new Promise(r => setTimeout(r, 1500));

  const artifactDir = 'C:\\Users\\balar\\.gemini\\antigravity\\brain\\ba63f837-3a34-4286-b5a3-a435d218e523';
  await page.screenshot({ path: path.join(artifactDir, 'sec4_marquee_verify.png'), fullPage: false });

  console.log('Successfully captured sec4_marquee_verify.png');

  await browser.close();
}

run().catch(console.error);
