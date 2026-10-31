import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import Marquee from '../components/Marquee';
import CTAStrip from '../components/CTAStrip';
import ProjectCard from '../components/work/ProjectCard';
import { useContent } from '../contexts/ContentContext';
import type { Project, Service, Product } from '../lib/site';

const SAMPLE_PROJECTS: Project[] = [
  {
    id: 1,
    title: 'Executive Tech Leader CV',
    category: 'Executive Resumes',
    description: 'Minimalist, ATS-optimized layout engineered for VP, Director, and C-Suite engineering roles.',
    price: '₹999',
    image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&auto=format&fit=crop&q=80',
    featured: true,
  },
  {
    id: 2,
    title: 'Modern Software Engineer One-Pager',
    category: 'Tech & Software Engineering',
    description: 'Clean hierarchy focusing on tech stack, open source contributions, and quantified impact.',
    price: '₹799',
    image: 'https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?w=800&auto=format&fit=crop&q=80',
    featured: true,
  },
  {
    id: 3,
    title: 'Product & Design Portfolio Resume',
    category: 'Product & Design CVs',
    description: 'Visual balance with integrated case study metrics and portfolio preview QR code.',
    price: '₹899',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80',
    featured: true,
  },
];

const SAMPLE_SERVICES: Service[] = [
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
];

const SAMPLE_PRODUCTS: Product[] = [
  {
    id: 1,
    title: 'ATS Elite 10-Template Bundle',
    category: 'ATS Resume Templates',
    description: '10 battle-tested, clean Google Docs & Word templates proven with 98% ATS pass scores.',
    type: 'paid',
    price: '₹499',
    image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&auto=format&fit=crop&q=80',
    badge: 'BESTSELLER',
    featured: true,
  },
  {
    id: 2,
    title: 'Cold Email & Cover Letter Kit',
    category: 'Cover Letter Bundles',
    description: '25 plug-and-play email frameworks to message founders, recruiters, and hiring managers.',
    type: 'paid',
    price: '₹299',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop&q=80',
    badge: 'POPULAR',
    featured: true,
  },
  {
    id: 3,
    title: 'Action Verbs & Impact Metric Cheat Sheet',
    category: 'Interview Prep Guides',
    description: '300+ strong action verbs categorized by job role to transform dull bullet points.',
    type: 'free',
    price: 'Free',
    image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop&q=80',
    badge: 'FREE',
    featured: true,
  },
];

export default function Home() {
  const { content } = useContent();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>(SAMPLE_PROJECTS);
  const [services, setServices] = useState<Service[]>(SAMPLE_SERVICES);
  const [products, setProducts] = useState<Product[]>(SAMPLE_PRODUCTS);

  const h = content.hero;
  const hm = content.home;
  const btns = content.buttonToggles || {};
  const heroLines = [h.line1, h.line2, h.line3];

  useEffect(() => {
    Promise.all([
      fetch('/api/projects').then((r) => r.json()).catch(() => []),
      fetch('/api/services').then((r) => r.json()).catch(() => []),
      fetch('/api/products').then((r) => r.json()).catch(() => []),
    ]).then(([p, s, pr]) => {
      if (Array.isArray(p) && p.length > 0) setProjects(p.filter((x: Project) => x.featured));
      if (Array.isArray(s) && s.length > 0) setServices(s.slice(0, 3));
      if (Array.isArray(pr) && pr.length > 0) setProducts(pr.filter((x: Product) => x.featured).slice(0, 3));
    });
  }, []);

  return (
    <div>
      {/* HERO SECTION */}
      <section data-tsec="hero" className="relative pt-32 md:pt-40 pb-16 md:pb-24 overflow-hidden">
        <div
          aria-hidden
          className="absolute -top-20 -right-20 h-[500px] w-[500px] rounded-full blur-3xl opacity-30"
          style={{ background: 'radial-gradient(circle, var(--color-gradstart) 0%, transparent 70%)' }}
        />
        <div
          aria-hidden
          className="absolute -bottom-40 -left-40 h-[600px] w-[600px] rounded-full blur-3xl opacity-20"
          style={{ background: 'radial-gradient(circle, var(--color-gradend) 0%, transparent 70%)' }}
        />
        <div className="relative mx-auto max-w-[1400px] px-6 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-3 rounded-full border border-inputborder bg-inputbg/60 px-4 py-2 text-xs font-[var(--font-mono)] uppercase tracking-[0.2em]"
          >
            <span className="relative inline-flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            {h.badge}
          </motion.div>

          <div className="mt-8 grid grid-cols-12 gap-6 md:gap-10 items-end">
            <div className="col-span-12 lg:col-span-9">
              <h1 className="font-[var(--font-display)] text-[13vw] md:text-[9vw] lg:text-[7vw] leading-[0.94] tracking-[-0.03em] font-medium">
                {heroLines.map((line, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.1, duration: 0.8 }}
                    className="block"
                  >
                    {line}
                  </motion.span>
                ))}
                <motion.span
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="block italic text-flame"
                >
                  {h.line4Main}<span className="text-ink not-italic">{h.line4End}</span>
                </motion.span>
              </h1>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="col-span-12 lg:col-span-3 flex flex-col gap-4"
            >
              <div className="rounded-3xl bg-darksec text-lighttext p-6 relative overflow-hidden shadow-lg">
                <Sparkles className="h-5 w-5 text-flame" />
                <p className="mt-3 text-sm leading-relaxed text-lighttext/80">{h.subheading}</p>
                <div className="mt-5 flex items-baseline gap-2">
                  <span className="font-[var(--font-display)] text-4xl font-medium">{h.statValue}</span>
                  <span className="text-xs text-lighttext/60 uppercase tracking-widest">{h.statLabel}</span>
                </div>
              </div>
              <div className="rounded-3xl border border-ink/10 bg-card p-6 shadow-sm">
                <div className="flex items-baseline justify-between">
                  <span className="font-[var(--font-display)] text-4xl font-medium">
                    {h.retention}<span className="text-flame">%</span>
                  </span>
                  <span className="text-xs uppercase tracking-widest text-muted">{h.retentionLabel}</span>
                </div>
                <p className="mt-2 text-xs text-muted leading-relaxed">{h.retentionDesc}</p>
              </div>
            </motion.div>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            {btns.heroCtaPrimary !== false && (
              <Link
                to="/templates"
                className="group inline-flex items-center gap-3 rounded-full bg-btnbg text-btntext pl-7 pr-2 py-2 text-[15px] font-medium transition-all duration-300 hover:bg-btnhover shadow-md"
              >
                {h.ctaPrimary}
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-flame text-white group-hover:rotate-45 transition-transform duration-300">
                  <ArrowUpRight className="h-5 w-5" />
                </span>
              </Link>
            )}

            {btns.heroCtaSecondary !== false && (
              <Link
                to="/services"
                className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-7 py-3 text-[15px] font-medium hover:bg-btnbg hover:text-btntext transition-all duration-300"
              >
                {h.ctaSecondary}
              </Link>
            )}

            <div className="hidden md:flex items-center gap-3 ml-4 text-xs font-[var(--font-mono)] uppercase tracking-[0.25em] text-muted">
              <span className="h-px w-8 bg-ink/30" />
              {h.location}
            </div>
          </div>
        </div>
      </section>

      <Marquee />

      {/* FEATURED TEMPLATES / WORK */}
      <section data-tsec="templates" className="py-20 md:py-28">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-[var(--font-mono)] uppercase tracking-[0.25em] text-muted">{hm.templatesEyebrow}</div>
              <h2 className="mt-3 font-[var(--font-display)] text-4xl md:text-6xl font-medium tracking-tight">
                {hm.templatesTitle} <span className="italic text-flame">{hm.templatesItalic}</span>
              </h2>
            </div>
            {btns.templatesSeeAll !== false && (
              <Link to="/templates" className="group inline-flex items-center gap-2 text-sm font-medium hover:text-flame transition-colors">
                {hm.templatesLink}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            )}
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.slice(0, 3).map((p) => (
              <ProjectCard key={p.id} p={p} onClick={() => navigate('/templates')} />
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section data-tsec="services" className="bg-darksec text-lighttext py-20 md:py-28">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-[var(--font-mono)] uppercase tracking-[0.25em] text-lighttext/50">{hm.servicesEyebrow}</div>
              <h2 className="mt-3 font-[var(--font-display)] text-4xl md:text-6xl font-medium tracking-tight">
                {hm.servicesTitle} <span className="italic text-flame">{hm.servicesItalic}</span>
              </h2>
            </div>
            {btns.servicesSeeAll !== false && (
              <Link to="/services" className="group inline-flex items-center gap-2 text-sm font-medium text-lighttext/70 hover:text-flame transition-colors">
                {hm.servicesLink}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            )}
          </div>

          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {services.map((s) => (
              <div
                key={s.id}
                className="rounded-3xl border border-lighttext/10 bg-lighttext/5 p-7 hover:border-flame/50 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className={`h-1.5 w-14 rounded-full bg-gradient-to-r ${s.accent}`} />
                  <h3 className="mt-6 font-[var(--font-display)] text-2xl font-medium">{s.title}</h3>
                  <p className="mt-3 text-sm text-lighttext/70 leading-relaxed">{s.description}</p>
                  
                  {s.features && (
                    <ul className="mt-6 space-y-2">
                      {s.features.map((feat, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-xs text-lighttext/80">
                          <CheckCircle2 className="h-3.5 w-3.5 text-flame shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="mt-8 pt-4 border-t border-lighttext/10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-lighttext/50 uppercase tracking-widest block">Starting from</span>
                    <span className="font-[var(--font-display)] text-2xl font-medium text-flame">{s.starting}</span>
                  </div>
                  {btns.servicesOrderBtn !== false && (
                    <Link
                      to="/services"
                      className="rounded-full bg-btnbg text-btntext px-4 py-2 text-xs font-medium hover:bg-btnhover transition-colors"
                    >
                      Book Now
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STORE TEASER */}
      <section data-tsec="store" className="py-20 md:py-28 bg-bgalt">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-[var(--font-mono)] uppercase tracking-[0.25em] text-muted">{hm.storeEyebrow}</div>
              <h2 className="mt-3 font-[var(--font-display)] text-4xl md:text-6xl font-medium tracking-tight">
                {hm.storeTitle} <span className="italic text-flame">{hm.storeItalic}</span>
              </h2>
            </div>
            {btns.storeBrowseAll !== false && (
              <Link to="/store" className="group inline-flex items-center gap-2 text-sm font-medium hover:text-flame transition-colors">
                {hm.storeLink}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            )}
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {products.map((prod) => (
              <div key={prod.id} className="rounded-3xl border border-cardborder bg-card p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-ink/5 flex items-center justify-center p-6 text-center">
                  <div className="font-[var(--font-display)] text-xl font-medium text-ink/70">
                    {prod.title}
                  </div>
                  {prod.badge && (
                    <span className="absolute top-3 left-3 rounded-full bg-badgebg text-badgetext text-[10px] font-bold tracking-wider px-2.5 py-1">
                      {prod.badge}
                    </span>
                  )}
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-sm text-heading">{prod.title}</h3>
                    <span className="text-xs text-muted">{prod.category}</span>
                  </div>
                  <span className={`text-sm font-semibold ${prod.type === 'free' ? 'text-green-600' : 'text-flame'}`}>
                    {prod.price}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTAStrip />
    </div>
  );
}
