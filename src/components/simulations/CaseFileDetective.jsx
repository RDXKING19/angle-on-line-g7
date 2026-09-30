import React, { useState } from 'react';
import { Panel, Msg, GoldBtn } from './kit.jsx';
import { playClickSound } from '../../utils/audio.js';

const CASES = [
  {
    id: 1,
    title: 'The Overcounting Fence Post',
    description: 'Two angles on a straight fence line measure 65° and x.',
    lines: [
      { num: 1, text: 'Given: Angles 65° and x lie along a straight line.' },
      { num: 2, text: 'Rule: Angles on a straight line add up to 360°.' }, // FAULTY (should be 180°)
      { num: 3, text: 'Calculation: x = 360° − 65°' },
      { num: 4, text: 'Answer: x = 295°' }
    ],
    faultyLineNum: 2,
    corrections: [
      { text: 'Angles on a straight line add up to 180°.', correct: true },
      { text: 'Angles on a straight line are equal to 90°.', correct: false },
      { text: 'Angles on a straight line add up to 270°.', correct: false }
    ],
    explanation: 'Straight lines form a straight angle of 180°, not a full circle of 360°.'
  },
  {
    id: 2,
    title: 'The Crossroad Confusion',
    description: 'Two straight roads cross at an intersection. One angle is 72°.',
    lines: [
      { num: 1, text: 'Given: Two straight lines intersect; one angle is 72°.' },
      { num: 2, text: 'Rule: Vertically opposite angles are equal.' },
      { num: 3, text: 'Working: Angle y is next to the 72° angle on the straight line, so y = 72°.' }, // FAULTY (adjacent angles are supplementary, not equal!)
      { num: 4, text: 'Answer: y = 72°' }
    ],
    faultyLineNum: 3,
    corrections: [
      { text: 'Angle y and 72° are adjacent on a line, so y = 180° − 72° = 108°.', correct: true },
      { text: 'Angle y is at a point, so y = 360° − 72° = 288°.', correct: false },
      { text: 'Angle y is complementary, so y = 90° − 72° = 18°.', correct: false }
    ],
    explanation: 'Angles sitting side-by-side along a line are adjacent and supplementary (180°), not vertically opposite.'
  },
  {
    id: 3,
    title: 'The Arithmetic Slip-Up',
    description: 'Three angles at a point measure 110°, 120°, and x.',
    lines: [
      { num: 1, text: 'Given: Three angles meet around a central point: 110°, 120°, and x.' },
      { num: 2, text: 'Rule: Angles at a point sum to 360°.' },
      { num: 3, text: 'Calculation: x = 360° − (110° + 120°) = 360° − 230°' },
      { num: 4, text: 'Answer: x = 140°' } // FAULTY (360 - 230 = 130, not 140!)
    ],
    faultyLineNum: 4,
    corrections: [
      { text: 'Answer: x = 130° (since 360° − 230° = 130°)', correct: true },
      { text: 'Answer: x = 150° (since 360° − 230° = 150°)', correct: false },
      { text: 'Answer: x = 50° (since 180° − 230° = 50°)', correct: false }
    ],
    explanation: '360° minus 230° equals 130°, not 140°.'
  }
];

export function CaseFileDetective({ onComplete, audioEnabled = true }) {
  const [caseIdx, setCaseIdx] = useState(0); // 0, 1, 2
  const [casesSolved, setCasesSolved] = useState(0); // target 3
  const [selectedLine, setSelectedLine] = useState(null);
  const [selectedCorrection, setSelectedCorrection] = useState(null);
  const [stepState, setStepState] = useState('find_line'); // 'find_line' | 'pick_correction' | 'case_solved'
  const [feedback, setFeedback] = useState(null);

  const currentCase = CASES[caseIdx];

  const handleSelectLine = (num) => {
    playClickSound();
    if (stepState !== 'find_line') return;
    setSelectedLine(num);

    if (num === currentCase.faultyLineNum) {
      setStepState('pick_correction');
      setFeedback({
        type: 'success',
        msg: `Great eye! Line ${num} contains the flaw. Now select the correct mathematical fix!`
      });
    } else {
      setFeedback({
        type: 'error',
        msg: `Line ${num} is mathematically sound. Inspect the other lines for a flaw in property or arithmetic.`
      });
    }
  };

  const handleSelectCorrection = (correction) => {
    playClickSound();
    if (stepState !== 'pick_correction') return;
    setSelectedCorrection(correction);

    if (correction.correct) {
      setStepState('case_solved');
      const nextSolved = casesSolved + 1;
      setCasesSolved(nextSolved);
      setFeedback({
        type: 'success',
        msg: `Case cracked! ${currentCase.explanation}`
      });
    } else {
      setFeedback({
        type: 'error',
        msg: 'That fix does not correct the mistake. Try another option!'
      });
    }
  };

  const handleNextCase = () => {
    const nextIdx = caseIdx + 1;
    setCaseIdx(nextIdx);
    setSelectedLine(null);
    setSelectedCorrection(null);
    setStepState('find_line');
    setFeedback(null);
  };

  return (
    <Panel className="w-full h-full">
      {/* Header Info */}
      <div className="w-full flex items-center justify-between bg-[#14082c]/90 border border-cyan-400/40 rounded-2xl p-3 shadow-lg">
        <div>
          <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
            🕵️ Case File {caseIdx + 1} of 3
          </span>
          <span className="font-display font-900 text-sm sm:text-base text-white">
            {currentCase.title}
          </span>
        </div>
        <span className="font-display font-black text-emerald-400">
          Cases Audited: {casesSolved} / 3
        </span>
      </div>

      <p className="text-xs sm:text-sm text-slate-200 font-extrabold text-left w-full">
        {currentCase.description}
      </p>

      {/* 4-Line Worked Solution Card */}
      <div className="w-full max-w-xl flex flex-col gap-2.5">
        {currentCase.lines.map((l) => {
          const isSelected = selectedLine === l.num;
          const isFaulty = l.num === currentCase.faultyLineNum && (stepState === 'pick_correction' || stepState === 'case_solved');

          return (
            <button
              key={l.num}
              onClick={() => handleSelectLine(l.num)}
              disabled={stepState !== 'find_line'}
              className={`p-3 rounded-2xl border-2 font-display text-xs sm:text-sm text-left flex items-center gap-3 transition cursor-pointer ${
                isFaulty
                  ? 'border-rose-500 bg-rose-950/80 text-rose-200 shadow-md'
                  : isSelected
                  ? 'border-amber-400 bg-[#2b1754] text-white'
                  : 'border-white/15 bg-[#120728]/80 text-slate-200 hover:border-cyan-400/60'
              }`}
            >
              <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center font-bold text-xs shrink-0">
                {l.num}
              </span>
              <span className="flex-1 font-mono font-bold">{l.text}</span>
              {isFaulty && <span className="text-rose-400 text-sm">⚠️ MISTAKE</span>}
            </button>
          );
        })}
      </div>

      {/* Correction Selection Panel (when faulty line identified) */}
      {stepState === 'pick_correction' && (
        <div className="w-full max-w-xl bg-[#1a0c3a] border-2 border-amber-400/50 rounded-2xl p-4 flex flex-col gap-2.5 fade-in-up">
          <p className="font-display font-900 text-sm text-amber-300">
            Choose the mathematically correct replacement for Line {currentCase.faultyLineNum}:
          </p>
          {currentCase.corrections.map((corr, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectCorrection(corr)}
              className="p-2.5 rounded-xl border border-white/20 bg-white/10 hover:bg-emerald-950 hover:border-emerald-400 text-white font-mono text-xs sm:text-sm text-left transition cursor-pointer"
            >
              {corr.text}
            </button>
          ))}
        </div>
      )}

      {/* Feedback banner */}
      {feedback && (
        <Msg tone={feedback.type === 'success' ? 'emerald' : 'rose'}>
          {feedback.msg}
        </Msg>
      )}

      {/* Next Case / Complete Button */}
      {stepState === 'case_solved' && casesSolved < 3 && (
        <div className="w-full flex justify-center mt-2 fade-in-up">
          <GoldBtn onClick={handleNextCase}>
            Next Case File →
          </GoldBtn>
        </div>
      )}

      {/* All 3 Cases Solved -> Complete Station CTA */}
      {casesSolved >= 3 && (
        <div className="w-full flex flex-col items-center gap-2 fade-in-up mt-2">
          <Msg tone="emerald">Incredible error-detective skills! You detected and corrected all 3 geometric slips!</Msg>
          <GoldBtn onClick={onComplete}>
            Complete Station D ✓
          </GoldBtn>
        </div>
      )}
    </Panel>
  );
}
