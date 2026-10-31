import { useContent } from '../contexts/ContentContext';
import { Award, Briefcase, Users, Clock } from 'lucide-react';

export default function About() {
  const { content } = useContent();
  const ab = content.about;
  const ap = content.pages.about;

  return (
    <div className="pt-32 pb-24">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="text-xs font-[var(--font-mono)] uppercase tracking-[0.25em] text-muted">
          {ap.eyebrow}
        </div>
        <h1 className="mt-3 font-[var(--font-display)] text-5xl md:text-7xl font-medium tracking-tight">
          {ap.title} <span className="italic text-flame">{ap.italic}</span>
        </h1>
        <p className="mt-4 max-w-xl text-base text-muted leading-relaxed">
          {ap.description}
        </p>

        {/* Stats Grid */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="rounded-3xl border border-cardborder bg-card p-6 text-center shadow-sm">
            <Award className="h-6 w-6 text-flame mx-auto mb-2" />
            <div className="font-[var(--font-display)] text-4xl font-bold text-heading">500+</div>
            <div className="mt-1 text-xs text-muted uppercase tracking-wider">Resumes Built</div>
          </div>
          <div className="rounded-3xl border border-cardborder bg-card p-6 text-center shadow-sm">
            <Briefcase className="h-6 w-6 text-flame mx-auto mb-2" />
            <div className="font-[var(--font-display)] text-4xl font-bold text-heading">97%</div>
            <div className="mt-1 text-xs text-muted uppercase tracking-wider">Interview Rate</div>
          </div>
          <div className="rounded-3xl border border-cardborder bg-card p-6 text-center shadow-sm">
            <Users className="h-6 w-6 text-flame mx-auto mb-2" />
            <div className="font-[var(--font-display)] text-4xl font-bold text-heading">15+</div>
            <div className="mt-1 text-xs text-muted uppercase tracking-wider">Industries Covered</div>
          </div>
          <div className="rounded-3xl border border-cardborder bg-card p-6 text-center shadow-sm">
            <Clock className="h-6 w-6 text-flame mx-auto mb-2" />
            <div className="font-[var(--font-display)] text-4xl font-bold text-heading">24h</div>
            <div className="mt-1 text-xs text-muted uppercase tracking-wider">Fast Turnaround</div>
          </div>
        </div>

        {/* Content Paragraphs */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-7 space-y-6 text-base text-ink/80 leading-relaxed">
            <div className="text-xs font-[var(--font-mono)] uppercase tracking-[0.2em] text-flame">
              {ab.introEyebrow}
            </div>
            <h2 className="font-[var(--font-display)] text-3xl md:text-4xl font-medium text-heading">
              {ab.introTitle} <span className="italic text-flame">{ab.introItalic}</span>
            </h2>
            {ab.paragraphs.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          <div className="md:col-span-5">
            <div className="rounded-3xl bg-darksec text-lighttext p-8 relative overflow-hidden shadow-xl">
              <div className="text-xs font-[var(--font-mono)] uppercase tracking-[0.2em] text-lighttext/50">
                Core Philosophy
              </div>
              <h3 className="mt-4 font-[var(--font-display)] text-2xl font-medium leading-snug">
                "Your resume is not an obituary of your past jobs; it is a marketing pitch for your future value."
              </h3>
              <div className="mt-6 pt-6 border-t border-lighttext/10 flex items-center justify-between text-xs text-lighttext/60">
                <span>{ab.name}</span>
                <span>{ab.role}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
