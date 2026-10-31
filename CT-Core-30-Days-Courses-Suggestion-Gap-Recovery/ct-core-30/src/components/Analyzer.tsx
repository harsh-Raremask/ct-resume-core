import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CloudUpload, FileText, Loader2, Wand2, AlertCircle, X, CheckCircle2,
  ChevronDown, ShieldCheck, Lock, Sparkles, ScanText, BriefcaseBusiness, Languages, Rocket,
} from 'lucide-react';
import { DEMOS, ROLES } from '../lib/data';
import { analyzeResume } from '../lib/analyze';
import { extractResumeText } from '../lib/parsers';
import { useToast } from '../context/ToastContext';
import type { AnalysisResult, RoleId } from '../lib/types';

const GAP_OPTIONS = ['6 months', '1 year', '2 years', '3 years', '4+ years'];
const TIME_OPTIONS = ['30 minutes', '45-60 minutes', '2 hours', '3+ hours'];
const STYLE_OPTIONS = ['Video + Practice', 'Project-first', 'Theory + Notes'];

const STEPS = [
  { icon: ScanText, label: 'Reading resume & extracting structure' },
  { icon: ShieldCheck, label: 'Scoring ATS compatibility (8 checks)' },
  { icon: BriefcaseBusiness, label: 'Matching keywords against target role' },
  { icon: Languages, label: 'Mapping detected & missing tech skills' },
  { icon: Rocket, label: 'Curating courses & building 30-day sprint' },
];

interface Props {
  demoRequest: { key: keyof typeof DEMOS; nonce: number } | null;
  onResult: (r: AnalysisResult) => void;
}

export default function Analyzer({ demoRequest, onResult }: Props) {
  const toast = useToast();
  const [text, setText] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileBusy, setFileBusy] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [roleId, setRoleId] = useState<RoleId>('frontend');
  const [gap, setGap] = useState('2 years');
  const [dailyTime, setDailyTime] = useState('45-60 minutes');
  const [style, setStyle] = useState('Video + Practice');
  const [analyzing, setAnalyzing] = useState(false);
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const ready = text.trim().length >= 30;

  const loadDemo = useCallback((key: keyof typeof DEMOS) => {
    setText(DEMOS[key]);
    setFileName(null);
    setError(null);
    if (key === 'frontend') setRoleId('frontend');
    if (key === 'data') setRoleId('data');
    if (key === 'marketing') setRoleId('marketing');
    toast('Demo resume loaded — hit Analyze');
  }, [toast]);

  useEffect(() => {
    if (demoRequest) loadDemo(demoRequest.key);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [demoRequest?.nonce]);

  const handleFile = useCallback(async (file: File | undefined) => {
    if (!file) return;
    setFileBusy(true);
    setError(null);
    try {
      const { text: extracted, pages } = await extractResumeText(file);
      if (extracted.trim().length < 20) {
        throw new Error('Couldn’t extract text from that file — is it a scanned image PDF? Try pasting the text instead.');
      }
      setText(extracted.slice(0, 16000));
      setFileName(`${file.name}${pages ? ` · ${pages} page${pages > 1 ? 's' : ''}` : ''}`);
      toast('Resume parsed — review & hit Analyze');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Could not read that file';
      setError(msg);
      toast('Could not parse file');
    } finally {
      setFileBusy(false);
    }
  }, [toast]);

  const analyze = () => {
    if (!ready) {
      setError('Paste your resume text or upload a PDF/DOCX (at least a few lines).');
      return;
    }
    setError(null);
    setAnalyzing(true);
    setStep(0);
    setProgress(0);

    const started = Date.now();
    const DURATION = 2600;
    const tick = () => {
      const t = Date.now() - started;
      const p = Math.min(1, t / DURATION);
      const eased = 1 - Math.pow(1 - p, 2.2);
      setProgress(Math.round(eased * 96));
      setStep(Math.min(STEPS.length - 1, Math.floor(p * STEPS.length)));
      if (p < 1) {
        requestAnimationFrame(tick);
      } else {
        const result = analyzeResume({ text, roleId, gap, dailyTime, learningStyle: style });
        setProgress(100);
        window.setTimeout(() => {
          setAnalyzing(false);
          onResult(result);
          document.getElementById('results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 350);
      }
    };
    requestAnimationFrame(tick);
  };

  const selectCls = 'h-12 w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 pl-4 pr-10 text-sm font-semibold text-ink outline-none transition focus:border-brand focus:bg-white cursor-pointer';

  return (
    <section id="analyzer" className="mx-auto max-w-[1280px] scroll-mt-24 px-4 py-14 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
        {/* ---------- FORM CARD ---------- */}
        <div className="card-shadow rounded-[28px] border border-slate-200 bg-white p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-display text-[26px] font-extrabold leading-tight text-ink">Resume Gap Analyzer</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">Upload your resume and pick a target role. Get your <b>ATS score</b>, missing-skill map, course picks and a 30-day comeback plan — instantly.</p>
            </div>
            <span className="hidden shrink-0 rounded-full bg-brand px-3 py-1.5 text-[10px] font-bold tracking-[0.18em] text-sky-100 sm:inline-flex">AI POWERED</span>
          </div>

          {/* Drop zone */}
          <div
            role="button"
            tabIndex={0}
            aria-label="Upload resume file"
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={e => e.key === 'Enter' && fileInputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files?.[0]); }}
            className={`group mt-6 cursor-pointer rounded-2xl border-2 border-dashed p-5 text-center transition sm:p-6 ${dragOver ? 'border-brand bg-sky-50' : 'border-slate-300 bg-slate-50 hover:border-slate-400 hover:bg-white'}`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.txt,.md,application/pdf,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="hidden"
              onChange={e => handleFile(e.target.files?.[0])}
            />
            {fileBusy ? (
              <div className="py-2">
                <Loader2 size={30} className="mx-auto animate-spin text-ink" />
                <p className="mt-3 text-sm font-bold text-ink">Extracting resume text…</p>
                <p className="text-xs text-slate-500">Parsing PDF/DOCX in your browser — nothing leaves your device</p>
              </div>
            ) : fileName ? (
              <div className="py-1">
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-emerald-100"><CheckCircle2 size={24} className="text-emerald-600" /></div>
                <p className="mt-2 flex items-center justify-center gap-2 text-sm font-bold text-emerald-700">
                  <FileText size={15} /> {fileName}
                  <button onClick={e => { e.stopPropagation(); setFileName(null); setText(''); if (fileInputRef.current) fileInputRef.current.value = ''; }} className="rounded-full p-1 hover:bg-emerald-100" aria-label="Remove file"><X size={14} /></button>
                </p>
                <p className="mt-1 text-xs font-medium text-slate-500">Parsed & ready · or paste/replace text below</p>
              </div>
            ) : (
              <div className="py-1">
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-full border border-slate-200 bg-white transition group-hover:scale-105"><CloudUpload size={22} className="text-slate-700" /></div>
                <p className="mt-3 font-bold text-ink">Drag & drop your resume here</p>
                <p className="text-xs text-slate-500">PDF, DOCX, TXT or Markdown — parsed locally in your browser</p>
                <span className="mt-3 inline-flex h-9 items-center rounded-full border border-slate-200 bg-white px-4 text-xs font-bold text-ink soft-shadow">Browse files</span>
              </div>
            )}
          </div>

          {/* Textarea */}
          <div className="mt-5">
            <div className="flex items-center justify-between">
              <label htmlFor="resumeText" className="text-[11px] font-bold tracking-[0.16em] text-slate-500">PASTE RESUME TEXT</label>
              <span className={`text-[10px] font-bold tabular-nums ${wordCount > 0 ? 'text-emerald-600' : 'text-slate-400'}`}>{wordCount} words {ready ? '· ready' : ''}</span>
            </div>
            <textarea
              id="resumeText"
              rows={8}
              value={text}
              onChange={e => { setText(e.target.value); setError(null); }}
              placeholder={'Paste your full resume here…\n\nExample:\nAman Sharma — B.Sc CS, 72%\nSkills: HTML, CSS basic, JavaScript\nExperience: 3-year gap after graduation, freelance HTML pages for local shops\nGoal: Frontend Developer'}
              className={`mt-2 w-full resize-y rounded-2xl border bg-slate-50 p-4 text-[13px] leading-6 outline-none transition placeholder:text-slate-400 focus:bg-white ${error ? 'border-red-400 ring-2 ring-red-100' : 'border-slate-200 focus:border-brand'}`}
            />
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Demos:</span>
              <button onClick={() => loadDemo('frontend')} className="rounded-full border border-cyan-200 bg-cyan-100 px-3 py-1.5 text-[11px] font-bold text-cyan-800 transition hover:bg-cyan-200">Frontend gap-3yr</button>
              <button onClick={() => loadDemo('data')} className="rounded-full border border-sky-200 bg-sky-100 px-3 py-1.5 text-[11px] font-bold text-sky-800 transition hover:bg-sky-200">Data Analyst gap-4yr</button>
              <button onClick={() => loadDemo('marketing')} className="rounded-full border border-blue-200 bg-blue-100 px-3 py-1.5 text-[11px] font-bold text-blue-800 transition hover:bg-blue-200">Marketing gap-2yr</button>
            </div>
          </div>

          {/* Options grid */}
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {[
              { label: 'TARGET ROLE', value: roleId, set: (v: string) => setRoleId(v as RoleId), options: ROLES.map(r => ({ value: r.id, label: r.label })) },
              { label: 'GAP DURATION', value: gap, set: setGap, options: GAP_OPTIONS.map(v => ({ value: v, label: v })) },
              { label: 'DAILY TIME AVAILABLE', value: dailyTime, set: setDailyTime, options: TIME_OPTIONS.map(v => ({ value: v, label: v })) },
              { label: 'LEARNING STYLE', value: style, set: setStyle, options: STYLE_OPTIONS.map(v => ({ value: v, label: v })) },
            ].map(({ label, value, set, options }) => (
              <div key={label}>
                <label className="text-[11px] font-bold tracking-[0.16em] text-slate-500">{label}</label>
                <div className="relative mt-2">
                  <select value={value} onChange={e => set(e.target.value)} className={selectCls}>
                    {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                  <ChevronDown size={16} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
            ))}
          </div>

          {/* Analyze button + states */}
          <button
            onClick={analyze}
            disabled={analyzing || fileBusy}
            className="mt-6 flex h-[56px] w-full items-center justify-center gap-2 rounded-full bg-brand text-[15px] font-extrabold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed"
          >
            {analyzing ? (
              <span className="flex items-center gap-2"><Loader2 size={18} className="animate-spin" /> Analyzing your resume…</span>
            ) : (
              <span className="flex items-center gap-2"><Wand2 size={18} /> Analyze gap & build my 30-day plan</span>
            )}
          </button>

          <AnimatePresence>
            {analyzing && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                    <span>ANALYZING</span><span className="tabular-nums">{progress}%</span>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                    <div className="h-full rounded-full bg-gradient-to-r from-sky-400 to-sky-600 transition-[width] duration-150" style={{ width: `${progress}%` }} />
                  </div>
                  <ul className="mt-3 space-y-1.5">
                    {STEPS.map((s, i) => {
                      const Icon = s.icon;
                      const state = i < step ? 'done' : i === step ? 'active' : 'pending';
                      return (
                        <li key={i} className={`flex items-center gap-2 text-[11px] font-medium transition ${state === 'pending' ? 'text-slate-400' : state === 'done' ? 'text-emerald-700' : 'text-ink'}`}>
                          {state === 'done' ? <CheckCircle2 size={13} /> : state === 'active' ? <Loader2 size={13} className="animate-spin" /> : <span className="grid h-[13px] w-[13px] place-items-center rounded-full border border-slate-300 text-[8px]">{i + 1}</span>}
                          <Icon size={12} className="opacity-70" /> {s.label}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <p className="mt-3 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-semibold text-red-700">
              <AlertCircle size={15} className="mt-0.5 shrink-0" /> {error}
            </p>
          )}
          <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] font-medium text-slate-500"><Lock size={11} /> Free · No signup · Nothing uploaded — analysis runs 100% in your browser</p>
        </div>

        {/* ---------- RIGHT RAIL ---------- */}
        <div className="space-y-5">
          <div className="relative overflow-hidden rounded-[28px] bg-brand p-6 text-white card-shadow sm:p-7">
            <div aria-hidden className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-white/20 blur-3xl" />
            <div aria-hidden className="absolute -left-10 bottom-0 h-36 w-36 rounded-full bg-white/15 blur-3xl" />
            <h3 className="relative font-display text-[20px] font-extrabold">How recovery works</h3>
            <ol className="relative mt-5 space-y-4">
              {[
                { n: '1', t: 'We scan your resume', d: 'Gap length, last active year, contact hygiene, sections, keywords, quantification — scored like a real ATS.' },
                { n: '2', t: 'You get hard numbers', d: 'ATS score /100 (8 checks), matched vs missing keywords for your target role, and a readiness %.' },
                { n: '3', t: 'We build the comeback', d: 'A 30-day sprint: gap-prioritized courses, daily tasks, 4 weeks Foundations → Core → Projects → Interviews.' },
              ].map(item => (
                <li key={item.n} className="flex gap-3.5">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white font-display text-sm font-extrabold text-ink">{item.n}</span>
                  <span>
                    <span className="block font-bold">{item.t}</span>
                    <span className="mt-0.5 block text-[13px] leading-5 text-sky-100">{item.d}</span>
                  </span>
                </li>
              ))}
            </ol>
            <div className="relative mt-6 grid grid-cols-3 gap-2 text-center">
              {[['45m', 'daily commitment'], ['4', 'portfolio projects'], ['30', 'days to ready']].map(([n, d]) => (
                <div key={d} className="rounded-2xl border border-white/10 bg-white/10 p-3">
                  <div className="font-display text-xl font-extrabold text-sky-100">{n}</div>
                  <div className="text-[9px] font-semibold uppercase tracking-wider text-sky-100">{d}</div>
                </div>
              ))}
            </div>
          </div>

          {/* what you'll get */}
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 card-shadow">
            <h4 className="font-display font-extrabold text-ink">What you’ll get</h4>
            <ul className="mt-3 space-y-2.5 text-[13px] font-medium text-slate-700">
              {['ATS score /100 with 8-section breakdown & fixes', 'Skills found vs missing vs your target role', 'Technology roadmap: missing · complementary · future-ready', 'Day-by-day 30-day plan with free YouTube courses', 'Progress tracking with streak — saved on your device', 'Printable report to share with mentors & coaches'].map(item => (
                <li key={item} className="flex items-start gap-2.5"><CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-500" />{item}</li>
              ))}
            </ul>
            <figure className="mt-5 rounded-2xl border border-sky-200 bg-sky-50 p-4">
              <blockquote className="text-[13px] leading-6 text-slate-700">“After a 4-year break I ran the 30-day sprint, shipped 2 dashboards and had my offer from Deloitte in week 6.”</blockquote>
              <figcaption className="mt-2 flex items-center gap-2.5">
                <img src="/images/priya.jpg" alt="Priya Sharma" className="h-9 w-9 rounded-full object-cover" />
                <span className="text-xs"><b>Priya Sharma</b> · Placed at Deloitte<span className="block text-[10px] font-medium text-slate-500">4-year gap → Data Analyst</span></span>
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
