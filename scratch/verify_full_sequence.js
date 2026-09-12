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
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

  await new Promise(r => setTimeout(r, 2000));

  async function captureAtScroll(scrollY, filename) {
    await page.evaluate((y) => {
      window.scrollTo(0, y);
      ScrollTrigger.update();
    }, scrollY);
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: `scratch/${filename}.png` });
    console.log(`Saved screenshot: scratch/${filename}.png at scrollY=${scrollY}`);
  }

  const pinStart = 3500;
  
  // 1. Stage 0: Static background image without device
  await captureAtScroll(pinStart + 100, 'step1_static_bg');

  // 2. Stage 1: Hero device enters from top & travels into position
  await captureAtScroll(pinStart + 500, 'step2_device_travel');

  // 3. Stage 2: Video starts playing with water spray
  await captureAtScroll(pinStart + 900, 'step3_video_active');

  // 4. Continuing scroll immediately reveals Category 02: HOME CARE
  await captureAtScroll(pinStart + 1500, 'step4_home_care');

  // 5. Continuing scroll reveals Category 03: GIG WORKERS
  await captureAtScroll(pinStart + 2300, 'step5_gig_workers');

  // 6. Continuing scroll reveals Category 04: CORPORATE CARE
  await captureAtScroll(pinStart + 3100, 'step6_corporate_care');

  await browser.close();
}

run().catch(console.error);
