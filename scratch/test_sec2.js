const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

async function testSection2() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const executablePath = fs.existsSync(edgePath) ? edgePath : chromePath;

  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    defaultViewport: { width: 1440, height: 900 }
  });

  const page = await browser.newPage();
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));

  const scrollPositions = [2800, 3400, 4200];
  for (let i = 0; i < scrollPositions.length; i++) {
    const y = scrollPositions[i];
    await page.evaluate((scrollPos) => {
      window.scrollTo(0, scrollPos);
    }, y);
    await new Promise(r => setTimeout(r, 800));

    await page.screenshot({ path: path.join(__dirname, `sec2_scroll_y${y}.png`) });
  }

  await browser.close();
}

testSection2().catch(console.error);
