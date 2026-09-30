import React, { useRef, useState } from 'react';
import { useHeaderHeight } from '../hooks/useHeaderHeight.js';

export function TopNav({
  phase,
  completed = {},
  muted = false,
  onToggleMute,
  onHome,
  onGoPhase,
  slideInfo,
  hasProgress = false
}) {
  const headerRef = useRef(null);
  useHeaderHeight(headerRef);

  const [showConfirmHome, setShowConfirmHome] = useState(false);

  const phases = [
    { num: '01', key: 'wonder', label: 'Wonder', icon: '🔍' },
    { num: '02', key: 'story', label: 'Story', icon: '📖' },
    { num: '03', key: 'simulate', label: 'Simulate', icon: '🧪' },
    { num: '04', key: 'practice', label: 'Practice', icon: '🎮' },
    { num: '05', key: 'reflect', label: 'Reflect', icon: '📝' }
  ];

  const handleHomeClick = () => {
    if (hasProgress) {
      setShowConfirmHome(true);
    } else {
      onHome();
    }
  };

  return (
    <>
      <header
        ref={headerRef}
        className="w-full fixed top-0 left-0 right-0 px-4 sm:px-6 py-3 flex flex-col items-center z-50 pointer-events-none"
      >
        {/* Top Navbar Main Row */}
        <div className="w-full flex items-center justify-between pointer-events-none max-w-7xl gap-2">
          {/* Top Left: Home Button Pill */}
          <button
            onClick={handleHomeClick}
            className="pointer-events-auto bg-[#180c3c]/90 hover:bg-[#25145b] border border-white/25 text-white font-display font-extrabold text-sm sm:text-base md:text-lg px-3.5 sm:px-4.5 py-1.5 sm:py-2 rounded-full shadow-lg backdrop-blur-md flex items-center gap-2 cursor-pointer transition-all duration-200 hover:scale-105 shrink-0"
          >
            <span className="text-base sm:text-lg md:text-xl">🏠</span>
            <span className="font-black tracking-wide">Home</span>
          </button>

          {/* Top Center: Capsule Progress Bar */}
          <nav className="pointer-events-auto bg-[#160a36]/95 border border-white/20 rounded-full px-2.5 sm:px-3.5 py-1.5 shadow-2xl backdrop-blur-md flex items-center gap-1 sm:gap-2 shrink-0">
            {phases.map((p, idx) => {
              const isActive = phase === p.key;

              return (
                <React.Fragment key={p.key}>
                  {idx > 0 && <span className="w-1.5 sm:w-2.5 h-[2px] bg-white/20 shrink-0" />}

                  <button
                    onClick={() => onGoPhase(p.key)}
                    className={`px-2.5 sm:px-3.5 py-1.5 rounded-full font-display font-black text-xs sm:text-sm md:text-base flex items-center gap-1.5 sm:gap-2 transition-all duration-200 cursor-pointer shrink-0 ${
                      isActive
                        ? 'bg-[#3b1c8c] text-white border-2 border-white shadow-[0_0_16px_rgba(255,255,255,0.45)] scale-105'
                        : 'bg-transparent text-slate-200 hover:text-white border border-transparent hover:border-white/10'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 sm:w-6.5 sm:h-6.5 rounded-full text-xs font-black flex items-center justify-center shrink-0 ${
                        isActive ? 'bg-amber-400 text-slate-950 shadow-sm' : 'bg-white/15 text-slate-200'
                      }`}
                    >
                      {p.num}
                    </span>
                    <span className="text-sm sm:text-base">{p.icon}</span>
                    <span className="font-black tracking-tight text-xs sm:text-sm md:text-base">{p.label}</span>
                  </button>
                </React.Fragment>
              );
            })}
          </nav>

          {/* Top Right: Controls (Sound On/Muted + Close Button) */}
          <div className="pointer-events-auto flex items-center gap-2 shrink-0">
            <button
              onClick={onToggleMute}
              className={`px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full font-display font-black text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 transition-all duration-200 cursor-pointer border shadow-lg hover:scale-105 shrink-0 ${
                muted
                  ? 'bg-rose-950/80 border-rose-400/50 text-rose-300'
                  : 'bg-emerald-950/80 border-emerald-400/50 text-emerald-300'
              }`}
            >
              <span className="text-sm sm:text-base">{muted ? '🔇' : '🔊'}</span>
              <span className="font-black">{muted ? 'Muted' : 'Sound On'}</span>
            </button>

            <button
              onClick={handleHomeClick}
              title="Reset or Exit"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-900/80 hover:bg-purple-800 border border-white/20 text-white font-black text-base sm:text-lg flex items-center justify-center shadow-lg transition-all duration-200 cursor-pointer hover:scale-105 shrink-0"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Story Slide Progress Track Bar */}
        {slideInfo && (
          <div className="pointer-events-auto mt-2.5 w-full max-w-xl flex items-center gap-3 fade-in-up">
            <div className="flex-1 bg-white/15 h-3 rounded-full overflow-hidden shadow-inner border border-white/10">
              <div
                className="bg-amber-400 h-full rounded-full transition-all duration-300 shadow-[0_0_12px_rgba(250,204,21,0.8)]"
                style={{ width: `${(slideInfo.current / slideInfo.total) * 100}%` }}
              />
            </div>
            <span className="font-display font-black text-sm sm:text-base md:text-lg text-white shrink-0">
              Case Panel {slideInfo.current} of {slideInfo.total}
            </span>
          </div>
        )}
      </header>

      {/* Confirmation Modal to Prevent Accidental Progress Wipe (TRD §14 R8) */}
      {showConfirmHome && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm fade-in-up">
          <div className="w-full max-w-md bg-[#180a36] border-2 border-purple-400/60 rounded-3xl p-6 shadow-2xl text-center">
            <span className="text-4xl mb-2 block">⚠️</span>
            <h3 className="font-display font-900 text-xl sm:text-2xl md:text-3xl text-white mb-2">
              Return Home?
            </h3>
            <p className="text-slate-200 text-base sm:text-lg mb-5 font-extrabold leading-relaxed">
              Returning Home will restart your active session and reset your streak. Are you sure?
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setShowConfirmHome(false)}
                className="btn-secondary text-sm sm:text-base md:text-lg py-2.5 px-6 rounded-full font-black"
              >
                Keep Investigating
              </button>
              <button
                onClick={() => {
                  setShowConfirmHome(false);
                  onHome();
                }}
                className="btn-gold text-sm sm:text-base md:text-lg py-2.5 px-6 rounded-full font-black"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
