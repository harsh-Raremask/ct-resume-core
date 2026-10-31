import React from 'react';
import type { SectionId, Difficulty, QuestionKind } from '../data/questions';
import { Cpu, Sigma, BrainCircuit } from 'lucide-react';

const SECTION_STYLE: Record<SectionId, { chip: string; icon: typeof Cpu; soft: string; ring: string }> = {
  technology: { chip: 'bg-sky-100 text-sky-800 border-sky-300', icon: Cpu, soft: 'bg-sky-50 text-sky-700', ring: 'ring-sky-400' },
  aptitude: { chip: 'bg-cyan-100 text-cyan-800 border-cyan-300', icon: Sigma, soft: 'bg-cyan-50 text-cyan-700', ring: 'ring-cyan-400' },
  critical: { chip: 'bg-indigo-100 text-indigo-800 border-indigo-300', icon: BrainCircuit, soft: 'bg-indigo-50 text-indigo-700', ring: 'ring-indigo-400' },
};

export function SectionChip({ section, size = 'sm' }: { section: SectionId; size?: 'xs' | 'sm' }) {
  const s = SECTION_STYLE[section];
  const Icon = s.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border font-semibold uppercase tracking-wide ${s.chip} ${size === 'xs' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-[11px]'}`}>
      <Icon size={size === 'xs' ? 11 : 13} strokeWidth={2.4} />
      {section === 'critical' ? 'Critical' : section === 'technology' ? 'Technology' : 'Aptitude'}
    </span>
  );
}

export function DifficultyBadge({ level }: { level: Difficulty }) {
  const style =
    level === 'Easy' ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
    : level === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-200'
    : 'bg-rose-50 text-rose-600 border-rose-200';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${style}`}>
      <span className="flex gap-0.5">
        {[0, 1, 2].map((i) => (
          <span key={i} className={`h-1.5 w-1.5 rounded-full ${i < (level === 'Easy' ? 1 : level === 'Medium' ? 2 : 3) ? 'bg-current' : 'bg-current opacity-25'}`} />
        ))}
      </span>
      {level}
    </span>
  );
}

export function KindBadge({ kind }: { kind: QuestionKind }) {
  const map = {
    mcq: { label: 'MCQ · 30s', cls: 'bg-sky-600 text-white' },
    code: { label: 'CODE OUTPUT · 30s', cls: 'bg-deep-800 text-sky-200' },
    theory: { label: 'THEORY · 90s', cls: 'bg-gradient-to-r from-sky-500 to-cyan-400 text-white' },
  } as const;
  const m = map[kind];
  return <span className={`inline-flex items-center rounded-md px-2 py-1 text-[10px] font-bold tracking-wider ${m.cls}`}>{m.label}</span>;
}

/** Circular progress ring used for the timer and score. */
export function ProgressRing({
  size = 120, stroke = 10, fraction, track = '#e0f2fe', color = '#0ea5e9', children,
}: {
  size?: number; stroke?: number; fraction: number; track?: string; color?: string; children?: React.ReactNode;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - Math.min(1, Math.max(0, fraction)));
  return (
    <div className="relative inline-grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke={track} strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={stroke} fill="none"
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.25s linear, stroke 0.3s ease' }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">{children}</div>
    </div>
  );
}

export function CountUp({ value, suffix = '', prefix = '' }: { value: number; suffix?: string; prefix?: string }) {
  const [display, setDisplay] = React.useState(0);
  React.useEffect(() => {
    const start = performance.now();
    const dur = 900;
    let raf: number;
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(2, -8 * p);
      setDisplay(Math.round(value * (p === 1 ? 1 : eased)));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <>{prefix}{display}{suffix}</>;
}
