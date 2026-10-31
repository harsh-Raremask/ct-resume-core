import { ShieldCheck, Lock, Heart } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand font-display text-[13px] font-extrabold text-sky-100">CT</div>
            <div>
              <p className="font-display font-extrabold text-ink">CT Core-30 Days Courses Suggestion <span className="text-brand">(Gap Recovery)</span></p>
              <p className="text-[11px] font-medium text-slate-500">© {year} · Helping career-gap talent restart — free, forever.</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[12px] font-semibold text-slate-500">
            <a href="#analyzer" className="transition hover:text-ink">Analyzer</a>
            <a href="#results" className="transition hover:text-ink">Report</a>
            <a href="#plan" className="transition hover:text-ink">30-Day Plan</a>
            <a href="#courses" className="transition hover:text-ink">Courses</a>
          </div>
        </div>
        <div className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-slate-100 pt-6 text-[11px] font-medium text-slate-400 sm:flex-row">
          <p className="flex items-center gap-1.5"><Lock size={12} /> Resume text never leaves your browser — no uploads, no accounts, no tracking.</p>
          <p className="flex items-center gap-1.5"><ShieldCheck size={12} /> Built with transparent heuristics <span className="text-slate-300">·</span> <Heart size={11} className="text-red-400" fill="currentColor" /> for gap talent</p>
        </div>
      </div>
    </footer>
  );
}
