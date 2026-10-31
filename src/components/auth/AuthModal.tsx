import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, EyeOff, Loader2, Mail, Lock, User as UserIcon, CheckCircle2 } from 'lucide-react';
import supabase from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useContent } from '../../contexts/ContentContext';

export default function AuthModal() {
  const { content } = useContent();
  const auth = content.auth || {};
  const { authModalOpen, authModalView, closeAuth, openAuth } = useAuth();

  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  // form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  if (!authModalOpen) return null;

  const resetMsgs = () => {
    setError('');
    setNotice('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMsgs();
    if (!email.trim() || !password) {
      setError('Please fill in both email and password.');
      return;
    }
    setBusy(true);
    try {
      const { error: err } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (err) {
        setError(err.message || 'Incorrect credentials');
      } else {
        closeAuth();
      }
    } catch {
      setError('Connection failed. Please check network.');
    } finally {
      setBusy(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMsgs();
    if (!email.trim() || !password) {
      setError('Please enter your email and a password.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setBusy(true);
    try {
      const { data, error: err } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { full_name: fullName.trim() },
        },
      });
      if (err) {
        setError(err.message);
      } else if (data.session) {
        closeAuth();
      } else {
        setNotice('Account created! Please check your email to verify.');
      }
    } catch {
      setError('Sign up failed. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-md rounded-3xl bg-cream border border-ink/10 p-6 md:p-8 shadow-2xl relative"
        >
          <button
            onClick={closeAuth}
            className="absolute top-5 right-5 p-2 rounded-full text-muted hover:text-ink hover:bg-ink/5 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="text-center">
            <span className="font-[var(--font-display)] text-2xl font-bold text-heading">
              {content.brand.name}
              <span className="text-flame">{content.brand.dot}</span>
            </span>
            <h2 className="mt-2 font-[var(--font-display)] text-xl font-medium text-heading">
              {authModalView === 'signup' ? 'Create an Account' : 'Welcome Back'}
            </h2>
            <p className="mt-1 text-xs text-muted">
              {authModalView === 'signup'
                ? 'Join CT Resume Core to save templates and access downloads'
                : 'Sign in to access your templates, orders, and career resources'}
            </p>
          </div>

          {error && <div className="mt-4 p-3 rounded-xl bg-red-50 text-red-600 text-xs font-medium">{error}</div>}
          {notice && (
            <div className="mt-4 p-3 rounded-xl bg-green-50 text-green-700 text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{notice}</span>
            </div>
          )}

          {authModalView === 'signup' ? (
            <form onSubmit={handleSignup} className="mt-6 space-y-3.5">
              <div>
                <label className="text-[10px] font-[var(--font-mono)] uppercase text-muted block mb-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full rounded-2xl border border-inputborder bg-white pl-10 pr-4 py-2.5 text-xs outline-none focus:border-flame"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-[var(--font-mono)] uppercase text-muted block mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@domain.com"
                    required
                    className="w-full rounded-2xl border border-inputborder bg-white pl-10 pr-4 py-2.5 text-xs outline-none focus:border-flame"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-[var(--font-mono)] uppercase text-muted block mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full rounded-2xl border border-inputborder bg-white pl-10 pr-10 py-2.5 text-xs outline-none focus:border-flame"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
                  >
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-[var(--font-mono)] uppercase text-muted block mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full rounded-2xl border border-inputborder bg-white pl-10 pr-4 py-2.5 text-xs outline-none focus:border-flame"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={busy}
                className="w-full rounded-full bg-btnbg text-btntext py-3 text-xs font-semibold hover:bg-btnhover transition-colors shadow-md mt-2 flex items-center justify-center gap-2"
              >
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Account'}
              </button>

              <div className="text-center pt-2 text-xs text-muted">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => openAuth('login')}
                  className="font-semibold text-flame hover:underline"
                >
                  Sign In
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="mt-6 space-y-4">
              <div>
                <label className="text-[10px] font-[var(--font-mono)] uppercase text-muted block mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@domain.com"
                    required
                    className="w-full rounded-2xl border border-inputborder bg-white pl-10 pr-4 py-2.5 text-xs outline-none focus:border-flame"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-[var(--font-mono)] uppercase text-muted block mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full rounded-2xl border border-inputborder bg-white pl-10 pr-10 py-2.5 text-xs outline-none focus:border-flame"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
                  >
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={busy}
                className="w-full rounded-full bg-btnbg text-btntext py-3 text-xs font-semibold hover:bg-btnhover transition-colors shadow-md mt-2 flex items-center justify-center gap-2"
              >
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign In'}
              </button>

              {auth.registrationEnabled !== false && (
                <div className="text-center pt-2 text-xs text-muted">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => openAuth('signup')}
                    className="font-semibold text-flame hover:underline"
                  >
                    Create Account
                  </button>
                </div>
              )}
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
