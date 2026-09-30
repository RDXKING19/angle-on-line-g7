import React, { useState } from 'react';
import { Panel, Msg, GoldBtn, AngleSlider } from './kit.jsx';
import { AngleVisual } from '../shared/AngleVisual.jsx';
import { genLineSet, genPointSet, sum } from '../../utils/angleMath.js';
import { createRNG } from '../../utils/rng.js';

export function MatchTheMissingAngle({ onComplete, audioEnabled = true }) {
  const [caseIdx, setCaseIdx] = useState(0); // 0, 1, 2
  const [completedCases, setCompletedCases] = useState(0); // target 3
  const [guessAngle, setGuessAngle] = useState(50);
  const [checkStatus, setCheckStatus] = useState(null); // 'exact' | 'close' | 'wrong'

  // Pre-seed 3 cases: 2 line cases (target 180) + 1 point case (target 360)
  const [currentCase, setCurrentCase] = useState(() => {
    return {
      type: 'line',
      target: 180,
      known: 125,
      actualUnknown: 55,
      angles: [125, 55]
    };
  });

  const loadNewCase = (idx) => {
    const rng = createRNG(Date.now() + idx * 7919);
    if (idx === 0) {
      setCurrentCase({
        type: 'line',
        target: 180,
        known: 115,
        actualUnknown: 65,
        angles: [115, 65]
      });
      setGuessAngle(40);
    } else if (idx === 1) {
      const [a, b, c] = genLineSet(rng, 3, 20);
      setCurrentCase({
        type: 'line',
        target: 180,
        known: a + b,
        actualUnknown: c,
        angles: [a, b, c]
      });
      setGuessAngle(30);
    } else {
      const [a, b, c, d] = genPointSet(rng, 4, 30, 140);
      setCurrentCase({
        type: 'point',
        target: 360,
        known: a + b + c,
        actualUnknown: d,
        angles: [a, b, c, d]
      });
      setGuessAngle(50);
    }
    setCheckStatus(null);
  };

  const currentTotal = currentCase.known + guessAngle;
  const diff = Math.abs(currentTotal - currentCase.target);
  const isExact = diff === 0;
  const isClose = diff <= 10 && !isExact;

  const handleCheck = () => {
    if (isExact) {
      setCheckStatus('exact');
      const nextCount = completedCases + 1;
      setCompletedCases(nextCount);
    } else if (isClose) {
      setCheckStatus('close');
    } else {
      setCheckStatus('wrong');
    }
  };

  const handleNextCase = () => {
    const nextIdx = caseIdx + 1;
    setCaseIdx(nextIdx);
    loadNewCase(nextIdx);
  };

  return (
    <Panel className="w-full h-full">
      {/* Progress & Target Readout */}
      <div className="w-full flex items-center justify-between bg-[#14082c]/90 border border-cyan-400/40 rounded-2xl p-3 shadow-lg">
        <span className="text-xs font-bold text-slate-300">
          Case {Math.min(3, caseIdx + 1)} of 3 · Target Sum:{' '}
          <span className="text-amber-300 font-black">{currentCase.target}°</span>
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Cases Solved:</span>
          <span className="font-display font-black text-emerald-400">{completedCases} / 3</span>
        </div>
      </div>

      {/* Live Running Total Meter */}
      <div
        className={`w-full max-w-md p-3 rounded-2xl border-2 flex items-center justify-between transition-all duration-300 ${
          isExact
            ? 'border-emerald-400 bg-emerald-950/80 text-emerald-300 shadow-[0_0_18px_rgba(52,211,153,0.5)]'
            : isClose
            ? 'border-amber-400 bg-amber-950/80 text-amber-200 shadow-[0_0_14px_rgba(251,191,36,0.4)]'
            : 'border-white/15 bg-white/5 text-slate-300'
        }`}
      >
        <span className="font-bold text-xs sm:text-sm">Running Sum:</span>
        <span className="font-display font-900 text-lg sm:text-xl">
          {currentCase.known}° + <span className="underline">{guessAngle}°</span> = {currentTotal}°
        </span>
        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/10">
          {isExact ? 'TARGET HIT! 🎯' : isClose ? 'VERY CLOSE!' : `${Math.abs(currentCase.target - currentTotal)}° OFF`}
        </span>
      </div>

      {/* Interactive Visual Diagram */}
      <div className="w-full max-w-sm h-48 bg-[#120726]/90 border border-white/10 rounded-2xl p-2 flex items-center justify-center">
        {currentCase.type === 'line' ? (
          <AngleVisual
            type="line-angles"
            data={{ angles: [currentCase.known, guessAngle], unknownIdx: 1 }}
            compact
          />
        ) : (
          <AngleVisual
            type="point-angles"
            data={{ angles: [currentCase.known, guessAngle], unknownIdx: 1 }}
            compact
          />
        )}
      </div>

      {/* Angle Slider Control */}
      <div className="w-full max-w-md">
        <AngleSlider
          value={guessAngle}
          min={5}
          max={currentCase.target - 20}
          step={5}
          onChange={setGuessAngle}
          label="Adjust Angle x"
        />
      </div>

      {/* Check & Case Navigation Controls */}
      <div className="flex items-center gap-3">
        {checkStatus !== 'exact' ? (
          <GoldBtn onClick={handleCheck}>
            Check Match 📐
          </GoldBtn>
        ) : completedCases < 3 ? (
          <GoldBtn onClick={handleNextCase}>
            Next Case →
          </GoldBtn>
        ) : null}
      </div>

      {/* Feedback Messages */}
      {checkStatus === 'close' && (
        <Msg tone="amber">Very warm! You are within 10°. Adjust slightly to hit the exact target!</Msg>
      )}
      {checkStatus === 'wrong' && (
        <Msg tone="rose">Not quite. Sum the known angles and calculate {currentCase.target}° − {currentCase.known}°.</Msg>
      )}

      {/* All 3 Completed -> Complete Station CTA */}
      {completedCases >= 3 && (
        <div className="w-full flex flex-col items-center gap-2 fade-in-up mt-1">
          <Msg tone="emerald">Outstanding! You matched all 3 missing angle targets accurately!</Msg>
          <GoldBtn onClick={onComplete}>
            Complete Station B ✓
          </GoldBtn>
        </div>
      )}
    </Panel>
  );
}
