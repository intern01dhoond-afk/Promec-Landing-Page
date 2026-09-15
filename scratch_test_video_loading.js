import puppeteer from 'puppeteer-core';
import fs from 'fs';

const possiblePaths = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
];

let executablePath = possiblePaths.find(p => fs.existsSync(p));

(async () => {
  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  const videoRequests = [];
  page.on('request', req => {
    const url = req.url();
    if (url.includes('.mp4')) {
      videoRequests.push({ url, headers: req.headers() });
    }
  });

  console.log('Navigating to http://localhost:3000/...');
  const startTime = Date.now();
  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
  
  await new Promise(r => setTimeout(r, 2000));

  console.log(`Initial page load time: ${Date.now() - startTime}ms`);
  console.log(`Video MP4 Requests triggered on load: ${videoRequests.length}`);
  videoRequests.forEach((r, idx) => {
    console.log(`  [${idx+1}] ${r.url}`);
  });

  const videoStates = await page.evaluate(() => {
    const videos = Array.from(document.querySelectorAll('video'));
    return videos.map((v, i) => ({
      index: i,
      src: v.src || v.currentSrc,
      class: v.className,
      paused: v.paused,
      readyState: v.readyState,
      buffered: v.buffered.length ? `${v.buffered.start(0).toFixed(1)}s - ${v.buffered.end(0).toFixed(1)}s` : 'none',
      preload: v.preload,
      autoplay: v.autoplay
    }));
  });

  console.log('\nVideo Elements Status in DOM:');
  console.log(JSON.stringify(videoStates, null, 2));

  await browser.close();
})();
