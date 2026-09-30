import React, { useState, useRef, useEffect } from 'react';
import { Panel, Msg, GoldBtn } from './kit.jsx';

export function ProtractorWorkshop({ onComplete, audioEnabled = true }) {
  const [angle, setAngle] = useState(60); // 0 to 180
  const [buckets, setBuckets] = useState(new Set([Math.floor(60 / 15)]));
  const [isDragging, setIsDragging] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizState, setQuizState] = useState(null); // 'correct' | 'wrong' | null
  const [isCompleted, setIsCompleted] = useState(false);

  const svgRef = useRef(null);

  const leftAngle = angle;
  const rightAngle = 180 - angle;

  // Add bucket on angle change
  useEffect(() => {
    const b = Math.floor(angle / 15);
    setBuckets(prev => new Set([...prev, b]));
  }, [angle]);

  const hasExploredEnough = buckets.size >= 3;

  // Calculate angle from mouse/touch event using inverse CTM
  const updateAngleFromPointer = (e) => {
    if (!svgRef.current) return;
    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX || (e.touches && e.touches[0].clientX);
    pt.y = e.clientY || (e.touches && e.touches[0].clientY);

    const ctm = svg.getScreenCTM();
    if (!ctm) return;
    const svgPt = pt.matrixTransform(ctm.inverse());

    const originX = 160;
    const originY = 160;
    const dx = svgPt.x - originX;
    const dy = originY - svgPt.y; // SVG y points down

    let deg = Math.round((Math.atan2(dy, dx) * 180) / Math.PI);
    if (deg < 0) deg = 0;
    if (deg > 180) deg = 180;
    // Snap to 5° steps
    deg = Math.round(deg / 5) * 5;
    if (deg >= 5 && deg <= 175) {
      setAngle(deg);
    }
  };

  const handlePointerDown = (e) => {
    setIsDragging(true);
    updateAngleFromPointer(e);
  };

  const handlePointerMove = (e) => {
    if (isDragging) updateAngleFromPointer(e);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const checkAnswer = (ans) => {
    setSelectedAnswer(ans);
    if (ans === 'straight') {
      setQuizState('correct');
      setIsCompleted(true);
    } else {
      setQuizState('wrong');
    }
  };

  // SVG trigonometry
  const r = 110;
  const rad = (angle * Math.PI) / 180;
  const rayX = 160 + r * Math.cos(rad);
  const rayY = 160 - r * Math.sin(rad);

  return (
    <Panel className="w-full h-full">
      {/* Readout Header Card */}
      <div className="w-full bg-[#14082c]/90 border border-cyan-400/40 rounded-2xl p-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Live Angle Equation:</span>
        </div>
        <div className="font-display font-900 text-lg sm:text-xl text-white">
          <span className="text-cyan-300">{leftAngle}°</span>
          <span className="text-white/40 mx-2">+</span>
          <span className="text-amber-300">{rightAngle}°</span>
          <span className="text-white/40 mx-2">=</span>
          <span className="text-emerald-400">180°</span>
        </div>
      </div>

      {/* Interactive Protractor SVG */}
      <div
        className="w-full max-w-sm h-52 bg-[#100726]/90 border border-white/10 rounded-2xl p-2 flex items-center justify-center relative select-none"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <svg
          ref={svgRef}
          viewBox="0 0 320 200"
          className="w-full h-full"
          onPointerDown={handlePointerDown}
        >
          {/* Protractor Semi-Circle Frame */}
          <path
            d="M 40 160 A 120 120 0 0 1 280 160 Z"
            fill="#180e38"
            stroke="#475569"
            strokeWidth="2"
          />

          {/* Protractor degree tick marks */}
          {[0, 30, 45, 60, 90, 120, 135, 150, 180].map((t) => {
            const tr = (t * Math.PI) / 180;
            const x1 = 160 + 115 * Math.cos(tr);
            const y1 = 160 - 115 * Math.sin(tr);
            const x2 = 160 + 120 * Math.cos(tr);
            const y2 = 160 - 120 * Math.sin(tr);
            return <line key={t} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#94a3b8" strokeWidth="1.5" />;
          })}

          {/* Base Horizontal Straight Line */}
          <line x1="20" y1="160" x2="300" y2="160" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />

          {/* Left Angle Arc (0 to angle) */}
          <path
            d={`M ${160 + 45 * Math.cos(rad)} ${160 - 45 * Math.sin(rad)} A 45 45 0 0 1 205 160`}
            fill="none"
            stroke="#38bdf8"
            strokeWidth="3.5"
          />
          {/* Right Angle Arc (angle to 180) */}
          <path
            d={`M 115 160 A 45 45 0 0 1 ${160 + 45 * Math.cos(rad)} ${160 - 45 * Math.sin(rad)}`}
            fill="none"
            stroke="#fbbf24"
            strokeWidth="3.5"
          />

          {/* Draggable Rotating Ray */}
          <line
            x1="160"
            y1="160"
            x2={rayX}
            y2={rayY}
            stroke="#facc15"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* Draggable Handle on Ray End */}
          <circle
            cx={rayX}
            cy={rayY}
            r="12"
            fill="#facc15"
            stroke="#ffffff"
            strokeWidth="3"
            className="cursor-pointer hover:scale-110 transition-transform"
          />

          {/* Center Vertex Pivot */}
          <circle cx="160" cy="160" r="5" fill="#f472b6" />
        </svg>
      </div>

      {/* Keyboard Controls */}
      <div className="flex items-center gap-3 w-full justify-center">
        <button
          onClick={() => setAngle(a => Math.max(10, a - 5))}
          className="btn-secondary text-sm py-1.5 px-4"
        >
          − 5° Left
        </button>
        <span className="text-xs text-slate-300 font-extrabold">
          Rotations Explored: <span className="text-cyan-300 font-bold">{buckets.size} / 3</span>
        </span>
        <button
          onClick={() => setAngle(a => Math.min(170, a + 5))}
          className="btn-secondary text-sm py-1.5 px-4"
        >
          + 5° Right
        </button>
      </div>

      {/* Understanding-Gate Confirmation Question (unlocks after exploring >= 3 positions) */}
      {hasExploredEnough && !isCompleted && (
        <div className="w-full bg-[#13082b]/95 border border-purple-400/40 rounded-2xl p-4 flex flex-col items-center gap-3 fade-in-up">
          <p className="font-display font-900 text-sm sm:text-base text-white text-center">
            Detective Check: Why do these two angles always add up to 180°, no matter where the ray points?
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full">
            <button
              onClick={() => checkAnswer('straight')}
              className={`p-3 rounded-xl border text-xs sm:text-sm font-bold text-left transition ${
                selectedAnswer === 'straight'
                  ? 'border-emerald-400 bg-emerald-950/80 text-white'
                  : 'border-white/15 bg-white/5 text-slate-200 hover:border-cyan-400'
              }`}
            >
              ✓ Together they form a straight angle on a flat line.
            </button>
            <button
              onClick={() => checkAnswer('vert')}
              className={`p-3 rounded-xl border text-xs sm:text-sm font-bold text-left transition ${
                selectedAnswer === 'vert'
                  ? 'border-rose-400 bg-rose-950/80 text-white'
                  : 'border-white/15 bg-white/5 text-slate-200 hover:border-cyan-400'
              }`}
            >
              ✗ Because the ray divides the circle into quarters.
            </button>
          </div>
          {quizState === 'wrong' && (
            <Msg tone="rose">Not quite! Notice that the two angles lie along the flat horizontal straight line.</Msg>
          )}
        </div>
      )}

      {/* Success banner and Station Completion Button */}
      {isCompleted && (
        <div className="w-full flex flex-col items-center gap-3 fade-in-up">
          <Msg tone="emerald">
            🎉 Discovery Confirmed! Adjacent angles on a straight line always sum to 180°!
          </Msg>
          <GoldBtn onClick={onComplete}>
            Complete Station A ✓
          </GoldBtn>
        </div>
      )}
    </Panel>
  );
}
