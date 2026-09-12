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

  const info = await page.evaluate(() => {
    const hero = document.getElementById('overview');
    const story = document.getElementById('story');
    const triggers = ScrollTrigger.getAll().map(st => ({
      trigger: st.vars.trigger ? (st.vars.trigger.id || st.vars.trigger.className) : 'none',
      start: st.start,
      end: st.end,
      pin: !!st.pin
    }));

    return {
      heroScrollHeight: hero ? hero.offsetHeight : 0,
      storyTop: story ? story.getBoundingClientRect().top + window.scrollY : 0,
      triggers: triggers
    };
  });

  console.log('Page info:', JSON.stringify(info, null, 2));
  await browser.close();
}

run().catch(console.error);
