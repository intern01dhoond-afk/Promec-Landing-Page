import puppeteer from 'puppeteer-core';

async function inspectStyles() {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  await page.goto('http://localhost:3001', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2000));

  const categoryEl = await page.$('#category-dropdown-root');
  if (categoryEl) {
    const box = await categoryEl.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  const inspection = await page.evaluate(() => {
    const selList = [
      '#category-dropdown-root',
      '.nav__custom-menu',
      '.nav__bar',
      '.nav',
      '.container.nav',
      '.navigation',
      '.hero',
      '.hero__sticky',
      '.hero__overlay',
      '.main-wrapper'
    ];

    return selList.map(sel => {
      const el = document.querySelector(sel);
      if (!el) return { sel, found: false };
      const cs = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return {
        sel,
        found: true,
        rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
        overflow: cs.overflow,
        overflowX: cs.overflowX,
        overflowY: cs.overflowY,
        zIndex: cs.zIndex,
        position: cs.position,
        opacity: cs.opacity,
        visibility: cs.visibility,
        clip: cs.clip,
        clipPath: cs.clipPath,
        transform: cs.transform
      };
    });
  });

  console.log(JSON.stringify(inspection, null, 2));

  // Also check the dropdown menu popup box position and styles
  const dropdownPopup = await page.evaluate(() => {
    const popup = document.querySelector('#category-dropdown-root div[style*="position: absolute"]');
    if (!popup) return null;
    const cs = window.getComputedStyle(popup);
    const rect = popup.getBoundingClientRect();
    return {
      rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
      zIndex: cs.zIndex,
      opacity: cs.opacity,
      visibility: cs.visibility,
      display: cs.display
    };
  });
  console.log('Dropdown popup:', JSON.stringify(dropdownPopup, null, 2));

  await browser.close();
}

inspectStyles().catch(console.error);
