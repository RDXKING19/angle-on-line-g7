import React, { useState, useRef, useEffect } from 'react';
import { Panel } from './kit.jsx';

// Colors for angle sectors around the central point
const SECTOR_COLORS = [
  { stroke: '#38bdf8', fill: 'rgba(56, 189, 248, 0.22)', label: '#7dd3fc', name: 'Angle 1' },
  { stroke: '#fb923c', fill: 'rgba(251, 146, 60, 0.22)', label: '#fed7aa', name: 'Angle 2' },
  { stroke: '#4ade80', fill: 'rgba(74, 222, 128, 0.22)', label: '#bbf7d0', name: 'Angle 3' },
  { stroke: '#c084fc', fill: 'rgba(192, 132, 252, 0.22)', label: '#e9d5ff', name: 'Angle 4' },
  { stroke: '#facc15', fill: 'rgba(250, 204, 21, 0.22)', label: '#fef08a', name: 'Angle 5' }
];

function polarToXY(cx, cy, r, angleDeg) {
  const rad = ((angleDeg % 360) * Math.PI) / 180.0;
  return {
    x: cx + r * Math.cos(rad),
    y: cy - r * Math.sin(rad)
  };
}

function describeWedge(cx, cy, r, startAngle, endAngle) {
  const diff = (endAngle - startAngle + 360) % 360;
  if (diff === 0) return '';
  const start = polarToXY(cx, cy, r, startAngle);
  const end = polarToXY(cx, cy, r, endAngle);
  const largeArcFlag = diff > 180 ? 1 : 0;

  return [
    'M', cx, cy,
    'L', start.x, start.y,
    'A', r, r, 0, largeArcFlag, 0, end.x, end.y,
    'Z'
  ].join(' ');
}

function describeArcLine(cx, cy, r, startAngle, endAngle) {
  const diff = (endAngle - startAngle + 360) % 360;
  if (diff === 0) return '';
  const start = polarToXY(cx, cy, r, startAngle);
  const end = polarToXY(cx, cy, r, endAngle);
  const largeArcFlag = diff > 180 ? 1 : 0;

  return [
    'M', start.x, start.y,
    'A', r, r, 0, largeArcFlag, 0, end.x, end.y
  ].join(' ');
}

export function RadiantPointLab({ onComplete, audioEnabled = true }) {
  // Ray angles in counter-clockwise degrees (0° = 3 o'clock)
  const [rayCount, setRayCount] = useState(4);
  const [angles, setAngles] = useState([0, 75, 165, 260]);
  const [activeRayIdx, setActiveRayIdx] = useState(null);
  const [exploredMilestones, setExploredMilestones] = useState(new Set());
  const [isCompleted, setIsCompleted] = useState(false);

  const svgRef = useRef(null);

  const cx = 200;
  const cy = 175;
  const rayLength = 125;
  const handleRadius = 14;

  // Initialize rays when count changes
  const handleSetRayCount = (count) => {
    setRayCount(count);
    const step = 360 / count;
    const next = [];
    for (let i = 0; i < count; i++) {
      next.push(Math.round(i * step));
    }
    setAngles(next);
    addMilestone(`count_${count}`);
  };

  const addMilestone = (id) => {
    setExploredMilestones(prev => {
      const next = new Set(prev).add(id);
      if (next.size >= 3 && !isCompleted) {
        setIsCompleted(true);
        if (onComplete) onComplete();
      }
      return next;
    });
  };

  // Preset quick snaps
  const snapEqual = () => {
    const step = 360 / rayCount;
    setAngles(Array.from({ length: rayCount }, (_, i) => Math.round(i * step)));
    addMilestone('preset_equal');
  };

  const snapPerpendicular = () => {
    setRayCount(4);
    setAngles([0, 90, 180, 270]);
    addMilestone('preset_perp');
  };

  const shuffleAngles = () => {
    if (rayCount === 3) {
      const a = 60 + Math.floor(Math.random() * 8) * 15;
      const b = a + 60 + Math.floor(Math.random() * 6) * 15;
      setAngles([0, a % 360, b % 360]);
    } else if (rayCount === 4) {
      const a = 45 + Math.floor(Math.random() * 5) * 15;
      const b = a + 45 + Math.floor(Math.random() * 5) * 15;
      const c = b + 45 + Math.floor(Math.random() * 5) * 15;
      setAngles([0, a % 360, b % 360, c % 360]);
    } else {
      const step = 360 / 5;
      setAngles([0, Math.round(step), Math.round(step * 2), Math.round(step * 3), Math.round(step * 4)]);
    }
    addMilestone('preset_shuffle');
  };

  // Convert mouse/touch event to angle
  const getAngleFromEvent = (e) => {
    if (!svgRef.current) return null;
    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX || (e.touches && e.touches[0].clientX);
    pt.y = e.clientY || (e.touches && e.touches[0].clientY);

    const ctm = svg.getScreenCTM();
    if (!ctm) return null;
    const svgPt = pt.matrixTransform(ctm.inverse());

    const dx = svgPt.x - cx;
    const dy = cy - svgPt.y; // Invert y for math coordinate system

    let deg = Math.round((Math.atan2(dy, dx) * 180) / Math.PI);
    if (deg < 0) deg += 360;
    // Snap to 5° steps
    deg = Math.round(deg / 5) * 5;
    return deg % 360;
  };

  const handlePointerDown = (rayIdx, e) => {
    e.stopPropagation();
    setActiveRayIdx(rayIdx);
  };

  const handlePointerMove = (e) => {
    if (activeRayIdx === null) return;
    const deg = getAngleFromEvent(e);
    if (deg === null) return;

    setAngles(prev => {
      const next = [...prev];
      next[activeRayIdx] = deg;
      return next;
    });

    addMilestone('drag_ray');
  };

  const handlePointerUp = () => {
    setActiveRayIdx(null);
  };

  // Compute sectors (angles between consecutive rays sorted CCW)
  const sortedIndices = angles
    .map((deg, idx) => ({ deg, idx }))
    .sort((a, b) => a.deg - b.deg);

  const sectors = [];
  for (let i = 0; i < sortedIndices.length; i++) {
    const curr = sortedIndices[i];
    const next = sortedIndices[(i + 1) % sortedIndices.length];
    const diff = (next.deg - curr.deg + 360) % 360;
    const midAngle = (curr.deg + diff / 2) % 360;
    sectors.push({
      startAngle: curr.deg,
      endAngle: next.deg,
      span: diff,
      midAngle,
      color: SECTOR_COLORS[i % SECTOR_COLORS.length]
    });
  }

  // Check if any angle equals 90°
  const hasRightAngle = sectors.some(s => s.span === 90);
  useEffect(() => {
    if (hasRightAngle) {
      addMilestone('has_right_angle');
    }
  }, [hasRightAngle]);

  const totalSum = sectors.reduce((sum, s) => sum + s.span, 0);

  return (
    <Panel className="w-full h-full flex flex-col justify-between select-none">
      {/* Real-time Dynamic Equation Ribbon */}
      <div className="w-full bg-[#14082c]/95 border-2 border-purple-400/40 rounded-2xl p-3 sm:p-3.5 shadow-xl flex flex-wrap items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-amber-400 animate-ping" />
          <span className="text-xs sm:text-sm font-bold text-amber-300 uppercase tracking-wider">
            Angles at a Point:
          </span>
        </div>

        {/* Live sum equation with colorful terms */}
        <div className="font-display font-900 text-base sm:text-lg flex items-center flex-wrap gap-1 text-white">
          {sectors.map((s, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <span className="text-white/40">+</span>}
              <span
                style={{ color: s.color.stroke }}
                className="px-1.5 py-0.5 rounded-lg bg-white/5 border border-white/10"
              >
                {s.span}°
              </span>
            </React.Fragment>
          ))}
          <span className="text-white/40 mx-1">=</span>
          <span className="text-amber-400 font-black text-lg sm:text-xl drop-shadow-[0_0_12px_rgba(250,204,21,0.8)]">
            {totalSum}°
          </span>
          <span className="text-xs font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-400/50 px-2.5 py-0.5 rounded-full ml-1">
            Full Turn ✓
          </span>
        </div>
      </div>

      {/* Main Interactive Canvas */}
      <div
        className="w-full flex-1 min-h-[260px] max-h-[380px] bg-[#0f0724]/90 border-2 border-white/10 rounded-3xl p-2 flex items-center justify-center relative touch-none shadow-inner my-2"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <svg
          ref={svgRef}
          viewBox="0 0 400 350"
          className="w-full h-full max-h-[340px] select-none"
        >
          <defs>
            {/* Ambient Radial Glow around Center Point */}
            <radialGradient id="point_glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#facc15" stopOpacity="0.35" />
              <stop offset="60%" stopColor="#8b5cf6" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#0f0724" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Background circular guide ring */}
          <circle cx={cx} cy={cy} r={rayLength} fill="url(#point_glow)" stroke="rgba(255, 255, 255, 0.12)" strokeWidth={2} strokeDasharray="4 6" />
          <circle cx={cx} cy={cy} r={rayLength + 22} fill="none" stroke="rgba(250, 204, 21, 0.2)" strokeWidth={1} />

          {/* Shaded Angle Sectors */}
          {sectors.map((s, idx) => {
            const wedgePath = describeWedge(cx, cy, rayLength, s.startAngle, s.endAngle);
            const arcPath = describeArcLine(cx, cy, 48 + (idx % 2) * 14, s.startAngle, s.endAngle);
            const labelPos = polarToXY(cx, cy, 78 + (idx % 2) * 12, s.midAngle);

            return (
              <g key={`sec-${idx}`}>
                {/* Wedge fill */}
                <path d={wedgePath} fill={s.color.fill} />
                {/* Sector Arc Line */}
                <path d={arcPath} fill="none" stroke={s.color.stroke} strokeWidth={3} strokeLinecap="round" />
                {/* Degree Label */}
                <text
                  x={labelPos.x}
                  y={labelPos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={s.color.label}
                  fontWeight="900"
                  fontSize="16"
                  className="font-display drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
                >
                  {s.span}°
                </text>
              </g>
            );
          })}

          {/* Rays & Interactive Draggable Handles */}
          {angles.map((ang, idx) => {
            const end = polarToXY(cx, cy, rayLength, ang);
            const isDraggingThis = activeRayIdx === idx;

            return (
              <g key={`ray-${idx}`}>
                {/* Ray line */}
                <line
                  x1={cx}
                  y1={cy}
                  x2={end.x}
                  y2={end.y}
                  stroke={isDraggingThis ? '#ffffff' : '#cbd5e1'}
                  strokeWidth={isDraggingThis ? 4.5 : 3.5}
                  strokeLinecap="round"
                />

                {/* Outer draggable handle target */}
                <circle
                  cx={end.x}
                  cy={end.y}
                  r={handleRadius}
                  fill={isDraggingThis ? '#38bdf8' : '#1e1b4b'}
                  stroke={isDraggingThis ? '#ffffff' : '#38bdf8'}
                  strokeWidth={3}
                  className="cursor-grab active:cursor-grabbing hover:scale-125 transition-transform"
                  onPointerDown={(e) => handlePointerDown(idx, e)}
                />
                <circle
                  cx={end.x}
                  cy={end.y}
                  r={5}
                  fill="#ffffff"
                  pointerEvents="none"
                />
              </g>
            );
          })}

          {/* Central Common Vertex */}
          <circle cx={cx} cy={cy} r={9} fill="#facc15" stroke="#ffffff" strokeWidth={3} className="shadow-lg" />
          <circle cx={cx} cy={cy} r={3} fill="#0c0424" />
          <text x={cx} y={cy + 22} textAnchor="middle" fill="#facc15" fontWeight="900" fontSize="13" className="font-display">
            Vertex O
          </text>
        </svg>

        {/* Drag Hint Pill */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/60 border border-white/20 px-3.5 py-1 rounded-full text-xs font-bold text-slate-200 pointer-events-none flex items-center gap-1.5 backdrop-blur-sm">
          <span>🖐️</span>
          <span>Drag the blue ray handles around the circle</span>
        </div>
      </div>

      {/* Interactive Toolbars */}
      <div className="w-full flex flex-col gap-2 shrink-0">
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Ray Count Toggle */}
          <div className="flex items-center gap-1.5 bg-[#14082c]/80 border border-white/10 p-1 rounded-2xl">
            <span className="text-xs font-bold text-slate-300 px-2">Rays:</span>
            {[3, 4, 5].map(cnt => (
              <button
                key={cnt}
                onClick={() => handleSetRayCount(cnt)}
                className={`px-3 py-1 rounded-xl text-xs sm:text-sm font-display font-900 transition cursor-pointer ${
                  rayCount === cnt
                    ? 'bg-cyan-400 text-slate-950 shadow-md font-black'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {cnt} Rays
              </button>
            ))}
          </div>

          {/* Preset Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={snapEqual}
              className="bg-[#1e1342] hover:bg-[#2b1b59] border border-cyan-400/40 text-cyan-200 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-display font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <span>🍕</span>
              <span>Equal Slices</span>
            </button>
            <button
              onClick={snapPerpendicular}
              className="bg-[#1e1342] hover:bg-[#2b1b59] border border-amber-400/40 text-amber-200 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-display font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <span>📐</span>
              <span>4 × 90° Cross</span>
            </button>
            <button
              onClick={shuffleAngles}
              className="bg-[#1e1342] hover:bg-[#2b1b59] border border-purple-400/40 text-purple-200 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-display font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <span>🔀</span>
              <span>Shuffle</span>
            </button>
          </div>
        </div>

        {/* Milestone Discovery Banner & Completion Trigger */}
        <div className="flex items-center justify-between bg-[#160a36] border border-emerald-400/35 rounded-2xl px-4 py-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌟</span>
            <div className="text-left">
              <p className="text-xs sm:text-sm font-extrabold text-emerald-300">
                Rule Proved: Angles around a point always sum to 360°!
              </p>
              <p className="text-[11px] text-slate-300">
                {hasRightAngle ? '✨ Right angle (90°) detected!' : 'Try dragging rays or selecting Equal Slices'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setIsCompleted(true);
              if (onComplete) onComplete();
            }}
            className={`px-5 py-2 rounded-full font-display font-900 text-xs sm:text-sm transition cursor-pointer flex items-center gap-1.5 ${
              isCompleted
                ? 'bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(52,211,153,0.7)]'
                : 'btn-gold text-slate-950'
            }`}
          >
            <span>{isCompleted ? 'Station Completed! ✓' : 'Mark Station Complete ✓'}</span>
          </button>
        </div>
      </div>
    </Panel>
  );
}
