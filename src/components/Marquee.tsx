import { useContent } from '../contexts/ContentContext';

export default function Marquee() {
  const { content } = useContent();
  const mq = content.marqueeStrip;

  if (!mq || !mq.enabled) return null;

  const activeItems = (mq.items || []).filter((i) => i.enabled !== false);
  if (activeItems.length === 0) return null;

  return (
    <div
      data-tsec="marquee"
      className="overflow-hidden py-3 border-y border-ink/10 select-none"
      style={{ backgroundColor: mq.bgColor || '#1e40af', color: mq.textColor || '#ffffff' }}
    >
      <div className="flex w-max animate-marquee gap-8 items-center whitespace-nowrap">
        {[...activeItems, ...activeItems, ...activeItems, ...activeItems].map((item, i) => (
          <div key={i} className="flex items-center gap-8">
            <span
              style={{
                fontSize: mq.fontSize || '16px',
                fontStyle: mq.italic ? 'italic' : 'normal',
                color: item.color || 'inherit',
              }}
              className="font-medium tracking-wide"
            >
              {item.text}
            </span>
            <span className="opacity-50 text-xs">{mq.separator || '✦'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
