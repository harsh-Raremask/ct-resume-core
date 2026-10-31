import { useState } from 'react';
import { useContent } from '../contexts/ContentContext';
import { STORE_CATEGORIES, type Product } from '../lib/site';
import { Download, ShoppingBag } from 'lucide-react';

const STORE_PRODUCTS: Product[] = [
  {
    id: 1,
    title: 'ATS Elite 10-Template Bundle',
    category: 'ATS Resume Templates',
    description: '10 battle-tested, clean Google Docs & Word templates proven with 98% ATS pass scores.',
    type: 'paid',
    price: '₹499',
    badge: 'BESTSELLER',
    image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&auto=format&fit=crop&q=80',
    file_info: '10 Templates · Word + Docs + PDF',
  },
  {
    id: 2,
    title: 'Cold Email & Cover Letter Kit',
    category: 'Cover Letter Bundles',
    description: '25 plug-and-play email frameworks to message founders, recruiters, and hiring managers.',
    type: 'paid',
    price: '₹299',
    badge: 'POPULAR',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop&q=80',
    file_info: '25 Frameworks · Notion + PDF',
  },
  {
    id: 3,
    title: 'Action Verbs & Impact Metric Cheat Sheet',
    category: 'Interview Prep Guides',
    description: '300+ strong action verbs categorized by job role to transform dull bullet points.',
    type: 'free',
    price: 'Free',
    badge: 'FREE',
    image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop&q=80',
    file_info: 'PDF Guide · 15 Pages',
  },
  {
    id: 4,
    title: 'LinkedIn Authority Banner Pack',
    category: 'Portfolio One-Pagers',
    description: '15 modern Canva & Figma templates for executive LinkedIn headers across industries.',
    type: 'paid',
    price: '₹349',
    badge: 'NEW',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80',
    file_info: '15 Editable Canva & Figma Links',
  },
  {
    id: 5,
    title: 'Behavioral Interview STAR Question Bank',
    category: 'Interview Prep Guides',
    description: '50 most asked behavioral interview questions with high-scoring sample STAR answers.',
    type: 'paid',
    price: '₹399',
    badge: 'RECOMMENDED',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
    file_info: 'eBook · 42 Pages',
  },
  {
    id: 6,
    title: 'Tech Stack & Skills Matrix One-Pager',
    category: 'Modern CV Formats',
    description: 'A dedicated technical one-pager addendum format for senior developers & architects.',
    type: 'free',
    price: 'Free',
    badge: 'FREE',
    image: 'https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?w=800&auto=format&fit=crop&q=80',
    file_info: 'Docs + Figma File',
  },
];

export default function Store() {
  const { content } = useContent();
  const [category, setCategory] = useState('All');
  const [products] = useState<Product[]>(STORE_PRODUCTS);

  const sp = content.pages.store;
  const btns = content.buttonToggles || {};
  const filtered = category === 'All' ? products : products.filter((p) => p.category === category);

  const handleAction = (item: Product) => {
    if (item.type === 'free') {
      alert(`Downloading "${item.title}"... Thank you for choosing CT Resume Core!`);
    } else {
      const msg = `Hi! I want to purchase "${item.title}" (${item.price}) from the CT Resume Core store.`;
      window.open(`https://wa.me/${content.contact.phoneRaw}?text=${encodeURIComponent(msg)}`, '_blank');
    }
  };

  return (
    <div className="pt-32 pb-24">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="text-xs font-[var(--font-mono)] uppercase tracking-[0.25em] text-muted">
          {sp.eyebrow}
        </div>
        <h1 className="mt-3 font-[var(--font-display)] text-5xl md:text-7xl font-medium tracking-tight">
          {sp.title} <span className="italic text-flame">{sp.italic}</span>
        </h1>
        <p className="mt-4 max-w-xl text-base text-muted leading-relaxed">
          {sp.description}
        </p>

        {/* Category Filter Chips */}
        <div className="mt-10 flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {STORE_CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-full px-4 py-2 text-xs font-medium whitespace-nowrap transition-all ${
                category === c
                  ? 'bg-btnbg text-btntext shadow-sm'
                  : 'border border-ink/15 hover:border-ink/40 text-ink'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Product Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((prod) => (
            <div
              key={prod.id}
              className="rounded-3xl border border-cardborder bg-card p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-ink/5 flex items-center justify-center text-center">
                  {prod.image ? (
                    <img
                      src={prod.image}
                      alt={prod.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  ) : (
                    <div className="font-[var(--font-display)] text-xl font-medium text-heading p-6">
                      {prod.title}
                    </div>
                  )}
                  {prod.badge && (
                    <span className="absolute top-3 left-3 rounded-full bg-badgebg text-badgetext text-[10px] font-bold tracking-wider px-2.5 py-1 shadow-xs">
                      {prod.badge}
                    </span>
                  )}
                </div>

                <div className="mt-5">
                  <span className="text-[11px] font-[var(--font-mono)] uppercase tracking-wider text-muted">
                    {prod.category}
                  </span>
                  <h3 className="font-[var(--font-display)] text-xl font-medium text-heading mt-1">
                    {prod.title}
                  </h3>
                  <p className="mt-2 text-xs text-muted leading-relaxed">
                    {prod.description}
                  </p>
                  {prod.file_info && (
                    <div className="mt-3 text-[11px] font-[var(--font-mono)] text-ink/70">
                      📦 {prod.file_info}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-ink/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-muted uppercase tracking-wider block">Price</span>
                  <span className={`text-xl font-semibold ${prod.type === 'free' ? 'text-green-600' : 'text-flame'}`}>
                    {prod.price}
                  </span>
                </div>

                {btns.storeProductBuy !== false && (
                  <button
                    onClick={() => handleAction(prod)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-btnbg text-btntext px-4 py-2 text-xs font-medium hover:bg-btnhover transition-colors"
                  >
                    {prod.type === 'free' ? (
                      <>
                        <Download className="h-3.5 w-3.5" />
                        <span>Download Free</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="h-3.5 w-3.5" />
                        <span>Instant Buy</span>
                      </>
                    )}
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
