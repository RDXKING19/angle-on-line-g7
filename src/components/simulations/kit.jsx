import React from 'react';

const TONES = {
  cyan:    'border-cyan-400 bg-cyan-950/80 text-cyan-100 shadow-[0_0_16px_rgba(56,189,248,0.45)]',
  amber:   'border-amber-400 bg-amber-950/80 text-amber-100 shadow-[0_0_16px_rgba(251,191,36,0.45)]',
  emerald: 'border-emerald-400 bg-emerald-950/80 text-emerald-100 shadow-[0_0_16px_rgba(52,211,153,0.45)]',
  rose:    'border-rose-400 bg-rose-950/80 text-rose-100 shadow-[0_0_16px_rgba(244,63,94,0.45)]',
  purple:  'border-purple-400 bg-purple-950/80 text-purple-100 shadow-[0_0_16px_rgba(168,85,247,0.45)]',
  ghost:   'border-white/20 border-dashed bg-white/5 text-white/40'
};

export function Panel({ children, className = '' }) {
  return (
    <div
      className={`flex flex-col items-center gap-3 bg-[#1e1342]/95 border-2 border-cyan-400/40 rounded-2xl p-3 sm:p-4 shadow-xl flex-1 min-h-0 overflow-y-auto ${className}`}
    >
      {children}
    </div>
  );
}

export function Node({ tone = 'cyan', children, w = 'w-24', className = '' }) {
  return (
    <div
      className={`${w} h-12 rounded-2xl border-2 font-display font-900 text-lg sm:text-xl flex items-center justify-center text-center transition-all duration-300 ${TONES[tone] || TONES.cyan} ${className}`}
    >
      {children}
    </div>
  );
}

export function Msg({ tone = 'emerald', children }) {
  const cls = {
    emerald: 'bg-emerald-950/90 text-emerald-300 border-emerald-400/60 shadow-[0_0_14px_rgba(52,211,153,0.3)]',
    rose: 'bg-rose-950/90 text-rose-300 border-rose-400/60 shadow-[0_0_14px_rgba(244,63,94,0.3)]',
    amber: 'bg-amber-950/90 text-amber-200 border-amber-400/50 shadow-[0_0_14px_rgba(251,191,36,0.3)]',
    cyan: 'bg-cyan-950/90 text-cyan-200 border-cyan-400/50 shadow-[0_0_14px_rgba(56,189,248,0.3)]'
  }[tone] || 'bg-cyan-950/90 text-cyan-200 border-cyan-400/50';

  return (
    <div className={`w-full px-4 py-2.5 rounded-2xl border-2 text-sm sm:text-base font-900 text-center fade-in-up shrink-0 ${cls}`}>
      {children}
    </div>
  );
}

export const GoldBtn = ({ children, onClick, disabled = false, className = '' }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`btn-gold text-sm sm:text-base font-900 px-6 py-2.5 shadow-lg hover:scale-105 transition cursor-pointer shrink-0 disabled:opacity-40 disabled:cursor-not-allowed ${className}`}
  >
    {children}
  </button>
);

export const GhostBtn = ({ children, onClick, disabled = false, active = false, className = '' }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`font-display font-900 text-xs sm:text-sm px-4 py-2.5 rounded-xl border transition cursor-pointer shrink-0 disabled:opacity-40 disabled:cursor-not-allowed ${
      active
        ? 'bg-cyan-400 text-slate-950 border-cyan-200 shadow-[0_0_14px_rgba(56,189,248,0.6)]'
        : 'bg-purple-900/80 hover:bg-purple-800 border-purple-400/50 text-purple-100'
    } ${className}`}
  >
    {children}
  </button>
);

/**
 * Accessible Angle Slider with keyboard buttons (- / +) and step=5
 */
export function AngleSlider({ value, min = 10, max = 170, step = 5, onChange, label = 'Angle' }) {
  const dec = () => onChange(Math.max(min, value - step));
  const inc = () => onChange(Math.min(max, value + step));

  return (
    <div className="w-full flex items-center gap-3 bg-[#13082b]/80 border border-white/15 px-4 py-2.5 rounded-2xl">
      <span className="font-display font-900 text-xs sm:text-sm text-slate-300 min-w-[70px]">
        {label}: <span className="text-amber-300 font-mono">{value}°</span>
      </span>

      <button
        onClick={dec}
        disabled={value <= min}
        className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white font-black text-base flex items-center justify-center transition disabled:opacity-30 cursor-pointer"
        title="Decrease 5°"
      >
        −
      </button>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="flex-1 accent-amber-400 cursor-pointer"
      />

      <button
        onClick={inc}
        disabled={value >= max}
        className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white font-black text-base flex items-center justify-center transition disabled:opacity-30 cursor-pointer"
        title="Increase 5°"
      >
        +
      </button>
    </div>
  );
}
