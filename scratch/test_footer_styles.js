const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

async function testFooterGradient() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const executablePath = fs.existsSync(edgePath) ? edgePath : chromePath;

  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    defaultViewport: { width: 1440, height: 1100 }
  });

  const page = await browser.newPage();
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));

  await page.evaluate(() => {
    const cta = document.querySelector('.aqua-cta-banner');
    const footer = document.querySelector('.aqua-footer');
    if (cta && footer) {
      cta.style.setProperty('margin-bottom', '0px', 'important');
      cta.style.setProperty('z-index', '10', 'important');
      cta.style.setProperty('position', 'relative', 'important');

      // Add pseudo fade if needed or style bottom
      footer.style.setProperty('z-index', '1', 'important');
      footer.style.setProperty('margin-top', '0px', 'important');
      footer.style.setProperty('padding-top', '40px', 'important');
    }
    window.scrollTo(0, document.body.scrollHeight);
  });

  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(__dirname, 'footer_style_clean_cta_above.png') });

  await browser.close();
}

testFooterGradient().catch(console.error);
