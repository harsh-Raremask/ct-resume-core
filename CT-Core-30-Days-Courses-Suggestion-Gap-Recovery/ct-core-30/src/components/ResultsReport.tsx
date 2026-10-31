import { motion } from 'framer-motion';
import {
  CheckCircle2, AlertTriangle, XCircle, ChevronRight, Printer, Share2, Sparkles,
  Target, KeyRound, Cpu, Layers, Rocket, TrendingUp, FileDown, CircleCheck,
  ChevronDown, ChevronUp,
} from 'lucide-react';
import { useState } from 'react';
import { ATSGauge, ScoreBar, MiniRing } from './Gauge';
import { useToast } from '../context/ToastContext';
import { openPrintReport } from '../lib/parsers';
import { buildReportText } from '../lib/analyze';
import type { AnalysisResult } from '../lib/types';

const STATUS = {
  pass: { icon: CheckCircle2, cls: 'text-emerald-500', label: 'Strong' },
  warn: { icon: AlertTriangle, cls: 'text-amber-500', label: 'Could improve' },
  fail: { icon: XCircle, cls: 'text-red-400', label: 'Missing' },
};

export default function ResultsReport({ result: r }: { result: AnalysisResult }) {
  const toast = useToast();
  const [openSection, setOpenSection] = useState<string | null>(r.sections[0]?.key ?? null);

  const share = async () => {
    const payload = {
      title: 'My CT Core-30 Resume Report',
      text: `I scored ${r.atsTotal}/100 on ATS as a ${r.roleLabel} candidate with a ${r.gap} gap. CT Core-30 built me a 30-day comeback plan → ready in 30 days.`,
      url: window.location.href,
    };
    try {
      if (navigator.share) await navigator.share(payload);
      else { await navigator.clipboard.writeText(`${payload.text} ${payload.url}`); toast('Report summary copied to clipboard'); }
    } catch { /* user cancelled */ }
  };

  const downloadReport = () => {
    const blob = new Blob([buildReportText(r)], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CT-Core-30-Report-${r.candidateName.replace(/\s+/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast('Full report downloaded');
  };

  const matched = r.matchedSkills;
  const missing = r.missingSkills;

  return (
    <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
      {/* ---------- SUCCESS BANNER ---------- */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-start justify-between gap-4 rounded-[22px] border border-emerald-200 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 p-5 sm:flex-row sm:items-center"
      >
        <div className="flex items-center gap-3.5">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-emerald-500 shadow-lg shadow-emerald-200"><CheckCircle2 size={22} className="text-white" /></span>
          <div>
            <p className="font-display font-extrabold text-emerald-900">Analysis complete — {r.candidateName.split(' ')[0]}’s 30-day sprint is ready.</p>
            <p className="text-[13px] font-medium text-emerald-800">Gap <b>{r.gap}</b> · Last active <b>{r.lastActiveYear ?? '—'}</b> · Target <b>{r.roleLabel}</b> · {r.wordCount} words</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => openPrintReport(r)} className="inline-flex h-10 items-center gap-1.5 rounded-full border border-emerald-300 bg-white px-4 text-xs font-bold text-emerald-900 transition hover:bg-emerald-50"><Printer size={14} /> Print / PDF</button>
          <button onClick={downloadReport} className="inline-flex h-10 items-center gap-1.5 rounded-full border border-emerald-300 bg-white px-4 text-xs font-bold text-emerald-900 transition hover:bg-emerald-50"><FileDown size={14} /> .txt report</button>
          <button onClick={share} className="inline-flex h-10 items-center gap-1.5 rounded-full bg-emerald-600 px-4 text-xs font-bold text-white transition hover:bg-emerald-700"><Share2 size={14} /> Share</button>
        </div>
      </motion.div>

      {/* ---------- MAIN GRID ---------- */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.45fr_1fr]">
        {/* ===== ATS SCORE CARD ===== */}
        <div className="card-shadow rounded-[28px] border border-slate-200 bg-white p-6 sm:p-7">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="font-display text-xl font-extrabold text-ink">ATS Score</h3>
              <p className="text-xs font-medium text-slate-500">How applicant tracking systems read your resume</p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1.5 text-[10px] font-bold tracking-[0.18em] text-slate-600">8-SECTION SCAN</span>
          </div>

          <div className="mt-5 grid items-center gap-6 sm:grid-cols-[auto_1fr]">
            <ATSGauge score={r.atsTotal} grade={r.atsGrade} />
            <ul className="w-full divide-y divide-slate-100">
              {r.sections.map(s => {
                const st = STATUS[s.status];
                const Icon = st.icon;
                const open = openSection === s.key;
                return (
                  <li key={s.key}>
                    <button onClick={() => setOpenSection(open ? null : s.key)} className="flex w-full items-center gap-2.5 py-2 text-left">
                      <Icon size={15} className={`${st.cls} shrink-0`} />
                      <span className="min-w-0 flex-1 truncate text-[12px] font-bold text-slate-700">{s.label}</span>
                      <div className="hidden w-24 shrink-0 sm:block"><ScoreBar score={s.score} max={s.max} /></div>
                      <span className="w-11 shrink-0 text-right text-[11px] font-extrabold tabular-nums text-slate-600">{s.score}<span className="text-slate-400">/{s.max}</span></span>
                      {open ? <ChevronUp size={13} className="shrink-0 text-slate-400" /> : <ChevronDown size={13} className="shrink-0 text-slate-400" />}
                    </button>
                    {open && (
                      <div className="pb-2.5 pl-6 pr-1 text-[11px] leading-5">
                        <p className="font-medium text-slate-600">{s.detail}</p>
                        <p className="mt-1 flex items-start gap-1.5 font-semibold text-sky-800"><Sparkles size={11} className="mt-0.5 shrink-0" />{s.tip}</p>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* ===== READINESS CARD ===== */}
        <div className="card-shadow flex flex-col rounded-[28px] border border-slate-200 bg-brand p-6 text-white sm:p-7">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-extrabold">Interview Readiness</h3>
            <TrendingUp size={18} className="text-sky-100" />
          </div>
          <div className="mt-4 flex items-center gap-5">
            <MiniRing pct={r.readiness} size={96} stroke={11} color="#ffffff" track="rgba(255,255,255,0.12)">
              <div className="text-center leading-none">
                <div className="font-display text-[26px] font-extrabold text-sky-100 tabular-nums">{r.readiness}</div>
                <div className="text-[8px] font-bold tracking-[0.2em] text-sky-100">% READY</div>
              </div>
            </MiniRing>
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-sky-100">Projected after sprint</p>
              <p className="font-display text-[34px] font-extrabold leading-none text-emerald-400 tabular-nums">~{r.projectedReadiness}<span className="text-lg">%</span></p>
              <p className="mt-1.5 text-[10px] font-semibold text-sky-100">+{r.projectedReadiness - r.readiness} pts in 30 days</p>
            </div>
          </div>
          {/* projection bar */}
          <div className="mt-5">
            <div className="flex items-center justify-between text-[10px] font-bold text-sky-100"><span>TODAY</span><span>DAY 30</span></div>
            <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-white/10">
              <motion.div initial={{ width: `${r.readiness}%` }} animate={{ width: `${r.readiness}%` }} className="relative h-full rounded-full bg-gradient-to-r from-sky-200 to-white" />
            </div>
            <div className="mt-1 flex justify-between text-[10px] font-bold text-slate-500"><span>{r.readiness}%</span><span className="text-emerald-400">{r.projectedReadiness}%</span></div>
          </div>
          <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4 text-[12px] leading-6 text-sky-100">
            <span className="font-bold text-sky-100">Why the jump?</span> Week 3 ships portfolio projects, Week 4 fixes quantification & keywords — the two things ATS weight hardest.
          </div>
          <button onClick={() => document.getElementById('plan')?.scrollIntoView({ behavior: 'smooth' })} className="mt-6 inline-flex h-12 w-full shrink-0 items-center justify-center gap-1.5 rounded-full bg-white text-[13px] font-extrabold text-ink transition hover:bg-sky-50">Start the 30-Day Sprint <ChevronRight size={16} strokeWidth={2.6} /></button>
        </div>
      </div>

      {/* ---------- AI COACH SUMMARY ---------- */}
      <div className="card-shadow mt-6 overflow-hidden rounded-[28px] border border-slate-200 bg-white">
        <div className="flex items-center gap-3 border-b border-slate-100 bg-gradient-to-r from-sky-50 to-white px-6 py-4">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand"><Sparkles size={17} className="text-sky-100" /></span>
          <div>
            <p className="font-display font-extrabold text-ink">Your AI Career Coach</p>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-sky-700">Straight talk — no sugarcoating</p>
          </div>
        </div>
        <p className="px-6 py-5 text-[13.5px] leading-7 text-slate-700">{r.aiSummary}</p>
      </div>

      {/* ---------- SKILL MATCH + TECH ROADMAP ---------- */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Skill match */}
        <div className="card-shadow rounded-[28px] border border-slate-200 bg-white p-6 sm:p-7">
          <div className="flex items-center justify-between gap-3">
            <h3 className="flex items-center gap-2 font-display text-lg font-extrabold text-ink"><Target size={18} className="text-sky-500" /> Skill Match vs {r.roleLabel}</h3>
            <span className="font-display text-2xl font-extrabold tabular-nums text-ink">{r.matchScore}<span className="text-sm text-slate-400">%</span></span>
          </div>
          {/* split bar */}
          <div className="mt-4 flex h-3 w-full overflow-hidden rounded-full bg-slate-100">
            <motion.div initial={{ width: 0 }} animate={{ width: `${r.matchScore}%` }} transition={{ duration: 0.8, delay: 0.15 }} className="h-full rounded-l-full bg-emerald-500" />
          </div>
          <p className="mt-1.5 text-[10px] font-bold text-slate-400"><span className="text-emerald-600">{matched.length} matched</span> · <span className="text-amber-700">{missing.length} missing</span> of {matched.length + missing.length} required keywords</p>

          <p className="mt-4 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-700"><CircleCheck size={12} /> Detected in your resume</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {matched.length ? matched.map(s => <span key={s} className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-800">{s}</span>) : <span className="text-xs font-medium text-slate-500">No role keywords found yet — Week 1 fixes this.</span>}
          </div>
          <p className="mt-4 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-amber-700"><XCircle size={12} /> Missing — priority for Week 1–2</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {missing.length ? missing.map(s => <span key={s} className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-900">{s}</span>) : <span className="text-xs font-bold text-emerald-700">Full keyword coverage. Impressive!</span>}
          </div>

          <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Also detected ({r.detectedSkills.length} technologies)</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {r.detectedSkills.length ? r.detectedSkills.map(d => (
                <span key={d.name} title={d.category} className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-semibold text-slate-600">{d.name}</span>
              )) : <span className="text-xs font-medium text-slate-500">No extra technologies detected beyond role keywords.</span>}
            </div>
          </div>
        </div>

        {/* Tech roadmap */}
        <div className="card-shadow rounded-[28px] border border-slate-200 bg-white p-6 sm:p-7">
          <h3 className="flex items-center gap-2 font-display text-lg font-extrabold text-ink"><Cpu size={18} className="text-blue-500" /> Technology Roadmap</h3>
          <p className="mt-0.5 text-[11px] font-medium text-slate-500">What to learn, why, and what’s next — based on your resume</p>

          {r.tech.missing.length > 0 && (
            <>
              <p className="mt-4 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-red-600"><KeyRound size={12} /> Learn first — required, missing</p>
              <ul className="mt-2 space-y-1.5">
                {r.tech.missing.slice(0, 4).map(t => (
                  <li key={t.name} className="flex items-start justify-between gap-3 rounded-xl border border-red-100 bg-red-50/60 px-3 py-2">
                    <span className="text-[11px] leading-5"><b className="text-ink">{t.name}</b> — <span className="text-slate-600">{t.why}</span></span>
                    <span className="shrink-0 rounded-full bg-white px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-red-600 border border-red-200">{t.demand}</span>
                  </li>
                ))}
              </ul>
            </>
          )}

          <p className="mt-4 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-sky-700"><Layers size={12} /> Complementary — stack around what you know</p>
          <ul className="mt-2 space-y-1.5">
            {r.tech.complementary.map(t => (
              <li key={t.name} className="rounded-xl border border-sky-100 bg-sky-50/60 px-3 py-2 text-[11px] leading-5"><b className="text-ink">{t.name}</b> — <span className="text-slate-600">{t.why}</span></li>
            ))}
          </ul>

          <p className="mt-4 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-blue-700"><Rocket size={12} /> Future-proof — where 2026 is heading</p>
          <ul className="mt-2 space-y-1.5">
            {r.tech.future.map(t => (
              <li key={t.name} className="flex items-start justify-between gap-3 rounded-xl border border-blue-100 bg-blue-50/60 px-3 py-2">
                <span className="text-[11px] leading-5"><b className="text-ink">{t.name}</b> — <span className="text-slate-600">{t.why}</span></span>
                <span className="shrink-0 rounded-full border border-blue-200 bg-white px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-blue-700">{t.demand}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ---------- KEYWORDS + WINS ---------- */}
      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <div className="rounded-[24px] border border-slate-200 bg-white p-5 card-shadow">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">ATS Keywords Found</p>
          <p className="mt-1 font-display text-3xl font-extrabold text-emerald-600 tabular-nums">{r.keywordsFound.length}</p>
          <p className="mt-1 truncate text-[10px] font-semibold text-slate-500">{r.keywordsFound.join(' · ') || 'none'}</p>
        </div>
        <div className="rounded-[24px] border border-sky-200 bg-sky-50 p-5 card-shadow">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-sky-800">Quantified Wins</p>
          <p className="mt-1 font-display text-3xl font-extrabold text-sky-600 tabular-nums">{r.quantifiedAchievements}</p>
          <p className="mt-1 text-[10px] font-semibold text-sky-800">numbers ATS recruiters scan for — target 5+</p>
        </div>
        <div className="rounded-[24px] border border-slate-200 bg-white p-5 card-shadow">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Action Verbs</p>
          <p className="mt-1 font-display text-3xl font-extrabold text-ink tabular-nums">{r.actionVerbsFound.length}</p>
          <p className="mt-1 truncate text-[10px] font-semibold text-slate-500">{r.actionVerbsFound.slice(0, 6).join(' · ') || 'add “Built, Led, Grew…”'}</p>
        </div>
      </div>
    </div>
  );
}
