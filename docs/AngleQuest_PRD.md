# AngleQuest — Grade 7 · Angles on Lines and at a Point (PRD)

**Grade:** 7 (Singapore Sec 1) &nbsp;|&nbsp; **Topic:** Angles on Lines and at a Point &nbsp;|&nbsp; **Module name:** AngleQuest
**Clone source used for this build:** `working-backwards-grade7-main` (user-supplied, superseding the default `G2-Money-Money-main` reference — see the paired TRD's Reference Analysis Notes for the full diff against the documented product standard).
**Special instructions given:** none — all defaults in the blueprint apply.

---

## 1. Overview

AngleQuest is a Grade 7 module teaching the "angles formed with a common vertex" strand of the Singapore MOE geometry syllabus: angles on a straight line, angles at a point, and vertically opposite angles. Two young detectives, **Amirah** and **Wei Jie**, run a neighbourhood "Angle Detective Agency" — mentored by **Tally the Owl** (styled here as a magnifying-glass-wielding detective) — and every "case" is really a missing-angle problem hidden in an everyday scene: road junctions, roof trusses, bike wheels, clock hands, kite frames. The five-phase Wonder → Story → Simulate → Practice → Reflect journey, XP/Stars/Streak/Badge gamification, 100-question procedurally-generated bank across 10 worlds, and ElevenLabs-only narration are all inherited unchanged from the established Intellia Global product architecture (PRD blueprint §A).

## 2. Background

This module follows the same "Grade + Topic in, build-ready PRD/TRD pair out" process used for prior modules (MoneyQuest, DivisionQuest, MultiplyQuest, DecimalQuest, LineQuest, DataQuest, RatioCraft). Angles is a strong candidate for the Simulate phase's four station archetypes in particular: geometry is inherently visual, so "watch a rule reveal itself," "hit a target angle," "combine two rules in one diagram," and "spot the broken working" all map naturally onto rotating rays, protractor arcs, and intersecting lines — arguably a better fit for the archetype heuristic than the arithmetic-only topics built so far.

## 3. Standards Alignment

Singapore MOE Lower Secondary Mathematics, Geometry strand, sub-topic **"Angles formed with a common vertex"** (part of the broader "Angle properties" chapter, which also covers angles formed with parallel lines, and angle properties of triangles/quadrilaterals — both explicitly out of scope here, see §3.2). Syllabus outcomes: pupils calculate unknown angles involving (a) adjacent angles on a straight line, (b) vertically opposite angles, and (c) angles at a point, and are expected to *state the angle property used as the reason* for each step (the textbook convention abbreviates these as "adj. ∠s on a str. line," "vert. opp. ∠s," and "∠s at a pt." — narration must never use these abbreviations, see §10).

### 3.1 Precise skills in scope
- Recognise and name angle types (acute, right, obtuse, straight, reflex) and name an angle using three-letter vertex notation (e.g. ∠ABC, vertex B).
- Adjacent angles on a straight line are supplementary (sum to 180°); use this to find an unknown angle among two or more angles on a line.
- Angles at a point sum to 360°; use this to find an unknown angle among three or more angles meeting at a point.
- Vertically opposite angles (formed where two straight lines cross) are equal; use this to find an unknown angle.
- Identify *which* property applies to a given diagram and state it as the reason for a calculation.
- Combine two of the above properties within a single intersection diagram to find multiple unknowns.
- Apply all three properties to real-world structures and objects.

### 3.2 Adjacent/prerequisite skill scoped out (bridge only, not tested)
**Angles formed with parallel lines** (corresponding, alternate, co-interior angles) is the next sub-topic in the same MOE chapter and is a natural sequel module. It appears only as a one-line narrative teaser in the Story phase's closing panel ("but what happens when the lines never cross...?") and is never assessed in the question bank, Simulate stations, or Reflect recap — mirroring how CircleQuest treated circumference as a bridge into area-of-circle. Angle properties of triangles, quadrilaterals, and polygons are likewise out of scope (separate MOE sub-topics, separate future modules).

### 3.3 Domain conventions students are expected to know
- Angles are always given in degrees; the degree symbol is written in on-screen text but always spoken as "degrees" (never "°" as a symbol sound) — see §10.
- The Singapore convention of stating the angle-property reason alongside a numeric answer (e.g. "∠x = 180° − 65° = 115° (adj. ∠s on a str. line)") is reflected in every question's `explanation` field, spoken in full per §10.
- **Assumption to confirm with stakeholders:** whether students are expected to have already covered physical protractor use (drawing/measuring to the nearest degree) before this module, since a digital MCQ bank can test *calculation* but not freehand drawing accuracy — see §14(a).

## 4. Learning Objectives

By the end of this module, a student should be able to:
1. Identify angle types (acute, right, obtuse, straight, reflex) and name an angle using three-letter vertex notation.
2. Recall that adjacent angles on a straight line add up to 180° and use this to find an unknown angle.
3. Recall that angles at a point add up to 360° and use this to find an unknown angle.
4. Recall that vertically opposite angles are equal and use this to find an unknown angle.
5. Identify which of the three properties applies to a given diagram and justify the choice by stating the correct angle-property reason.
6. Calculate multiple unknown angles in a single diagram by combining two or more of these properties (e.g. two intersecting lines).
7. Apply angles-on-a-line, angles-at-a-point, and vertically-opposite-angle facts to solve real-world problems (road junctions, roof trusses, bicycle wheels, clock hands, kite frames).

This ordering (recall → single-step → comparison/reasoning → composite/multi-step → real-world) drives both the Story panel sequence (§7.2) and the world sequencing (§8).

## 5. Inherited Standards (copied verbatim from PRD blueprint §A — do not re-derive)

- **Five-phase architecture:** Wonder → Story → Simulate → Play ("Practice" in-UI) → Reflect.
- **Gamification:** XP per question (attempts/hints/streak-weighted); Stars 0–3 per world (9–10 correct = 3★, 7–8 = 2★, 5–6 = 1★, below = 0★); continuous streak tracking; 8 fixed badge triggers (relabelled, §9); Boss Battles (5 questions, 3 lives, one per world, 10 total).
- **Practice modes** (unchanged mechanics):

| Mode | Questions | Hints | Timed | Lives |
|---|---|---|---|---|
| Guided Practice | 5 | Yes | No | No |
| Independent Practice | 10 | No | No | No |
| Timed Challenge | 8 | No | Yes (60s) | No |
| Boss Battle | 5 | No | No | Yes (3) |

- **Audio:** ElevenLabs "Alice" (`Xb7hH8MSUJpSbSDYk0k2`), `eleven_multilingual_v2`, 6 style presets (statement/instruction, question, encouragement, emphasis, thinking, celebration); pre-generated static `.mp3`s via `generate_audio.js` → `audioMap.js`; dynamic ElevenLabs fetch only for procedurally-varying text; **no browser Web Speech API fallback under any circumstance** — if audio is unavailable, narration silently skips; strict 1:1 spoken/on-screen parity; all symbols/notation spoken as full natural language (topic-specific list in §10).
- **Question bank:** 10 worlds × 10 questions = 100, procedurally generated (≥300 randomized-run stress test), fixed schema (`id, districtId, category, visual, questionText, options[4], correctAnswer, explanation, hint1, hint2, visualData`), World 9 (10th, final world) always mixed review/grand finale.
- **Product standards:** React/Vite/Tailwind/Framer Motion, pixel-faithful dark glassmorphism per `design-tokens.css`, Fredoka/Nunito fonts, enlarged fonts/touch targets in Simulate/Practice, surgical reuse of every non-topic-specific reference file, zip delivery excluding `node_modules`/`dist` with placeholder story art + art-brief README.

## 6. Module Identity

- **Name:** AngleQuest (follows the `{Topic}Quest` convention; distinct from the existing "LineQuest" module).
- **Story theme:** *The Angle Detective Agency* — a neighbourhood detective setting appropriate to Sec 1's slightly older, still playful register; every world is a "case" hidden in an everyday scene (junctions, roofs, wheels, clocks).
- **Characters:** **Amirah** and **Wei Jie**, two Sec 1 students running a mini detective agency (Singaporean-multicultural naming convention, first names only, per blueprint default — no override requested).
- **Mascot:** **Tally the Owl** 🦉 (default retained), styled for this module as "Inspector Tally," wearing a magnifying-glass monocle shaped like a protractor — a light reskin, not a mascot swap, since an owl's "keen eyes / wise detective" framing fits the topic naturally.

## 7. Five-Phase Journey Detail

### 7.1 Wonder
Single hook screen: Amirah and Wei Jie are shown a photo of a bent road sign with one angle labelled and one hidden behind a lamp post — "the sign should sit at exactly 90° to the post. Is it leaning?" Wei Jie has measured one visible angle as 132°; the mystery is finding the hidden one without a protractor. Tally poses the module's driving question: *"What if you could find a hidden angle just by knowing what's next to it?"*

### 7.2 Story — 6 panels
The reference build used 8 panels because its topic spanned four distinct numeric domains (whole numbers, percentages, fractions, equations). AngleQuest has three formal rules plus a vocabulary bridge, which similarly warrants going beyond the default 4-panel count — **this module uses 6 panels.** *(Build note for the TRD: confirm the app's phase-navigation logic reads the panel count from `STORY_PANELS.length` rather than a hardcoded number — the supplied reference codebase already does this correctly, so no generalization fix should be needed here, but re-verify against whichever file is actually cloned.)*

| # | Title | Concept delivered | Narrative beat |
|---|---|---|---|
| 1 | "The Case of the Hidden Angle" | Concrete hook | Amirah and Wei Jie find a fence post problem: one angle known, the rest hidden — sets up "why angles matter." |
| 2 | "Reading the Clues" | Vocabulary bridge: angle types, 3-letter naming, protractor basics | Tally teaches how detectives label evidence: ∠ABC, vertex B, acute/right/obtuse/straight/reflex. |
| 3 | "The Straight-Line Rule" | Angles on a straight line = 180° | Worked example on the fence line: 132° + x = 180°, x = 48°. |
| 4 | "The Full-Circle Rule" | Angles at a point = 360° | Worked example at a lamp-post base where 4 paths meet. |
| 5 | "The Mirror Rule" | Vertically opposite angles are equal | Two crossing streets on the case map; introduces combining rules at one intersection. |
| 6 | "Case Closed... For Now" | Recap of all 3 rules + hand-off to Simulate; one-line teaser for parallel lines (scoped out, §3.2) | Tally hands the detectives their gear and sends them to the Detective Lab. |

### 7.3 Simulate — 4 stations (archetype heuristic)
The supplied reference build actually used a 3-station × 3-activity (9 total) Simulate layout with no per-station `onComplete` contract. This build follows the **documented 4-station standard** (PRD blueprint §B.5 / TRD §3.6) instead, while adopting the reference's proven 2-column shell (left station-tab sidebar, right activity panel, prev/next footer) and its glassmorphic "Panel / Node / tone-card" chrome kit for surrounding UI. See the TRD for the full component contract.

1. **Concept Discovery Lab — "The Protractor Workshop."** A ray rotates around a fixed vertex on an SVG protractor; as it rotates, two live arcs and a running readout ("142° + 38° = 180°") show that the two angles on either side of a point on a straight line always sum to 180°, however the ray is placed. Understanding-gated: explore at least 3 distinct rotations, then answer one confirmation question ("Why do these two angles always add up to 180°, no matter where the ray points?").
2. **Build-to-Target Challenge — "Match the Missing Angle."** Student drags a slider (with keyboard +/− controls) to set an unknown angle in a diagram (2 angles on a line, or 3–4 at a point) until the live running sum hits the target (180° or 360°), with tolerance-band color feedback and a "new case" loop before the station is markable complete.
3. **Multi-Step / Composite Construction Challenge — "The Intersection Puzzle."** Two intersecting lines form 4 angles at a point; given one angle, the student must correctly fill in the other three by applying *both* the angles-at-a-point rule and the vertically-opposite rule together — this is the module's most advanced objective (LO 6).
4. **Error-Detective — "Inspector Tally's Case File."** A fully worked angle problem contains one seeded, realistic mistake (e.g. totalling to 190° instead of 180°, or treating two adjacent angles as vertically opposite). The student locates the faulty line of working and picks the correct fix — reinforcing the most common real misconception: confusing the 180°-on-a-line rule with the 360°-at-a-point rule, or misidentifying which angle pairs are actually vertically opposite.

### 7.4 Play / Practice
Unchanged mechanics (§5): World Map of 10 worlds, 4 selectable modes, Boss Battle per world.

### 7.5 Reflect
3-question conceptual recap quiz (targeting the most-often-misunderstood distinction — 180°-on-a-line vs. 360°-at-a-point vs. vertically-opposite, the same misconception the Error-Detective station targets), scorecard summary (Total XP / Stars out of 30 / Best Streak), and an open reflection prompt to Tally ("Dear Tally, angles at a point add up to 360° because...").

## 8. World & Question Bank Table

10 worlds, foundational → applied; **World 9 (10th, final) is the mixed-review/grand-finale world**, per standard.

| id | Name | Emoji | Accent | conceptFocus | Description | Boss (name · emoji · reward badge) |
|---|---|---|---|---|---|---|
| 0 | Angle Alley | 🔎 | `#f472b6` | `angle-types-naming` | Identify angle types and name angles with vertex notation. | The Mislabeler 🎭 · "Notation Nabbed" |
| 1 | Straight Street | 🛣️ | `#fb923c` | `angles-on-a-line-simple` | Two angles on a straight line, find the unknown (180°). | Loose Ends Lenny 📐 · "Straight-Line Sleuth" |
| 2 | Split-Lane Street | 🚦 | `#fbbf24` | `angles-on-a-line-multi` | Three or more angles on a straight line (180°, more terms). | The Overcounter ➕ · "Sum Detective" |
| 3 | Compass Point Plaza | 🧭 | `#4ade80` | `angles-at-a-point` | Several angles meeting at a point (360°). | Point Blank Pete 🧭 · "360 Specialist" |
| 4 | Mirror Crossroads | 🪞 | `#38bdf8` | `vertically-opposite` | Two intersecting lines; vertically opposite angles are equal. | The Copycat Con 🪞 · "Mirror Match Master" |
| 5 | Rule Detective HQ | 🕵️ | `#818cf8` | `rule-identification` | Identify + justify which of the three rules applies. | Rule Breaker Rita 📋 · "Rule Whisperer" |
| 6 | Double Trouble Intersection | ✖️ | `#c084fc` | `composite-intersection` | Combine angles-at-a-point + vertically-opposite in one diagram. | The Tangler ✖️ · "Intersection Ace" |
| 7 | Blueprint Bay | 🏗️ | `#22d3ee` | `real-world-structures` | Real-world word problems: roof trusses, bike spokes, kite frames, road signs. | The Roof Wrecker 🏗️ · "Blueprint Boss" |
| 8 | Clockwork Corner | ⏰ | `#facc15` | `real-world-circular` | Real-world word problems: clock hands, ceiling fans, pie-slice diagrams. | Tick-Tock Trickster ⏰ · "Clockwork Cracked" |
| 9 | Grand Junction Finale | 🏆 | `#f43f5e` | `mixed-review` | Hardest boss; mixes every question type from worlds 0–8. | The Grand Illusionist 🎩 · "Case File: CLOSED" |

**Sample questions** (illustrative only, not the full 100):

- **World 0:** "In ∠PQR, which point is the vertex?" → P / **Q** / R / Cannot tell. *The middle letter of a three-letter angle name is always the vertex.*
- **World 1:** "Two angles lie on a straight line. One is 65°. Find the other." → **115°** / 65° / 25° / 135°. *180° − 65° = 115° (adj. angles on a straight line).*
- **World 3:** "Four angles meet at a point: 90°, 85°, 110°, and x. Find x." → **75°** / 65° / 85° / 95°. *360° − (90+85+110)° = 75° (angles at a point).*
- **World 4:** "Two straight lines cross. One angle is 48°. Find its vertically opposite angle." → **48°** / 132° / 90° / 42°. *Vertically opposite angles are always equal.*
- **World 6:** "Two straight lines cross. One angle is 72°. Find the angle adjacent to it on the same straight line." → **108°** / 72° / 18° / 138°. *180° − 72° = 108°; note the angle vertically opposite the 72° angle is also 72°.*
- **World 8:** "A ceiling fan has 3 equally spaced blades meeting at the centre. What angle does each blade make with the next?" → **120°** / 90° / 180° / 60°. *360° ÷ 3 = 120°.*

**Clean-number / geometric-validity constraint (hard rule, carried into the TRD's generation logic):** generated angle values are positive integers, multiples of 5°, avoiding degenerate unknowns (0° or 180°). Critically — because "angles at a point" and "vertically opposite" sets are *definitional geometric identities* and not just arithmetic sums, the generator must enforce true geometric consistency, not only correct totals: a "vertically opposite" pair must be generated as a genuinely equal pair (not two numbers that happen to match), and an "angles at a point" set built from two intersecting lines must simultaneously satisfy both the 360°-at-a-point sum *and* the pairwise vertically-opposite and adjacent-supplementary relationships. This is a stronger requirement than a typical "clean number" pool and should be a dedicated validator in `angleMath.js`, not an inline check.

## 9. Gamification Naming (8 fixed triggers, relabelled)

| Trigger (fixed) | Badge name |
|---|---|
| First correct answer | First Clue Cracked 🔍 |
| 5-answer streak | Hot on the Trail 🔥 |
| 10-answer streak | Master Detective Streak 🕵️‍♀️ |
| All 4 Simulate stations complete | Fully Equipped Investigator 🧰 |
| Any world scores 3 stars | Case Closed! ⭐⭐⭐ |
| Any Boss Battle won | Boss Angle Busted 🏆 |
| 20+ questions answered in Practice | Persistent Protractor 📐 |
| Full 5-phase journey complete | Chief Angle Detective 🎖️ |

## 10. Audio & Narration Content Rules

Topic-specific terms that must always be spoken in full, never as symbols/abbreviations/digits-only (per the universal rule in §5):
- "degrees" — never the "°" symbol sound.
- "angle" — never "∠".
- A three-letter angle name is spoken as its individual letters with the word "angle" first, e.g. "angle A B C" — never mashed together.
- "vertex" — spoken in full, never shortened.
- "vertically opposite angles" — always the full phrase, never the textbook shorthand "vert. opp. angles."
- "adjacent angles on a straight line" — always the full phrase, never "adj. angles on a straight line" or the textbook shorthand "adj. ∠s on a str. line."
- "angles at a point" — always the full phrase, never the textbook shorthand "∠s at a pt."
- "reflex angle" — spoken in full, never abbreviated.
- "x equals" — never "x=" read as symbols.

## 11. Accessibility

- Enlarged fonts and touch targets in Simulate and Practice, per the age-calibration standard (Sec 1 students need less enlargement than the lower-primary modules built so far, but touch targets on the protractor-ray and slider interactions must still comfortably exceed standard tap-target minimums).
- Every angle diagram must carry an explicit numeric degree label on each region — colour is never the only way an angle's identity or value is communicated (relevant here specifically because Simulate stations use tone-coded arcs/regions).
- Every slider/drag interaction (protractor-ray rotation, angle-matching slider) exposes explicit keyboard +/− increment controls, not drag-only.

## 12. Assets Required

6 story images at **1024×1024 PNG** (matching the supplied reference's actual shipped dimensions), one per Story panel (§7.2). Art-brief README must describe each panel's required scene, characters (Amirah, Wei Jie, Tally the Owl), and mood — e.g. Panel 3 ("The Straight-Line Rule"): a fence line along a footpath, one angle marked 132°, Tally pointing at the unmarked side with a magnifying glass, warm late-afternoon lighting.

## 13. Success Metrics / Acceptance Criteria

In addition to the fixed criteria (bank stress test, audio parity, clean build, full walkthrough):
- **Geometric validity**, not just arithmetic correctness, of every generated "angles at a point" and "vertically opposite" question set (§8's clean-number rule) — verified in the ≥300-run stress test with an explicit assertion, not just schema/NaN checks.
- All 4 Simulate stations are genuinely interactive SVG-based angle diagrams (not static images with a button), each satisfying its own completion gate.
- The Reflect recap's 3 questions correctly target the 180°-vs-360°-vs-vertically-opposite distinction identified as the module's core misconception.

## 14. Assumptions & Open Questions

(a) **To confirm with stakeholders:** whether students are assumed to have already practised physical protractor use (drawing/measuring to the nearest degree) elsewhere in the curriculum, since this digital module can test calculation via the Concept Discovery Lab's rotating-ray tool but cannot assess freehand drawing accuracy.
(b) Character names (Amirah, Wei Jie) and the Tally-the-Owl-as-detective mascot treatment are proposed defaults per blueprint convention, not yet stakeholder-approved.
(c) "Angles formed with parallel lines" (corresponding/alternate/co-interior) is deliberately scoped out as a one-line bridge teaser only (§3.2, §7.2 panel 6) and is a strong candidate for the next module in this strand (working name: ParallelQuest or TransversalQuest).
(d) The multiples-of-5° "clean number" granularity (§8) should be confirmed against what stakeholders consider appropriate difficulty for Sec 1 — a finer-grained (non-round) pool would reduce the chance of students pattern-matching to "nice" numbers instead of genuinely calculating.
(e) The supplied reference build's Reflect phase had no 3-question recap quiz (open reflection only) and no badge system at all — both are treated here as non-negotiable, already-established product standard per PRD blueprint §A rather than optional additions; flagged here only for visibility, not because they're in doubt.
