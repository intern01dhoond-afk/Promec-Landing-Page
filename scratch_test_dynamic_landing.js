import puppeteer from 'puppeteer-core';
import path from 'path';

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const delay = (ms) => new Promise(r => setTimeout(r, ms));

// Dynamic object-fit: cover coordinate calculator
function getCoverDeviceRect(winW, winH) {
  const videoNativeW = 1920;
  const videoNativeH = 1080;
  const videoAspect = videoNativeW / videoNativeH;
  const containerAspect = winW / winH;

  let renderW, renderH, offsetX, offsetY;

  if (containerAspect > videoAspect) {
    // Container is wider than 16:9
    renderW = winW;
    renderH = winW / videoAspect;
    offsetX = 0;
    offsetY = (winH - renderH) / 2;
  } else {
    // Container is taller than 16:9
    renderH = winH;
    renderW = winH * videoAspect;
    offsetX = (winW - renderW) / 2;
    offsetY = 0;
  }

  // Bounding box of the yellow device in native 1920x1080 video frame
  const normX = 1255 / 1920;
  const normY = 210 / 1080;
  const normW = 530 / 1920;
  const normH = 620 / 1080;

  const targetX = offsetX + normX * renderW;
  const targetY = offsetY + normY * renderH;
  const targetW = normW * renderW;
  const targetH = normH * renderH;

  return { x: targetX, y: targetY, width: targetW, height: targetH };
}

async function testResolution(width, height, label) {
  const browser = await puppeteer.launch({
    executablePath: EDGE,
    headless: true,
    args: [`--window-size=${width},${height}`]
  });
  const page = await browser.newPage();
  await page.setViewport({ width, height });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await delay(2000);

  // Overlay calculation check
  await page.evaluate(({ winW, winH }) => {
    if (window.__lenis) window.__lenis.destroy();
    const story = document.getElementById('story');
    if (story) {
      const top = story.getBoundingClientRect().top + window.scrollY;
      window.scrollTo(0, top);
    }

    const row = document.querySelector('[data-story-row="1"]');
    if (row) row.classList.add('is-video-active');

    // Calculate using cover formula inside browser
    const videoNativeW = 1920;
    const videoNativeH = 1080;
    const videoAspect = videoNativeW / videoNativeH;
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

    // Normalized bounds inside 1920x1080 frame
    const normX = 1255 / 1920;
    const normY = 210 / 1080;
    const normW = 530 / 1920;
    const normH = 620 / 1080;

    const x = offsetX + normX * renderW;
    const y = offsetY + normY * renderH;
    const w = normW * renderW;
    const h = normH * renderH;

    const card = document.querySelector('[data-usp-transition-card]');
    const transition = document.querySelector('[data-usp-transition]');
    if (transition && card) {
      transition.style.display = 'block';
      transition.style.visibility = 'visible';
      transition.style.opacity = '1';
      card.style.position = 'fixed';
      card.style.left = '0px';
      card.style.top = '0px';
      card.style.transform = `translate3d(${x}px, ${y}px, 0px)`;
      card.style.width = `${w}px`;
      card.style.height = `${h}px`;
      card.style.opacity = '0.6';
      card.style.zIndex = '9999';
    }
  }, { winW: width, winH: height });

  await delay(1000);
  const screenshotPath = `C:\\Users\\balar\\.gemini\\antigravity\\brain\\906d7ae0-c5ee-4886-a815-7be28d298c26\\dynamic_landing_${label}.png`;
  await page.screenshot({ path: screenshotPath });
  console.log(`Saved dynamic_landing_${label}.png`);

  await browser.close();
}

async function run() {
  await testResolution(1440, 900, '1440x900');
  await testResolution(1920, 1080, '1920x1080');
  await testResolution(1280, 800, '1280x800');
}

run().catch(console.error);
