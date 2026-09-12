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
        video { width: 1920px; height: 1080px; object-fit: cover; }
      </style>
    </head>
    <body>
      <video id="v" src="http://localhost:3000/assets/video_autocare.mp4" muted></video>
    </body>
    </html>
  `);

  await page.evaluate(async () => {
    const v = document.getElementById('v');
    v.currentTime = 1.5;
    await new Promise(r => setTimeout(r, 800));
  });

  await page.screenshot({ path: 'scratch/video_autocare_frame.png' });
  console.log('Saved scratch/video_autocare_frame.png');
  await browser.close();
}

run().catch(console.error);
