import puppeteer from 'puppeteer-core';
import path from 'path';
import { fileURLToPath } from 'url';

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const OUT = 'C:\\Users\\balar\\.gemini\\antigravity\\brain\\ba63f837-3a34-4286-b5a3-a435d218e523';
const delay = (ms) => new Promise(r => setTimeout(r, ms));

async function run() {
  const browser = await puppeteer.launch({
    executablePath: EDGE,
    headless: true,
    args: ['--window-size=1440,900']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 30000 });
  await delay(2500);

  await page.evaluate(() => {
    if (window.__lenis) { window.__lenis.destroy(); }
    document.documentElement.style.scrollBehavior = 'auto';
  });

  // Inject transition element dynamically to test
  const setupOk = await page.evaluate(() => {
    const story = document.getElementById('story');
    const heroCanvas = document.querySelector('.hero__canvas');
    if (!story || !heroCanvas) return false;

    // Create transition overlay
    let transition = document.querySelector('[data-usp-transition]');
    if (!transition) {
      transition = document.createElement('div');
      transition.className = 'usp__transition';
      transition.setAttribute('data-usp-transition', '');
      transition.innerHTML = `
        <div class="usp__transition-card" data-usp-transition-card>
          <img src="Pressure_washer_camera_rotation_1080p_202609081213_00239/Pressure_washer_camera_rotation_1080p_202609081213_00239.png" class="usp__transition-img" data-usp-transition-img alt="" />
        </div>
      `;
      document.body.appendChild(transition);
    }

    const card = transition.querySelector('[data-usp-transition-card]');
    const stage = document.querySelector('[data-story-product-stage]');
    const traveler = document.querySelector('[data-story-product-traveler]');
    const targetFrame = document.querySelector('.aqua-story__product-frame');
    const card1Text = document.querySelector('[data-story-row="1"] .aqua-story__text-col');

    // Kill any existing conflicting triggers on story
    ScrollTrigger.getAll().forEach(st => {
      if (st.vars.trigger === story && (st.vars.start === 'top 100%' || st.vars.start === 'top 95%')) {
        st.kill();
      }
    });

    // Function to calculate end rect
    function getEndRect() {
      // At settled state, traveler is at x: 320, centered vertically
      const travelerWidth = Math.min(440, Math.max(320, window.innerWidth * 0.28));
      const travelerHeight = travelerWidth * 1.2;
      const x = window.innerWidth / 2 + 320 - travelerWidth / 2;
      const y = (window.innerHeight - travelerHeight) / 2;
      return {
        x,
        y,
        width: travelerWidth,
        height: travelerHeight,
        radius: 28
      };
    }

    function getStartRect() {
      return {
        x: 0,
        y: 0,
        width: window.innerWidth,
        height: window.innerHeight,
        radius: 0
      };
    }

    // Hide stage initially during handoff
    gsap.set(stage, { autoAlpha: 0 });
    gsap.set(transition, { autoAlpha: 0 });

    const handoffST = ScrollTrigger.create({
      trigger: story,
      start: "top bottom",
      end: "top top",
      scrub: 0.4,
      onUpdate: (self) => {
        const p = self.progress;

        if (p <= 0.005) {
          gsap.set(transition, { autoAlpha: 0 });
          gsap.set(heroCanvas, { autoAlpha: 1 });
          gsap.set(stage, { autoAlpha: 0 });
          return;
        }

        if (p >= 0.995) {
          gsap.set(transition, { autoAlpha: 0 });
          gsap.set(heroCanvas, { autoAlpha: 0 });
          gsap.set(stage, { autoAlpha: 1 });
          return;
        }

        // Active handoff
        gsap.set(transition, { autoAlpha: 1 });
        gsap.set(stage, { autoAlpha: 0 });
        // Fade hero canvas behind transition overlay
        if (p < 0.1) {
          gsap.set(heroCanvas, { autoAlpha: 1 - (p / 0.1) });
        } else {
          gsap.set(heroCanvas, { autoAlpha: 0 });
        }

        const start = getStartRect();
        const end = getEndRect();
        const ease = gsap.parseEase("power1.inOut")(p);

        const curX = gsap.utils.interpolate(start.x, end.x, ease);
        const curY = gsap.utils.interpolate(start.y, end.y, ease);
        const curW = gsap.utils.interpolate(start.width, end.width, ease);
        const curH = gsap.utils.interpolate(start.height, end.height, ease);
        const curR = gsap.utils.interpolate(start.radius, end.radius, ease);

        gsap.set(card, {
          x: curX,
          y: curY,
          width: curW,
          height: curH,
          borderRadius: curR,
          clipPath: `inset(0% 0% 0% 0% round ${curR}px)`,
          boxShadow: `0 ${35 * ease}px ${100 * ease}px rgba(0, 0, 0, ${0.95 * ease}), 0 0 ${40 * ease}px rgba(255, 229, 0, ${0.14 * ease})`,
          border: `1px solid rgba(255, 255, 255, ${0.16 * ease})`,
          force3D: true
        });

        if (card1Text) {
          gsap.set(card1Text, {
            opacity: gsap.utils.clamp(0, 1, (p - 0.3) / 0.7),
            y: (1 - ease) * 50
          });
        }
      }
    });

    return true;
  });

  console.log('Setup status:', setupOk);

  // Capture test screenshots at 6 scroll points in the handoff zone
  const testScrolls = [
    { name: 'morph_01_at_2600', y: 2600 },
    { name: 'morph_02_at_2780', y: 2780 },
    { name: 'morph_03_at_2950', y: 2950 },
    { name: 'morph_04_at_3150', y: 3150 },
    { name: 'morph_05_at_3350', y: 3350 },
    { name: 'morph_06_at_3527', y: 3527 },
  ];

  for (const s of testScrolls) {
    await page.evaluate((pos) => window.scrollTo(0, pos), s.y);
    await delay(700);
    await page.screenshot({ path: path.join(OUT, `${s.name}.png`) });
    console.log(`Saved ${s.name}.png`);
  }

  await browser.close();
  console.log('Done testing morph handoff!');
}

run().catch(console.error);
