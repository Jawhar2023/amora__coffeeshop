// One-off generator for premium branded SVG placeholder images.
// Run: node scripts/gen-placeholders.mjs
// Output: public/images/menu/<folder>/<slug>.svg
// Swap any of these for a real photo later — filenames stay the same, no code changes needed.

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

const DEEP = '#0d2050';
const BLUE = '#1c469b';
const CREAM = '#fdfbf6';

const items = [
  // Hot Coffee Specials
  { folder: 'hot-coffee', slug: 'vanilla-latte', vessel: 'latte', accent: '#cdb083', hot: true },
  { folder: 'hot-coffee', slug: 'caramel-macchiato', vessel: 'latte', accent: '#c98a3b', hot: true },
  { folder: 'hot-coffee', slug: 'toffee-nut-latte', vessel: 'mug', accent: '#a97452', hot: true },
  { folder: 'hot-coffee', slug: 'chocolate-mocha', vessel: 'latte', accent: '#6b4226', hot: true },
  { folder: 'hot-coffee', slug: 'cinnamon-honey-latte', vessel: 'mug', accent: '#c98a3b', hot: true },
  { folder: 'hot-coffee', slug: 'spanish-latte', vessel: 'latte', accent: '#cdb083', hot: true },
  { folder: 'hot-coffee', slug: 'brown-sugar-latte', vessel: 'latte', accent: '#a06a2e', hot: true },
  { folder: 'hot-coffee', slug: 'cookie-latte', vessel: 'mug', accent: '#b98a52', hot: true },
  { folder: 'hot-coffee', slug: 'hazelnut-latte', vessel: 'latte', accent: '#a97452', hot: true },
  // Classics
  { folder: 'hot-coffee', slug: 'americano', vessel: 'mug', accent: '#4a3222', hot: true },
  { folder: 'hot-coffee', slug: 'espresso', vessel: 'espresso', accent: '#3a2317', hot: true },
  { folder: 'hot-coffee', slug: 'cappuccino', vessel: 'mug', accent: '#8a6a4a', hot: true },
  { folder: 'hot-coffee', slug: 'flat-white', vessel: 'mug', accent: '#b3966e', hot: true },
  { folder: 'hot-coffee', slug: 'cafe-turc', vessel: 'espresso', accent: '#3a2317', hot: true },
  { folder: 'hot-coffee', slug: 'cappucin', vessel: 'mug', accent: '#8a6a4a', hot: true },
  // Extras
  { folder: 'extras', slug: 'coffee-shot-capsule', vessel: 'shot', accent: '#3a2317', hot: true },
  { folder: 'extras', slug: 'sirop', vessel: 'bottle', accent: '#c98a3b', hot: false },
  { folder: 'extras', slug: 'non-dairy-milk', vessel: 'pitcher', accent: '#e8e2d4', hot: false },
  // Iced Coffees
  { folder: 'iced-coffee', slug: 'iced-vanilla', vessel: 'highball', accent: '#cdb083', hot: false },
  { folder: 'iced-coffee', slug: 'iced-toffee-nut', vessel: 'highball', accent: '#a97452', hot: false },
  { folder: 'iced-coffee', slug: 'iced-salted-caramel', vessel: 'highball', accent: '#c98a3b', hot: false },
  { folder: 'iced-coffee', slug: 'iced-chocolate-mocha', vessel: 'highball', accent: '#6b4226', hot: false },
  { folder: 'iced-coffee', slug: 'iced-cookie-butter', vessel: 'highball', accent: '#b98a52', hot: false },
  { folder: 'iced-coffee', slug: 'iced-hazelnut', vessel: 'highball', accent: '#a97452', hot: false },
  { folder: 'iced-coffee', slug: 'iced-blueberry', vessel: 'highball', accent: '#5b57c9', hot: false },
  { folder: 'iced-coffee', slug: 'iced-strawberry', vessel: 'highball', accent: '#e0507a', hot: false },
  { folder: 'iced-coffee', slug: 'iced-spanish', vessel: 'highball', accent: '#cdb083', hot: false },
  { folder: 'iced-coffee', slug: 'iced-honey-cinnamon', vessel: 'highball', accent: '#c98a3b', hot: false },
  { folder: 'iced-coffee', slug: 'iced-tiramisu', vessel: 'highball', accent: '#8a6a4a', hot: false },
  { folder: 'iced-coffee', slug: 'iced-brown-sugar', vessel: 'highball', accent: '#a06a2e', hot: false },
  { folder: 'iced-coffee', slug: 'iced-latte', vessel: 'highball', accent: '#b3966e', hot: false },
  // Shaken Espresso
  { folder: 'shaken-espresso', slug: 'hazelnut-shaken-espresso', vessel: 'highball', accent: '#a97452', hot: false },
  { folder: 'shaken-espresso', slug: 'brown-sugar-shaken-espresso', vessel: 'highball', accent: '#a06a2e', hot: false },
  { folder: 'shaken-espresso', slug: 'honey-shaken-espresso', vessel: 'highball', accent: '#c98a3b', hot: false },
  // Drinks
  { folder: 'drinks', slug: 'hot-chocolate', vessel: 'mug', accent: '#5a3620', hot: true },
  { folder: 'drinks', slug: 'hot-chocolate-marshmallow', vessel: 'mug', accent: '#5a3620', hot: true },
  { folder: 'drinks', slug: 'hot-chocolate-whipped-cream', vessel: 'mug', accent: '#5a3620', hot: true },
  { folder: 'drinks', slug: 'frappuccino-chocolat', vessel: 'highball', accent: '#5a3620', hot: false },
  { folder: 'drinks', slug: 'frappuccino-speculoos', vessel: 'highball', accent: '#b3855a', hot: false },
  { folder: 'drinks', slug: 'frappuccino-caramel', vessel: 'highball', accent: '#c98a3b', hot: false },
  { folder: 'drinks', slug: 'mojito-virgin', vessel: 'highball', accent: '#4c9a6b', hot: false },
  { folder: 'drinks', slug: 'mojito-bleu', vessel: 'highball', accent: '#2d6fd1', hot: false },
  { folder: 'drinks', slug: 'mojito-red', vessel: 'highball', accent: '#c9394f', hot: false },
  { folder: 'drinks', slug: 'mojito-energetique', vessel: 'highball', accent: '#8fbf3e', hot: false },
  { folder: 'drinks', slug: 'the-vert-menthe', vessel: 'tea', accent: '#4c9a6b', hot: true },
  { folder: 'drinks', slug: 'the-vert-amandes', vessel: 'tea', accent: '#b98a52', hot: true },
  { folder: 'drinks', slug: 'the-vert-pignons', vessel: 'tea', accent: '#8a9a4a', hot: true },
  { folder: 'drinks', slug: 'iced-tea-peach', vessel: 'highball', accent: '#e0913a', hot: false },
  // Jus
  { folder: 'juices', slug: 'jus-fraise', vessel: 'highball', accent: '#d9375a', hot: false },
  { folder: 'juices', slug: 'citronnade', vessel: 'highball', accent: '#d9c23a', hot: false },
  { folder: 'juices', slug: 'pink-lemonade', vessel: 'highball', accent: '#e06fa0', hot: false },
  { folder: 'juices', slug: 'fruit-de-bois', vessel: 'highball', accent: '#7a4fae', hot: false },
  { folder: 'juices', slug: 'kiwi', vessel: 'highball', accent: '#6fae3e', hot: false },
  { folder: 'juices', slug: 'peche-mangue', vessel: 'highball', accent: '#e0913a', hot: false },
];

function vesselPath(vessel) {
  switch (vessel) {
    case 'mug':
      return `
        <path d="M270 300 h250 v190 a125 125 0 0 1 -125 125 h0 a125 125 0 0 1 -125 -125 Z" fill="url(#liquid)" opacity="0.94"/>
        <rect x="255" y="280" width="280" height="34" rx="10" fill="#ffffff"/>
        <path d="M520 340 q90 5 90 75 q0 70 -90 80" fill="none" stroke="#ffffff" stroke-width="18" stroke-linecap="round"/>
      `;
    case 'latte':
      return `
        <path d="M290 260 h210 l-18 330 a20 20 0 0 1 -20 18 h-134 a20 20 0 0 1 -20 -18 Z" fill="url(#liquid)" opacity="0.9"/>
        <rect x="280" y="240" width="230" height="28" rx="9" fill="#ffffff"/>
        <ellipse cx="395" cy="290" rx="88" ry="16" fill="#ffffff" opacity="0.55"/>
      `;
    case 'espresso':
      return `
        <path d="M320 320 h150 v90 a75 75 0 0 1 -75 75 h0 a75 75 0 0 1 -75 -75 Z" fill="url(#liquid)" opacity="0.95"/>
        <rect x="308" y="304" width="174" height="24" rx="8" fill="#ffffff"/>
        <path d="M470 340 q55 4 55 46 q0 42 -55 48" fill="none" stroke="#ffffff" stroke-width="13" stroke-linecap="round"/>
        <ellipse cx="395" cy="500" rx="120" ry="14" fill="#ffffff" opacity="0.7"/>
      `;
    case 'highball':
      return `
        <path d="M305 250 h180 l-14 340 a16 16 0 0 1 -16 15 h-120 a16 16 0 0 1 -16 -15 Z" fill="url(#liquid)" opacity="0.88"/>
        <rect x="298" y="236" width="194" height="20" rx="6" fill="#ffffff" opacity="0.9"/>
        <ellipse cx="395" cy="340" rx="20" ry="26" fill="#ffffff" opacity="0.35"/>
        <ellipse cx="440" cy="400" rx="16" ry="20" fill="#ffffff" opacity="0.3"/>
      `;
    case 'tea':
      return `
        <path d="M330 270 h130 l-10 260 a14 14 0 0 1 -14 13 h-82 a14 14 0 0 1 -14 -13 Z" fill="url(#liquid)" opacity="0.9"/>
        <rect x="322" y="258" width="146" height="16" rx="5" fill="#ffffff" opacity="0.9"/>
      `;
    case 'shot':
      return `
        <path d="M350 320 h90 l-6 130 a10 10 0 0 1 -10 9 h-58 a10 10 0 0 1 -10 -9 Z" fill="url(#liquid)" opacity="0.95"/>
        <rect x="344" y="310" width="102" height="14" rx="5" fill="#ffffff"/>
      `;
    case 'bottle':
      return `
        <path d="M368 250 h54 v50 l24 30 v170 a14 14 0 0 1 -14 14 h-74 a14 14 0 0 1 -14 -14 v-170 l24 -30 Z" fill="url(#liquid)" opacity="0.92"/>
        <rect x="372" y="230" width="46" height="26" rx="6" fill="#ffffff"/>
      `;
    case 'pitcher':
      return `
        <path d="M300 280 h170 v160 a30 30 0 0 1 -30 30 h-110 a30 30 0 0 1 -30 -30 Z" fill="url(#liquid)" opacity="0.9"/>
        <rect x="292" y="264" width="186" height="22" rx="7" fill="#ffffff"/>
        <path d="M470 300 q70 10 40 90" fill="none" stroke="#ffffff" stroke-width="14" stroke-linecap="round"/>
      `;
    default:
      return '';
  }
}

function steam(hot) {
  if (!hot) return '';
  return `
    <g stroke="#ffffff" stroke-width="8" stroke-linecap="round" opacity="0.5" fill="none">
      <path d="M360 210 q-14 -22 0 -44 q14 -22 0 -44" />
      <path d="M420 210 q-14 -22 0 -44 q14 -22 0 -44" />
    </g>
  `;
}

function svgFor(accent) {
  const s = steamFlag => steam(steamFlag);
  return (hot) => `<?xml version="1.0" encoding="UTF-8"?>
<svg width="800" height="800" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${CREAM}"/>
      <stop offset="1" stop-color="#f2ecdd"/>
    </linearGradient>
    <linearGradient id="liquid" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${accent}"/>
      <stop offset="1" stop-color="${DEEP}"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.38" r="0.6">
      <stop offset="0" stop-color="${accent}" stop-opacity="0.16"/>
      <stop offset="1" stop-color="${accent}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="800" height="800" fill="url(#bg)"/>
  <circle cx="400" cy="380" r="330" fill="url(#glow)"/>
  <ellipse cx="395" cy="630" rx="150" ry="22" fill="${DEEP}" opacity="0.08"/>
  ${s(hot)}
  {{VESSEL}}
  <circle cx="120" cy="120" r="3" fill="${BLUE}" opacity="0.25"/>
  <circle cx="700" cy="150" r="3" fill="${BLUE}" opacity="0.2"/>
  <circle cx="680" cy="650" r="3" fill="${BLUE}" opacity="0.2"/>
</svg>`;
}

let count = 0;
for (const item of items) {
  const path = `public/images/menu/${item.folder}/${item.slug}.svg`;
  const template = svgFor(item.accent)(item.hot).replace('{{VESSEL}}', vesselPath(item.vessel));
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, template, 'utf8');
  count++;
}
console.log(`Generated ${count} placeholder images.`);
