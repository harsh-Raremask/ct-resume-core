// ─────────────────────────────────────────────────────────────
//  CTCore — Question Bank (browse, practice, admin enable/disable)
// ─────────────────────────────────────────────────────────────
import { useMemo, useState } from 'react';
import {
  BookOpenCheck, Search, Bookmark, BookmarkCheck, Play, CheckCircle2, XCircle,
  ChevronDown, Building2, Eye, EyeOff, RotateCcw, GraduationCap, ListChecks,
  Code2, PenLine, Info,
} from 'lucide-react';
import { useCTCore } from '../lib/store';
import {
  SECTION_META, SECTION_ORDER, type SectionId, type QuestionKind, QUESTION_BANK as BANK,
} from '../data/questions';
import { SectionChip, DifficultyBadge, KindBadge } from '../components/ui';
import { highlight } from '../components/CodeBlock';

export default function QuestionBank() {
  const { bookmarks, toggleBookmark, disabledIds, toggleQuestionDisabled, resetBank } = useCTCore();
  const [query, setQuery] = useState('');
  const [section, setSection] = useState<SectionId | 'all' | 'bookmarked'>('all');
  const [kind, setKind] = useState<QuestionKind | 'all'>('all');
  const [openId, setOpenId] = useState<string | null>(null);
  const [practice, setPractice] = useState<Record<string, number | 'check' | null>>({});

  const filtered = useMemo(() => {
    return BANK.filter((q) => {
      if (section === 'bookmarked' && !bookmarks.includes(q.id)) return false;
      if (section !== 'all' && section !== 'bookmarked' && q.section !== section) return false;
      if (kind !== 'all' && q.kind !== kind) return false;
      if (query.trim()) {
        const hay = `${q.prompt} ${q.options?.join(' ') ?? ''} ${q.code ?? ''} ${q.company ?? ''} ${(q.modelAnswer ?? '')}`.toLowerCase();
        if (!hay.includes(query.trim().toLowerCase())) return false;
      }
      return true;
    });
  }, [query, section, kind, bookmarks]);

  const counts = useMemo(() => ({
    all: BANK.length,
    technology: BANK.filter(q => q.section === 'technology').length,
    aptitude: BANK.filter(q => q.section === 'aptitude').length,
    critical: BANK.filter(q => q.section === 'critical').length,
    bookmarked: bookmarks.length,
  }), [bookmarks]);

  const activeCount = BANK.length - disabledIds.length;

  return (
    <div className="relative">
      <div className="dot-grid pointer-events-none absolute inset-0 opacity-40" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-8 lg:py-10">

        {/* header */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-[10.5px] font-extrabold uppercase tracking-[0.22em] text-sky-600 inline-flex items-center gap-1.5"><GraduationCap size={12}/> Practice Library</span>
            <h1 className="mt-1.5 font-display font-extrabold text-3xl text-deep-900 tracking-tight">CTCore Question Bank</h1>
            <p className="mt-1 text-[12px] text-deep-800/65">{BANK.length} interview-grade questions · tap any card to reveal the answer &amp; explanation · practise instantly</p>
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-2.5">
            <Info size={15} className="text-sky-600 shrink-0" />
            <span className="text-[10.5px] font-bold text-sky-800"><b>{activeCount}/{BANK.length}</b> questions active in interviews</span>
            {disabledIds.length > 0 && <button onClick={resetBank} title="Re-enable all questions" className="ml-1 inline-flex items-center gap-1 text-[10px] font-extrabold text-sky-700 underline underline-offset-2 hover:text-sky-500"><RotateCcw size={11}/> Reset</button>}
          </div>
        </div>

        {/* controls */}
        <div className="mt-5 flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search questions, code, companies…"
              className="w-full rounded-2xl border-2 border-sky-100 bg-white pl-11 pr-4 py-3 text-[13px] font-medium outline-none focus:border-sky-400 ring-sky-100 focus:ring-4" />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {([
              { id: 'all' as const, label: `All · ${counts.all}`, icon: ListChecks },
              { id: 'technology' as const, label: `Tech · ${counts.technology}`, icon: null },
              { id: 'aptitude' as const, label: `Aptitude · ${counts.aptitude}`, icon: null },
              { id: 'critical' as const, label: `Critical · ${counts.critical}`, icon: null },
              { id: 'bookmarked' as const, label: `Saved · ${counts.bookmarked}`, icon: Bookmark },
            ]).map(({ id, label, icon: I }) => (
              <button key={id} onClick={() => setSection(id)}
                className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-[11px] font-bold transition-all ${section === id ? 'border-sky-500 bg-sky-600 text-white shadow-md shadow-sky-500/25' : 'border-sky-200 bg-white text-deep-800 hover:border-sky-400'}`}>
                {I && <I size={12} />}{label}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-2.5 flex items-center gap-2 flex-wrap">
          {([
            { id: 'all' as const, label: 'All Formats', icon: ListChecks },
            { id: 'mcq' as const, label: 'MCQ · 30s', icon: ListChecks },
            { id: 'code' as const, label: 'Code Output · 30s', icon: Code2 },
            { id: 'theory' as const, label: 'Theory · 90s', icon: PenLine },
          ]).map(({ id, label, icon: I }) => (
            <button key={id} onClick={() => setKind(id)}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[10.5px] font-bold border transition-all ${kind === id ? 'border-deep-800 bg-deep-800 text-sky-200' : 'border-transparent bg-sky-100/70 text-sky-900 hover:bg-sky-100'}`}>
              <I size={11} />{label}
            </button>
          ))}
          <span className="ml-auto text-[10.5px] font-bold text-slate-400">{filtered.length} shown</span>
        </div>

        {/* grid of questions */}
        <div className="mt-5 grid md:grid-cols-2 gap-4">
          {filtered.map((q) => {
            const open = openId === q.id;
            const saved = bookmarks.includes(q.id);
            const disabled = disabledIds.includes(q.id);
            const chosen = practice[q.id];
            const revealed = chosen === 'check';
            const chosenIsRight = typeof chosen === 'number' && chosen === q.answerIndex;

            return (
              <div key={q.id} className={`rounded-2xl border bg-white shadow-sm overflow-hidden transition-all ${disabled ? 'border-slate-200 opacity-60' : 'border-sky-100'}`}>
                {/* card header */}
                <div className="flex items-center gap-2 border-b border-sky-50 px-4 pt-3 pb-2.5 flex-wrap">
                  <SectionChip section={q.section} size="xs" />
                  <KindBadge kind={q.kind} />
                  <DifficultyBadge level={q.difficulty} />
                  <span className="ml-auto flex items-center gap-1.5">
                    <button onClick={() => toggleQuestionDisabled(q.id)} title={disabled ? 'Enable in interviews' : 'Disable in interviews (admin)'} className={`grid h-7 w-7 place-items-center rounded-lg border transition-colors ${disabled ? 'border-slate-200 text-slate-400' : 'border-sky-100 text-sky-700 hover:bg-sky-50'}`}>{disabled ? <EyeOff size={13} /> : <Eye size={13} />}</button>
                    <button onClick={() => toggleBookmark(q.id)} title={saved ? 'Remove bookmark' : 'Bookmark to practise later'} className={`grid h-7 w-7 place-items-center rounded-lg border transition-colors ${saved ? 'border-amber-300 bg-amber-50 text-amber-500' : 'border-sky-100 text-sky-700 hover:bg-sky-50'}`}>{saved ? <BookmarkCheck size={13} /> : <Bookmark size={13} />}</button>
                  </span>
                </div>
                {/* body */}
                <div className="p-4">
                  <p className="text-[13px] font-semibold leading-snug text-deep-900 min-h-[38px]">{q.prompt}</p>
                  {q.code && (
                    <pre className="code-scroll mt-2 overflow-x-auto rounded-xl bg-[#071e2e] px-3.5 py-2.5 text-[10.5px] leading-relaxed font-mono text-sky-50 max-h-36" dangerouslySetInnerHTML={{ __html: highlight(q.code) }} />
                  )}
                  {q.company && <div className="mt-2 inline-flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-widest text-slate-400"><Building2 size={10} />{q.company} pattern</div>}

                  {/* interactive practice / reveal */}
                  {!open ? (
                    <button onClick={() => setOpenId(q.id)} className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-extrabold text-sky-700 hover:text-sky-500"><Play size={12} /> Reveal answer &amp; practice <ChevronDown size={12} /></button>
                  ) : (
                    <div className="mt-2.5">
                      {q.options ? (
                        <div className="grid gap-1.5">
                          {q.options.map((opt, oi) => {
                            const isAnswer = oi === q.answerIndex;
                            const isPick = chosen === oi;
                            let cls = 'border-slate-200 bg-white hover:border-sky-300';
                            if (revealed || typeof chosen === 'number') {
                              if (isAnswer) cls = 'border-emerald-400 bg-emerald-50';
                              else if (isPick) cls = 'border-rose-300 bg-rose-50';
                              else cls = 'border-slate-200 bg-white opacity-70';
                            }
                            return (
                              <button key={oi} disabled={typeof chosen === 'number' || revealed} onClick={() => setPractice((p) => ({ ...p, [q.id]: oi }))}
                                className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 text-left text-[11.5px] transition-all ${cls}`}>
                                <span className="font-mono font-bold text-slate-500 w-4">{String.fromCharCode(65 + oi)}.</span>
                                <span className="flex-1">{opt}</span>
                                {(revealed || typeof chosen === 'number') && isAnswer && <CheckCircle2 size={13} className="text-emerald-500" />}
                                {(revealed || typeof chosen === 'number') && isPick && !isAnswer && <XCircle size={13} className="text-rose-500" />}
                              </button>
                            );
                          })}
                          {typeof chosen === 'number' && (
                            <p className={`mt-1 text-[10.5px] font-bold ${chosenIsRight ? 'text-emerald-600' : 'text-rose-600'}`}>{chosenIsRight ? '✔ Correct — well done!' : '✘ Not quite — see the explanation below.'}</p>
                          )}
                          {chosen !== 'check' && typeof chosen !== 'number' && (
                            <button onClick={() => setPractice((p) => ({ ...p, [q.id]: 'check' }))} className="mt-0.5 self-start text-[10px] font-bold text-slate-400 hover:text-sky-600 underline underline-offset-2">Just show me the answer</button>
                          )}
                        </div>
                      ) : (
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 px-3.5 py-2.5">
                          <div className="text-[9px] font-extrabold uppercase tracking-widest text-emerald-700">Model Answer</div>
                          <p className="mt-1 text-[11px] leading-relaxed text-emerald-950/85">{q.modelAnswer}</p>
                        </div>
                      )}
                      <div className="mt-2 rounded-xl border border-sky-100 bg-sky-50/60 px-3.5 py-2.5">
                        <div className="text-[9px] font-extrabold uppercase tracking-widest text-sky-800">Why</div>
                        <p className="mt-0.5 text-[11px] leading-relaxed text-sky-950/85">{q.explanation}</p>
                      </div>
                      <button onClick={() => { setOpenId(null); setPractice((p) => ({ ...p, [q.id]: null })); }} className="mt-2 text-[10px] font-bold text-slate-400 hover:text-deep-800">Close ↑</button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="mt-14 text-center">
            <Search size={40} className="mx-auto text-sky-200" />
            <p className="mt-3 font-display font-bold text-deep-900">No questions match “{query}”</p>
            <button onClick={() => { setQuery(''); setSection('all'); setKind('all'); }} className="mt-3 text-[12px] font-bold text-sky-700 underline underline-offset-2">Clear filters</button>
          </div>
        )}

        {/* section topic index */}
        <div className="mt-10 rounded-3xl border border-sky-100 bg-white p-6 shadow-sm">
          <h2 className="font-display font-extrabold text-lg text-deep-900">Topic Coverage Map</h2>
          <div className="mt-4 grid sm:grid-cols-3 gap-4">
            {SECTION_ORDER.map((sec) => (
              <div key={sec} className="rounded-2xl border border-sky-100 bg-sky-50/50 p-4">
                <SectionChip section={sec} />
                <p className="mt-2 text-[11px] font-medium leading-snug text-deep-800/75">{SECTION_META[sec].description}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {SECTION_META[sec].topics.map((t) => <span key={t} className="rounded-md bg-white border border-sky-100 px-2 py-0.5 text-[9px] font-semibold text-sky-900">{t}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
