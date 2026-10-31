import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowRight, Download, ExternalLink, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import type { Block } from '../lib/blocks';

function Bold({ text }: { text: string }) {
  const parts = String(text || '').split(/\*\*(.*?)\*\*/g);
  return (
    <>
      {parts.map((p, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="font-semibold text-heading">
            {p}
          </strong>
        ) : (
          p
        )
      )}
    </>
  );
}

function SmartLink({
  url,
  newTab,
  className,
  children,
}: {
  url: string;
  newTab?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  if (!url) return <span className={className}>{children}</span>;
  if (url.startsWith('/') && !newTab) {
    return (
      <Link to={url} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <a href={url} target={newTab || !url.startsWith('/') ? '_blank' : undefined} rel="noreferrer" className={className}>
      {children}
    </a>
  );
}

export default function BlockRenderer({ block }: { block: Block }) {
  if (block.hidden) return null;
  const p = block.props || {};

  switch (block.type) {
    /* ── 1. Heading Block ── */
    case 'heading': {
      const alignCls = p.align === 'center' ? 'text-center' : p.align === 'right' ? 'text-right' : 'text-left';
      const sizeCls =
        p.size === 'sm' ? 'text-2xl md:text-3xl' : p.size === 'lg' ? 'text-4xl md:text-6xl' : 'text-3xl md:text-4xl';
      return (
        <div className={`my-6 ${alignCls}`}>
          <h2 className={`font-[var(--font-display)] font-medium tracking-tight text-heading ${sizeCls}`}>
            {p.text} {p.italic && <span className="italic text-flame">{p.italic}</span>}
          </h2>
        </div>
      );
    }

    /* ── 2. Context & Text Block (Word Doc Style) ── */
    case 'context': {
      const alignCls = p.align === 'center' ? 'text-center' : p.align === 'right' ? 'text-right' : 'text-left';
      const paragraphs = String(p.text || '').split('\n\n');
      return (
        <div className={`my-6 space-y-4 max-w-4xl ${alignCls}`}>
          {paragraphs.map((para, i) => (
            <p key={i} className="text-base text-ink/85 leading-relaxed">
              <Bold text={para} />
            </p>
          ))}
        </div>
      );
    }

    /* ── 3. Divider ── */
    case 'divider': {
      return (
        <div className="my-8 flex items-center justify-center">
          <div className="w-full h-px bg-ink/10" />
        </div>
      );
    }

    /* ── 4. Image Canvas (Word / Canva Style Editor) ── */
    case 'image': {
      const widthVal = p.width || '100%';
      const align = p.alignment || 'center';
      const shadowCls =
        p.shadow === 'lg'
          ? 'shadow-xl'
          : p.shadow === '2xl'
          ? 'shadow-2xl'
          : p.shadow === 'none'
          ? 'shadow-none'
          : 'shadow-md';

      let containerAlignCls = 'flex justify-center my-8';
      if (align === 'left') containerAlignCls = 'flex justify-start my-8';
      if (align === 'right') containerAlignCls = 'flex justify-end my-8';
      if (align === 'float-left') containerAlignCls = 'float-left mr-8 mb-6 my-2';
      if (align === 'float-right') containerAlignCls = 'float-right ml-8 mb-6 my-2';

      const imgElem = (
        <div
          className={`overflow-hidden transition-all duration-300 border border-ink/10 ${shadowCls} ${
            p.linkUrl ? 'group cursor-pointer hover:scale-[1.01]' : ''
          }`}
          style={{
            width: widthVal,
            maxWidth: '100%',
            borderRadius: p.borderRadius || '20px',
          }}
        >
          {p.src ? (
            <img
              src={p.src}
              alt={p.alt || 'Visual'}
              loading="lazy"
              className="w-full h-auto object-cover max-h-[700px]"
            />
          ) : (
            <div className="h-64 flex items-center justify-center bg-ink/5 text-muted text-sm font-[var(--font-mono)]">
              No image URL specified
            </div>
          )}
          {p.caption && (
            <div className="p-3 bg-card/90 text-center text-xs text-muted border-t border-ink/5 font-medium">
              {p.caption}
            </div>
          )}
        </div>
      );

      return (
        <div className={containerAlignCls}>
          {p.linkUrl ? (
            <SmartLink url={p.linkUrl} newTab={p.newTab !== false}>
              {imgElem}
            </SmartLink>
          ) : (
            imgElem
          )}
        </div>
      );
    }

    /* ── 5. Image Grid / Collage ── */
    case 'gallery': {
      const cols = p.columns || 3;
      const images: { src: string; title?: string }[] = p.images || [];
      return (
        <div
          className="my-8 grid gap-4"
          style={{ gridTemplateColumns: `repeat(auto-fit, minmax(260px, 1fr))` }}
        >
          {images.map((img, i) => (
            <div key={i} className="group overflow-hidden rounded-2xl border border-ink/10 bg-card shadow-sm">
              <div className="aspect-[4/3] overflow-hidden bg-ink/5">
                <img
                  src={img.src}
                  alt={img.title || ''}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              {img.title && (
                <div className="p-3 text-xs font-semibold text-heading truncate">{img.title}</div>
              )}
            </div>
          ))}
        </div>
      );
    }

    /* ── 6. Single Button Block ── */
    case 'button': {
      if (p.enabled === false) return null;
      const alignCls = p.align === 'center' ? 'justify-center' : p.align === 'right' ? 'justify-end' : 'justify-start';

      const styleCls =
        p.style === 'secondary'
          ? 'bg-cream text-ink border border-ink/20 hover:bg-btnbg hover:text-btntext'
          : p.style === 'outline'
          ? 'border border-flame text-flame hover:bg-flame hover:text-white'
          : p.style === 'flame'
          ? 'bg-flame text-white hover:brightness-110 shadow-md'
          : 'bg-btnbg text-btntext hover:bg-btnhover shadow-md';

      return (
        <div className={`my-6 flex ${alignCls}`}>
          <SmartLink
            url={p.url || '/'}
            newTab={p.newTab}
            className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all duration-300 ${styleCls}`}
          >
            <span>{p.label || 'Click Here'}</span>
            {p.icon === 'download' ? (
              <Download className="h-4 w-4" />
            ) : p.icon === 'message' ? (
              <MessageCircle className="h-4 w-4" />
            ) : p.icon === 'external' ? (
              <ExternalLink className="h-4 w-4" />
            ) : (
              <ArrowRight className="h-4 w-4" />
            )}
          </SmartLink>
        </div>
      );
    }

    /* ── 7. Multiple Buttons Section (Button-Group) ── */
    case 'button-group': {
      const buttons = (p.buttons || []).filter((b: { enabled?: boolean }) => b.enabled !== false);
      if (buttons.length === 0) return null;
      const alignCls = p.align === 'center' ? 'justify-center' : p.align === 'right' ? 'justify-end' : 'justify-start';

      return (
        <div className={`my-8 flex flex-wrap items-center gap-4 ${alignCls}`}>
          {buttons.map((b: { id: string; label: string; url: string; style?: string; icon?: string; newTab?: boolean }) => {
            const styleCls =
              b.style === 'secondary'
                ? 'bg-card text-ink border border-ink/20 hover:bg-btnbg hover:text-btntext'
                : b.style === 'outline'
                ? 'border border-flame text-flame hover:bg-flame hover:text-white'
                : b.style === 'flame'
                ? 'bg-flame text-white hover:brightness-110 shadow-md'
                : 'bg-btnbg text-btntext hover:bg-btnhover shadow-md';

            return (
              <SmartLink
                key={b.id}
                url={b.url}
                newTab={b.newTab}
                className={`inline-flex items-center gap-2.5 rounded-full px-6 py-3 text-sm font-medium transition-all duration-300 ${styleCls}`}
              >
                <span>{b.label}</span>
                {b.icon === 'download' ? (
                  <Download className="h-4 w-4" />
                ) : b.icon === 'message' ? (
                  <MessageCircle className="h-4 w-4" />
                ) : b.icon === 'external' ? (
                  <ExternalLink className="h-4 w-4" />
                ) : (
                  <ArrowUpRight className="h-4 w-4" />
                )}
              </SmartLink>
            );
          })}
        </div>
      );
    }

    /* ── 8. Clickable Link Box (Action Card) ── */
    case 'link-box': {
      if (p.enabled === false) return null;
      return (
        <div className="my-8">
          <SmartLink
            url={p.url || '#'}
            newTab={p.newTab}
            className="group block rounded-3xl border border-cardborder bg-card p-6 md:p-8 shadow-sm hover:shadow-lg hover:border-flame/40 transition-all duration-300 relative overflow-hidden"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                {p.icon && <span className="text-3xl shrink-0 mt-0.5">{p.icon}</span>}
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="font-[var(--font-display)] text-xl md:text-2xl font-medium text-heading group-hover:text-flame transition-colors">
                      {p.title}
                    </h3>
                    {p.badge && (
                      <span className="rounded-full bg-badgebg text-badgetext text-[10px] font-bold tracking-widest px-2.5 py-0.5">
                        {p.badge}
                      </span>
                    )}
                  </div>
                  {p.description && <p className="mt-2 text-sm text-muted leading-relaxed">{p.description}</p>}
                </div>
              </div>
              <span className="shrink-0 p-2.5 rounded-full bg-btnbg text-btntext group-hover:bg-btnhover group-hover:rotate-45 transition-all duration-300">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </div>
          </SmartLink>
        </div>
      );
    }

    /* ── 9. Feature Cards Grid ── */
    case 'feature-cards': {
      const items: { icon?: string; title: string; text: string }[] = p.items || [];
      return (
        <div className="my-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <div
              key={i}
              className="rounded-3xl border border-cardborder bg-card p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              {item.icon && <span className="text-2xl mb-3 block">{item.icon}</span>}
              <h4 className="font-[var(--font-display)] text-lg font-semibold text-heading">{item.title}</h4>
              <p className="mt-2 text-xs text-muted leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      );
    }

    /* ── 10. FAQ Accordion ── */
    case 'faq': {
      const items: { q: string; a: string }[] = p.items || [];
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [openIdx, setOpenIdx] = useState<number | null>(0);

      return (
        <div className="my-10 max-w-3xl space-y-3">
          {items.map((item, i) => {
            const isOpen = openIdx === i;
            return (
              <div key={i} className="rounded-2xl border border-cardborder bg-card overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : i)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-medium text-sm text-heading hover:text-flame transition-colors"
                >
                  <span>{item.q}</span>
                  {isOpen ? <ChevronUp className="h-4 w-4 text-flame" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-muted leading-relaxed border-t border-ink/5">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      );
    }

    default:
      return null;
  }
}
