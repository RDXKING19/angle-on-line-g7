import React, { useState, useEffect } from 'react';
import { FloatingSymbols } from '../shared/FloatingSymbols.jsx';
import { narrate, stopNarration } from '../../utils/audio.js';
import { simStationIntro } from '../../utils/narration.js';
import { ProtractorWorkshop } from '../simulations/ProtractorWorkshop.jsx';
import { MatchTheMissingAngle } from '../simulations/MatchTheMissingAngle.jsx';
import { IntersectionPuzzle } from '../simulations/IntersectionPuzzle.jsx';
import { RadiantPointLab } from '../simulations/RadiantPointLab.jsx';

const STATIONS = [
  {
    id: 0,
    icon: '📐',
    name: 'Station A: Protractor Workshop',
    sub: 'Rotate rays and prove the 180° line rule',
    Comp: ProtractorWorkshop
  },
  {
    id: 1,
    icon: '🎯',
    name: 'Station B: Missing Angle Match',
    sub: 'Build-to-target slider challenge',
    Comp: MatchTheMissingAngle
  },
  {
    id: 2,
    icon: '✖️',
    name: 'Station C: Intersection Puzzle',
    sub: 'Composite angles at crossing lines',
    Comp: IntersectionPuzzle
  },
  {
    id: 3,
    icon: '🧭',
    name: 'Station D: 360° Radiant Point Lab',
    sub: 'Drag rays & explore the 360° full circle rule',
    Comp: RadiantPointLab
  }
];

export function SimulatePhase({ muted, onNext, simCompleted = [false, false, false, false], onCompleteStation }) {
  const [stationIdx, setStationIdx] = useState(0);

  const currentStation = STATIONS[stationIdx];
  const CurrentComp = currentStation.Comp;

  const allStationsComplete = simCompleted.every(Boolean);

  useEffect(() => {
    if (!muted) narrate(simStationIntro(stationIdx), true);
    return () => stopNarration();
  }, [stationIdx, muted]);

  const handleStationFinished = () => {
    if (onCompleteStation) {
      onCompleteStation(stationIdx);
    }
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col items-center justify-center p-3 sm:p-5 relative overflow-hidden select-none z-10">
      <FloatingSymbols />

      {/* Main Simulation Stations Card */}
      <div className="w-full max-w-6xl max-h-[94vh] sim-card bg-[#160b36]/95 border-2 border-purple-400/40 rounded-3xl p-4 sm:p-6 shadow-2xl backdrop-blur-md flex flex-col items-center fade-in-up z-20 my-auto overflow-hidden">
        {/* Cyan Accent Bar */}
        <div className="sim-accent w-24 h-2 bg-cyan-400 rounded-full mb-2 shadow-[0_0_18px_rgba(56,189,248,0.85)] shrink-0" />

        {/* Card Header Title */}
        <h2 className="sim-title font-display font-900 text-xl sm:text-2xl text-white flex items-center gap-2.5 mb-3 shrink-0">
          <span className="text-2xl sm:text-3xl">🧪</span>
          <span>Detective Simulation Lab — 4 Investigation Stations</span>
        </h2>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 w-full items-stretch flex-1 min-h-0 overflow-hidden">
          {/* Left Column: Station Sidebar Tabs */}
          <div className="md:col-span-4 flex flex-col justify-between gap-3 shrink-0">
            <div className="flex flex-col gap-2.5">
              {STATIONS.map((st, i) => {
                const isSelected = stationIdx === i;
                const isDone = simCompleted[i];

                return (
                  <button
                    key={st.id}
                    onClick={() => setStationIdx(i)}
                    className={`p-3.5 sm:p-4 rounded-2xl border-2 flex items-center justify-between text-left transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'border-cyan-400 bg-[#1e2852] text-white shadow-[0_0_22px_rgba(56,189,248,0.4)] scale-[1.01]'
                        : 'border-purple-500/25 bg-[#13082b]/80 text-slate-300 hover:border-cyan-400/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl font-bold shrink-0 ${
                          isSelected ? 'bg-cyan-500/30 text-cyan-300' : 'bg-white/10 text-white'
                        }`}
                      >
                        {st.icon}
                      </div>
                      <div className="min-w-0">
                        <p className="font-display font-900 text-sm sm:text-base leading-tight truncate">
                          {st.name}
                        </p>
                        <p className="text-[11px] font-extrabold text-slate-300 mt-0.5 truncate">
                          {st.sub}
                        </p>
                      </div>
                    </div>
                    <span className="text-base shrink-0 ml-1">
                      {isDone ? '✅' : '🔓'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Bottom Left CTA Button (Gated on all 4 stations being complete) */}
            <div className="flex flex-col gap-1.5 mt-2">
              <button
                onClick={onNext}
                disabled={!allStationsComplete}
                className="btn-gold font-display font-900 text-sm sm:text-base py-3.5 px-6 shadow-[0_0_25px_rgba(250,204,21,0.65)] hover:scale-105 transition w-full flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>Go to Practice Phase!</span>
                <span>→</span>
              </button>
              {!allStationsComplete && (
                <span className="text-[11px] text-amber-300 font-extrabold text-center">
                  Complete all 4 stations to unlock Practice Phase ({simCompleted.filter(Boolean).length}/4 complete)
                </span>
              )}
            </div>
          </div>

          {/* Right Column: Interactive Station Workspace */}
          <div className="sim-right md:col-span-8 bg-[#13092e]/95 border-2 border-purple-400/35 rounded-3xl p-4 sm:p-5 flex flex-col justify-between shadow-inner flex-1 min-h-0 overflow-hidden">
            <div className="flex flex-col flex-1 min-h-0 justify-between">
              {/* Header Row */}
              <div className="sim-head flex items-center justify-between border-b border-white/15 pb-2.5 mb-2.5 shrink-0">
                <h3 className="font-display font-900 text-lg sm:text-xl text-cyan-300 flex items-center gap-2.5">
                  <span className="text-2xl">{currentStation.icon}</span>
                  <span>{currentStation.name}</span>
                </h3>
                <span className="font-display font-900 text-xs text-slate-200 bg-white/10 px-3 py-1 rounded-full border border-white/15">
                  Station {stationIdx + 1} of 4
                </span>
              </div>

              {/* Interactive Station Component */}
              <div className="sim-body flex-1 min-h-0 flex flex-col overflow-y-auto">
                <CurrentComp
                  key={stationIdx}
                  onComplete={handleStationFinished}
                  audioEnabled={!muted}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
