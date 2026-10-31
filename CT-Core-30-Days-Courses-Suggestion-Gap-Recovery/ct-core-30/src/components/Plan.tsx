import { useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  Check, Play, Copy, Youtube, Flame, Printer, RotateCcw, Sparkles, Download,
  ListChecks, CalendarDays, Circle, ExternalLink, PartyPopper,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { WEEKS, COURSES } from '../lib/data';
import { courseUrl } from '../lib/analyze';
import { getCompleted, setCompleted } from '../lib/parsers';
import { useToast } from '../context/ToastContext';
import type { AnalysisResult, PlanDay } from '../lib/types';

const TYPE_STYLE: Record<string, string> = {
  Learn: 'bg-sky-100 text-sky-800 border-sky-200',
  Practice: 'bg-blue-100 text-blue-800 border-blue-200',
  Project: 'bg-cyan-100 text-cyan-900 border-cyan-300',
  Review: 'bg-emerald-100 text-emerald-800 border-emerald-200',
};

function signature(r: AnalysisResult) {
  return `${r.candidateName}|${r.roleId}|${r.gap}`;
}

export default function Plan({ result: r }: { result: AnalysisResult }) {
  const toast = useToast();
  const sig = useMemo(() => signature(r), [r]);
  const [completed, setCompletedState] = useState<Set<number>>(() => getCompleted(sig));
  const [filter, setFilter] = useState<'all' | 1 | 2 | 3 | 4>('all');

  useEffect(() => { setCompletedState(getCompleted(sig)); }, [sig]);

  const toggle = (day: number) => {
    setCompletedState(prev => {
      const next = new Set(prev);
      const willComplete = !next.has(day);
      if (willComplete) next.add(day); else next.delete(day);
      setCompleted(sig, next);
      toast(willComplete ? `Day ${day} complete — ${next.size}/30 down 🔥` : `Day ${day} marked incomplete`);
      return next;
    });
  };

  const reset = () => { setCompletedState(new Set()); setCompleted(sig, new Set()); toast('Progress reset'); };
  const markAll = () => { const all = new Set(r.plan.map(d => d.day)); setCompletedState(all); setCompleted(sig, all); toast('All 30 days marked done — you did it! 🎉'); };

  const done = r.plan.filter(d => completed.has(d.day)).length;
  const pct = Math.round((done / 30) * 100);
  const hoursLogged = useMemo(
    () => r.plan.filter(d => completed.has(d.day)).reduce((acc, d) => {
      const m = d.duration.match(/(\d+):(\d+)/);
      return acc + (m ? parseInt(m[1]) + parseInt(m[2]) / 60 : 0.75);
    }, 0),
    [r.plan, completed],
  );
  const projectsDone = r.plan.filter(d => d.type === 'Project' && completed.has(d.day)).length;
  const totalProjects = r.plan.filter(d => d.type === 'Project').length;
  const streak = useMemo(() => {
    let s = 0;
    for (let d = 1; d <= 30; d++) { if (completed.has(d)) s++; else break; }
    return s;
  }, [completed]);

  const visible = r.plan.filter(d => filter === 'all' || d.week === filter);
  const allDone = done === 30;

  const exportCSV = () => {
    const rows = [['Day', 'Week', 'Type', 'Skill', 'Tasks', 'Duration', 'Course URL']];
    r.plan.forEach(d => rows.push([String(d.day), `Week ${d.week}`, d.type, d.skill, d.tasks.join(' | '), d.duration, courseUrl(d.skill)]));
    const csv = rows.map(row => row.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ct-core-30-day-plan.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast('Plan exported as CSV');
  };

  const printPlan = () => window.print();

  return (
    <div id="plan" className="card-shadow overflow-hidden rounded-[28px] border border-slate-200 bg-white">
      {/* header */}
      <div className="border-b border-slate-100 p-6 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="font-display text-2xl font-extrabold text-ink">Your 30-Day Recovery Sprint</h3>
            <p className="mt-0.5 text-[13px] text-slate-600">Gap-prioritized curriculum · Each day = one free YouTube lesson + one practical task</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1.5 text-[10px] font-bold tracking-wider text-slate-600">{r.roleLabel.toUpperCase()} · {r.gap.toUpperCase()} GAP</span>
            <button onClick={exportCSV} className="inline-flex h-9 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 text-[11px] font-bold text-slate-700 transition hover:border-brand hover:text-ink"><Download size={13} /> CSV</button>
            <button onClick={printPlan} className="inline-flex h-9 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 text-[11px] font-bold text-slate-700 transition hover:border-brand hover:text-ink"><Printer size={13} /> Print</button>
          </div>
        </div>

        {/* stats strip */}
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="flex items-center gap-3 rounded-2xl bg-brand p-3.5 text-white">
            <MiniProgress value={pct} size={46} stroke={5} color="#ffffff" track="rgba(255,255,255,.14)"><span className="text-[9px] font-extrabold">{pct}%</span></MiniProgress>
            <div><p className="font-display text-lg font-extrabold leading-none tabular-nums">{done}<span className="text-xs text-sky-100">/30</span></p><p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Days done</p></div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3.5">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-orange-100"><Flame size={20} className="text-orange-500" /></span>
            <div><p className="font-display text-lg font-extrabold leading-none text-ink tabular-nums">{streak}<span className="text-xs text-slate-400"> days</span></p><p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Day-1 streak</p></div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3.5">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-sky-100"><ListChecks size={20} className="text-sky-600" /></span>
            <div><p className="font-display text-lg font-extrabold leading-none text-ink tabular-nums">{hoursLogged.toFixed(1)}<span className="text-xs text-slate-400">h</span></p><p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Hours logged</p></div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-cyan-200 bg-cyan-50 p-3.5">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-cyan-200"><CalendarDays size={20} className="text-cyan-800" /></span>
            <div><p className="font-display text-lg font-extrabold leading-none text-cyan-900 tabular-nums">{projectsDone}/{totalProjects}</p><p className="text-[9px] font-bold uppercase tracking-wider text-cyan-800">Projects shipped</p></div>
          </div>
        </div>

        {/* progress bar */}
        <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
          <motion.div animate={{ width: `${pct}%` }} transition={{ type: 'spring', stiffness: 80, damping: 20 }} className="h-full rounded-full bg-gradient-to-r from-sky-400 to-sky-600" />
        </div>
      </div>

      {/* weeks overview */}
      <div className="grid gap-3 border-b border-slate-100 bg-slate-50/60 p-5 sm:grid-cols-2 lg:grid-cols-4">
        {WEEKS.map((w, i) => {
          const wDays = r.plan.filter(d => d.week === i + 1);
          const wDone = wDays.filter(d => completed.has(d.day)).length;
          return (
            <button key={i} onClick={() => setFilter((i + 1) as 1 | 2 | 3 | 4)} className={`rounded-2xl border p-4 text-left transition hover:border-brand ${filter === i + 1 ? 'border-brand bg-white ring-1 ring-brand' : 'border-slate-200 bg-white'}`}>
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5 text-[10px] font-extrabold tracking-[0.14em] text-slate-500"><span className="h-2.5 w-2.5 rounded-full" style={{ background: w.color }} />WEEK {i + 1}</span>
                <span className="text-[10px] font-extrabold tabular-nums text-slate-500">{wDone}/{wDays.length}</span>
              </div>
              <p className="mt-1.5 text-[13px] font-extrabold leading-tight text-ink">{w.title}</p>
              <p className="mt-1 text-[10px] leading-4 text-slate-500">{w.desc}</p>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-brand transition-all duration-500" style={{ width: `${(wDone / wDays.length) * 100}%` }} /></div>
            </button>
          );
        })}
      </div>

      {/* filter tabs */}
      <div className="flex items-center justify-between gap-3 overflow-x-auto px-5 pt-4">
        <div className="flex gap-1.5">
          {(['all', 1, 2, 3, 4] as const).map(v => (
            <button key={String(v)} onClick={() => setFilter(v)} className={`whitespace-nowrap rounded-full px-4 py-2 text-[12px] font-bold transition ${filter === v ? 'bg-brand text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              {v === 'all' ? 'All 30 days' : `Week ${v}`}
            </button>
          ))}
        </div>
        <div className="flex shrink-0 gap-2 text-[10px] font-bold">
          <button onClick={markAll} className="rounded-full px-2 py-1.5 text-slate-400 underline underline-offset-2 hover:text-ink">Mark all done</button>
          <button onClick={reset} className="inline-flex items-center gap-1 rounded-full px-2 py-1.5 text-slate-400 underline underline-offset-2 hover:text-red-500"><RotateCcw size={10} /> Reset</button>
        </div>
      </div>

      {/* days grid */}
      <div className="grid gap-4 p-5 sm:grid-cols-2 xl:grid-cols-3">
        {visible.map(d => <DayCard key={d.day} day={d} done={completed.has(d.day)} onToggle={toggle} />)}
      </div>

      {/* completion / tip strip */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-brand px-6 py-4 text-white">
        {allDone ? (
          <p className="flex items-center gap-2 text-[13px] font-bold text-sky-100"><PartyPopper size={17} /> All 30 days complete. Your next interview is just an application away — go apply!</p>
        ) : (
          <p className="text-[12px] font-medium text-sky-100"><b className="text-sky-100">Pro tip:</b> Watch at 1.25×, code along, then rebuild the task with the video closed. That gap between “understood” and “can do” is the whole point.</p>
        )}
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-sky-100" />
          <span className="text-[11px] font-bold text-white">{done} complete · {30 - done} to go — consistency beats intensity</span>
        </div>
      </div>
    </div>
  );
}

/* ---------- mini progress ring used in stats strip ---------- */
function MiniProgress({ value, size, stroke, color, track, children }: { value: number; size: number; stroke: number; color: string; track: string; children?: ReactNode }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative grid shrink-0 place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke={track} strokeWidth={stroke} fill="none" />
        <circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={stroke} fill="none" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - value / 100)} style={{ transition: 'stroke-dashoffset .7s ease' }} />
      </svg>
      <div className="absolute inset-0 grid place-items-center">{children}</div>
    </div>
  );
}

/* ---------- individual day card ---------- */
function DayCard({ day, done, onToggle }: { day: PlanDay; done: boolean; onToggle: (day: number) => void }) {
  const toast = useToast();
  const course = COURSES[day.skill];
  const url = courseUrl(day.skill);
  const copyTasks = async () => {
    try {
      await navigator.clipboard.writeText(`Day ${day.day} — ${day.title.replace(/^Day \d+ — /, '')}\n${day.tasks.map(t => `• ${t}`).join('\n')}\nCourse: ${url}`);
      toast('Tasks + course link copied');
    } catch {
      toast('Clipboard blocked — copy from the card');
    }
  };

  return (
    <article className={`day-card flex flex-col rounded-[20px] border p-4 ${done ? 'border-emerald-300 bg-emerald-50/70' : 'border-slate-200 bg-white hover:shadow-lg hover:shadow-slate-200/60'}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl font-display text-[12px] font-extrabold text-white ${done ? 'bg-emerald-500' : 'bg-brand'}`}>D{day.day}</span>
          <span className={`rounded-full border px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider ${TYPE_STYLE[day.type]}`}>{day.type}</span>
        </div>
        <button onClick={() => onToggle(day.day)} aria-pressed={done} aria-label={done ? `Mark day ${day.day} not done` : `Mark day ${day.day} done`}
          className={`flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[10px] font-extrabold uppercase tracking-wide transition ${done ? 'border-emerald-400 bg-emerald-500 text-white' : 'border-slate-200 bg-white text-slate-500 hover:border-emerald-400 hover:text-emerald-600'}`}>
          {done ? <Check size={12} strokeWidth={3.5} /> : <Circle size={12} />} {done ? 'Done' : 'Mark'}
        </button>
      </div>

      <h4 className={`mt-3 font-display text-[14px] font-extrabold leading-snug ${done ? 'text-emerald-950' : 'text-ink'}`}>{day.title}</h4>
      <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">{day.skill} · {day.duration} · Week {day.week}</p>

      {/* course embed card */}
      <a href={url} target="_blank" rel="noreferrer" className="group mt-3 flex items-center gap-2.5 rounded-2xl border border-slate-200 bg-slate-50 p-2 transition hover:border-brand hover:bg-white">
        <div className="relative h-[62px] w-[104px] shrink-0 overflow-hidden rounded-xl border border-slate-200">
          {course?.id ? (
            <img src={`https://img.youtube.com/vi/${course.id}/mqdefault.jpg`} alt={course.title} loading="lazy" className="h-full w-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          ) : (
            <div className="grid h-full w-full place-items-center bg-red-600"><Youtube size={22} className="text-white" /></div>
          )}
          <span className="absolute bottom-0.5 right-0.5 rounded bg-black/85 px-1 py-0.5 text-[7px] font-bold text-white">{course?.dur ?? '45m'}</span>
        </div>
        <span className="min-w-0">
          <span className="clamp-2 block text-[10px] font-bold leading-snug text-slate-800 group-hover:underline">{course?.title ?? `${day.skill} — full course`}</span>
          <span className="mt-0.5 block text-[9px] font-semibold text-slate-500">{course?.channel ?? 'YouTube'} · <span className="font-bold text-red-600">▶ Watch free</span></span>
        </span>
        <ExternalLink size={12} className="ml-auto shrink-0 text-slate-400 transition group-hover:text-ink" />
      </a>

      {/* tasks */}
      <ul className="mt-3 flex-1 space-y-1.5">
        {day.tasks.map((t, i) => (
          <li key={i} className="flex items-start gap-2 text-[11px] leading-[1.35] text-slate-600">
            <Check size={12} strokeWidth={3} className={`mt-0.5 shrink-0 ${done ? 'text-emerald-500' : 'text-slate-300'}`} />
            <span>{t}</span>
          </li>
        ))}
      </ul>

      <div className="mt-3 flex gap-2">
        <a href={url} target="_blank" rel="noreferrer" className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full bg-brand text-[10px] font-extrabold uppercase tracking-wide text-white transition hover:bg-brand-dark"><Play size={12} fill="currentColor" /> Watch lesson</a>
        <button onClick={copyTasks} aria-label="Copy tasks" className="grid h-9 w-10 place-items-center rounded-full border border-slate-200 text-slate-500 transition hover:border-brand hover:text-ink"><Copy size={13} /></button>
      </div>
    </article>
  );
}
