import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ToggleLeft,
  Eye,
  Sparkle,
  Palette,
  Film,
  Type,
  FileText,
  Briefcase,
  ShoppingBag,
  ShieldCheck,
  CreditCard,
  MousePointerClick,
  Search,
  KeyRound,
  LogOut,
  Save,
  Check,
  Loader2,
  Plus,
  Trash2,
  EyeOff,
  Layers,
} from 'lucide-react';
import { useContent } from '../contexts/ContentContext';
import type { SiteContent } from '../lib/content';
import ConfirmDialog from '../components/ConfirmDialog';
import { getSession, setSession, clearSession } from '../lib/adminApi';
import PageBuilderTab from './admin/PageBuilderTab';

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'pagebuilder', label: '🎨 Page & Navbar Builder', icon: Layers },
  { id: 'buttons', label: '🔘 Button Toggles', icon: ToggleLeft },
  { id: 'sections', label: '👁️ Section Visibility', icon: Eye },
  { id: 'branding', label: '🌟 Branding & Identity', icon: Sparkle },
  { id: 'theme', label: '🎨 Theme & Colors', icon: Palette },
  { id: 'marquee', label: '🎬 Marquee Strip', icon: Film },
  { id: 'content', label: '📝 Site Text & Hero', icon: Type },
  { id: 'templates', label: '📄 Resume Templates', icon: FileText },
  { id: 'services', label: '💼 Services & Pricing', icon: Briefcase },
  { id: 'store', label: '🛍️ Store Products', icon: ShoppingBag },
  { id: 'auth', label: '🔐 Auth & Access Gates', icon: ShieldCheck },
  { id: 'payments', label: '💳 Payment & UPI', icon: CreditCard },
  { id: 'floating', label: '🛒 Floating Button', icon: MousePointerClick },
  { id: 'seo', label: '🔍 SEO Settings', icon: Search },
  { id: 'security', label: '🔑 Security & Admin Auth', icon: KeyRound },
] as const;

type TabId = (typeof TABS)[number]['id'];

export default function Admin() {
  const { content, save, refresh } = useContent();
  const [authed, setAuthed] = useState(() => !!getSession());
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  const [tab, setTab] = useState<TabId>('buttons');
  const [draft, setDraft] = useState<SiteContent>(content);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const navigate = useNavigate();

  const updateDraft = (updater: (prev: SiteContent) => SiteContent) => {
    setDraft((prev) => {
      const next = updater(prev);
      setDirty(true);
      return next;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    const ok = await save(draft);
    setSaving(false);
    if (ok) {
      setDirty(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      refresh();
    } else {
      alert('Failed to save settings.');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError('');

    // Default admin demo pass for CT Resume Core
    setTimeout(() => {
      if ((email === 'admin@ctresume.com' && password === 'admin123') || (email && password.length >= 6)) {
        setSession({
          access_token: 'ct_mock_jwt_token',
          refresh_token: 'ct_mock_refresh',
          email: email,
        });
        setAuthed(true);
      } else {
        setLoginError('Invalid credentials. (Hint: Use admin@ctresume.com / admin123 or any 6+ char password)');
      }
      setLoggingIn(false);
    }, 400);
  };

  const handleLogout = () => {
    clearSession();
    setAuthed(false);
    navigate('/');
  };

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 bg-cream">
        <div className="w-full max-w-sm rounded-3xl bg-card border border-cardborder p-8 shadow-xl">
          <div className="text-center">
            <div className="font-[var(--font-display)] text-3xl font-semibold text-heading">
              {content.brand.name}<span className="text-flame">{content.brand.dot}</span>
            </div>
            <div className="mt-1 text-xs font-[var(--font-mono)] uppercase tracking-[0.25em] text-muted">
              Admin Vault
            </div>
            <p className="mt-3 text-xs text-muted">
              Sign in with your admin credentials to manage every toggle and setting.
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-8 space-y-4">
            <div>
              <label className="text-[11px] font-[var(--font-mono)] uppercase tracking-wider text-muted block mb-1">
                Admin Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@ctresume.com"
                required
                className="w-full rounded-2xl border border-inputborder bg-inputbg px-4 py-2.5 text-sm outline-none focus:border-flame transition-colors"
              />
            </div>

            <div>
              <label className="text-[11px] font-[var(--font-mono)] uppercase tracking-wider text-muted block mb-1">
                Admin Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="admin123"
                  required
                  className="w-full rounded-2xl border border-inputborder bg-inputbg px-4 py-2.5 pr-11 text-sm outline-none focus:border-flame transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {loginError && <p className="text-xs text-red-500 font-medium">{loginError}</p>}

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full rounded-full bg-btnbg text-btntext py-3 text-sm font-medium hover:bg-btnhover transition-colors flex items-center justify-center gap-2 mt-2 shadow-md"
            >
              {loggingIn ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Unlock Admin Vault'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const btns = draft.buttonToggles || {};
  const vis = draft.sectionVisibility || {};

  return (
    <div className="min-h-screen pt-8 pb-24 bg-cream">
      <div className="mx-auto max-w-[1400px] px-4 md:px-10">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-ink/10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-flame flex items-center justify-center text-white font-bold shadow-md">
              CT
            </div>
            <div>
              <h1 className="font-[var(--font-display)] text-2xl font-bold tracking-tight text-heading">
                CT Resume Core Admin
              </h1>
              <span className="text-xs text-muted font-[var(--font-mono)]">
                Full Customization & Toggle Control Center
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 px-4 py-2 text-xs font-medium hover:bg-btnbg hover:text-btntext transition-all"
            >
              <Eye className="h-3.5 w-3.5" />
              <span>View Website</span>
            </Link>
            <button
              onClick={() => setConfirmLogout(true)}
              className="inline-flex items-center gap-1.5 rounded-full border border-red-200 text-red-600 px-4 py-2 text-xs font-medium hover:bg-red-600 hover:text-white transition-all"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Tab Strip */}
        <div className="mt-6 flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-xs font-medium transition-all ${
                tab === t.id
                  ? 'bg-btnbg text-btntext shadow-sm'
                  : 'border border-ink/15 hover:border-ink/40 text-ink bg-card'
              }`}
            >
              <t.icon className="h-3.5 w-3.5" />
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* TAB CONTENTS */}
        <div className="mt-8">
          {/* 0. PAGE & NAVBAR BUILDER TAB */}
          {tab === 'pagebuilder' && <PageBuilderTab draft={draft} setDraft={updateDraft} />}

          {/* 1. BUTTON TOGGLES TAB */}
          {tab === 'buttons' && (
            <div className="space-y-6">
              <div className="rounded-3xl border border-cardborder bg-card p-6 md:p-8 shadow-sm">
                <div className="flex items-center justify-between pb-4 border-b border-ink/10">
                  <div>
                    <h2 className="font-[var(--font-display)] text-xl font-bold text-heading">
                      🔘 Master Button Controls
                    </h2>
                    <p className="mt-1 text-xs text-muted">
                      Every button across the website can be enabled or disabled instantly.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setTab('pagebuilder')}
                      className="text-xs text-blue-600 font-medium hover:underline bg-blue-50 px-3 py-1 rounded-full border border-blue-200"
                    >
                      🧭 Manage Navbar Links ({draft.customNav?.items?.length || 5})
                    </button>
                    <button
                      onClick={() =>
                        updateDraft((prev) => ({
                          ...prev,
                          buttonToggles: {
                            navCta: true,
                            navActivityBell: true,
                            navUserAuth: true,
                            heroCtaPrimary: true,
                            heroCtaSecondary: true,
                            templatesSeeAll: true,
                            templatesItemClick: true,
                            servicesSeeAll: true,
                            servicesOrderBtn: true,
                            storeBrowseAll: true,
                            storeProductBuy: true,
                            ctaOrderNow: true,
                            floatingActionBtn: true,
                            footerBackToTop: true,
                            footerAdminLink: true,
                            footerSocialLinks: true,
                          },
                        }))
                      }
                      className="text-xs text-flame font-medium hover:underline"
                    >
                      Turn All ON
                    </button>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { key: 'navCta', label: 'Navbar "Get Started" CTA Button', desc: 'Main action button in top navigation bar' },
                    { key: 'navActivityBell', label: 'Navbar Activity Bell Icon', desc: 'Notification bell in header' },
                    { key: 'navUserAuth', label: 'Navbar Sign In / User Profile', desc: 'Auth modal trigger in navigation' },
                    { key: 'heroCtaPrimary', label: 'Hero Primary "View Templates"', desc: 'High-contrast pill button in main hero' },
                    { key: 'heroCtaSecondary', label: 'Hero Secondary "Get Started"', desc: 'Outlined pill button in hero banner' },
                    { key: 'templatesSeeAll', label: 'Templates Section "See All" Link', desc: 'Arrow link to templates gallery' },
                    { key: 'templatesItemClick', label: 'Template Card Click / Open', desc: 'Interactive card click handler' },
                    { key: 'servicesSeeAll', label: 'Services Section "All Services"', desc: 'Link to services page' },
                    { key: 'servicesOrderBtn', label: 'Services "Book Now / Get Started"', desc: 'Order trigger on each service card' },
                    { key: 'storeBrowseAll', label: 'Store Section "Browse Store"', desc: 'Link to digital products store' },
                    { key: 'storeProductBuy', label: 'Store Card "Buy / Download"', desc: 'Purchase and free claim buttons' },
                    { key: 'ctaOrderNow', label: 'Bottom CTA Strip "Order Now"', desc: 'Final conversion button before footer' },
                    { key: 'floatingActionBtn', label: 'Floating Quick Action Button', desc: 'Bottom-right persistent floating button' },
                    { key: 'footerBackToTop', label: 'Footer "Back to Top" Button', desc: 'Smooth scroll to top button' },
                    { key: 'footerAdminLink', label: 'Footer Admin Vault Link', desc: 'Discreet link to admin vault in footer' },
                    { key: 'footerSocialLinks', label: 'Footer Social & Contact Links', desc: 'Email, phone, LinkedIn & Instagram icons' },
                  ].map((btnDef) => {
                    const isChecked = btns[btnDef.key as keyof typeof btns] !== false;
                    return (
                      <div
                        key={btnDef.key}
                        className={`p-4 rounded-2xl border transition-all ${
                          isChecked ? 'bg-blue-50/50 border-blue-200' : 'bg-gray-50/80 border-gray-200 opacity-60'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-sm font-semibold text-heading">{btnDef.label}</div>
                            <div className="mt-1 text-xs text-muted">{btnDef.desc}</div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                const nextVal = e.target.checked;
                                updateDraft((prev) => ({
                                  ...prev,
                                  buttonToggles: {
                                    ...(prev.buttonToggles || {}),
                                    [btnDef.key]: nextVal,
                                  },
                                }));
                              }}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-flame"></div>
                          </label>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* 2. SECTION VISIBILITY TAB */}
          {tab === 'sections' && (
            <div className="rounded-3xl border border-cardborder bg-card p-6 md:p-8 shadow-sm space-y-6">
              <div>
                <h2 className="font-[var(--font-display)] text-xl font-bold text-heading">
                  👁️ Section Visibility Toggles
                </h2>
                <p className="mt-1 text-xs text-muted">
                  Toggle any whole section ON or OFF on the website without modifying code.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { key: 'nav', label: 'Navigation Bar Header' },
                  { key: 'hero', label: 'Hero Showcase Banner' },
                  { key: 'marquee', label: 'Moving Marquee Strip' },
                  { key: 'templates', label: 'Featured Templates / Work' },
                  { key: 'services', label: 'Services Preview Cards' },
                  { key: 'store', label: 'Digital Products Store Teaser' },
                  { key: 'testimonials', label: 'Testimonials Carousel' },
                  { key: 'cta', label: 'Ready to Stand Out (CTA Strip)' },
                  { key: 'floating', label: 'Floating Order Button' },
                  { key: 'footer', label: 'Website Footer' },
                ].map((sDef) => {
                  const isChecked = vis[sDef.key as keyof typeof vis] !== false;
                  return (
                    <div
                      key={sDef.key}
                      className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                        isChecked ? 'bg-blue-50/50 border-blue-200' : 'bg-gray-50/80 border-gray-200 opacity-60'
                      }`}
                    >
                      <div className="text-sm font-semibold text-heading">{sDef.label}</div>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            const nextVal = e.target.checked;
                            updateDraft((prev) => ({
                              ...prev,
                              sectionVisibility: {
                                ...(prev.sectionVisibility || {}),
                                [sDef.key]: nextVal,
                              },
                            }));
                          }}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-flame"></div>
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. BRANDING TAB */}
          {tab === 'branding' && (
            <div className="rounded-3xl border border-cardborder bg-card p-6 md:p-8 shadow-sm space-y-6">
              <div>
                <h2 className="font-[var(--font-display)] text-xl font-bold text-heading">
                  🌟 Website Branding
                </h2>
                <p className="mt-1 text-xs text-muted">
                  Configure brand title, suffix, dot, and logo URL.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-[var(--font-mono)] uppercase tracking-wider text-muted block mb-1">
                    Brand Name
                  </label>
                  <input
                    type="text"
                    value={draft.brand.name}
                    onChange={(e) =>
                      updateDraft((prev) => ({
                        ...prev,
                        brand: { ...prev.brand, name: e.target.value },
                      }))
                    }
                    className="w-full rounded-2xl border border-inputborder bg-inputbg px-4 py-2.5 text-sm outline-none focus:border-flame"
                  />
                </div>
                <div>
                  <label className="text-xs font-[var(--font-mono)] uppercase tracking-wider text-muted block mb-1">
                    Suffix Label
                  </label>
                  <input
                    type="text"
                    value={draft.brand.suffix}
                    onChange={(e) =>
                      updateDraft((prev) => ({
                        ...prev,
                        brand: { ...prev.brand, suffix: e.target.value },
                      }))
                    }
                    className="w-full rounded-2xl border border-inputborder bg-inputbg px-4 py-2.5 text-sm outline-none focus:border-flame"
                  />
                </div>
                <div>
                  <label className="text-xs font-[var(--font-mono)] uppercase tracking-wider text-muted block mb-1">
                    Dot Symbol
                  </label>
                  <input
                    type="text"
                    value={draft.brand.dot}
                    onChange={(e) =>
                      updateDraft((prev) => ({
                        ...prev,
                        brand: { ...prev.brand, dot: e.target.value },
                      }))
                    }
                    className="w-full rounded-2xl border border-inputborder bg-inputbg px-4 py-2.5 text-sm outline-none focus:border-flame"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-[var(--font-mono)] uppercase tracking-wider text-muted block mb-1">
                  Logo Image URL (Optional)
                </label>
                <input
                  type="text"
                  value={draft.brand.logoUrl}
                  onChange={(e) =>
                    updateDraft((prev) => ({
                      ...prev,
                      brand: { ...prev.brand, logoUrl: e.target.value },
                    }))
                  }
                  placeholder="https://example.com/logo.png"
                  className="w-full rounded-2xl border border-inputborder bg-inputbg px-4 py-2.5 text-sm outline-none focus:border-flame"
                />
              </div>
            </div>
          )}

          {/* 4. THEME & COLORS TAB */}
          {tab === 'theme' && (
            <div className="rounded-3xl border border-cardborder bg-card p-6 md:p-8 shadow-sm space-y-6">
              <div>
                <h2 className="font-[var(--font-display)] text-xl font-bold text-heading">
                  🎨 Theme & Color Engine
                </h2>
                <p className="mt-1 text-xs text-muted">
                  Customize the primary accent color and canvas appearance.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-xs font-[var(--font-mono)] uppercase tracking-wider text-muted block mb-2">
                    Primary Accent Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={draft.theme.color || '#2563eb'}
                      onChange={(e) =>
                        updateDraft((prev) => ({
                          ...prev,
                          theme: { ...prev.theme, color: e.target.value },
                        }))
                      }
                      className="h-10 w-16 rounded-xl border border-inputborder cursor-pointer"
                    />
                    <input
                      type="text"
                      value={draft.theme.color || '#2563eb'}
                      onChange={(e) =>
                        updateDraft((prev) => ({
                          ...prev,
                          theme: { ...prev.theme, color: e.target.value },
                        }))
                      }
                      className="flex-1 rounded-2xl border border-inputborder bg-inputbg px-4 py-2 text-sm font-[var(--font-mono)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-[var(--font-mono)] uppercase tracking-wider text-muted block mb-2">
                    Canvas Background Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={draft.theme.bgColor || '#f8fafc'}
                      onChange={(e) =>
                        updateDraft((prev) => ({
                          ...prev,
                          theme: { ...prev.theme, bgColor: e.target.value },
                        }))
                      }
                      className="h-10 w-16 rounded-xl border border-inputborder cursor-pointer"
                    />
                    <input
                      type="text"
                      value={draft.theme.bgColor || '#f8fafc'}
                      onChange={(e) =>
                        updateDraft((prev) => ({
                          ...prev,
                          theme: { ...prev.theme, bgColor: e.target.value },
                        }))
                      }
                      className="flex-1 rounded-2xl border border-inputborder bg-inputbg px-4 py-2 text-sm font-[var(--font-mono)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-[var(--font-mono)] uppercase tracking-wider text-muted block mb-2">
                    Default Text Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={draft.theme.textColor || '#0f172a'}
                      onChange={(e) =>
                        updateDraft((prev) => ({
                          ...prev,
                          theme: { ...prev.theme, textColor: e.target.value },
                        }))
                      }
                      className="h-10 w-16 rounded-xl border border-inputborder cursor-pointer"
                    />
                    <input
                      type="text"
                      value={draft.theme.textColor || '#0f172a'}
                      onChange={(e) =>
                        updateDraft((prev) => ({
                          ...prev,
                          theme: { ...prev.theme, textColor: e.target.value },
                        }))
                      }
                      className="flex-1 rounded-2xl border border-inputborder bg-inputbg px-4 py-2 text-sm font-[var(--font-mono)]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 5. MARQUEE STRIP TAB */}
          {tab === 'marquee' && (
            <div className="rounded-3xl border border-cardborder bg-card p-6 md:p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-[var(--font-display)] text-xl font-bold text-heading">
                    🎬 Moving Marquee Strip
                  </h2>
                  <p className="mt-1 text-xs text-muted">
                    Configure the infinite ticker items and marquee speed.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={draft.marqueeStrip?.enabled !== false}
                    onChange={(e) => {
                      const on = e.target.checked;
                      updateDraft((prev) => ({
                        ...prev,
                        marqueeStrip: { ...prev.marqueeStrip, enabled: on },
                      }));
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-flame"></div>
                </label>
              </div>

              <div className="space-y-3">
                {(draft.marqueeStrip?.items || []).map((item, idx) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <input
                      type="text"
                      value={item.text}
                      onChange={(e) => {
                        const txt = e.target.value;
                        updateDraft((prev) => {
                          const nextItems = [...(prev.marqueeStrip?.items || [])];
                          nextItems[idx] = { ...nextItems[idx], text: txt };
                          return {
                            ...prev,
                            marqueeStrip: { ...prev.marqueeStrip, items: nextItems },
                          };
                        });
                      }}
                      className="flex-1 rounded-2xl border border-inputborder bg-inputbg px-4 py-2 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        updateDraft((prev) => {
                          const nextItems = (prev.marqueeStrip?.items || []).filter((_, i) => i !== idx);
                          return {
                            ...prev,
                            marqueeStrip: { ...prev.marqueeStrip, items: nextItems },
                          };
                        });
                      }}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-xl"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    updateDraft((prev) => {
                      const nextItems = [
                        ...(prev.marqueeStrip?.items || []),
                        { id: String(Date.now()), text: 'New Feature Highlight', enabled: true },
                      ];
                      return {
                        ...prev,
                        marqueeStrip: { ...prev.marqueeStrip, items: nextItems },
                      };
                    });
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full border border-ink/20 px-4 py-2 text-xs font-medium hover:bg-ink/5"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Marquee Item</span>
                </button>
              </div>
            </div>
          )}

          {/* 6. CONTENT TAB */}
          {tab === 'content' && (
            <div className="rounded-3xl border border-cardborder bg-card p-6 md:p-8 shadow-sm space-y-6">
              <div>
                <h2 className="font-[var(--font-display)] text-xl font-bold text-heading">
                  📝 Site Text & Hero Section
                </h2>
                <p className="mt-1 text-xs text-muted">
                  Update the primary headline lines and value proposition.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-[var(--font-mono)] uppercase tracking-wider text-muted block mb-1">
                    Hero Badge
                  </label>
                  <input
                    type="text"
                    value={draft.hero.badge}
                    onChange={(e) =>
                      updateDraft((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, badge: e.target.value },
                      }))
                    }
                    className="w-full rounded-2xl border border-inputborder bg-inputbg px-4 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-[var(--font-mono)] uppercase tracking-wider text-muted block mb-1">
                    Location Label
                  </label>
                  <input
                    type="text"
                    value={draft.hero.location}
                    onChange={(e) =>
                      updateDraft((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, location: e.target.value },
                      }))
                    }
                    className="w-full rounded-2xl border border-inputborder bg-inputbg px-4 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-[var(--font-mono)] uppercase tracking-wider text-muted block mb-1">
                    Headline Line 1
                  </label>
                  <input
                    type="text"
                    value={draft.hero.line1}
                    onChange={(e) =>
                      updateDraft((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, line1: e.target.value },
                      }))
                    }
                    className="w-full rounded-2xl border border-inputborder bg-inputbg px-4 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-[var(--font-mono)] uppercase tracking-wider text-muted block mb-1">
                    Headline Line 2
                  </label>
                  <input
                    type="text"
                    value={draft.hero.line2}
                    onChange={(e) =>
                      updateDraft((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, line2: e.target.value },
                      }))
                    }
                    className="w-full rounded-2xl border border-inputborder bg-inputbg px-4 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-[var(--font-mono)] uppercase tracking-wider text-muted block mb-1">
                    Headline Highlight (Italic)
                  </label>
                  <input
                    type="text"
                    value={draft.hero.line4Main}
                    onChange={(e) =>
                      updateDraft((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, line4Main: e.target.value },
                      }))
                    }
                    className="w-full rounded-2xl border border-inputborder bg-inputbg px-4 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-[var(--font-mono)] uppercase tracking-wider text-muted block mb-1">
                    Subheading Description
                  </label>
                  <input
                    type="text"
                    value={draft.hero.subheading}
                    onChange={(e) =>
                      updateDraft((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, subheading: e.target.value },
                      }))
                    }
                    className="w-full rounded-2xl border border-inputborder bg-inputbg px-4 py-2 text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 7. RESUME TEMPLATES TAB */}
          {tab === 'templates' && (
            <div className="rounded-3xl border border-cardborder bg-card p-6 md:p-8 shadow-sm space-y-6">
              <div>
                <h2 className="font-[var(--font-display)] text-xl font-bold text-heading">
                  📄 Resume Templates Manager
                </h2>
                <p className="mt-1 text-xs text-muted">
                  Control the portfolio of resume templates visible across the website.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl border border-ink/10 bg-cream flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-sm">Executive Tech Leader CV</div>
                    <div className="text-xs text-muted">Executive Resumes · ₹999</div>
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 font-semibold px-2.5 py-1 rounded-full">
                    Active
                  </span>
                </div>
                <div className="p-4 rounded-2xl border border-ink/10 bg-cream flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-sm">Modern Software Engineer One-Pager</div>
                    <div className="text-xs text-muted">Tech & Software Engineering · ₹799</div>
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 font-semibold px-2.5 py-1 rounded-full">
                    Active
                  </span>
                </div>
                <div className="p-4 rounded-2xl border border-ink/10 bg-cream flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-sm">Product & Design Portfolio Resume</div>
                    <div className="text-xs text-muted">Product & Design CVs · ₹899</div>
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 font-semibold px-2.5 py-1 rounded-full">
                    Active
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 8. SERVICES TAB */}
          {tab === 'services' && (
            <div className="rounded-3xl border border-cardborder bg-card p-6 md:p-8 shadow-sm space-y-6">
              <div>
                <h2 className="font-[var(--font-display)] text-xl font-bold text-heading">
                  💼 Services & Pricing Packages
                </h2>
                <p className="mt-1 text-xs text-muted">
                  Manage career coaching, resume rewrite, and LinkedIn makeover offerings.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl border border-ink/10 bg-cream flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-sm">Complete Resume Rewrite</div>
                    <div className="text-xs text-muted">Starting ₹1,499 · 24-48 Hours</div>
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 font-semibold px-2.5 py-1 rounded-full">
                    Published
                  </span>
                </div>
                <div className="p-4 rounded-2xl border border-ink/10 bg-cream flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-sm">LinkedIn Profile Makeover</div>
                    <div className="text-xs text-muted">Starting ₹999 · 24 Hours</div>
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 font-semibold px-2.5 py-1 rounded-full">
                    Published
                  </span>
                </div>
                <div className="p-4 rounded-2xl border border-ink/10 bg-cream flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-sm">Career Sprint Combo Pack</div>
                    <div className="text-xs text-muted">Starting ₹2,499 · 2-3 Days</div>
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 font-semibold px-2.5 py-1 rounded-full">
                    Published
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 9. STORE TAB */}
          {tab === 'store' && (
            <div className="rounded-3xl border border-cardborder bg-card p-6 md:p-8 shadow-sm space-y-6">
              <div>
                <h2 className="font-[var(--font-display)] text-xl font-bold text-heading">
                  🛍️ Store Digital Goods
                </h2>
                <p className="mt-1 text-xs text-muted">
                  Control instant download items, free templates, and premium guides.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl border border-ink/10 bg-cream flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-sm">ATS Elite 10-Template Bundle</div>
                    <div className="text-xs text-muted">Paid · ₹499</div>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-700 font-semibold px-2.5 py-1 rounded-full">
                    Instant Download
                  </span>
                </div>
                <div className="p-4 rounded-2xl border border-ink/10 bg-cream flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-sm">Action Verbs & Impact Metric Cheat Sheet</div>
                    <div className="text-xs text-muted">Free · Instant Claim</div>
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 font-semibold px-2.5 py-1 rounded-full">
                    Free
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 10. AUTH TAB */}
          {tab === 'auth' && (
            <div className="rounded-3xl border border-cardborder bg-card p-6 md:p-8 shadow-sm space-y-6">
              <div>
                <h2 className="font-[var(--font-display)] text-xl font-bold text-heading">
                  🔐 Authentication & Action Gates
                </h2>
                <p className="mt-1 text-xs text-muted">
                  Toggle whether customer sign-in is required before buying or downloading.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: 'loginEnabled', label: 'User Login System Enabled' },
                  { key: 'registrationEnabled', label: 'New User Sign-ups Allowed' },
                  { key: 'guestBrowsing', label: 'Guest Browsing (No Login Wall)' },
                  { key: 'guestCheckout', label: 'Guest Checkout (Buy without account)' },
                  { key: 'gatePurchase', label: 'Require Login To Purchase' },
                  { key: 'gateFreeClaim', label: 'Require Login For Free Downloads' },
                ].map((aDef) => {
                  const isChecked = draft.auth[aDef.key as keyof typeof draft.auth] !== false;
                  return (
                    <div
                      key={aDef.key}
                      className="p-4 rounded-2xl border border-ink/10 bg-cream flex items-center justify-between"
                    >
                      <span className="text-sm font-semibold text-heading">{aDef.label}</span>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            const val = e.target.checked;
                            updateDraft((prev) => ({
                              ...prev,
                              auth: { ...prev.auth, [aDef.key]: val },
                            }));
                          }}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-flame"></div>
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 11. PAYMENTS TAB */}
          {tab === 'payments' && (
            <div className="rounded-3xl border border-cardborder bg-card p-6 md:p-8 shadow-sm space-y-6">
              <div>
                <h2 className="font-[var(--font-display)] text-xl font-bold text-heading">
                  💳 Payment & UPI Configuration
                </h2>
                <p className="mt-1 text-xs text-muted">
                  Configure UPI QR code details, WhatsApp ordering, and instant download limits.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-[var(--font-mono)] uppercase tracking-wider text-muted block mb-1">
                    UPI ID
                  </label>
                  <input
                    type="text"
                    value={draft.payment.upiId}
                    onChange={(e) =>
                      updateDraft((prev) => ({
                        ...prev,
                        payment: { ...prev.payment, upiId: e.target.value },
                      }))
                    }
                    className="w-full rounded-2xl border border-inputborder bg-inputbg px-4 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-[var(--font-mono)] uppercase tracking-wider text-muted block mb-1">
                    Payee Name
                  </label>
                  <input
                    type="text"
                    value={draft.payment.payeeName}
                    onChange={(e) =>
                      updateDraft((prev) => ({
                        ...prev,
                        payment: { ...prev.payment, payeeName: e.target.value },
                      }))
                    }
                    className="w-full rounded-2xl border border-inputborder bg-inputbg px-4 py-2 text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 12. FLOATING BUTTON TAB */}
          {tab === 'floating' && (
            <div className="rounded-3xl border border-cardborder bg-card p-6 md:p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-[var(--font-display)] text-xl font-bold text-heading">
                    🛒 Floating Quick Action Button
                  </h2>
                  <p className="mt-1 text-xs text-muted">
                    Persistent floating shortcut on mobile and desktop.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={draft.floatingButton?.enabled !== false}
                    onChange={(e) => {
                      const on = e.target.checked;
                      updateDraft((prev) => ({
                        ...prev,
                        floatingButton: { ...prev.floatingButton, enabled: on },
                      }));
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-flame"></div>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-[var(--font-mono)] uppercase tracking-wider text-muted block mb-1">
                    Button Label Text (Optional)
                  </label>
                  <input
                    type="text"
                    value={draft.floatingButton.text}
                    onChange={(e) =>
                      updateDraft((prev) => ({
                        ...prev,
                        floatingButton: { ...prev.floatingButton, text: e.target.value },
                      }))
                    }
                    placeholder="e.g. Chat with Us"
                    className="w-full rounded-2xl border border-inputborder bg-inputbg px-4 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-[var(--font-mono)] uppercase tracking-wider text-muted block mb-1">
                    Click Action Target
                  </label>
                  <select
                    value={draft.floatingButton.action}
                    onChange={(e) =>
                      updateDraft((prev) => ({
                        ...prev,
                        floatingButton: { ...prev.floatingButton, action: e.target.value },
                      }))
                    }
                    className="w-full rounded-2xl border border-inputborder bg-inputbg px-4 py-2.5 text-sm"
                  >
                    <option value="whatsapp">Direct WhatsApp Chat</option>
                    <option value="services">Navigate to Services</option>
                    <option value="store">Open Store Products</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* 13. SEO TAB */}
          {tab === 'seo' && (
            <div className="rounded-3xl border border-cardborder bg-card p-6 md:p-8 shadow-sm space-y-6">
              <div>
                <h2 className="font-[var(--font-display)] text-xl font-bold text-heading">
                  🔍 SEO & Metadata Settings
                </h2>
                <p className="mt-1 text-xs text-muted">
                  Optimize your search engine title tags and Google descriptions.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-[var(--font-mono)] uppercase tracking-wider text-muted block mb-1">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    value={draft.seo.title}
                    onChange={(e) =>
                      updateDraft((prev) => ({
                        ...prev,
                        seo: { ...prev.seo, title: e.target.value },
                      }))
                    }
                    className="w-full rounded-2xl border border-inputborder bg-inputbg px-4 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-[var(--font-mono)] uppercase tracking-wider text-muted block mb-1">
                    Meta Description
                  </label>
                  <textarea
                    rows={3}
                    value={draft.seo.description}
                    onChange={(e) =>
                      updateDraft((prev) => ({
                        ...prev,
                        seo: { ...prev.seo, description: e.target.value },
                      }))
                    }
                    className="w-full rounded-2xl border border-inputborder bg-inputbg px-4 py-2 text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 14. SECURITY TAB */}
          {tab === 'security' && (
            <div className="rounded-3xl border border-cardborder bg-card p-6 md:p-8 shadow-sm space-y-6">
              <div>
                <h2 className="font-[var(--font-display)] text-xl font-bold text-heading">
                  🔑 Security & Admin Authentication
                </h2>
                <p className="mt-1 text-xs text-muted">
                  Manage admin sessions, logout timeouts, and access passwords.
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-green-200 bg-green-50/60 text-xs text-green-800">
                🔒 Admin vault session is active and securely authenticated. Inactivity timer is set to 30 minutes.
              </div>

              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-full bg-red-600 text-white px-5 py-2.5 text-xs font-medium hover:bg-red-700 transition-colors shadow-sm"
              >
                <LogOut className="h-4 w-4" />
                <span>Log Out of Vault</span>
              </button>
            </div>
          )}

          {/* 15. DASHBOARD TAB */}
          {tab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="rounded-3xl border border-cardborder bg-card p-6 shadow-sm">
                  <span className="text-xs text-muted uppercase tracking-wider">Total Resumes Built</span>
                  <div className="mt-2 font-[var(--font-display)] text-4xl font-bold text-heading">542</div>
                  <span className="text-xs text-green-600 font-medium">↑ +18% this month</span>
                </div>
                <div className="rounded-3xl border border-cardborder bg-card p-6 shadow-sm">
                  <span className="text-xs text-muted uppercase tracking-wider">Active Services</span>
                  <div className="mt-2 font-[var(--font-display)] text-4xl font-bold text-heading">5</div>
                  <span className="text-xs text-muted">All online</span>
                </div>
                <div className="rounded-3xl border border-cardborder bg-card p-6 shadow-sm">
                  <span className="text-xs text-muted uppercase tracking-wider">Store Products</span>
                  <div className="mt-2 font-[var(--font-display)] text-4xl font-bold text-heading">6</div>
                  <span className="text-xs text-blue-600 font-medium">Digital Downloads</span>
                </div>
                <div className="rounded-3xl border border-cardborder bg-card p-6 shadow-sm">
                  <span className="text-xs text-muted uppercase tracking-wider">Active Button Toggles</span>
                  <div className="mt-2 font-[var(--font-display)] text-4xl font-bold text-flame">
                    {Object.values(draft.buttonToggles || {}).filter(Boolean).length}/16
                  </div>
                  <span className="text-xs text-muted">Toggled ON</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Save Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-cream/95 backdrop-blur border-t border-ink/10">
        <div className="mx-auto max-w-[1400px] px-4 md:px-10 py-3 flex items-center justify-between gap-4">
          <span className="text-xs text-muted">
            {dirty ? '⚠️ You have unsaved changes' : saved ? '✓ All changes published successfully!' : 'All settings up to date.'}
          </span>
          <div className="flex gap-2">
            {dirty && (
              <button
                onClick={() => {
                  setDraft(content);
                  setDirty(false);
                }}
                className="rounded-full border border-ink/20 px-4 py-2 text-xs font-medium hover:bg-ink/5 transition-all"
              >
                Discard
              </button>
            )}
            <button
              onClick={handleSave}
              disabled={!dirty || saving}
              className="inline-flex items-center gap-2 rounded-full bg-btnbg text-btntext px-6 py-2.5 text-xs font-medium hover:bg-btnhover transition-colors disabled:opacity-50 shadow-md"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
              <span>{saving ? 'Publishing...' : 'Save & Publish Live'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Confirm Logout Dialog */}
      <ConfirmDialog
        open={confirmLogout}
        title="Logout of Admin Vault?"
        message="Are you sure you want to log out of the CT Resume Core Admin Panel?"
        confirmLabel="Logout"
        onConfirm={handleLogout}
        onCancel={() => setConfirmLogout(false)}
      />
    </div>
  );
}
