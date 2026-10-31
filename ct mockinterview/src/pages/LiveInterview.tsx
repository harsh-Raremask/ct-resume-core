// ─────────────────────────────────────────────────────────────
//  CTCore — Live Interview Experience
//  Immersive full-screen panel. MCQ/Code 30s · Theory 90s
// ─────────────────────────────────────────────────────────────
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Timer, Flag, ChevronLeft, ChevronRight,
  PhoneCall, SendHorizontal, Wifi, Shield, CircleCheck, PenLine,
  Terminal, Keyboard, AlertTriangle, Loader2,
} from 'lucide-react';
import { useCTCore, buildResult } from '../lib/store';
import { buildSession, SECTION_META, MODE_LABEL, type InterviewMode, type SectionId } from '../data/questions';
import { SectionChip, DifficultyBadge, KindBadge, ProgressRing } from '../components/ui';
import { highlight } from '../components/CodeBlock';

const PANEL_QUOTES = [
  'Take a breath… and begin.',
  'Trust your first instinct on MCQs.',
  'For code questions — trace it line by line.',
  'Pacing matters more than perfection.',
  'Read every option before you commit.',
];
const END_QUOTE = 'That’s the interview wrapped up. Let’s see how you performed.';

const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

export default function LiveInterview() {
  const { state } = useLocation() as { state: { mode?: InterviewMode } | null };
  const mode: InterviewMode = state?.mode ?? 'full';
  const navigate = useNavigate();
  const { recordAttempt, setLastResult, disabledIds, candidateName } = useCTCore();

  const [questions] = useState(() => buildSession(mode, disabledIds));
  const total = questions.length;

  const [phase, setPhase] = useState<'intro' | 'live' | 'ending'>('intro');
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(() => Array(total).fill(null));
  const [texts, setTexts] = useState<string[]>(() => Array(total).fill(''));
  const [timesLeft, setTimesLeft] = useState<number[]>(() => questions.map((q) => q.timeLimit));
  const [timesTaken, setTimesTaken] = useState<number[]>(() => Array(total).fill(0));
  const [timedOuts, setTimedOuts] = useState<boolean[]>(() => Array(total).fill(false));
  const [flagged, setFlagged] = useState<boolean[]>(() => Array(total).fill(false));
  const [revealed, setRevealed] = useState<boolean[]>(() => Array(total).fill(false));
  const [elapsed, setElapsed] = useState(0);
  const [confirmExit, setConfirmExit] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [typed, setTyped] = useState('');
  const [panelQuote, setPanelQuote] = useState(PANEL_QUOTES[0]);
  const [soundOn, setSoundOn] = useState(true);

  const current = questions[index];
  const theoryRef = useRef<HTMLTextAreaElement>(null);
  const audioRef = useRef<{ ctx: AudioContext | null }>({ ctx: null });

  /* ─────── subtle beep via WebAudio ─────── */
  const beep = useCallback((freq = 880, dur = 0.09, gain = 0.05) => {
    if (!soundOn) return;
    try {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = (audioRef.current.ctx ??= new AC());
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine'; o.frequency.value = freq;
      g.gain.setValueAtTime(gain, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
      o.connect(g); g.connect(ctx.destination);
      o.start(); o.stop(ctx.currentTime + dur);
    } catch { /* audio unavailable */ }
  }, [soundOn]);

  /* ─────── typing animation for panel quote ─────── */
  useEffect(() => {
    setTyped('');
    let i = 0;
    const target = phase === 'ending' ? END_QUOTE : panelQuote;
    const id = window.setInterval(() => {
      i += 1;
      setTyped(target.slice(0, i));
      if (i >= target.length) window.clearInterval(id);
    }, 18);
    return () => window.clearInterval(id);
  }, [panelQuote, phase]);

  /* ─────── intro auto-advance ─────── */
  useEffect(() => {
    if (phase !== 'intro') return;
    const id = window.setTimeout(() => setPhase('live'), 3400);
    return () => window.clearTimeout(id);
  }, [phase]);

  /* ─────── master 1-second clock ─────── */
  useEffect(() => {
    if (phase !== 'live') return;
    const id = window.setInterval(() => {
      setElapsed((e) => e + 1);
      setTimesLeft((prev) => {
        const next = [...prev];
        const left = next[index];
        if (left > 0 && !revealed[index]) next[index] = left - 1;
        return next;
      });
      setTimesTaken((prev) => {
        if (revealed[index]) return prev;
        const next = [...prev];
        next[index] = next[index] + 1;
        return next;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [phase, index, revealed]);

  /* rotate quote every 20s */
  useEffect(() => {
    if (phase !== 'live') return;
    const id = window.setInterval(() => setPanelQuote((q) => PANEL_QUOTES[(PANEL_QUOTES.indexOf(q) + 1) % PANEL_QUOTES.length]), 20000);
    return () => window.clearInterval(id);
  }, [phase]);

  /* ─────── auto time-out handling ─────── */
  const autoSubmit = useCallback(() => {
    setTimedOuts((p) => { const n = [...p]; n[index] = true; return n; });
    beep(196, 0.35, 0.07);
    advance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, beep]);

  useEffect(() => {
    if (phase === 'live' && timesLeft[index] === 0) {
      // tiny delay so the 00:00 state renders
      const id = window.setTimeout(autoSubmit, 350);
      return () => window.clearTimeout(id);
    }
  }, [timesLeft, index, phase, autoSubmit]);

  const advance = useCallback(() => {
    if (index < total - 1) {
      const next = index + 1;
      setIndex(next);
      beep(660, 0.06, 0.04);
    } else {
      finishInterview();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, total, beep]);

  /* countdown warning beeps at 5..1 */
  useEffect(() => {
    if (phase === 'live' && timesLeft[index] <= 5 && timesLeft[index] >= 1) beep(1200, 0.05, 0.045);
  }, [timesLeft, index, phase, beep]);

  const answeredCount = answers.filter((a, i) => a !== null || texts[i].trim()).length;
  const progressFrac = (index + 1) / total;
  const isTheory = current.kind === 'theory';
  const tLeft = timesLeft[index];
  const timerColor = tLeft <= 5 ? '#f43f5e' : tLeft <= 10 ? '#f59e0b' : '#0ea5e9';

  const pick = (optIdx: number) => {
    if (timesLeft[index] === 0) return;
    setAnswers((p) => { const n = [...p]; n[index] = optIdx; return n; });
    beep(980, 0.05, 0.045);
  };

  const toggleFlag = () => setFlagged((p) => { const n = [...p]; n[index] = !n[index]; return n; });

  const go = (i: number) => { if (i >= 0 && i < total) setIndex(i); };

  const finishInterview = useCallback(() => {
    setPhase('ending');
    const answersRec = questions.map((q, i) => {
      const sel = answers[i];
      const text = texts[i];
      const isTh = q.kind === 'theory';
      if (isTh) {
        const ev = evaluateTheoryInline(text, q);
        return { question: q, selectedIndex: null, answerText: text, correct: null, fraction: ev.fraction, earned: ev.earned, timeTaken: timesTaken[i], timedOut: timedOuts[i] };
      }
      const isCorrect = sel !== null && sel === q.answerIndex;
      return { question: q, selectedIndex: sel, answerText: '', correct: isCorrect, fraction: isCorrect ? 1 : 0, earned: isCorrect ? q.points : 0, timeTaken: timesTaken[i], timedOut: timedOuts[i] };
    });
    const result = buildResult(questions, answersRec, mode, MODE_LABEL[mode], candidateName);
    recordAttempt({ ...result, id: `att-${Date.now()}`, date: Date.now() });
    setLastResult(result);
    window.setTimeout(() => navigate('/results'), 2100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers, texts, timesTaken, timedOuts, questions, mode, candidateName]);

  const submitOrNext = () => {
    if (isTheory) {
      setRevealed((p) => { const n = [...p]; n[index] = true; return n; });
      if (index === total - 1) { finishInterview(); } else { advance(); }
    } else {
      advance();
    }
  };

  /* keyboard support */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (phase !== 'live') return;
      // If a button/textarea is focused, let it handle Enter natively
      const target = e.target as HTMLElement | null;
      if (e.key === 'Enter' && target?.closest('button, textarea, input, a')) return;
      if (isTheory) return; // let them type
      const k = e.key.toLowerCase();
      if (['1', '2', '3', '4'].includes(k)) pick(Number(k) - 1);
      else if (k === 'f') toggleFlag();
      else if (k === 'arrowright' || k === 'enter') submitOrNext();
      else if (k === 'arrowleft') go(index - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, index, isTheory, timesLeft]);

  /* navigate guard — block accidental back/refresh during interview */
  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, []);

  /* ══════════════ INTRO SCENE ══════════════ */
  if (phase === 'intro' || phase === 'ending') {
    const ending = phase === 'ending';
    return (
      <div className="fixed inset-0 z-50 bg-deep-950 flex flex-col items-center justify-center overflow-hidden">
        <img src="/images/interviewer.png" alt="CTCore panelist — Priya, Senior Engineering Manager" className="absolute inset-0 h-full w-full object-cover object-[50%_18%] opacity-45" />
        <div className="absolute inset-0 bg-gradient-to-b from-deep-950/70 via-deep-950/35 to-deep-950/90" />
        {!ending && (
          <div className="absolute top-5 left-5 inline-flex items-center gap-2 rounded-full bg-black/45 backdrop-blur border border-white/10 px-4 py-1.5 text-[10px] font-bold tracking-[0.22em] text-sky-300">
            <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse-soft" /> LIVE — SIMULATED PANEL
          </div>
        )}
        <div className="absolute top-5 right-5 inline-flex items-center gap-2 rounded-full bg-black/45 backdrop-blur border border-white/10 px-4 py-1.5 text-[11px] font-bold text-sky-200"><Shield size={12}/> CTCore Proctored Simulation</div>

        <div className="relative w-full max-w-2xl px-6">
          <AnimatePresence mode="wait">
            {!ending ? (
              <motion.div key="intro" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-sky-400/25 bg-deep-950/78 backdrop-blur-xl shadow-2xl p-6 sm:p-8">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-sky-400 to-cyan-600"><PhoneCall size={20} className="text-white" /></span>
                  <div>
                    <div className="text-[9.5px] uppercase tracking-[0.24em] font-extrabold text-sky-400">CTCore Mock Interview · Panel Room</div>
                    <div className="font-display font-extrabold text-white">Priya — Senior Engineering Manager, TechCorp</div>
                  </div>
                </div>
                <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 min-h-[84px]">
                  <p className="text-[15px] sm:text-lg text-sky-50 leading-snug">“{typed}<span className="inline-block w-2 h-4 bg-sky-400 align-[-2px] animate-pulse" />”</p>
                </div>
                <div className="mt-5 flex items-center justify-between gap-4 flex-wrap">
                  <div className="text-[11px] font-semibold text-sky-100/75">
                    <div className="text-sky-400 font-extrabold uppercase tracking-widest text-[9px]">Your Session</div>
                    {MODE_LABEL[mode]} · {total} questions · {questions.filter(q => q.kind === 'theory').length} theory
                  </div>
                  <button onClick={() => setPhase('live')} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 px-6 py-3 font-display font-extrabold text-deep-950 shadow-lg shadow-sky-500/30 hover:scale-105 transition-transform">
                    Enter Room <ChevronRight size={17} strokeWidth={3} />
                  </button>
                </div>
                <div className="mt-4 flex items-center gap-2 text-[10px] text-sky-100/50"><Loader2 size={12} className="animate-spin" /> Connecting to panel · camera & mic checks passed</div>
              </motion.div>
            ) : (
              <motion.div key="ending" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                <CircleCheck size={64} className="mx-auto text-emerald-400" strokeWidth={1.6} />
                <h2 className="mt-4 font-display font-extrabold text-3xl text-white">Interview Complete</h2>
                <p className="mt-2 text-sky-200/85 text-[14px]">{typed}</p>
                <Loader2 size={26} className="mx-auto mt-6 animate-spin text-sky-400" />
                <p className="mt-2 text-[11px] uppercase tracking-[0.24em] font-bold text-sky-400">Preparing your scorecard…</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  /* ══════════════ LIVE INTERVIEW ══════════════ */
  const qNum = `Q${index + 1}/${total}`;
  const wordCount = texts[index].trim() ? texts[index].trim().split(/\s+/).length : 0;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-deep-950 text-white overflow-hidden select-none">
      {/* ambient background */}
      <div className="pointer-events-none absolute inset-0">
        <img src="/images/interviewer.png" alt="" className="absolute right-[-120px] top-[-80px] h-[560px] w-[560px] object-cover object-[50%_15%] opacity-[0.16] blur-[1px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(1000px_500px_at_80%_-10%,rgba(14,165,233,0.22),transparent),radial-gradient(800px_500px_at_-10%_110%,rgba(8,47,73,0.9),transparent)]" />
      </div>

      {/* ════ TOP BAR ════ */}
      <header className="relative z-10 flex items-center justify-between gap-2 px-3 sm:px-5 h-14 sm:h-16 border-b border-white/10 bg-deep-950/80 backdrop-blur">
        <button onClick={() => setConfirmExit(true)} className="grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-sky-200 hover:bg-white/10 hover:text-white transition-colors" aria-label="Exit interview">
          <X size={18} />
        </button>

        <div className="flex items-center gap-2.5 min-w-0">
          <span className="hidden sm:inline-flex items-center gap-1.5 text-[9px] font-extrabold tracking-[0.2em] text-rose-400"><span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse-soft" />LIVE</span>
          <div className="text-center min-w-0">
            <div className="font-display font-extrabold text-[12.5px] sm:text-[14px] leading-tight truncate max-w-[180px] sm:max-w-none">{MODE_LABEL[mode]}</div>
            <div className="text-[9px] sm:text-[9.5px] font-semibold text-sky-300/80 uppercase tracking-widest">CTCore Panel · Proctored</div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <button onClick={() => setSoundOn((v) => !v)} className="hidden sm:grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-sky-200 hover:text-white" aria-label="Toggle sound">
            <Keyboard size={17} className={soundOn ? 'opacity-100' : 'opacity-40'} />
          </button>
          <div className="flex items-center gap-1.5 sm:gap-2 rounded-xl border border-white/10 bg-white/5 px-2.5 sm:px-3.5 h-9 sm:h-10">
            <Timer size={15} className="text-sky-300" />
            <span className="font-mono text-[13px] sm:text-[15px] font-semibold text-sky-100 tabular-nums">{fmt(elapsed)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-bold text-emerald-400"><Wifi size={14} /><span className="hidden sm:inline">STABLE</span></div>
        </div>
      </header>

      {/* ════ PROGRESS LINE ════ */}
      <div className="relative z-10 h-1 bg-white/5">
        <div className="h-full bg-gradient-to-r from-sky-400 via-cyan-400 to-sky-500 transition-all duration-500" style={{ width: `${progressFrac * 100}%` }} />
      </div>

      {/* ════ BODY : panel | question | rail ════ */}
      <div className="relative z-10 flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)_150px]">

        {/* ── interviewer panel (desktop) ── */}
        <aside className="relative hidden lg:flex flex-col border-r border-white/8 p-4 gap-3 min-h-0">
          <div className="relative flex-1 rounded-2xl overflow-hidden border border-sky-400/20 shadow-2xl">
            <img src="/images/interviewer.png" alt="Priya, Senior Engineering Manager at TechCorp" className="absolute inset-0 h-full w-full object-cover object-[50%_16%]" />
            <div className="absolute inset-0 bg-gradient-to-b from-deep-950/25 via-transparent to-deep-950/85" />
            <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-black/55 backdrop-blur px-2.5 py-1 text-[9px] font-extrabold tracking-widest text-sky-300"><span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse-soft" />PANEL 1</div>
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="font-display font-extrabold text-[15px]">Priya Raghavan</div>
              <div className="text-[10px] font-semibold text-sky-300">Senior Engineering Manager · TechCorp</div>
              {/* fake equalizer */}
              <div className="mt-2 flex items-end gap-[3px] h-4">
                {[0.5, 0.9, 0.65, 1, 0.75, 0.45, 0.85, 0.6, 0.95, 0.7, 0.5, 0.8].map((h, i) => (
                  <span key={i} className="w-1.5 rounded-sm bg-sky-400/80 animate-pulse-soft" style={{ height: `${h * 100}%`, animationDelay: `${i * 0.09}s` }} />
                ))}
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur px-4 py-3 min-h-[64px]">
            <div className="text-[8.5px] font-extrabold uppercase tracking-[0.22em] text-sky-400">Panel Says</div>
            <p className="mt-1 text-[11.5px] leading-snug text-sky-50/90">“{typed}”</p>
          </div>
        </aside>

        {/* ── question workspace ── */}
        <main className="flex flex-col min-h-0 min-w-0">
          {/* question meta row */}
          <div className="flex items-center justify-between gap-2 px-4 sm:px-6 pt-3 sm:pt-4">
            <div className="flex items-center gap-2 flex-wrap">
              <SectionChip section={current.section} size="sm" />
              <DifficultyBadge level={current.difficulty} />
              <KindBadge kind={current.kind} />
            </div>
            <div className="font-mono text-[10px] sm:text-[11px] font-semibold text-sky-300/80">{qNum} <span className="hidden sm:inline">· {SECTION_META[current.section].short}</span></div>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto thin-scroll px-4 sm:px-6 pb-2 pt-2 grid grid-cols-[minmax(0,1fr)_auto] gap-3 items-start">
            {/* question text + code */}
            <div className="min-w-0">
              <h1 className="font-display font-bold text-[16px] sm:text-[19px] leading-snug text-sky-50">{current.prompt}</h1>
              {current.code && (
                <div className="mt-2.5 rounded-xl overflow-hidden border border-sky-400/20 shadow-lg max-w-2xl">
                  <div className="flex items-center justify-between bg-[#0b2a3f] px-3.5 h-8 border-b border-white/5">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-rose-400/90" /><span className="h-2.5 w-2.5 rounded-full bg-amber-400/90" /><span className="h-2.5 w-2.5 rounded-full bg-emerald-400/90" />
                    </div>
                    <span className="font-mono text-[9px] font-bold text-sky-300/80 tracking-widest inline-flex items-center gap-1"><Terminal size={10}/> {current.language}</span>
                  </div>
                  <pre className="code-scroll overflow-x-auto bg-[#071e2e] px-4 py-3 text-[11.5px] sm:text-[12.5px] leading-relaxed font-mono text-sky-50" dangerouslySetInnerHTML={{ __html: highlight(current.code) }} />
                </div>
              )}

              {/* answer area */}
              {isTheory ? (
                <div className="mt-3 max-w-2xl">
                  <textarea
                    ref={theoryRef}
                    value={texts[index]}
                    onChange={(e) => setTexts((p) => { const n = [...p]; n[index] = e.target.value; return n; })}
                    placeholder="Type your answer here — structure it: definition → key points → example…"
                    className="w-full h-28 sm:h-32 resize-none rounded-2xl border border-sky-400/25 bg-white/[0.06] backdrop-blur px-4 py-3 text-[13px] sm:text-[13.5px] leading-relaxed text-sky-50 placeholder-sky-100/30 outline-none focus:border-sky-400/60 focus:bg-white/[0.08] transition"
                  />
                  <div className="mt-1 flex items-center justify-between text-[9.5px] sm:text-[10px] font-semibold text-sky-200/60">
                    <span className="inline-flex items-center gap-1.5"><PenLine size={11}/> {wordCount} words · graded on concept coverage</span>
                    <span>Target ~60+ words for full substance marks</span>
                  </div>
                </div>
              ) : (
                <div className="mt-3 grid gap-2 sm:gap-2.5 max-w-2xl">
                  {current.options!.map((opt, i) => {
                    const chosen = answers[index] === i;
                    return (
                      <button key={i} onClick={() => pick(i)}
                        className={`option-btn group flex items-center gap-3 rounded-2xl border px-3 sm:px-4 py-2.5 sm:py-3 text-left ${chosen ? 'border-sky-400 bg-sky-500/15 shadow-[0_0_0_3px_rgba(56,189,248,0.25)]' : 'border-white/12 bg-white/[0.05] hover:border-sky-400/50 hover:bg-white/[0.08]'}`}>
                        <span className={`grid h-8 w-8 sm:h-9 sm:w-9 shrink-0 place-items-center rounded-xl border font-mono text-[13px] sm:text-sm font-bold transition-all ${chosen ? 'border-sky-400 bg-sky-500 text-deep-950' : 'border-white/15 bg-deep-950/60 text-sky-300 group-hover:border-sky-400/60'}`}>{String.fromCharCode(65 + i)}</span>
                        <span className={`text-[12.5px] sm:text-[14px] leading-snug ${chosen ? 'text-white font-semibold' : 'text-sky-50/90'}`}>{opt}</span>
                        {chosen && <CircleCheck size={18} className="ml-auto shrink-0 text-sky-400" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ── big timer ── */}
            <div className="flex flex-col items-center gap-1.5 pt-1">
              <ProgressRing size={86} stroke={7} fraction={tLeft / current.timeLimit} color={timerColor} track="rgba(255,255,255,0.08)">
                <div className="text-center">
                  <div className={`font-display font-extrabold text-lg sm:text-[21px] leading-none tabular-nums ${tLeft <= 5 ? 'text-rose-400 animate-tick' : 'text-white'}`}>{fmt(tLeft)}</div>
                  <div className="text-[8px] font-bold uppercase tracking-widest text-sky-300/70 mt-1">{isTheory ? 'Theory' : 'Seconds'}</div>
                </div>
              </ProgressRing>
              <button onClick={toggleFlag} className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-[9.5px] font-extrabold uppercase tracking-wider transition-all ${flagged[index] ? 'border-amber-400/60 bg-amber-400/20 text-amber-300' : 'border-white/12 bg-white/5 text-sky-200/70 hover:text-amber-300 hover:border-amber-400/40'}`}>
                <Flag size={11} fill={flagged[index] ? 'currentColor' : 'none'} /> {flagged[index] ? 'Flagged' : 'Flag'}
              </button>
            </div>
          </div>

          {/* ── bottom action bar ── */}
          <div className="px-4 sm:px-6 pb-3 sm:pb-4 pt-1 border-t border-white/8 bg-deep-950/60 backdrop-blur">
            <div className="flex items-center justify-between gap-2">
              <button onClick={() => go(index - 1)} disabled={index === 0} className="inline-flex items-center gap-1.5 rounded-xl border border-white/12 bg-white/5 px-3.5 sm:px-4 py-2.5 sm:py-3 text-[11px] sm:text-[12px] font-bold text-sky-100 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-colors">
                <ChevronLeft size={16} /> Previous
              </button>
              <div className="hidden md:flex items-center gap-2 text-[9.5px] font-semibold text-sky-100/45">
                <Keyboard size={12} /> Keys 1–4 answer · F flag · → next · ← previous
              </div>
              {index < total - 1 ? (
                <button onClick={submitOrNext} className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 px-5 sm:px-7 py-2.5 sm:py-3 font-display font-extrabold text-[12px] sm:text-[13px] text-deep-950 shadow-lg shadow-sky-500/30 hover:brightness-110 transition">
                  {isTheory ? <><SendHorizontal size={15} /> Submit &amp; Next</> : <>Next <ChevronRight size={16} strokeWidth={3} /></>}
                </button>
              ) : (
                <button onClick={() => setShowEndModal(true)} className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-400 to-sky-500 px-5 sm:px-7 py-2.5 sm:py-3 font-display font-extrabold text-[12px] sm:text-[13px] text-deep-950 shadow-lg shadow-emerald-500/25 hover:brightness-110 transition">
                  <SendHorizontal size={15} /> End Interview
                </button>
              )}
            </div>
          </div>
        </main>

        {/* ── question navigator rail ── */}
        <aside className="hidden lg:flex flex-col border-l border-white/8 p-3 gap-2 min-h-0 overflow-y-auto thin-scroll">
          <div className="text-[9px] font-extrabold uppercase tracking-[0.22em] text-sky-400 px-1">Navigator</div>
          <div className="grid grid-cols-4 gap-1.5">
            {questions.map((q, i) => {
              const isCurrent = i === index;
              const isAnswered = answers[i] !== null || texts[i].trim().length > 0;
              const isFlagged = flagged[i];
              return (
                <button key={q.id} onClick={() => go(i)}
                  className={`relative h-10 rounded-lg border font-mono text-[11px] font-bold transition-all ${isCurrent ? 'border-sky-400 bg-sky-500 text-deep-950 scale-105 shadow-[0_0_12px_rgba(56,189,248,0.4)]' : isAnswered ? 'border-emerald-400/40 bg-emerald-400/15 text-emerald-300' : 'border-white/10 bg-white/5 text-sky-100/60 hover:border-sky-400/40'}`}>
                  {i + 1}
                  {isFlagged && <Flag size={8} fill="currentColor" className="absolute top-0.5 right-0.5 text-amber-400" />}
                </button>
              );
            })}
          </div>
          <div className="mt-1 space-y-1.5 text-[9px] font-semibold text-sky-100/55 px-1">
            <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-emerald-400/70 inline-block" /> Answered · {answeredCount}</div>
            <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-white/15 border border-white/20 inline-block" /> Not answered · {total - answeredCount}</div>
            <div className="flex items-center gap-1.5"><Flag size={10} className="text-amber-400" /> Flagged · {flagged.filter(Boolean).length}</div>
          </div>
          <button onClick={() => setShowEndModal(true)} className="mt-auto rounded-xl border border-rose-400/30 bg-rose-500/10 px-3 py-2.5 text-[10px] font-extrabold uppercase tracking-wider text-rose-300 hover:bg-rose-500/20 transition-colors">End Interview</button>
        </aside>
      </div>

      {/* mobile navigator strip */}
      <div className="relative z-10 lg:hidden flex items-center gap-1.5 overflow-x-auto px-3 py-1.5 border-t border-white/8 bg-deep-950/85">
        {questions.map((q, i) => {
          const isAnswered = answers[i] !== null || texts[i].trim().length > 0;
          return (
            <button key={q.id} onClick={() => go(i)} className={`h-8 w-8 shrink-0 rounded-lg border font-mono text-[10px] font-bold ${i === index ? 'border-sky-400 bg-sky-500 text-deep-950' : isAnswered ? 'border-emerald-400/40 bg-emerald-400/15 text-emerald-300' : 'border-white/10 bg-white/5 text-sky-100/60'}`}>{i + 1}</button>
          );
        })}
        <button onClick={() => setShowEndModal(true)} className="h-8 shrink-0 rounded-lg border border-rose-400/40 bg-rose-500/15 px-3 text-[9px] font-extrabold text-rose-300">END</button>
      </div>

      {/* ════ EXIT CONFIRM MODAL ════ */}
      {confirmExit && (
        <ModalShell onClose={() => setConfirmExit(false)}>
          <AlertTriangle size={34} className="text-amber-400" />
          <h3 className="mt-3 font-display font-extrabold text-xl text-white">Quit this interview?</h3>
          <p className="mt-1.5 text-[12.5px] text-sky-100/70">Your progress in this session will be lost and the attempt will not be recorded.</p>
          <div className="mt-5 flex gap-2.5">
            <button onClick={() => setConfirmExit(false)} className="flex-1 rounded-xl border border-white/15 bg-white/5 py-3 text-[13px] font-bold text-sky-100 hover:bg-white/10">Keep Going</button>
            <button onClick={() => navigate('/')} className="flex-1 rounded-xl bg-rose-500 py-3 text-[13px] font-bold text-white hover:bg-rose-600">Quit Interview</button>
          </div>
        </ModalShell>
      )}

      {/* ════ END INTERVIEW MODAL ════ */}
      {showEndModal && (
        <ModalShell onClose={() => setShowEndModal(false)}>
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-emerald-400/15 border border-emerald-400/30"><Flag size={24} className="text-emerald-400" /></div>
          <h3 className="mt-3 font-display font-extrabold text-xl text-white">Finish the interview?</h3>
          <div className="mt-3 w-full rounded-2xl border border-white/10 bg-white/5 divide-y divide-white/8 text-[12px]">
            <div className="flex justify-between px-4 py-2.5"><span className="text-sky-100/70">Answered</span><b className="text-emerald-300">{answeredCount} / {total}</b></div>
            <div className="flex justify-between px-4 py-2.5"><span className="text-sky-100/70">Flagged for review</span><b className="text-amber-300">{flagged.filter(Boolean).length}</b></div>
            <div className="flex justify-between px-4 py-2.5"><span className="text-sky-100/70">Time used</span><b className="text-sky-200 font-mono">{fmt(elapsed)}</b></div>
          </div>
          <div className="mt-5 flex gap-2.5 w-full">
            <button onClick={() => setShowEndModal(false)} className="flex-1 rounded-xl border border-white/15 bg-white/5 py-3 text-[13px] font-bold text-sky-100 hover:bg-white/10">Review Again</button>
            <button onClick={() => { setShowEndModal(false); finishInterview(); }} className="flex-1 rounded-xl bg-gradient-to-r from-emerald-400 to-sky-500 py-3 text-[13px] font-extrabold text-deep-950 hover:brightness-110">Submit Interview</button>
          </div>
        </ModalShell>
      )}
    </div>
  );
}

/* inline copy of the theory evaluator to avoid circular import issues */
function evaluateTheoryInline(answer: string, q: { keywords?: string[]; points: number }) {
  const keys = q.keywords ?? [];
  if (!answer.trim()) return { earned: 0, fraction: 0, matched: [] as string[], missed: [...keys] };
  const text = answer.toLowerCase();
  const matched = keys.filter((k) => text.includes(k.toLowerCase()));
  const raw = matched.length / Math.max(keys.length, 1);
  const wordBonus = Math.min(answer.trim().split(/\s+/).length / 60, 1);
  const fraction = Math.min(1, raw * 0.8 + wordBonus * 0.2);
  return { earned: Math.round(fraction * q.points), fraction, matched, missed: keys.filter((k) => !matched.includes(k)) };
}

function ModalShell({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center p-5">
      <button className="absolute inset-0 bg-black/65 backdrop-blur-sm cursor-default" onClick={onClose} aria-label="Close" />
      <motion.div initial={{ opacity: 0, scale: 0.92, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="relative w-full max-w-sm rounded-3xl border border-white/12 bg-deep-900 shadow-2xl p-6 flex flex-col items-center text-center">
        {children}
      </motion.div>
    </div>
  );
}
