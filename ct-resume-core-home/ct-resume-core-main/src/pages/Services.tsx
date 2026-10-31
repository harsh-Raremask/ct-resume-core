import { CheckCircle2, ArrowRight } from 'lucide-react';
import { useContent } from '../contexts/ContentContext';
import type { Service } from '../lib/site';

const ALL_SERVICES: Service[] = [
  {
    id: 1,
    title: 'Complete Resume Rewrite',
    description: 'Full overhaul of your existing resume: ATS keyword alignment, impact metrics formatting, and modern executive design.',
    starting: '₹1,499',
    delivery_time: '24-48 Hours',
    accent: 'from-blue-600 to-indigo-600',
    features: ['ATS Keyword Research', 'Quantified Bullet Points', '2 Modern Formats (PDF + Docx)', 'Unlimited Revisions'],
  },
  {
    id: 2,
    title: 'LinkedIn Profile Makeover',
    description: 'High-conversion LinkedIn headline, keyword-dense about section, featured section curation, and custom banner.',
    starting: '₹999',
    delivery_time: '24 Hours',
    accent: 'from-indigo-600 to-purple-600',
    features: ['Search Algorithm SEO', 'Hook-driven Headline', 'Custom Header Banner', 'Networking Outreach Scripts'],
  },
  {
    id: 3,
    title: 'Career Sprint Combo Pack',
    description: 'Resume rewrite + targeted cover letter + full LinkedIn overhaul + 1-on-1 interview preparation roadmap.',
    starting: '₹2,499',
    delivery_time: '2-3 Days',
    accent: 'from-purple-600 to-pink-600',
    features: ['Executive Resume', 'Custom Cover Letter', 'LinkedIn Optimization', 'Interview Q&A Strategy'],
  },
  {
    id: 4,
    title: 'ATS Compliance & Keyword Scan',
    description: 'Deep audit of your resume against modern Applicant Tracking Systems (Workday, Taleo, Greenhouse, Lever).',
    starting: '₹499',
    delivery_time: '12 Hours',
    accent: 'from-emerald-600 to-teal-600',
    features: ['Score Breakdown & Report', 'Missing Keyword Identification', 'Formatting Bug Fixes', 'Actionable Revision Checklist'],
  },
  {
    id: 5,
    title: 'Targeted Executive Cover Letter',
    description: 'Custom tailored cover letter engineered for a specific company or job description that hooks hiring managers in seconds.',
    starting: '₹699',
    delivery_time: '24 Hours',
    accent: 'from-amber-600 to-orange-600',
    features: ['Story-driven Narrative', 'Company Culture Alignment', 'Editable Word File', '2 Follow-up Email Templates'],
  },
];

export default function Services() {
  const { content } = useContent();
  const sPage = content.pages.services;
  const btns = content.buttonToggles || {};

  const handleOrder = (service: Service) => {
    const msg = `Hi! I want to order the "${service.title}" package (${service.starting}) from CT Resume Core.`;
    window.open(`https://wa.me/${content.contact.phoneRaw}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="pt-32 pb-24">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="text-xs font-[var(--font-mono)] uppercase tracking-[0.25em] text-muted">
          {sPage.eyebrow}
        </div>
        <h1 className="mt-3 font-[var(--font-display)] text-5xl md:text-7xl font-medium tracking-tight">
          {sPage.title} <span className="italic text-flame">{sPage.italic}</span>
        </h1>
        <p className="mt-4 max-w-xl text-base text-muted leading-relaxed">
          {sPage.description}
        </p>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ALL_SERVICES.map((s) => (
            <div
              key={s.id}
              className="rounded-3xl border border-cardborder bg-card p-8 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className={`h-1.5 w-14 rounded-full bg-gradient-to-r ${s.accent}`} />
                <h2 className="mt-6 font-[var(--font-display)] text-2xl font-medium text-heading">
                  {s.title}
                </h2>
                <p className="mt-3 text-sm text-muted leading-relaxed">
                  {s.description}
                </p>

                <div className="mt-6 flex items-center gap-2 text-xs font-[var(--font-mono)] text-muted">
                  <span className="uppercase tracking-wider">Turnaround:</span>
                  <span className="font-semibold text-ink">{s.delivery_time}</span>
                </div>

                <div className="mt-6 pt-6 border-t border-ink/10">
                  <div className="text-xs font-semibold text-heading uppercase tracking-wider mb-3">
                    What's included:
                  </div>
                  <ul className="space-y-2.5">
                    {s.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2.5 text-xs text-ink/80">
                        <CheckCircle2 className="h-4 w-4 text-flame shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-ink/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-muted uppercase tracking-wider block">Price</span>
                  <span className="font-[var(--font-display)] text-3xl font-semibold text-flame">
                    {s.starting}
                  </span>
                </div>

                {btns.servicesOrderBtn !== false && (
                  <button
                    onClick={() => handleOrder(s)}
                    className="inline-flex items-center gap-2 rounded-full bg-btnbg text-btntext px-5 py-2.5 text-xs font-medium hover:bg-btnhover transition-colors"
                  >
                    <span>Get Started</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
