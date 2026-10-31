import { Youtube, ExternalLink, Clock, PlayCircle, Sparkles } from 'lucide-react';
import { COURSES } from '../lib/data';
import { courseUrl } from '../lib/analyze';
import type { AnalysisResult } from '../lib/types';

export default function CourseLibrary({ result }: { result?: AnalysisResult | null }) {
  // Prioritized list of skills: missing first (they need it most), then matched role skills.
  const prioritySkills = result
    ? [...new Set([...result.missingSkills, ...result.matchedSkills])]
    : ['HTML', 'CSS', 'JavaScript', 'React', 'SQL', 'Python', 'Figma', 'SEO'];

  const items = prioritySkills.filter(s => COURSES[s]).slice(0, 9);
  const focus = result ? result.missingSkills[0] : undefined;

  return (
    <section id="courses" className="scroll-mt-24">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.2em] text-red-600"><Youtube size={13} /> FREE · YOUTUBE · HAND-PICKED</p>
          <h3 className="mt-1 font-display text-2xl font-extrabold text-ink">{result ? 'Your Course Library' : 'Popular Course Paths'}</h3>
          <p className="mt-0.5 text-[13px] text-slate-600">{result ? 'Every course mapped to your gap — missing skills first, in plan order.' : 'The three career-comeback tracks our learners complete most.'}</p>
        </div>
        {focus && (
          <span className="flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-sky-800"><Sparkles size={12} /> Start with {focus}</span>
        )}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(skill => {
          const c = COURSES[skill];
          const isMissing = result?.missingSkills.includes(skill);
          return (
            <a
              key={skill}
              href={courseUrl(skill)}
              target="_blank"
              rel="noreferrer"
              className="group overflow-hidden rounded-[22px] border border-slate-200 bg-white card-shadow transition hover:-translate-y-0.5 hover:border-brand"
            >
              <div className="relative h-40 overflow-hidden">
                {c.id ? (
                  <img src={`https://img.youtube.com/vi/${c.id}/hqdefault.jpg`} alt={c.title} loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                ) : (
                  <div className="grid h-full w-full place-items-center bg-gradient-to-br from-red-600 to-red-800"><Youtube size={46} className="text-white/90" strokeWidth={1.4} /></div>
                )}
                <span className="absolute inset-0 grid place-items-center bg-brand/0 transition group-hover:bg-brand/35">
                  <span className="grid h-12 w-12 scale-75 place-items-center rounded-full bg-white/95 opacity-0 shadow-xl transition group-hover:scale-100 group-hover:opacity-100"><PlayCircle size={26} className="text-ink" fill="#0ea5e9" /></span>
                </span>
                <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-black/85 px-2 py-1 text-[9px] font-bold text-white"><Clock size={9} />{c.dur}</span>
                <span className="absolute left-2 top-2 rounded-full border border-white/40 bg-white/90 px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-wider text-ink backdrop-blur">{c.lvl}</span>
                {isMissing && <span className="absolute right-2 top-2 rounded-full bg-white px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-wider text-ink">In your plan</span>}
              </div>
              <div className="p-4">
                <p className="text-[9px] font-extrabold uppercase tracking-[0.18em] text-slate-400">{skill}</p>
                <h4 className="mt-1 font-display text-[13px] font-bold leading-snug text-ink transition group-hover:underline">{c.title}</h4>
                <p className="mt-1 text-[10px] font-semibold text-slate-500">{c.channel} · YouTube</p>
                <span className="mt-3 inline-flex h-8 items-center gap-1.5 rounded-full bg-brand px-3.5 text-[10px] font-extrabold uppercase tracking-wide text-white transition group-hover:bg-brand-dark">Watch free <ExternalLink size={10} /></span>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
