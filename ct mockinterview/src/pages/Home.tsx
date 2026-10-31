import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, Play, Timer, BrainCircuit, Cpu, Sigma, Code2, ListChecks, PenLine,
  Sparkles, ShieldCheck, Zap, ChevronRight, Star, Quote, BadgeCheck, Users, ClipboardList,
  Building2, CircleCheck, ChevronDown, MousePointerClick, Gauge,
} from 'lucide-react';
import { useCTCore } from '../lib/store';
import { StatCard } from '../components/StatCard';

const companies = ['TCS', 'Infosys', 'Wipro', 'Accenture', 'Cognizant', 'HCLTech', 'Amazon', 'Capgemini', 'Tech Mahindra', 'Oracle', 'Deloitte', 'Flipkart'];

export default function Home() {
  const navigate = useNavigate();
  const { attempts, candidateName } = useCTCore();
  const best = attempts.length ? Math.max(...attempts.map((a) => a.percentage)) : 0;
  const latest = attempts[0];
  const avg = attempts.length ? Math.round(attempts.reduce((s, a) => s + a.percentage, 0) / attempts.length) : 0;

  const [openFaq, setOpenFaq] = useState<number>(0);
  const faqs = [
    { q: 'How is the mock interview conducted?', a: 'CTCore recreates a real placement-panel experience: a timed mix of Technology, Aptitude and Critical-Thinking rounds. MCQs and code-output questions give you 30 seconds each; theory questions give you 90 seconds to type a structured answer. You get instant scoring, explanations and a performance report at the end.' },
    { q: 'What question formats are asked?', a: 'Two formats: (1) MCQs with four options — pure technology theory, quantitative aptitude and logical reasoning, and (2) code-output prediction where you read a JavaScript/Java snippet and answer what it prints. Some rounds include open theory questions graded on keyword coverage with a model answer to learn from.' },
    { q: 'Which companies do these questions prepare me for?', a: 'The bank is aligned to the elimination rounds of TCS NQT, Infosys, Wipro, Accenture, Cognizant, HCLTech, Amazon, Capgemini, Tech Mahindra, Oracle, Deloitte and Flipkart — the exact topics their aptitude and technical sections weight most.' },
    { q: 'How is my theory answer scored?', a: 'Theory answers are graded on conceptual keyword coverage (80%) plus answer substance and length (20%). You see your score, the keywords you matched, the ones you missed, and a model answer — so every attempt actually teaches you.' },
    { q: 'Is my progress saved?', a: 'Yes. Every attempt is stored on your device with full per-question review, section-wise breakdown, trend charts and an achievement badge. You even get a printable certificate when you complete a full simulation.' },
  ];

  return (
    <div className="overflow-x-hidden">
      {/* ════════════ HERO ════════════ */}
      <section className="hero-glow relative">
        <div className="dot-grid pointer-events-none absolute inset-0 opacity-70" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-10 pb-16 lg:pt-14 lg:pb-24 grid lg:grid-cols-2 gap-10 items-center">
          {/* left */}
          <div>
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
              <span className="inline-flex items-center gap-2 rounded-full border border-sky-300 bg-white/80 backdrop-blur px-3.5 py-1.5 text-[11px] font-bold text-sky-700 shadow-sm">
                <Sparkles size={13} className="text-sky-500" /> CTCore Mock Interview Module
                <span className="rounded-full bg-sky-600 px-2 py-0.5 text-[9px] text-white tracking-wider">NEW</span>
              </span>
              <h1 className="mt-5 font-display font-extrabold tracking-tight text-deep-900 text-[40px] leading-[1.05] sm:text-5xl xl:text-[56px]">
                Walk Into Interviews<br />
                <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-cyan-500 to-sky-600">
                  Battle-Ready
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 220 12" fill="none"><path d="M2 9c60-6 156-6 216 0" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" opacity="0.65"/></svg>
                </span>
              </h1>
              <p className="mt-5 text-[15px] sm:text-base leading-relaxed text-deep-800/80 max-w-lg">
                Practice the exact <span className="font-semibold text-deep-900">technology, aptitude and critical-thinking</span> rounds asked by India’s top recruiters. Timed MCQs, code-output prediction and theory — graded instantly, with expert explanations.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.12 }} className="mt-7 flex flex-wrap items-center gap-3">
              <button onClick={() => navigate('/interview')}
                className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-500 px-6 py-4 font-display font-bold text-white text-[15px] shadow-xl shadow-sky-500/35 hover:shadow-2xl hover:shadow-sky-500/40 hover:-translate-y-0.5 transition-all">
                <Play size={18} fill="currentColor" /> Start Mock Interview
                <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
              </button>
              <Link to="/question-bank" className="inline-flex items-center gap-2 rounded-2xl border-2 border-sky-200 bg-white px-5 py-[14px] font-display font-bold text-deep-800 text-[14px] hover:border-sky-400 hover:text-sky-700 transition-colors">
                Explore Question Bank <ChevronRight size={16} />
              </Link>
            </motion.div>

            {/* timing badges */}
            <div className="mt-7 flex flex-wrap gap-2.5">
              {[
                { icon: Timer, t: 'MCQ · 30 sec', tone: 'text-sky-700 border-sky-200 bg-white' },
                { icon: Code2, t: 'Code Output · 30 sec', tone: 'text-deep-800 border-sky-300 bg-sky-50' },
                { icon: PenLine, t: 'Theory · 90 sec', tone: 'text-cyan-800 border-cyan-200 bg-cyan-50' },
              ].map(({ icon: I, t, tone }) => (
                <span key={t} className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-[11.5px] font-bold ${tone} shadow-sm`}>
                  <I size={14} /> {t}
                </span>
              ))}
            </div>

            {/* trust stats */}
            <div className="mt-8 flex items-center gap-5">
              <div className="flex -space-x-2.5">
                {['AS', 'RK', 'PM', 'NJ', 'VS'].map((n, i) => (
                  <span key={i} className="grid h-9 w-9 place-items-center rounded-full border-2 border-white text-[10px] font-extrabold text-white"
                        style={{ background: ['#0284c7', '#0891b2', '#4f46e5', '#0369a1', '#0e7490'][i] }}>{n}</span>
                ))}
              </div>
              <div className="text-[11.5px] leading-snug">
                <div className="flex items-center gap-1 font-extrabold text-deep-900"><Star size={12} fill="#f59e0b" className="text-amber-400" /> 4.9 rating</div>
                <span className="text-deep-800/65 font-medium">18,400+ simulated interviews completed</span>
              </div>
            </div>
          </div>

          {/* right — hero image + floating cards */}
          <div className="relative mx-auto w-full max-w-[520px]">
            <div className="absolute inset-8 rounded-[3rem] ring-conic opacity-20 blur-2xl" />
            <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.15 }}
              className="relative rounded-[2.2rem] border border-sky-100 bg-white p-2.5 shadow-2xl shadow-sky-900/15">
              <img src="/images/hero-interview.png" alt="CTCore mock interview session" className="w-full aspect-square object-cover rounded-[1.8rem]" />
              {/* live badge */}
              <div className="absolute top-5 right-5 inline-flex items-center gap-1.5 rounded-full bg-deep-900/90 backdrop-blur px-3 py-1.5 text-[10px] font-bold text-sky-300 tracking-widest">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse-soft" /> LIVE PANEL
              </div>
            </motion.div>

            {/* floating card 1 — timer */}
            <div className="absolute -left-2 sm:-left-6 top-16 animate-float rounded-2xl border border-sky-100 bg-white/95 backdrop-blur shadow-xl shadow-sky-900/10 px-3.5 py-2.5 flex items-center gap-2.5">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-sky-50 border border-sky-100"><Timer size={19} className="text-sky-600" /></span>
              <span>
                <span className="block text-[15px] font-display font-extrabold text-deep-900 leading-none">30<span className="text-[11px]">s</span></span>
                <span className="text-[9.5px] font-semibold text-slate-500 uppercase tracking-wide">per MCQ</span>
              </span>
            </div>
            {/* floating card 2 — score */}
            <div className="absolute -right-2 sm:-right-5 top-1/3 animate-float-late rounded-2xl border border-sky-100 bg-white/95 backdrop-blur shadow-xl shadow-sky-900/10 px-3.5 py-2.5 flex items-center gap-2.5">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 border border-emerald-100"><BadgeCheck size={19} className="text-emerald-600" /></span>
              <span>
                <span className="block text-[15px] font-display font-extrabold text-deep-900 leading-none">9.2<span className="text-[10px]">/10</span></span>
                <span className="text-[9.5px] font-semibold text-slate-500 uppercase tracking-wide">Avg. score</span>
              </span>
            </div>
            {/* floating card 3 — rounds */}
            <div className="absolute left-6 sm:left-12 -bottom-5 animate-float rounded-2xl border border-sky-100 bg-deep-900 text-white shadow-xl shadow-sky-900/30 px-4 py-2.5" style={{ animationDelay: '2s' }}>
              <div className="text-[9px] font-bold uppercase tracking-widest text-sky-400">3 timed rounds</div>
              <div className="mt-0.5 text-[12px] font-display font-bold">Tech · Aptitude · Critical</div>
            </div>
          </div>
        </div>

        {/* company marquee */}
        <div className="relative border-y border-sky-100 bg-white/70 backdrop-blur py-3">
          <div className="mx-auto max-w-7xl px-6 flex items-center gap-6">
            <span className="hidden sm:inline text-[10px] font-extrabold uppercase tracking-[0.18em] text-deep-800/60 whitespace-nowrap">Patterns from</span>
            <div className="overflow-hidden flex-1 [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
              <div className="animate-marquee flex w-max items-center gap-10">
                {[...companies, ...companies].map((c, i) => (
                  <span key={i} className="font-display text-[15px] font-extrabold text-deep-800/45 flex items-center gap-1.5 whitespace-nowrap"><Building2 size={13} />{c}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════ THREE ROUNDS ════════════ */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-[10.5px] font-extrabold uppercase tracking-[0.22em] text-sky-600">One Module · Three Eliminators</span>
          <h2 className="mt-2 font-display font-extrabold text-3xl sm:text-4xl text-deep-900 tracking-tight">Every Round a Real Panel Asks</h2>
          <p className="mt-2 text-[13.5px] text-deep-800/70">Pick a single round to drill it, or sit the full simulation — 12 questions, three sections, one scorecard.</p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            {
              icon: Cpu, round: 'Round 01', name: 'Technology', accent: 'from-sky-400 to-sky-600',
              desc: 'JavaScript, React, Java, SQL & data structures — theory MCQs plus live code-output prediction on real snippets.',
              meta: '12 questions · 2 theory sets · 4 code-output items',
              topics: ['JavaScript & React', 'Java & OOP', 'SQL & DBMS', 'DSA & Big-O', 'HTML & Web'],
            },
            {
              icon: Sigma, round: 'Round 02', name: 'Aptitude', accent: 'from-cyan-400 to-sky-600',
              desc: 'Speed-math under pressure: percentages, averages, time-work-distance, ratios, probability and series.',
              meta: '12 questions · 30-second sprints · negative-mark style review',
              topics: ['Speed & Distance', 'Percentages', 'Time & Work', 'Ratios', 'Probability', 'Number Series'],
            },
            {
              icon: BrainCircuit, round: 'Round 03', name: 'Critical Thinking', accent: 'from-indigo-400 to-sky-700',
              desc: 'Syllogisms, assumptions, argument evaluation, estimation and debugging mindset — how panels judge thinking.',
              meta: '12 questions · reasoning-heavy · interviewer-style debrief',
              topics: ['Syllogisms', 'Assumptions', 'Argument Analysis', 'Estimation', 'Debugging Mindset'],
            },
          ].map(({ icon: Icon, round, name, accent, desc, meta, topics }) => (
            <div key={name} className="card-lift group relative overflow-hidden rounded-3xl border border-sky-100 bg-white shadow-sm">
              <div className={`h-1.5 bg-gradient-to-r ${accent}`} />
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <span className={`grid h-13 w-13 sm:h-14 sm:w-14 place-items-center rounded-2xl bg-gradient-to-br ${accent} text-white shadow-lg shadow-sky-500/30 p-3.5`}><Icon size={26} strokeWidth={1.8} /></span>
                  <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-400">{round}</span>
                </div>
                <h3 className="mt-4 font-display font-extrabold text-[22px] text-deep-900">{name}</h3>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-deep-800/75 min-h-[54px]">{desc}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {topics.map((t) => (
                    <span key={t} className="rounded-md bg-sky-50 border border-sky-100 px-2 py-1 text-[10px] font-semibold text-sky-800">{t}</span>
                  ))}
                </div>
                <div className="mt-4 border-t border-sky-100 pt-3 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-semibold text-slate-500 leading-snug">{meta}</span>
                  <Link to="/interview" className="shrink-0 inline-flex items-center gap-1 text-[12px] font-extrabold text-sky-700 hover:text-sky-500">Practice <ArrowRight size={13} /></Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════ FORMATS & RULES + PERSONAL STATS ════════════ */}
      <section className="bg-deep-900 text-white relative overflow-hidden">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-16 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 text-[10.5px] font-extrabold uppercase tracking-[0.22em] text-sky-400"><Gauge size={13}/> How the module works</span>
            <h2 className="mt-2 font-display font-extrabold text-3xl text-white tracking-tight">Two Formats. Strict Timers.<br />Real Pressure.</h2>
            <div className="mt-6 space-y-4">
              {[
                { icon: MousePointerClick, title: 'MCQ & Code-Output — 30 seconds', d: 'Four options, one shot. Code questions show a real JavaScript/Java snippet — predict the output before the clock runs out.' },
                { icon: PenLine, title: 'Theory — 90 seconds', d: 'Open-ended questions like panels ask (“explain == vs ===”). Your answer is graded on concept coverage with a model answer to learn.' },
                { icon: ListChecks, title: 'Instant debrief after every question', d: 'Correct answer highlighted, your time taken, per-question explanation and a tough-questions bookmark list.' },
                { icon: ShieldCheck, title: 'Anti-cheat feel, zero setup', d: 'Fullscreen interview shell, progress rail, question navigator and auto time-out with auto-submit.' },
              ].map(({ icon: I, title, d }) => (
                <div key={title} className="flex gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/8 border border-white/10 text-sky-300"><I size={19} /></span>
                  <span>
                    <span className="block font-display font-bold text-[14.5px] text-white">{title}</span>
                    <span className="mt-0.5 block text-[12px] leading-relaxed text-sky-100/70">{d}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* personal stats panel */}
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-6 sm:p-7">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-sky-400">Your Performance</div>
                <div className="mt-1 font-display font-extrabold text-xl text-white">Welcome back, {candidateName.split(' ')[0]} 👋</div>
              </div>
              <button onClick={() => navigate('/dashboard')} className="text-[11px] font-bold text-sky-300 hover:text-white inline-flex items-center gap-1 border border-sky-400/30 rounded-lg px-3 py-1.5">Full Dashboard <ArrowRight size={12} /></button>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3">
              <StatCard label="Interviews" value={attempts.length} sub="attempts" tone="dark" />
              <StatCard label="Best Score" value={best} suffix="%" sub="overall" tone="dark" />
              <StatCard label="Average" value={avg} suffix="%" sub="all rounds" tone="dark" />
            </div>
            {latest && (
              <div className="mt-4 rounded-2xl border border-white/10 bg-deep-950/60 p-4 flex items-center gap-4">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-sky-400 to-cyan-600 font-display font-extrabold text-lg">{latest.percentage}</div>
                <div className="min-w-0">
                  <div className="text-[10px] uppercase tracking-widest text-sky-400 font-bold">Last Attempt · {new Date(latest.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>
                  <div className="text-[13px] font-bold text-white truncate">{latest.modeLabel}</div>
                  <div className="text-[11px] text-sky-100/65">{latest.score}/{latest.maxScore} pts · {latest.totalQuestions} questions</div>
                </div>
                <Link to="/dashboard" className="ml-auto shrink-0 text-sky-300 hover:text-white"><ChevronRight size={20} /></Link>
              </div>
            )}
            <div className="mt-4 flex items-center gap-2 text-[11px] text-sky-100/60"><Zap size={12} className="text-amber-400" /> Complete a Full Simulation to unlock your CTCore certificate.</div>
          </div>
        </div>
      </section>

      {/* ════════════ WHAT YOU GET / STEPS ════════════ */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <div className="grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <span className="text-[10.5px] font-extrabold uppercase tracking-[0.22em] text-sky-600">The 4-Step Method</span>
            <h2 className="mt-2 font-display font-extrabold text-3xl text-deep-900 tracking-tight">From Nervous to Offer-Ready in Four Steps</h2>
            <p className="mt-3 text-[13px] leading-relaxed text-deep-800/75">CTCore mirrors the actual flow companies use — so the first real interview you sit will feel like your fifth mock.</p>
            <img src="/images/hero-interview.png" alt="Candidate practising with CTCore" className="mt-6 hidden lg:block w-44 rounded-2xl opacity-90 mix-blend-multiply" />
          </div>
          <div className="lg:col-span-3 grid sm:grid-cols-2 gap-4">
            {[
              { n: '01', t: 'Choose your round', d: 'Full simulation or a focused drill — Technology, Aptitude or Critical Thinking.' },
              { n: '02', t: 'Face the timer', d: '30s MCQs, 30s code-output predictions, 90s theory answers. No pauses, no mercy.' },
              { n: '03', t: 'Get instant debrief', d: 'Every answer explained. Theory graded on concept coverage with a model answer.' },
              { n: '04', t: 'Track & certify', d: 'Section-wise analytics, trend charts, achievements and a printable certificate.' },
            ].map((s) => (
              <div key={s.n} className="relative rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
                <span className="font-display text-4xl font-extrabold text-sky-100 select-none">{s.n}</span>
                <div className="-mt-3">
                  <div className="font-display font-bold text-[15px] text-deep-900">{s.t}</div>
                  <p className="mt-1 text-[12px] leading-relaxed text-deep-800/70">{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ TESTIMONIALS ════════════ */}
      <section className="bg-sky-50/70 border-y border-sky-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <span className="text-[10.5px] font-extrabold uppercase tracking-[0.22em] text-sky-600">Success Stories</span>
              <h2 className="mt-1 font-display font-extrabold text-2xl sm:text-3xl text-deep-900">Freshers Who Cleared the Panel</h2>
            </div>
            <div className="flex items-center gap-2 text-[12px] font-bold text-deep-800 bg-white border border-sky-100 rounded-xl px-4 py-2 shadow-sm"><Users size={15} className="text-sky-600"/> 18,400+ candidates interviewed</div>
          </div>
          <div className="mt-8 grid md:grid-cols-3 gap-5">
            {[
              { name: 'Anjali Sharma', role: 'SDE Intern · Amazon', college: 'VIT Vellore', quote: 'The code-output round felt exactly like Amazon’s online test. I solved 5 of 6 under the 30-second timer — practice under pressure changed everything.', score: 86 },
              { name: 'Rohit Kulkarni', role: 'System Engineer · Infosys', college: 'Pune University', quote: 'Aptitude was my weakness. Two weeks of daily 30-second drills and my speed doubled. Walked into NQT without touching my calculator once.', score: 78 },
              { name: 'Priya Nair', role: 'Analyst · Deloitte', college: 'NIT Trichy', quote: 'The theory grading showing exactly which keywords I missed taught me more than any PDF. The model answer feature is gold.', score: 91 },
            ].map((t) => (
              <figure key={t.name} className="rounded-2xl border border-sky-100 bg-white p-6 shadow-sm flex flex-col">
                <Quote size={22} className="text-sky-300" />
                <blockquote className="mt-3 text-[13px] leading-relaxed text-deep-800/85 flex-1">“{t.quote}”</blockquote>
                <figcaption className="mt-4 flex items-center gap-3 border-t border-sky-100 pt-4">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-sky-500 to-cyan-700 text-[12px] font-extrabold text-white">{t.name.split(' ').map(w => w[0]).join('')}</span>
                  <span className="min-w-0">
                    <span className="block text-[13px] font-extrabold text-deep-900">{t.name}</span>
                    <span className="block text-[10.5px] font-semibold text-sky-700">{t.role}</span>
                    <span className="block text-[10px] text-slate-500">{t.college} · CTCore score {t.score}%</span>
                  </span>
                  <CircleCheck size={18} className="ml-auto text-emerald-500 shrink-0" />
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ FAQ ════════════ */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 py-16">
        <div className="text-center">
          <span className="text-[10.5px] font-extrabold uppercase tracking-[0.22em] text-sky-600">Questions & Answers</span>
          <h2 className="mt-2 font-display font-extrabold text-3xl text-deep-900 tracking-tight">Everything About the Module</h2>
        </div>
        <div className="mt-8 divide-y divide-sky-100 rounded-2xl border border-sky-100 bg-white shadow-sm overflow-hidden">
          {faqs.map((f, i) => (
            <div key={i}>
              <button onClick={() => setOpenFaq(openFaq === i ? -1 : i)} className="w-full flex items-center justify-between gap-4 px-6 py-4.5 sm:py-5 text-left hover:bg-sky-50/50 transition-colors">
                <span className="font-display font-bold text-[14px] sm:text-[15px] text-deep-900">{f.q}</span>
                <ChevronDown size={18} className={`shrink-0 text-sky-600 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === i && <div className="px-6 pb-5 -mt-1 text-[13px] leading-relaxed text-deep-800/80 border-t border-sky-50 pt-4">{f.a}</div>}
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <button onClick={() => navigate('/interview')} className="inline-flex items-center gap-2 rounded-2xl bg-deep-800 px-7 py-4 font-display font-bold text-white hover:bg-deep-900 transition-colors shadow-lg">
            <ClipboardList size={18} /> I’m Ready — Take the Mock Interview <ArrowRight size={17} />
          </button>
        </div>
      </section>
    </div>
  );
}
