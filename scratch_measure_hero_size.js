import puppeteer from 'puppeteer-core';
import path from 'path';
import { fileURLToPath } from 'url';

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

  const measurements = await page.evaluate(() => {
    const canvas = document.querySelector('.hero__canvas');
    const traveler = document.querySelector('.aqua-story__product-traveler');
    const frame = document.querySelector('.aqua-story__product-frame');
    const img = document.querySelector('.aqua-story__product-img');

    return {
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      canvasWidth: canvas ? canvas.clientWidth : 0,
      canvasHeight: canvas ? canvas.clientHeight : 0,
      travelerWidth: traveler ? traveler.clientWidth : 0,
      travelerHeight: traveler ? traveler.clientHeight : 0,
      frameWidth: frame ? frame.clientWidth : 0,
      frameHeight: frame ? frame.clientHeight : 0,
    };
  });

  console.log('Measurements:', measurements);
  await browser.close();
}

run().catch(console.error);
