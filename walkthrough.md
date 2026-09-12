# Hero Section Release Video Widget Implementation Walkthrough

## Summary of Changes
- **Persistent Bottom-Right Hero Video Widget**:
  - Configured `.home-hero__video` and `.mini-showreel` to remain 100% visible (`display: flex !important; opacity: 1 !important; visibility: visible !important; z-index: 10 !important; pointer-events: auto !important;`) throughout all Hero scroll states, including the entire 360° pressure washer camera rotation.
  - Decoupled the hero header text fade-out animation from the video widget in `main.js` so only the typography fades out during camera scrub.
  - Resolved `data-fouc` container visibility issues on `.hero__overlay` and `.hero-overlay__grid` so the release video widget is visible on initial load and stays pinned until Section 2 (`#story`) enters the viewport.

- **Video Asset Alignment**:
  - Enforced `assets/ASMR PROMEC LAPTOP.mp4` for both the bottom-right preview card thumbnail and the lightbox modal video player.
  - Removed static external CDN placeholder image overlays inside `.mini-showreel` so the video plays directly and smoothly.

- **Preservation of Existing Features**:
  - Maintained all Section 2 category enhancements (borderless organic smoke radial gradients, single scroll per category, machine cutouts, pure background videos without fallback static images underneath).

## Visual Verification

### Hero Section (Initial Load)
The bottom-right release video widget displays `assets/ASMR PROMEC LAPTOP.mp4` alongside the hero text.
![Hero Section Load](file:///c:/Users/balar/Desktop/Promec%20Landing%20PAge/scratch/hero_video_frame_y0.png)

### Hero Section (360° Camera Rotation)
During camera scrub, hero header text fades out while the bottom-right video card remains 100% pinned, active, and interactive.
![Hero Section Rotation](file:///c:/Users/balar/Desktop/Promec%20Landing%20PAge/scratch/hero_video_frame_y1400.png)

### Section 2 Transition
As the user scrolls down into Section 2 (`#story`), Section 2 slides up seamlessly over Section 1.
![Section 2 Transition](file:///c:/Users/balar/Desktop/Promec%20Landing%20PAge/scratch/sec2_scroll_y3400.png)
