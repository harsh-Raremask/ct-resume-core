// ─────────────────────────────────────────────────────────────
//  CTCore — Results & Certificate
// ─────────────────────────────────────────────────────────────
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Trophy, ArrowRight, RotateCcw, Printer, X, CheckCircle2, XCircle, MinusCircle,
  Clock, Target, BookOpenCheck, Quote, ChevronDown, ClipboardCheck, PhoneCall,
  Award, Sparkles, BadgeCheck, Cpu, Sigma, BrainCircuit, Lightbulb, Flag,
} from 'lucide-react';
import { useCTCore } from '../lib/store';
import { SECTION_META, type SectionId } from '../data/questions';
import { ProgressRing, DifficultyBadge, KindBadge, CountUp } from '../components/ui';
import { highlight } from '../components/CodeBlock';

const SECTION_ICONS: Record<SectionId, typeof Cpu> = { technology: Cpu, aptitude: Sigma, critical: BrainCircuit };

export default function Results() {
  const { lastResult, attempts } = useCTCore();
  const navigate = useNavigate();
  const [showCert, setShowCert] = useState(false);
  const [reviewOpen, setReviewOpen] = useState<number | null>(0);

  const result = lastResult ?? null;

  const fired = useMemo(() => ({ current: false }), []);
  useEffect(() => {
    if (result && result.percentage >= 60 && !fired.current) {
      fired.current = true;
      const t = setTimeout(() => {
        confetti({ particleCount: 130, spread: 85, origin: { y: 0.6 }, colors: ['#38bdf8', '#0ea5e9', '#0369a1', '#a5f3fc', '#e0f2fe'] });
        confetti({ particleCount: 70, spread: 110, origin: { y: 0.4, x: 0.15 }, colors: ['#38bdf8', '#f0f9ff'] });
        confetti({ particleCount: 70, spread: 110, origin: { y: 0.4, x: 0.85 }, colors: ['#0ea5e9', '#e0f2fe'] });
      }, 450);
      return () => clearTimeout(t);
    }
  }, [result, fired]);

  if (!result) {
    return (
      <div className="mx-auto max-w-lg px-6 py-24 text-center">
        <ClipboardCheck size={48} className="mx-auto text-sky-300" />
        <h1 className="mt-4 font-display font-extrabold text-2xl text-deep-900">No interview to show yet</h1>
        <p className="mt-2 text-sm text-deep-800/70">Sit a mock interview first — your complete scorecard will appear right here.</p>
        <Link to="/interview" className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-500 px-6 py-3.5 font-display font-bold text-white shadow-lg"><ArrowRight size={17} /> Start Mock Interview</Link>
      </div>
    );
  }

  const verdict =
    result.percentage >= 90 ? { label: 'Outstanding — Interview Ready', sub: 'Panel-worthy performance across the board.' }
    : result.percentage >= 80 ? { label: 'Excellent — Hire Signal', sub: 'Strong command. You would clear most panels.' }
    : result.percentage >= 70 ? { label: 'Strong Candidate', sub: 'Comfortable pass. Polish your weak section below.' }
    : result.percentage >= 60 ? { label: 'Good — Getting There', sub: 'Above the cut-off. Targeted practice will push you over.' }
    : result.percentage >= 40 ? { label: 'Needs Improvement', sub: 'Below the campus cut-off — drill your weak section daily.' }
    : { label: 'Keep Practising', sub: 'Review every explanation below, then re-attempt tomorrow.' };

  const grade = result.percentage >= 90 ? 'A+' : result.percentage >= 80 ? 'A' : result.percentage >= 70 ? 'B+' : result.percentage >= 60 ? 'B' : result.percentage >= 40 ? 'C' : 'D';
  const attemptNo = attempts.length || 1;
  const modeIsFull = result.mode === 'full';

  return (
    <div className="relative">
      <div className="dot-grid pointer-events-none absolute inset-0 opacity-50" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-8 lg:py-12">

        {/* ════════ HEADER CARD ════════ */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="overflow-hidden rounded-3xl border border-sky-100 bg-white shadow-xl shadow-sky-900/8">
          <div className="grid lg:grid-cols-5">
            {/* score ring */}
            <div className="relative lg:col-span-2 bg-deep-900 text-white flex flex-col items-center justify-center px-6 py-8 overflow-hidden">
              <img src="/images/interviewer.png" alt="" className="absolute -right-14 -bottom-10 h-64 w-64 object-cover object-[50%_20%] opacity-20 [mask-image:radial-gradient(ellipse,black,transparent_75%)]" />
              <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-white/8 border border-white/10 px-3 py-1 text-[9px] font-extrabold uppercase tracking-[0.22em] text-sky-300"><Trophy size={11}/> Scorecard</div>
              <ProgressRing size={164} stroke={14} fraction={result.percentage / 100} color="#38bdf8" track="rgba(255,255,255,0.1)">
                <div className="text-center">
                  <div className="font-display font-extrabold text-[42px] leading-none text-white"><CountUp value={result.percentage} /><span className="text-xl text-sky-400">%</span></div>
                  <div className="mt-1 text-[9px] font-bold uppercase tracking-[0.25em] text-sky-300">Overall</div>
                </div>
              </ProgressRing>
              <div className="relative mt-4 font-display font-extrabold text-lg text-white text-center leading-snug">{verdict.label}</div>
              <div className="relative mt-1 text-[11px] text-sky-200/70 text-center max-w-[240px]">{verdict.sub}</div>
              <div className="relative mt-3 inline-flex items-center gap-2 rounded-xl border border-sky-400/30 bg-sky-400/10 px-4 py-2">
                <span className="font-mono text-[11px] font-bold text-sky-300">GRADE</span>
                <span className="font-display font-extrabold text-2xl text-sky-300">{grade}</span>
              </div>
            </div>

            {/* summary stats */}
            <div className="lg:col-span-3 p-6 sm:p-8">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <div className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-sky-600">{result.modeLabel}</div>
                  <h1 className="mt-1 font-display font-extrabold text-2xl sm:text-3xl text-deep-900 tracking-tight">Well done, {result.candidateName.split(' ')[0]}!</h1>
                  <p className="mt-0.5 text-[12px] text-deep-800/65">Attempt #{attemptNo} · {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
                <div className="text-right">
                  <div className="font-mono text-[22px] font-extrabold text-deep-900">{result.score}<span className="text-slate-400 text-base">/{result.maxScore}</span></div>
                  <div className="text-[9.5px] font-bold uppercase tracking-widest text-slate-500">Total Points</div>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { icon: CheckCircle2, v: result.correctCount, l: 'Correct', c: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
                  { icon: XCircle, v: result.incorrectCount, l: 'Incorrect', c: 'text-rose-600 bg-rose-50 border-rose-200' },
                  { icon: MinusCircle, v: result.skippedCount, l: 'Skipped', c: 'text-slate-500 bg-slate-50 border-slate-200' },
                  { icon: Clock, v: `${result.avgTime}s`, l: 'Avg / Question', c: 'text-sky-700 bg-sky-50 border-sky-200' },
                ].map(({ icon: I, v, l, c }) => (
                  <div key={l} className={`rounded-2xl border px-3 py-3 text-center ${c}`}>
                    <I size={17} className="mx-auto" />
                    <div className="mt-1 font-display font-extrabold text-xl">{v}</div>
                    <div className="text-[9px] font-bold uppercase tracking-widest opacity-80">{l}</div>
                  </div>
                ))}
              </div>

              {/* section bars */}
              <div className="mt-5 space-y-3">
                {(Object.keys(result.sectionBreakdown) as SectionId[]).map((sec) => {
                  const b = result.sectionBreakdown[sec];
                  if (!b || (b.max === 0 && b.earned === 0 && !result.answers.some(a => a.question.section === sec))) return null;
                  const Icon = SECTION_ICONS[sec];
                  const bar = b.percentage >= 70 ? 'from-sky-400 to-cyan-500' : b.percentage >= 40 ? 'from-amber-400 to-orange-400' : 'from-rose-400 to-rose-500';
                  return (
                    <div key={sec} className="flex items-center gap-3">
                      <span className="grid h-9 w-9 place-items-center rounded-xl bg-sky-50 border border-sky-100 text-sky-700 shrink-0"><Icon size={17} /></span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11.5px] font-bold text-deep-900">{SECTION_META[sec].label}</span>
                          <span className="font-mono text-[10.5px] font-semibold text-slate-500">{b.earned}/{b.max} pts · <b className="text-deep-900">{b.percentage}%</b></span>
                        </div>
                        <div className="mt-1 h-2.5 rounded-full bg-sky-100 overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${b.percentage}%` }} transition={{ duration: 0.9, ease: 'easeOut' }} className={`h-full rounded-full bg-gradient-to-r ${bar}`} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* CTA row */}
              <div className="mt-6 flex flex-wrap gap-2.5">
                {modeIsFull && (
                  <button onClick={() => setShowCert(true)} className="inline-flex items-center gap-2 rounded-2xl bg-deep-800 px-5 py-3 font-display font-bold text-[13px] text-white hover:bg-deep-900 shadow-md"><Award size={16} /> View Certificate</button>
                )}
                <button onClick={() => navigate('/interview/live', { state: { mode: result.mode } })} className="inline-flex items-center gap-2 rounded-2xl border-2 border-sky-200 bg-white px-5 py-3 font-display font-bold text-[13px] text-sky-800 hover:border-sky-400"><RotateCcw size={15} /> Retake Round</button>
                <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-2xl border-2 border-sky-200 bg-white px-5 py-3 font-display font-bold text-[13px] text-sky-800 hover:border-sky-400"><Target size={15} /> Full Analytics</Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ════════ INSIGHT STRIP ════════ */}
        <div className="mt-5 grid sm:grid-cols-3 gap-3">
          {[
            { icon: Sparkles, label: 'Strongest Round', value: result.strongest ? SECTION_META[result.strongest].label : '—', sub: result.strongest ? `${result.sectionBreakdown[result.strongest].percentage}% accuracy` : '', tone: 'border-emerald-200 bg-emerald-50 text-emerald-800' },
            { icon: Lightbulb, label: 'Focus Area', value: result.weakest ? SECTION_META[result.weakest].label : '—', sub: result.weakest ? `${result.sectionBreakdown[result.weakest].percentage}% — revise & retry` : '', tone: 'border-amber-200 bg-amber-50 text-amber-800' },
            { icon: Clock, label: 'Pace', value: result.avgTime <= 20 ? 'Fast & Focused' : 'Measured', sub: `~${result.avgTime}s average per question`, tone: 'border-sky-200 bg-sky-50 text-sky-800' },
          ].map(({ icon: I, label, value, sub, tone }) => (
            <div key={label} className={`rounded-2xl border px-5 py-4 flex items-center gap-3.5 ${tone}`}>
              <I size={22} className="shrink-0" />
              <span>
                <span className="block text-[9px] font-extrabold uppercase tracking-[0.2em] opacity-75">{label}</span>
                <span className="block font-display font-extrabold text-[15px] leading-tight">{value}</span>
                <span className="block text-[10px] font-semibold opacity-75">{sub}</span>
              </span>
            </div>
          ))}
        </div>

        {/* ════════ QUESTION-BY-QUESTION REVIEW ════════ */}
        <div className="mt-6 rounded-3xl border border-sky-100 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between gap-3 px-6 py-4 border-b border-sky-100">
            <h2 className="font-display font-extrabold text-lg text-deep-900 inline-flex items-center gap-2"><BookOpenCheck size={19} className="text-sky-600" /> Answer Review & Explanations</h2>
            <span className="text-[10.5px] font-bold text-slate-500">{result.answers.length} questions · each with an expert explanation</span>
          </div>
          <div className="divide-y divide-sky-50">
            {result.answers.map((a, i) => {
              const open = reviewOpen === i;
              const isTh = a.question.kind === 'theory';
              const status = isTh ? (a.fraction >= 0.5 ? 'good' : a.fraction > 0 ? 'partial' : 'zero') : a.selectedIndex === null ? 'skipped' : a.correct ? 'right' : 'wrong';
              const badge = {
                right: { t: 'Correct', c: 'bg-emerald-50 text-emerald-700 border-emerald-200', I: CheckCircle2 },
                wrong: { t: 'Incorrect', c: 'bg-rose-50 text-rose-600 border-rose-200', I: XCircle },
                skipped: { t: 'Skipped / Timed out', c: 'bg-slate-100 text-slate-500 border-slate-200', I: MinusCircle },
                good: { t: `Theory ${Math.round(a.fraction * 100)}%`, c: 'bg-emerald-50 text-emerald-700 border-emerald-200', I: CheckCircle2 },
                partial: { t: `Theory ${Math.round(a.fraction * 100)}%`, c: 'bg-amber-50 text-amber-700 border-amber-200', I: MinusCircle },
                zero: { t: 'Not answered', c: 'bg-slate-100 text-slate-500 border-slate-200', I: MinusCircle },
              }[status];
              const BI = badge.I;
              return (
                <div key={i}>
                  <button onClick={() => setReviewOpen(open ? null : i)} className="w-full flex items-center gap-3 px-4 sm:px-6 py-3.5 text-left hover:bg-sky-50/40 transition-colors">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-sky-50 border border-sky-100 font-mono text-[11px] font-bold text-sky-800">{i + 1}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[12.5px] font-semibold text-deep-900 leading-snug line-clamp-1">{a.question.prompt}</span>
                      <span className="mt-0.5 flex items-center gap-2"><KindBadge kind={a.question.kind} /><DifficultyBadge level={a.question.difficulty} /></span>
                    </span>
                    <span className={`shrink-0 inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[9.5px] font-extrabold uppercase tracking-wide ${badge.c}`}><BI size={11} />{badge.t}</span>
                    <span className="hidden sm:inline font-mono text-[10.5px] text-slate-500 shrink-0 w-14 text-right">{a.timeTaken}s{a.timedOut ? ' ⏱' : ''}</span>
                    <ChevronDown size={16} className={`shrink-0 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
                  </button>

                  {open && (
                    <div className="px-4 sm:px-6 pb-5 pt-1 bg-sky-50/30 border-t border-sky-100">
                      {a.question.code && (
                        <pre className="code-scroll overflow-x-auto rounded-xl bg-[#071e2e] px-4 py-3 text-[11px] leading-relaxed font-mono text-sky-50 mb-3" dangerouslySetInnerHTML={{ __html: highlight(a.question.code) }} />
                      )}
                      {isTh ? (
                        <div className="grid md:grid-cols-2 gap-3">
                          <div className="rounded-xl border border-sky-100 bg-white p-4">
                            <div className="text-[9.5px] font-extrabold uppercase tracking-widest text-slate-500">Your Answer</div>
                            <p className="mt-1.5 text-[12px] leading-relaxed text-deep-800/85 whitespace-pre-wrap">{a.answerText.trim() || <em className="text-slate-400">No answer given (timed out).</em>}</p>
                            <div className="mt-2 text-[10.5px] font-semibold text-slate-500">{a.answerText.trim() ? `${a.answerText.trim().split(/\s+/).length} words` : '0 words'} · {a.timeTaken}s used</div>
                          </div>
                          <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
                            <div className="text-[9.5px] font-extrabold uppercase tracking-widest text-emerald-700 inline-flex items-center gap-1.5"><Quote size={11}/> Model Answer</div>
                            <p className="mt-1.5 text-[12px] leading-relaxed text-emerald-950/85">{a.question.modelAnswer}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="grid gap-1.5 max-w-2xl">
                          {a.question.options!.map((opt, oi) => {
                            const isAnswer = oi === a.question.answerIndex;
                            const isPicked = oi === a.selectedIndex;
                            const cls = isAnswer ? 'border-emerald-400 bg-emerald-50' : isPicked ? 'border-rose-300 bg-rose-50' : 'border-slate-200 bg-white';
                            return (
                              <div key={oi} className={`flex items-center gap-2.5 rounded-xl border px-3.5 py-2 text-[12px] ${cls}`}>
                                <span className="font-mono font-bold w-5 text-slate-500">{String.fromCharCode(65 + oi)}.</span>
                                <span className={isAnswer ? 'font-semibold text-emerald-900' : isPicked ? 'text-rose-800' : 'text-deep-800/80'}>{opt}</span>
                                {isAnswer && <span className="ml-auto text-[9px] font-extrabold uppercase tracking-widest text-emerald-600 inline-flex items-center gap-1"><CheckCircle2 size={11}/>Correct</span>}
                                {isPicked && !isAnswer && <span className="ml-auto text-[9px] font-extrabold uppercase tracking-widest text-rose-500 inline-flex items-center gap-1"><XCircle size={11}/>Your pick</span>}
                              </div>
                            );
                          })}
                        </div>
                      )}
                      <div className="mt-3 flex gap-2.5 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3">
                        <Flag size={14} className="shrink-0 mt-0.5 text-sky-600" />
                        <p className="text-[11.5px] leading-relaxed text-sky-900"><b>Why:</b> {a.question.explanation}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <p className="mt-8 text-center text-[11px] font-semibold text-slate-400">CTCore Mock Interview · Keep practising — consistency beats intensity.</p>
      </div>

      {/* ════════════ CERTIFICATE MODAL ════════════ */}
      {showCert && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4 overflow-y-auto">
          <button className="absolute inset-0 bg-deep-950/70 backdrop-blur-sm" onClick={() => setShowCert(false)} aria-label="Close certificate" />
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative w-full max-w-3xl my-8">
            <div className="absolute -top-12 right-0 flex gap-2">
              <button onClick={() => window.print()} className="inline-flex items-center gap-1.5 rounded-xl bg-white/15 border border-white/20 text-white px-4 py-2 text-[12px] font-bold hover:bg-white/25"><Printer size={15} /> Print / PDF</button>
              <button onClick={() => setShowCert(false)} className="grid h-9 w-9 place-items-center rounded-xl bg-white/15 border border-white/20 text-white hover:bg-white/25"><X size={18} /></button>
            </div>
            {/* certificate */}
            <div id="ctcore-certificate" className="relative rounded-2xl bg-white p-2 shadow-2xl">
              <div className="relative border-[3px] border-sky-600 rounded-xl px-6 sm:px-10 py-8 text-center overflow-hidden">
                <div className="absolute inset-2 border border-sky-200 rounded-lg pointer-events-none" />
                <div className="absolute top-0 left-0 h-full w-2 bg-gradient-to-b from-sky-400 via-sky-600 to-cyan-700" />
                <div className="absolute top-0 right-0 h-full w-2 bg-gradient-to-b from-sky-400 via-sky-600 to-cyan-700" />
                <div className="flex items-center justify-center gap-2 text-sky-700">
                  <PhoneCall size={17} /><span className="font-display font-extrabold tracking-[0.14em] text-[13px]">CT<span className="text-sky-500">CORE</span> TECHNOLOGIES</span>
                </div>
                <div className="mt-3 font-serif text-[11px] tracking-[0.3em] uppercase text-slate-500">Certificate of Achievement</div>
                <div className="mt-4 text-[12px] text-slate-600">This is proudly presented to</div>
                <div className="mt-1 font-display font-extrabold text-3xl sm:text-4xl text-deep-900 border-b-2 border-sky-200 inline-block px-8 pb-2">{result.candidateName}</div>
                <p className="mt-4 text-[12px] text-slate-600 max-w-md mx-auto leading-relaxed">for successfully completing the <b className="text-deep-900">CTCore Mock Interview — Full Simulation</b> across Technology, Aptitude &amp; Critical Thinking rounds with a score of</p>
                <div className="mt-4 flex items-center justify-center gap-6">
                  <div>
                    <div className="font-display font-extrabold text-5xl text-transparent bg-clip-text bg-gradient-to-br from-sky-500 to-cyan-700">{result.percentage}%</div>
                    <div className="text-[9px] font-extrabold uppercase tracking-[0.28em] text-slate-500 mt-1">Overall Score</div>
                  </div>
                  <div className="h-14 w-px bg-sky-200" />
                  <div>
                    <div className="font-display font-extrabold text-5xl text-deep-800">{grade}</div>
                    <div className="text-[9px] font-extrabold uppercase tracking-[0.28em] text-slate-500 mt-1">Grade</div>
                  </div>
                </div>
                <div className="mt-6 flex items-end justify-between text-[10px] text-slate-600 px-2 sm:px-6">
                  <div className="text-center">
                    <div className="font-serif italic text-[13px] text-deep-800 border-b border-slate-400 px-6 pb-0.5">Priya Raghavan</div>
                    <div className="mt-1 font-semibold">Lead Panelist, CTCore</div>
                  </div>
                  <div className="grid h-16 w-16 sm:h-20 sm:w-20 place-items-center rounded-full border-2 border-sky-600 bg-sky-50">
                    <div className="text-center"><BadgeCheck size={18} className="mx-auto text-sky-700" /><div className="text-[7px] font-extrabold uppercase tracking-widest text-sky-800 mt-0.5 leading-tight">CTCore<br />Verified</div></div>
                  </div>
                  <div className="text-center">
                    <div className="font-serif text-[12px] text-deep-800 border-b border-slate-400 px-6 pb-0.5">{new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                    <div className="mt-1 font-semibold">Date of Issue</div>
                  </div>
                </div>
                <div className="mt-4 font-mono text-[8.5px] text-slate-400">CERT ID: CTCORE-{String(result.score).padStart(2, '0')}{result.totalQuestions}-{(result.percentage * 7919 % 89999) + 10000} · Verify at ctcore.example.com/verify</div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
