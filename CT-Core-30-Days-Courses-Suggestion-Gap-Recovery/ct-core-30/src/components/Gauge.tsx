import { useEffect, useState, type ReactNode } from 'react';

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/* semicircle — v in [0,100], sweeping left to right through the top */
const CX = 110, CY = 100, R = 82;
function pointAt(v: number) {
  const theta = Math.PI * (1 - clamp(v, 0, 100) / 100);
  return { x: CX + R * Math.cos(theta), y: CY - R * Math.sin(theta) };
}
function segPath(v0: number, v1: number) {
  const p0 = pointAt(v0), p1 = pointAt(v1);
  const large = Math.abs(v1 - v0) > 50 ? 1 : 0;
  return `M ${p0.x.toFixed(2)} ${p0.y.toFixed(2)} A ${R} ${R} 0 ${large} 1 ${p1.x.toFixed(2)} ${p1.y.toFixed(2)}`;
}
const BANDS = [
  { from: 0, to: 40, color: '#f87171' },
  { from: 40, to: 55, color: '#fb923c' },
  { from: 55, to: 75, color: '#fbbf24' },
  { from: 75, to: 85, color: '#a3e635' },
  { from: 85, to: 100, color: '#34d399' },
];

function easeOutCubic(t: number) { return 1 - Math.pow(1 - t, 3); }

export function ATSGauge({ score, grade }: { score: number; grade: string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let raf = 0;
    const started = performance.now();
    const DUR = 1100;
    const tick = (now: number) => {
      const t = clamp((now - started) / DUR, 0, 1);
      setDisplay(Math.round(clamp(score, 0, 100) * easeOutCubic(t)));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [score]);

  const angle = -90 + (clamp(display, 0, 100) / 100) * 180;
  const band = score >= 85 ? 'Excellent' : score >= 75 ? 'Strong' : score >= 55 ? 'Getting there' : score >= 40 ? 'Needs work' : 'At risk';
  const bandColor = score >= 75 ? 'text-emerald-600' : score >= 55 ? 'text-amber-600' : 'text-red-500';

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 220 122" className="w-full max-w-[248px]" role="img" aria-label={`ATS score ${score} out of 100`}>
        <path d={segPath(0, 100)} stroke="#e0f2fe" strokeWidth={16} fill="none" strokeLinecap="round" />
        {BANDS.map((b, i) => (
          <path key={i} d={segPath(b.from + 0.7, b.to - 0.7)} stroke={b.color} strokeWidth={12} fill="none" strokeLinecap="round" opacity={0.95} />
        ))}
        {[0, 25, 50, 75, 100].map(v => {
          const theta = Math.PI * (1 - v / 100);
          const x1 = CX + (R - 15) * Math.cos(theta), y1 = CY - (R - 15) * Math.sin(theta);
          const x2 = CX + (R - 7) * Math.cos(theta), y2 = CY - (R - 7) * Math.sin(theta);
          return <line key={v} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#0c4a6e" strokeWidth={1.5} opacity={0.4} />;
        })}
        <g transform={`rotate(${angle} ${CX} ${CY})`}>
          <polygon points={`${CX},${CY - 56} ${CX - 4.4},${CY} ${CX + 4.4},${CY}`} fill="#0c4a6e" />
        </g>
        <circle cx={CX} cy={CY} r={9.5} fill="#0c4a6e" />
        <circle cx={CX} cy={CY} r={4} fill="#0ea5e9" />
        <text x={10} y={118} fontSize={9} fontWeight={700} fill="#94a3b8">0</text>
        <text x={210} y={118} fontSize={9} fontWeight={700} fill="#94a3b8" textAnchor="end">100</text>
      </svg>
      <div className="-mt-3 text-center">
        <div className="font-display text-[42px] font-extrabold leading-none tracking-tight text-ink tabular-nums">
          {display}<span className="text-lg font-bold text-slate-400">/100</span>
        </div>
        <div className="mt-1.5 flex items-center justify-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-brand font-display text-[12px] font-extrabold text-sky-100">{grade}</span>
          <span className={`text-[13px] font-extrabold ${bandColor}`}>{band}</span>
        </div>
      </div>
    </div>
  );
}

/* ---------- small progress ring ---------- */
export function MiniRing({ pct, size = 84, stroke = 9, color = "#0284c7", track = "#e0f2fe", children }: { pct: number; size?: number; stroke?: number; color?: string; track?: string; children?: ReactNode }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const [animated, setAnimated] = useState(0);
  useEffect(() => {
    const t = window.setTimeout(() => setAnimated(pct), 80);
    return () => window.clearTimeout(t);
  }, [pct]);
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke={track} strokeWidth={stroke} fill="none" />
        <circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={stroke} fill="none" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - animated / 100)}
          className="progress-dot" />
      </svg>
      <div className="absolute inset-0 grid place-items-center">{children}</div>
    </div>
  );
}

/* ---------- horizontal bar for ATS section rows ---------- */
export function ScoreBar({ score, max }: { score: number; max: number }) {
  const pct = (score / max) * 100;
  const color = pct >= 70 ? '#34d399' : pct >= 40 ? '#fbbf24' : '#f87171';
  const [w, setW] = useState(0);
  useEffect(() => {
    const t = window.setTimeout(() => setW(pct), 120);
    return () => window.clearTimeout(t);
  }, [pct]);
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${w}%`, background: color }} />
    </div>
  );
}
