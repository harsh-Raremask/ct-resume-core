import { motion, AnimatePresence } from 'framer-motion';
import { X, User as UserIcon, Mail, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function ProfileDrawer() {
  const { user, profileOpen, setProfileOpen, signOut } = useAuth();

  if (!profileOpen || !user) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-full max-w-sm bg-cream h-full border-l border-ink/10 p-6 shadow-2xl flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-ink/10">
              <span className="font-[var(--font-display)] text-lg font-bold text-heading">
                My Profile
              </span>
              <button
                onClick={() => setProfileOpen(false)}
                className="p-1.5 rounded-full hover:bg-ink/5 text-muted hover:text-ink"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 flex items-center gap-3 p-4 rounded-2xl bg-card border border-cardborder shadow-xs">
              <div className="h-12 w-12 rounded-full bg-flame/10 text-flame flex items-center justify-center font-bold text-lg">
                <UserIcon className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-sm text-heading truncate">
                  {user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
                </div>
                <div className="text-xs text-muted flex items-center gap-1 truncate mt-0.5">
                  <Mail className="h-3 w-3" />
                  <span>{user.email}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <span className="text-[10px] font-[var(--font-mono)] uppercase tracking-wider text-muted font-bold block mb-2">
                Quick Shortcuts
              </span>
              <a
                href="/templates"
                className="block p-3 rounded-xl border border-ink/10 bg-white hover:border-flame text-xs font-semibold text-heading transition-colors"
              >
                📄 Browse Resume Templates
              </a>
              <a
                href="/services"
                className="block p-3 rounded-xl border border-ink/10 bg-white hover:border-flame text-xs font-semibold text-heading transition-colors"
              >
                💼 Order Career Services
              </a>
              <a
                href="/store"
                className="block p-3 rounded-xl border border-ink/10 bg-white hover:border-flame text-xs font-semibold text-heading transition-colors"
              >
                🛍️ Digital Store & Downloads
              </a>
            </div>
          </div>

          <div className="pt-6 border-t border-ink/10">
            <button
              onClick={signOut}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full border border-red-200 text-red-600 py-2.5 text-xs font-semibold hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
