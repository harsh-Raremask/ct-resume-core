import { Bell } from 'lucide-react';
import { useContent } from '../contexts/ContentContext';

export default function ActivityBell() {
  const { content } = useContent();
  if (content.buttonToggles && !content.buttonToggles.navActivityBell) return null;

  return (
    <button
      onClick={() => alert('No new notifications')}
      aria-label="Activity notifications"
      className="relative p-2 rounded-full hover:bg-ink/5 transition-colors text-ink"
    >
      <Bell className="h-5 w-5" />
    </button>
  );
}
