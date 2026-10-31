import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import BlockRenderer from '../components/BlockRenderer';
import { type CustomPageData, DEFAULT_PAGES } from '../lib/blocks';

const LOCAL_PAGES_KEY = 'ct_resume_custom_pages';

export default function CustomPage() {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<CustomPageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Try from localStorage
    try {
      const stored = localStorage.getItem(LOCAL_PAGES_KEY);
      if (stored) {
        const pages: CustomPageData[] = JSON.parse(stored);
        const found = pages.find((p) => p.slug === slug && p.status !== 'draft');
        if (found) {
          setPage(found);
          setLoading(false);
          return;
        }
      }
    } catch {
      // ignore
    }

    // 2. Try from DEFAULT_PAGES starter set
    const defaultFound = DEFAULT_PAGES.find((p) => p.slug === slug && p.status !== 'draft');
    if (defaultFound) {
      setPage(defaultFound);
      setLoading(false);
      return;
    }

    // 3. Try from API
    fetch(`/api/pages?slug=${encodeURIComponent(slug || '')}`)
      .then((r) => r.json())
      .then((d) => {
        if (d && d.slug) setPage(d);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen pt-40 pb-24 text-center">
        <div className="inline-block animate-pulse text-sm text-muted">Loading page...</div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="min-h-screen pt-40 pb-24 text-center px-6">
        <div className="text-xs font-[var(--font-mono)] uppercase tracking-widest text-muted">Page Not Found</div>
        <h1 className="mt-4 font-[var(--font-display)] text-4xl md:text-6xl font-medium text-heading">
          404 — Page Does Not Exist
        </h1>
        <p className="mt-4 text-sm text-muted max-w-md mx-auto">
          The custom section or page <code className="text-flame">/{slug}</code> could not be found or is unpublished.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full bg-btnbg text-btntext px-6 py-2.5 text-sm font-medium hover:bg-btnhover transition-colors"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  const hero = page.hero || {};

  return (
    <div className="pt-32 pb-24">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        {hero.enabled !== false && (
          <div className="mb-14 pb-12 border-b border-ink/10">
            {hero.eyebrow && (
              <div className="text-xs font-[var(--font-mono)] uppercase tracking-[0.25em] text-muted">
                {hero.eyebrow}
              </div>
            )}
            <h1 className="mt-3 font-[var(--font-display)] text-5xl md:text-7xl font-medium tracking-tight text-heading">
              {hero.title} {hero.italic && <span className="italic text-flame">{hero.italic}</span>}
            </h1>
            {hero.description && (
              <p className="mt-4 max-w-2xl text-base text-muted leading-relaxed">
                {hero.description}
              </p>
            )}
          </div>
        )}

        {/* Dynamic Blocks */}
        <div className="space-y-4">
          {(page.blocks || []).map((block) => (
            <BlockRenderer key={block.id} block={block} />
          ))}
        </div>
      </div>
    </div>
  );
}
