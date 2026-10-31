import type { Project } from '../../lib/site';
import { ArrowUpRight } from 'lucide-react';
import { useContent } from '../../contexts/ContentContext';

interface ProjectCardProps {
  p: Project;
  onClick?: () => void;
}

export default function ProjectCard({ p, onClick }: ProjectCardProps) {
  const { content } = useContent();
  const btns = content.buttonToggles || {};

  return (
    <div
      onClick={btns.templatesItemClick !== false ? onClick : undefined}
      className={`group relative overflow-hidden rounded-3xl bg-card border border-cardborder p-4 shadow-sm hover:shadow-md transition-all duration-300 ${
        btns.templatesItemClick !== false ? 'cursor-pointer' : ''
      }`}
    >
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-ink/5">
        {p.image ? (
          <img
            src={p.image}
            alt={p.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-muted font-[var(--font-mono)] text-xs uppercase tracking-widest bg-ink/5">
            Template Preview
          </div>
        )}
        {p.price && (
          <span className="absolute top-3 right-3 rounded-full bg-badgebg text-badgetext text-xs font-semibold px-3 py-1 shadow-sm">
            {p.price}
          </span>
        )}
      </div>

      <div className="mt-4 flex items-start justify-between gap-2">
        <div>
          <span className="text-[11px] font-[var(--font-mono)] uppercase tracking-wider text-muted">
            {p.category}
          </span>
          <h3 className="font-[var(--font-display)] text-lg font-medium text-heading mt-0.5 group-hover:text-flame transition-colors">
            {p.title}
          </h3>
          {p.description && (
            <p className="mt-1 text-xs text-muted line-clamp-2">{p.description}</p>
          )}
        </div>
        {btns.templatesItemClick !== false && (
          <span className="shrink-0 p-2 rounded-full border border-ink/10 text-ink group-hover:bg-btnbg group-hover:text-btntext transition-all duration-300">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        )}
      </div>
    </div>
  );
}
