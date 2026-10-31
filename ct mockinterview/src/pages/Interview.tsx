import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Rocket, Cpu, Sigma, BrainCircuit, Sparkles, Timer, ListChecks, ShieldCheck,
  CheckCircle2, Info, PenLine, Code2, Check, UserRound, AlertCircle, Layers,
} from 'lucide-react';
import { useCTCore } from '../lib/store';
import { SECTION_META, type InterviewMode, type SectionId, QUESTION_BANK } from '../data/questions';

const modeCards: {
  id: InterviewMode; icon: typeof Layers; title: string; tagline: string; questions: string; points: string; accent: string; iconBg: string;
}[] = [
  { id: 'full', icon: Layers, title: 'Full Interview Simulation', tagline: 'The complete panel experience — all three eliminator rounds, back to back.', questions: '12 questions (4 per section)', points: '42 max points', accent: 'border-sky-400 ring-2 ring-sky-400/40', iconBg: 'bg-gradient-to-br from-sky-500 to-cyan-600' },
  { id: 'technology', icon: Cpu, title: 'Technology Round', tagline: 'JavaScript, React, Java, SQL, DBMS, DSA & HTML — with code-output prediction.', questions: '12 questions', points: '32 max points', accent: 'border-sky-200', iconBg: 'bg-gradient-to-br from-sky-400 to-sky-600' },
  { id: 'aptitude', icon: Sigma, title: 'Aptitude Round', tagline: 'Speed math, percentages, ratios, time-work-distance, probability & series.', questions: '12 questions', points: '28 max points', accent: 'border-cyan-200', iconBg: 'bg-gradient-to-br from-cyan-400 to-sky-600' },
  { id: 'critical', icon: BrainCircuit, title: 'Critical Thinking Round', tagline: 'Syllogisms, assumptions, arguments, debugging mindset & estimation.', questions: '12 questions', points: '31 max points', accent: 'border-indigo-200', iconBg: 'bg-gradient-to-br from-indigo-400 to-sky-700' },
];

export default function Interview() {
  const navigate = useNavigate();
  const { candidateName, setCandidateName, disabledIds } = useCTCore();
  const [mode, setMode] = useState<InterviewMode>('full');
  const [nameInput, setNameInput] = useState(candidateName === 'You' ? '' : candidateName);
  const [agreed, setAgreed] = useState(false);
  const [touched, setTouched] = useState(false);

  const activePool = useMemo(() => {
    return QUESTION_BANK.filter((q) => !disabledIds.includes(q.id));
  }, [disabledIds]);

  const start = () => {
    setTouched(true);
    if (!agreed) return;
    setCandidateName(nameInput.trim() || 'You');
    navigate('/interview/live', { state: { mode } });
  };

  return (
    <div className="relative">
      <div className="dot-grid pointer-events-none absolute inset-0 opacity-60" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-10 lg:py-14 grid lg:grid-cols-5 gap-8">

        {/* ───────── left column : configuration ───────── */}
        <div className="lg:col-span-3">
          <span className="text-[10.5px] font-extrabold uppercase tracking-[0.22em] text-sky-600">Candidate Check-in</span>
          <h1 className="mt-1.5 font-display font-extrabold text-3xl sm:text-4xl text-deep-900 tracking-tight">Configure Your Mock Interview</h1>
          <p className="mt-2 text-[13px] text-deep-800/70">Choose a round, confirm your details and sit the interview under real panel conditions.</p>

          {/* name */}
          <label className="mt-6 block">
            <span className="text-[11px] font-bold uppercase tracking-widest text-deep-800/70 inline-flex items-center gap-1.5"><UserRound size={13}/> Candidate Name <span className="text-slate-400 normal-case font-semibold">(printed on certificate)</span></span>
            <input
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="e.g. Anjali Sharma"
              className="mt-2 w-full rounded-2xl border-2 border-sky-100 bg-white px-5 py-3.5 text-[15px] font-semibold text-deep-900 placeholder-slate-400 outline-none focus:border-sky-400 focus:ring-4 ring-sky-100 transition"
            />
          </label>

          {/* mode selection */}
          <div className="mt-6">
            <span className="text-[11px] font-bold uppercase tracking-widest text-deep-800/70 inline-flex items-center gap-1.5"><Layers size={13}/> Select Round</span>
            <div className="mt-2 grid sm:grid-cols-2 gap-3">
              {modeCards.map(({ id, icon: Icon, title, tagline, questions, points, accent, iconBg }) => {
                const active = mode === id;
                return (
                  <button key={id} onClick={() => setMode(id)}
                    className={`relative text-left rounded-2xl border-2 bg-white p-4 transition-all duration-200 ${active ? accent + ' shadow-lg shadow-sky-500/15 -translate-y-0.5' : 'border-sky-100 hover:border-sky-300'}`}>
                    {active && (
                      <span className="absolute top-3 right-3 grid h-6 w-6 place-items-center rounded-full bg-sky-500 text-white">
                        <Check size={13} strokeWidth={3.5} />
                      </span>
                    )}
                    <span className={`inline-grid h-11 w-11 place-items-center rounded-xl text-white ${iconBg}`}><Icon size={21} strokeWidth={1.9} /></span>
                    <span className="mt-3 block font-display font-extrabold text-[15px] text-deep-900 leading-snug">{title}</span>
                    <span className="mt-1 block text-[11px] leading-snug text-deep-800/65 min-h-[44px]">{tagline}</span>
                    <span className="mt-2 flex items-center gap-2 text-[10px] font-bold text-sky-800">
                      <span className="rounded-md bg-sky-50 border border-sky-100 px-2 py-1">{questions}</span>
                      <span className="rounded-md bg-cyan-50 border border-cyan-100 px-2 py-1">{points}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* agreement */}
          <button onClick={() => setAgreed((v) => !v)} className="mt-6 flex items-start gap-3 text-left group">
            <span className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md border-2 transition-all ${agreed ? 'border-sky-500 bg-sky-500 text-white' : touched && !agreed ? 'border-rose-400 bg-rose-50' : 'border-sky-200 bg-white group-hover:border-sky-400'}`}>
              {agreed && <Check size={14} strokeWidth={4} />}
            </span>
            <span className="text-[12px] leading-relaxed text-deep-800/80">
              I understand the rules — <b>30 seconds</b> for each MCQ & code question, <b>90 seconds</b> for each theory answer, <b>no refreshing</b> during the interview, and that my answers are scored instantly with an explanation for learning.
            </span>
          </button>
          {touched && !agreed && (
            <p className="mt-2 inline-flex items-center gap-1.5 text-[11.5px] font-bold text-rose-600"><AlertCircle size={13}/> Please accept the interview rules to begin.</p>
          )}

          <button onClick={start}
            className="mt-6 group inline-flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-sky-500 via-sky-600 to-cyan-600 px-9 py-4.5 py-4 font-display font-extrabold text-lg text-white shadow-xl shadow-sky-600/35 hover:shadow-2xl hover:shadow-sky-600/40 hover:-translate-y-0.5 transition-all">
            <Rocket size={21} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            Begin Interview Now
          </button>
        </div>

        {/* ───────── right column : rules brief ───────── */}
        <div className="lg:col-span-2">
          <div className="sticky top-24 rounded-3xl border border-sky-100 bg-white shadow-xl shadow-sky-900/5 overflow-hidden">
            <div className="bg-deep-900 px-6 py-4 flex items-center justify-between">
              <div>
                <div className="text-[9.5px] font-extrabold uppercase tracking-[0.22em] text-sky-400">Panel Briefing</div>
                <div className="font-display font-extrabold text-white text-[16px]">Interview Rules & Scoring</div>
              </div>
              <ShieldCheck size={26} className="text-sky-400" />
            </div>
            <div className="p-6">
              {/* timing table */}
              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  { icon: ListChecks, label: 'MCQ', time: '30s', pts: '2 pts', cls: 'bg-sky-50 border-sky-200 text-sky-800' },
                  { icon: Code2, label: 'Code Output', time: '30s', pts: '3 pts', cls: 'bg-deep-800 border-deep-800 text-sky-200' },
                  { icon: PenLine, label: 'Theory', time: '90s', pts: '6 pts', cls: 'bg-gradient-to-br from-sky-500 to-cyan-500 border-transparent text-white' },
                ].map(({ icon: I, label, time, pts, cls }) => (
                  <div key={label} className={`rounded-2xl border px-2 py-3.5 ${cls}`}>
                    <I size={18} className="mx-auto" />
                    <div className="mt-1.5 text-[10px] font-bold uppercase tracking-widest opacity-90">{label}</div>
                    <div className="font-display font-extrabold text-xl leading-none mt-0.5">{time}</div>
                    <div className="text-[9.5px] font-bold opacity-85 mt-1">{pts} / question</div>
                  </div>
                ))}
              </div>

              <ul className="mt-5 space-y-2.5 text-[12px] text-deep-800/85">
                {[
                  'Timer starts the moment the question appears. Expired time auto-submits your answer.',
                  'Use Next to move on. You can flag questions and revisit them from the navigator rail.',
                  'Theory answers are graded on keyword coverage + substance — model answer shown after.',
                  'Every answer carries an explanation, so each mock is a lesson, not just a test.',
                  'Finish to unlock: scorecard, section radar, review, achievements & certificate.',
                ].map((t, i) => (
                  <li key={i} className="flex items-start gap-2"><CheckCircle2 size={14} className="mt-0.5 shrink-0 text-emerald-500" />{t}</li>
                ))}
              </ul>

              <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 flex gap-2.5">
                <Info size={16} className="shrink-0 text-amber-600 mt-0.5" />
                <p className="text-[11px] leading-snug text-amber-800"><b>Anti-rush tip:</b> In code-output questions, trace the loop variable by variable — the wrong-but-tempting option is usually the off-by-one.</p>
              </div>

              <div className="mt-4 flex items-center justify-between text-[10.5px] font-semibold text-slate-500 border-t border-sky-100 pt-4">
                <span className="inline-flex items-center gap-1.5"><Timer size={13} className="text-sky-600"/> Fresh randomised set every attempt</span>
                <span>{activePool.length}/36 questions active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
