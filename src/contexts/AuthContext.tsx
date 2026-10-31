/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useRef, useCallback, type ReactNode } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import supabase from '../lib/supabase';
import { registerGateHandler, type GateKey } from '../lib/authGate';
import { useContent } from './ContentContext';

export interface UserProfile {
  user_id: string;
  email?: string;
  username?: string;
  full_name?: string;
  avatar?: string;
  created_at?: string;
}

interface AuthCtx {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  authModalOpen: boolean;
  authModalView: 'login' | 'signup' | 'forgot';
  gatePopupOpen: boolean;
  profileOpen: boolean;
  openAuth: (view?: 'login' | 'signup' | 'forgot') => void;
  closeAuth: () => void;
  closeGatePopup: () => void;
  setProfileOpen: (v: boolean) => void;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
}

const Ctx = createContext<AuthCtx>({
  user: null, session: null, profile: null, loading: true,
  authModalOpen: false, authModalView: 'login', gatePopupOpen: false, profileOpen: false,
  openAuth: () => {}, closeAuth: () => {}, closeGatePopup: () => {}, setProfileOpen: () => {},
  refreshProfile: async () => {}, signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const { content } = useContent();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState<'login' | 'signup' | 'forgot'>('login');
  const [gatePopupOpen, setGatePopupOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const pendingAction = useRef<(() => void) | null>(null);
  const userRef = useRef<User | null>(null);
  userRef.current = user;

  const loadProfile = useCallback(async (u: User | null) => {
    if (!u) { setProfile(null); return; }
    try {
      const res = await fetch(`/api/auth-profile?user_id=${encodeURIComponent(u.id)}`);
      const data = await res.json();
      if (data && data.user_id) {
        setProfile(data);
      }
    } catch { /* profile is best-effort */ }
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      loadProfile(session?.user ?? null);
      setLoading(false);
    }).catch(() => setLoading(false));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      loadProfile(session?.user ?? null);
      setLoading(false);
      if (session?.user && pendingAction.current) {
        const act = pendingAction.current;
        pendingAction.current = null;
        setGatePopupOpen(false);
        setAuthModalOpen(false);
        setTimeout(() => act(), 250);
      }
    });
    return () => subscription.unsubscribe();
  }, [loadProfile]);

  useEffect(() => {
    const auth = content.auth;
    registerGateHandler((key: GateKey, action: () => void) => {
      const extraGate = key === 'gatePurchase' && auth && !auth.guestCheckout;
      const gateOn = auth && auth.loginEnabled && (auth[key as keyof typeof auth] || extraGate);
      if (!gateOn || userRef.current) {
        action();
        return;
      }
      pendingAction.current = action;
      setGatePopupOpen(true);
    });
    return () => registerGateHandler(null);
  }, [content.auth]);

  const openAuth = useCallback((view: 'login' | 'signup' | 'forgot' = 'login') => {
    setAuthModalView(view);
    setAuthModalOpen(true);
    setGatePopupOpen(false);
  }, []);

  const closeAuth = useCallback(() => setAuthModalOpen(false), []);
  const closeGatePopup = useCallback(() => {
    setGatePopupOpen(false);
    pendingAction.current = null;
  }, []);

  const refreshProfile = useCallback(async () => { await loadProfile(userRef.current); }, [loadProfile]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setProfileOpen(false);
  }, []);

  return (
    <Ctx.Provider value={{
      user, session, profile, loading,
      authModalOpen, authModalView, gatePopupOpen, profileOpen,
      openAuth, closeAuth, closeGatePopup, setProfileOpen,
      refreshProfile, signOut,
    }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => useContext(Ctx);
