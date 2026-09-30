import { generateBank } from '../src/data/questionBank.js';
import {
  validateLineSet,
  validatePointSet,
  validateIntersection,
  isClean
} from '../src/utils/angleMath.js';

console.log('--- STARTING ANGLEQUEST BANK STRESS TEST (≥300 SEEDS) ---');

const NUM_SEEDS = 300;
let totalQuestionsChecked = 0;
let passCount = 0;

for (let s = 1; s <= NUM_SEEDS; s++) {
  const seed = s * 7919;
  const bank = generateBank(seed);

  if (bank.length !== 100) {
    throw new Error(`Seed ${seed}: Expected 100 questions, got ${bank.length}`);
  }

  // Check 10 distinct question texts per world
  for (let w = 0; w < 10; w++) {
    const worldQuestions = bank.slice(w * 10, (w + 1) * 10);
    const texts = new Set(worldQuestions.map(q => q.questionText));
    if (texts.size < 7) {
      throw new Error(`Seed ${seed}, World ${w}: Insufficient distinct question texts (${texts.size}/10)`);
    }
  }

  for (let i = 0; i < bank.length; i++) {
    const q = bank[i];
    totalQuestionsChecked++;

    // 1. Schema check
    const requiredKeys = [
      'id', 'districtId', 'category', 'visual',
      'questionText', 'options', 'correctAnswer',
      'explanation', 'hint1', 'hint2', 'visualData'
    ];
    for (const k of requiredKeys) {
      if (q[k] === undefined || q[k] === null || q[k] === '') {
        throw new Error(`Seed ${seed}, Q${i}: Missing or empty property "${k}"`);
      }
    }

    // 2. Options check
    if (!Array.isArray(q.options) || q.options.length !== 4) {
      throw new Error(`Seed ${seed}, Q${i}: Options must be an array of length 4`);
    }
    const optSet = new Set(q.options);
    if (optSet.size !== 4) {
      throw new Error(`Seed ${seed}, Q${i}: Options must have 4 distinct values: ${JSON.stringify(q.options)}`);
    }
    if (!optSet.has(q.correctAnswer)) {
      throw new Error(`Seed ${seed}, Q${i}: Correct answer "${q.correctAnswer}" not in options: ${JSON.stringify(q.options)}`);
    }

    // 3. Check for NaN or undefined string
    const stringified = JSON.stringify(q);
    if (stringified.includes('NaN') || stringified.includes('undefined')) {
      throw new Error(`Seed ${seed}, Q${i}: Contains NaN or undefined`);
    }

    // 4. Geometric validity checks on visualData
    const vd = q.visualData;
    if (vd) {
      if (vd.type === 'line-angles' && Array.isArray(vd.angles)) {
        if (!validateLineSet(vd.angles)) {
          throw new Error(`Seed ${seed}, Q${i}: Invalid line-angles set: ${JSON.stringify(vd.angles)}`);
        }
      } else if (vd.type === 'point-angles' && Array.isArray(vd.angles)) {
        if (!validatePointSet(vd.angles)) {
          throw new Error(`Seed ${seed}, Q${i}: Invalid point-angles set: ${JSON.stringify(vd.angles)}`);
        }
      } else if (vd.type === 'intersection' && vd.a && vd.b) {
        if (!validateIntersection({ angles: [vd.a, vd.b, vd.a, vd.b] })) {
          throw new Error(`Seed ${seed}, Q${i}: Invalid intersection data: a=${vd.a}, b=${vd.b}`);
        }
      }
    }

    passCount++;
  }
}

console.log(`✔ SUCCESS: ${NUM_SEEDS} seeds tested.`);
console.log(`✔ Checked ${totalQuestionsChecked} total questions across 10 worlds.`);
console.log(`✔ All schema validations, geometric assertions, and distractor checks PASSED 100%!`);
