import { motion } from 'framer-motion';
import { FileScan, Upload, ListChecks, ArrowRight } from 'lucide-react';

export default function EmptyState() {
  const scroll = () => document.getElementById('analyzer')?.scrollIntoView({ behavior: 'smooth' });
  const steps = [
    { icon: Upload, num: '01', title: 'Drop your resume', body: 'PDF, DOCX or paste — parsed locally, never uploaded anywhere.' },
    { icon: FileScan, num: '02', title: 'Get your ATS score', body: '8 checks, 100 points, specific fixes — not vague vibes.' },
    { icon: ListChecks, num: '03', title: 'Follow your sprint', body: '30 days, free YouTube courses, daily tasks, projects included.' },
  ];
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="rounded-[28px] border border-dashed border-slate-300 bg-white/60 px-6 py-14 text-center card-shadow">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-brand"><FileScan size={28} className="text-sky-100" /></div>
      <h3 className="mt-5 font-display text-2xl font-extrabold text-ink">Your report will appear here</h3>
      <p className="mx-auto mt-2 max-w-md text-[14px] leading-6 text-slate-600">Analyze your resume above and this section becomes your personal ATS scorecard, skill-gap map, tech roadmap and 30-day sprint.</p>
      <div className="mx-auto mt-8 grid max-w-2xl gap-4 sm:grid-cols-3">
        {steps.map(s => (
          <div key={s.num} className="rounded-2xl border border-slate-200 bg-white p-4 text-left">
            <s.icon size={20} className="text-ink" />
            <p className="mt-2 text-[10px] font-extrabold tracking-[0.2em] text-slate-400">{s.num}</p>
            <p className="mt-0.5 text-[13px] font-extrabold text-ink">{s.title}</p>
            <p className="mt-1 text-[11px] leading-5 text-slate-500">{s.body}</p>
          </div>
        ))}
      </div>
      <button onClick={scroll} className="group mx-auto mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-brand px-7 text-sm font-extrabold text-white transition hover:bg-brand-dark">Analyze my resume <ArrowRight size={16} strokeWidth={2.5} className="transition-transform group-hover:translate-x-1" /></button>
    </motion.div>
  );
}
