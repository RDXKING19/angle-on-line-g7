import { WORLDS } from '../config/worlds.config.js';
import { createRNG } from '../utils/rng.js';
import {
  STEP,
  REASONS,
  genLineSet,
  genPointSet,
  genIntersection,
  makeDistractors,
  fmtAngle,
  supplement,
  equalPart,
  EQUAL_PART_COUNTS,
  sum
} from '../utils/angleMath.js';

export const DISTRICTS = WORLDS.map(w => ({
  id: w.id,
  name: w.name,
  icon: w.emoji,
  accent: w.accent,
  conceptFocus: w.conceptFocus,
  description: w.description,
  boss: w.boss
}));

const LETTER_SETS = [
  ['A', 'B', 'C'],
  ['P', 'Q', 'R'],
  ['X', 'Y', 'Z'],
  ['D', 'E', 'F'],
  ['K', 'L', 'M'],
  ['S', 'T', 'U']
];

export function generateQuestion(worldId, qIdxInWorld, rng) {
  const qGlobalId = worldId * 10 + qIdxInWorld;
  const category = WORLDS[worldId].conceptFocus;

  switch (worldId) {
    /* ------------------------------------------------ W0: Angle Types & Naming */
    case 0: {
      const letters = LETTER_SETS[qIdxInWorld % LETTER_SETS.length];
      const name = `∠${letters[0]}${letters[1]}${letters[2]}`;
      const subType = qIdxInWorld % 3;

      if (subType === 0) {
        // Vertex of 3-letter name with unique letter sets
        const vertex = letters[1];
        const correct = vertex;
        const foils = [letters[0], letters[2], 'Cannot tell'];
        const options = rng.shuffle([correct, ...foils]);
        return {
          id: `w0-q${qIdxInWorld}`,
          districtId: 0,
          category,
          visual: 'angle-type',
          questionText: `In case #${qIdxInWorld + 1}, angle ${name} is marked as clue evidence. Which letter represents the vertex where the two rays meet?`,
          options,
          correctAnswer: correct,
          explanation: `In the three-letter angle notation ${name}, the middle letter (${vertex}) is always the vertex.`,
          hint1: `Look at the order of letters in the angle's three-letter name.`,
          hint2: `The middle letter represents the vertex point where both rays join.`,
          visualData: { type: 'angle-type', deg: 60, label: name, letters }
        };
      } else if (subType === 1) {
        // Classify angle type with varied degree
        const degPool = [25, 40, 55, 70, 90, 115, 130, 145, 160, 210, 240, 300];
        const deg = degPool[qIdxInWorld % degPool.length];
        let chosenName = 'Acute angle';
        let chosenDesc = 'is between 0° and 90°';
        if (deg === 90) { chosenName = 'Right angle'; chosenDesc = 'is exactly 90°'; }
        else if (deg === 180) { chosenName = 'Straight angle'; chosenDesc = 'is exactly 180°'; }
        else if (deg > 90 && deg < 180) { chosenName = 'Obtuse angle'; chosenDesc = 'is between 90° and 180°'; }
        else if (deg > 180) { chosenName = 'Reflex angle'; chosenDesc = 'is greater than 180°'; }

        const allNames = ['Acute angle', 'Right angle', 'Obtuse angle', 'Reflex angle'];
        const foils = allNames.filter(n => n !== chosenName);
        const options = rng.shuffle([chosenName, ...foils.slice(0, 3)]);
        return {
          id: `w0-q${qIdxInWorld}`,
          districtId: 0,
          category,
          visual: 'angle-type',
          questionText: `Case evidence #${qIdxInWorld + 1}: An angle measures ${deg}°. What type of angle is it?`,
          options,
          correctAnswer: chosenName,
          explanation: `An angle of ${deg}° is classified as an ${chosenName.toLowerCase()} because it ${chosenDesc}.`,
          hint1: `Compare ${deg}° with 90° and 180°.`,
          hint2: `Acute < 90°, Right = 90°, 90° < Obtuse < 180°, and Reflex > 180°.`,
          visualData: { type: 'angle-type', deg }
        };
      } else {
        // Classify specific named angles
        const degPool2 = [30, 50, 65, 80, 100, 125, 140, 155, 175, 225];
        const deg = degPool2[qIdxInWorld % degPool2.length];
        let typeName = deg < 90 ? 'Acute angle' : deg < 180 ? 'Obtuse angle' : 'Reflex angle';
        const allNames = ['Acute angle', 'Right angle', 'Obtuse angle', 'Reflex angle'];
        const foils = allNames.filter(n => n !== typeName);
        const options = rng.shuffle([typeName, ...foils.slice(0, 3)]);
        return {
          id: `w0-q${qIdxInWorld}`,
          districtId: 0,
          category,
          visual: 'angle-type',
          questionText: `Detective classification task #${qIdxInWorld + 1}: Name the angle category for a measured opening of ${deg}°.`,
          options,
          correctAnswer: typeName,
          explanation: `An opening of ${deg}° is an ${typeName.toLowerCase()}.`,
          hint1: `Check whether ${deg}° is acute (< 90°), obtuse (90°–180°), or reflex (> 180°).`,
          hint2: `Angles between 90° and 180° are obtuse.`,
          visualData: { type: 'angle-type', deg }
        };
      }
    }

    /* ------------------------------------------------ W1: Straight Street (2 angles on a line) */
    case 1: {
      const [known, unknown] = genLineSet(rng, 2, 20);
      const correct = fmtAngle(unknown);
      const rawDistractors = makeDistractors(
        unknown,
        [known, 90 - known > 0 ? 90 - known : null, 360 - known, unknown + 10, unknown - 10],
        rng,
        3
      );
      const options = rng.shuffle([correct, ...rawDistractors.map(fmtAngle)]);
      return {
        id: `w1-q${qIdxInWorld}`,
        districtId: 1,
        category,
        visual: 'line-angles',
        questionText: `Straight Street investigation #${qIdxInWorld + 1}: Two adjacent angles lie on a straight line. One angle measures ${known}°. Find the unknown angle x.`,
        options,
        correctAnswer: correct,
        explanation: `x = 180° − ${known}° = ${unknown}° (${REASONS.line}).`,
        hint1: `Recall the straight-line rule: angles along a straight line add up to 180°.`,
        hint2: `Subtract ${known}° from 180° to find x.`,
        visualData: { type: 'line-angles', angles: [known, unknown], unknownIdx: 1 }
      };
    }

    /* ------------------------------------------------ W2: Split-Lane Street (3-4 angles on a line) */
    case 2: {
      const isFour = qIdxInWorld % 2 === 1;
      const angles = genLineSet(rng, isFour ? 4 : 3, 15);
      const unknownIdx = angles.length - 1;
      const unknownVal = angles[unknownIdx];
      const knownAngles = angles.slice(0, unknownIdx);
      const knownSum = sum(knownAngles);

      const correct = fmtAngle(unknownVal);
      const rawDistractors = makeDistractors(
        unknownVal,
        [360 - knownSum, 180 - knownAngles[0], unknownVal + 10, unknownVal - 10],
        rng,
        3
      );
      const options = rng.shuffle([correct, ...rawDistractors.map(fmtAngle)]);
      const formula = knownAngles.map(a => `${a}°`).join(' + ');

      return {
        id: `w2-q${qIdxInWorld}`,
        districtId: 2,
        category,
        visual: 'line-angles',
        questionText: `Split-Lane junction case #${qIdxInWorld + 1}: ${angles.length} adjacent angles lie along a straight line: ${formula} and x. Find x.`,
        options,
        correctAnswer: correct,
        explanation: `x = 180° − (${formula}) = 180° − ${knownSum}° = ${unknownVal}° (${REASONS.line}).`,
        hint1: `Angles on a straight line sum to 180°. First sum all the known angles.`,
        hint2: `The known angles total ${knownSum}°. Subtract this from 180°.`,
        visualData: { type: 'line-angles', angles, unknownIdx }
      };
    }

    /* ------------------------------------------------ W3: Compass Point Plaza (3-4 angles at a point) */
    case 3: {
      const isFour = qIdxInWorld % 2 === 0;
      const angles = genPointSet(rng, isFour ? 4 : 3, 30, 160);
      const unknownIdx = angles.length - 1;
      const unknownVal = angles[unknownIdx];
      const knownAngles = angles.slice(0, unknownIdx);
      const knownSum = sum(knownAngles);

      const correct = fmtAngle(unknownVal);
      const rawDistractors = makeDistractors(
        unknownVal,
        [
          180 - knownSum > 0 ? 180 - knownSum : null,
          360 - knownAngles[0],
          unknownVal + 15,
          unknownVal - 15,
          unknownVal + 20
        ],
        rng,
        3
      );
      const options = rng.shuffle([correct, ...rawDistractors.map(fmtAngle)]);
      const terms = knownAngles.map(a => `${a}°`).join(' + ');

      return {
        id: `w3-q${qIdxInWorld}`,
        districtId: 3,
        category,
        visual: 'point-angles',
        questionText: `Compass Point Plaza case #${qIdxInWorld + 1}: ${angles.length} angles meet around a point: ${terms} and x. Find x.`,
        options,
        correctAnswer: correct,
        explanation: `x = 360° − (${terms}) = 360° − ${knownSum}° = ${unknownVal}° (${REASONS.point}).`,
        hint1: `Angles meeting at a common vertex point make a full turn and sum to 360°.`,
        hint2: `Add the known angles (${knownSum}°) and subtract from 360°.`,
        visualData: { type: 'point-angles', angles, unknownIdx }
      };
    }

    /* ------------------------------------------------ W4: Mirror Crossroads (vertically opposite) */
    case 4: {
      const inter = genIntersection(rng);
      const askOpposite = qIdxInWorld % 2 === 0;

      if (askOpposite) {
        const correct = fmtAngle(inter.a);
        const rawDistractors = makeDistractors(
          inter.a,
          [inter.b, 90 - inter.a > 0 ? 90 - inter.a : null, 180 - inter.a, inter.a + 15],
          rng,
          3
        );
        const options = rng.shuffle([correct, ...rawDistractors.map(fmtAngle)]);
        return {
          id: `w4-q${qIdxInWorld}`,
          districtId: 4,
          category,
          visual: 'intersection',
          questionText: `Mirror Crossroads case #${qIdxInWorld + 1}: Two straight lines cross at an intersection. One angle is ${inter.a}°. What is the measure of the angle vertically opposite to it?`,
          options,
          correctAnswer: correct,
          explanation: `Vertically opposite angles are equal, so the opposite angle is also ${inter.a}° (${REASONS.vertOpp}).`,
          hint1: `Remember the mirror rule: what do we know about angles directly facing each other across an intersection?`,
          hint2: `Vertically opposite angles formed by two straight lines are always equal.`,
          visualData: { type: 'intersection', a: inter.a, b: inter.b, unknown: 'c', givenIdx: 0 }
        };
      } else {
        const correct = fmtAngle(inter.b);
        const rawDistractors = makeDistractors(
          inter.b,
          [inter.a, 360 - inter.a, inter.b + 10, inter.b - 10],
          rng,
          3
        );
        const options = rng.shuffle([correct, ...rawDistractors.map(fmtAngle)]);
        return {
          id: `w4-q${qIdxInWorld}`,
          districtId: 4,
          category,
          visual: 'intersection',
          questionText: `Mirror Crossroads case #${qIdxInWorld + 1}: Two straight lines cross. One angle is ${inter.a}°. Find the adjacent angle sitting next to it on the straight line.`,
          options,
          correctAnswer: correct,
          explanation: `Adjacent angles on a straight line add up to 180°, so the adjacent angle is 180° − ${inter.a}° = ${inter.b}° (${REASONS.line}).`,
          hint1: `The angle next to it shares a straight line. What do angles on a straight line sum to?`,
          hint2: `Subtract ${inter.a}° from 180°.`,
          visualData: { type: 'intersection', a: inter.a, b: inter.b, unknown: 'b', givenIdx: 0 }
        };
      }
    }

    /* ------------------------------------------------ W5: Rule Detective HQ (Identify & justify rule) */
    case 5: {
      const deg1 = rng.pick([45, 55, 65, 75, 85]);
      const deg2 = rng.pick([110, 120, 130, 140]);
      const scenarios = [
        {
          q: `Two adjacent angles lie on a straight line, measuring ${deg1}° and x. Which geometric property justifies writing x = 180° − ${deg1}°?`,
          correct: 'adjacent angles on a straight line',
          foils: ['angles at a point', 'vertically opposite angles', 'angles in a triangle']
        },
        {
          q: `Two straight laser beams cross each other forming four angles. Why is the angle of ${deg1}° equal to the angle directly opposite it?`,
          correct: 'vertically opposite angles',
          foils: ['adjacent angles on a straight line', 'angles at a point', 'corresponding angles']
        },
        {
          q: `Five pedestrian paths branch out in all directions from a town center point. Which property states their angles must sum to 360°?`,
          correct: 'angles at a point',
          foils: ['adjacent angles on a straight line', 'vertically opposite angles', 'alternate angles']
        },
        {
          q: `In the equation x = 180° − ${deg2}°, which angle property is required as the geometric reason?`,
          correct: 'adjacent angles on a straight line',
          foils: ['angles at a point', 'vertically opposite angles', 'interior angles']
        },
        {
          q: `When finding an unknown angle in a full circle around a single vertex, which angle total must you use?`,
          correct: '360° (angles at a point)',
          foils: ['180° (angles on a line)', '90° (right angle)', '270° (three-quarter turn)']
        },
        {
          q: `On a straight track, three adjacent angles lie side by side: 40°, 85°, and y. Which property justifies that they add up to 180°?`,
          correct: 'adjacent angles on a straight line',
          foils: ['angles at a point', 'vertically opposite angles', 'complementary angles']
        },
        {
          q: `Two straight ruler edges cross on a drafting desk. Which property explains why the two non-adjacent angles facing each other are equal?`,
          correct: 'vertically opposite angles',
          foils: ['adjacent angles on a straight line', 'angles at a point', 'alternate angles']
        },
        {
          q: `Four pathways meet at a park fountain to form a complete turn. Which rule says the sum of these angles is 360°?`,
          correct: 'angles at a point',
          foils: ['adjacent angles on a straight line', 'vertically opposite angles', 'linear pair']
        },
        {
          q: `Straight lines EF and GH intersect at point K. Amirah writes ∠EKG = ∠FKH. What angle property must she state as the reason?`,
          correct: 'vertically opposite angles',
          foils: ['adjacent angles on a straight line', 'angles at a point', 'interior angles']
        },
        {
          q: `When calculating an unknown angle along a straight wooden beam with an adjacent angle of ${deg1}°, which rule applies?`,
          correct: 'adjacent angles on a straight line',
          foils: ['angles at a point', 'vertically opposite angles', 'exterior angles']
        }
      ];
      const s = scenarios[qIdxInWorld % scenarios.length];
      const options = rng.shuffle([s.correct, ...s.foils]);
      return {
        id: `w5-q${qIdxInWorld}`,
        districtId: 5,
        category,
        visual: 'road-sign',
        questionText: s.q,
        options,
        correctAnswer: s.correct,
        explanation: `The correct reason is "${s.correct}". Detectives must always justify each step with the exact geometric property.`,
        hint1: `Check whether the angles lie along a straight line, around a single point, or face each other across crossing lines.`,
        hint2: `Straight line = 180°, Point = 360°, Opposite across intersection = equal.`,
        visualData: { type: 'road-sign', text: s.correct }
      };
    }

    /* ------------------------------------------------ W6: Double Trouble Intersection (composite) */
    case 6: {
      const inter = genIntersection(rng);
      const sub = qIdxInWorld % 2;
      const linePairs = [
        ['AB', 'CD'], ['PQ', 'RS'], ['EF', 'GH'], ['JK', 'LM'], ['WX', 'YZ'],
        ['ST', 'UV'], ['KL', 'MN'], ['BC', 'DE'], ['FG', 'HJ'], ['OP', 'QR']
      ];
      const [l1, l2] = linePairs[qIdxInWorld];

      if (sub === 0) {
        // Given angle a, find b then find opposite
        const correct = fmtAngle(inter.b);
        const rawDistractors = makeDistractors(inter.b, [inter.a, 360 - inter.a, inter.b + 10, inter.b - 10], rng, 3);
        const options = rng.shuffle([correct, ...rawDistractors.map(fmtAngle)]);
        return {
          id: `w6-q${qIdxInWorld}`,
          districtId: 6,
          category,
          visual: 'intersection',
          questionText: `Intersection case #${qIdxInWorld + 1}: Straight lines ${l1} and ${l2} intersect at point O. Angle 1 is ${inter.a}°. Find the adjacent angle 2 lying on the straight line ${l2}.`,
          options,
          correctAnswer: correct,
          explanation: `Angle 2 and angle 1 lie on the straight line ${l2}. Therefore, angle 2 = 180° − ${inter.a}° = ${inter.b}° (${REASONS.line}).`,
          hint1: `Notice that ${l2} is a straight line. Adjacent angles along a line form a straight angle.`,
          hint2: `180° − ${inter.a}° = ${inter.b}°.`,
          visualData: { type: 'intersection', a: inter.a, b: inter.b, unknown: 'b', givenIdx: 0 }
        };
      } else {
        const correct = fmtAngle(inter.a);
        const rawDistractors = makeDistractors(inter.a, [inter.b, 180 - inter.a, inter.a + 15, inter.a - 15], rng, 3);
        const options = rng.shuffle([correct, ...rawDistractors.map(fmtAngle)]);
        return {
          id: `w6-q${qIdxInWorld}`,
          districtId: 6,
          category,
          visual: 'intersection',
          questionText: `Intersection case #${qIdxInWorld + 1}: Lines ${l1} and ${l2} cross at O. Angle 1 measures ${inter.a}°. Find the vertically opposite angle 3 directly facing it.`,
          options,
          correctAnswer: correct,
          explanation: `Angle 3 and angle 1 are vertically opposite angles formed by intersecting lines, so angle 3 = ${inter.a}° (${REASONS.vertOpp}).`,
          hint1: `Look at the positions of angle 1 and angle 3 across the vertex O.`,
          hint2: `They are vertically opposite each other, which means they are equal!`,
          visualData: { type: 'intersection', a: inter.a, b: inter.b, unknown: 'c', givenIdx: 0 }
        };
      }
    }

    /* ------------------------------------------------ W7: Blueprint Bay (real-world structures) */
    case 7: {
      const items = [
        {
          name: 'roof truss',
          prop: 'straight line',
          text: `In a roof truss, two steel support beams rest along a straight horizontal tie-beam. One angle is 55°. Find the adjacent angle x.`,
          ans: 125,
          known: 55,
          reason: REASONS.line,
          calc: '180° − 55° = 125°',
          visualType: 'roof-truss'
        },
        {
          name: 'road sign',
          prop: 'straight line',
          text: `A directional road sign is welded onto a straight vertical post. The angle below the sign is 135°. Find the angle y above the sign along the straight post.`,
          ans: 45,
          known: 135,
          reason: REASONS.line,
          calc: '180° − 135° = 45°',
          visualType: 'road-sign'
        },
        {
          name: 'kite frame',
          prop: 'vertically opposite',
          text: `Two bamboo struts cross at the center of a stunt kite. One opening angle is 70°. What is the angle vertically opposite to it across the crossing point?`,
          ans: 70,
          known: 70,
          reason: REASONS.vertOpp,
          calc: '70° (vertically opposite angles are equal)',
          visualType: 'intersection'
        },
        {
          name: 'bicycle wheel',
          prop: 'straight line',
          text: `Two spokes on a bicycle wheel form a straight diameter line across the hub. A third spoke branches out making an angle of 75° with one side. What angle does it make with the opposite side?`,
          ans: 105,
          known: 75,
          reason: REASONS.line,
          calc: '180° − 75° = 105°',
          visualType: 'bike-wheel'
        },
        {
          name: 'crane boom',
          prop: 'straight line',
          text: `A harbor crane boom sits at an angle of 60° to the horizontal ground deck. What is the obtuse supplementary angle formed along the deck?`,
          ans: 120,
          known: 60,
          reason: REASONS.line,
          calc: '180° − 60° = 120°',
          visualType: 'roof-truss'
        },
        {
          name: 'bridge truss',
          prop: 'straight line',
          text: `A diagonal steel girder meets a straight bridge beam, creating an acute angle of 45°. Calculate the adjacent angle along the beam.`,
          ans: 135,
          known: 45,
          reason: REASONS.line,
          calc: '180° − 45° = 135°',
          visualType: 'roof-truss'
        },
        {
          name: 'solar panel mount',
          prop: 'straight line',
          text: `A rooftop solar panel is tilted at an angle of 35° to the horizontal roofline. Find the supplementary angle formed with the roof on the other side.`,
          ans: 145,
          known: 35,
          reason: REASONS.line,
          calc: '180° − 35° = 145°',
          visualType: 'road-sign'
        },
        {
          name: 'scissors lift',
          prop: 'vertically opposite',
          text: `In a mechanical scissor lift, two steel arms cross at a central pin with one angle measuring 50°. Find the angle vertically opposite to it.`,
          ans: 50,
          known: 50,
          reason: REASONS.vertOpp,
          calc: '50° (vertically opposite angles are equal)',
          visualType: 'intersection'
        },
        {
          name: 'pedestrian bridge',
          prop: 'straight line',
          text: `A cable stay on a suspension bridge meets the straight roadway at 65°. Find the adjacent angle made with the roadway on the other side.`,
          ans: 115,
          known: 65,
          reason: REASONS.line,
          calc: '180° − 65° = 115°',
          visualType: 'roof-truss'
        },
        {
          name: 'streetlamp pole',
          prop: 'straight line',
          text: `A decorative streetlamp arm extends from a vertical pole at an angle of 110°. Find the acute angle between the arm and the pole above it.`,
          ans: 70,
          known: 110,
          reason: REASONS.line,
          calc: '180° − 110° = 70°',
          visualType: 'road-sign'
        }
      ];
      const item = items[qIdxInWorld];
      const correct = fmtAngle(item.ans);
      const rawDistractors = makeDistractors(
        item.ans,
        [item.known, 180 - item.ans, item.ans + 10, item.ans - 10],
        rng,
        3
      );
      const options = rng.shuffle([correct, ...rawDistractors.map(fmtAngle)]);
      return {
        id: `w7-q${qIdxInWorld}`,
        districtId: 7,
        category,
        visual: item.visualType,
        questionText: item.text,
        options,
        correctAnswer: correct,
        explanation: `${item.calc} (${item.reason}).`,
        hint1: `Model the real-world structure as geometric lines and vertices.`,
        hint2: `Use the ${item.prop} property to calculate the missing angle.`,
        visualData: { type: item.visualType, deg: item.ans, known: item.known }
      };
    }

    /* ------------------------------------------------ W8: Clockwork Corner (circular / equal parts) */
    case 8: {
      const sub = qIdxInWorld % 3;
      if (sub === 0) {
        // Ceiling fan blades with varied counts
        const bladeCounts = [3, 4, 5, 6, 8, 9, 10, 12];
        const blades = bladeCounts[qIdxInWorld % bladeCounts.length];
        const anglePerBlade = 360 / blades;
        const correct = fmtAngle(anglePerBlade);
        const rawDistractors = makeDistractors(
          anglePerBlade,
          [360 / (blades + 1), 180 / blades, anglePerBlade + 15, anglePerBlade - 15],
          rng,
          3
        );
        const options = rng.shuffle([correct, ...rawDistractors.map(fmtAngle)]);
        return {
          id: `w8-q${qIdxInWorld}`,
          districtId: 8,
          category,
          visual: 'fan',
          questionText: `Appliance case #${qIdxInWorld + 1}: A ventilation fan has ${blades} equally spaced blades meeting at the center hub. What is the angle between each blade and the next?`,
          options,
          correctAnswer: correct,
          explanation: `A full turn around the center point is 360°. Since the ${blades} blades are equally spaced: 360° ÷ ${blades} = ${anglePerBlade}° (${REASONS.point}).`,
          hint1: `All blades meet at a common central point and divide a full 360° turn equally.`,
          hint2: `Divide 360° by ${blades}.`,
          visualData: { type: 'fan', blades, angle: anglePerBlade }
        };
      } else if (sub === 1) {
        // Clock hands at whole hours
        const hour = (qIdxInWorld % 5) + 1; // 1, 2, 3, 4, 5
        const deg = hour * 30;
        const correct = fmtAngle(deg);
        const rawDistractors = makeDistractors(deg, [hour * 25, (hour + 1) * 30, deg + 15, deg - 15], rng, 3);
        const options = rng.shuffle([correct, ...rawDistractors.map(fmtAngle)]);
        return {
          id: `w8-q${qIdxInWorld}`,
          districtId: 8,
          category,
          visual: 'clock',
          questionText: `Detective clock reading #${qIdxInWorld + 1}: At exactly ${hour}:00, what is the smaller angle formed between the hour hand and the minute hand?`,
          options,
          correctAnswer: correct,
          explanation: `A clock face has 12 hours dividing 360°, which means 360° ÷ 12 = 30° per hour. At ${hour}:00, the hands are ${hour} hours apart: ${hour} × 30° = ${deg}°.`,
          hint1: `Each 1-hour interval on a clock dial represents 360° ÷ 12 = 30°.`,
          hint2: `Multiply ${hour} hours by 30° per hour.`,
          visualData: { type: 'clock', hour }
        };
      } else {
        // Pie chart slice remainder
        const slicePools = [
          [100, 90, 80],
          [120, 80, 70],
          [110, 100, 60],
          [130, 90, 50]
        ];
        const slices = slicePools[qIdxInWorld % slicePools.length];
        const knownSum = sum(slices);
        const unknown = 360 - knownSum;
        const correct = fmtAngle(unknown);
        const rawDistractors = makeDistractors(unknown, [180 - unknown, unknown + 10, unknown - 10], rng, 3);
        const options = rng.shuffle([correct, ...rawDistractors.map(fmtAngle)]);
        const label = slices.map(s => `${s}°`).join(', ');
        return {
          id: `w8-q${qIdxInWorld}`,
          districtId: 8,
          category,
          visual: 'pie',
          questionText: `Pie chart investigation #${qIdxInWorld + 1}: A circular chart has four sectors: ${label}, and sector x. What is the angle of sector x?`,
          options,
          correctAnswer: correct,
          explanation: `Sectors in a complete circular chart meet at the center point and sum to 360°. x = 360° − (${label.replace(/, /g, ' + ')}) = 360° − ${knownSum}° = ${unknown}° (${REASONS.point}).`,
          hint1: `All sectors of a circular pie chart meet at the central vertex and total 360°.`,
          hint2: `Known sectors total ${knownSum}°. Subtract ${knownSum}° from 360°.`,
          visualData: { type: 'pie', slices: [...slices, unknown], unknownIdx: 3 }
        };
      }
    }

    /* ------------------------------------------------ W9: Grand Junction Finale (Mixed Review & Algebra) */
    default: {
      const mode = qIdxInWorld % 3;
      if (mode === 0) {
        // Simple algebra: (2x + 10)° vertically opposite to an angle A
        // Let x be clean integer in [15, 45, 5]
        const xVal = rng.pick([15, 20, 25, 30, 35]);
        const total = 2 * xVal + 10;
        const correct = `${xVal}`;
        const rawDistractors = makeDistractors(xVal, [total, xVal + 5, xVal - 5, xVal * 2], rng, 3);
        const options = rng.shuffle([correct, ...rawDistractors.map(String)]);
        return {
          id: `w9-q${qIdxInWorld}`,
          districtId: 9,
          category,
          visual: 'intersection',
          questionText: `Grand Finale puzzle #${qIdxInWorld + 1}: Two straight lines cross. One angle is (2x + 10)° and the angle vertically opposite to it is ${total}°. Find the value of x.`,
          options,
          correctAnswer: correct,
          explanation: `Since vertically opposite angles are equal: 2x + 10 = ${total}, so 2x = ${total - 10}, giving x = ${xVal} (${REASONS.vertOpp}).`,
          hint1: `Vertically opposite angles are equal. Set up the equation: 2x + 10 = ${total}.`,
          hint2: `Subtract 10 from both sides: 2x = ${total - 10}, then divide by 2.`,
          visualData: { type: 'intersection', a: total, b: 180 - total, unknown: 'c', label: '(2x + 10)°' }
        };
      } else if (mode === 1) {
        // Complex straight line with 3 angles
        const [a, b, c] = genLineSet(rng, 3, 20);
        const correct = fmtAngle(c);
        const rawDistractors = makeDistractors(c, [360 - (a + b), a, b, c + 15], rng, 3);
        const options = rng.shuffle([correct, ...rawDistractors.map(fmtAngle)]);
        return {
          id: `w9-q${qIdxInWorld}`,
          districtId: 9,
          category,
          visual: 'line-angles',
          questionText: `Grand Finale puzzle #${qIdxInWorld + 1}: Three angles lie on a straight line: ${a}°, ${b}°, and z. Find z.`,
          options,
          correctAnswer: correct,
          explanation: `z = 180° − (${a}° + ${b}°) = 180° − ${a + b}° = ${c}° (${REASONS.line}).`,
          hint1: `Angles on a straight line sum to 180°.`,
          hint2: `Subtract (${a} + ${b}) from 180.`,
          visualData: { type: 'line-angles', angles: [a, b, c], unknownIdx: 2 }
        };
      } else {
        // Intersecting composite
        const inter = genIntersection(rng);
        const correct = fmtAngle(inter.b);
        const rawDistractors = makeDistractors(inter.b, [inter.a, 360 - inter.a, inter.b + 10], rng, 3);
        const options = rng.shuffle([correct, ...rawDistractors.map(fmtAngle)]);
        return {
          id: `w9-q${qIdxInWorld}`,
          districtId: 9,
          category,
          visual: 'intersection',
          questionText: `Grand Finale puzzle #${qIdxInWorld + 1}: At Grand Junction, two rail lines cross. An acute angle measures ${inter.a}°. Find the adjacent obtuse angle along the straight track.`,
          options,
          correctAnswer: correct,
          explanation: `Adjacent angles on a straight line add to 180°: 180° − ${inter.a}° = ${inter.b}° (${REASONS.line}).`,
          hint1: `The tracks form straight lines. Adjacent angles on a straight line sum to 180°.`,
          hint2: `180° − ${inter.a}° = ${inter.b}°.`,
          visualData: { type: 'intersection', a: inter.a, b: inter.b, unknown: 'b' }
        };
      }
    }
  }
}

/**
 * Generate 100 questions (10 per world for all 10 worlds).
 * A seeded PRNG guarantees reproducible bank generation.
 */
export function generateBank(seed = 12345) {
  const rng = createRNG(seed);
  const bank = [];

  for (let w = 0; w < 10; w++) {
    for (let q = 0; q < 10; q++) {
      bank.push(generateQuestion(w, q, rng));
    }
  }

  return bank;
}

// Default exported question bank initialized once per session
export const questionBank = generateBank(Date.now());
