import puppeteer from 'puppeteer-core';
import path from 'path';
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
  await page.setViewport({ width: 1440, height: 900 });

  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1500));

  const info = await page.evaluate(() => {
    const card = document.querySelector('.mini-showreel__card');
    const coverVid = card ? card.querySelector('.cover-video') : null;
    const bunnyVid = card ? card.querySelector('.bunny-player__video') : null;

    return {
      cardFound: !!card,
      coverVidSrc: coverVid ? coverVid.src : null,
      coverVidPaused: coverVid ? coverVid.paused : null,
      coverVidReadyState: coverVid ? coverVid.readyState : null,
      bunnyVidSrc: bunnyVid ? bunnyVid.src : null,
      bunnyVidPaused: bunnyVid ? bunnyVid.paused : null,
      bunnyVidReadyState: bunnyVid ? bunnyVid.readyState : null
    };
  });

  console.log('Hero Card Video Status:', info);

  const artifactDir = 'C:\\Users\\balar\\.gemini\\antigravity\\brain\\33b81bc9-bdc5-4120-b4bd-6f28ec277924';
  const outPath = path.join(artifactDir, 'hero_video_card.png');
  await page.screenshot({ path: outPath });
  console.log(`Saved screenshot to ${outPath}`);

  await browser.close();
})();
