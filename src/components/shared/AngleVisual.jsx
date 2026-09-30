import React from 'react';

/**
 * Pure SVG angle diagram renderer for AngleQuest.
 * Renders mathematical angle representations adhering to Singapore MOE Grade 7 conventions.
 * Optimized for high legibility, large bold geometry, and clear point/vertex labeling.
 */

// Trigonometric helper: 0° points right, angles proceed counter-clockwise.
function polarToCartesian(cx, cy, r, angleInDegrees) {
  const angleInRadians = ((angleInDegrees % 360) * Math.PI) / 180.0;
  return {
    x: cx + r * Math.cos(angleInRadians),
    y: cy - r * Math.sin(angleInRadians)
  };
}

function describeArc(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const diff = (endAngle - startAngle + 360) % 360;
  const largeArcFlag = diff <= 180 ? '0' : '1';

  return [
    'M', start.x, start.y,
    'A', r, r, 0, largeArcFlag, 0, end.x, end.y
  ].join(' ');
}

export function AngleVisual({ type = 'angle-type', data = {}, compact = false }) {
  const width = compact ? 360 : 440;
  const height = compact ? 210 : 270;
  const cx = width / 2;
  const cy = (type === 'line-angles' || type === 'roof-truss') ? height - 48 : height / 2;

  const strokeWidth = compact ? 3 : 4;
  const fontSize = compact ? 14 : 18;

  switch (type) {
    /* ------------------------------------------------ 1. Single Angle */
    case 'angle-type': {
      const deg = data.deg || 60;
      const rayLen = compact ? 115 : 165;
      const arcR = compact ? 42 : 58;
      const originX = compact ? width / 2 - 35 : width / 2 - 50;
      const originY = compact ? height / 2 + 35 : height / 2 + 45;

      const p1 = polarToCartesian(originX, originY, rayLen, 0);
      const p2 = polarToCartesian(originX, originY, rayLen, deg);
      const labelPos = polarToCartesian(originX, originY, arcR + (compact ? 20 : 26), deg / 2);

      // Extract letters if given e.g. ['A', 'B', 'C'] or from label "∠ABC"
      let letters = data.letters;
      if (!letters && data.label && typeof data.label === 'string') {
        const match = data.label.match(/∠?([A-Za-z])([A-Za-z])([A-Za-z])/);
        if (match) {
          letters = [match[1], match[2], match[3]];
        }
      }

      return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full select-none">
          <defs>
            <filter id="av_glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#facc15" floodOpacity="0.6" />
            </filter>
            <filter id="av_vertex_glow" x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#f472b6" floodOpacity="0.8" />
            </filter>
          </defs>

          {/* Ray 1 (Horizontal base ray) */}
          <line
            x1={originX}
            y1={originY}
            x2={p1.x}
            y2={p1.y}
            stroke="#e2e8f0"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Ray 2 (Angled ray) */}
          <line
            x1={originX}
            y1={originY}
            x2={p2.x}
            y2={p2.y}
            stroke="#38bdf8"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Angle Arc or Right Angle Square */}
          {deg === 90 ? (
            <path
              d={`M ${originX + 26} ${originY} L ${originX + 26} ${originY - 26} L ${originX} ${originY - 26}`}
              fill="none"
              stroke="#facc15"
              strokeWidth={strokeWidth}
            />
          ) : (
            <path
              d={describeArc(originX, originY, arcR, 0, deg)}
              fill="none"
              stroke="#facc15"
              strokeWidth={strokeWidth}
              filter="url(#av_glow)"
            />
          )}

          {/* Angle Degree Label */}
          <text
            x={labelPos.x}
            y={labelPos.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#fde047"
            fontWeight="900"
            fontSize={fontSize}
            className="font-display drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
          >
            {deg}°
          </text>

          {/* Vertex Point Dot */}
          <circle
            cx={originX}
            cy={originY}
            r={compact ? 6 : 8}
            fill="#f472b6"
            stroke="#ffffff"
            strokeWidth={2.5}
            filter="url(#av_vertex_glow)"
          />

          {/* Point Endpoint Badges (if letters provided, e.g. ∠ABC -> A on Ray 2, B at vertex, C on Ray 1) */}
          {letters ? (
            <g>
              {/* Point A at Ray 2 Tip */}
              <circle cx={p2.x} cy={p2.y} r={compact ? 5 : 6} fill="#38bdf8" stroke="#ffffff" strokeWidth={2} />
              <g transform={`translate(${p2.x + 8}, ${p2.y - 12})`}>
                <rect x="-12" y="-12" width="24" height="24" rx="6" fill="#1e1044" stroke="#38bdf8" strokeWidth="1.5" />
                <text x="0" y="4" textAnchor="middle" fill="#38bdf8" fontWeight="900" fontSize="14" className="font-display">
                  {letters[0]}
                </text>
              </g>

              {/* Point B at Vertex */}
              <g transform={`translate(${originX - 22}, ${originY + 24})`}>
                <rect x="-14" y="-12" width="28" height="24" rx="6" fill="#2d1245" stroke="#f472b6" strokeWidth="2" />
                <text x="0" y="4" textAnchor="middle" fill="#f472b6" fontWeight="900" fontSize="14" className="font-display">
                  {letters[1]}
                </text>
                <text x="0" y="24" textAnchor="middle" fill="#f472b6" fontWeight="bold" fontSize="11" className="font-display">
                  Vertex
                </text>
              </g>

              {/* Point C at Ray 1 Tip */}
              <circle cx={p1.x} cy={p1.y} r={compact ? 5 : 6} fill="#38bdf8" stroke="#ffffff" strokeWidth={2} />
              <g transform={`translate(${p1.x + 18}, ${p1.y})`}>
                <rect x="-12" y="-12" width="24" height="24" rx="6" fill="#1e1044" stroke="#38bdf8" strokeWidth="1.5" />
                <text x="0" y="4" textAnchor="middle" fill="#38bdf8" fontWeight="900" fontSize="14" className="font-display">
                  {letters[2]}
                </text>
              </g>
            </g>
          ) : (
            // Default Arrowheads/Endpoints
            <g>
              <circle cx={p1.x} cy={p1.y} r={4} fill="#cbd5e1" />
              <circle cx={p2.x} cy={p2.y} r={4} fill="#38bdf8" />
            </g>
          )}
        </svg>
      );
    }

    /* ------------------------------------------------ 2. Angles on a Line */
    case 'line-angles': {
      const angles = data.angles || [65, 115];
      const unknownIdx = data.unknownIdx !== undefined ? data.unknownIdx : 1;
      const lineY = cy;
      const rayLen = compact ? 100 : 155;
      const arcColors = ['#38bdf8', '#fb923c', '#4ade80', '#c084fc'];

      let currentDeg = 0;
      const rays = [];
      const arcs = [];

      angles.forEach((ang, idx) => {
        const startDeg = currentDeg;
        const endDeg = currentDeg + ang;
        currentDeg = endDeg;

        const arcRadius = compact ? 36 + (idx % 2) * 14 : 52 + (idx % 2) * 22;
        const midDeg = (startDeg + endDeg) / 2;
        const labelPos = polarToCartesian(cx, lineY, arcRadius + (compact ? 18 : 24), midDeg);
        const isUnknown = idx === unknownIdx;

        arcs.push(
          <g key={`arc-${idx}`}>
            <path
              d={describeArc(cx, lineY, arcRadius, startDeg, endDeg)}
              fill="none"
              stroke={isUnknown ? '#f43f5e' : arcColors[idx % arcColors.length]}
              strokeWidth={strokeWidth}
            />
            <text
              x={labelPos.x}
              y={labelPos.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={isUnknown ? '#f87171' : '#fde047'}
              fontWeight="900"
              fontSize={isUnknown ? fontSize + 4 : fontSize}
              className="font-display drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
            >
              {isUnknown ? (data.label || 'x') : `${ang}°`}
            </text>
          </g>
        );

        if (idx < angles.length - 1) {
          const rayEnd = polarToCartesian(cx, lineY, rayLen, endDeg);
          rays.push(
            <line
              key={`ray-${idx}`}
              x1={cx}
              y1={lineY}
              x2={rayEnd.x}
              y2={rayEnd.y}
              stroke="#cbd5e1"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          );
        }
      });

      return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full select-none">
          {/* Main Straight Horizontal Line */}
          <line
            x1={20}
            y1={lineY}
            x2={width - 20}
            y2={lineY}
            stroke="#ffffff"
            strokeWidth={strokeWidth + 1.5}
            strokeLinecap="round"
          />
          {/* Straight line endpoint indicators */}
          <circle cx={25} cy={lineY} r={4} fill="#94a3b8" />
          <circle cx={width - 25} cy={lineY} r={4} fill="#94a3b8" />

          {/* Rays */}
          {rays}
          {/* Arcs and Labels */}
          {arcs}
          {/* Central Vertex Dot */}
          <circle cx={cx} cy={lineY} r={compact ? 6 : 8} fill="#facc15" stroke="#ffffff" strokeWidth={2.5} />
        </svg>
      );
    }

    /* ------------------------------------------------ 3. Angles at a Point */
    case 'point-angles': {
      const angles = data.angles || [70, 85, 95, 110];
      const unknownIdx = data.unknownIdx !== undefined ? data.unknownIdx : angles.length - 1;
      const rayLen = compact ? 85 : 120;
      const arcColors = ['#38bdf8', '#fb923c', '#4ade80', '#c084fc', '#facc15'];

      let currentDeg = 0;
      const rays = [];
      const arcs = [];

      angles.forEach((ang, idx) => {
        const startDeg = currentDeg;
        const endDeg = currentDeg + ang;
        currentDeg = endDeg;

        const arcRadius = compact ? 34 + (idx % 2) * 12 : 46 + (idx % 2) * 18;
        const midDeg = (startDeg + endDeg) / 2;
        const labelPos = polarToCartesian(cx, cy, arcRadius + (compact ? 18 : 24), midDeg);
        const isUnknown = idx === unknownIdx;

        // Draw ray from vertex
        const rayEnd = polarToCartesian(cx, cy, rayLen, startDeg);
        rays.push(
          <line
            key={`pray-${idx}`}
            x1={cx}
            y1={cy}
            x2={rayEnd.x}
            y2={rayEnd.y}
            stroke="#cbd5e1"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
        );

        arcs.push(
          <g key={`parc-${idx}`}>
            <path
              d={describeArc(cx, cy, arcRadius, startDeg, endDeg)}
              fill="none"
              stroke={isUnknown ? '#f43f5e' : arcColors[idx % arcColors.length]}
              strokeWidth={strokeWidth}
            />
            <text
              x={labelPos.x}
              y={labelPos.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={isUnknown ? '#f87171' : '#fde047'}
              fontWeight="900"
              fontSize={isUnknown ? fontSize + 4 : fontSize}
              className="font-display drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
            >
              {isUnknown ? (data.label || 'x') : `${ang}°`}
            </text>
          </g>
        );
      });

      return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full select-none">
          {rays}
          {arcs}
          <circle cx={cx} cy={cy} r={compact ? 6 : 8} fill="#facc15" stroke="#ffffff" strokeWidth={2.5} />
        </svg>
      );
    }

    /* ------------------------------------------------ 4. Intersecting Lines */
    case 'intersection': {
      const a = data.a || 65;
      const b = data.b || 115;
      const unknown = data.unknown || 'c'; // 'a', 'b', 'c', 'd'
      const lineLen = compact ? 115 : 165;
      const theta = a; // Acute angle in degrees

      const halfTheta = theta / 2;
      const p1a = polarToCartesian(cx, cy, lineLen, halfTheta);
      const p1b = polarToCartesian(cx, cy, lineLen, halfTheta + 180);

      const p2a = polarToCartesian(cx, cy, lineLen, -halfTheta);
      const p2b = polarToCartesian(cx, cy, lineLen, -halfTheta + 180);

      const arcR = compact ? 34 : 48;

      return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full select-none">
          {/* Crossing Line 1 */}
          <line
            x1={p1b.x}
            y1={p1b.y}
            x2={p1a.x}
            y2={p1a.y}
            stroke="#94a3b8"
            strokeWidth={strokeWidth + 1}
            strokeLinecap="round"
          />
          {/* Crossing Line 2 */}
          <line
            x1={p2b.x}
            y1={p2b.y}
            x2={p2a.x}
            y2={p2a.y}
            stroke="#94a3b8"
            strokeWidth={strokeWidth + 1}
            strokeLinecap="round"
          />

          {/* Right Region (acute a) */}
          <path d={describeArc(cx, cy, arcR, -halfTheta, halfTheta)} fill="none" stroke="#38bdf8" strokeWidth={strokeWidth} />
          <text
            x={cx + arcR + (compact ? 18 : 24)}
            y={cy}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#38bdf8"
            fontWeight="900"
            fontSize={fontSize}
            className="font-display drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
          >
            {unknown === 'a' ? (data.label || 'x') : `${a}°`}
          </text>

          {/* Left Region (vertically opposite a) */}
          <path d={describeArc(cx, cy, arcR, 180 - halfTheta, 180 + halfTheta)} fill="none" stroke="#38bdf8" strokeWidth={strokeWidth} />
          <text
            x={cx - arcR - (compact ? 18 : 24)}
            y={cy}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={unknown === 'c' ? '#f43f5e' : '#38bdf8'}
            fontWeight="900"
            fontSize={fontSize}
            className="font-display drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
          >
            {unknown === 'c' ? (data.label || 'x') : `${a}°`}
          </text>

          {/* Top Region (supplementary b) */}
          <path d={describeArc(cx, cy, arcR, halfTheta, 180 - halfTheta)} fill="none" stroke="#fb923c" strokeWidth={strokeWidth} />
          <text
            x={cx}
            y={cy - arcR - (compact ? 16 : 22)}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={unknown === 'b' ? '#f43f5e' : '#fb923c'}
            fontWeight="900"
            fontSize={fontSize}
            className="font-display drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
          >
            {unknown === 'b' ? (data.label || 'x') : `${b}°`}
          </text>

          {/* Bottom Region (supplementary b) */}
          <path d={describeArc(cx, cy, arcR, 180 + halfTheta, 360 - halfTheta)} fill="none" stroke="#fb923c" strokeWidth={strokeWidth} />
          <text
            x={cx}
            y={cy + arcR + (compact ? 16 : 22)}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={unknown === 'd' ? '#f43f5e' : '#fb923c'}
            fontWeight="900"
            fontSize={fontSize}
            className="font-display drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
          >
            {unknown === 'd' ? (data.label || 'x') : `${b}°`}
          </text>

          {/* Center Vertex */}
          <circle cx={cx} cy={cy} r={compact ? 6 : 8} fill="#facc15" stroke="#ffffff" strokeWidth={2.5} />
        </svg>
      );
    }

    /* ------------------------------------------------ 5. Real-world: Roof Truss */
    case 'roof-truss': {
      const tieY = height - 48;
      const peakX = cx;
      const peakY = 35;
      const leftX = 35;
      const rightX = width - 35;

      return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full select-none">
          {/* Horizontal Tie-beam */}
          <line x1={leftX - 15} y1={tieY} x2={rightX + 15} y2={tieY} stroke="#94a3b8" strokeWidth={strokeWidth + 1} strokeLinecap="round" />
          {/* Left Rafter */}
          <line x1={leftX} y1={tieY} x2={peakX} y2={peakY} stroke="#38bdf8" strokeWidth={strokeWidth + 1} />
          {/* Right Rafter */}
          <line x1={rightX} y1={tieY} x2={peakX} y2={peakY} stroke="#38bdf8" strokeWidth={strokeWidth + 1} />
          {/* Center Strut */}
          <line x1={peakX} y1={peakY} x2={peakX} y2={tieY} stroke="#64748b" strokeWidth={strokeWidth - 1} strokeDasharray="5 5" />

          {/* Angle Arc on Tie Beam */}
          <path d={describeArc(leftX, tieY, 40, 0, 55)} fill="none" stroke="#facc15" strokeWidth={strokeWidth} />
          <text x={leftX + 54} y={tieY - 18} fill="#facc15" fontWeight="900" fontSize={fontSize} className="font-display">
            55°
          </text>

          {/* Unknown Adjacent Arc */}
          <path d={describeArc(leftX, tieY, 32, 55, 180)} fill="none" stroke="#f43f5e" strokeWidth={strokeWidth} />
          <text x={leftX - 16} y={tieY - 22} fill="#f43f5e" fontWeight="900" fontSize={fontSize + 2} className="font-display">
            x
          </text>

          {/* Vertex */}
          <circle cx={leftX} cy={tieY} r={compact ? 5 : 7} fill="#f472b6" stroke="#ffffff" strokeWidth={2} />
        </svg>
      );
    }

    /* ------------------------------------------------ 6. Real-world: Road Sign */
    case 'road-sign': {
      const postX = cx;
      const postTop = 25;
      const postBottom = height - 25;

      return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full select-none">
          {/* Vertical Post */}
          <line x1={postX} y1={postTop} x2={postX} y2={postBottom} stroke="#cbd5e1" strokeWidth={strokeWidth + 2} strokeLinecap="round" />
          {/* Tilted Sign Arm */}
          <line x1={postX} y1={cy} x2={postX + 115} y2={cy - 55} stroke="#38bdf8" strokeWidth={strokeWidth + 1} strokeLinecap="round" />
          {/* Signboard Rectangle */}
          <rect x={postX + 65} y={cy - 92} width={82} height={44} rx={6} fill="#0284c7" stroke="#ffffff" strokeWidth={2} />
          <text x={postX + 106} y={cy - 65} fill="#ffffff" fontWeight="900" fontSize={13} textAnchor="middle" className="font-display">
            WAY OUT
          </text>

          {/* Known Angle Arc */}
          <path d={describeArc(postX, cy, 40, 270, 360 - 25)} fill="none" stroke="#facc15" strokeWidth={strokeWidth} />
          <text x={postX + 48} y={cy + 30} fill="#facc15" fontWeight="900" fontSize={fontSize} className="font-display">
            135°
          </text>

          {/* Unknown Supplementary Arc */}
          <path d={describeArc(postX, cy, 32, 360 - 25, 90)} fill="none" stroke="#f43f5e" strokeWidth={strokeWidth} />
          <text x={postX + 40} y={cy - 22} fill="#f43f5e" fontWeight="900" fontSize={fontSize + 2} className="font-display">
            y
          </text>

          <circle cx={postX} cy={cy} r={compact ? 6 : 8} fill="#f472b6" stroke="#ffffff" strokeWidth={2.5} />
        </svg>
      );
    }

    /* ------------------------------------------------ 7. Real-world: Bicycle Wheel */
    case 'bike-wheel': {
      const r = compact ? 75 : 105;
      return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full select-none">
          {/* Wheel Rim */}
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#64748b" strokeWidth={strokeWidth + 1} />
          {/* Straight Diameter Line */}
          <line x1={cx - r} y1={cy} x2={cx + r} y2={cy} stroke="#cbd5e1" strokeWidth={strokeWidth} />
          {/* Third Spoke at 75° */}
          {(() => {
            const sp = polarToCartesian(cx, cy, r, 75);
            return <line x1={cx} y1={cy} x2={sp.x} y2={sp.y} stroke="#38bdf8" strokeWidth={strokeWidth} />;
          })()}
          {/* Arcs */}
          <path d={describeArc(cx, cy, 34, 0, 75)} fill="none" stroke="#facc15" strokeWidth={strokeWidth} />
          <text x={cx + 46} y={cy - 16} fill="#facc15" fontWeight="900" fontSize={fontSize} className="font-display">
            75°
          </text>

          <path d={describeArc(cx, cy, 34, 75, 180)} fill="none" stroke="#f43f5e" strokeWidth={strokeWidth} />
          <text x={cx - 32} y={cy - 24} fill="#f43f5e" fontWeight="900" fontSize={fontSize + 2} className="font-display">
            x
          </text>

          {/* Hub */}
          <circle cx={cx} cy={cy} r={8} fill="#fb923c" stroke="#ffffff" strokeWidth={2} />
        </svg>
      );
    }

    /* ------------------------------------------------ 8. Real-world: Clock */
    case 'clock': {
      const hour = data.hour || 3;
      const clockR = compact ? 75 : 105;
      const hourDeg = (90 - hour * 30 + 360) % 360;

      const minHand = polarToCartesian(cx, cy, clockR - 16, 90); // 12 o'clock is 90°
      const hourHand = polarToCartesian(cx, cy, clockR - 35, hourDeg);

      return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full select-none">
          {/* Clock Dial */}
          <circle cx={cx} cy={cy} r={clockR} fill="#14082c" stroke="#cbd5e1" strokeWidth={strokeWidth + 1} />
          {/* Hour Ticks */}
          {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(h => {
            const p = polarToCartesian(cx, cy, clockR - 12, 90 - h * 30);
            return <circle key={h} cx={p.x} cy={p.y} r={2.5} fill="#94a3b8" />;
          })}
          {/* Minute Hand (points up to 12) */}
          <line x1={cx} y1={cy} x2={minHand.x} y2={minHand.y} stroke="#38bdf8" strokeWidth={strokeWidth} strokeLinecap="round" />
          {/* Hour Hand */}
          <line x1={cx} y1={cy} x2={hourHand.x} y2={hourHand.y} stroke="#facc15" strokeWidth={strokeWidth + 1.5} strokeLinecap="round" />
          {/* Arc */}
          <path d={describeArc(cx, cy, 38, hourDeg, 90)} fill="none" stroke="#4ade80" strokeWidth={strokeWidth} />
          <text x={cx + 46} y={cy - 26} fill="#4ade80" fontWeight="900" fontSize={fontSize} className="font-display">
            {hour * 30}°
          </text>
          {/* Pin */}
          <circle cx={cx} cy={cy} r={5} fill="#ffffff" />
        </svg>
      );
    }

    /* ------------------------------------------------ 9. Real-world: Fan */
    case 'fan': {
      const blades = data.blades || 3;
      const anglePer = data.angle || 360 / blades;
      const bladeLen = compact ? 65 : 95;

      const bladeLines = [];
      for (let i = 0; i < blades; i++) {
        const deg = i * anglePer;
        const p = polarToCartesian(cx, cy, bladeLen, deg);
        bladeLines.push(
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={p.x}
            y2={p.y}
            stroke="#38bdf8"
            strokeWidth={strokeWidth + 1}
            strokeLinecap="round"
          />
        );
      }

      return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full select-none">
          {bladeLines}
          {/* Arc between blade 0 and blade 1 */}
          <path d={describeArc(cx, cy, 42, 0, anglePer)} fill="none" stroke="#facc15" strokeWidth={strokeWidth} />
          <text x={cx + 50} y={cy - 20} fill="#facc15" fontWeight="900" fontSize={fontSize} className="font-display">
            {Math.round(anglePer)}°
          </text>
          <circle cx={cx} cy={cy} r={9} fill="#fb923c" stroke="#ffffff" strokeWidth={2} />
        </svg>
      );
    }

    /* ------------------------------------------------ 10. Real-world: Pie Chart */
    case 'pie': {
      const slices = data.slices || [110, 90, 80, 80];
      const pieR = compact ? 70 : 105;
      const colors = ['#38bdf8', '#fb923c', '#4ade80', '#c084fc', '#facc15'];

      let cur = 0;
      const paths = [];

      slices.forEach((s, idx) => {
        const start = cur;
        const end = cur + s;
        cur = end;

        const pStart = polarToCartesian(cx, cy, pieR, start);
        const pEnd = polarToCartesian(cx, cy, pieR, end);
        const largeArc = s > 180 ? 1 : 0;
        const d = `M ${cx} ${cy} L ${pStart.x} ${pStart.y} A ${pieR} ${pieR} 0 ${largeArc} 0 ${pEnd.x} ${pEnd.y} Z`;

        const mid = (start + end) / 2;
        const labelP = polarToCartesian(cx, cy, pieR * 0.65, mid);

        paths.push(
          <g key={idx}>
            <path
              d={d}
              fill={colors[idx % colors.length]}
              opacity={0.35}
              stroke={colors[idx % colors.length]}
              strokeWidth={strokeWidth - 1}
            />
            <text
              x={labelP.x}
              y={labelP.y}
              fill="#ffffff"
              fontWeight="900"
              fontSize={fontSize - 1}
              textAnchor="middle"
              dominantBaseline="middle"
              className="font-display drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
            >
              {idx === data.unknownIdx ? (data.label || 'x') : `${s}°`}
            </text>
          </g>
        );
      });

      return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full select-none">
          {paths}
        </svg>
      );
    }

    default:
      return null;
  }
}
