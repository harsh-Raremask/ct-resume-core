import { User as UserIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useContent } from '../../contexts/ContentContext';

export default function UserButton({ mobile = false }: { mobile?: boolean }) {
  const { user, openAuth, setProfileOpen } = useAuth();
  const { content } = useContent();

  if (content.buttonToggles && !content.buttonToggles.navUserAuth) return null;

  if (user) {
    return (
      <button
        onClick={() => setProfileOpen(true)}
        className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-3 py-1.5 text-xs font-medium hover:border-flame transition-colors"
      >
        <span className="h-2 w-2 rounded-full bg-green-500" />
        <span className="max-w-[100px] truncate">{user.email?.split('@')[0]}</span>
      </button>
    );
  }

  return (
    <button
      onClick={() => openAuth('login')}
      className={`inline-flex items-center gap-1.5 rounded-full border border-ink/15 text-xs font-medium hover:bg-btnbg hover:text-btntext transition-all ${
        mobile ? 'px-2.5 py-1.5' : 'px-3.5 py-1.5'
      }`}
    >
      <UserIcon className="h-3.5 w-3.5" />
      <span>Sign In</span>
    </button>
  );
}
