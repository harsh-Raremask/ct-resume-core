import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useContent } from '../contexts/ContentContext';

export default function CTAStrip() {
  const { content } = useContent();
  const cta = content.cta;
  const btns = content.buttonToggles || {};

  return (
    <section data-tsec="cta" className="py-20 md:py-28 bg-darksec text-lighttext relative overflow-hidden">
      <div
        aria-hidden
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, var(--color-gradstart) 0%, transparent 70%)' }}
      />
      <div className="relative mx-auto max-w-[1400px] px-6 md:px-10 text-center">
        <div className="text-xs font-[var(--font-mono)] uppercase tracking-[0.25em] text-lighttext/60">
          {cta.eyebrow}
        </div>
        <h2 className="mt-4 font-[var(--font-display)] text-4xl md:text-7xl font-medium tracking-tight">
          {cta.title} <span className="italic text-flame">{cta.italic}</span>
        </h2>
        {btns.ctaOrderNow !== false && (
          <div className="mt-8">
            <Link
              to="/services"
              className="inline-flex items-center gap-3 rounded-full bg-flame text-white px-8 py-3.5 text-base font-medium shadow-lg hover:brightness-110 transition-all duration-300"
            >
              {cta.button}
              <ArrowUpRight className="h-5 w-5" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
