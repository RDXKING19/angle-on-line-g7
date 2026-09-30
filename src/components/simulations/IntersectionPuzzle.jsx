import React, { useState } from 'react';
import { Panel, Msg, GoldBtn } from './kit.jsx';
import { genIntersection, makeDistractors, REASONS } from '../../utils/angleMath.js';
import { createRNG } from '../../utils/rng.js';
import { playClickSound } from '../../utils/audio.js';

export function IntersectionPuzzle({ onComplete, audioEnabled = true }) {
  const [round, setRound] = useState(1); // 1 or 2
  const [roundsCompleted, setRoundsCompleted] = useState(0); // target 2
  const [selectedRegion, setSelectedRegion] = useState(null); // 'b' | 'c' | 'd'
  const [feedback, setFeedback] = useState(null);

  // Initialize intersection puzzle data
  const [puzzleData, setPuzzleData] = useState(() => {
    const rng = createRNG(12345);
    const inter = genIntersection(rng);
    return {
      a: inter.a,
      b: inter.b,
      // Target answers:
      // Region 'a': given known (inter.a)
      // Region 'b': supplementary (inter.b) via adjacent on straight line
      // Region 'c': vertically opposite (inter.a) via vertically opposite
      // Region 'd': supplementary (inter.b) via adjacent on straight line
      solved: { a: inter.a, b: null, c: null, d: null }
    };
  });

  const loadRound = (r) => {
    const rng = createRNG(Date.now() + r * 313);
    const inter = genIntersection(rng);
    setPuzzleData({
      a: inter.a,
      b: inter.b,
      solved: { a: inter.a, b: null, c: null, d: null }
    });
    setSelectedRegion(null);
    setFeedback(null);
  };

  const isRoundComplete =
    puzzleData.solved.b !== null &&
    puzzleData.solved.c !== null &&
    puzzleData.solved.d !== null;

  // Options for active picker
  const getOptionsForRegion = (region) => {
    const correct = region === 'c' ? puzzleData.a : puzzleData.b;
    const rng = createRNG(region.charCodeAt(0) * 17);
    const distractors = makeDistractors(
      correct,
      [puzzleData.a, puzzleData.b, 90, 360 - correct, correct + 15],
      rng,
      3
    );
    return rng.shuffle([correct, ...distractors]);
  };

  const handlePickOption = (val) => {
    playClickSound();
    if (!selectedRegion) return;
    const correct = selectedRegion === 'c' ? puzzleData.a : puzzleData.b;
    const reason = selectedRegion === 'c' ? REASONS.vertOpp : REASONS.line;

    if (val === correct) {
      setPuzzleData(prev => ({
        ...prev,
        solved: { ...prev.solved, [selectedRegion]: val }
      }));
      setFeedback({
        type: 'success',
        msg: `Correct! Region ${selectedRegion.toUpperCase()} is ${val}° (${reason}).`
      });
      setSelectedRegion(null);
    } else {
      setFeedback({
        type: 'error',
        msg: `Not quite! Check whether Region ${selectedRegion.toUpperCase()} is supplementary (adds to 180°) or vertically opposite (equal).`
      });
    }
  };

  const handleNextRound = () => {
    const nextRounds = roundsCompleted + 1;
    setRoundsCompleted(nextRounds);
    if (nextRounds < 2) {
      setRound(2);
      loadRound(2);
    }
  };

  return (
    <Panel className="w-full h-full">
      {/* Header Info */}
      <div className="w-full flex items-center justify-between bg-[#14082c]/90 border border-cyan-400/40 rounded-2xl p-3 shadow-lg">
        <span className="text-xs font-bold text-slate-300">
          Intersection Round {round} of 2 · Find all 3 missing angles
        </span>
        <span className="font-display font-black text-emerald-400">
          Rounds Solved: {roundsCompleted} / 2
        </span>
      </div>

      {/* Intersecting Lines Interactive Diagram */}
      <div className="w-full max-w-md h-56 bg-[#100726]/90 border border-white/10 rounded-3xl p-3 relative flex items-center justify-center">
        <svg viewBox="0 0 320 200" className="w-full h-full">
          {/* Crossing lines */}
          <line x1="30" y1="40" x2="290" y2="160" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
          <line x1="30" y1="160" x2="290" y2="40" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />

          {/* Region A (Given known angle, right) */}
          <circle cx="230" cy="100" r="22" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
          <text x="230" y="105" textAnchor="middle" fill="#ffffff" fontWeight="bold" fontSize="13">
            {puzzleData.a}°
          </text>

          {/* Region B (Top) */}
          <g
            className="cursor-pointer"
            onClick={() => {
              if (puzzleData.solved.b === null) {
                playClickSound();
                setSelectedRegion('b');
              }
            }}
          >
            <circle
              cx="160"
              cy="50"
              r="22"
              fill={puzzleData.solved.b ? '#059669' : selectedRegion === 'b' ? '#d97706' : '#1e1b4b'}
              stroke={selectedRegion === 'b' ? '#facc15' : '#818cf8'}
              strokeWidth="2"
            />
            <text x="160" y="55" textAnchor="middle" fill="#ffffff" fontWeight="bold" fontSize="13">
              {puzzleData.solved.b ? `${puzzleData.solved.b}°` : '? B'}
            </text>
          </g>

          {/* Region C (Left, Vertically opposite to A) */}
          <g
            className="cursor-pointer"
            onClick={() => {
              if (puzzleData.solved.c === null) {
                playClickSound();
                setSelectedRegion('c');
              }
            }}
          >
            <circle
              cx="90"
              cy="100"
              r="22"
              fill={puzzleData.solved.c ? '#059669' : selectedRegion === 'c' ? '#d97706' : '#1e1b4b'}
              stroke={selectedRegion === 'c' ? '#facc15' : '#818cf8'}
              strokeWidth="2"
            />
            <text x="90" y="105" textAnchor="middle" fill="#ffffff" fontWeight="bold" fontSize="13">
              {puzzleData.solved.c ? `${puzzleData.solved.c}°` : '? C'}
            </text>
          </g>

          {/* Region D (Bottom) */}
          <g
            className="cursor-pointer"
            onClick={() => {
              if (puzzleData.solved.d === null) {
                playClickSound();
                setSelectedRegion('d');
              }
            }}
          >
            <circle
              cx="160"
              cy="150"
              r="22"
              fill={puzzleData.solved.d ? '#059669' : selectedRegion === 'd' ? '#d97706' : '#1e1b4b'}
              stroke={selectedRegion === 'd' ? '#facc15' : '#818cf8'}
              strokeWidth="2"
            />
            <text x="160" y="155" textAnchor="middle" fill="#ffffff" fontWeight="bold" fontSize="13">
              {puzzleData.solved.d ? `${puzzleData.solved.d}°` : '? D'}
            </text>
          </g>
        </svg>
      </div>

      {/* Target Selection Prompt or Picker */}
      {selectedRegion && (
        <div className="w-full max-w-md bg-[#180a36] border-2 border-amber-400/50 rounded-2xl p-3 flex flex-col items-center gap-2 fade-in-up">
          <span className="font-display font-900 text-sm text-amber-300">
            Select value for Region {selectedRegion.toUpperCase()}:
          </span>
          <div className="grid grid-cols-4 gap-2 w-full">
            {getOptionsForRegion(selectedRegion).map((opt, i) => (
              <button
                key={i}
                onClick={() => handlePickOption(opt)}
                className="py-2 px-3 rounded-xl border border-white/20 bg-white/10 hover:bg-amber-400 hover:text-slate-950 font-display font-900 text-sm transition cursor-pointer text-white"
              >
                {opt}°
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Instructions if no region active */}
      {!selectedRegion && !isRoundComplete && (
        <p className="text-xs sm:text-sm text-slate-300 font-extrabold text-center">
          Tap an unknown region circle (? B, ? C, or ? D) to pick its missing angle.
        </p>
      )}

      {/* Feedback banner */}
      {feedback && (
        <Msg tone={feedback.type === 'success' ? 'emerald' : 'rose'}>
          {feedback.msg}
        </Msg>
      )}

      {/* Round Complete Transition */}
      {isRoundComplete && roundsCompleted < 1 && (
        <div className="w-full flex flex-col items-center gap-2 fade-in-up">
          <Msg tone="emerald">Round 1 Complete! You applied both intersection angle properties!</Msg>
          <GoldBtn onClick={handleNextRound}>
            Start Round 2 →
          </GoldBtn>
        </div>
      )}

      {/* All 2 Rounds Completed -> Station Gate Passed */}
      {isRoundComplete && roundsCompleted >= 1 && (
        <div className="w-full flex flex-col items-center gap-2 fade-in-up">
          <Msg tone="emerald">Excellent! Both intersection puzzle rounds solved with geometric rigor!</Msg>
          <GoldBtn onClick={onComplete}>
            Complete Station C ✓
          </GoldBtn>
        </div>
      )}
    </Panel>
  );
}
