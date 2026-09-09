/**
 * RADIAN EXR — MASTER ANIMATION & MOTION CONTROLLER
 * Upgraded with Zajno Motion, Apple Product Scroller & Codrops UI Animation Architectures.
 */

document.addEventListener("DOMContentLoaded", () => {
  // -------------------------------------------------------------
  // 1. GSAP & EASING INITIALIZATION
  // -------------------------------------------------------------
  if (typeof gsap === "undefined") {
    console.error("GSAP not found");
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  if (typeof CustomEase !== "undefined") {
    gsap.registerPlugin(CustomEase);
    CustomEase.create("uncommon", "0.625, 0.05, 0, 1");
    CustomEase.create("smoothOut", "0.16, 1, 0.3, 1");
    gsap.defaults({ ease: "uncommon", duration: 0.7 });
  }

  // -------------------------------------------------------------
  // 2. LENIS SMOOTH MOMENTUM SCROLLING WITH VELOCITY TRACKING
  // -------------------------------------------------------------
  let lenis = null;
  let scrollVelocity = 0;
  const skewTargets = document.querySelectorAll(".velocity-skew-target, .draggable-marquee__list");

  if (typeof Lenis !== "undefined") {
    if (window.lenis && typeof window.lenis.destroy === "function") {
      try { window.lenis.destroy(); } catch (_) {}
    }
    if (window.UNCOMMON?.lenis && typeof window.UNCOMMON.lenis.destroy === "function" && window.UNCOMMON.lenis !== window.lenis) {
      try { window.UNCOMMON.lenis.destroy(); } catch (_) {}
    }

    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.5,
    });

    lenis.on("scroll", (e) => {
      ScrollTrigger.update();
      scrollVelocity = e.velocity || 0;

      // Zajno velocity-based subtle skew
      if (Math.abs(scrollVelocity) > 0.1 && skewTargets.length > 0) {
        const clampedSkew = Math.max(-3.5, Math.min(3.5, scrollVelocity * 0.035));
        skewTargets.forEach((target) => {
          gsap.to(target, {
            skewY: clampedSkew,
            duration: 0.2,
            ease: "power1.out",
            overwrite: "auto",
          });
        });
      } else {
        skewTargets.forEach((target) => {
          gsap.to(target, {
            skewY: 0,
            duration: 0.4,
            ease: "power2.out",
            overwrite: "auto",
          });
        });
      }
    });

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // Ensure scrolling is active and unlocked
    const guaranteePageScrollable = () => {
      if (window.UNCOMMON?.scrollLock) {
        window.UNCOMMON.homeHeroIntroScrollLocked = false;
        if (typeof window.UNCOMMON.scrollLock.unlock === "function") {
          try { window.UNCOMMON.scrollLock.unlock(); } catch (_) {}
        }
      }
      document.documentElement.style.overflow = "auto";
      document.documentElement.style.overflowY = "auto";
      document.body.style.overflow = "auto";
      document.body.style.overflowY = "auto";
      document.body.style.touchAction = "auto";
      document.body.style.position = "static";
      document.documentElement.classList.remove("lenis-stopped", "is-locked");
      document.body.classList.remove("lenis-stopped", "is-locked");

      if (lenis && typeof lenis.start === "function") {
        lenis.start();
      }
    };

    guaranteePageScrollable();
    window.addEventListener("load", guaranteePageScrollable);
    setTimeout(guaranteePageScrollable, 200);
    setTimeout(guaranteePageScrollable, 800);

    window.lenis = lenis;
    window.UNCOMMON = window.UNCOMMON || {};
    window.UNCOMMON.lenis = lenis;
  }

  // -------------------------------------------------------------
  // 3. CURSOR MODE: NATIVE BROWSER CURSOR
  // -------------------------------------------------------------
  const hasFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  // -------------------------------------------------------------
  // 4. ZAJNO MAGNETIC BUTTON ATTRACTION PHYSICS
  // -------------------------------------------------------------
  const magneticButtons = document.querySelectorAll("[data-magnetic]");
  if (hasFinePointer) {
    magneticButtons.forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) * 0.35;
        const deltaY = (e.clientY - centerY) * 0.35;

        gsap.to(btn, {
          x: deltaX,
          y: deltaY,
          duration: 0.3,
          ease: "power2.out",
          overwrite: "auto",
        });
      });

      btn.addEventListener("mouseleave", () => {
        gsap.to(btn, {
          x: 0,
          y: 0,
          duration: 0.6,
          ease: "elastic.out(1.1, 0.4)",
          overwrite: "auto",
        });
      });
    });
  }

  // -------------------------------------------------------------
  // 5. CODROPS 3D PERSPECTIVE HOVER TILT
  // -------------------------------------------------------------
  const tiltCards = document.querySelectorAll("[data-tilt]");
  if (hasFinePointer) {
    tiltCards.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        gsap.to(card, {
          rotateY: x * 12,
          rotateX: -y * 12,
          scale: 1.02,
          transformPerspective: 1000,
          duration: 0.25,
          ease: "power2.out",
          overwrite: "auto",
        });
      });

      card.addEventListener("mouseleave", () => {
        gsap.to(card, {
          rotateY: 0,
          rotateX: 0,
          scale: 1,
          duration: 0.6,
          ease: "power2.out",
          overwrite: "auto",
        });
      });
    });
  }

  // -------------------------------------------------------------
  // 6. APPLE-STYLE PRECISION METRIC COUNTERS
  // -------------------------------------------------------------
  const metricCounters = document.querySelectorAll("[data-counter]");
  if (metricCounters.length > 0) {
    ScrollTrigger.create({
      trigger: "#metrics-strip",
      start: "top 80%",
      once: true,
      onEnter: () => {
        metricCounters.forEach((counter) => {
          const targetVal = parseFloat(counter.getAttribute("data-counter"));
          const obj = { val: 0 };

          gsap.to(obj, {
            val: targetVal,
            duration: 1.8,
            ease: "power3.out",
            onUpdate: () => {
              counter.textContent = Math.round(obj.val).toLocaleString();
            },
          });
        });
      },
    });
  }

  // -------------------------------------------------------------
  // 7. TOAST NOTIFICATION UTILITY
  // -------------------------------------------------------------
  const toastEl = document.getElementById("radianToast");
  function showToast(message, duration = 3500) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add("is-show");
    setTimeout(() => {
      toastEl.classList.remove("is-show");
    }, duration);
  }

  // -------------------------------------------------------------
  // 8. TOP NAV 01/09 ODOMETER & ANCHORED DROPDOWN
  // -------------------------------------------------------------
  const odometerGroup = document.querySelector("[data-odometer-group]");
  // -------------------------------------------------------------
  // 8. PROMEC CUSTOM NAVIGATION (HOME, SOLUTIONS, ABOUT US, CONTACT US)
  // -------------------------------------------------------------
  const customNavLinks = document.querySelectorAll("[data-nav-target]");

  function setActiveNavLink(targetName) {
    customNavLinks.forEach((link) => {
      const match = link.getAttribute("data-nav-target") === targetName;
      link.classList.toggle("is-active", match);
    });
  }

  customNavLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const target = link.getAttribute("data-nav-target");
      if (!target) return;
      e.preventDefault();

      if (target === "home") {
        setActiveNavLink("home");
        if (typeof lenis !== "undefined" && lenis) {
          lenis.scrollTo(0, { duration: 1.0 });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      } else if (target === "solutions" || target === "category") {
        setActiveNavLink("solutions");
        const el = document.getElementById("story");
        if (el) {
          if (typeof lenis !== "undefined" && lenis) {
            lenis.scrollTo(el, { offset: 0, duration: 1.0 });
          } else {
            el.scrollIntoView({ behavior: "smooth" });
          }
        }
      } else if (target === "about") {
        setActiveNavLink("about");
        const el = document.getElementById("overview");
        if (el) {
          if (typeof lenis !== "undefined" && lenis) {
            lenis.scrollTo(el, { offset: 0, duration: 1.0 });
          } else {
            el.scrollIntoView({ behavior: "smooth" });
          }
        }
      } else if (target === "contact") {
        setActiveNavLink("contact");
        const el = document.querySelector(".aqua-footer") || document.getElementById("email-form");
        if (el) {
          if (typeof lenis !== "undefined" && lenis) {
            lenis.scrollTo(el, { offset: 0, duration: 1.2 });
          } else {
            el.scrollIntoView({ behavior: "smooth" });
          }
        }
      }

      // Close mobile menu if open
      const navWrap = document.querySelector(".navigation");
      if (navWrap && navWrap.getAttribute("data-menu-open") === "true") {
        const navContent = document.querySelector(".nav__content");
        navWrap.setAttribute("data-menu-open", "false");
        if (navContent && typeof gsap !== "undefined") {
          gsap.to(navContent, { autoAlpha: 0, duration: 0.35, ease: "power2.in" });
        }
      }
    });
  });

  // ScrollTrigger to highlight active link based on current section
  const storySec = document.getElementById("story");
  if (storySec && typeof ScrollTrigger !== "undefined") {
    ScrollTrigger.create({
      trigger: storySec,
      start: "top 40%",
      end: "bottom 60%",
      onEnter: () => setActiveNavLink("solutions"),
      onLeaveBack: () => setActiveNavLink("home")
    });
  }

  const showcaseSec = document.getElementById("solutions-showcase");
  if (showcaseSec && typeof ScrollTrigger !== "undefined") {
    ScrollTrigger.create({
      trigger: showcaseSec,
      start: "top 60%",
      end: "bottom 40%",
      onEnter: () => setActiveNavLink("solutions"),
      onLeaveBack: () => setActiveNavLink("solutions")
    });
  }

  const engineeringSec = document.getElementById("engineering");
  if (engineeringSec && typeof ScrollTrigger !== "undefined") {
    ScrollTrigger.create({
      trigger: engineeringSec,
      start: "top 60%",
      end: "bottom 40%",
      onEnter: () => setActiveNavLink("about"),
      onLeaveBack: () => setActiveNavLink("solutions")
    });

    const cards = engineeringSec.querySelectorAll(".aqua-engineering__card");
    const heading = engineeringSec.querySelector(".aqua-engineering__heading");
    const textCols = engineeringSec.querySelectorAll(".aqua-engineering__text-col");

    if (cards.length > 0 && typeof gsap !== "undefined") {
      gsap.from(cards, {
        scrollTrigger: {
          trigger: engineeringSec,
          start: "top 75%",
          once: true
        },
        y: 35,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: "power2.out"
      });
    }

    if ((heading || textCols.length > 0) && typeof gsap !== "undefined") {
      gsap.from([heading, ...textCols], {
        scrollTrigger: {
          trigger: ".aqua-engineering__grid",
          start: "top 80%",
          once: true
        },
        y: 25,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out"
      });
    }
  }

  const testimonialsSec = document.getElementById("testimonials");
  if (testimonialsSec && typeof ScrollTrigger !== "undefined") {
    ScrollTrigger.create({
      trigger: testimonialsSec,
      start: "top 60%",
      end: "bottom 40%",
      onEnter: () => setActiveNavLink("about"),
      onLeaveBack: () => setActiveNavLink("about")
    });

    const leftCol = testimonialsSec.querySelector(".aqua-testimonials__left");
    const cards = testimonialsSec.querySelectorAll(".aqua-testimonials__card");

    if (leftCol && typeof gsap !== "undefined") {
      gsap.from(leftCol, {
        scrollTrigger: {
          trigger: testimonialsSec,
          start: "top 75%",
          once: true
        },
        x: -30,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out"
      });
    }

    if (cards.length > 0 && typeof gsap !== "undefined") {
      gsap.from(cards, {
        scrollTrigger: {
          trigger: testimonialsSec,
          start: "top 75%",
          once: true
        },
        y: 20,
        opacity: 0,
        duration: 0.4,
        stagger: 0.05,
        ease: "power2.out"
      });
    }
  }

  const ctaBannerSec = document.getElementById("cta-banner");
  if (ctaBannerSec && typeof ScrollTrigger !== "undefined") {
    ScrollTrigger.create({
      trigger: ctaBannerSec,
      start: "top 60%",
      end: "bottom 40%",
      onEnter: () => setActiveNavLink("solutions"),
      onLeaveBack: () => setActiveNavLink("about")
    });

    const header = ctaBannerSec.querySelector(".aqua-cta-banner__header");
    const productImg = ctaBannerSec.querySelector(".aqua-cta-banner__product-img");

    if (header && typeof gsap !== "undefined") {
      gsap.from(header, {
        scrollTrigger: {
          trigger: ctaBannerSec,
          start: "top 75%",
          once: true
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out"
      });
    }

    if (productImg && typeof gsap !== "undefined") {
      gsap.from(productImg, {
        scrollTrigger: {
          trigger: ".aqua-cta-banner__hero",
          start: "top 80%",
          once: true
        },
        y: 40,
        opacity: 0,
        duration: 1.0,
        ease: "power2.out"
      });
    }
  }

  const footerSec = document.querySelector(".aqua-footer");
  if (footerSec && typeof ScrollTrigger !== "undefined") {
    ScrollTrigger.create({
      trigger: footerSec,
      start: "top 80%",
      onEnter: () => setActiveNavLink("contact"),
      onLeaveBack: () => setActiveNavLink("solutions")
    });
  }

  // -------------------------------------------------------------
  // 9. PRIMARY NAVIGATION & TWO-TIER HAMBURGER MENU
  // -------------------------------------------------------------
  const navWrap = document.querySelector(".navigation");
  const navToggle = document.querySelector(".nav__toggle");
  const navContent = document.querySelector(".nav__content");
  const navClose = document.querySelector(".nav__close");
  const menuItems = document.querySelectorAll('[data-menu="item"]');

  if (navToggle && navContent) {
    function toggleMenu(open) {
      const isCurrentlyOpen = navWrap?.getAttribute("data-menu-open") === "true";
      const willOpen = open !== undefined ? open : !isCurrentlyOpen;
      if (navWrap) navWrap.setAttribute("data-menu-open", willOpen ? "true" : "false");

      if (willOpen) {
        navContent.classList.add("is-active");
        gsap.to(navContent, {
          autoAlpha: 1,
          x: "0%",
          duration: 0.45,
          ease: "power2.out"
        });
        gsap.fromTo(
          menuItems,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.08, duration: 0.45, ease: "power2.out", delay: 0.05 }
        );
      } else {
        navContent.classList.remove("is-active");
        gsap.to(navContent, {
          autoAlpha: 0,
          x: "-100%",
          duration: 0.35,
          ease: "power2.in"
        });
      }
    }

    navToggle.addEventListener("click", () => toggleMenu());
    if (navClose) navClose.addEventListener("click", () => toggleMenu(false));
  }

  // Nav scroll background blur & white text
  const navBar = document.querySelector(".nav__bar");
  const navNavigation = document.querySelector(".navigation");
  function updateNavScrollState() {
    const currentY = window.scrollY || window.pageYOffset || (typeof lenis !== "undefined" && lenis ? lenis.scroll : 0) || document.documentElement.scrollTop || 0;
    const isScrolled = currentY > 20;
    if (navBar) navBar.classList.toggle("is-scrolled", isScrolled);
    if (navNavigation) navNavigation.classList.toggle("is-scrolled", isScrolled);
  }

  window.addEventListener("scroll", updateNavScrollState, { passive: true });
  if (typeof lenis !== "undefined" && lenis) {
    lenis.on("scroll", updateNavScrollState);
  }
  ScrollTrigger.create({
    trigger: document.body,
    start: "top -20",
    onUpdate: () => updateNavScrollState()
  });
  updateNavScrollState();

  // -------------------------------------------------------------
  // 10. HERO 360° PRESSURE WASHER CAMERA ROTATION & SCROLL SCRUBBER
  // -------------------------------------------------------------
  const heroSection = document.querySelector("[data-hero]") || document.getElementById("overview");
  const heroCanvas = document.querySelector("[data-hero-canvas]");
  const heroVideo = document.querySelector(".hero__video video");
  const heroContent = document.querySelector("[data-hero-content]");
  const heroScroll = document.querySelector(".scrolldown-indicator");
  const totalHeroFrames = 240;
  const heroFrames = new Array(totalHeroFrames);
  let currentHeroFrameObj = null;

  function drawHeroCanvasFrame(img) {
    if (!heroCanvas || !img) return;
    if (!img.complete || !img.naturalWidth) return;
    const ctx = heroCanvas.getContext("2d");
    const cw = heroCanvas.width;
    const ch = heroCanvas.height;
    if (!cw || !ch) return;

    const nw = img.naturalWidth;
    const nh = img.naturalHeight;
    const scale = Math.max(cw / nw, ch / nh);
    const x = (cw - nw * scale) / 2;
    const y = (ch - nh * scale) / 2;

    ctx.drawImage(img, x, y, nw * scale, nh * scale);
  }

  function resizeHeroCanvas() {
    if (!heroCanvas) return;
    const dpr = window.devicePixelRatio || 1;
    const w = (heroSection && heroSection.clientWidth) || window.innerWidth;
    const h = window.innerHeight;

    if (heroCanvas.width !== w * dpr || heroCanvas.height !== h * dpr) {
      heroCanvas.width = w * dpr;
      heroCanvas.height = h * dpr;
      heroCanvas.style.width = w + "px";
      heroCanvas.style.height = h + "px";
    }
    if (currentHeroFrameObj) drawHeroCanvasFrame(currentHeroFrameObj);
  }

  function findNearestHeroFrame(targetIdx) {
    if (heroFrames[targetIdx]) return targetIdx;
    for (let r = 1; r < totalHeroFrames; r++) {
      if (targetIdx - r >= 0 && heroFrames[targetIdx - r]) return targetIdx - r;
      if (targetIdx + r < totalHeroFrames && heroFrames[targetIdx + r]) return targetIdx + r;
    }
    return 0;
  }

  function getHeroFrameUrl(i) {
    if (heroCanvas) {
      const srcPrefix = heroCanvas.getAttribute("data-src") || "Pressure_washer_camera_rotation_1080p_202609081213_00239/Pressure_washer_camera_rotation_1080p_202609081213_";
      const filetype = heroCanvas.getAttribute("data-filetype") || "png";
      const digits = parseInt(heroCanvas.getAttribute("data-digits") || "5", 10);
      const pad = String(i).padStart(digits, "0");
      return `${srcPrefix}${pad}.${filetype}`;
    }
    const pad = String(i).padStart(5, "0");
    return `Pressure_washer_camera_rotation_1080p_202609081213_00239/Pressure_washer_camera_rotation_1080p_202609081213_${pad}.png`;
  }

  // Preload frame 0 immediately
  const frame0 = new Image();
  frame0.src = getHeroFrameUrl(0);
  frame0.onload = () => {
    heroFrames[0] = frame0;
    currentHeroFrameObj = frame0;
    if (heroCanvas) {
      gsap.set(heroCanvas, { autoAlpha: 1, visibility: "visible" });
    }
    const heroVideoWrapper = document.querySelector(".hero__video");
    if (heroVideoWrapper) {
      gsap.set(heroVideoWrapper, { autoAlpha: 0, visibility: "hidden" });
    }
    resizeHeroCanvas();
    drawHeroCanvasFrame(frame0);
  };

  // Two-phase interleaved preloader:
  // Phase 1: Load every 4th frame (0, 4, 8... 236) AND the final frame 239 -> instant 360° rotation coverage in <250ms
  // Phase 2: Progressively fill in the remaining frames for buttery 60fps
  function preloadHeroFrames() {
    const phase1Indices = [];
    for (let i = 0; i < totalHeroFrames; i += 4) {
      phase1Indices.push(i);
    }
    if (!phase1Indices.includes(totalHeroFrames - 1)) {
      phase1Indices.push(totalHeroFrames - 1);
    }

    phase1Indices.forEach((i) => {
      if (heroFrames[i]) return;
      const img = new Image();
      img.src = getHeroFrameUrl(i);
      img.onload = () => {
        heroFrames[i] = img;
      };
    });

    setTimeout(() => {
      for (let i = 1; i < totalHeroFrames; i++) {
        if (i % 4 === 0 || i === totalHeroFrames - 1) continue;
        const img = new Image();
        img.src = getHeroFrameUrl(i);
        img.onload = () => {
          heroFrames[i] = img;
        };
      }
    }, 120);
  }
  preloadHeroFrames();

  window.addEventListener("resize", () => {
    resizeHeroCanvas();
  });

  // Hero section PINNED ScrollTrigger:
  // - Pinned while user scrubs the 360-degree camera rotation around the pressure washer
  // - Once rotation completes, cleanly unpins and glides down into Section 2
  const heroPinDistance = 2600;

  const heroST = ScrollTrigger.create({
    trigger: heroSection,
    start: "top top",
    end: "+=" + heroPinDistance,
    pin: true,
    anticipatePin: 1,
    scrub: true,
    onUpdate: (self) => {
      const progress = Math.max(0, Math.min(1, self.progress));
      const frameIdx = Math.min(totalHeroFrames - 1, Math.floor(progress * totalHeroFrames));

      if (heroCanvas) {
        gsap.set(heroCanvas, { autoAlpha: 1, visibility: "visible" });
      }
      const heroVideoWrapper = document.querySelector(".hero__video");
      if (heroVideoWrapper) {
        gsap.set(heroVideoWrapper, { autoAlpha: 0, visibility: "hidden" });
      }

      // Pause background video loop to avoid competing for hardware video decoder
      if (heroVideo && !heroVideo.paused) {
        heroVideo.pause();
      }

      // 1. Draw 1080p canvas frame
      const nearestIdx = heroFrames[frameIdx] ? frameIdx : findNearestHeroFrame(frameIdx);
      const img = heroFrames[nearestIdx] || heroFrames[0];
      if (img) {
        currentHeroFrameObj = img;
        drawHeroCanvasFrame(img);
      }

      // 2. Fade out overlay content during initial 22% of rotation
      if (heroContent) {
        const fadeProgress = Math.max(0, Math.min(1, progress / 0.22));
        gsap.set(heroContent, {
          opacity: 1 - fadeProgress,
          y: -30 * fadeProgress,
          pointerEvents: fadeProgress > 0.5 ? "none" : "auto"
        });
      }
    },
    onLeave: () => {
      // Rotation complete, ensure final frame is drawn
      const lastImg = heroFrames[totalHeroFrames - 1] || heroFrames[findNearestHeroFrame(totalHeroFrames - 1)];
      if (lastImg) {
        currentHeroFrameObj = lastImg;
        drawHeroCanvasFrame(lastImg);
      }
      if (heroContent) {
        gsap.set(heroContent, { opacity: 0, pointerEvents: "none" });
      }
    }
  });

  // Entrance typography reveal
  const heroTl = gsap.timeline({ delay: 0.2 });
  const heroEyebrow = document.querySelector(".home-hero__header .eyebrow-style");
  const heroHeading = document.querySelector(".home-hero__header .heading-xl");
  const heroPara = document.querySelector(".home-hero__header .paragraph-m");
  const heroBtns = document.querySelector(".home-hero__header .btn-group");

  if (heroHeading) {
    heroTl
      .fromTo(heroEyebrow, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 })
      .fromTo(heroHeading, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8 }, "-=0.4")
      .fromTo(heroPara, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.5")
      .fromTo(heroBtns, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.4")
      .fromTo(heroScroll, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.3");
  }

  // Scroll down indicator click -> scrolls through the hero 360 to Section 2
  if (heroScroll) {
    heroScroll.addEventListener("click", (e) => {
      e.preventDefault();
      const targetScroll = heroST.end + 10;
      if (window.lenis) {
        window.lenis.scrollTo(targetScroll, { duration: 1.2 });
      } else {
        window.scrollTo({ top: targetScroll, behavior: "smooth" });
      }
    });
  }

  // -------------------------------------------------------------
  // 10A. HERO -> SECTION 2 CINEMATIC PRODUCT HANDOFF TRANSITION
  // Smoothly pulls back and scales the final 360° product frame from
  // full-screen into Section 2 Row 1's square card on the right,
  // creating one continuous, seamless cinematic scene.
  // -------------------------------------------------------------
  // -------------------------------------------------------------
  // 10A. SECTION 2 SETUP
  // -------------------------------------------------------------
  const storySection = document.getElementById("story");

  // -------------------------------------------------------------
  // 10B. AQUAFORCE APPLICATIONS STORY FLOW (SECTION 2)
  // Scroll-driven horizontal product frame traveler:
  // Card 01 (AUTOCARE): Right
  // Card 02 (HOME CARE): Travels RIGHT -> LEFT
  // Card 03 (GIG WORKERS): Travels LEFT -> RIGHT
  // Card 04 (CORPORATE CARE): Travels RIGHT -> LEFT
  // Card 05 (FINAL CTA SUMMARY): Travels LEFT -> CENTER
  // Unpinned natural scrolling across black background
  // -------------------------------------------------------------
  if (storySection) {
    const storyRows = Array.from(storySection.querySelectorAll("[data-story-row]"));
    const journeySteps = Array.from(storySection.querySelectorAll("[data-journey-step]"));
    const productStage = storySection.querySelector("[data-story-product-stage]");
    const productTraveler = storySection.querySelector("[data-story-product-traveler]");

    // Smooth horizontal travel for desktop view
    if (productStage && productTraveler) {
      const productImg = productTraveler.querySelector(".aqua-story__product-img");
      if (productImg && typeof getHeroFrameUrl === "function") {
        productImg.src = getHeroFrameUrl(totalHeroFrames - 1);
      }

      const mm = gsap.matchMedia();
      mm.add("(min-width: 992px)", () => {
        // Pin stage within story section without locking page scrolling
        ScrollTrigger.create({
          trigger: storySection,
          start: "top top",
          end: "bottom bottom",
          pin: productStage,
          pinSpacing: false,
          invalidateOnRefresh: true
        });

        // 10A-1. CINEMATIC HERO -> SECTION 2 PULL-BACK MASK HANDOFF
        const uspTransition = document.querySelector("[data-usp-transition]");
        const uspCard = uspTransition ? uspTransition.querySelector("[data-usp-transition-card]") : null;
        const uspImg = uspTransition ? uspTransition.querySelector("[data-usp-transition-img]") : null;
        const heroCanvasEl = document.querySelector(".hero__canvas");
        const heroFadeEl = document.querySelector(".hero__fade");
        const card1TextCol = storyRows[0] ? storyRows[0].querySelector(".aqua-story__text-col") : null;

        if (uspImg && typeof getHeroFrameUrl === "function") {
          uspImg.src = getHeroFrameUrl(totalHeroFrames - 1);
        }

        // Initially hide product stage until handoff reaches Section 2
        gsap.set(productStage, { autoAlpha: 0 });
        if (card1TextCol) {
          gsap.set(card1TextCol, { opacity: 0, y: 45 });
        }
        if (uspTransition) {
          gsap.set(uspTransition, { autoAlpha: 0 });
        }

        function getEndRect() {
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

        if (uspTransition && uspCard) {
          ScrollTrigger.create({
            trigger: storySection,
            start: "top bottom",
            end: "top top",
            scrub: 0.4,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const p = self.progress;

              if (p <= 0.005) {
                gsap.set(uspTransition, { autoAlpha: 0 });
                if (heroCanvasEl) gsap.set(heroCanvasEl, { autoAlpha: 1 });
                if (heroFadeEl) gsap.set(heroFadeEl, { autoAlpha: 1 });
                gsap.set(productStage, { autoAlpha: 0 });
                return;
              }

              if (p >= 0.995) {
                gsap.set(uspTransition, { autoAlpha: 0 });
                if (heroCanvasEl) gsap.set(heroCanvasEl, { autoAlpha: 0 });
                if (heroFadeEl) gsap.set(heroFadeEl, { autoAlpha: 0 });
                gsap.set(productStage, { autoAlpha: 1 });
                if (card1TextCol) gsap.set(card1TextCol, { opacity: 1, y: 0 });
                return;
              }

              // Active handoff zone
              gsap.set(uspTransition, { autoAlpha: 1 });
              gsap.set(productStage, { autoAlpha: 0 });

              // Fade hero canvas behind transition overlay
              if (p < 0.1) {
                const cAlpha = 1 - (p / 0.1);
                if (heroCanvasEl) gsap.set(heroCanvasEl, { autoAlpha: cAlpha });
                if (heroFadeEl) gsap.set(heroFadeEl, { autoAlpha: cAlpha });
              } else {
                if (heroCanvasEl) gsap.set(heroCanvasEl, { autoAlpha: 0 });
                if (heroFadeEl) gsap.set(heroFadeEl, { autoAlpha: 0 });
              }

              const start = getStartRect();
              const end = getEndRect();
              const ep = gsap.parseEase("power1.inOut")(p);

              const curX = gsap.utils.interpolate(start.x, end.x, ep);
              const curY = gsap.utils.interpolate(start.y, end.y, ep);
              const curW = gsap.utils.interpolate(start.width, end.width, ep);
              const curH = gsap.utils.interpolate(start.height, end.height, ep);
              const curR = gsap.utils.interpolate(start.radius, end.radius, ep);

              gsap.set(uspCard, {
                x: curX,
                y: curY,
                width: curW,
                height: curH,
                borderRadius: curR,
                clipPath: `inset(0% 0% 0% 0% round ${curR}px)`,
                boxShadow: `0 ${35 * ep}px ${100 * ep}px rgba(0, 0, 0, ${0.95 * ep}), 0 0 ${40 * ep}px rgba(255, 229, 0, ${0.14 * ep})`,
                border: `1px solid rgba(255, 255, 255, ${0.16 * ep})`,
                force3D: true
              });

              if (card1TextCol) {
                gsap.set(card1TextCol, {
                  opacity: gsap.utils.clamp(0, 1, (p - 0.3) / 0.7),
                  y: (1 - ep) * 45
                });
              }
            },
            onLeaveBack: () => {
              gsap.set(uspTransition, { autoAlpha: 0 });
              if (heroCanvasEl) gsap.set(heroCanvasEl, { autoAlpha: 1 });
              if (heroFadeEl) gsap.set(heroFadeEl, { autoAlpha: 1 });
              gsap.set(productStage, { autoAlpha: 0 });
            },
            onLeave: () => {
              gsap.set(uspTransition, { autoAlpha: 0 });
              if (heroCanvasEl) gsap.set(heroCanvasEl, { autoAlpha: 0 });
              if (heroFadeEl) gsap.set(heroFadeEl, { autoAlpha: 0 });
              gsap.set(productStage, { autoAlpha: 1 });
              if (card1TextCol) gsap.set(card1TextCol, { opacity: 1, y: 0 });
            }
          });
        }

        // 10A-2. SECTION 2 HORIZONTAL TRAVELER TIMELINE
        const storyTL = gsap.timeline({
          scrollTrigger: {
            trigger: storySection,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.8,
            invalidateOnRefresh: true
          }
        });

        storyTL
          // Card 01 (Right) -> Card 02 (Left)
          .fromTo(productTraveler,
            { x: 320, scale: 1 },
            {
              x: -320,
              rotateY: 8,
              duration: 1,
              ease: "power1.inOut"
            }
          )
          .to(productTraveler, {
            rotateY: 0,
            duration: 0.2
          })
          // Card 02 (Left) -> Card 03 (Right)
          .to(productTraveler, {
            x: 320,
            rotateY: -8,
            duration: 1,
            ease: "power1.inOut"
          })
          .to(productTraveler, {
            rotateY: 0,
            duration: 0.2
          })
          // Card 03 (Right) -> Card 04 (Left)
          .to(productTraveler, {
            x: -320,
            rotateY: 8,
            duration: 1,
            ease: "power1.inOut"
          })
          .to(productTraveler, {
            rotateY: 0,
            duration: 0.2
          });
      });
    }

    // Synchronize Category Image & Tag with active Row on scroll
    const storyProductImgs = storySection.querySelectorAll(".aqua-story__product-img");
    const storyTagText = storySection.querySelector("[data-story-tag-text]");
    const categoryTagLabels = ["AUTOCARE", "HOME CARE", "GIG WORKERS", "CORPORATE CARE"];

    function setActiveStoryCategory(index) {
      if (storyProductImgs.length > 0) {
        storyProductImgs.forEach((img, i) => {
          if (i === index) {
            img.classList.add("is-active");
          } else {
            img.classList.remove("is-active");
          }
        });
      }
      if (storyTagText && categoryTagLabels[index]) {
        storyTagText.textContent = categoryTagLabels[index];
      }
    }

    // Subtle scroll reveal for each row content as the user navigates down
    storyRows.forEach((row, idx) => {
      ScrollTrigger.create({
        trigger: row,
        start: "top 65%",
        end: "bottom 35%",
        onEnter: () => setActiveStoryCategory(idx),
        onEnterBack: () => setActiveStoryCategory(idx)
      });

      if (idx === 0) return; // Row 1 is smoothly revealed during the Hero -> Section 2 handoff
      const textCol = row.querySelector(".aqua-story__text-col");
      const cardCol = row.querySelector(".aqua-story__card-col");

      if (textCol) {
        gsap.fromTo(textCol,
          { opacity: 0.3, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: row,
              start: "top 70%",
              end: "top 30%",
              scrub: 0.4
            }
          }
        );
      }
      if (cardCol) {
        gsap.fromTo(cardCol,
          { opacity: 0.35, scale: 0.95, y: 25 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: row,
              start: "top 70%",
              end: "top 30%",
              scrub: 0.4
            }
          }
        );
      }
    });

    // Gig Workers continuous customer mobility flow (Customer 1 -> 2 -> 3)
    const gigRow = storySection.querySelector('[data-story-row="3"]');
    if (gigRow && journeySteps.length > 0) {
      ScrollTrigger.create({
        trigger: gigRow,
        start: "top 60%",
        end: "bottom 40%",
        onUpdate: (self) => {
          const p = self.progress;
          const activeStep = p < 0.33 ? 1 : (p < 0.66 ? 2 : 3);
          journeySteps.forEach(step => {
            const stepNum = parseInt(step.getAttribute("data-journey-step"));
            if (stepNum <= activeStep) step.classList.add("is-active");
            else step.classList.remove("is-active");
          });
        }
      });
    }
  }


    // 11. PINNED USP FEATURE SHOWCASE & SYNCHRONIZED SCROLL SCRUBBER
  // -------------------------------------------------------------
  const uspSection = document.querySelector("[data-usp]");
  if (uspSection) {
    const uspList = uspSection.querySelector(".usp__list");
    const uspMask = uspSection.querySelector(".usp__list-mask") || uspList?.parentElement;
    const uspItems = Array.from(uspSection.querySelectorAll("[data-usp-item]"));
    const uspMedias = Array.from(uspSection.querySelectorAll("[data-usp-media]"));
    const reticles = Array.from(document.querySelectorAll(".hardware-reticle"));
    let currentUspIndex = -1;

    // Zoom presets per feature (Apple camera pans)
    const zoomPresets = {
      swap: { scale: 1.05, xPercent: -3, yPercent: -2, activeReticle: "battery" },
      power: { scale: 1.10, xPercent: 3, yPercent: -4, activeReticle: "motor" },
      storage: { scale: 1.06, xPercent: 0, yPercent: 2, activeReticle: null },
      silence: { scale: 1.05, xPercent: 2, yPercent: -2, activeReticle: null },
      maintenance: { scale: 1.08, xPercent: -2, yPercent: -3, activeReticle: "suspension" },
      personalities: { scale: 1.10, xPercent: -4, yPercent: 3, activeReticle: "cockpit" },
      design: { scale: 1.0, xPercent: 0, yPercent: 0, activeReticle: null }
    };

    function updateUspPosition(targetIndex, smooth = true) {
      if (!uspList || !uspItems[targetIndex]) return;
      const activeItem = uspItems[targetIndex];
      const maskHeight = uspMask ? uspMask.clientHeight : 380;
      const itemTop = activeItem.offsetTop;
      const itemHeight = activeItem.offsetHeight;

      // Smoothly center the active item in the viewing mask
      const targetY = (maskHeight / 2) - (itemTop + itemHeight / 2);

      if (smooth) {
        gsap.to(uspList, {
          y: targetY,
          duration: 0.5,
          ease: "power2.out",
          overwrite: "auto"
        });
      } else {
        gsap.set(uspList, { y: targetY });
      }
    }

    function setUspActiveIndex(index) {
      if (index < 0 || index >= uspItems.length) return;
      if (index === currentUspIndex) return;
      currentUspIndex = index;

      const activeItem = uspItems[index];
      const itemId = activeItem.getAttribute("data-usp-item");

      // 1. Text Items: Highlight active item, dim others
      uspItems.forEach((it, i) => {
        const isActive = i === index;
        it.classList.toggle("is-active", isActive);
      });

      // 2. Smoothly scroll/translate the left list to center the highlighted item
      updateUspPosition(index, true);

      // 3. Media Frame: Fixed in place, cross-fade to active media and image
      uspMedias.forEach((m) => {
        const isActive = m.getAttribute("data-usp-media") === itemId;
        m.classList.toggle("is-active", isActive);
        const vid = m.querySelector("video");
        if (vid) {
          if (isActive) vid.play().catch(() => {});
          else vid.pause();
        }

        // Apple-style camera zoom into active media
        if (isActive && zoomPresets[itemId]) {
          const target = m.querySelector("img, video");
          if (target) {
            gsap.fromTo(target, 
              { scale: 1.08 },
              {
                scale: zoomPresets[itemId].scale,
                xPercent: zoomPresets[itemId].xPercent,
                yPercent: zoomPresets[itemId].yPercent,
                duration: 0.8,
                ease: "uncommon",
              }
            );
          }
        }
      });

      // Highlight active reticle if present
      const activeReticleKey = zoomPresets[itemId]?.activeReticle;
      reticles.forEach((r) => {
        r.classList.toggle("is-active", r.getAttribute("data-reticle") === activeReticleKey);
      });
    }

    // Initialize with first item active and centered
    setUspActiveIndex(0);
    setTimeout(() => updateUspPosition(0, false), 150);

    // PINNED ScrollTrigger:
    // Section stays pinned until the user scrolls through all 7 features to the last one ("Confident by design")
    const pinDistance = (uspItems.length) * 650;

    const uspST = ScrollTrigger.create({
      trigger: uspSection,
      start: "top top",
      end: "+=" + pinDistance,
      pin: true,
      anticipatePin: 1,
      scrub: 0.4,
      onUpdate: (self) => {
        const progress = Math.max(0, Math.min(1, self.progress));
        const step = Math.min(uspItems.length - 1, Math.floor(progress * uspItems.length));
        setUspActiveIndex(step);
      },
      onLeave: () => {
        // When unpinning after the 7th item, ensure the 7th item ("Confident by design") stays locked active
        setUspActiveIndex(uspItems.length - 1);
      },
      onEnterBack: () => {
        setUspActiveIndex(uspItems.length - 1);
      }
    });

    // Clicking any item scrolls directly to that item in the pinned section
    uspItems.forEach((item, idx) => {
      item.addEventListener("click", () => {
        const targetProgress = idx / (uspItems.length - 1);
        const targetScroll = uspST.start + targetProgress * pinDistance;
        if (window.lenis) {
          window.lenis.scrollTo(targetScroll, { duration: 1.0 });
        } else {
          window.scrollTo({ top: targetScroll, behavior: "smooth" });
        }
      });
    });

    // Reticle click support
    reticles.forEach((reticle) => {
      reticle.addEventListener("click", () => {
        const key = reticle.getAttribute("data-reticle");
        let targetIdx = -1;
        if (key === "battery") targetIdx = 0;
        else if (key === "motor") targetIdx = 1;
        else if (key === "cockpit") targetIdx = 5;
        else if (key === "suspension") targetIdx = 4;
        
        if (targetIdx >= 0) {
          const targetProgress = targetIdx / (uspItems.length - 1);
          const targetScroll = uspST.start + targetProgress * pinDistance;
          if (window.lenis) {
            window.lenis.scrollTo(targetScroll, { duration: 1.0 });
          } else {
            window.scrollTo({ top: targetScroll, behavior: "smooth" });
          }
        }
      });
    });

    window.addEventListener("resize", () => {
      if (currentUspIndex >= 0) updateUspPosition(currentUspIndex, false);
    });
  }

  // -------------------------------------------------------------
  // 12. STORY TEASER ("SOME PEOPLE WAIT...") & COORDINATES
  // -------------------------------------------------------------
  const aboutSec = document.querySelector(".about");
  if (aboutSec) {
    const aboutTitle = aboutSec.querySelector(".heading-l");
    const drawPath = aboutSec.querySelector("[data-draw-scroll-path]");

    if (aboutTitle) {
      gsap.from(aboutTitle, {
        scrollTrigger: {
          trigger: aboutSec,
          start: "top 70%",
        },
        y: 40,
        opacity: 0,
        duration: 0.9,
      });
    }

    if (drawPath) {
      const pathLength = drawPath.getTotalLength ? drawPath.getTotalLength() : 1000;
      drawPath.style.strokeDasharray = pathLength;
      drawPath.style.strokeDashoffset = pathLength;

      gsap.to(drawPath, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: aboutSec,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        }
      });
    }
  }

  // -------------------------------------------------------------
  // 13. SPLIT SECTIONS (BUILT FOR ENDURO / READY FOR RACING)
  // -------------------------------------------------------------
  const enduroImages = document.querySelectorAll(".enduro-content_img");
  enduroImages.forEach((imgWrap) => {
    const img = imgWrap.querySelector("img");
    if (!img) return;

    gsap.fromTo(
      img,
      { scale: 1.1, y: 20 },
      {
        scale: 1,
        y: -20,
        ease: "none",
        scrollTrigger: {
          trigger: imgWrap,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        }
      }
    );
  });

  // -------------------------------------------------------------
  // 14. DRAGGABLE MARQUEE FILMSTRIP
  // -------------------------------------------------------------
  const marqueeWrap = document.querySelector("[data-draggable-marquee-init]");
  if (marqueeWrap && typeof Draggable !== "undefined") {
    const marqueeList = marqueeWrap.querySelector("[data-draggable-marquee-list]");
    if (marqueeList) {
      Draggable.create(marqueeList, {
        type: "x",
        inertia: true,
        bounds: marqueeWrap,
        edgeResistance: 0.65,
        cursor: "grab",
        activeCursor: "grabbing",
      });

      // Track vertical scroll position with slight offset
      gsap.to(marqueeList, {
        xPercent: -20,
        ease: "none",
        scrollTrigger: {
          trigger: marqueeWrap,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        }
      });
    }
  }

  // -------------------------------------------------------------
  // 15. 50-TICK SCROLL INDICATOR & 360 PRODUCT SPIN
  // -------------------------------------------------------------
  const linesContainer = document.getElementById("scrollLines");
  const scrollSec = document.querySelector("[data-scroll-indicator-section]");
  const indicatorLabelStart = document.querySelector(".parallax-scroll-indicator_label:first-child");

  if (linesContainer && scrollSec) {
    const count = 50;
    linesContainer.innerHTML = "";
    for (let i = 0; i < count; i++) {
      const span = document.createElement("span");
      span.className = "scroll-indicator__line";
      linesContainer.appendChild(span);
    }
    const lines = Array.from(linesContainer.querySelectorAll(".scroll-indicator__line"));

    ScrollTrigger.create({
      trigger: scrollSec,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        const activeIdx = Math.floor(self.progress * (count - 1));
        lines.forEach((l, i) => {
          l.classList.toggle("is-active", i <= activeIdx);
        });
        if (indicatorLabelStart) {
          const numStr = String(activeIdx + 1).padStart(2, "0");
          indicatorLabelStart.textContent = numStr + "/50";
        }
      }
    });
  }

  // -------------------------------------------------------------
  // 16. MULTI-LAYER PARALLAX HERO ("BE THE FIRST ON THE LINE")
  // -------------------------------------------------------------
  const parallaxLayers = document.querySelectorAll(".parallax__layer-group");
  if (parallaxLayers.length && scrollSec) {
    const speeds = [0.15, 0.4, 0.75, 1.15, 1.25];
    parallaxLayers.forEach((layer, idx) => {
      const speed = speeds[idx] || 0.5;
      gsap.fromTo(
        layer,
        { y: 0 },
        {
          y: -120 * speed,
          ease: "none",
          scrollTrigger: {
            trigger: scrollSec,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          }
        }
      );
    });
  }

  // -------------------------------------------------------------
  // 17. RELEASE VIDEO LIGHTBOX MODAL
  // -------------------------------------------------------------
  const lightbox = document.querySelector(".bunny-lightbox");
  const lightboxVideo = lightbox ? lightbox.querySelector("video") : null;
  const lightboxCloseBtns = document.querySelectorAll('[data-bunny-lightbox-control="close"], .bunny-lightbox__close');
  const videoCards = document.querySelectorAll('[data-bunny-lightbox-control="open"], .mini-showreel__card');
  const playPauseBtn = lightbox ? lightbox.querySelector('[data-player-control="playpause"]') : null;
  const muteBtn = lightbox ? lightbox.querySelector('[data-player-control="mute"]') : null;
  const fullscreenBtn = lightbox ? lightbox.querySelector('[data-player-control="fullscreen"]') : null;
  const timeProgress = lightbox ? lightbox.querySelector("[data-player-time-progress]") : null;
  const timeDuration = lightbox ? lightbox.querySelector("[data-player-time-duration]") : null;
  const timelineProgress = lightbox ? lightbox.querySelector("[data-player-progress]") : null;
  const timelineBar = lightbox ? lightbox.querySelector(".bunny-lightbox-player__timeline") : null;

  const RELEASE_VIDEO_SRC = "https://uncommon.b-cdn.net/Radian%20-%20hero%20cinematisch.mp4";

  function openLightbox() {
    if (!lightbox || !lightboxVideo) return;
    if (!lightboxVideo.src) lightboxVideo.src = RELEASE_VIDEO_SRC;
    lightbox.classList.add("is-open");
    lightboxVideo.currentTime = 0;
    lightboxVideo.play().catch(() => {});
  }

  function closeLightbox() {
    if (!lightbox || !lightboxVideo) return;
    lightbox.classList.remove("is-open");
    lightboxVideo.pause();
  }

  videoCards.forEach((card) => {
    card.addEventListener("click", (e) => {
      e.preventDefault();
      openLightbox();
    });
  });

  lightboxCloseBtns.forEach((btn) => {
    btn.addEventListener("click", closeLightbox);
  });

  if (playPauseBtn && lightboxVideo) {
    playPauseBtn.addEventListener("click", () => {
      if (lightboxVideo.paused) lightboxVideo.play();
      else lightboxVideo.pause();
    });
  }

  if (muteBtn && lightboxVideo) {
    muteBtn.addEventListener("click", () => {
      lightboxVideo.muted = !lightboxVideo.muted;
      muteBtn.style.opacity = lightboxVideo.muted ? "0.6" : "1";
    });
  }

  if (fullscreenBtn && lightboxVideo) {
    fullscreenBtn.addEventListener("click", () => {
      if (!document.fullscreenElement) {
        lightbox.requestFullscreen?.() || lightboxVideo.requestFullscreen?.();
      } else {
        document.exitFullscreen?.();
      }
    });
  }

  if (lightboxVideo) {
    lightboxVideo.addEventListener("timeupdate", () => {
      const curr = lightboxVideo.currentTime;
      const dur = lightboxVideo.duration || 176;
      if (timeProgress) {
        const m = Math.floor(curr / 60);
        const s = Math.floor(curr % 60);
        timeProgress.textContent = String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
      }
      if (timeDuration && lightboxVideo.duration) {
        const dm = Math.floor(dur / 60);
        const ds = Math.floor(dur % 60);
        timeDuration.textContent = String(dm).padStart(2, "0") + ":" + String(ds).padStart(2, "0");
      }
      if (timelineProgress) {
        const pct = (curr / dur) * 100;
        timelineProgress.style.width = pct + "%";
      }
    });

    if (timelineBar) {
      timelineBar.addEventListener("click", (e) => {
        const rect = timelineBar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const pct = clickX / rect.width;
        if (lightboxVideo.duration) {
          lightboxVideo.currentTime = pct * lightboxVideo.duration;
        }
      });
    }
  }

  // -------------------------------------------------------------
  // 18. PRE-ORDER CONFIGURATOR DRAWER MODAL
  // -------------------------------------------------------------
  const configDrawer = document.getElementById("configuratorDrawer");
  const configCloseBtns = document.querySelectorAll("[data-config-close]");
  const configTriggers = document.querySelectorAll(
    'a[href="/pre-order"], .theme-yellow, [data-modal-target], [aria-label="Configure now"], [aria-label="Pre-order now"], [aria-label="Pre-order"]'
  );

  function openConfigurator() {
    if (!configDrawer) return;
    configDrawer.classList.add("is-open");
    configDrawer.setAttribute("aria-hidden", "false");
  }

  function closeConfigurator() {
    if (!configDrawer) return;
    configDrawer.classList.remove("is-open");
    configDrawer.setAttribute("aria-hidden", "true");
  }

  configTriggers.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const href = btn.getAttribute("href");
      if (href === "/pre-order" || btn.innerText.includes("Configure") || btn.innerText.includes("Pre-order")) {
        e.preventDefault();
        openConfigurator();
      }
    });
  });

  configCloseBtns.forEach((btn) => {
    btn.addEventListener("click", closeConfigurator);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeConfigurator();
      closeLightbox();
    }
  });

  // Livery & Battery option selection
  const liveryCards = document.querySelectorAll("[data-livery]");
  const bikeImg = document.getElementById("configBikeImg");

  liveryCards.forEach((card) => {
    card.addEventListener("click", () => {
      liveryCards.forEach((c) => c.classList.remove("is-selected"));
      card.classList.add("is-selected");
      const livery = card.getAttribute("data-livery");
      if (bikeImg) {
        if (livery === "stealth") {
          bikeImg.style.filter = "grayscale(100%) contrast(110%) brightness(85%)";
        } else {
          bikeImg.style.filter = "none";
        }
      }
    });
  });

  const batteryCards = document.querySelectorAll("[data-battery]");
  batteryCards.forEach((card) => {
    card.addEventListener("click", () => {
      batteryCards.forEach((c) => c.classList.remove("is-selected"));
      card.classList.add("is-selected");
    });
  });

  const addonCards = document.querySelectorAll("[data-addon]");
  addonCards.forEach((card) => {
    card.addEventListener("click", () => {
      card.classList.toggle("is-selected");
    });
  });

  // Configurator form submission
  const configSubmitBtn = document.getElementById("configSubmitBtn");
  const configFormBody = document.getElementById("configFormBody");
  const configFooter = document.getElementById("configFooter");
  const configConfirmation = document.getElementById("configConfirmation");
  const confirmUserName = document.getElementById("confirmUserName");
  const confirmOrderId = document.getElementById("confirmOrderId");

  if (configSubmitBtn) {
    configSubmitBtn.addEventListener("click", () => {
      const nameInput = document.getElementById("configName");
      const emailInput = document.getElementById("configEmail");

      if (!nameInput.value || !emailInput.value) {
        showToast("Please enter your name and email address.");
        nameInput.focus();
        return;
      }

      configSubmitBtn.textContent = "Processing...";
      configSubmitBtn.disabled = true;

      setTimeout(() => {
        configSubmitBtn.disabled = false;
        configSubmitBtn.textContent = "Reserve EXR";

        if (confirmUserName) confirmUserName.textContent = nameInput.value;
        if (confirmOrderId) {
          const rand = Math.floor(1000 + Math.random() * 9000);
          confirmOrderId.textContent = "RDN-2026-EXR-" + rand;
        }

        if (configFormBody) configFormBody.style.display = "none";
        if (configFooter) configFooter.style.display = "none";
        if (configConfirmation) configConfirmation.classList.add("is-active");

        showToast("Radian EXR reserved successfully!");
      }, 1000);
    });
  }

  // -------------------------------------------------------------
  // 19. NEWSLETTER FORM SUBMISSION
  // -------------------------------------------------------------
  const newsletterForm = document.getElementById("wf-form-Newsletter-footer");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = newsletterForm.querySelector('input[type="email"]');
      if (email && email.value) {
        showToast("You're in! We'll keep you updated on what's next.");
        email.value = "";
        const doneBox = document.querySelector(".form-notifcation.w-form-done");
        if (doneBox) doneBox.style.display = "flex";
      }
    });
  }

  // -------------------------------------------------------------
  // 19B. UNIVERSAL WORD-BY-WORD & SECTION REVEAL ANIMATIONS
  // -------------------------------------------------------------
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    // 1. Word-by-word reveal for all headings with data-word-reveal
    const wordRevealHeadings = document.querySelectorAll("[data-word-reveal]");
    wordRevealHeadings.forEach((heading) => {
      if (heading.getAttribute("data-word-split")) return;
      heading.setAttribute("data-word-split", "true");

      const rawText = heading.textContent.trim();
      const words = rawText.split(/\s+/);
      heading.innerHTML = words.map(w => `<span class="reveal-word">${w}</span>`).join(" ");

      const revealSpans = heading.querySelectorAll(".reveal-word");

      gsap.fromTo(
        revealSpans,
        { opacity: 0.18, y: 8 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.03,
          ease: "power2.out",
          scrollTrigger: {
            trigger: heading,
            start: "top 85%",
            end: "bottom 55%",
            scrub: 0.5,
          }
        }
      );
    });

    // 2. Smooth Section Fade & Slide Entrance Reveals
    const revealTargets = document.querySelectorAll(
      ".aqua-story__text-col, .aqua-engineering__left, .aqua-engineering__right, .aqua-testimonials__left, .aqua-cta-banner__header"
    );

    revealTargets.forEach((target) => {
      gsap.fromTo(
        target,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: target,
            start: "top 82%",
            once: true,
          }
        }
      );
    });
  }

  // -------------------------------------------------------------
  // 20. SECTION 3: SOLUTIONS SHOWCASE INTERACTIVE CAROUSEL
  // -------------------------------------------------------------
  const showcaseCard = document.querySelector("[data-showcase-card]");
  if (showcaseCard) {
    const slides = showcaseCard.querySelectorAll(".aqua-showcase__slide");
    const dots = showcaseCard.querySelectorAll(".aqua-showcase__dot");
    const counterCurrent = showcaseCard.querySelector("[data-counter-current]");
    let activeIdx = 0;
    let autoPlayTimer = null;
    const total = slides.length;

    function goToSlide(targetIdx, animate = true) {
      if (targetIdx === activeIdx && slides[activeIdx].classList.contains("is-active")) return;
      activeIdx = (targetIdx + total) % total;

      slides.forEach((slide, i) => {
        const isActive = i === activeIdx;
        slide.classList.toggle("is-active", isActive);

        if (isActive && animate && typeof gsap !== "undefined") {
          const title = slide.querySelector(".aqua-showcase__slide-title");
          const desc = slide.querySelector(".aqua-showcase__slide-desc");
          if (title) {
            gsap.fromTo(title, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" });
          }
          if (desc) {
            gsap.fromTo(desc, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, delay: 0.08, ease: "power2.out" });
          }
        }
      });

      dots.forEach((dot, i) => {
        dot.classList.toggle("is-active", i === activeIdx);
      });

      if (counterCurrent) {
        counterCurrent.textContent = String(activeIdx + 1).padStart(2, "0");
      }
    }

    dots.forEach((dot) => {
      dot.addEventListener("click", () => {
        const target = parseInt(dot.getAttribute("data-dot"), 10);
        if (!isNaN(target)) {
          goToSlide(target);
          resetAutoPlay();
        }
      });
    });

    // Touch Swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    showcaseCard.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    showcaseCard.addEventListener("touchend", (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchEndX - touchStartX;
      if (Math.abs(diff) > 45) {
        if (diff < 0) {
          goToSlide(activeIdx + 1);
        } else {
          goToSlide(activeIdx - 1);
        }
        resetAutoPlay();
      }
    }, { passive: true });

    function startAutoPlay() {
      stopAutoPlay();
      autoPlayTimer = setInterval(() => {
        goToSlide(activeIdx + 1);
      }, 3200);
    }

    function stopAutoPlay() {
      if (autoPlayTimer) {
        clearInterval(autoPlayTimer);
        autoPlayTimer = null;
      }
    }

    function resetAutoPlay() {
      stopAutoPlay();
      startAutoPlay();
    }

    showcaseCard.addEventListener("mouseenter", stopAutoPlay);
    showcaseCard.addEventListener("mouseleave", startAutoPlay);

    // Scroll-driven card reveal as section text reaches center viewport
    if (typeof ScrollTrigger !== "undefined") {
      ScrollTrigger.create({
        trigger: ".aqua-showcase",
        start: "top 60%",
        end: "bottom 30%",
        onUpdate: (self) => {
          if (!showcaseCard.matches(":hover")) {
            const targetIdx = Math.min(total - 1, Math.floor(self.progress * total));
            if (targetIdx !== activeIdx) {
              goToSlide(targetIdx);
              resetAutoPlay();
            }
          }
        }
      });
    }

    startAutoPlay();
  }

  // -------------------------------------------------------------
  // 21. CINEMATIC CTA → FOOTER OVERLAP & REVEAL TRANSITION
  // -------------------------------------------------------------
  const ctaBanner = document.querySelector(".aqua-cta-banner");
  const footerOverlapSec = document.querySelector(".aqua-footer");

  if (ctaBanner && footerOverlapSec) {
    const isMobile = window.innerWidth <= 768;
    const liftDistance = isMobile ? -140 : -220;

    gsap.fromTo(
      ctaBanner,
      { y: 0 },
      {
        y: liftDistance,
        ease: "none",
        scrollTrigger: {
          trigger: footerOverlapSec,
          start: "top bottom",
          end: "top 40%",
          scrub: 0.6,
          invalidateOnRefresh: true,
        }
      }
    );
  }

  // Refresh ScrollTrigger after all pins and layouts are configured
  ScrollTrigger.refresh();

  console.log("Radian EXR upgraded motion controller (Zajno + Apple + Codrops) initialized.");
});
