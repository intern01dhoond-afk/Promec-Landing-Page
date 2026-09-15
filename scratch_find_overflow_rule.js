import puppeteer from 'puppeteer-core';

async function findRuleOrigin() {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.goto('http://localhost:3001', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1000));

  const rulesInfo = await page.evaluate(() => {
    const el = document.querySelector('.nav__bar');
    if (!el) return 'Element .nav__bar not found';

    const matched = [];
    for (const sheet of document.styleSheets) {
      try {
        for (const rule of sheet.cssRules || []) {
          if (rule.selectorText && el.matches(rule.selectorText)) {
            if (rule.style.overflow || rule.style.overflowY || rule.style.overflowX) {
              matched.push({
                href: sheet.href || 'inline',
                selector: rule.selectorText,
                overflow: rule.style.overflow,
                overflowX: rule.style.overflowX,
                overflowY: rule.style.overflowY,
                cssText: rule.cssText
              });
            }
          }
        }
      } catch (e) {
        // cross origin style sheet
      }
    }
    return matched;
  });

  console.log('Matched rules setting overflow on .nav__bar:', JSON.stringify(rulesInfo, null, 2));
  await browser.close();
}

findRuleOrigin().catch(console.error);
