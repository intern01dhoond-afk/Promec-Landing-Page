import puppeteer from 'puppeteer-core';
import path from 'path';

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

  // Test overlay box positioning on section 2
  await page.evaluate(() => {
    const row = document.querySelector('[data-story-row="1"]');
    if (!row) return;
    row.classList.add('is-video-active');
    const v = document.querySelector('[data-story-video="1"]');
    if (v) { v.currentTime = 0.5; v.play(); }
    
    // Draw test bounding box
    const winW = window.innerWidth;
    const winH = window.innerHeight;
    const videoAspect = 1920 / 1080;
    const containerAspect = winW / winH;

    let renderW, renderH, offsetX, offsetY;
    if (containerAspect > videoAspect) {
      renderW = winW;
      renderH = winW / videoAspect;
      offsetX = 0;
      offsetY = (winH - renderH) / 2;
    } else {
      renderH = winH;
      renderW = winH * videoAspect;
      offsetX = (winW - renderW) / 2;
      offsetY = 0;
    }

    const normX = 1255 / 1920;
    const normY = 210 / 1080;
    const normW = 530 / 1920;
    const normH = 620 / 1080;

    const x = offsetX + normX * renderW;
    const y = offsetY + normY * renderH;
    const w = normW * renderW;
    const h = normH * renderH;

    const box = document.createElement('div');
    box.style.position = 'fixed';
    box.style.left = x + 'px';
    box.style.top = y + 'px';
    box.style.width = w + 'px';
    box.style.height = h + 'px';
    box.style.border = '3px solid red';
    box.style.zIndex = '99999';
    box.style.pointerEvents = 'none';
    document.body.appendChild(box);
  });

  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: 'scratch/test_device_box.png' });
  console.log('Saved scratch/test_device_box.png');

  await browser.close();
}

run().catch(console.error);
