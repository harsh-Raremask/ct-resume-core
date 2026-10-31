// ─────────────────────────────────────────────────────────────
//  CTCore — Performance Dashboard
// ─────────────────────────────────────────────────────────────
import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  BarChart, Bar, Cell,
} from 'recharts';
import {
  LayoutDashboard, TrendingUp, Target, Trash2, Trophy, Flame, Zap,
  CheckCircle2, XCircle, MinusCircle, ChevronRight, CalendarClock, Timer,
  Cpu, Sigma, BrainCircuit, ArrowUpRight, ArrowDownRight, Sparkles, RotateCcw,
} from 'lucide-react';
import { useCTCore } from '../lib/store';
import { SECTION_META, type SectionId } from '../data/questions';
import { ProgressRing, CountUp } from '../components/ui';

const SECTION_ICONS: Record<SectionId, typeof Cpu> = { technology: Cpu, aptitude: Sigma, critical: BrainCircuit };
const SECTION_HEX: Record<SectionId, string> = { technology: '#0ea5e9', aptitude: '#06b6d4', critical: '#6366f1' };

export default function Dashboard() {
  const { attempts, clearHistory, setLastResult, candidateName } = useCTCore();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState<string | null>(null);

  const stats = useMemo(() => {
    if (!attempts.length) return null;
    const pcts = attempts.map((a) => a.percentage);
    const best = Math.max(...pcts);
    const avg = Math.round(pcts.reduce((s, p) => s + p, 0) / pcts.length);
    const totalQ = attempts.reduce((s, a) => s + a.totalQuestions, 0);
    const totalCorrect = attempts.reduce((s, a) => s + a.correctCount, 0);
    const totalAnswered = attempts.reduce((s, a) => s + (a.totalQuestions - a.skippedCount), 0);
    const accuracy = totalAnswered ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
    const bestAvg = pcts.length >= 2 ? pcts[pcts.length - 1] - pcts[0] : 0; // attempts are newest-first
    const improvement = pcts.length >= 2 ? pcts[0] - pcts[pcts.length - 1] : 0;
    const secAgg = (['technology', 'aptitude', 'critical'] as SectionId[]).map((sec) => {
      const present = attempts.filter((a) => a.answers.some((ans) => ans.question.section === sec));
      const earned = present.reduce((s, a) => s + a.sectionBreakdown[sec].earned, 0);
      const max = present.reduce((s, a) => s + a.sectionBreakdown[sec].max, 0);
      return { section: sec, label: SECTION_META[sec].label, earned, max, pct: max ? Math.round((earned / max) * 100) : 0 };
    });
    const weakest = [...secAgg].sort((a, b) => a.pct - b.pct)[0];
    const strongest = [...secAgg].sort((a, b) => b.pct - a.pct)[0];
    return { best, avg, totalQ, accuracy, improvement, secAgg, weakest, strongest, count: attempts.length, bestAvg: Math.abs(bestAvg) };
  }, [attempts]);

  const trendData = useMemo(() =>
    [...attempts].reverse().map((a, i) => ({
      name: `#${i + 1}`,
      score: a.percentage,
      date: new Date(a.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    })), [attempts]);

  const radarData = useMemo(() =>
    stats ? stats.secAgg.map((s) => ({ section: s.label.replace(' Thinking', ''), score: s.pct, fullMark: 100 })) : [], [stats]);

  const achievements = useMemo(() => {
    const list = [
      { id: 'first', icon: '🎯', title: 'First Step', desc: 'Completed your first mock interview', unlocked: attempts.length >= 1 },
      { id: 'five', icon: '🔥', title: 'On Fire', desc: '5+ interview attempts logged', unlocked: attempts.length >= 5 },
      { id: 'pass', icon: '✅', title: 'Cut-off Clear', desc: 'Scored 60% or above in an attempt', unlocked: attempts.some((a) => a.percentage >= 60) },
      { id: 'strong', icon: '💪', title: 'Panel Favourite', desc: 'Scored 80% or above — a hire signal', unlocked: attempts.some((a) => a.percentage >= 80) },
      { id: 'tech', icon: '⚙️', title: 'Tech Titan', desc: '80%+ in the Technology round', unlocked: attempts.some((a) => a.sectionBreakdown.technology.percentage >= 80) },
      { id: 'apt', icon: '⚡', title: 'Speed Calculator', desc: '80%+ in the Aptitude round', unlocked: attempts.some((a) => a.sectionBreakdown.aptitude.percentage >= 80) },
      { id: 'crit', icon: '🧠', title: 'Deep Thinker', desc: '80%+ in the Critical Thinking round', unlocked: attempts.some((a) => a.sectionBreakdown.critical.percentage >= 80) },
      { id: 'speed', icon: '⏱️', title: 'Rapid Responder', desc: 'Average under 15s per question', unlocked: attempts.some((a) => a.avgTime <= 15) },
    ];
    return list;
  }, [attempts]);

  /* ───────── EMPTY STATE ───────── */
  if (!attempts.length || !stats) {
    return (
      <div className="mx-auto max-w-lg px-6 py-24 text-center">
        <LayoutDashboard size={48} className="mx-auto text-sky-300" />
        <h1 className="mt-4 font-display font-extrabold text-2xl text-deep-900">Your dashboard is waiting</h1>
        <p className="mt-2 text-sm text-deep-800/70">Complete your first mock interview and this space fills with charts, trends, achievements and attempt history.</p>
        <Link to="/interview" className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-500 px-6 py-3.5 font-display font-bold text-white shadow-lg"><Zap size={17} /> Take Your First Interview</Link>
      </div>
    );
  }

  const avgTime = Math.round(attempts.reduce((s, a) => s + a.avgTime, 0) / attempts.length);

  return (
    <div className="relative">
      <div className="dot-grid pointer-events-none absolute inset-0 opacity-40" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-8 lg:py-10">

        {/* header */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-[10.5px] font-extrabold uppercase tracking-[0.22em] text-sky-600 inline-flex items-center gap-1.5"><LayoutDashboard size={12}/> Performance Dashboard</span>
            <h1 className="mt-1.5 font-display font-extrabold text-3xl text-deep-900 tracking-tight">{candidateName.split(' ')[0]}’s Interview Journey</h1>
            <p className="mt-1 text-[12px] text-deep-800/65">{stats.count} attempt{stats.count > 1 ? 's' : ''} · {stats.totalQ} questions answered · updated live from your sessions</p>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/interview" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 px-4 py-2.5 text-[12px] font-extrabold text-white shadow-md hover:-translate-y-0.5 transition-all"><Zap size={14} /> New Interview</Link>
            <button onClick={() => { if (window.confirm('Clear all attempt history? This cannot be undone.')) clearHistory(); }} className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-[11px] font-bold text-rose-600 hover:bg-rose-100"><Trash2 size={14} /> Clear</button>
          </div>
        </div>

        {/* KPI row */}
        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { icon: Trophy, label: 'Best Score', value: stats.best, suffix: '%', foot: `Grade ${stats.best >= 80 ? 'A' : stats.best >= 60 ? 'B' : 'C'}`, accent: 'text-amber-500 bg-amber-50 border-amber-200' },
            { icon: Target, label: 'Average Score', value: stats.avg, suffix: '%', foot: stats.improvement >= 0 ? `+${Math.round(stats.improvement)}% since attempt #1` : `${Math.round(stats.improvement)}% since attempt #1`, accent: 'text-sky-600 bg-sky-50 border-sky-200' },
            { icon: CheckCircle2, label: 'Answer Accuracy', value: stats.accuracy, suffix: '%', foot: 'of answered questions', accent: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
            { icon: Timer, label: 'Avg. Response', value: avgTime, suffix: 's', foot: 'target under 15s', accent: 'text-cyan-700 bg-cyan-50 border-cyan-200' },
          ].map(({ icon: I, label, value, suffix, foot, accent }) => (
            <div key={label} className="rounded-2xl border border-sky-100 bg-white p-4 sm:p-5 shadow-sm">
              <span className={`inline-grid h-10 w-10 place-items-center rounded-xl border ${accent}`}><I size={19} /></span>
              <div className="mt-2.5 font-display font-extrabold text-[30px] leading-none text-deep-900"><CountUp value={value} suffix={suffix} /></div>
              <div className="mt-1 text-[9.5px] font-extrabold uppercase tracking-[0.18em] text-slate-500">{label}</div>
              <div className="text-[10px] font-semibold text-slate-400">{foot}</div>
            </div>
          ))}
        </div>

        <div className="mt-5 grid lg:grid-cols-3 gap-5">
          {/* trend chart */}
          <div className="lg:col-span-2 rounded-3xl border border-sky-100 bg-white p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-extrabold text-[16px] text-deep-900 inline-flex items-center gap-2"><TrendingUp size={18} className="text-sky-600" /> Score Trend</h2>
              {stats.improvement !== 0 && (
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-extrabold ${stats.improvement >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-600'}`}>
                  {stats.improvement >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}{Math.abs(Math.round(stats.improvement))}% vs first attempt
                </span>
              )}
            </div>
            <div className="mt-3 h-56 sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 12, right: 8, left: -14, bottom: 0 }}>
                  <defs>
                    <linearGradient id="scoreFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" stroke="#e0f2fe" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ stroke: '#7dd3fc' }} contentStyle={{ borderRadius: 14, border: '1px solid #bae6fd', background: '#ffffff', fontSize: 12, boxShadow: '0 12px 28px -12px rgba(7,89,133,0.4)' }} labelFormatter={(_, p) => `Attempt ${p?.[0]?.payload?.name} · ${p?.[0]?.payload?.date}`} formatter={(v) => [`${v}%`, 'Score']} />
                  <Area type="monotone" dataKey="score" stroke="#0284c7" strokeWidth={3} fill="url(#scoreFill)" dot={{ r: 4.5, fill: '#0284c7', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6.5 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* radar */}
          <div className="rounded-3xl border border-sky-100 bg-white p-5 sm:p-6 shadow-sm">
            <h2 className="font-display font-extrabold text-[16px] text-deep-900 inline-flex items-center gap-2"><Sparkles size={17} className="text-sky-600" /> Section Radar</h2>
            <div className="h-56 sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} outerRadius="72%">
                  <PolarGrid stroke="#bae6fd" />
                  <PolarAngleAxis dataKey="section" tick={{ fontSize: 10.5, fill: '#075985', fontWeight: 700 }} />
                  <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar dataKey="score" stroke="#0284c7" strokeWidth={2.5} fill="#38bdf8" fillOpacity={0.38} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* section mastery bars */}
        <div className="mt-5 grid lg:grid-cols-5 gap-5">
          <div className="lg:col-span-2 rounded-3xl border border-sky-100 bg-white p-5 sm:p-6 shadow-sm">
            <h2 className="font-display font-extrabold text-[16px] text-deep-900">Round-wise Mastery</h2>
            <div className="mt-4 space-y-4">
              {stats.secAgg.map((s) => {
                const I = SECTION_ICONS[s.section];
                return (
                  <div key={s.section}>
                    <div className="flex items-center justify-between text-[12px] font-bold text-deep-900">
                      <span className="inline-flex items-center gap-2"><I size={15} className="text-sky-600" />{s.label}</span>
                      <span className="font-mono">{s.pct}% <span className="text-slate-400 font-sans font-semibold text-[10.5px]">({s.earned}/{s.max})</span></span>
                    </div>
                    <div className="mt-1.5 h-3 rounded-full bg-sky-100 overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${s.pct}%`, background: `linear-gradient(90deg, ${SECTION_HEX[s.section]}88, ${SECTION_HEX[s.section]})` }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-[11px] leading-snug text-amber-900">
              <b>Coach’s note:</b> Your weakest round is <b>{stats.weakest.label}</b> ({stats.weakest.pct}%). Spend 15 minutes daily on its topic list in the Question Bank and target 60%+ before your next attempt.
            </div>
          </div>

          {/* achievements */}
          <div className="lg:col-span-3 rounded-3xl border border-sky-100 bg-white p-5 sm:p-6 shadow-sm">
            <h2 className="font-display font-extrabold text-[16px] text-deep-900 inline-flex items-center gap-2"><Flame size={17} className="text-orange-500" /> Achievements <span className="text-[11px] font-bold text-slate-400">· {achievements.filter(a => a.unlocked).length}/{achievements.length} unlocked</span></h2>
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {achievements.map((a) => (
                <div key={a.id} title={a.desc} className={`rounded-2xl border p-3 text-center transition-all ${a.unlocked ? 'border-sky-200 bg-gradient-to-br from-sky-50 to-cyan-50 shadow-sm' : 'border-slate-100 bg-slate-50 opacity-45 grayscale'}`}>
                  <div className="text-2xl">{a.icon}</div>
                  <div className="mt-1 text-[10px] font-extrabold text-deep-900 leading-tight">{a.title}</div>
                  <div className="text-[8.5px] font-medium text-slate-500 leading-tight mt-0.5">{a.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* attempt history */}
        <div className="mt-5 rounded-3xl border border-sky-100 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-sky-100">
            <h2 className="font-display font-extrabold text-[16px] text-deep-900 inline-flex items-center gap-2"><CalendarClock size={18} className="text-sky-600" /> Attempt History</h2>
            <span className="text-[10.5px] font-bold text-slate-500">{attempts.length} recorded · newest first</span>
          </div>
          <div className="divide-y divide-sky-50 max-h-[420px] overflow-y-auto thin-scroll">
            {attempts.map((a) => {
              const open = expanded === a.id;
              return (
                <div key={a.id}>
                  <button onClick={() => setExpanded(open ? null : a.id)} className="w-full flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3.5 hover:bg-sky-50/40 text-left">
                    <ProgressRing size={56} stroke={5} fraction={a.percentage / 100} color={a.percentage >= 60 ? '#0ea5e9' : a.percentage >= 40 ? '#f59e0b' : '#f43f5e'} track="#f0f9ff">
                      <span className="font-display font-extrabold text-[13px] text-deep-900">{a.percentage}</span>
                    </ProgressRing>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[12.5px] font-bold text-deep-900 truncate">{a.modeLabel}</span>
                      <span className="text-[10px] font-semibold text-slate-500">{new Date(a.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} · {new Date(a.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} · {a.score}/{a.maxScore} pts · avg {a.avgTime}s/q</span>
                    </span>
                    <span className="hidden sm:flex items-center gap-2 shrink-0 text-[10px] font-bold">
                      <span className="inline-flex items-center gap-1 text-emerald-600"><CheckCircle2 size={12}/>{a.correctCount}</span>
                      <span className="inline-flex items-center gap-1 text-rose-500"><XCircle size={12}/>{a.incorrectCount}</span>
                      <span className="inline-flex items-center gap-1 text-slate-400"><MinusCircle size={12}/>{a.skippedCount}</span>
                    </span>
                    <ChevronRight size={17} className={`shrink-0 text-slate-400 transition-transform ${open ? 'rotate-90' : ''}`} />
                  </button>
                  {open && (
                    <div className="px-4 sm:px-6 pb-4 bg-sky-50/40 border-t border-sky-100">
                      <div className="grid grid-cols-3 gap-2 mt-3">
                        {(['technology', 'aptitude', 'critical'] as SectionId[]).map((sec) => {
                          const b = a.sectionBreakdown[sec];
                          if (!b || b.max === 0) return <div key={sec} className="rounded-xl border border-dashed border-sky-200 px-3 py-2.5 text-center text-[10px] font-semibold text-slate-400">{SECTION_META[sec].label}<br/>— not in this round</div>;
                          return (
                            <div key={sec} className="rounded-xl border border-sky-100 bg-white px-3 py-2.5 text-center">
                              <div className="text-[9px] font-extrabold uppercase tracking-widest text-sky-800">{SECTION_META[sec].label}</div>
                              <div className="font-display font-extrabold text-lg text-deep-900 mt-0.5">{b.percentage}%</div>
                              <div className="text-[9px] font-semibold text-slate-500">{b.earned}/{b.max} pts</div>
                            </div>
                          );
                        })}
                      </div>
                      <button onClick={() => { setLastResult({ ...a }); navigate('/results'); }} className="mt-3 inline-flex items-center gap-1.5 text-[11.5px] font-extrabold text-sky-700 hover:text-sky-500"><RotateCcw size={13} /> Review this attempt in full <ArrowUpRight size={13} /></button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
