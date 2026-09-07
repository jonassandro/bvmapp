const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function generate() {
  const publicDir = path.resolve(__dirname, '../public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // 1. Standalone & Apple Touch Icon SVG (clean rounded squircle)
  const iconSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Dark Radial Canvas Background -->
    <radialGradient id="bgGlow" cx="50%" cy="42%" r="65%">
      <stop offset="0%" stop-color="#181822" />
      <stop offset="50%" stop-color="#0e0e13" />
      <stop offset="100%" stop-color="#08080a" />
    </radialGradient>

    <!-- Vibrant Red Brand Gradient -->
    <linearGradient id="redGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff3342" />
      <stop offset="50%" stop-color="#e50914" />
      <stop offset="100%" stop-color="#a8050e" />
    </linearGradient>

    <!-- Metallic Highlight Gradient -->
    <linearGradient id="metalGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="45%" stop-color="#e4e4e7" />
      <stop offset="100%" stop-color="#71717a" />
    </linearGradient>
  </defs>

  <!-- Canvas Background -->
  <rect width="512" height="512" rx="112" fill="url(#bgGlow)" />
  
  <!-- Subtle Outer Border Accent -->
  <rect x="2" y="2" width="508" height="508" rx="110" fill="none" stroke="#252532" stroke-width="3" stroke-opacity="0.8" />
  <rect x="6" y="6" width="500" height="500" rx="106" fill="none" stroke="#e50914" stroke-width="2" stroke-opacity="0.25" />

  <!-- Central Fitness Iconography: Stylized Heavy Barbell & Muscular Monogram -->
  <g>
    <!-- Barbell Shaft with polished knurling accents -->
    <rect x="176" y="244" width="160" height="24" rx="12" fill="url(#metalGrad)" />
    <!-- Barbell inner rings / collar stops -->
    <rect x="200" y="238" width="12" height="36" rx="4" fill="#a1a1aa" />
    <rect x="300" y="238" width="12" height="36" rx="4" fill="#a1a1aa" />

    <!-- Left Weight Plates (Hexagonal Profile) -->
    <!-- Outer Heavy Plate -->
    <path d="M 124 164 L 160 188 L 160 324 L 124 348 Z" fill="url(#redGrad)" />
    <!-- Inner Secondary Plate -->
    <path d="M 166 196 L 194 212 L 194 300 L 166 316 Z" fill="#ff3847" />
    <line x1="160" y1="188" x2="160" y2="324" stroke="#ffffff" stroke-width="3" stroke-opacity="0.45" />

    <!-- Right Weight Plates (Hexagonal Profile) -->
    <!-- Outer Heavy Plate -->
    <path d="M 388 164 L 352 188 L 352 324 L 388 348 Z" fill="url(#redGrad)" />
    <!-- Inner Secondary Plate -->
    <path d="M 346 196 L 318 212 L 318 300 L 346 316 Z" fill="#ff3847" />
    <line x1="352" y1="188" x2="352" y2="324" stroke="#ffffff" stroke-width="3" stroke-opacity="0.45" />

    <!-- Stylized "B" / Athletic Crest above center -->
    <path d="M 232 176 L 268 176 C 284 176 294 186 294 200 C 294 210 286 218 276 220 C 288 223 298 232 298 248 C 298 264 284 276 266 276 L 232 276 Z" 
          fill="none" stroke="url(#metalGrad)" stroke-width="14" stroke-linecap="round" stroke-linejoin="round" />
    <line x1="240" y1="184" x2="240" y2="268" stroke="#ffffff" stroke-width="8" stroke-linecap="round" />
  </g>

  <!-- Modern Brand Title Sub-Badge "BASE VISUAL" at bottom -->
  <g transform="translate(0, 396)">
    <rect x="146" y="0" width="220" height="28" rx="14" fill="#15151e" stroke="#2a2a3a" stroke-width="1.5" />
    <circle cx="166" cy="14" r="4" fill="#e50914" />
    <text x="258" y="18" text-anchor="middle" font-family="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" font-size="12" font-weight="800" fill="#f4f4f5" letter-spacing="3.5">BASE VISUAL</text>
  </g>
</svg>`;

  // 2. Maskable Icon SVG (full bleed, safely scaled inside 80% circle)
  const maskableSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="mBgGlow" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#181822" />
      <stop offset="60%" stop-color="#0d0d12" />
      <stop offset="100%" stop-color="#08080a" />
    </radialGradient>

    <linearGradient id="mRedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff3342" />
      <stop offset="50%" stop-color="#e50914" />
      <stop offset="100%" stop-color="#a8050e" />
    </linearGradient>

    <linearGradient id="mMetalGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="45%" stop-color="#e4e4e7" />
      <stop offset="100%" stop-color="#71717a" />
    </linearGradient>
  </defs>

  <!-- Full-bleed background for maskable adaptive clipping -->
  <rect width="512" height="512" fill="url(#mBgGlow)" />

  <!-- Scaled content centered within safe zone (80%) -->
  <g transform="translate(51, 51) scale(0.8)">
    <!-- Barbell Shaft -->
    <rect x="176" y="244" width="160" height="24" rx="12" fill="url(#mMetalGrad)" />
    <rect x="200" y="238" width="12" height="36" rx="4" fill="#a1a1aa" />
    <rect x="300" y="238" width="12" height="36" rx="4" fill="#a1a1aa" />

    <!-- Left Weight Plates -->
    <path d="M 124 164 L 160 188 L 160 324 L 124 348 Z" fill="url(#mRedGrad)" />
    <path d="M 166 196 L 194 212 L 194 300 L 166 316 Z" fill="#ff3847" />
    <line x1="160" y1="188" x2="160" y2="324" stroke="#ffffff" stroke-width="3" stroke-opacity="0.45" />

    <!-- Right Weight Plates -->
    <path d="M 388 164 L 352 188 L 352 324 L 388 348 Z" fill="url(#mRedGrad)" />
    <path d="M 346 196 L 318 212 L 318 300 L 346 316 Z" fill="#ff3847" />
    <line x1="352" y1="188" x2="352" y2="324" stroke="#ffffff" stroke-width="3" stroke-opacity="0.45" />

    <!-- Stylized "B" / Athletic Crest -->
    <path d="M 232 176 L 268 176 C 284 176 294 186 294 200 C 294 210 286 218 276 220 C 288 223 298 232 298 248 C 298 264 284 276 266 276 L 232 276 Z" 
          fill="none" stroke="url(#mMetalGrad)" stroke-width="14" stroke-linecap="round" stroke-linejoin="round" />
    <line x1="240" y1="184" x2="240" y2="268" stroke="#ffffff" stroke-width="8" stroke-linecap="round" />

    <!-- Brand Badge -->
    <g transform="translate(0, 396)">
      <rect x="146" y="0" width="220" height="28" rx="14" fill="#15151e" stroke="#2a2a3a" stroke-width="1.5" />
      <circle cx="166" cy="14" r="4" fill="#e50914" />
      <text x="258" y="18" text-anchor="middle" font-family="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" font-size="12" font-weight="800" fill="#f4f4f5" letter-spacing="3.5">BASE VISUAL</text>
    </g>
  </g>
</svg>`;

  fs.writeFileSync(path.join(publicDir, 'icon.svg'), iconSvg);
  console.log('Written icon.svg');

  // Convert with Sharp
  const iconBuffer = Buffer.from(iconSvg);
  const maskableBuffer = Buffer.from(maskableSvg);

  await sharp(iconBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'pwa-192x192.png'));
  console.log('Generated pwa-192x192.png');

  await sharp(iconBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-512x512.png'));
  console.log('Generated pwa-512x512.png');

  await sharp(maskableBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));
  console.log('Generated pwa-maskable-512x512.png');

  // Apple touch icon (180x180 png with solid dark background)
  await sharp(iconBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('Generated apple-touch-icon.png');

  // Favicon 32x32
  await sharp(iconBuffer)
    .resize(32, 32)
    .png()
    .toFile(path.join(publicDir, 'favicon.png'));
  console.log('Generated favicon.png');

  console.log('All icons generated successfully with Sharp!');
}

generate().catch((err) => {
  console.error('Error generating icons:', err);
  process.exit(1);
});

