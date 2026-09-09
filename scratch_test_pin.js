import puppeteer from 'puppeteer-core';

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function run() {
  const browser = await puppeteer.launch({
    executablePath: EDGE,
    headless: true,
    args: ['--window-size=1440,900']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 30000 });

  const testResult = await page.evaluate(() => {
    const story = document.getElementById('story');
    const stage = document.querySelector('[data-story-product-stage]');

    // Create a test pin
    const st = ScrollTrigger.create({
      trigger: story,
      start: 'top bottom',
      end: 'bottom bottom',
      pin: stage,
      pinSpacing: false
    });

    // Scroll to 2650 (just past hero end)
    window.scrollTo(0, 2650);
    ScrollTrigger.update();

    const stageRect = stage.getBoundingClientRect();
    const stageStyles = getComputedStyle(stage);

    return {
      scrollY: window.scrollY,
      stageTop: stageRect.top,
      stageLeft: stageRect.left,
      stageWidth: stageRect.width,
      stageHeight: stageRect.height,
      stagePosition: stageStyles.position,
    };
  });

  console.log('Pin test result at scrollY=2650:', testResult);
  await browser.close();
}

run().catch(console.error);
