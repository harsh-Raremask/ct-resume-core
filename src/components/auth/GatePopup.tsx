import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useContent } from '../../contexts/ContentContext';

export default function GatePopup() {
  const { content } = useContent();
  const { gatePopupOpen, closeGatePopup, openAuth } = useAuth();

  if (!gatePopupOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-sm rounded-3xl bg-cream border border-ink/10 p-6 md:p-8 shadow-2xl relative text-center"
        >
          <button
            onClick={closeGatePopup}
            className="absolute top-4 right-4 p-2 rounded-full text-muted hover:text-ink hover:bg-ink/5"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="h-12 w-12 rounded-2xl bg-blue-100 text-flame flex items-center justify-center mx-auto mb-4">
            <Lock className="h-6 w-6" />
          </div>

          <h3 className="font-[var(--font-display)] text-xl font-bold text-heading">
            Sign In Required
          </h3>
          <p className="mt-2 text-xs text-muted leading-relaxed">
            Please sign in or create an account on {content.brand.name} to complete this action and access your download.
          </p>

          <div className="mt-6 flex flex-col gap-2.5">
            <button
              onClick={() => openAuth('login')}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-btnbg text-btntext py-2.5 text-xs font-semibold hover:bg-btnhover transition-colors shadow-sm"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>Sign In to Continue</span>
            </button>
            <button
              onClick={() => openAuth('signup')}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full border border-ink/20 py-2.5 text-xs font-semibold hover:bg-ink/5 transition-colors"
            >
              <UserPlus className="h-3.5 w-3.5" />
              <span>Create New Account</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
