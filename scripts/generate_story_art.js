import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'public', 'assets', 'story');
fs.mkdirSync(OUT_DIR, { recursive: true });

function createSvgPanel1() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
  <defs>
    <linearGradient id="p1_bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0d0424"/>
      <stop offset="60%" stop-color="#1f104d"/>
      <stop offset="100%" stop-color="#361a7a"/>
    </linearGradient>
    <radialGradient id="p1_glow" cx="50%" cy="60%" r="50%">
      <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#0d0424" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="p1_wood" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#92400e"/>
      <stop offset="50%" stop-color="#b45309"/>
      <stop offset="100%" stop-color="#78350f"/>
    </linearGradient>
    <filter id="p1_drop" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000" flood-opacity="0.6"/>
    </filter>
    <filter id="p1_neon_amber" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <filter id="p1_neon_cyan" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1024" height="1024" fill="url(#p1_bg)"/>
  <rect width="1024" height="1024" fill="url(#p1_glow)"/>

  <!-- Starry sparkles in sky -->
  <g fill="#fff" opacity="0.6">
    <circle cx="120" cy="140" r="3"/>
    <circle cx="280" cy="90" r="2"/>
    <circle cx="450" cy="170" r="2.5"/>
    <circle cx="720" cy="110" r="3"/>
    <circle cx="880" cy="160" r="2"/>
    <circle cx="940" cy="90" r="3.5"/>
    <circle cx="200" cy="220" r="1.5"/>
    <circle cx="830" cy="240" r="2"/>
  </g>

  <!-- Distant Singapore Skyline Silhouette -->
  <path d="M0,520 L60,520 L60,460 L100,460 L100,520 L160,520 L160,420 L210,420 L210,380 L230,350 L250,380 L250,520 L340,520 L340,440 L380,440 L380,520 L512,520 L560,470 L590,470 L620,520 L720,520 L720,410 L770,410 L770,520 L860,520 L860,450 L910,450 L910,520 L1024,520 L1024,1024 L0,1024 Z" fill="#13082e" opacity="0.7"/>

  <!-- Pavement / Ground -->
  <polygon points="0,680 1024,680 1024,1024 0,1024" fill="#180b33"/>
  <line x1="0" y1="680" x2="1024" y2="680" stroke="#a855f7" stroke-width="4" opacity="0.4"/>

  <!-- Case Header Card -->
  <g filter="url(#p1_drop)">
    <rect x="80" y="50" width="864" height="100" rx="24" fill="#1e1045" stroke="#f59e0b" stroke-width="3" opacity="0.95"/>
    <text x="120" y="95" fill="#f59e0b" font-family="'Inter', system-ui, sans-serif" font-weight="900" font-size="24" letter-spacing="3">CASE FILE #01 · THE NEIGHBORHOOD FENCE</text>
    <text x="120" y="125" fill="#e2e8f0" font-family="'Inter', system-ui, sans-serif" font-weight="700" font-size="16">Amirah &amp; Wei Jie investigate a 132° angle on a straight boundary rail.</text>
    <circle cx="890" cy="100" r="30" fill="#f59e0b"/>
    <text x="890" y="108" text-anchor="middle" font-size="28">🔍</text>
  </g>

  <!-- Main Wooden Fence Post & Rail (The Angle Diagram) -->
  <g id="fence_geometry" filter="url(#p1_drop)">
    <!-- Horizontal Straight Rail -->
    <rect x="120" y="600" width="784" height="34" rx="8" fill="url(#p1_wood)" stroke="#fde68a" stroke-width="2"/>
    <!-- Vertical Post Support -->
    <rect x="496" y="580" width="32" height="320" rx="6" fill="#78350f" stroke="#451a03" stroke-width="2"/>

    <!-- Diagonal Crossbeam creating the 132° angle -->
    <!-- Vertex at (512, 600). Line goes to top-right at 48° (or left obtuse at 132°) -->
    <polygon points="502,605 522,605 760,335 740,335" fill="url(#p1_wood)" stroke="#fde68a" stroke-width="2"/>

    <!-- Vertex Marker B -->
    <circle cx="512" cy="600" r="14" fill="#fbbf24" stroke="#fff" stroke-width="3" filter="url(#p1_neon_amber)"/>
    <text x="512" y="670" text-anchor="middle" fill="#fde68a" font-family="'Inter', sans-serif" font-weight="900" font-size="22">Vertex B</text>

    <!-- Ray Endpoints -->
    <circle cx="200" cy="617" r="8" fill="#38bdf8"/>
    <text x="200" y="660" text-anchor="middle" fill="#38bdf8" font-family="'Inter', sans-serif" font-weight="800" font-size="18">Point A</text>

    <circle cx="820" cy="617" r="8" fill="#38bdf8"/>
    <text x="820" y="660" text-anchor="middle" fill="#38bdf8" font-family="'Inter', sans-serif" font-weight="800" font-size="18">Point C</text>

    <circle cx="750" cy="335" r="8" fill="#a855f7"/>
    <text x="770" y="325" fill="#c084fc" font-family="'Inter', sans-serif" font-weight="800" font-size="18">Point D</text>
  </g>

  <!-- Glowing Angle Arcs & Labels -->
  <!-- Left Angle: 132° (Obtuse) -->
  <g filter="url(#p1_neon_amber)">
    <path d="M 392,600 A 120,120 0 0,1 602,510" fill="none" stroke="#f59e0b" stroke-width="8" stroke-linecap="round"/>
    <polygon points="602,510 590,525 615,520" fill="#f59e0b"/>
    <!-- Sector Fill -->
    <path d="M 512,600 L 392,600 A 120,120 0 0,1 602,510 Z" fill="#f59e0b" opacity="0.25"/>
  </g>
  <rect x="340" y="470" width="130" height="54" rx="16" fill="#180b33" stroke="#f59e0b" stroke-width="3" filter="url(#p1_drop)"/>
  <text x="405" y="506" text-anchor="middle" fill="#fbbf24" font-family="'Inter', sans-serif" font-weight="900" font-size="28">132°</text>

  <!-- Right Angle: x (Acute) -->
  <g filter="url(#p1_neon_cyan)">
    <path d="M 602,510 A 120,120 0 0,1 632,600" fill="none" stroke="#38bdf8" stroke-width="8" stroke-dasharray="10 6" stroke-linecap="round"/>
    <!-- Sector Fill -->
    <path d="M 512,600 L 602,510 A 120,120 0 0,1 632,600 Z" fill="#38bdf8" opacity="0.25"/>
  </g>
  <rect x="630" y="470" width="140" height="54" rx="16" fill="#180b33" stroke="#38bdf8" stroke-width="3" filter="url(#p1_drop)"/>
  <text x="700" y="506" text-anchor="middle" fill="#38bdf8" font-family="'Inter', sans-serif" font-weight="900" font-size="28">x = ?</text>

  <!-- Detective Clue Callout Box at Bottom -->
  <g filter="url(#p1_drop)">
    <rect x="160" y="760" width="704" height="150" rx="28" fill="#120626" stroke="#c084fc" stroke-width="3"/>
    <circle cx="230" cy="835" r="42" fill="#8b5cf6" opacity="0.4"/>
    <text x="230" y="850" text-anchor="middle" font-size="44">🦉</text>
    <text x="300" y="810" fill="#fde68a" font-family="'Inter', sans-serif" font-weight="900" font-size="22">Inspector Tally's Case Rule:</text>
    <text x="300" y="845" fill="#f1f5f9" font-family="'Inter', sans-serif" font-weight="700" font-size="18">"Detectives never guess! Look at the straight fence rail."</text>
    <text x="300" y="880" fill="#38bdf8" font-family="'Inter', sans-serif" font-weight="800" font-size="18">132° + x = 180°  ➔  Adjacent angles on a straight line!</text>
  </g>

  <!-- Decorative Corner Accents -->
  <circle cx="50" cy="50" r="16" fill="#f59e0b" opacity="0.3"/>
  <circle cx="974" cy="50" r="16" fill="#38bdf8" opacity="0.3"/>
  <circle cx="50" cy="974" r="16" fill="#a855f7" opacity="0.3"/>
  <circle cx="974" cy="974" r="16" fill="#ec4899" opacity="0.3"/>
</svg>`;
}

function createSvgPanel2() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
  <defs>
    <linearGradient id="p2_bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0a051d"/>
      <stop offset="60%" stop-color="#180e3d"/>
      <stop offset="100%" stop-color="#2d1760"/>
    </linearGradient>
    <filter id="p2_drop" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000" flood-opacity="0.6"/>
    </filter>
    <filter id="p2_neon" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="5" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <rect width="1024" height="1024" fill="url(#p2_bg)"/>

  <!-- Header Card -->
  <g filter="url(#p2_drop)">
    <rect x="80" y="40" width="864" height="96" rx="24" fill="#1c0f42" stroke="#38bdf8" stroke-width="3"/>
    <text x="120" y="82" fill="#38bdf8" font-family="'Inter', sans-serif" font-weight="900" font-size="24" letter-spacing="3">CASE FILE #02 · READING THE CLUES</text>
    <text x="120" y="112" fill="#e2e8f0" font-family="'Inter', sans-serif" font-weight="700" font-size="16">Inspector Tally's Field Guide to Angle Classification &amp; Vertex Naming</text>
    <circle cx="890" cy="88" r="28" fill="#38bdf8"/>
    <text x="890" y="96" text-anchor="middle" font-size="26">📐</text>
  </g>

  <!-- Big Central Chalkboard: Vertex Naming ∠ABC -->
  <g filter="url(#p2_drop)">
    <rect x="80" y="160" width="864" height="340" rx="28" fill="#0f0926" stroke="#c084fc" stroke-width="3"/>
    <rect x="100" y="180" width="824" height="300" rx="18" fill="#140c33" stroke="#a855f7" stroke-width="1.5" stroke-dasharray="8 6"/>

    <!-- Chalkboard Title -->
    <text x="130" y="225" fill="#fde68a" font-family="'Inter', sans-serif" font-weight="900" font-size="20">DETECTIVE'S GOLDEN RULE: VERTEX IN MIDDLE</text>

    <!-- The Diagram: ∠ABC with Rays BA and BC -->
    <!-- Vertex B at (320, 390) -->
    <line x1="320" y1="390" x2="620" y2="390" stroke="#38bdf8" stroke-width="8" stroke-linecap="round"/>
    <line x1="320" y1="390" x2="520" y2="240" stroke="#f59e0b" stroke-width="8" stroke-linecap="round"/>

    <!-- Vertex B glowing circle -->
    <circle cx="320" cy="390" r="16" fill="#ec4899" stroke="#fff" stroke-width="4" filter="url(#p2_neon)"/>
    <text x="320" y="440" text-anchor="middle" fill="#ec4899" font-family="'Inter', sans-serif" font-weight="900" font-size="26">Vertex B</text>

    <!-- Point A -->
    <circle cx="520" cy="240" r="10" fill="#f59e0b"/>
    <text x="545" y="245" fill="#f59e0b" font-family="'Inter', sans-serif" font-weight="900" font-size="24">A</text>

    <!-- Point C -->
    <circle cx="620" cy="390" r="10" fill="#38bdf8"/>
    <text x="645" y="398" fill="#38bdf8" font-family="'Inter', sans-serif" font-weight="900" font-size="24">C</text>

    <!-- Arc at B -->
    <path d="M 400,390 A 80,80 0 0,0 376,348" fill="none" stroke="#fbbf24" stroke-width="6" stroke-linecap="round"/>

    <!-- Callout Box on Right -->
    <rect x="680" y="220" width="220" height="230" rx="20" fill="#1e1045" stroke="#f59e0b" stroke-width="2"/>
    <text x="790" y="260" text-anchor="middle" fill="#f59e0b" font-family="'Inter', sans-serif" font-weight="900" font-size="28">∠ABC</text>
    <text x="790" y="295" text-anchor="middle" fill="#e2e8f0" font-family="'Inter', sans-serif" font-weight="700" font-size="15">Middle letter = B</text>
    <line x1="710" y1="315" x2="870" y2="315" stroke="#a855f7" stroke-width="2"/>
    <text x="790" y="345" text-anchor="middle" fill="#38bdf8" font-family="'Inter', sans-serif" font-weight="700" font-size="14">Ray BA meeting</text>
    <text x="790" y="370" text-anchor="middle" fill="#38bdf8" font-family="'Inter', sans-serif" font-weight="700" font-size="14">Ray BC at Point B</text>
    <text x="790" y="415" text-anchor="middle" fill="#a7f3d0" font-family="'Inter', sans-serif" font-weight="800" font-size="14">✨ ALWAYS B!</text>
  </g>

  <!-- 5 Angle Type Cards Grid at Bottom -->
  <g filter="url(#p2_drop)">
    <!-- Card 1: Acute -->
    <rect x="80" y="530" width="156" height="300" rx="20" fill="#12092b" stroke="#10b981" stroke-width="2.5"/>
    <text x="158" y="570" text-anchor="middle" fill="#10b981" font-family="'Inter', sans-serif" font-weight="900" font-size="20">ACUTE</text>
    <text x="158" y="595" text-anchor="middle" fill="#a7f3d0" font-family="'Inter', sans-serif" font-weight="700" font-size="14">&lt; 90°</text>
    <path d="M 120,740 L 190,740 M 120,740 L 170,680" stroke="#10b981" stroke-width="5" stroke-linecap="round"/>
    <path d="M 150,740 A 30,30 0 0,0 142,713" fill="none" stroke="#fde68a" stroke-width="3"/>
    <text x="158" y="790" text-anchor="middle" fill="#e2e8f0" font-family="'Inter', sans-serif" font-weight="700" font-size="13">Sharp &amp; narrow</text>

    <!-- Card 2: Right -->
    <rect x="257" y="530" width="156" height="300" rx="20" fill="#12092b" stroke="#f59e0b" stroke-width="2.5"/>
    <text x="335" y="570" text-anchor="middle" fill="#f59e0b" font-family="'Inter', sans-serif" font-weight="900" font-size="20">RIGHT</text>
    <text x="335" y="595" text-anchor="middle" fill="#fde68a" font-family="'Inter', sans-serif" font-weight="700" font-size="14">= 90°</text>
    <path d="M 300,740 L 370,740 M 300,740 L 300,670" stroke="#f59e0b" stroke-width="5" stroke-linecap="round"/>
    <polyline points="300,720 320,720 320,740" fill="none" stroke="#fde68a" stroke-width="3"/>
    <text x="335" y="790" text-anchor="middle" fill="#e2e8f0" font-family="'Inter', sans-serif" font-weight="700" font-size="13">Square corner</text>

    <!-- Card 3: Obtuse -->
    <rect x="434" y="530" width="156" height="300" rx="20" fill="#12092b" stroke="#f97316" stroke-width="2.5"/>
    <text x="512" y="570" text-anchor="middle" fill="#f97316" font-family="'Inter', sans-serif" font-weight="900" font-size="20">OBTUSE</text>
    <text x="512" y="595" text-anchor="middle" fill="#fed7aa" font-family="'Inter', sans-serif" font-weight="700" font-size="14">90° - 180°</text>
    <path d="M 520,740 L 570,740 M 520,740 L 465,685" stroke="#f97316" stroke-width="5" stroke-linecap="round"/>
    <path d="M 545,740 A 25,25 0 0,0 497,717" fill="none" stroke="#fde68a" stroke-width="3"/>
    <text x="512" y="790" text-anchor="middle" fill="#e2e8f0" font-family="'Inter', sans-serif" font-weight="700" font-size="13">Wide &amp; open</text>

    <!-- Card 4: Straight -->
    <rect x="611" y="530" width="156" height="300" rx="20" fill="#12092b" stroke="#38bdf8" stroke-width="2.5"/>
    <text x="689" y="570" text-anchor="middle" fill="#38bdf8" font-family="'Inter', sans-serif" font-weight="900" font-size="20">STRAIGHT</text>
    <text x="689" y="595" text-anchor="middle" fill="#bae6fd" font-family="'Inter', sans-serif" font-weight="700" font-size="14">= 180°</text>
    <path d="M 630,730 L 750,730" stroke="#38bdf8" stroke-width="6" stroke-linecap="round"/>
    <circle cx="690" cy="730" r="5" fill="#fff"/>
    <path d="M 720,730 A 30,30 0 0,0 660,730" fill="none" stroke="#fde68a" stroke-width="3"/>
    <text x="689" y="790" text-anchor="middle" fill="#e2e8f0" font-family="'Inter', sans-serif" font-weight="700" font-size="13">Flat line</text>

    <!-- Card 5: Reflex -->
    <rect x="788" y="530" width="156" height="300" rx="20" fill="#12092b" stroke="#ec4899" stroke-width="2.5"/>
    <text x="866" y="570" text-anchor="middle" fill="#ec4899" font-family="'Inter', sans-serif" font-weight="900" font-size="20">REFLEX</text>
    <text x="866" y="595" text-anchor="middle" fill="#fbcfe8" font-family="'Inter', sans-serif" font-weight="700" font-size="14">&gt; 180°</text>
    <path d="M 850,710 L 920,710 M 850,710 L 890,660" stroke="#ec4899" stroke-width="5" stroke-linecap="round"/>
    <path d="M 880,710 A 30,30 0 1,1 865,690" fill="none" stroke="#fde68a" stroke-width="3"/>
    <text x="866" y="790" text-anchor="middle" fill="#e2e8f0" font-family="'Inter', sans-serif" font-weight="700" font-size="13">Beyond flat line</text>
  </g>

  <!-- Inspector Tally Stamp -->
  <g filter="url(#p2_drop)">
    <rect x="260" y="870" width="504" height="90" rx="24" fill="#1c0e44" stroke="#f59e0b" stroke-width="3"/>
    <circle cx="310" cy="915" r="30" fill="#f59e0b"/>
    <text x="310" y="924" text-anchor="middle" font-size="32">🦉</text>
    <text x="360" y="905" fill="#fde68a" font-family="'Inter', sans-serif" font-weight="900" font-size="20">Tally's Classification Rule:</text>
    <text x="360" y="935" fill="#f1f5f9" font-family="'Inter', sans-serif" font-weight="700" font-size="15">Recognizing angle types is the first step to cracking the case!</text>
  </g>
</svg>`;
}

function createSvgPanel3() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
  <defs>
    <linearGradient id="p3_bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#09041a"/>
      <stop offset="60%" stop-color="#190e38"/>
      <stop offset="100%" stop-color="#2d1354"/>
    </linearGradient>
    <filter id="p3_drop" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000" flood-opacity="0.6"/>
    </filter>
    <filter id="p3_glow_amber" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="p3_glow_cyan" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>

  <rect width="1024" height="1024" fill="url(#p3_bg)"/>

  <!-- Header -->
  <g filter="url(#p3_drop)">
    <rect x="80" y="40" width="864" height="96" rx="24" fill="#1b0f3e" stroke="#f59e0b" stroke-width="3"/>
    <text x="120" y="82" fill="#f59e0b" font-family="'Inter', sans-serif" font-weight="900" font-size="24" letter-spacing="3">CASE FILE #03 · THE STRAIGHT-LINE RULE</text>
    <text x="120" y="112" fill="#e2e8f0" font-family="'Inter', sans-serif" font-weight="700" font-size="16">Adjacent Angles on a Straight Line Always Sum to Exactly 180°</text>
    <circle cx="890" cy="88" r="28" fill="#f59e0b"/>
    <text x="890" y="96" text-anchor="middle" font-size="26">🛣️</text>
  </g>

  <!-- Big Central Protractor & Straight Line Canvas -->
  <g filter="url(#p3_drop)">
    <rect x="80" y="160" width="864" height="520" rx="32" fill="#120929" stroke="#a855f7" stroke-width="3"/>

    <!-- Semi-circular Protractor Arc background -->
    <path d="M 212,540 A 300,300 0 0,1 812,540 Z" fill="#1e1045" stroke="#a855f7" stroke-width="2" stroke-dasharray="6 4" opacity="0.6"/>

    <!-- Angle 132° Sector (Obtuse Amber) -->
    <!-- Arc from 180° to 48° (angle span 132°) -->
    <path d="M 512,540 L 212,540 A 300,300 0 0,1 712,317 Z" fill="#f59e0b" opacity="0.3"/>
    <path d="M 512,540 L 712,317" stroke="#fbbf24" stroke-width="8" stroke-linecap="round" filter="url(#p3_glow_amber)"/>
    <path d="M 332,540 A 180,180 0 0,1 632,406" fill="none" stroke="#f59e0b" stroke-width="8" stroke-linecap="round"/>

    <!-- Angle 48° Sector (Acute Cyan) -->
    <!-- Arc from 48° to 0° (angle span 48°) -->
    <path d="M 512,540 L 712,317 A 300,300 0 0,1 812,540 Z" fill="#38bdf8" opacity="0.3"/>
    <path d="M 632,406 A 180,180 0 0,1 692,540" fill="none" stroke="#38bdf8" stroke-width="8" stroke-dasharray="10 6" stroke-linecap="round"/>

    <!-- The Horizontal Straight Line AB -->
    <line x1="140" y1="540" x2="884" y2="540" stroke="#f8fafc" stroke-width="10" stroke-linecap="round"/>
    <circle cx="512" cy="540" r="16" fill="#ec4899" stroke="#fff" stroke-width="4"/>
    <text x="512" y="585" text-anchor="middle" fill="#ec4899" font-family="'Inter', sans-serif" font-weight="900" font-size="22">Common Vertex O</text>

    <!-- Point Labels along the straight line -->
    <text x="150" y="580" fill="#94a3b8" font-family="'Inter', sans-serif" font-weight="800" font-size="22">A</text>
    <text x="860" y="580" fill="#94a3b8" font-family="'Inter', sans-serif" font-weight="800" font-size="22">B</text>
    <text x="735" y="305" fill="#fde68a" font-family="'Inter', sans-serif" font-weight="900" font-size="24">Ray C</text>

    <!-- Large Badge Pill: 132° -->
    <rect x="340" y="380" width="140" height="60" rx="20" fill="#1b0f38" stroke="#f59e0b" stroke-width="3" filter="url(#p3_drop)"/>
    <text x="410" y="422" text-anchor="middle" fill="#fbbf24" font-family="'Inter', sans-serif" font-weight="900" font-size="32">132°</text>

    <!-- Large Badge Pill: x = 48° -->
    <rect x="690" y="440" width="160" height="60" rx="20" fill="#1b0f38" stroke="#38bdf8" stroke-width="3" filter="url(#p3_drop)"/>
    <text x="770" y="482" text-anchor="middle" fill="#38bdf8" font-family="'Inter', sans-serif" font-weight="900" font-size="32">x = 48°</text>

    <!-- Top Callout Banner -->
    <rect x="230" y="188" width="564" height="54" rx="18" fill="#1c0d45" stroke="#fde68a" stroke-width="2"/>
    <text x="512" y="222" text-anchor="middle" fill="#fde68a" font-family="'Inter', sans-serif" font-weight="900" font-size="19">AOB is a straight line  ➔  ∠AOC + ∠COB = 180°</text>
  </g>

  <!-- Big Equation Solving Card at Bottom -->
  <g filter="url(#p3_drop)">
    <rect x="80" y="710" width="864" height="250" rx="30" fill="#140b2e" stroke="#10b981" stroke-width="3"/>
    <circle cx="160" cy="835" r="48" fill="#10b981" opacity="0.3"/>
    <text x="160" y="850" text-anchor="middle" font-size="48">✨</text>

    <text x="240" y="765" fill="#10b981" font-family="'Inter', sans-serif" font-weight="900" font-size="26">THE DEDUCTION (WORKING STEP):</text>
    <text x="240" y="810" fill="#f8fafc" font-family="'Inter', sans-serif" font-weight="800" font-size="28">132° + x = 180°</text>
    <text x="500" y="810" fill="#94a3b8" font-family="'Inter', sans-serif" font-weight="700" font-size="20">(adj. ∠s on a str. line)</text>

    <text x="240" y="865" fill="#fde68a" font-family="'Inter', sans-serif" font-weight="900" font-size="36">x = 180° − 132° = 48°</text>
    <text x="240" y="915" fill="#a7f3d0" font-family="'Inter', sans-serif" font-weight="700" font-size="20">✔ Mystery solved with one subtraction! No guessing required.</text>
  </g>
</svg>`;
}

function createSvgPanel4() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
  <defs>
    <linearGradient id="p4_bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#080417"/>
      <stop offset="60%" stop-color="#150a30"/>
      <stop offset="100%" stop-color="#241147"/>
    </linearGradient>
    <filter id="p4_drop" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000" flood-opacity="0.6"/>
    </filter>
  </defs>

  <rect width="1024" height="1024" fill="url(#p4_bg)"/>

  <!-- Header -->
  <g filter="url(#p4_drop)">
    <rect x="80" y="40" width="864" height="96" rx="24" fill="#190d3b" stroke="#38bdf8" stroke-width="3"/>
    <text x="120" y="82" fill="#38bdf8" font-family="'Inter', sans-serif" font-weight="900" font-size="24" letter-spacing="3">CASE FILE #04 · THE FULL-CIRCLE RULE</text>
    <text x="120" y="112" fill="#e2e8f0" font-family="'Inter', sans-serif" font-weight="700" font-size="16">All Angles Meeting Around a Common Point Add Up to 360°</text>
    <circle cx="890" cy="88" r="28" fill="#38bdf8"/>
    <text x="890" y="96" text-anchor="middle" font-size="26">🧭</text>
  </g>

  <!-- Big Central Plaza / Lamppost Roundabout -->
  <g filter="url(#p4_drop)">
    <rect x="80" y="160" width="864" height="560" rx="32" fill="#0f0724" stroke="#c084fc" stroke-width="3"/>

    <!-- Central Outer Plaza Ring -->
    <circle cx="512" cy="440" r="240" fill="#180c38" stroke="#a855f7" stroke-width="2" stroke-dasharray="10 8"/>

    <!-- 4 Angle Sectors radiating from Center (512, 440):
         Sector 1 (Emerald): 110°  (0° to 110°)
         Sector 2 (Sapphire): 85°  (110° to 195°)
         Sector 3 (Amethyst): 95°  (195° to 290°)
         Sector 4 (Amber Gold): 70° (290° to 360° / 0°)
    -->
    <!-- Sector 1 (110°): from angle 0 to 110° -->
    <path d="M 512,440 L 732,440 A 220,220 0 0,1 437,647 Z" fill="#10b981" opacity="0.35"/>
    <line x1="512" y1="440" x2="732" y2="440" stroke="#10b981" stroke-width="6" stroke-linecap="round"/>
    <text x="610" y="540" fill="#a7f3d0" font-family="'Inter', sans-serif" font-weight="900" font-size="28">110°</text>

    <!-- Sector 2 (85°): from angle 110° to 195° -->
    <path d="M 512,440 L 437,647 A 220,220 0 0,1 299,383 Z" fill="#38bdf8" opacity="0.35"/>
    <line x1="512" y1="440" x2="437" y2="647" stroke="#38bdf8" stroke-width="6" stroke-linecap="round"/>
    <text x="360" y="530" fill="#bae6fd" font-family="'Inter', sans-serif" font-weight="900" font-size="28">85°</text>

    <!-- Sector 3 (95°): from angle 195° to 290° -->
    <path d="M 512,440 L 299,383 A 220,220 0 0,1 587,233 Z" fill="#a855f7" opacity="0.35"/>
    <line x1="512" y1="440" x2="299" y2="383" stroke="#a855f7" stroke-width="6" stroke-linecap="round"/>
    <text x="390" y="320" fill="#e9d5ff" font-family="'Inter', sans-serif" font-weight="900" font-size="28">95°</text>

    <!-- Sector 4 (Missing Angle x = 70°): from 290° to 360° -->
    <path d="M 512,440 L 587,233 A 220,220 0 0,1 732,440 Z" fill="#f59e0b" opacity="0.45"/>
    <line x1="512" y1="440" x2="587" y2="233" stroke="#f59e0b" stroke-width="6" stroke-linecap="round"/>
    <text x="630" y="320" fill="#fde68a" font-family="'Inter', sans-serif" font-weight="900" font-size="32">x = 70°</text>

    <!-- Central Lamppost / Point O -->
    <circle cx="512" cy="440" r="28" fill="#fbbf24" stroke="#fff" stroke-width="4"/>
    <circle cx="512" cy="440" r="14" fill="#d97706"/>
    <text x="512" y="446" text-anchor="middle" font-size="14" fill="#fff" font-weight="900">O</text>

    <!-- Full Circle Arrow -->
    <path d="M 512,205 A 235,235 0 1,1 511,205" fill="none" stroke="#fbbf24" stroke-width="4" stroke-dasharray="12 8"/>
    <polygon points="512,195 528,210 512,225" fill="#fbbf24"/>
    <text x="512" y="178" text-anchor="middle" fill="#fbbf24" font-family="'Inter', sans-serif" font-weight="900" font-size="20">Full Turn = 360°</text>
  </g>

  <!-- Bottom Calculation Banner -->
  <g filter="url(#p4_drop)">
    <rect x="80" y="750" width="864" height="210" rx="28" fill="#140a2b" stroke="#f59e0b" stroke-width="3"/>
    <text x="120" y="800" fill="#f59e0b" font-family="'Inter', sans-serif" font-weight="900" font-size="24">THE DETECTIVE'S POINT CALCULATION:</text>
    <text x="120" y="845" fill="#f8fafc" font-family="'Inter', sans-serif" font-weight="800" font-size="26">110° + 85° + 95° + x = 360°  (∠s at a pt.)</text>
    <text x="120" y="895" fill="#a7f3d0" font-family="'Inter', sans-serif" font-weight="900" font-size="32">290° + x = 360°  ➔  x = 360° − 290° = 70°</text>
    <text x="120" y="935" fill="#94a3b8" font-family="'Inter', sans-serif" font-weight="700" font-size="16">Amirah's Note: Sum all known slices, then subtract from 360° to find the missing clue!</text>
  </g>
</svg>`;
}

function createSvgPanel5() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
  <defs>
    <linearGradient id="p5_bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0b051f"/>
      <stop offset="60%" stop-color="#170c36"/>
      <stop offset="100%" stop-color="#2a134a"/>
    </linearGradient>
    <filter id="p5_drop" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000" flood-opacity="0.6"/>
    </filter>
    <filter id="p5_glow_red" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="p5_glow_blue" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>

  <rect width="1024" height="1024" fill="url(#p5_bg)"/>

  <!-- Header -->
  <g filter="url(#p5_drop)">
    <rect x="80" y="40" width="864" height="96" rx="24" fill="#1b0e3f" stroke="#ec4899" stroke-width="3"/>
    <text x="120" y="82" fill="#ec4899" font-family="'Inter', sans-serif" font-weight="900" font-size="24" letter-spacing="3">CASE FILE #05 · THE MIRROR RULE</text>
    <text x="120" y="112" fill="#e2e8f0" font-family="'Inter', sans-serif" font-weight="700" font-size="16">Vertically Opposite Angles Across Two Intersecting Lines Are Always Equal!</text>
    <circle cx="890" cy="88" r="28" fill="#ec4899"/>
    <text x="890" y="96" text-anchor="middle" font-size="26">🪞</text>
  </g>

  <!-- Big Central Crossroads Diagram -->
  <g filter="url(#p5_drop)">
    <rect x="80" y="160" width="864" height="540" rx="32" fill="#100829" stroke="#a855f7" stroke-width="3"/>

    <!-- Center is (512, 430) -->
    <!-- Two intersecting straight lines crossing at (512, 430) -->
    <!-- Line 1: from (212, 230) to (812, 630) -->
    <!-- Line 2: from (212, 630) to (812, 230) -->
    <line x1="160" y1="200" x2="864" y2="660" stroke="#f43f5e" stroke-width="8" stroke-linecap="round"/>
    <line x1="160" y1="660" x2="864" y2="200" stroke="#38bdf8" stroke-width="8" stroke-linecap="round"/>

    <!-- Central Intersection Vertex Marker -->
    <circle cx="512" cy="430" r="18" fill="#fbbf24" stroke="#fff" stroke-width="4"/>
    <text x="512" y="475" text-anchor="middle" fill="#fbbf24" font-family="'Inter', sans-serif" font-weight="900" font-size="22">Intersection X</text>

    <!-- Top & Bottom Vertically Opposite Angles: 125° (Rose / Coral) -->
    <!-- Top Angle Arc -->
    <path d="M 432,377 A 100,100 0 0,1 592,377" fill="none" stroke="#f43f5e" stroke-width="8" stroke-linecap="round" filter="url(#p5_glow_red)"/>
    <path d="M 512,430 L 432,377 A 100,100 0 0,1 592,377 Z" fill="#f43f5e" opacity="0.3"/>
    <rect x="442" y="270" width="140" height="54" rx="18" fill="#1b0d38" stroke="#f43f5e" stroke-width="3"/>
    <text x="512" y="307" text-anchor="middle" fill="#fda4af" font-family="'Inter', sans-serif" font-weight="900" font-size="28">125°</text>

    <!-- Bottom Angle Arc -->
    <path d="M 432,483 A 100,100 0 0,0 592,483" fill="none" stroke="#f43f5e" stroke-width="8" stroke-linecap="round" filter="url(#p5_glow_red)"/>
    <path d="M 512,430 L 432,483 A 100,100 0 0,0 592,483 Z" fill="#f43f5e" opacity="0.3"/>
    <rect x="442" y="550" width="140" height="54" rx="18" fill="#1b0d38" stroke="#f43f5e" stroke-width="3"/>
    <text x="512" y="587" text-anchor="middle" fill="#fda4af" font-family="'Inter', sans-serif" font-weight="900" font-size="28">125°</text>

    <!-- Connecting Mirror Double Arrow between Top and Bottom -->
    <path d="M 400,310 C 340,370 340,490 400,560" fill="none" stroke="#f43f5e" stroke-width="4" stroke-dasharray="8 6"/>
    <text x="310" y="435" text-anchor="middle" fill="#fda4af" font-family="'Inter', sans-serif" font-weight="900" font-size="16">EQUAL!</text>

    <!-- Left & Right Vertically Opposite Angles: 55° (Sky Blue) -->
    <!-- Left Angle Arc -->
    <path d="M 432,377 A 100,100 0 0,0 432,483" fill="none" stroke="#38bdf8" stroke-width="8" stroke-linecap="round" filter="url(#p5_glow_blue)"/>
    <path d="M 512,430 L 432,377 A 100,100 0 0,0 432,483 Z" fill="#38bdf8" opacity="0.3"/>
    <rect x="230" y="405" width="130" height="54" rx="18" fill="#1b0d38" stroke="#38bdf8" stroke-width="3"/>
    <text x="295" y="442" text-anchor="middle" fill="#bae6fd" font-family="'Inter', sans-serif" font-weight="900" font-size="28">55°</text>

    <!-- Right Angle Arc -->
    <path d="M 592,377 A 100,100 0 0,1 592,483" fill="none" stroke="#38bdf8" stroke-width="8" stroke-linecap="round" filter="url(#p5_glow_blue)"/>
    <path d="M 512,430 L 592,377 A 100,100 0 0,1 592,483 Z" fill="#38bdf8" opacity="0.3"/>
    <rect x="664" y="405" width="130" height="54" rx="18" fill="#1b0d38" stroke="#38bdf8" stroke-width="3"/>
    <text x="729" y="442" text-anchor="middle" fill="#bae6fd" font-family="'Inter', sans-serif" font-weight="900" font-size="28">55°</text>
  </g>

  <!-- Bottom Deductive Principles Card -->
  <g filter="url(#p5_drop)">
    <rect x="80" y="730" width="864" height="230" rx="28" fill="#12082b" stroke="#ec4899" stroke-width="3"/>
    <text x="120" y="775" fill="#f43f5e" font-family="'Inter', sans-serif" font-weight="900" font-size="22">TWO POWERFUL PROPERTIES COMBINED:</text>
    <text x="120" y="820" fill="#f8fafc" font-family="'Inter', sans-serif" font-weight="800" font-size="24">1. Vertically Opposite: Top = Bottom (125°) and Left = Right (55°)</text>
    <text x="120" y="865" fill="#f8fafc" font-family="'Inter', sans-serif" font-weight="800" font-size="24">2. Straight Line Check: 125° + 55° = 180° along every line!</text>
    <text x="120" y="915" fill="#a7f3d0" font-family="'Inter', sans-serif" font-weight="900" font-size="24">✨ Knowing JUST ONE angle lets detectives crack all four!</text>
  </g>
</svg>`;
}

function createSvgPanel6() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
  <defs>
    <linearGradient id="p6_bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0e0426"/>
      <stop offset="50%" stop-color="#210f4f"/>
      <stop offset="100%" stop-color="#3d1b7a"/>
    </linearGradient>
    <filter id="p6_drop" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000" flood-opacity="0.6"/>
    </filter>
    <radialGradient id="p6_sunburst" cx="50%" cy="40%" r="50%">
      <stop offset="0%" stop-color="#fbbf24" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#0e0426" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="1024" height="1024" fill="url(#p6_bg)"/>
  <rect width="1024" height="1024" fill="url(#p6_sunburst)"/>

  <!-- Confetti / Floating Sparkles -->
  <g opacity="0.8">
    <circle cx="140" cy="200" r="8" fill="#fbbf24"/>
    <polygon points="260,180 270,200 250,200" fill="#ec4899"/>
    <rect x="760" y="170" width="14" height="14" rx="3" fill="#38bdf8" transform="rotate(25 760 170)"/>
    <circle cx="880" cy="230" r="10" fill="#10b981"/>
    <polygon points="180,340 190,360 170,360" fill="#f59e0b"/>
    <rect x="850" y="360" width="16" height="16" rx="4" fill="#a855f7" transform="rotate(45 850 360)"/>
  </g>

  <!-- Header -->
  <g filter="url(#p6_drop)">
    <rect x="80" y="40" width="864" height="96" rx="24" fill="#1b0e3f" stroke="#fbbf24" stroke-width="3"/>
    <text x="120" y="82" fill="#fbbf24" font-family="'Inter', sans-serif" font-weight="900" font-size="24" letter-spacing="3">CASE FILE #06 · CASE CLOSED... FOR NOW</text>
    <text x="120" y="112" fill="#e2e8f0" font-family="'Inter', sans-serif" font-weight="700" font-size="16">You have mastered the foundational geometric rules! Enter the Detective Lab.</text>
    <circle cx="890" cy="88" r="28" fill="#fbbf24"/>
    <text x="890" y="96" text-anchor="middle" font-size="26">🏆</text>
  </g>

  <!-- Three Mastered Seals Badges -->
  <g filter="url(#p6_drop)">
    <!-- Seal 1: Straight Line 180° -->
    <rect x="80" y="170" width="268" height="380" rx="28" fill="#13092b" stroke="#38bdf8" stroke-width="3"/>
    <circle cx="214" cy="270" r="64" fill="#38bdf8" opacity="0.25"/>
    <circle cx="214" cy="270" r="50" fill="#190e38" stroke="#38bdf8" stroke-width="3"/>
    <text x="214" y="280" text-anchor="middle" font-size="36">🛣️</text>
    <text x="214" y="375" text-anchor="middle" fill="#38bdf8" font-family="'Inter', sans-serif" font-weight="900" font-size="24">STRAIGHT LINE</text>
    <text x="214" y="415" text-anchor="middle" fill="#fde68a" font-family="'Inter', sans-serif" font-weight="900" font-size="34">180°</text>
    <text x="214" y="465" text-anchor="middle" fill="#e2e8f0" font-family="'Inter', sans-serif" font-weight="700" font-size="16">Adjacent angles</text>
    <text x="214" y="495" text-anchor="middle" fill="#94a3b8" font-family="'Inter', sans-serif" font-weight="600" font-size="14">on a straight line</text>

    <!-- Seal 2: Angles at a Point 360° -->
    <rect x="378" y="170" width="268" height="380" rx="28" fill="#13092b" stroke="#10b981" stroke-width="3"/>
    <circle cx="512" cy="270" r="64" fill="#10b981" opacity="0.25"/>
    <circle cx="512" cy="270" r="50" fill="#190e38" stroke="#10b981" stroke-width="3"/>
    <text x="512" y="280" text-anchor="middle" font-size="36">🧭</text>
    <text x="512" y="375" text-anchor="middle" fill="#10b981" font-family="'Inter', sans-serif" font-weight="900" font-size="24">FULL TURN</text>
    <text x="512" y="415" text-anchor="middle" fill="#fde68a" font-family="'Inter', sans-serif" font-weight="900" font-size="34">360°</text>
    <text x="512" y="465" text-anchor="middle" fill="#e2e8f0" font-family="'Inter', sans-serif" font-weight="700" font-size="16">All angles around</text>
    <text x="512" y="495" text-anchor="middle" fill="#94a3b8" font-family="'Inter', sans-serif" font-weight="600" font-size="14">a common point</text>

    <!-- Seal 3: Vertically Opposite -->
    <rect x="676" y="170" width="268" height="380" rx="28" fill="#13092b" stroke="#ec4899" stroke-width="3"/>
    <circle cx="810" cy="270" r="64" fill="#ec4899" opacity="0.25"/>
    <circle cx="810" cy="270" r="50" fill="#190e38" stroke="#ec4899" stroke-width="3"/>
    <text x="810" y="280" text-anchor="middle" font-size="36">🪞</text>
    <text x="810" y="375" text-anchor="middle" fill="#ec4899" font-family="'Inter', sans-serif" font-weight="900" font-size="24">VERT. OPPOSITE</text>
    <text x="810" y="415" text-anchor="middle" fill="#fde68a" font-family="'Inter', sans-serif" font-weight="900" font-size="34">EQUAL</text>
    <text x="810" y="465" text-anchor="middle" fill="#e2e8f0" font-family="'Inter', sans-serif" font-weight="700" font-size="16">Across intersecting</text>
    <text x="810" y="495" text-anchor="middle" fill="#94a3b8" font-family="'Inter', sans-serif" font-weight="600" font-size="14">straight lines</text>
  </g>

  <!-- Big Celebratory Portal Banner at Bottom -->
  <g filter="url(#p6_drop)">
    <rect x="80" y="580" width="864" height="380" rx="36" fill="#160933" stroke="#fbbf24" stroke-width="3.5"/>

    <!-- Mascot Inspector Tally & Student Detectives -->
    <circle cx="210" cy="740" r="60" fill="#fbbf24" opacity="0.3"/>
    <text x="210" y="760" text-anchor="middle" font-size="64">🦉</text>
    <text x="210" y="830" text-anchor="middle" fill="#fde68a" font-family="'Inter', sans-serif" font-weight="900" font-size="20">Inspector Tally</text>

    <text x="320" y="660" fill="#fbbf24" font-family="'Inter', sans-serif" font-weight="900" font-size="32">CONGRATULATIONS DETECTIVE!</text>
    <text x="320" y="705" fill="#f8fafc" font-family="'Inter', sans-serif" font-weight="700" font-size="20">You have earned your Junior Detective Badge 🎖️</text>

    <rect x="320" y="730" width="580" height="110" rx="20" fill="#201045" stroke="#a855f7" stroke-width="2"/>
    <text x="345" y="775" fill="#a7f3d0" font-family="'Inter', sans-serif" font-weight="800" font-size="17">"Now enter the Detective Lab to test your skills across four</text>
    <text x="345" y="805" fill="#a7f3d0" font-family="'Inter', sans-serif" font-weight="800" font-size="17">hands-on interactive simulation stations!"</text>

    <!-- Lab Portal Button -->
    <rect x="320" y="865" width="580" height="64" rx="22" fill="#fbbf24" filter="url(#p6_drop)"/>
    <text x="610" y="907" text-anchor="middle" fill="#0f0724" font-family="'Inter', sans-serif" font-weight="900" font-size="24" letter-spacing="2">STEP INTO DETECTIVE LAB ➔</text>
  </g>
</svg>`;
}

const panels = [
  { id: 1, svg: createSvgPanel1() },
  { id: 2, svg: createSvgPanel2() },
  { id: 3, svg: createSvgPanel3() },
  { id: 4, svg: createSvgPanel4() },
  { id: 5, svg: createSvgPanel5() },
  { id: 6, svg: createSvgPanel6() }
];

console.log('--- GENERATING HIGH-QUALITY STORY ARTWORK (1024x1024) ---');

const edgeCandidates = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
];
const browserExe = edgeCandidates.find(p => fs.existsSync(p));
console.log('Browser engine for PNG render:', browserExe || 'None (SVG only)');

for (const p of panels) {
  const svgPath = path.join(OUT_DIR, `story_${p.id}.svg`);
  const pngPath = path.join(OUT_DIR, `story_${p.id}.png`);
  fs.writeFileSync(svgPath, p.svg, 'utf8');
  console.log(`✔ Generated story_${p.id}.svg (${p.svg.length} bytes)`);

  if (browserExe) {
    // Wrap in full-bleed HTML page for perfect 1024x1024 screenshot
    const tempHtml = path.join(OUT_DIR, `temp_${p.id}.html`);
    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  html, body { width:1024px; height:1024px; overflow:hidden; background:#0c031d; }
  svg { display:block; width:1024px; height:1024px; }
</style>
</head>
<body>
${p.svg}
</body>
</html>`;
    fs.writeFileSync(tempHtml, html, 'utf8');
    const fileUrl = 'file:///' + tempHtml.replace(/\\/g, '/');

    try {
      spawnSync(browserExe, [
        '--headless=new',
        '--disable-gpu',
        '--no-sandbox',
        '--screenshot=' + pngPath,
        '--window-size=1024,1024',
        '--hide-scrollbars',
        fileUrl
      ]);
      console.log(`✔ Rendered 1024x1024 PNG: story_${p.id}.png (${fs.statSync(pngPath).size} bytes)`);
    } catch (err) {
      console.error(`✖ Failed rendering PNG for panel ${p.id}:`, err.message);
    } finally {
      if (fs.existsSync(tempHtml)) fs.unlinkSync(tempHtml);
    }
  }
}

console.log('\n--- STORY ART GENERATION COMPLETE! ---');
