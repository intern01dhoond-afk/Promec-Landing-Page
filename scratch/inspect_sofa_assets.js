import puppeteer from 'puppeteer-core';
import fs from 'fs';

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function run() {
  // Check image header
  const buf = fs.readFileSync('assets/bg_homecare_sofa_nodevice.png');
  const width = buf.readUInt32BE(16);
  const height = buf.readUInt32BE(20);
  console.log('bg_homecare_sofa_nodevice.png:', width, 'x', height, 'Aspect:', width/height);

  const browser = await puppeteer.launch({
    executablePath: EDGE,
    headless: true,
    args: ['--window-size=1920,1080']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  // 1. Capture video frame at t=1.5s
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
      <video id="v" src="http://localhost:3000/assets/video_homecare_sofa.mp4" muted></video>
    </body>
    </html>
  `);

  await page.evaluate(async () => {
    const v = document.getElementById('v');
    v.currentTime = 1.5;
    await new Promise(r => setTimeout(r, 800));
  });

  await page.screenshot({ path: 'scratch/video_sofa_frame.png' });
  console.log('Saved scratch/video_sofa_frame.png');

  // 2. Capture static bg image
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
      <img src="http://localhost:3000/assets/bg_homecare_sofa_nodevice.png" />
    </body>
    </html>
  `);

  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: 'scratch/static_sofa_frame.png' });
  console.log('Saved scratch/static_sofa_frame.png');

  await browser.close();
}

run().catch(console.error);
