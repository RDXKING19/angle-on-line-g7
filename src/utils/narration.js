import { say, ask, cheer, emphasize, think, instruct, celebrate } from './audio.js';

/* ---------------------------------------------------- number & symbol to words */
const ONES = [
  '', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
  'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen',
  'seventeen', 'eighteen', 'nineteen'
];

const TENS = [
  '', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'
];

export function numberToWords(n) {
  const num = parseInt(n, 10);
  if (isNaN(num)) return n;
  if (num === 0) return 'zero';
  if (num < 0) return 'minus ' + numberToWords(Math.abs(num));

  if (num < 20) return ONES[num];
  if (num < 100) {
    const rem = num % 10;
    return TENS[Math.floor(num / 10)] + (rem ? '-' + ONES[rem] : '');
  }
  if (num < 1000) {
    const rem = num % 100;
    return ONES[Math.floor(num / 100)] + ' hundred' + (rem ? ' and ' + numberToWords(rem) : '');
  }
  return String(num);
}

/**
 * Transforms on-screen mathematical/angle notation into natural spoken words.
 */
export function speak(text) {
  if (!text) return '';
  let s = String(text);

  // Abbreviations to full spoken phrases (PRD §10)
  s = s.replace(/adj\.?\s*∠?s?\s*on\s*a\s*str\.?\s*line/gi, 'adjacent angles on a straight line');
  s = s.replace(/vert\.?\s*opp\.?\s*∠?s?/gi, 'vertically opposite angles');
  s = s.replace(/∠?s?\s*at\s*a\s*pt\.?/gi, 'angles at a point');

  // Angle notation ∠ABC -> angle A B C
  s = s.replace(/∠([A-Za-z]{3})/g, (_, letters) => `angle ${letters.split('').join(' ')}`);
  s = s.replace(/∠([A-Za-z])/g, 'angle $1');

  // Degree notation 48° -> forty-eight degrees
  s = s.replace(/(\d+)°/g, (_, num) => `${numberToWords(num)} degrees`);
  s = s.replace(/°/g, ' degrees');

  // Equations x = 48 -> x equals forty-eight
  s = s.replace(/x\s*=\s*(\d+)/g, (_, num) => `x equals ${numberToWords(num)}`);

  return s;
}

/* ------------------------------------------------------------ 01 · WONDER */
export function wonderNarration() {
  return [
    say(
      'Amirah and Wei Jie inspect a bent road sign leaning against a lamppost. The sign should sit at exactly ninety degrees, but one visible angle measures one hundred and thirty-two degrees.'
    ),
    ask(
      'What if you could find a hidden angle just by knowing what is next to it?'
    )
  ];
}

/* ------------------------------------------------------------- 02 · STORY */
const STORY = [
  // Panel 1: The Case of the Hidden Angle
  [
    say(
      'At the Angle Detective Agency, Amirah and Wei Jie find their first case: a fence post with one angle marked one hundred and thirty-two degrees, while the other angle is hidden behind a beam.'
    ),
    emphasize(
      'Detectives do not need to guess! Geometric rules allow us to calculate hidden angles with absolute certainty.'
    )
  ],
  // Panel 2: Reading the Clues
  [
    instruct(
      'Inspector Tally shows the detectives how to label evidence accurately. In angle A B C, the middle letter B is always the vertex where two rays meet.'
    ),
    emphasize(
      'Acute angles are less than ninety degrees, obtuse are between ninety and one hundred and eighty, and reflex angles exceed one hundred and eighty degrees.'
    )
  ],
  // Panel 3: The Straight-Line Rule
  [
    say(
      'Look closely at the fence line! Adjacent angles on a straight line always form a straight angle and add up to one hundred and eighty degrees.'
    ),
    emphasize(
      'To find the hidden angle x, subtract one hundred and thirty-two from one hundred and eighty. x equals forty-eight degrees!'
    )
  ],
  // Panel 4: The Full-Circle Rule
  [
    say(
      'At the base of the plaza lamppost, four paths branch out in all directions around a single central point.'
    ),
    emphasize(
      'Angles at a point make one full turn, so they always add up to three hundred and sixty degrees.'
    )
  ],
  // Panel 5: The Mirror Rule
  [
    say(
      'When two straight streets cross on the neighborhood map, they form four angles meeting at an intersection.'
    ),
    emphasize(
      'The angles facing each other across the vertex are vertically opposite angles, and vertically opposite angles are always equal!'
    )
  ],
  // Panel 6: Case Closed... For Now
  [
    celebrate(
      'Outstanding work, detectives! You have mastered straight line angles, angles at a point, and vertically opposite angles.'
    ),
    say(
      'Inspector Tally hands you your detective gear. Step into the Detective Lab to test your skills!'
    )
  ]
];

export function storyNarration(panelIdx) {
  return STORY[panelIdx] || [];
}

/* ---------------------------------------------------------- 03 · SIMULATE */
const SIM_INTROS = [
  instruct(
    'Rotate the ray across the straight line. Notice how the two adjacent angles always add up to exactly one hundred and eighty degrees, no matter where the ray points!'
  ),
  instruct(
    'Adjust the slider to find the missing angle until the total reaches our target of one hundred and eighty or three hundred and sixty degrees.'
  ),
  instruct(
    'Two straight lines intersect to form four angles. Use vertically opposite angles and straight line rules to uncover all three missing angles!'
  ),
  instruct(
    'Drag the rays around the central vertex. Notice how all the angle sectors together always make a complete turn of three hundred and sixty degrees!'
  )
];

export function simStationIntro(stationIdx) {
  const intro = SIM_INTROS[stationIdx];
  return intro ? [intro] : [];
}

/* ---------------------------------------------------------- 04 · PRACTICE */
export function playQuestionNarration(q) {
  if (!q || !q.questionText) return [];
  return [ask(speak(q.questionText))];
}

const PRACTICE_CORRECT = [
  'Case solved! Excellent geometric reasoning!',
  'Brilliant clue cracked! Right on target!',
  'Outstanding deduction! That angle is spot on!',
  'Splendid detective work!'
];

const PRACTICE_WRONG = [
  'Not quite! Check the angle property and try again.',
  'Careful detective! Remember your straight line and point rules.',
  'Almost! Look closely at which angle property applies here.'
];

export function playCorrectNarration(n = 0) {
  return [cheer(PRACTICE_CORRECT[n % PRACTICE_CORRECT.length])];
}

export function playWrongNarration(n = 0) {
  return [instruct(PRACTICE_WRONG[n % PRACTICE_WRONG.length])];
}

export function playHint1Narration(text) {
  return [think(speak(text || 'Identify which angle property applies to this diagram.'))];
}

export function playHint2Narration(text) {
  return [instruct(speak(text || 'Set up the equation using one hundred and eighty or three hundred and sixty degrees.'))];
}

export function districtCompleteNarration(districtName) {
  return [celebrate(`Fantastic job! You cracked the case in ${districtName}!`)];
}

export function bossStartNarration(bossName) {
  return [emphasize(`A notorious suspect has appeared: ${bossName}! Solve five cases with three lives to bust this boss!`)];
}

export function bossWinNarration(bossName) {
  return [celebrate(`Victory! You have outsmarted ${bossName} and restored order to the Angle Detective Agency!`)];
}

/* ------------------------------------------------------------ 05 · REFLECT */
export function reflectNarration() {
  return [
    think(
      'Welcome to the Detective Debrief! Complete the conceptual recap quiz and explain what you discovered to Inspector Tally.'
    )
  ];
}

export function reflectCompleteNarration() {
  return [
    celebrate(
      'Outstanding debrief! You are now officially recognized as a Chief Angle Detective!'
    )
  ];
}

/* ---------------------------------------------- everything, for the generator */
export function getAllNarration() {
  const all = [
    ...wonderNarration(),
    ...STORY.flat(),
    ...SIM_INTROS,
    ...PRACTICE_CORRECT.map(t => cheer(t)),
    ...PRACTICE_WRONG.map(t => instruct(t)),
    ...reflectNarration(),
    ...reflectCompleteNarration()
  ];
  const seen = new Set();
  return all.filter(seg => (seen.has(seg.text) ? false : seen.add(seg.text)));
}
