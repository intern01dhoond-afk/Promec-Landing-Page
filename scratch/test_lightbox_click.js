const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

async function testLightboxModal() {
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
  await new Promise(r => setTimeout(r, 1500));

  // Click video card
  console.log('Clicking video card...');
  await page.click('.mini-showreel__card, .mini-showreel__click');

  await new Promise(r => setTimeout(r, 1000));

  const modalOpen = await page.evaluate(() => {
    const modal = document.querySelector('.bunny-lightbox') || document.querySelector('.mini-showreel-lightbox');
    const vid = modal ? modal.querySelector('video') : null;
    return {
      isOpen: modal ? modal.classList.contains('is-open') || window.getComputedStyle(modal).opacity === '1' : false,
      videoSrc: vid ? vid.src : null,
      paused: vid ? vid.paused : true
    };
  });

  console.log('Modal state after click:', modalOpen);

  await page.screenshot({ path: path.join(__dirname, 'lightbox_modal_open.png') });

  await browser.close();
}

testLightboxModal().catch(console.error);
