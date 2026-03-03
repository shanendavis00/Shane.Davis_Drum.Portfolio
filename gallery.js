// Images shown in the masonry grid + lightbox (keep ALL photos here)
const galleryImages = [
  'gallery_photos/Davis.SHane.ICK.JPEG',
  'gallery_photos/gal1.JPEG',
  'gallery_photos/gal2.JPG',
  'gallery_photos/gal3.JPG',
  'gallery_photos/gal4.jpeg',
  'gallery_photos/gal5.JPEG',
  'gallery_photos/gal6.JPG',
  'gallery_photos/gal7.jpeg',
  'gallery_photos/gal8.JPG',
  'gallery_photos/gal9.jpeg',
  'gallery_photos/gal10.JPG',
  'gallery_photos/gal11.JPG',
  'gallery_photos/gal12.JPG',
  'gallery_photos/gal13.JPG',
  'gallery_photos/gal14.jpeg',
  'gallery_photos/gal15.JPEG'
];

// Images shown ONLY in the spinning ring (put ONLY landscape photos you want here)
const ringImages = [
  'gallery_photos/Davis.SHane.ICK.JPEG',
  'gallery_photos/gal7.jpeg',
  'gallery_photos/gal10.JPG',
    'gallery_photos/gal1.JPEG',
  'gallery_photos/gal12.JPG',
  'gallery_photos/gal9.jpeg',
  'gallery_photos/gal6.JPG'
];

const galleryVideos = [
  // YouTube embed URLs (iframe src)
  'https://www.youtube.com/embed/dQw4w9WgXcQ',
  'https://www.youtube.com/embed/6_b7RDuLwcI'
];

/* ===== True spinning ring (connected panels) ===== */
(function initSpinningRing(){
  const ring = document.getElementById('ring');
  const track = document.getElementById('ringTrack');

  // IMPORTANT: ring uses ringImages now
  if (!ring || !track || !Array.isArray(ringImages) || ringImages.length === 0) return;

  // Ensure enough panels to feel like a continuous cylinder
  // (If you only have 4–5 images, repeating makes the ring smoother.)
  const base = ringImages.slice();
  const minPanels = 10;

  let srcs = base.slice();
  while (srcs.length < minPanels) srcs = srcs.concat(base);

  track.innerHTML = '';

  srcs.forEach((src) => {
    const panel = document.createElement('div');
    panel.className = 'ring-panel';

    const img = document.createElement('img');
    img.src = src;
    img.alt = '';
    img.loading = 'eager';

    panel.appendChild(img);
    track.appendChild(panel);
  });

  const panels = Array.from(track.querySelectorAll('.ring-panel'));

  function layout(){
    const count = panels.length;
    if (!count) return;

    // Use the real rendered panel width (matches your CSS exactly)
    // Use an untransformed width (mobile fix)
const panelW = panels[0].offsetWidth || parseFloat(getComputedStyle(panels[0]).width);

// Base cylinder radius
let radius = (panelW / 2) / Math.tan(Math.PI / count);

// Detect mobile
const isMobile = window.matchMedia('(max-width: 600px)').matches;

// Desktop keeps breathing room, mobile tightens slightly
radius *= isMobile ? 1.02 : 1.142;

// Place each panel evenly around the cylinder
panels.forEach((p, i) => {
  const angle = (360 / count) * i;
  p.style.transform =
    `translate(-50%, -50%) rotateY(${angle}deg) translateZ(${radius}px)`;
});
    // Speed: tweak this number (smaller = faster)
    track.style.setProperty('--spin', '45s');
  }

  layout();
  window.addEventListener('resize', () => requestAnimationFrame(layout), { passive: true });
window.addEventListener('orientationchange', () => setTimeout(layout, 50), { passive: true });

// Mobile browsers change viewport size when you scroll (URL bar show/hide)
if (window.visualViewport) {
  window.visualViewport.addEventListener('resize', () => requestAnimationFrame(layout), { passive: true });
}

// After images load, widths are stable
window.addEventListener('load', () => setTimeout(layout, 0), { passive: true });
})();