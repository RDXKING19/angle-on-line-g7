import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { FloatingSymbols } from '../shared/FloatingSymbols.jsx';
import { narrate, stopNarration, playClickSound } from '../../utils/audio.js';
import { reflectNarration, reflectCompleteNarration } from '../../utils/narration.js';
import { WORLDS } from '../../config/worlds.config.js';

const RECAP_QUESTIONS = [
  {
    id: 1,
    q: "Three angles sit side by side along a straight line. What must they add up to?",
    options: ["180°", "360°", "90°", "270°"],
    correct: "180°",
    explanation: "Angles along a straight line always form a straight angle of 180°."
  },
  {
    id: 2,
    q: "Two straight lines cross and one angle is 65°. Which angles are equal to each other?",
    options: [
      "The 65° angle and the angle directly opposite it",
      "The 65° angle and an angle next to it",
      "All four angles",
      "None of them"
    ],
    correct: "The 65° angle and the angle directly opposite it",
    explanation: "Vertically opposite angles are equal to each other."
  },
  {
    id: 3,
    q: "Four angles meet at a point: 100°, 80°, 70° and x. Wei Jie writes x = 180° − 250°. What is wrong?",
    options: [
      "He should have used 360°, because the angles are at a point",
      "He should have added, not subtracted",
      "He should have used 90°",
      "Nothing is wrong"
    ],
    correct: "He should have used 360°, because the angles are at a point",
    explanation: "Angles meeting around a common vertex point make a full turn and total 360°."
  }
];

export function ReflectPhase({
  xp = 0,
  stars = 0,
  bestStreak = 0,
  badges = [],
  worldResults = Array(10).fill(null),
  muted = false,
  onComplete
}) {
  const [recapIdx, setRecapIdx] = useState(0);
  const [recapAnswers, setRecapAnswers] = useState({});
  const [recapCompleted, setRecapCompleted] = useState(false);
  const [reflectionText, setReflectionText] = useState('');
  const [recapFeedback, setRecapFeedback] = useState(null);

  const minLength = 10;
  const currentRecapQ = RECAP_QUESTIONS[recapIdx];

  useEffect(() => {
    if (!muted) narrate(reflectNarration(), true);
    return () => stopNarration();
  }, [muted]);

  const handleRecapSelect = (opt) => {
    playClickSound();
    const isCorrect = opt === currentRecapQ.correct;
    setRecapAnswers(prev => ({ ...prev, [currentRecapQ.id]: opt }));

    if (isCorrect) {
      setRecapFeedback({ status: 'correct', text: currentRecapQ.explanation });
    } else {
      setRecapFeedback({ status: 'wrong', text: `Review the rule: ${currentRecapQ.explanation}` });
    }
  };

  const handleNextRecap = () => {
    setRecapFeedback(null);
    if (recapIdx < RECAP_QUESTIONS.length - 1) {
      setRecapIdx(i => i + 1);
    } else {
      setRecapCompleted(true);
    }
  };

  const handleSubmit = () => {
    if (!muted) narrate(reflectCompleteNarration(), true);
    try {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    } catch (e) {
      // Ignore
    }
    onComplete();
  };

  const charCount = reflectionText.trim().length;

  return (
    <div className="flex-1 min-h-0 flex flex-col items-center justify-center p-3 sm:p-5 relative overflow-hidden select-none z-10">
      <FloatingSymbols />

      <div className="w-full max-w-4xl max-h-[94vh] reflect-card bg-[#160b38]/95 border-2 border-purple-400/40 rounded-3xl p-5 sm:p-7 shadow-2xl backdrop-blur-md flex flex-col items-center fade-in-up z-20 my-auto overflow-y-auto">
        {/* Accent Bar */}
        <div className="w-24 h-2 bg-purple-400 rounded-full mb-2.5 shadow-[0_0_18px_rgba(168,85,247,0.85)] shrink-0" />

        {/* Header */}
        <h2 className="font-display font-900 text-2xl sm:text-3xl text-white mb-3.5 flex items-center gap-2.5 shrink-0">
          <span className="text-3xl sm:text-4xl">🏆</span>
          <span>Detective Debrief & Scorecard</span>
        </h2>

        {/* ---------------- PART 1: 3-QUESTION CONCEPTUAL RECAP ---------------- */}
        {!recapCompleted && (
          <div className="w-full bg-[#1e1044]/95 border-2 border-purple-400/40 rounded-2xl p-4 sm:p-5 flex flex-col items-center gap-3.5 mb-4 shrink-0 fade-in-up">
            <div className="w-full flex items-center justify-between">
              <span className="text-sm font-bold text-amber-300 uppercase tracking-wider">
                📝 Conceptual Debrief Quiz (Question {recapIdx + 1} of 3)
              </span>
              <span className="text-sm text-slate-300 font-bold">
                Targets: Line vs. Point vs. Mirror Rules
              </span>
            </div>

            <p className="font-display font-900 text-lg sm:text-xl text-white text-center leading-snug">
              {currentRecapQ.q}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
              {currentRecapQ.options.map((opt, i) => {
                const isSelected = recapAnswers[currentRecapQ.id] === opt;
                const isCorrect = opt === currentRecapQ.correct;
                const showResult = isSelected && recapFeedback;

                return (
                  <button
                    key={i}
                    onClick={() => handleRecapSelect(opt)}
                    className={`p-3.5 rounded-xl border-2 font-display text-sm sm:text-base text-left transition cursor-pointer ${
                      showResult
                        ? isCorrect
                          ? 'border-emerald-400 bg-emerald-950/80 text-white'
                          : 'border-rose-400 bg-rose-950/80 text-white'
                        : isSelected
                        ? 'border-amber-400 bg-[#32175c] text-white'
                        : 'border-white/15 bg-white/5 text-slate-200 hover:border-cyan-400'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {recapFeedback && (
              <div className="w-full flex items-center justify-between mt-1 gap-2">
                <span className={`text-sm font-extrabold ${recapFeedback.status === 'correct' ? 'text-emerald-300' : 'text-rose-300'}`}>
                  {recapFeedback.text}
                </span>
                <button
                  onClick={handleNextRecap}
                  className="btn-gold text-sm font-900 py-2 px-6 rounded-full shrink-0"
                >
                  {recapIdx < RECAP_QUESTIONS.length - 1 ? 'Next Question →' : 'View Final Scorecard ✓'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ---------------- PART 2: SCORECARD & REFLECTION (Visible when recap completed) ---------------- */}
        {recapCompleted && (
          <div className="w-full flex flex-col items-center fade-in-up">
            {/* Top 3 Score Cards */}
            <div className="grid grid-cols-3 gap-3 w-full mb-3.5 shrink-0">
              <div className="bg-[#1a0e42]/95 border-2 border-purple-400/35 rounded-2xl p-3 sm:p-4 flex flex-col items-center text-center shadow-lg">
                <span className="text-2xl mb-0.5">✨</span>
                <span className="font-display font-900 text-2xl sm:text-3xl text-amber-400">{xp}</span>
                <span className="text-xs sm:text-sm font-900 text-slate-200">Total XP</span>
              </div>

              <div className="bg-[#1a0e42]/95 border-2 border-purple-400/35 rounded-2xl p-3 sm:p-4 flex flex-col items-center text-center shadow-lg">
                <span className="text-2xl mb-0.5">⭐</span>
                <span className="font-display font-900 text-2xl sm:text-3xl text-amber-400">{stars} / 30</span>
                <span className="text-xs sm:text-sm font-900 text-slate-200">Stars</span>
              </div>

              <div className="bg-[#1a0e42]/95 border-2 border-purple-400/35 rounded-2xl p-3 sm:p-4 flex flex-col items-center text-center shadow-lg">
                <span className="text-2xl mb-0.5">🔥</span>
                <span className="font-display font-900 text-2xl sm:text-3xl text-amber-400">{bestStreak}</span>
                <span className="text-xs sm:text-sm font-900 text-slate-200">Best Streak</span>
              </div>
            </div>

            {/* World Results Strip */}
            <div className="w-full flex flex-col items-center mb-3 shrink-0">
              <span className="text-xs font-900 text-amber-400 tracking-wider uppercase mb-1.5">
                DISTRICT CASE RESULTS
              </span>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 w-full">
                {WORLDS.map((w, idx) => {
                  const res = worldResults[idx];
                  return (
                    <div
                      key={w.id}
                      className="bg-[#1a0e42]/80 border border-purple-400/30 rounded-xl p-1.5 flex flex-col items-center justify-between text-center min-h-[50px] shadow-sm"
                    >
                      <span className="text-[11px] font-black text-slate-300">W{idx + 1}</span>
                      <span className="text-xs font-900 text-amber-400 mt-0.5">
                        {res != null && res > 0 ? `${res}★` : '—'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reflection Textarea to Tally */}
            <div className="w-full flex items-start gap-3.5 mb-4 shrink-0">
              <div className="w-14 h-14 rounded-full bg-[#1e0e4a] border-2 border-amber-400 flex items-center justify-center text-3xl shadow-lg shrink-0 mt-1">
                🦉
              </div>

              <div className="flex-1 flex flex-col text-left">
                <h3 className="font-display font-900 text-base sm:text-lg text-white mb-1.5 leading-tight">
                  Explain the angles-at-a-point rule to Inspector Tally:
                </h3>

                <div className="w-full bg-[#0e0626] border-2 border-purple-400/40 rounded-2xl p-3 flex flex-col relative shadow-inner">
                  <textarea
                    rows="3"
                    value={reflectionText}
                    onChange={e => setReflectionText(e.target.value)}
                    placeholder="Dear Inspector Tally, angles at a point add up to 360° because..."
                    className="w-full bg-transparent text-base sm:text-lg font-extrabold text-white placeholder-slate-400 outline-none resize-none font-sans"
                  />
                  <div className="text-xs sm:text-sm font-black text-slate-300 text-right mt-1">
                    {charCount} / {minLength} min characters
                  </div>
                </div>
              </div>
            </div>

            {/* Complete Lesson Button */}
            <button
              disabled={charCount < minLength}
              onClick={handleSubmit}
              className="btn-gold font-display font-900 text-base sm:text-lg px-8 py-3 rounded-full shadow-[0_0_25px_rgba(250,204,21,0.65)] hover:scale-105 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            >
              Complete Detective Mission! 🎖️
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function CelebrationScreen({ xp, stars, bestStreak, muted, onRestart }) {
  useEffect(() => {
    try {
      confetti({ particleCount: 160, spread: 90, origin: { y: 0.5 } });
    } catch (e) {
      // Ignore
    }
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden select-none z-20 bg-[#0c0424]">
      <FloatingSymbols />

      <div className="w-full max-w-md glass-card flex flex-col items-center text-center fade-in-up z-30 my-auto py-6 px-6">
        <span className="text-6xl mb-2 animate-bounce">🎖️🦉</span>

        <div className="bg-[#1c0d38] border border-amber-400/40 text-amber-300 text-xs font-bold px-4 py-1 rounded-full mb-2">
          Singapore MOE Grade 7 Geometry Mastered!
        </div>

        <h1 className="font-display font-900 text-2xl sm:text-3xl text-white mb-2">
          Chief Angle Detective!
        </h1>

        <p className="text-slate-300 text-xs sm:text-sm mb-4 leading-relaxed font-extrabold">
          Congratulations! You have mastered straight line angles (180°), angles around a point (360°), and vertically opposite angle equalities across all 10 districts!
        </p>

        {/* Scoreboard summary */}
        <div className="grid grid-cols-2 gap-3 w-full mb-5">
          <div className="bg-[#1e1342] border border-purple-400/30 rounded-2xl p-2.5 text-center">
            <span className="text-xs text-slate-400 font-bold block">TOTAL XP</span>
            <span className="font-display font-900 text-2xl text-amber-300">{xp}</span>
          </div>
          <div className="bg-[#1e1342] border border-purple-400/30 rounded-2xl p-2.5 text-center">
            <span className="text-xs text-slate-400 font-bold block">TOTAL STARS</span>
            <span className="font-display font-900 text-2xl text-amber-300">{stars} / 30</span>
          </div>
        </div>

        <button
          onClick={onRestart}
          className="btn-gold font-display font-900 text-base py-3 px-8 rounded-full shadow-xl hover:scale-105 transition cursor-pointer"
        >
          Investigate Again 🚀
        </button>
      </div>
    </div>
  );
}
