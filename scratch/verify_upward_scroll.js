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

  // 1. Scroll down to Category 1 (Video active)
  await captureAtScroll(4400, 'up1_down_video_active');

  // 2. Scroll down to Category 3 (Gig workers)
  await captureAtScroll(5800, 'up2_down_gig_workers');

  // 3. Scroll BACK UP to top of Section 2 (scrollY = 3550) -> Video MUST stay visible, static image NOT shown!
  await captureAtScroll(3550, 'up3_top_of_sec2_video_only');

  // 4. Scroll ALL THE WAY BACK UP into Hero section (scrollY = 500) -> Hero 360 canvas active
  await captureAtScroll(500, 'up4_back_in_hero');

  await browser.close();
}

run().catch(console.error);
