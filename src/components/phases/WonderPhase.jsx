import React, { useEffect } from 'react';
import { FloatingSymbols } from '../shared/FloatingSymbols.jsx';
import { AngleVisual } from '../shared/AngleVisual.jsx';
import { narrate, stopNarration } from '../../utils/audio.js';
import { wonderNarration } from '../../utils/narration.js';

export function WonderPhase({ muted, onNext }) {
  useEffect(() => {
    if (!muted) narrate(wonderNarration(), true);
    return () => stopNarration();
  }, [muted]);

  return (
    <div className="flex-1 min-h-0 flex flex-col items-center justify-center p-3 sm:p-5 relative overflow-hidden select-none z-10">
      <FloatingSymbols />

      <div className="w-full max-w-2xl glass-card flex flex-col items-center text-center fade-in-up z-20 my-auto py-5 px-6">
        {/* Glowing Phase Band */}
        <div className="phase-band phase-band--wonder" />

        <div className="flex items-center gap-2 mb-2">
          <span className="text-3xl">🔍</span>
          <span className="text-purple-300 font-display font-800 text-sm sm:text-base tracking-wider uppercase">
            Phase 1: Wonder & Curiosity
          </span>
        </div>

        <h2 className="text-main-heading text-purple-200 mb-2 max-w-xl">
          The Mystery of the Leaning Sign
        </h2>

        {/* Feature Visual Box */}
        <div className="w-full bg-[#1e143c]/90 border border-purple-400/30 rounded-2xl p-4 mb-3 flex flex-col items-center shadow-xl">
          <div className="w-full max-w-xs h-40 flex items-center justify-center mb-2">
            <AngleVisual type="road-sign" compact />
          </div>
          <div className="text-number text-amber-300 text-2xl sm:text-3xl mb-1">
            Visible Angle = 132° · Hidden Angle = ?
          </div>
          <p className="text-body text-slate-200 text-sm sm:text-base max-w-lg leading-relaxed font-extrabold">
            Amirah and Wei Jie spot a bent road sign fixed to a vertical post. Wei Jie measures the lower angle at 132°. Can we calculate the missing hidden angle above it without needing a protractor?
          </p>
        </div>

        {/* Mascot Thinking Bubble */}
        <div className="flex items-center gap-3 bg-[#14082c]/80 border border-purple-500/30 rounded-full px-5 py-2.5 mb-4">
          <div className="w-8 h-8 rounded-full bg-purple-500/30 text-purple-200 flex items-center justify-center font-bold text-sm shrink-0">
            🦉
          </div>
          <p className="text-slate-200 text-sm sm:text-base font-bold text-left">
            "What if you could find a hidden angle just by knowing what's next to it?"
          </p>
        </div>

        <button onClick={onNext} className="btn-gold text-base sm:text-lg flex items-center gap-2 cursor-pointer">
          <span>Explore the Case Files</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
}
