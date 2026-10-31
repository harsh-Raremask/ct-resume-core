import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ChevronRight, ShieldCheck, Youtube, Clock, Star, FileText, Loader2, CheckCircle2, Flame, ClipboardList, Rocket } from 'lucide-react';
import { DEMOS } from '../lib/data';

const TICKER = ['Priya S. → TCS Digital', 'Aman K. → Startup Frontend', 'Neha P. → Deloitte Analyst', 'Rahul V. → D2C Marketing', 'Sneha R. → Product Design', '2,847 comebacks and counting'];

export default function Hero({ onDemo }: { onDemo: (key: keyof typeof DEMOS) => void }) {
  const [demoLoading, setDemoLoading] = useState(false);

  const scrollToAnalyzer = () => document.getElementById('analyzer')?.scrollIntoView({ behavior: 'smooth' });

  const handleDemo = () => {
    setDemoLoading(true);
    onDemo('frontend');
    window.setTimeout(() => setDemoLoading(false), 900);
  };

  return (
    <section id="top" className="dark-grid relative overflow-hidden text-white">
      {/* ambient glows */}
      <div aria-hidden className="pointer-events-none absolute -left-32 top-24 h-96 w-96 rounded-full bg-sky-300/25 blur-[130px]" />
      <div aria-hidden className="pointer-events-none absolute -right-32 top-40 h-96 w-96 rounded-full bg-white/10 blur-[130px]" />

      <div className="relative mx-auto max-w-[1280px] px-4 pt-12 pb-14 sm:px-6 lg:px-8 lg:pt-16 lg:pb-16">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1fr] lg:gap-12">
          {/* LEFT */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 py-1.5 pl-1.5 pr-4 backdrop-blur"
            >
              <span className="grid h-6 w-6 place-items-center rounded-full bg-white text-[11px] text-ink"><Sparkles size={12} strokeWidth={2.5} /></span>
              <span className="text-[11px] font-bold tracking-[0.14em] text-sky-100">RESUME → ATS SCORE → 30-DAY SPRINT</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="mt-6 font-display text-[42px] leading-[0.98] font-extrabold tracking-tight sm:text-[56px] lg:text-[64px]"
            >
              Bridge your<br />
              <span className="relative inline-block text-sky-100">
                career gap
                <svg aria-hidden className="absolute -bottom-1 left-0 w-full" viewBox="0 0 220 10" fill="none"><path d="M2 7c60-4 160-4 216 0" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.7" /></svg>
              </span><br />
              in 30 days.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.16 }}
              className="mt-6 max-w-[540px] text-[17px] leading-7 text-sky-100"
            >
              Upload your resume. CT Core-30 reads it like a recruiter <em className="text-white not-italic font-semibold">and</em> an ATS — then hands you an ATS score, skill-gap map, course picks and a day-by-day 30-day comeback plan.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.24 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <button
                onClick={scrollToAnalyzer}
                className="group flex h-[54px] items-center gap-2 rounded-full bg-white px-7 text-[15px] font-extrabold text-ink transition hover:bg-sky-50"
              >
                Analyze My Resume — Free
                <ChevronRight size={18} strokeWidth={2.6} className="transition-transform group-hover:translate-x-0.5" />
              </button>
              <button
                onClick={handleDemo}
                className="flex h-[54px] items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 text-sm font-bold text-white backdrop-blur transition hover:border-white/35 hover:bg-white/10"
              >
                {demoLoading ? <Loader2 size={17} className="animate-spin" /> : <FileText size={17} />}
                {demoLoading ? 'Loading demo…' : 'Try demo resume'}
              </button>
            </motion.div>

            <div className="mt-6 flex flex-wrap gap-2 text-[11px] font-semibold text-sky-100">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5"><ShieldCheck size={13} className="text-emerald-400" /> Real ATS scoring, not vibes</span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5"><Youtube size={13} className="text-red-400" /> 100% free YouTube courses</span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5"><Clock size={13} className="text-sky-400" /> ~45 min a day</span>
            </div>

            {/* stats */}
            <div className="mt-9 grid max-w-[540px] grid-cols-3 gap-3">
              {[
                { big: '2,847', small: 'COMEBACK STORIES', sub: 'and counting', icon: <Rocket size={15} className="text-sky-100" /> },
                { big: '+34%', small: 'AVG. ATS LIFT', sub: 'after one sprint', icon: <Sparkles size={15} className="text-sky-100" /> },
                { big: '4.8/5', small: 'LEARNER RATING', sub: '★ ★ ★ ★ ★', icon: <Star size={15} className="text-sky-100" /> },
              ].map((s, i) => (
                <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur">
                  <div className="flex items-center gap-1.5 font-display text-[22px] font-extrabold tracking-tight">{s.icon}{s.big}</div>
                  <div className="mt-1 text-[9px] font-bold tracking-[0.16em] text-sky-100">{s.small}</div>
                  <div className="text-[10px] font-medium text-slate-500">{s.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — generated hero art + floating 30-day board card */}
          <div className="relative mx-auto w-full max-w-[520px]">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.15 }}
              className="relative overflow-hidden rounded-[28px] border border-white/12 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)]"
            >
              <img src="/images/career-bridge.png" alt="A professional crossing a glowing bridge from a career gap to a job-ready future" className="aspect-[16/9] w-full object-cover sm:aspect-[4/3] lg:aspect-[16/13]" />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#075985] via-[#075985]/25 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="text-[10px] font-bold tracking-[0.2em] text-sky-100">THE 30-DAY PROMISE</p>
                <p className="mt-1 font-display text-lg font-bold leading-snug text-white text-balance">From “career gap” to interview-ready — one day at a time.</p>
              </div>
            </motion.div>

            {/* floating board card */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="absolute -right-1 bottom-28 hidden w-[240px] rounded-2xl border border-slate-200 bg-white p-4 text-ink shadow-2xl sm:block"
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold tracking-[0.18em] text-slate-400">YOUR SPRINT BOARD</span>
                <span className="rounded-full bg-brand px-2 py-0.5 text-[9px] font-bold text-white">Day 14/30</span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <Flame size={16} className="text-orange-500" />
                <div className="leading-tight">
                  <p className="text-sm font-extrabold">9-day streak</p>
                  <p className="text-[10px] font-medium text-slate-500">React · Week 3 of 4</p>
                </div>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-[46%] rounded-full bg-sky-500" />
              </div>
              <div className="mt-2 flex items-center justify-between text-[9px] font-semibold text-slate-500">
                <span>18.5h logged</span><span>2/4 projects shipped</span>
              </div>
            </motion.div>

            {/* floating ATS badge */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="absolute -left-2 top-6 hidden items-center gap-2.5 rounded-2xl border border-slate-200 bg-white p-3 pr-4 text-ink shadow-2xl sm:flex"
            >
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500">
                <CheckCircle2 size={20} className="text-white" />
              </div>
              <div className="leading-tight">
                <p className="text-[13px] font-extrabold">ATS Score 78 → <span className="text-emerald-600">94</span></p>
                <p className="text-[10px] font-medium text-slate-500">after the 30-day sprint</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* success ticker */}
      <div className="relative border-t border-white/10 bg-brand/70 py-2.5 backdrop-blur">
        <div className="flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_6%,black_94%,transparent)]">
          <div className="animate-ticker flex shrink-0 items-center gap-8 whitespace-nowrap pr-8">
            {[...TICKER, ...TICKER].map((t, i) => (
              <span key={i} className="flex items-center gap-2 text-[11px] font-semibold tracking-wide text-sky-100">
                <ClipboardList size={11} className="text-sky-100" /> {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
