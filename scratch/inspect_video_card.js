const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

async function inspectVideoCard() {
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

  const details = await page.evaluate(() => {
    const el = document.querySelector('.home-hero__video');
    if (!el) return 'Element not found';

    function getTree(node) {
      if (node.nodeType === 3) return node.textContent.trim();
      if (node.nodeType !== 1) return null;
      const cs = window.getComputedStyle(node);
      const rect = node.getBoundingClientRect();
      const children = Array.from(node.childNodes).map(getTree).filter(Boolean);
      return {
        tag: node.tagName,
        class: node.className,
        id: node.id,
        attrs: Array.from(node.attributes).map(a => `${a.name}="${a.value}"`),
        computed: {
          display: cs.display,
          visibility: cs.visibility,
          opacity: cs.opacity,
          zIndex: cs.zIndex,
          width: cs.width,
          height: cs.height,
          position: cs.position,
          backgroundColor: cs.backgroundColor
        },
        rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
        children
      };
    }

    return getTree(el);
  });

  console.log(JSON.stringify(details, null, 2));

  await browser.close();
}

inspectVideoCard().catch(console.error);
