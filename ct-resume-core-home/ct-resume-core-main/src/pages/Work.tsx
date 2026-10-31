import { useState } from 'react';
import { useContent } from '../contexts/ContentContext';
import { WORK_CATEGORIES, type Project } from '../lib/site';
import ProjectCard from '../components/work/ProjectCard';

const INITIAL_TEMPLATES: Project[] = [
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
  {
    id: 4,
    title: 'Investment Banking & Consulting CV',
    category: 'Finance & Consulting',
    description: 'Wall Street classic standard single-column with heavy analytical achievement sections.',
    price: '₹899',
    image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop&q=80',
    featured: true,
  },
  {
    id: 5,
    title: 'Campus Graduate ATS Resume',
    category: 'Freshers & Campus Placement',
    description: 'Tailored for fresh college grads: coursework, academic projects, hackathons & internships.',
    price: '₹499',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
    featured: true,
  },
  {
    id: 6,
    title: 'Executive Cover Letter Template',
    category: 'Cover Letters',
    description: 'Matching header and layout aligned perfectly with our Executive CV series.',
    price: '₹399',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop&q=80',
    featured: true,
  },
];

export default function Work() {
  const { content } = useContent();
  const [category, setCategory] = useState('All');
  const [templates] = useState<Project[]>(INITIAL_TEMPLATES);

  const p = content.pages.templates;
  const filtered = category === 'All' ? templates : templates.filter((t) => t.category === category);

  return (
    <div className="pt-32 pb-24">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="text-xs font-[var(--font-mono)] uppercase tracking-[0.25em] text-muted">
          {p.eyebrow}
        </div>
        <h1 className="mt-3 font-[var(--font-display)] text-5xl md:text-7xl font-medium tracking-tight">
          {p.title} <span className="italic text-flame">{p.italic}</span>
        </h1>
        <p className="mt-4 max-w-xl text-base text-muted leading-relaxed">
          {p.description}
        </p>

        {/* Category Filter Chips */}
        <div className="mt-10 flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {WORK_CATEGORIES.map((c) => (
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

        {/* Grid of Templates */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <ProjectCard key={item.id} p={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
