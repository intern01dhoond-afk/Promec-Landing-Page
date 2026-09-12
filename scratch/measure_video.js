import puppeteer from 'puppeteer-core';
import path from 'path';

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function run() {
  const browser = await puppeteer.launch({
    executablePath: EDGE,
    headless: true,
    args: ['--window-size=1920,1080']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

  const info = await page.evaluate(async () => {
    const video = document.querySelector('[data-story-video="1"]');
    if (!video) return { error: 'video not found' };
    
    video.currentTime = 1.0;
    await new Promise(r => setTimeout(r, 500));
    
    return {
      videoWidth: video.videoWidth,
      videoHeight: video.videoHeight,
      clientWidth: video.clientWidth,
      clientHeight: video.clientHeight
    };
  });

  console.log('Video info:', info);
  await browser.close();
}

run().catch(console.error);
