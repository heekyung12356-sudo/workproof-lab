/* Pure SVG radar chart — no chart library (지시서 §12 "차트 라이브러리 남발 금지"). */
import type { DimensionScore } from '../../engines/scoring';

interface Props {
  data: DimensionScore[];
  size?: number;
}

const RING_LEVELS = [25, 50, 75, 100];

export default function RadarChart({ data, size = 320 }: Props) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 56;
  const n = data.length;

  const pointAt = (value: number, i: number) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const r = (value / 100) * radius;
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)] as const;
  };

  const polygon = data.map((d, i) => pointAt(d.score, i).join(',')).join(' ');

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width="100%"
      height="100%"
      role="img"
      aria-label={
        'Score radar: ' + data.map((d) => `${d.label} ${d.score}`).join(', ')
      }
    >
      {/* rings */}
      {RING_LEVELS.map((lvl) => {
        const pts = data
          .map((_, i) => pointAt(lvl, i).join(','))
          .join(' ');
        return (
          <polygon
            key={lvl}
            points={pts}
            fill="none"
            stroke="rgba(148,163,184,0.18)"
            strokeWidth={1}
          />
        );
      })}

      {/* spokes + labels */}
      {data.map((d, i) => {
        const [x, y] = pointAt(100, i);
        const [lx, ly] = pointAt(122, i);
        const anchor = Math.abs(lx - cx) < 6 ? 'middle' : lx > cx ? 'start' : 'end';
        return (
          <g key={d.key}>
            <line
              x1={cx}
              y1={cy}
              x2={x}
              y2={y}
              stroke="rgba(148,163,184,0.18)"
              strokeWidth={1}
            />
            <text
              x={lx}
              y={ly}
              fill="#94a3b8"
              fontSize={11}
              textAnchor={anchor}
              dominantBaseline="middle"
            >
              {d.label}
            </text>
            <text
              x={lx}
              y={ly + 13}
              fill="#cbd5e1"
              fontSize={11}
              fontWeight={700}
              textAnchor={anchor}
              dominantBaseline="middle"
            >
              {d.score}
            </text>
          </g>
        );
      })}

      {/* data polygon */}
      <polygon
        points={polygon}
        fill="rgba(56,189,248,0.22)"
        stroke="#38bdf8"
        strokeWidth={2}
        strokeLinejoin="round"
      />
      {data.map((d, i) => {
        const [x, y] = pointAt(d.score, i);
        return <circle key={d.key} cx={x} cy={y} r={3} fill="#38bdf8" />;
      })}
    </svg>
  );
}
