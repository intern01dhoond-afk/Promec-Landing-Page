import puppeteer from 'puppeteer-core';

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function run() {
  const browser = await puppeteer.launch({
    executablePath: EDGE,
    headless: false, // run visible so we can watch behavior
    args: ['--window-size=1440,900']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

  await new Promise(r => setTimeout(r, 1000));

  // Inspect video status during scroll
  const videoState = await page.evaluate(async () => {
    const v = document.querySelector('[data-story-video="1"]');
    if (!v) return { error: 'no video' };
    return {
      readyState: v.readyState,
      paused: v.paused,
      currentTime: v.currentTime,
      duration: v.duration,
      src: v.currentSrc
    };
  });

  console.log('Video initial state:', videoState);

  // Scroll to stage 2
  await page.evaluate(() => {
    window.scrollTo(0, 4500); // Stage 2 scroll range
    ScrollTrigger.update();
  });

  await new Promise(r => setTimeout(r, 1000));

  const stage2VideoState = await page.evaluate(() => {
    const v = document.querySelector('[data-story-video="1"]');
    return {
      readyState: v.readyState,
      paused: v.paused,
      currentTime: v.currentTime,
      duration: v.duration,
      opacity: window.getComputedStyle(v).opacity,
      display: window.getComputedStyle(v).display
    };
  });

  console.log('Stage 2 video state:', stage2VideoState);

  await browser.close();
}

run().catch(console.error);
