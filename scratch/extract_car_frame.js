const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

(async () => {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  let executablePath = fs.existsSync(edgePath) ? edgePath : (fs.existsSync(chromePath) ? chromePath : null);

  const browser = await puppeteer.launch({
    executablePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  // Load static car image
  const staticPath = 'file:///' + path.join(__dirname, '..', 'assets', 'bg_autocare_nodevice.png').replace(/\\/g, '/');
  await page.goto(staticPath);
  await page.screenshot({ path: path.join(__dirname, 'car_static_frame.png') });
  console.log('Saved scratch/car_static_frame.png');

  // Load video frame
  const html = `
    <!DOCTYPE html>
    <html>
    <body style="margin:0; background:black; overflow:hidden;">
      <video src="file:///${path.join(__dirname, '..', 'assets', 'video_autocare.mp4').replace(/\\/g, '/')}" style="width:1920px; height:1080px; object-fit:cover;" autoplay muted></video>
    </body>
    </html>
  `;
  await page.setContent(html);
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(__dirname, 'car_video_frame.png') });
  console.log('Saved scratch/car_video_frame.png');

  await browser.close();
})();
