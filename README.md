# AngleQuest — Grade 7 Mathematics · Angles on Lines and at a Point

**Grade:** 7 (Singapore Secondary 1)  
**Topic:** Angles Formed with a Common Vertex  
**Module Name:** AngleQuest  
**Characters:** Amirah 👧, Wei Jie 👦, Inspector Tally the Owl 🦉  

---

## 1. Overview

AngleQuest is an interactive educational math module teaching angles formed with a common vertex from the Singapore MOE Lower Secondary Geometry syllabus.

Students explore three core geometric properties:
1. **Adjacent angles on a straight line** are supplementary and add up to **180°**.
2. **Angles at a point** make a full rotation and sum to **360°**.
3. **Vertically opposite angles** formed by two intersecting straight lines are **equal**.

---

## 2. Five-Phase Learning Architecture

- **Phase 1 · Wonder:** A real-world hook involving a leaning road sign fixed to a vertical post (132° visible, finding the hidden angle).
- **Phase 2 · Story (6 Panels):** Narrative journey with Amirah and Wei Jie at the Angle Detective Agency, guided by Inspector Tally.
- **Phase 3 · Simulate (4 Stations):**
  - **Station A · Protractor Workshop (Concept Discovery):** Rotate a ray along a straight line, watch live equation readouts `a + b = 180°`, and confirm geometric reasoning.
  - **Station B · Missing Angle Match (Build-to-Target):** Use interactive angle sliders to hit 180° and 360° targets with tolerance color bands.
  - **Station C · Intersection Puzzle (Composite Construction):** Fill in missing angles across four intersecting regions using both vertically opposite and straight line properties.
  - **Station D · Case File Detective (Error Detection):** Audit worked solution cards, locate seeded geometric slips, and select the correct fix.
- **Phase 4 · Practice (10 Worlds · 4 Modes):**
  - 10 thematic worlds covering naming, straight line sums, multi-term lines, points, intersections, justification, blueprints, clocks, and mixed reviews.
  - 4 Modes: Guided Practice (5 Qs + hints), Independent Practice (10 Qs), Timed Challenge (8 Qs + 60s timer), Boss Battles (5 Qs + 3 lives).
- **Phase 5 · Reflect:** 3-question conceptual recap quiz, scoreboard (XP, Stars n/30, Streak, Badges), open reflection to Inspector Tally, and confetti celebration.

---

## 3. Technology Stack

- **Framework:** React 18 + Vite
- **Styling:** Tailwind CSS + Vanilla CSS Tokens (`styles/design-tokens.css` & `styles/globals.css`)
- **Visuals:** Pure SVG diagram renderer (`AngleVisual.jsx`), Framer Motion, Canvas Confetti
- **Audio:** ElevenLabs Alice (`Xb7hH8MSUJpSbSDYk0k2`, `eleven_multilingual_v2`).
  - *Strict Rule:* Zero Web Speech API fallback. When audio is unavailable, narration skips silently without robotic browser voices.

---

## 4. Scripts & Commands

```bash
# Install dependencies
npm install

# Start local development server (port 3000)
npm run dev

# Build production bundle
npm run build

# Run 30,000-question bank stress test (300 seeds x 100 questions)
npm run test:bank

# Offline ElevenLabs audio generation (requires VITE_ELEVENLABS_API_KEY in .env.local)
npm run generate-audio

# Generate high-resolution story phase artwork (1024x1024 PNG & SVG)
npm run generate-story-art

# Clean up orphaned audio assets
npm run clean-audio
```

---

## 5. Project Directory Structure

```
angles on line g7/
├── docs/                                  # Specifications, TRD, PRD & pipelines
│   ├── AngleQuest_PRD.md                  # Product Requirements Document
│   ├── AngleQuest_TRD.md                  # Technical Requirements Document
│   └── audio_generation_pipeline.md       # ElevenLabs generation documentation
├── public/
│   ├── favicon.svg                        # Brand SVG icon
│   └── assets/
│       ├── audio/                         # Generated speech MP3 files (.gitkeep)
│       └── story/                         # 6 Story narrative panels (1024x1024 PNG)
├── scripts/
│   ├── clean_audio.js                     # Prunes unused audio cache files
│   ├── generate_audio.js                  # Offline ElevenLabs speech generator
│   └── stress_test_bank.js                # Monte-Carlo 30,000-question validator
├── src/
│   ├── App.jsx                            # Root state reducer & 5-phase manager
│   ├── main.jsx                           # React entrypoint
│   ├── index.css                          # Tailwind & token imports
│   ├── components/
│   │   ├── IntroScreen.jsx                # Module start & hero screen
│   │   ├── TopNav.jsx                     # Dynamic progress bar & audio controls
│   │   ├── gamification/                  # Badges, Kingdom Map, Star Rating
│   │   ├── phases/                        # Wonder, Story, Simulate, Play, Reflect
│   │   ├── quiz/                          # Question renderer & Boss battle modal
│   │   ├── shared/                        # AngleVisual (SVG), Mascot, Overlays
│   │   └── simulations/                   # 4 interactive math discovery stations
│   ├── config/                            # Characters, Worlds, Audio configuration
│   ├── data/                              # Procedural question bank & story text
│   ├── hooks/                             # Viewport, header height, and audio hooks
│   ├── styles/                            # Design tokens and global CSS
│   └── utils/                             # Angle geometry math, RNG, audio & scoring
├── index.html                             # Single page application entry
├── package.json                           # Dependencies and NPM scripts
├── tailwind.config.js                     # Tailwind theme and extensions
└── vite.config.js                         # Vite 5 bundler configuration
```

---

## 6. Story Art Brief (6 Panels · 1024×1024 PNG)

| Panel | Filename | Scene Description | Characters & Mood |
|---|---|---|---|
| 1 | `story_1.png` | A neighborhood street corner in Singapore. A wooden fence rail has one angle measured at 132° with a magnifying glass inspection tag. | Amirah and Wei Jie examining the fence with a detective notebook; curious, engaging mood. |
| 2 | `story_2.png` | Inspector Tally's agency desk with chalk diagrams of acute, right, obtuse, straight, and reflex angles, with three-letter vertex labels (∠ABC). | Inspector Tally pointing with his magnifying glass monocle; instructional, academic mood. |
| 3 | `story_3.png` | A sunlit horizontal fence rail with a diagonal crossbeam. One angle clearly shows 132° and the adjacent side glows with x = 48°. | Wei Jie solving the equation 180° − 132° = 48°; satisfied, bright afternoon lighting. |
| 4 | `story_4.png` | A central plaza with four stone pathways radiating outward from a round fountain base. | Amirah sketching the 360° circular paths in her casebook; expansive, lively atmosphere. |
| 5 | `story_5.png` | An aerial view of two straight crossroads crossing at an intersection with four colored angle arcs mirroring each other. | Wei Jie and Amirah highlighting the vertically opposite pairs; analytical, vibrant mood. |
| 6 | `story_6.png` | The Angle Detective Agency headquarters with tools, protractors, badges, and a doorway leading into the Detective Lab. | Inspector Tally handing the detective badges to Amirah and Wei Jie; celebratory, inspiring send-off. |
