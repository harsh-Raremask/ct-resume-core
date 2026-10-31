import { useEffect, useState } from 'react';
import { Menu, X, Zap, History, Trash2, FileText, ChevronRight } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { getHistory, clearHistory } from '../lib/parsers';
import type { HistoryEntry } from '../lib/types';

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const toast = useToast();

  useEffect(() => {
    const read = () => setHistory(getHistory());
    read();
    window.addEventListener('gaprecover:history', read);
    return () => window.removeEventListener('gaprecover:history', read);
  }, []);

  const scrollTo = (id: string) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-[68px] max-w-[1280px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <button onClick={() => scrollTo('top')} className="flex items-center gap-2.5" aria-label="CT Core-30 home">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand font-display text-[13px] font-extrabold text-sky-100">CT</div>
            <span className="leading-none"><span className="block font-display text-[19px] font-extrabold tracking-tight text-ink">CT Core-30</span><span className="hidden text-[9px] font-bold uppercase tracking-[0.14em] text-brand sm:block">Courses Suggestion · Gap Recovery</span></span>
            <span className="hidden rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-[10px] font-bold tracking-[0.14em] text-slate-500 sm:inline-flex">30-DAY SPRINT</span>
          </button>

          <nav className="hidden items-center gap-7 text-[14px] font-semibold text-slate-600 lg:flex">
            <button onClick={() => scrollTo('analyzer')} className="transition hover:text-ink">Analyzer</button>
            <button onClick={() => scrollTo('results')} className="transition hover:text-ink">My Report</button>
            <button onClick={() => scrollTo('plan')} className="transition hover:text-ink">30-Day Plan</button>
            <button onClick={() => scrollTo('courses')} className="transition hover:text-ink">Courses</button>
            <span className="flex items-center gap-2 font-medium text-slate-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse-soft" /> 2,847 comeback stories
            </span>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => { setHistory(getHistory()); setHistoryOpen(true); }}
              className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-brand hover:text-ink"
              aria-label="Analysis history"
              title="Analysis history"
            >
              <History size={17} />
            </button>
            <button
              onClick={() => scrollTo('analyzer')}
              className="hidden h-10 items-center gap-1.5 rounded-full bg-brand px-5 text-sm font-bold text-white transition hover:bg-brand-dark sm:inline-flex"
            >
              Analyze My Resume <ChevronRight size={15} strokeWidth={2.6} />
            </button>
            <button onClick={() => setOpen(v => !v)} className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 lg:hidden" aria-label="Menu">
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {open && (
          <div className="border-t border-slate-200 bg-white px-4 py-4 lg:hidden">
            <div className="grid gap-1 text-[15px] font-semibold text-slate-700">
              {[['analyzer', 'Analyzer'], ['results', 'My Report'], ['plan', '30-Day Plan'], ['courses', 'Courses']].map(([id, label]) => (
                <button key={id} onClick={() => scrollTo(id)} className="rounded-xl px-3 py-3 text-left transition hover:bg-slate-50">
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* History drawer */}
      {historyOpen && (
        <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-sky-900/40 backdrop-blur-sm" onClick={() => setHistoryOpen(false)} />
          <div className="relative flex h-full w-full max-w-md flex-col bg-paper shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-sky-100"><History size={17} /></div>
                <div>
                  <h3 className="font-display font-extrabold text-ink">Analysis History</h3>
                  <p className="text-xs text-slate-500">{history.length} saved {history.length === 1 ? 'report' : 'reports'} on this device</p>
                </div>
              </div>
              <button onClick={() => setHistoryOpen(false)} className="grid h-9 w-9 place-items-center rounded-full border border-slate-200"><X size={17} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              {history.length === 0 ? (
                <div className="mt-16 text-center">
                  <FileText size={40} className="mx-auto text-slate-300" strokeWidth={1.5} />
                  <p className="mt-4 font-bold text-slate-600">No analyses yet</p>
                  <p className="mt-1 text-sm text-slate-500">Upload a resume in the analyzer — every report is saved here for comparison.</p>
                  <button onClick={() => { setHistoryOpen(false); scrollTo('analyzer'); }} className="mt-6 inline-flex h-11 items-center rounded-full bg-brand px-6 text-sm font-bold text-white">Analyze now →</button>
                </div>
              ) : (
                <div className="space-y-3">
                  {history.map(h => (
                    <button
                      key={h.id}
                      onClick={() => { setHistoryOpen(false); scrollTo('results'); toast('Loaded latest report — re-analyze to refresh'); }}
                      className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:border-brand hover:shadow-md"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate font-bold text-ink">{h.name}</p>
                          <p className="mt-0.5 text-xs font-medium text-slate-500">{h.roleLabel} · {h.gap} gap · {new Date(h.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                          {h.topMissing.length > 0 && (
                            <p className="mt-2 truncate text-[11px] font-semibold text-amber-700">Missing: {h.topMissing.join(', ')}</p>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          <div className="font-display text-2xl font-extrabold text-ink">{h.atsTotal}</div>
                          <div className="text-[10px] font-bold tracking-widest text-slate-400">ATS /100</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {history.length > 0 && (
              <div className="border-t border-slate-200 p-4">
                <button
                  onClick={() => { clearHistory(); setHistory([]); toast('History cleared'); }}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-full border border-slate-200 text-sm font-bold text-slate-600 transition hover:border-red-300 hover:text-red-600"
                >
                  <Trash2 size={15} /> Clear all history
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
