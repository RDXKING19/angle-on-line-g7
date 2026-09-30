# AngleQuest — Grade 7 · Angles on Lines and at a Point (TRD)

**Companion to:** `AngleQuest_PRD.md` · **Repo name:** `G7-AngleQuest-main`
**Clone source:** `working-backwards-grade7-main` (user-supplied; overrides the default `G2-Money-Money-main` per the TRD blueprint's "newer sibling as clone source" clause).
**Section order (per blueprint):** 1 Reference Analysis Notes → 2 Tech Stack → 3 Folder Structure → 4 State Management → 5 Component Specs → 6 Data Layer → 7 Simulate Station Specs → 8 Audio Pipeline → 9 Gamification → 10 Design Tokens & Viewport → 11 Build/Deploy → 12 QA Plan → 13 Delivery Checklist → 14 Risks.

---

## 1. Reference Analysis Notes

The reference was read file by file. It is a working, shipped-quality build with an excellent visual system, but it is a **simplified variant** of the documented product standard. The rule applied throughout: **take UI/UX, layout, viewport and component-chrome patterns from the reference; where the reference contradicts a fixed rule in the PRD/TRD blueprints, the blueprint wins and the reference's version is not cloned.**

### 1.1 Blueprint §1 gotcha check — results against the actual repo

| # | Gotcha | Finding in reference | Action |
|---|---|---|---|
| 1 | Dead duplicate `src/features/*` | **Not present.** `App.jsx` imports directly from `./stages/*` and `./components/*`; no duplicate tree. | Nothing to avoid. |
| 2 | Hardcoded story-panel count | **Already fixed.** `StoryPhase.jsx` uses `STORY_SLIDES.length` throughout (8 slides). | Keep dynamic; AngleQuest has **6 panels** and must read `STORY_PANELS.length`. Re-verify in review. |
| 3 | Static vs procedural bank | **Procedural** (`makeQuestion(worldIndex)` in `mathData.js`, distractors modelled on misconceptions) but uses unseeded `Math.random`, generates one question at a time, and has no QA harness. | Keep the procedural approach; add a seeded PRNG, a 100-question `generateBank()`, per-world de-duplication and the ≥300-run stress test. |
| 4 | Viewport clipping | **Present.** `body`/`.app-container` use `100vh`; `<main>` gets a hardcoded `pt-12` (48 px) while `TopNav` is `position: fixed` and grows a second row (slide-progress bar) during Story. Content clips beneath it. Also `max-h-[94vh]` on Simulate/Reflect cards. | Fix per §10: `100dvh`, measured header height via `ResizeObserver` → `--header-h` CSS variable, `94dvh`. |
| 4b | *(new)* `zoom: 0.92` on `.sim-body` in a `max-height: 800px` media query | `zoom` is non-standard; behaves inconsistently across browsers and breaks pointer maths for SVG drag interactions. | Do **not** clone. Use `clamp()`-based sizing (already the reference's token approach) instead. |
| 5 | Leftover branding | `index.html` title/OG tags say "Working Backwards Quest", README describes the prior module and states the (banned) browser-speech fallback. | Rewrite both. Fix `og:description` (mentions "Zara"). |

### 1.2 Deviations from the documented product standard (reference vs blueprint)

| Area | Reference actually does | AngleQuest decision |
|---|---|---|
| Stack | React 18.3.1, Vite 5.3.1, no Framer Motion, no lucide-react (Tailwind transitions + emoji), adds `canvas-confetti`; no oxlint/dotenv/node-fetch | Adopt blueprint §2.1 versions (React 19, Vite 8, framer-motion, lucide-react, oxlint); **keep `canvas-confetti`** (used well on Reflect). If any version bump proves incompatible, pin to the reference's tested versions and record it (§14 R1). |
| Structure | Flat: `src/stages/*`, `src/components/*`, `src/utils/*`, `src/mathData.js`, single `index.css` | Use blueprint skeleton (§3). Mapping table in §3.2. |
| State | Component-local `useState` phase string in `App.jsx`; progress passed as props | `useReducer` with the blueprint's fixed action set (§4) — needed for badges, 4 modes, lives, station gating. |
| Simulate | 3 stations × 3 activities (9), no completion contract, "Next Activity" always enabled | 4 stations per blueprint §3.6 with `onComplete` gating; **keep the reference's 2-column shell** (station tabs left, activity panel right, prev/next footer). |
| Practice | One quiz per world with 3 hearts; no hints; no distinct modes | 4 modes + Boss Battle + hint1/hint2 per blueprint (PRD §5). Keep the reference's stats bar (score / hearts / streak) and world-select grid visual language. |
| Stars | ≥8 = 3★, ≥6 = 2★, ≥4 = 1★ | Blueprint thresholds: 9–10 / 7–8 / 5–6. |
| Badges | **None** (no badge engine) | Add `badgeEngine.js` with the 8 fixed triggers. |
| Reflect | Open text reflection + confetti only | Add the 3-question recap + scorecard (keep confetti and the reflection textarea). |
| Story shape | `{ id, title, image, body, quote, bubble }` with real art | Blueprint shape `{ panel, title, text, highlight, character, characterEmoji, imageBg, imageEmoji }` **plus** `image`, `quote`→`highlight`, `bubble` retained as optional fields so the reference's speech-bubble UX carries over. |
| Audio | 3-tier: static → ElevenLabs live → **browser `speechSynthesis`** | **Remove tier 3 entirely** (PRD §A.4 absolute rule). Delete `speakFallback`, `ttsVoice`, `pickVoice`, `speechSynthesis.cancel()`, and the `rate`/`pitch` fields. |
| Audio phrase list | `generate_audio.js` derives phrases from `getAllNarration()` | **Better than the blueprint's hand-maintained `phrases` array — adopt.** |
| Narration API | `getStoryNarration`, `simulateIntro(station, act)`, `practiceCorrectNarration`, … | Export the blueprint's fixed names (§8.2) so shared callers work unchanged. |
| Scoring/XP | Inline; no `calcXP`; `bestStreak` is set to `max(bestStreak, starsEarned)` — **a bug** (streak conflated with stars) | Do not clone. Streak is tracked in the reducer. |
| Config files | No `vercel.json`, `.oxlintrc.json`, `.env.local.example` | Add all three. |
| Names/mascot | Western names, "Robo" 🤖 | Not cloned — content decision governed by the PRD (Amirah, Wei Jie, Tally the Owl). |

### 1.3 Reference patterns explicitly **adopted**
Glass-card/phase-band visual system and phase colour tokens; fluid `clamp()` type and spacing scale; `TopNav` capsule with numbered phase pills, mute pill and Home/Close buttons; `BgSymbols` floating background (re-skinned with angle symbols); Story carousel with progress track in the nav; Simulate 2-column shell; the `Panel / Node / Msg / GoldBtn` tone-kit used for station chrome; practice stats bar (⭐ score · ❤️ hearts · 🔥 streak); world-select grid with "unlock if previous world ≥ 1★"; `canvas-confetti` on completion; `say/ask/cheer/emphasize/think/instruct` segment helpers; static-map → live-fetch → next-segment preload playback queue.

---

## 2. Tech Stack

```json
{
  "name": "angle-quest",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "dependencies": {
    "canvas-confetti": "^1.9.4",
    "framer-motion": "^12.42.0",
    "lucide-react": "^1.22.0",
    "react": "^19.2.7",
    "react-dom": "^19.2.7"
  },
  "devDependencies": {
    "@types/react": "^19.2.17",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^6.0.2",
    "autoprefixer": "^10.5.2",
    "dotenv": "^17.4.2",
    "node-fetch": "^3.3.2",
    "oxlint": "^1.69.0",
    "postcss": "^8.5.16",
    "tailwindcss": "^3.4.4",
    "vite": "^8.1.0"
  },
  "scripts": {
    "dev": "vite", "build": "vite build", "preview": "vite preview",
    "generate-audio": "node scripts/generate_audio.js",
    "clean-audio": "node scripts/clean_audio.js",
    "test:bank": "node scripts/stress_test_bank.js",
    "lint": "oxlint"
  }
}
```
Versions are taken from the blueprint; run `npm install` and `npm run build` early to confirm they resolve (see R1). `vite.config.js`: `base: '/'`, keep reference `server.port 3000`. `tailwind.config.js`: keep reference `fontFamily` (`display`, `body`) and phase colours; add the 10 world accents (§10). `vercel.json`: SPA rewrite `{"rewrites":[{"source":"/(.*)","destination":"/"}]}` (must not shadow `/assets/*` or `/api/*`).

---

## 3. Folder Structure

### 3.1 Target tree
```
G7-AngleQuest-main/
├── public/assets/{audio/, story/}          # story_1.png … story_6.png (1024×1024)
├── scripts/
│   ├── generate_audio.js                   # keep reference pattern: phrases = getAllNarration()
│   ├── clean_audio.js                      # reuse
│   └── stress_test_bank.js                 # NEW (§12)
├── src/
│   ├── assets/story/
│   ├── components/
│   │   ├── TopNav.jsx                      # from reference; + header ref/ResizeObserver (§10)
│   │   ├── IntroScreen.jsx/.css            # from reference IntroPhase; copy only
│   │   ├── ProgressMap.jsx/.css            # world-select grid (from PracticeWorldSelect)
│   │   ├── shared/
│   │   │   ├── Mascot.jsx  FeedbackOverlay.jsx  FloatingNumbers.jsx (→ FloatingSymbols)
│   │   │   └── AngleVisual.jsx             # NEW — replaces FlowDiagram.jsx
│   │   ├── gamification/  KingdomMap.jsx  StarRating.jsx
│   │   ├── quiz/          QuestionRenderer.jsx  BossBattleModal.jsx
│   │   ├── phases/        WonderPhase  StoryPhase  SimulatePhase  PlayPhase  ReflectPhase
│   │   └── simulations/
│   │       ├── ProtractorWorkshop.jsx      # Station A · Concept Discovery
│   │       ├── MatchTheMissingAngle.jsx    # Station B · Build-to-Target
│   │       ├── IntersectionPuzzle.jsx      # Station C · Composite
│   │       ├── CaseFileDetective.jsx       # Station D · Error-Detective
│   │       ├── kit.jsx                     # Panel / Node / Msg / GoldBtn / AngleSlider (from SimActivities.jsx)
│   │       └── Stations.css
│   ├── config/  worlds.config.js  characters.config.js  audio.config.js
│   ├── core/hooks/useViewport.js  useHeaderHeight.js
│   ├── hooks/useAudio.js
│   ├── data/  storyContent.js  questionBank.js
│   ├── utils/ audio.js  audioMap.js(auto)  narration.js  badgeEngine.js
│   │          scoring.js  shuffle.js  rng.js  angleMath.js
│   ├── styles/ design-tokens.css  globals.css
│   ├── App.jsx  App.css  main.jsx  index.css
├── index.html  package.json  vite.config.js  tailwind.config.js  postcss.config.js
├── vercel.json  .oxlintrc.json  .gitignore  .env.local.example  README.md
```
Do **not** create a `src/features/` tree.

### 3.2 Reference → target mapping
| Reference | Target |
|---|---|
| `stages/IntroPhase.jsx` | `components/IntroScreen.jsx` |
| `stages/WonderPhase.jsx` … `ReflectPhase.jsx` | `components/phases/*` |
| `stages/PracticePhase.jsx` (`PracticeWorldSelect`) | `ProgressMap.jsx` + `KingdomMap.jsx` |
| `stages/PracticePhase.jsx` (`PracticeQuiz`) | `PlayPhase.jsx` + `QuestionRenderer.jsx` |
| `components/SimActivities.jsx` (UI kit) | `simulations/kit.jsx` |
| `components/FlowDiagram.jsx` | `shared/AngleVisual.jsx` (rewritten, SVG) |
| `mathData.js` | `data/questionBank.js` + `utils/angleMath.js` |
| `index.css` | split → `styles/design-tokens.css` + `styles/globals.css` (same token values) |

---

## 4. State Management (`App.jsx`)

`useReducer` with the blueprint's fixed action set, verbatim: `SET_PHASE, NEXT_STORY_PANEL, PREV_STORY_PANEL, ADVANCE_SIM_STATION, PREV_SIM_STATION, COMPLETE_SIM_STATION, LOAD_QUESTIONS, ANSWER_CORRECT, ANSWER_INCORRECT, USE_HINT, CLEAR_FEEDBACK, PREV_QUESTION, NEXT_QUESTION, UNLOCK_BADGE, COMPLETE_PHASE, TOGGLE_AUDIO, RESET_SESSION`.

Key state: `phase, storyPanel, simStation, simCompleted[4], mode, worldIdx, questionIdx, questions, worldResults[10], xp, streak, bestStreak, lives, hintsUsed, attempts, badges[], audioEnabled, journeyComplete`.

Rules:
- **Panel end check:** `if (state.storyPanel >= STORY_PANELS.length - 1)` → advance to Simulate. Never a literal.
- **World/question maths** stays `Math.floor(nextQ / 10)` (10×10).
- **Streak** increments on `ANSWER_CORRECT`, resets on `ANSWER_INCORRECT`; `bestStreak = max(bestStreak, streak)`. Never derive it from stars (reference bug).
- **World unlock:** world *n* unlocks when world *n−1* has ≥ 1★ (reference behaviour; world 0 always open) — see PRD open item; make the rule a single constant/function so it is easy to change.
- `RESET_SESSION` on Home/Restart clears progress (reference behaviour), but Home must confirm if any world has stars, to prevent accidental wipes on the Close/Home buttons.

---

## 5. Component Specs

- **TopNav** — clone from reference; add `ref` + `useHeaderHeight` (§10). Story progress bar row stays inside the header; because height is now measured, no clipping.
- **WonderPhase** — hook per PRD §7.1: an `AngleVisual` `type="road-sign"` showing a lamp-post-occluded angle, "132° + ? = 180°" style callout, Tally speech bubble. `BgSymbols` re-skinned: `∠`, `180°`, `360°`, `x = 48°`, `⊥`, `⟂`, protractor arcs.
- **StoryPhase** — reference carousel, 6 panels. Panel image = `/assets/story/story_N.png` with `imageBg`/`imageEmoji` fallback if the image 404s.
- **SimulatePhase** — reference 2-column shell; `STATIONS` (4) with lock icon → ✅ on completion; footer "Next Station" enabled only when the current station is complete (or previously completed); final CTA "Go to Practice" enabled when all 4 done (badge trigger). Sidebar tabs remain freely clickable (reference behaviour) but the CTA is gated.
- **PlayPhase** — mode picker (4 modes, table in PRD §5) → world map → quiz. Guided shows hint1 then hint2; Timed uses a 60 s countdown (mode-level); Boss uses 3 lives with `BossBattleModal`. `PlayPhase` imports `DISTRICTS` from `data/questionBank.js` (kept name for compatibility).
- **QuestionRenderer** — renders question text, `AngleVisual` (`compact` in Play), 4 options, rule pill (reference "REWIND RULE" pill → shows the concept name, never the answer's reason), feedback overlay with `explanation`.
- **ReflectPhase** — (1) 3-question recap, (2) scorecard (XP / ⭐ n/30 / best streak / badges), (3) reflection textarea (min 10 chars, reference behaviour), (4) confetti + celebration screen. Recap items in §5.1.

### 5.1 Reflect recap (targets the 180°/360°/vertically-opposite confusion — same misconception as Station D)
1. *"Three angles sit side by side along a straight line. What must they add up to?"* → **180°** / 360° / 90° / 270°.
2. *"Two straight lines cross and one angle is 65°. Which angles are equal to each other?"* → **The 65° angle and the angle directly opposite it** / The 65° angle and an angle next to it / All four angles / None of them.
3. *"Four angles meet at a point: 100°, 80°, 70° and x. Wei Jie writes x = 180° − 250°. What is wrong?"* → **He should have used 360°, because the angles are at a point** / He should have added, not subtracted / He should have used 90° / Nothing is wrong.

---

## 6. Data Layer

### 6.1 `config/worlds.config.js`
Ten entries, shape `{ id, name, emoji, accent, description, conceptFocus, boss: { name, emoji, reward } }`, populated verbatim from PRD §8. Export `WORLDS`.

### 6.2 `config/characters.config.js`
```js
export const CHARACTERS = {
  amirah: { name: 'Amirah',  role: 'Junior Detective', emoji: '👧', colour: '#f472b6', mascotEmoji: '🦉' },
  weijie: { name: 'Wei Jie', role: 'Junior Detective', emoji: '👦', colour: '#38bdf8', mascotEmoji: '🦉' },
  tally:  { name: 'Tally the Owl', role: 'Inspector', emoji: '🦉', colour: '#facc15', mascotEmoji: '🦉' },
};
export const MASCOT = { name: 'Tally', emoji: '🦉' };
```

### 6.3 `data/storyContent.js`
`STORY_PANELS` — **length 6**, titles/concepts per PRD §7.2, shape `{ panel, title, text, highlight, character, characterEmoji, imageBg, imageEmoji, image?, bubble? }`. `highlight` carries the reference's "quote" line (e.g. panel 3: "Angles on a straight line add up to 180 degrees."). Body text must obey the narration term rules (PRD §10) — on-screen may show `°`/`∠`, but every string must have a spoken equivalent in `narration.js` that reads them in words.

### 6.4 `utils/angleMath.js` — single source of maths truth
Pure functions used by the generator **and** by Stations A–D.

```js
export const STEP = 5;                                   // clean-number granularity
export const isClean = a => Number.isInteger(a) && a % STEP === 0 && a >= 5 && a <= 355;
export const supplement  = a => 180 - a;
export const complement  = a => 90 - a;
export const remainder360 = list => 360 - list.reduce((s, x) => s + x, 0);
export const EQUAL_PART_COUNTS = [3, 4, 6, 8, 9, 12, 18, 24];   // 360/n is a multiple of 5
export const equalPart = n => 360 / n;

export const REASONS = {
  line:    'adjacent angles on a straight line',
  point:   'angles at a point',
  vertOpp: 'vertically opposite angles',
};

// Generators take a seeded rng (utils/rng.js) and return geometrically consistent data.
export function genLineSet(rng, n, minAngle = 10) { /* n clean angles, each ≥ minAngle, Σ = 180 */ }
export function genPointSet(rng, n, minAngle = 20, maxAngle = 170) { /* n clean angles, Σ = 360 */ }
export function genIntersection(rng) {
  // a + b = 180, a ≠ b (so a ≠ 90), both clean. Cyclic angles = [a, b, a, b].
  // Vertically opposite pairs: (0,2) and (1,3). Adjacent pairs supplementary.
  // returns { a, b, angles:[a,b,a,b], vertPairs:[[0,2],[1,3]] }
}
export function validateLineSet(angles)  { return angles.every(isClean) && sum(angles) === 180; }
export function validatePointSet(angles) { return angles.every(isClean) && sum(angles) === 360; }
export function validateIntersection({ angles, vertPairs }) {
  const [a, b, c, d] = angles;
  return angles.every(isClean) && a === c && b === d && a + b === 180 && sum(angles) === 360;
}
export function makeDistractors(correct, misconceptions, rng, count = 3) {
  // dedupe; drop values equal to correct, non-integer, ≤ 0 or ≥ 360; top up with correct ± 5k until 'count'
}
```
**Hard rules:** (1) all displayed angles are multiples of 5°; (2) no unknown is 0° or 180°; (3) an intersection is generated **from `a` and `b`, never from four independent numbers**, so vertically-opposite equality holds by construction *and* is asserted by `validateIntersection`; (4) `EQUAL_PART_COUNTS` is the only source of "n equal parts" values.

### 6.5 `data/questionBank.js`
Exports: `generateBank(seed)` → 100 questions; `questionBank` (generated once per session with a fresh seed); `DISTRICTS` derived from `WORLDS` as `{ id, name, icon, boss }`. Schema (fixed): `{ id, districtId, category, visual, questionText, options[4], correctAnswer, explanation, hint1, hint2, visualData }`.

Per-world templates (each ≥ 2 template functions; a world's 10 questions must have 10 distinct `questionText`s):

| World | Templates | Misconception distractors |
|---|---|---|
| 0 Angle Alley | classify a measured angle (acute/right/obtuse/straight/reflex); vertex of ∠PQR; read protractor (inner vs outer scale) | boundary values (90°, 180°) mis-typed; vertex = first/last letter; protractor: `180 − x` |
| 1 Straight Street | `x = 180 − a` (diagram or words) | `90 − a` (complement), `360 − a`, `a` itself, `180 − a ± 10` |
| 2 Split-Lane | 3–4 angles on a line, one unknown | `360 − Σ`, `180 − (Σ without one term)`, `Σ` |
| 3 Compass Point | 3–4 angles at a point, one unknown | `180 − Σ` (only if > 0), omit one known angle, `Σ` |
| 4 Mirror Crossroads | vertically opposite value; adjacent-on-a-line value; "which pair is equal" | `180 − a`, `90 − a`, `360 − a`, `2a` |
| 5 Rule Detective | which property justifies a step (3 reasons + one non-syllabus foil e.g. "angles in a triangle"); which total applies (180/360) | the two other rules; swapped totals |
| 6 Double Trouble | intersection with one given angle, ask for a named other angle; three angles at a point where two are vertically opposite | vertical/adjacent swapped; `360 − a`; sum of the wrong pair |
| 7 Blueprint Bay | roof truss / signpost / kite frame / road-sign word problems mapped onto line, point or intersection structures | same as worlds 1–4, wrapped in context |
| 8 Clockwork Corner | n equal spokes/blades/slices (`360/n`); clock hands at whole hours (`30 × h`, reduced to the smaller angle only if the question says "smaller angle") ; sector remainder | `180/n`, `n × 30` misread, `360 − answer` |
| 9 Grand Finale | weighted draw from worlds 0–8 templates; plus 2 simple-algebra items (e.g. `(2x + 10)°` opposite `50°`, integer x) | as source template |

Each question fills: `explanation` (states the value **and** the property, using `REASONS` full phrases), `hint1` (names the property/first step), `hint2` (shows the arithmetic with the numbers), `visualData` (see §6.6). Seeded PRNG (`utils/rng.js`, mulberry32) so the stress test is reproducible; runtime uses a random seed.

### 6.6 `shared/AngleVisual.jsx`
`<AngleVisual type data compact />`, pure SVG, `viewBox="0 0 320 220"`, colours from CSS variables only. Angles are drawn with 0° pointing right, counter-clockwise, converted via `angleToPoint(cx, cy, r, deg)` (`y = cy − r·sin`).

| `type` | `data` | Renders |
|---|---|---|
| `angle-type` | `{ deg }` | one angle with arc + label |
| `line-angles` | `{ angles:[…], unknownIdx, labels }` | horizontal line, rays from a point on it, arcs + degree labels, unknown as **x** |
| `point-angles` | `{ angles:[…], unknownIdx }` | rays from a vertex at cumulative angles |
| `intersection` | `{ a, b, unknown:'a'|'b'|'c'|'d', givenIdx }` | two crossing lines, four labelled regions |
| `road-sign`, `roof-truss`, `bike-wheel`, `clock`, `fan`, `pie` | context-specific | simple illustrative SVGs reusing the same arc helper |

Every angle region carries a **text degree label** (or "x"/"?"), never colour alone. `compact` reduces stroke/label size for the Play inline context.

---

## 7. Simulate Station Specs

Contract (all four): `<Station onComplete={fn} audioEnabled={bool} />`; self-contained state; SVG visuals styled with CSS variables; a `station-success` panel with a **"Complete Station ✓"** button calling `onComplete`; every drag control paired with keyboard-operable −/+ buttons (and `←/→` on the focused handle, `Shift` = ±15°). Pointer maths must use `getScreenCTM().inverse()` so it is correct inside the scaled/flex layout.

**A · `ProtractorWorkshop` (Concept Discovery).** A fixed straight line with a vertex; a draggable ray (0–180°). Two arcs (left/right) colour-coded with live labels and a running readout `left + right = 180`. State: `angle`, `distinctPositions:Set` (positions bucketed to 15°), `confirmed`. Gate: ≥ 3 distinct buckets **and** the confirmation MCQ answered correctly ("Why do the two angles always add up to 180 degrees?" → "Together they make a straight angle"). Wrong answer → Msg + retry, no penalty.

**B · `MatchTheMissingAngle` (Build-to-Target).** A generated case (line set 2–3 angles, or point set 3–4) with one unknown angle controlled by a slider (5° steps, plus −/+). Live: unknown arc resizes, readout `known + slider = total`, ring turns amber within ±10°, green at exact match; "Check" accepts exact only (tolerance is visual guidance, not acceptance). Gate: 3 successful cases (2 line + 1 point, then random), each after a "New case" press.

**C · `IntersectionPuzzle` (Composite).** `genIntersection`; one angle shown; the other three are tap targets opening a small picker of 4 candidates (correct + supplement/complement/360-based distractors). Correct fills the region green and shows its reason chip ("vertically opposite angles" or "adjacent angles on a straight line"). Wrong → shake + hint. Gate: all three filled in a round, **two rounds** completed, and in each round the student must have used both reasons (the UI tracks which reason each fill implied; the second reason is only offered as the chip label, the student picks the value).

**D · `CaseFileDetective` (Error-Detective).** A 4-line worked solution card (given / rule / calculation / answer) with exactly one seeded error chosen from a table of realistic slips: `180↔360 swap`, `sum arithmetic slip (190)`, `vertical vs adjacent misidentified`, `forgot an angle at the point`. Student taps the faulty line, then chooses the corrected line from 3 options. Gate: 3 cases, each a different error type. Seeds come from `angleMath` so the "wrong" line is always genuinely wrong and the corrected line genuinely right (assert in tests).

`SimulatePhase` wires the four in `STATIONS` and gates the phase CTA on `simCompleted.every(Boolean)`; `COMPLETE_SIM_STATION` dispatches the reducer action.

---

## 8. Audio Pipeline

### 8.1 Mechanics (from reference, minus the fallback)
`utils/audio.js`: keep `VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2'`, `MODEL_ID = 'eleven_multilingual_v2'`, six style presets (`statement`, `instruction`, `question`, `encouragement`, `emphasis`, `thinking`, `celebration` per reference keys — stability/similarity/style/speaker-boost only), `getAudioUrl` (static map → dynamic fetch, cached), `warmStatic`, the queue with next-segment preload, `setMuted`, `stopNarration`. **Delete** `pickVoice`, `ttsVoice`, `speakFallback`, `speechSynthesis` references and the `rate`/`pitch` fields. If `url` is null or playback fails, `narrate` simply continues to the next segment / returns silently.

### 8.2 `utils/narration.js`
Function bodies rewritten for AngleQuest; export the blueprint's names: `wonderNarration`, `storyNarration(panel)`, `simStationIntro(stationIdx)`, `playQuestionNarration`, `playCorrectNarration`, `playWrongNarration`, `playHint1Narration`, `playHint2Narration`, `districtCompleteNarration`, `bossStartNarration`, `bossWinNarration`, `reflectNarration`, `reflectCompleteNarration`, plus `getAllNarration()`. (Reference names such as `getStoryNarration`, `simulateIntro`, `practiceCorrectNarration` are renamed; keep no aliases.)

**Number/symbol rendering:** a `speak(text)` helper converts on-screen strings to spoken form before they reach ElevenLabs *and* the audio map key: `65°` → "sixty-five degrees"; `∠ABC` → "angle A B C"; `x = 48` → "x equals forty-eight"; `−` → "minus"; `=` → "equals"; textbook reason shorthand never appears in narrated strings — only the full `REASONS` phrases. Numbers up to 360 are spelled by a small `numberToWords` helper. Titles/labels are not narrated (reference rule).

### 8.3 Generation
`generate_audio.js` keeps the reference design (`phrases = [...getAllNarration(), ...EXTRA_PHRASES]`, 500 ms rate limit, skip existing unless `--force`, rewrites `audioMap.js`). Question text and explanations are **dynamic** (procedural) and go through `getAudioUrl`'s live path; everything else is pre-generated. Run `npm run generate-audio` then `npm run clean-audio` after content lock.

### 8.4 Key handling
`VITE_ELEVENLABS_API_KEY` is embedded in the client bundle when set. Ship `.env.local.example` with the variable and **no real key**. For production, prefer the reference's proxy path: implement `/api/elevenlabs` as a serverless function that holds the key, and leave the client variable unset (see R3).

---

## 9. Gamification

- `utils/scoring.js`: `calcStars(correct)` → 9–10 → 3, 7–8 → 2, 5–6 → 1, else 0. `calcXP({ attempts, hintsUsed, streak })` — the blueprint says "reuse as-is" from the G2 reference, which was not among the supplied files and the supplied reference has no XP formula. **Copy `scoring.js` from `G2-Money-Money-main` verbatim when available.** Placeholder if not: `base 10 − 3×(attempts−1) − 2×hintsUsed`, floor 2, plus `+2` for every streak ≥ 3 (capped at +10).
- `utils/badgeEngine.js`: `checkBadges(state)` with the 8 triggers, `BADGES` display strings from PRD §9. Trigger keys: `first_correct`, `streak_5`, `streak_10`, `sim_all`, `world_3star`, `boss_won`, `answered_20`, `journey_complete`. `UNLOCK_BADGE` fires once per badge; a toast reuses `FeedbackOverlay`.
- Boss Battle: 5 questions, 3 lives, per world; on win award world reward badge (name from `WORLDS[i].boss.reward`) in addition to trigger #6.
- Reflect scorecard uses `Stars n / 30`.

---

## 10. Design Tokens & Viewport

`styles/design-tokens.css` — move the reference's `:root` tokens unchanged (cosmic background, glass tokens, phase colours, fluid `--space-*` and `--fs-*` clamps). Add:
```css
:root {
  --world-0:#f472b6; --world-1:#fb923c; --world-2:#fbbf24; --world-3:#4ade80; --world-4:#38bdf8;
  --world-5:#818cf8; --world-6:#c084fc; --world-7:#22d3ee; --world-8:#facc15; --world-9:#f43f5e;
  --header-h: 56px;                 /* overwritten at runtime by useHeaderHeight */
  --angle-arc-a:#38bdf8; --angle-arc-b:#fb923c; --angle-known:#facc15; --angle-unknown:#f43f5e; --angle-ok:#4ade80;
}
```
**Viewport fix (mandatory):**
```css
html, body, #root { height: 100%; margin: 0; }
body, .app-container { height: 100vh; height: 100dvh; max-height: 100dvh; overflow: hidden; }
main { padding-top: var(--header-h); }              /* replaces Tailwind pt-12 */
.sim-card, .reflect-card { max-height: calc(100dvh - var(--header-h) - 16px); }
```
```js
// core/hooks/useHeaderHeight.js
export function useHeaderHeight(ref) {
  useEffect(() => {
    if (!ref.current) return;
    const set = () => document.documentElement.style.setProperty('--header-h', `${ref.current.offsetHeight}px`);
    set();
    const ro = new ResizeObserver(set); ro.observe(ref.current);
    return () => ro.disconnect();
  }, [ref]);
}
```
Intro screen (no header) sets `--header-h: 0px`. Replace `max-h-[94vh]` with `94dvh`-based classes; delete the `zoom` rule and replace the short-viewport media query (`max-height: 800px`) with token-driven padding/font reductions only. Keep inner scroll containers (`overflow-y-auto`) inside cards so nothing is ever unreachable on short or mobile viewports. Add `viewport-fit=cover` to the viewport meta tag. Test viewports: 1366×768, 1440×900, 1920×1080, 1024×768 (tablet landscape), 768×1024 (tablet portrait), 390×844.

---

## 11. Build / Deploy

`npm install && npm run build` from a clean extract; deploy on Vercel (SPA rewrite). `index.html`: title "AngleQuest · Grade 7 Maths", description/OG text for the Angle Detective story (no prior-module wording, no "Zara"), favicon file actually present (the reference references `/favicon.svg` but does not ship it — add one). Fonts loaded as in reference (Fredoka One, Nunito, Inter). README: run/build/audio commands, module summary, art brief (§13) — no mention of browser speech.

---

## 12. QA Plan

1. **Bank stress test** — `scripts/stress_test_bank.js`: ≥ 300 seeds × 100 questions (30,000). Assert per question: schema complete; no `NaN`/`undefined`/empty strings; exactly 4 options, all distinct; `correctAnswer ∈ options`; every numeric angle is a multiple of 5 in range; no answer or unknown equals 0°/180°; and **geometric validity**: `validateLineSet` / `validatePointSet` / `validateIntersection` pass on each `visualData`; the stated answer equals an independent recomputation from `visualData`; per-world 10 distinct `questionText`; world 9 contains items from ≥ 5 different source worlds.
2. **Station tests** — unit-test the seeded error generator in Station D (the "wrong" line is provably wrong, the correction provably right) and Station C's option sets (one correct only).
3. **Audio parity** — every string passed to a narration helper has an exact `audioMap` match or is flagged intentionally dynamic; zero references to `speechSynthesis` (`grep`) in the built output.
4. **Journey walkthrough** — Wonder → Story (6 panels; nav bar progress 1/6…6/6; last button "Enter the Detective Lab") → Simulate (4 stations completable, CTA gated) → Practice (map, all 4 modes, Boss winnable, badges unlock, streak independent of stars) → Reflect (recap, scorecard, confetti); zero console/page errors.
5. **Viewport/regression** — at each test viewport (§10), Story (with the progress-bar row) and Simulate content are fully visible below the header; no content under the nav; drag interactions on Stations A/B hit correctly.
6. **Production build** — clean-clone `npm install && npm run build`; `npm run lint`.
7. **Accessibility** — enlarged fonts/targets in Simulate/Play; every angle region text-labelled; each slider has −/+ and arrow-key control; focus rings visible; `aria-label`s on SVG handles.

---

## 13. Delivery Checklist

- [ ] Zip excludes `node_modules/` and `dist/`.
- [ ] `public/assets/story/story_1.png … story_6.png` present as **1024×1024** placeholders; README contains a per-panel art brief (scene, Amirah / Wei Jie / Tally, mood).
- [ ] `README.md`, `index.html`, OG tags rewritten; no "Working Backwards", "Robo", "Zara" strings (`grep -ri`).
- [ ] `.env.local.example` documents `VITE_ELEVENLABS_API_KEY`; no real key committed; `.env.local` in `.gitignore`.
- [ ] `vercel.json`, `.oxlintrc.json`, favicon added.
- [ ] `audioMap.js` regenerated after content lock; `clean-audio` run.
- [ ] Stress-test output attached (pass log).

---

## 14. Risks

| # | Risk | Mitigation |
|---|---|---|
| R1 | Blueprint dependency versions (React 19, Vite 8, framer-motion 12, lucide-react 1.x, etc.) could not be verified against the registry here, and differ from the reference's tested React 18/Vite 5 stack. | Install and build on day one; if a conflict appears, pin to the reference versions and log it. |
| R2 | `calcXP` formula unavailable from supplied inputs. | Copy `scoring.js` from `G2-Money-Money-main`; placeholder in §9 is provisional. |
| R3 | ElevenLabs key exposed in the client bundle if `VITE_ELEVENLABS_API_KEY` is set in production. | Serverless proxy; unset client key. |
| R4 | SVG drag maths breaks under CSS scaling/flex layouts. | `getScreenCTM` conversion, tested at all viewports; keyboard controls are the accessible fallback. |
| R5 | Geometrically inconsistent generated diagrams (e.g. unequal "vertically opposite" angles). | Generate intersections from `(a, b)` only; validators asserted in the stress test. |
| R6 | Spoken/on-screen drift because numbers and symbols are spelled out. | Single `speak()` transform used by both narration and the audio-map key; parity check in QA step 3. |
| R7 | Multiples-of-5 pool allows pattern guessing. | PRD open item (d); `STEP` is one constant, switchable to 1 for selected worlds. |
| R8 | Home/Close buttons wipe progress (reference behaviour). | Confirmation dialog when any stars/badges exist. |
| R9 | World-unlock rule (≥ 1★ on previous world) is inherited from the reference and not specified by the blueprint. | Isolated in one function; confirm with stakeholders. |
