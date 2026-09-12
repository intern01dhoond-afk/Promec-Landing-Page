import puppeteer from 'puppeteer-core';

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function run() {
  const browser = await puppeteer.launch({
    executablePath: EDGE,
    headless: true,
    args: ['--window-size=1920,1080']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { margin: 0; padding: 0; background: #000; overflow: hidden; }
        img { width: 1920px; height: 1080px; object-fit: cover; }
      </style>
    </head>
    <body>
      <img src="http://localhost:3000/assets/bg_autocare_nodevice.png" />
    </body>
    </html>
  `);

  await new Promise(r => setTimeout(r, 800));

  await page.screenshot({ path: 'scratch/static_bg_nodevice_frame.png' });
  console.log('Saved scratch/static_bg_nodevice_frame.png');
  await browser.close();
}

run().catch(console.error);
