import { MessageCircle, ShoppingBag, Zap, Star } from 'lucide-react';
import { useContent } from '../contexts/ContentContext';

export default function FloatingOrderButton() {
  const { content } = useContent();
  const cfg = content.floatingButton;
  const btns = content.buttonToggles || {};

  if (!cfg || !cfg.enabled || btns.floatingActionBtn === false) return null;

  const handleClick = () => {
    if (cfg.action === 'whatsapp') {
      window.open(`https://wa.me/${content.contact.phoneRaw}?text=Hi! I am interested in CT Resume Core services.`, '_blank');
    } else if (cfg.customUrl) {
      window.location.href = cfg.customUrl;
    } else {
      window.location.href = '/services';
    }
  };

  const getIcon = () => {
    switch (cfg.icon) {
      case 'cart':
        return <ShoppingBag className="h-5 w-5" />;
      case 'star':
        return <Star className="h-5 w-5" />;
      case 'zap':
        return <Zap className="h-5 w-5" />;
      default:
        return <MessageCircle className="h-5 w-5" />;
    }
  };

  return (
    <div
      data-tsec="floating"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2"
    >
      <button
        onClick={handleClick}
        className="flex items-center gap-2.5 rounded-full px-4 py-3 bg-flame text-white shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 font-medium text-sm"
        style={{
          backgroundColor: cfg.bgColor || undefined,
          color: cfg.textColor || undefined,
        }}
      >
        {getIcon()}
        {cfg.text && <span>{cfg.text}</span>}
      </button>
    </div>
  );
}
