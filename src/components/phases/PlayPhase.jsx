import React, { useState, useEffect, useRef } from 'react';
import { FloatingSymbols } from '../shared/FloatingSymbols.jsx';
import { KingdomMap } from '../gamification/KingdomMap.jsx';
import { QuestionRenderer } from '../quiz/QuestionRenderer.jsx';
import { BossBattleModal } from '../quiz/BossBattleModal.jsx';
import { FeedbackOverlay } from '../shared/FeedbackOverlay.jsx';
import { BadgesModal } from '../gamification/BadgesModal.jsx';
import { generateQuestion, DISTRICTS } from '../../data/questionBank.js';
import { createRNG } from '../../utils/rng.js';
import { calcStars, calcXP } from '../../utils/scoring.js';
import { checkBadges } from '../../utils/badgeEngine.js';
import { narrate, playClickSound } from '../../utils/audio.js';
import {
  playCorrectNarration,
  playWrongNarration,
  playHint1Narration,
  playHint2Narration,
  districtCompleteNarration,
  bossWinNarration
} from '../../utils/narration.js';

const MODES = [
  { id: 'guided', name: 'Guided Practice', icon: '🧭', questions: 5, hints: true, timed: false, lives: null },
  { id: 'independent', name: 'Independent Practice', icon: '📝', questions: 10, hints: false, timed: false, lives: null },
  { id: 'timed', name: 'Timed Challenge', icon: '⏱️', questions: 8, hints: false, timed: true, lives: null },
  { id: 'boss', name: 'Boss Battle', icon: '👑', questions: 5, hints: false, timed: false, lives: 3 }
];

export function PlayPhase({
  muted = false,
  xp = 0,
  streak = 0,
  bestStreak = 0,
  badges = [],
  worldResults = Array(10).fill(null),
  onUpdateScore,
  onGoReflect
}) {
  const [selectedMode, setSelectedMode] = useState('independent');
  const [activeWorld, setActiveWorld] = useState(null); // null = map view, number = quiz view
  const [questions, setQuestions] = useState([]);
  const [qIdx, setQIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [hintLevel, setHintLevel] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(60);
  const [correctInSession, setCorrectInSession] = useState(0);
  const [showBossIntro, setShowBossIntro] = useState(false);
  const [showBadgesModal, setShowBadgesModal] = useState(false);

  const timerRef = useRef(null);
  const rngRef = useRef(createRNG(Date.now()));

  const totalStars = worldResults.reduce((a, b) => a + (b || 0), 0);
  const allWorldsCompleted = worldResults.every(r => r != null && r > 0);

  // Timer for Timed Challenge Mode
  useEffect(() => {
    if (activeWorld !== null && selectedMode === 'timed' && timeLeft > 0 && !feedback) {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(timerRef.current);
            finishQuizSession(correctInSession);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [activeWorld, selectedMode, timeLeft, feedback]);

  const startWorldSession = (worldIdx, modeId = selectedMode) => {
    const modeConfig = MODES.find(m => m.id === modeId) || MODES[1];
    const count = modeConfig.questions;

    // Generate questions for this world session
    const list = [];
    for (let i = 0; i < count; i++) {
      list.push(generateQuestion(worldIdx, i, rngRef.current));
    }

    setQuestions(list);
    setQIdx(0);
    setSelectedOption(null);
    setFeedback(null);
    setHintLevel(0);
    setCorrectInSession(0);
    setTimeLeft(60);
    setLives(modeConfig.lives || 3);

    if (modeId === 'boss') {
      setShowBossIntro(true);
    } else {
      setActiveWorld(worldIdx);
    }
  };

  const handleOptionSelect = (option) => {
    playClickSound();
    if (selectedOption !== null || feedback !== null) return;
    setSelectedOption(option);

    const q = questions[qIdx];
    const isCorrect = option === q.correctAnswer;

    if (isCorrect) {
      const nextCorrect = correctInSession + 1;
      setCorrectInSession(nextCorrect);
      const earnedXP = calcXP({ attempts: 1, hintsUsed: hintLevel, streak: streak + 1 });

      if (!muted) narrate(playCorrectNarration(nextCorrect), true);

      // Check badges
      const newBadges = checkBadges({
        totalCorrect: (onUpdateScore.totalCorrect || 0) + 1,
        streak: streak + 1,
        bestStreak: Math.max(bestStreak, streak + 1),
        totalAnswered: (onUpdateScore.totalAnswered || 0) + 1,
        badges
      });

      onUpdateScore({
        xpDelta: earnedXP,
        isCorrect: true,
        newBadges: newBadges.map(b => b.id)
      });

      setFeedback({
        status: 'correct',
        title: 'Clue Solved! 🎯',
        explanation: q.explanation,
        xpGained: earnedXP,
        badge: newBadges.length > 0 ? newBadges[0] : null
      });
    } else {
      let remainingLives = lives;
      if (selectedMode === 'boss') {
        remainingLives = lives - 1;
        setLives(remainingLives);
      }

      if (!muted) narrate(playWrongNarration(qIdx), true);

      onUpdateScore({
        xpDelta: 0,
        isCorrect: false,
        newBadges: []
      });

      setFeedback({
        status: 'wrong',
        title: remainingLives <= 0 && selectedMode === 'boss' ? 'Out of Detective Lives!' : 'Not Quite! 🔍',
        explanation: q.explanation,
        xpGained: 0,
        badge: null
      });
    }
  };

  const handleNextStep = () => {
    setFeedback(null);
    setSelectedOption(null);
    setHintLevel(0);

    // If boss mode and out of lives -> exit session
    if (selectedMode === 'boss' && lives <= 0) {
      setActiveWorld(null);
      return;
    }

    if (qIdx < questions.length - 1) {
      setQIdx(i => i + 1);
    } else {
      finishQuizSession(correctInSession);
    }
  };

  const finishQuizSession = (correctCount) => {
    const starsEarned = calcStars(correctCount);
    const district = DISTRICTS[activeWorld];

    // If boss won
    if (selectedMode === 'boss' && lives > 0) {
      if (!muted) narrate(bossWinNarration(district.boss.name), true);
    } else if (starsEarned >= 1) {
      if (!muted) narrate(districtCompleteNarration(district.name), true);
    }

    onUpdateScore({
      worldIdx: activeWorld,
      stars: starsEarned,
      bossWon: selectedMode === 'boss' && lives > 0
    });

    setActiveWorld(null);
  };

  const currentQ = questions[qIdx];
  const modeObj = MODES.find(m => m.id === selectedMode);

  return (
    <div className="flex-1 min-h-0 flex flex-col items-center justify-center p-3 sm:p-5 relative overflow-hidden select-none z-10">
      <FloatingSymbols />

      {/* Main Glass Card Frame */}
      <div className="w-full max-w-6xl max-h-[94vh] glass-card flex flex-col items-center text-center fade-in-up z-20 my-auto py-4 sm:py-5 px-5 sm:px-8 overflow-hidden">
        {/* Phase Band */}
        <div className="phase-band phase-band--play mb-2 shrink-0" />

        {/* -------------------------------- VIEW 1: WORLD SELECTION & MODES -------------------------------- */}
        {activeWorld === null && (
          <div className="w-full flex flex-col items-center flex-1 min-h-0 overflow-hidden">
            {/* Header & Stats Bar */}
            <div className="w-full flex items-center justify-between mb-3 shrink-0">
              <div className="flex items-center gap-2.5">
                <span className="text-3xl sm:text-4xl">🎮</span>
                <div className="text-left">
                  <h2 className="text-section-heading text-emerald-200 text-xl sm:text-2xl font-900">
                    Practice Detective Worlds
                  </h2>
                  <span className="text-xs sm:text-sm font-extrabold text-emerald-300">
                    10 MOE Geometry Districts · Need 1★ in World n to unlock World n+1
                  </span>
                </div>
              </div>

              {/* Stats badges */}
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setShowBadgesModal(true)}
                  className="bg-[#14082c]/90 border border-purple-400/40 rounded-full px-3.5 py-1.5 flex items-center gap-1.5 shadow-md cursor-pointer hover:border-amber-400 transition"
                >
                  <span className="text-base">🎖️</span>
                  <span className="font-display font-900 text-white text-xs sm:text-sm">
                    {badges.length} Badges
                  </span>
                </button>

                <div className="bg-[#14082c]/90 border border-emerald-400/40 rounded-full px-3.5 py-1.5 flex items-center gap-1.5 shadow-md">
                  <span className="text-amber-400 text-base">⭐</span>
                  <span className="font-display font-900 text-white text-xs sm:text-sm">
                    {totalStars} / 30
                  </span>
                </div>

                {allWorldsCompleted && (
                  <button
                    onClick={onGoReflect}
                    className="btn-gold text-xs sm:text-sm font-900 px-4 py-2 shadow-lg cursor-pointer animate-bounce"
                  >
                    Go to Reflect 📝
                  </button>
                )}
              </div>
            </div>

            {/* Mode Selector Tabs (PRD §5: Guided, Independent, Timed, Boss) */}
            <div className="w-full max-w-2xl bg-[#120726]/80 border border-white/10 rounded-2xl p-1.5 mb-3 flex items-center justify-center gap-1.5 shrink-0">
              {MODES.map(m => {
                const isActive = selectedMode === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMode(m.id)}
                    className={`flex-1 py-1.5 px-2 rounded-xl font-display font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition cursor-pointer ${
                      isActive
                        ? 'bg-emerald-500 text-slate-950 shadow-md font-900 scale-[1.02]'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>{m.icon}</span>
                    <span className="truncate">{m.name}</span>
                  </button>
                );
              })}
            </div>

            {/* World Map Grid */}
            <div className="w-full flex-1 min-h-0 overflow-y-auto">
              <KingdomMap
                worldResults={worldResults}
                onSelectWorld={wIdx => startWorldSession(wIdx, selectedMode)}
                totalStars={totalStars}
                onGoReflect={onGoReflect}
                allCompleted={allWorldsCompleted}
              />
            </div>
          </div>
        )}

        {/* -------------------------------- VIEW 2: ACTIVE QUIZ VIEW -------------------------------- */}
        {activeWorld !== null && currentQ && (
          <div className="w-full flex flex-col items-center flex-1 min-h-0 overflow-hidden justify-between">
            {/* Top Quiz Stats Bar */}
            <div className="w-full max-w-4xl flex items-center justify-between border-b border-white/10 pb-2.5 mb-2.5 shrink-0">
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setActiveWorld(null)}
                  className="bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold px-3.5 py-1.5 rounded-full transition cursor-pointer"
                >
                  ← Map
                </button>
                <span className="font-display font-900 text-base sm:text-lg text-white">
                  {DISTRICTS[activeWorld].name}
                </span>
                <span className="text-xs sm:text-sm text-slate-300 bg-white/10 px-2.5 py-0.5 rounded-md font-bold">
                  Q{qIdx + 1}/{questions.length}
                </span>
              </div>

              {/* Mode Specific Stats (Stars, Lives, Timer, Streak) */}
              <div className="flex items-center gap-3">
                {selectedMode === 'boss' && (
                  <div className="flex items-center gap-1.5 bg-rose-950/70 border border-rose-400/40 px-3 py-1 rounded-full text-rose-300 text-xs sm:text-sm font-bold">
                    <span>Lives:</span>
                    <span>{'❤️'.repeat(lives)}</span>
                  </div>
                )}

                {selectedMode === 'timed' && (
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs sm:text-sm font-black ${
                    timeLeft <= 10 ? 'bg-rose-950/80 border-rose-400 text-rose-300 animate-pulse' : 'bg-white/10 border-white/20 text-amber-300'
                  }`}>
                    <span>⏱️</span>
                    <span>{timeLeft}s</span>
                  </div>
                )}

                <div className="flex items-center gap-1.5 bg-[#14082c]/90 border border-amber-400/40 px-3 py-1 rounded-full text-xs sm:text-sm font-black text-amber-300">
                  <span>🔥</span>
                  <span>Streak: {streak}</span>
                </div>

                <div className="flex items-center gap-1.5 bg-[#14082c]/90 border border-purple-400/40 px-3 py-1 rounded-full text-xs sm:text-sm font-black text-purple-200">
                  <span>✨</span>
                  <span>{xp} XP</span>
                </div>
              </div>
            </div>

            {/* Question Renderer */}
            <QuestionRenderer
              question={currentQ}
              selectedOption={selectedOption}
              onSelectOption={handleOptionSelect}
              showHints={selectedMode === 'guided'}
              hintLevel={hintLevel}
              onUseHint={() => {
                const nextHint = hintLevel + 1;
                setHintLevel(nextHint);
                if (!muted) {
                  if (nextHint === 1) narrate(playHint1Narration(currentQ.hint1), true);
                  else narrate(playHint2Narration(currentQ.hint2), true);
                }
              }}
              disabled={selectedOption !== null}
            />
          </div>
        )}
      </div>

      {/* Boss Intro Modal */}
      {showBossIntro && (
        <BossBattleModal
          boss={DISTRICTS[activeWorld]?.boss}
          lives={3}
          onStart={() => {
            setShowBossIntro(false);
            setActiveWorld(activeWorld);
          }}
          onClose={() => {
            setShowBossIntro(false);
            setActiveWorld(null);
          }}
        />
      )}

      {/* Answer Feedback Overlay */}
      {feedback && (
        <FeedbackOverlay
          status={feedback.status}
          title={feedback.title}
          explanation={feedback.explanation}
          xpGained={feedback.xpGained}
          badge={feedback.badge}
          onNext={handleNextStep}
          nextLabel={qIdx < questions.length - 1 ? 'Next Question →' : 'Finish District ✓'}
        />
      )}

      {/* Badges Modal */}
      {showBadgesModal && (
        <BadgesModal
          unlockedBadges={badges}
          onClose={() => setShowBadgesModal(false)}
        />
      )}
    </div>
  );
}
