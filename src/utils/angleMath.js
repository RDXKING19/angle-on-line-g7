export const STEP = 5;

export const sum = arr => arr.reduce((acc, val) => acc + val, 0);

export const isClean = a => Number.isInteger(a) && a % STEP === 0 && a >= 5 && a <= 355;

export const supplement = a => 180 - a;
export const complement = a => 90 - a;
export const remainder360 = list => 360 - sum(list);

export const EQUAL_PART_COUNTS = [3, 4, 6, 8, 9, 12, 18, 24]; // 360 / n is a clean multiple of 5
export const equalPart = n => 360 / n;

export const REASONS = {
  line: 'adjacent angles on a straight line',
  point: 'angles at a point',
  vertOpp: 'vertically opposite angles',
};

/**
 * Generate n clean angles on a straight line (sum = 180, each >= minAngle)
 */
export function genLineSet(rng, n = 2, minAngle = 10) {
  for (let attempt = 0; attempt < 500; attempt++) {
    if (n === 2) {
      const minStep = Math.ceil(minAngle / STEP);
      const maxStep = Math.floor((180 - minAngle) / STEP);
      if (minStep >= maxStep) continue;
      const stepIdx = rng.int(minStep, maxStep);
      const a = stepIdx * STEP;
      const b = 180 - a;
      if (a >= minAngle && b >= minAngle && a !== 0 && b !== 0 && a !== 180 && b !== 180) {
        return [a, b];
      }
    } else if (n === 3) {
      const a = rng.int(Math.ceil(minAngle / STEP), Math.floor(100 / STEP)) * STEP;
      const rem = 180 - a;
      const b = rng.int(Math.ceil(minAngle / STEP), Math.floor((rem - minAngle) / STEP)) * STEP;
      const c = rem - b;
      if (isClean(a) && isClean(b) && isClean(c) && c >= minAngle) {
        return [a, b, c];
      }
    } else if (n === 4) {
      const a = rng.int(2, 6) * STEP;
      const b = rng.int(2, 6) * STEP;
      const c = rng.int(2, 6) * STEP;
      const d = 180 - (a + b + c);
      if (isClean(a) && isClean(b) && isClean(c) && isClean(d) && d >= minAngle) {
        return [a, b, c, d];
      }
    }
  }
  // Safe fallback
  return n === 2 ? [65, 115] : n === 3 ? [45, 60, 75] : [30, 45, 45, 60];
}

/**
 * Generate n clean angles at a point (sum = 360, each >= minAngle and <= maxAngle)
 */
export function genPointSet(rng, n = 4, minAngle = 20, maxAngle = 170) {
  for (let attempt = 0; attempt < 500; attempt++) {
    if (n === 3) {
      const a = rng.int(Math.ceil(minAngle / STEP), Math.floor(maxAngle / STEP)) * STEP;
      const rem = 360 - a;
      const b = rng.int(Math.ceil(minAngle / STEP), Math.floor(Math.min(maxAngle, rem - minAngle) / STEP)) * STEP;
      const c = rem - b;
      if (isClean(a) && isClean(b) && isClean(c) && c >= minAngle && c <= maxAngle) {
        return [a, b, c];
      }
    } else if (n === 4) {
      const a = rng.int(Math.ceil(minAngle / STEP), 24) * STEP; // 20 to 120
      const b = rng.int(Math.ceil(minAngle / STEP), 24) * STEP;
      const c = rng.int(Math.ceil(minAngle / STEP), 24) * STEP;
      const d = 360 - (a + b + c);
      if (isClean(a) && isClean(b) && isClean(c) && isClean(d) && d >= minAngle && d <= maxAngle) {
        return [a, b, c, d];
      }
    } else if (n === 5) {
      const a = rng.int(4, 16) * STEP; // 20 to 80
      const b = rng.int(4, 16) * STEP;
      const c = rng.int(4, 16) * STEP;
      const d = rng.int(4, 16) * STEP;
      const e = 360 - (a + b + c + d);
      if (isClean(a) && isClean(b) && isClean(c) && isClean(d) && isClean(e) && e >= minAngle && e <= maxAngle) {
        return [a, b, c, d, e];
      }
    }
  }
  return n === 3 ? [90, 120, 150] : [70, 85, 95, 110];
}

/**
 * Generate two intersecting lines forming 4 angles at a point.
 * a + b = 180, a != b (so a != 90), both clean.
 * Cyclic angles = [a, b, a, b].
 * Vertically opposite pairs: (0, 2) and (1, 3).
 * Adjacent pairs are supplementary.
 */
export function genIntersection(rng) {
  // Choose acute angle a in [25, 85], avoiding 90
  const acuteSteps = [5, 6, 7, 8, 9, 10, 11, 13, 14, 15, 16, 17]; // multiples of 5, 25° to 85° except 60 is fine, avoid 90
  const step = rng.pick(acuteSteps);
  const a = step * STEP;
  const b = 180 - a;
  return {
    a,
    b,
    angles: [a, b, a, b],
    vertPairs: [[0, 2], [1, 3]]
  };
}

export function validateLineSet(angles) {
  return Array.isArray(angles) && angles.length >= 2 && angles.every(isClean) && sum(angles) === 180;
}

export function validatePointSet(angles) {
  return Array.isArray(angles) && angles.length >= 3 && angles.every(isClean) && sum(angles) === 360;
}

export function validateIntersection(data) {
  if (!data || !Array.isArray(data.angles) || data.angles.length !== 4) return false;
  const [a, b, c, d] = data.angles;
  return (
    data.angles.every(isClean) &&
    a === c &&
    b === d &&
    a + b === 180 &&
    sum(data.angles) === 360 &&
    a !== 0 &&
    b !== 0 &&
    a !== 180 &&
    b !== 180
  );
}

/**
 * Deduplicate and create plausible distractors based on misconceptions
 */
export function makeDistractors(correct, misconceptions = [], rng, count = 3) {
  const seen = new Set();
  const result = [];
  const correctStr = String(correct);
  seen.add(correctStr);

  const isValidCand = val => {
    if (typeof val === 'number') {
      return Number.isInteger(val) && val > 0 && val < 360 && val !== correct;
    }
    if (typeof val === 'string') {
      return val.trim() !== '' && val !== correctStr;
    }
    return false;
  };

  for (const m of misconceptions) {
    if (isValidCand(m)) {
      const key = String(m);
      if (!seen.has(key)) {
        seen.add(key);
        result.push(m);
        if (result.length >= count) return result;
      }
    }
  }

  // If correct is a number, generate clean offsets (multiples of 5 or 10)
  if (typeof correct === 'number') {
    const offsets = [10, -10, 15, -15, 20, -20, 5, -5, 30, -30, 45, -45, 90, -90];
    const shuffledOffsets = rng ? rng.shuffle(offsets) : offsets;

    for (const d of shuffledOffsets) {
      const cand = correct + d;
      if (isValidCand(cand) && cand % STEP === 0) {
        const key = String(cand);
        if (!seen.has(key)) {
          seen.add(key);
          result.push(cand);
          if (result.length >= count) return result;
        }
      }
    }
  }

  return result.slice(0, count);
}

/**
 * Format an angle with degree symbol
 */
export function fmtAngle(deg) {
  return `${deg}°`;
}
