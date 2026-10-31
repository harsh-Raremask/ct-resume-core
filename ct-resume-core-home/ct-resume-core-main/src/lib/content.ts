/* ─────────────────────────────────────────────────────────────────────────────
   CT Resume Core — Site Content Types & Defaults
   Every feature has a boolean toggle so admin can enable/disable it.
───────────────────────────────────────────────────────────────────────────── */

/* ── Extended Colors ── */
export const EXTENDED_COLOR_KEYS = [
  'text2', 'muted', 'heading', 'navtext',
  'btnbg', 'btntext', 'btnhover',
  'card', 'cardborder', 'cardshadow',
  'bgalt', 'darksec', 'lighttext',
  'footerbg', 'footertext',
  'inputbg', 'inputborder', 'inputtext',
  'badgebg', 'badgetext',
  'overlay', 'gradstart', 'gradend',
] as const;
export type ExtendedColorKey = (typeof EXTENDED_COLOR_KEYS)[number];
export type ExtendedColors = Record<ExtendedColorKey, string>;

export const EMPTY_EXTENDED: ExtendedColors = Object.fromEntries(
  EXTENDED_COLOR_KEYS.map((k) => [k, ''])
) as ExtendedColors;

export const STATIC_EXTENDED_DEFAULTS: ExtendedColors = {
  text2: '#374151',
  muted: '#6b7280',
  heading: '#0f172a',
  navtext: '#374151',
  btnbg: '#1e40af',
  btntext: '#ffffff',
  btnhover: '#2563eb',
  card: '#ffffff',
  cardborder: '#e2e8f0',
  cardshadow: 'rgba(15,23,42,0.10)',
  bgalt: '#f8fafc',
  darksec: '#0f172a',
  lighttext: '#f8fafc',
  footerbg: '#0f172a',
  footertext: '#f8fafc',
  inputbg: '#ffffff',
  inputborder: '#cbd5e1',
  inputtext: '#0f172a',
  badgebg: '#2563eb',
  badgetext: '#ffffff',
  overlay: 'rgba(15,23,42,0.6)',
  gradstart: '#2563eb',
  gradend: '#7c3aed',
};

/* ── Section Defs ── */
export const SECTION_DEFS = [
  { key: 'hero', label: 'Hero' },
  { key: 'nav', label: 'Navigation' },
  { key: 'marquee', label: 'Marquee Strip' },
  { key: 'testimonials', label: 'Testimonials' },
  { key: 'services', label: 'Services' },
  { key: 'store', label: 'Store' },
  { key: 'templates', label: 'Templates' },
  { key: 'cta', label: 'CTA' },
  { key: 'contact', label: 'Contact' },
  { key: 'footer', label: 'Footer' },
  { key: 'floating', label: 'Floating Buttons' },
  { key: 'popup', label: 'Popup Windows' },
  { key: 'forms', label: 'Forms' },
] as const;
export type SectionKey = (typeof SECTION_DEFS)[number]['key'];

export interface SectionTheme {
  enabled: boolean;
  colors: Record<string, string>;
}
export type SectionThemes = Record<string, SectionTheme>;

export function emptySectionColors(): Record<string, string> {
  return {
    bg: '', text: '', heading: '', accent: '', subtitle: '',
    glow: '', card: '', cardborder: '', cardshadow: '',
    badge: '', sideborder: '', border: '', overlay: '',
    gradstart: '', gradend: '',
  };
}

export function defaultSectionThemes(): SectionThemes {
  const o: SectionThemes = {};
  for (const s of SECTION_DEFS) o[s.key] = { enabled: false, colors: emptySectionColors() };
  return o;
}

export interface ThemeSettings {
  color: string;
  textColor: string;
  bgColor: string;
  preset: string;
  colors: ExtendedColors;
  sections: SectionThemes;
}

/* ── App Settings ── */
export interface AppSettings {
  name: string;
  shortName: string;
  icon: string;
  themeColor: string;
  bgColor: string;
  installButtonEnabled: boolean;
}

/* ── SEO ── */
export interface SeoSettings {
  title: string;
  description: string;
  keywords: string;
  ogImage: string;
}

/* ── Auth Settings (all toggleable) ── */
export interface AuthSettings {
  loginEnabled: boolean;
  registrationEnabled: boolean;
  guestBrowsing: boolean;
  guestCheckout: boolean;
  googleLogin: boolean;
  emailLogin: boolean;
  rememberMe: boolean;
  forgotPassword: boolean;
  showHidePassword: boolean;
  backToWebsite: boolean;
  suFullName: boolean;
  suEmail: boolean;
  suPassword: boolean;
  suConfirmPassword: boolean;
  suAcceptTerms: boolean;
  autoLoginAfterSignup: boolean;
  emailVerification: boolean;
  gatePurchase: boolean;
  gateFreeClaim: boolean;
  gateDownload: boolean;
  gateRewards: boolean;
  gateReviews: boolean;
  gateWishlist: boolean;
  gateOrderCenter: boolean;
  loginAttemptProtection: boolean;
  rateLimiting: boolean;
  sessionTimeout: boolean;
  secureSessions: boolean;
  passwordHashing: boolean;
  twoFactor: boolean;
  loginAlerts: boolean;
  sessionManager: boolean;
  logoutAllDevices: boolean;
  blockSuspicious: boolean;
}

export const DEFAULT_AUTH: AuthSettings = {
  loginEnabled: true,
  registrationEnabled: true,
  guestBrowsing: true,
  guestCheckout: true,
  googleLogin: true,
  emailLogin: true,
  rememberMe: true,
  forgotPassword: true,
  showHidePassword: true,
  backToWebsite: true,
  suFullName: true,
  suEmail: true,
  suPassword: true,
  suConfirmPassword: true,
  suAcceptTerms: true,
  autoLoginAfterSignup: true,
  emailVerification: false,
  gatePurchase: false,
  gateFreeClaim: false,
  gateDownload: false,
  gateRewards: false,
  gateReviews: false,
  gateWishlist: false,
  gateOrderCenter: false,
  loginAttemptProtection: true,
  rateLimiting: true,
  sessionTimeout: false,
  secureSessions: true,
  passwordHashing: true,
  twoFactor: false,
  loginAlerts: false,
  sessionManager: true,
  logoutAllDevices: true,
  blockSuspicious: false,
};

/* ── Payment Settings ── */
export interface PaymentSettings {
  manualEnabled: boolean;
  onlineEnabled: boolean;
  redirectWhatsApp: boolean;
  autoCreateOrder: boolean;
  adminNotification: boolean;
  manualApproval: boolean;
  unlockAfterApproval: boolean;
  autoDownload: boolean;
  successNotification: boolean;
  instantDownload: boolean;
  downloadLimit: number;
  downloadExpiryHours: number;
}

/* ── Floating Button ── */
export interface FloatingButtonSettings {
  enabled: boolean;
  text: string;
  icon: string;
  bgColor: string;
  textColor: string;
  size: number;
  radius: number;
  position: string;
  shadow: number;
  animation: string;
  badge: boolean;
  badgeColor: string;
  action: string;
  customUrl: string;
  showOn: string;
}

/* ── Marquee Strip ── */
export interface MarqueeStripItem {
  id: string;
  text: string;
  enabled: boolean;
  color?: string;
}

export interface MarqueeStripConfig {
  enabled: boolean;
  items: MarqueeStripItem[];
  separator: string;
  textColor: string;
  bgColor: string;
  fontSize: string;
  italic: boolean;
  speed: number;
  direction: 'left' | 'right';
  pauseOnHover: boolean;
}

/* ── Section Visibility (every section has toggle) ── */
export interface SectionVisibility {
  nav: boolean;
  hero: boolean;
  marquee: boolean;
  templates: boolean;
  services: boolean;
  store: boolean;
  testimonials: boolean;
  contact: boolean;
  cta: boolean;
  floating: boolean;
  footer: boolean;
}

/* ── Store Experience (all toggleable) ── */
export interface StoreExperienceSettings {
  folderLibraryEnabled: boolean;
  showCoverImage: boolean;
  showAssetCount: boolean;
  showLastUpdated: boolean;
  showFeaturedBadge: boolean;
  showPriceBadge: boolean;
  hoverAnimation: boolean;
  gridView: boolean;
  masonryView: boolean;
  listView: boolean;
  defaultView: 'grid' | 'masonry' | 'list';
  searchEnabled: boolean;
  categoryFilter: boolean;
  tagFilter: boolean;
  wishlist: boolean;
  recentlyViewed: boolean;
  purchasedBadge: boolean;
  trendingBadge: boolean;
  newArrivals: boolean;
  bundleSystem: boolean;
}

/* ── Order Center Sections (all toggleable) ── */
export interface OrderCenterSections {
  whatsappChat: boolean;
  ordersSummary: boolean;
  downloads: boolean;
  freeDownloads: boolean;
  rewardWallet: boolean;
  activeTasks: boolean;
  notifications: boolean;
  purchasedProducts: boolean;
  savedProducts: boolean;
  couponCenter: boolean;
  customSection: boolean;
  customTitle: string;
  customContent: string;
}

/* ── Rewards ── */
export interface RewardsSettings {
  enabled: boolean;
  tokenName: string;
  tokenSymbol: string;
  tokenIcon: string;
  tokenColor: string;
  showWallet: boolean;
  showTokenPrices: boolean;
  showTasks: boolean;
  showEarn: boolean;
  showRedemption: boolean;
  showHistory: boolean;
}

/* ── Branding ── */
export interface BrandingSettings {
  logo: {
    url: string;
    shape: 'square' | 'circle' | 'rounded' | 'custom';
    radius: number;
    width: number;
    height: number;
  };
}

/* ── Button Toggles (Admin can toggle ON/OFF literally any button) ── */
export interface ButtonToggles {
  // Nav buttons
  navCta: boolean;
  navActivityBell: boolean;
  navUserAuth: boolean;

  // Hero section buttons
  heroCtaPrimary: boolean;
  heroCtaSecondary: boolean;

  // Templates section
  templatesSeeAll: boolean;
  templatesItemClick: boolean;

  // Services section
  servicesSeeAll: boolean;
  servicesOrderBtn: boolean;

  // Store section
  storeBrowseAll: boolean;
  storeProductBuy: boolean;

  // CTA Strip
  ctaOrderNow: boolean;

  // Floating Button
  floatingActionBtn: boolean;

  // Footer buttons & links
  footerBackToTop: boolean;
  footerAdminLink: boolean;
  footerSocialLinks: boolean;
}

export const DEFAULT_BUTTON_TOGGLES: ButtonToggles = {
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
};

/* ── Custom Nav Items (Navbar Page Builder) ── */
export interface CustomNavItem {
  id: string;
  label: string;
  url: string;
  icon?: string;
  badge?: string;
  badgeColor?: string;
  newTab?: boolean;
  visible?: boolean;
}

export interface CustomNavConfig {
  enabled: boolean;
  items: CustomNavItem[];
}

export const DEFAULT_NAV_ITEMS: CustomNavItem[] = [
  { id: 'nav-home', label: 'Home', url: '/', icon: '', badge: '', badgeColor: '#2563eb', newTab: false, visible: true },
  { id: 'nav-templates', label: 'Templates', url: '/templates', icon: '📄', badge: '', badgeColor: '#2563eb', newTab: false, visible: true },
  { id: 'nav-services', label: 'Services', url: '/services', icon: '💼', badge: 'POPULAR', badgeColor: '#2563eb', newTab: false, visible: true },
  { id: 'nav-store', label: 'Store', url: '/store', icon: '🛒', badge: '', badgeColor: '#2563eb', newTab: false, visible: true },
  { id: 'nav-about', label: 'About', url: '/about', icon: '', badge: '', badgeColor: '#2563eb', newTab: false, visible: true },
];

/* ── MASTER SITE CONTENT ── */
export interface SiteContent {
  auth: AuthSettings;
  sectionVisibility: SectionVisibility;
  buttonToggles: ButtonToggles;
  customNav: CustomNavConfig;
  brand: { name: string; suffix: string; dot: string; logoUrl: string };
  theme: ThemeSettings;
  app: AppSettings;
  paymentSettings: PaymentSettings;
  rewards: RewardsSettings;
  floatingButton: FloatingButtonSettings;
  orderCenterSections: OrderCenterSections;
  storeExperience: StoreExperienceSettings;
  seo: SeoSettings;
  branding: BrandingSettings;
  marqueeStrip: MarqueeStripConfig;
  nav: {
    home: string;
    templates: string;
    services: string;
    store: string;
    about: string;
    cta: string;
  };
  hero: {
    badge: string;
    line1: string;
    line2: string;
    line3: string;
    line4Main: string;
    line4End: string;
    subheading: string;
    statValue: string;
    statLabel: string;
    retention: string;
    retentionLabel: string;
    retentionDesc: string;
    ctaPrimary: string;
    ctaSecondary: string;
    location: string;
  };
  home: {
    templatesEyebrow: string;
    templatesTitle: string;
    templatesItalic: string;
    templatesLink: string;
    servicesEyebrow: string;
    servicesTitle: string;
    servicesItalic: string;
    servicesLink: string;
    storeEyebrow: string;
    storeTitle: string;
    storeItalic: string;
    storeLink: string;
  };
  testimonialsSection: { eyebrow: string; title: string; italic: string };
  cta: { eyebrow: string; title: string; italic: string; button: string };
  footer: {
    tagline: string;
    navigateLabel: string;
    contactLabel: string;
    rights: string;
    location: string;
    adminLabel: string;
  };
  contact: {
    email: string;
    phone: string;
    phoneRaw: string;
    instagram: string;
    instagramUrl: string;
    linkedin: string;
    linkedinUrl: string;
  };
  payment: { upiId: string; payeeName: string };
  pages: {
    templates: { eyebrow: string; title: string; italic: string; description: string };
    services: { eyebrow: string; title: string; italic: string; description: string };
    store: { eyebrow: string; title: string; italic: string; description: string };
    about: { eyebrow: string; title: string; italic: string; description: string };
  };
  about: {
    introEyebrow: string;
    introTitle: string;
    introItalic: string;
    paragraphs: string[];
    stats: string[];
    portraitImage: string;
    name: string;
    role: string;
    badge1: string;
    badge2: string;
    metaLeft: string;
    metaRight: string;
  };
}

/* ── DEFAULTS ── */
export const THEME_DEFAULTS = {
  color: '#2563eb',
  textColor: '#0f172a',
  bgColor: '#f8fafc',
};

export const DEFAULT_CONTENT: SiteContent = {
  auth: DEFAULT_AUTH,
  sectionVisibility: {
    nav: true,
    hero: true,
    marquee: true,
    templates: true,
    services: true,
    store: true,
    testimonials: true,
    contact: true,
    cta: true,
    floating: true,
    footer: true,
  },
  buttonToggles: { ...DEFAULT_BUTTON_TOGGLES },
  customNav: {
    enabled: true,
    items: [...DEFAULT_NAV_ITEMS],
  },
  brand: {
    name: 'CT Resume',
    suffix: 'Core',
    dot: '.',
    logoUrl: '',
  },
  theme: {
    color: '#2563eb',
    textColor: '#0f172a',
    bgColor: '#f8fafc',
    preset: 'default',
    colors: { ...EMPTY_EXTENDED },
    sections: defaultSectionThemes(),
  },
  branding: {
    logo: {
      url: '',
      shape: 'circle',
      radius: 50,
      width: 40,
      height: 40,
    },
  },
  app: {
    name: 'CT Resume Core — Professional Resume Builder',
    shortName: 'CT Resume',
    icon: '/icons/icon-512.png',
    themeColor: '#1e40af',
    bgColor: '#1e40af',
    installButtonEnabled: true,
  },
  paymentSettings: {
    manualEnabled: true,
    onlineEnabled: false,
    redirectWhatsApp: true,
    autoCreateOrder: true,
    adminNotification: true,
    manualApproval: true,
    unlockAfterApproval: true,
    autoDownload: true,
    successNotification: true,
    instantDownload: true,
    downloadLimit: 5,
    downloadExpiryHours: 72,
  },
  rewards: {
    enabled: false,
    tokenName: 'Resume Coins',
    tokenSymbol: 'RC',
    tokenIcon: '🪙',
    tokenColor: '#2563eb',
    showWallet: true,
    showTokenPrices: true,
    showTasks: true,
    showEarn: true,
    showRedemption: true,
    showHistory: true,
  },
  floatingButton: {
    enabled: true,
    text: '',
    icon: 'message',
    bgColor: '',
    textColor: '',
    size: 2,
    radius: 999,
    position: 'bottom-right',
    shadow: 60,
    animation: 'none',
    badge: false,
    badgeColor: '#ef4444',
    action: 'order-center',
    customUrl: '',
    showOn: 'all',
  },
  orderCenterSections: {
    whatsappChat: true,
    ordersSummary: true,
    downloads: true,
    freeDownloads: true,
    rewardWallet: true,
    activeTasks: true,
    notifications: false,
    purchasedProducts: true,
    savedProducts: true,
    couponCenter: false,
    customSection: false,
    customTitle: '',
    customContent: '',
  },
  storeExperience: {
    folderLibraryEnabled: true,
    showCoverImage: true,
    showAssetCount: true,
    showLastUpdated: true,
    showFeaturedBadge: true,
    showPriceBadge: true,
    hoverAnimation: true,
    gridView: true,
    masonryView: true,
    listView: true,
    defaultView: 'grid',
    searchEnabled: true,
    categoryFilter: true,
    tagFilter: true,
    wishlist: true,
    recentlyViewed: true,
    purchasedBadge: true,
    trendingBadge: true,
    newArrivals: true,
    bundleSystem: true,
  },
  seo: {
    title: 'CT Resume Core — Professional Resume Builder',
    description: 'CT Resume Core — Build stunning resumes, cover letters & LinkedIn profiles that get you hired.',
    keywords: 'resume builder, cv design, cover letter, linkedin optimization, CT Resume',
    ogImage: '',
  },
  marqueeStrip: {
    enabled: true,
    items: [
      { id: '1', text: 'ATS-Friendly', enabled: true },
      { id: '2', text: 'Modern Templates', enabled: true },
      { id: '3', text: 'Cover Letters', enabled: true },
      { id: '4', text: 'LinkedIn Profiles', enabled: true },
      { id: '5', text: 'Professional Design', enabled: true },
      { id: '6', text: 'Fast Delivery', enabled: true },
    ],
    separator: '✦',
    textColor: '#f8fafc',
    bgColor: '#1e40af',
    fontSize: '18px',
    italic: false,
    speed: 30,
    direction: 'left',
    pauseOnHover: true,
  },
  nav: {
    home: 'Home',
    templates: 'Templates',
    services: 'Services',
    store: 'Store',
    about: 'About',
    cta: 'Get Started',
  },
  hero: {
    badge: 'Available for Freelance · 2025',
    line1: 'Build\u00a0Resumes',
    line2: 'That\u00a0Get',
    line3: 'You',
    line4Main: 'Hired',
    line4End: '.',
    subheading: 'Resume Designer · Career Coach · LinkedIn Expert',
    statValue: '500+',
    statLabel: 'resumes',
    retention: '97',
    retentionLabel: 'success rate',
    retentionDesc: 'Clients who got interviews within 2 weeks.',
    ctaPrimary: 'View Templates',
    ctaSecondary: 'Get Started',
    location: 'Based in India · Working worldwide',
  },
  home: {
    templatesEyebrow: '(Templates)',
    templatesTitle: 'Featured',
    templatesItalic: 'templates.',
    templatesLink: 'See All Templates',
    servicesEyebrow: '(Services)',
    servicesTitle: 'What we can do',
    servicesItalic: 'for you.',
    servicesLink: 'All services',
    storeEyebrow: '(Digital Store)',
    storeTitle: 'Digital',
    storeItalic: 'products.',
    storeLink: 'Browse Store',
  },
  testimonialsSection: {
    eyebrow: '(Testimonials)',
    title: 'Clients who',
    italic: 'got hired.',
  },
  cta: {
    eyebrow: "Let's build your career",
    title: 'Ready to',
    italic: 'stand out?',
    button: 'Order now',
  },
  footer: {
    tagline: 'Resume Designer · Career Coach · LinkedIn Expert. We build resumes that get you hired.',
    navigateLabel: 'Navigate',
    contactLabel: 'Contact',
    rights: 'All rights reserved.',
    location: 'Based in India · Working worldwide',
    adminLabel: 'Admin',
  },
  contact: {
    email: 'hello@ctresume.com',
    phone: '+91 00000 00000',
    phoneRaw: '910000000000',
    instagram: 'ct_resume',
    instagramUrl: 'https://instagram.com/ct_resume',
    linkedin: 'CT Resume',
    linkedinUrl: 'https://linkedin.com/',
  },
  payment: { upiId: 'your@upi', payeeName: 'CT Resume Core' },
  pages: {
    templates: {
      eyebrow: '(02) Templates',
      title: 'Professional',
      italic: 'templates.',
      description: 'ATS-friendly resume templates designed to get you past filters and in front of decision makers.',
    },
    services: {
      eyebrow: '(04) Services',
      title: 'What we',
      italic: 'offer.',
      description: 'From resume writing to LinkedIn optimization — everything you need to land your next role.',
    },
    store: {
      eyebrow: '(03) Store',
      title: 'Digital',
      italic: 'products.',
      description: 'Templates, cover letter packs, LinkedIn guides and more — download and use instantly.',
    },
    about: {
      eyebrow: '(01) About',
      title: 'Behind',
      italic: 'CT Resume.',
      description: 'We are a team of career coaches and designers helping professionals land their dream jobs.',
    },
  },
  about: {
    introEyebrow: 'Hey there 👋',
    introTitle: 'We are',
    introItalic: 'CT Resume Core',
    paragraphs: [
      'We are a dedicated team of **career designers** helping professionals craft resumes that get noticed.',
      'With **500+ successful resumes**, we know what hiring managers look for and how to make your application stand out.',
    ],
    stats: ['500+|Resumes', '97%|Success Rate', '10+|Templates', '24h|Delivery'],
    portraitImage: '/images/portrait.jpg',
    name: 'CT Resume Team',
    role: 'Career Designers',
    badge1: 'ATS Expert',
    badge2: '3+ yrs exp',
    metaLeft: 'India · Est. 2022',
    metaRight: 'Team of 5+',
  },
};

/* ── Theme Engine ── */
function hexToRgb(hex: string): [number, number, number] | null {
  const m = hex.replace('#', '');
  const s = m.length === 3 ? m.split('').map((c) => c + c).join('') : m;
  if (!/^[0-9a-fA-F]{6}$/.test(s)) return null;
  return [parseInt(s.slice(0, 2), 16), parseInt(s.slice(2, 4), 16), parseInt(s.slice(4, 6), 16)];
}

function isDark(hex: string) {
  const rgb = hexToRgb(hex);
  if (!rgb) return false;
  return (0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]) / 255 < 0.5;
}

export function applyTheme(theme: { color: string; textColor?: string; bgColor?: string; colors?: Partial<ExtendedColors> }) {
  const root = document.documentElement.style;
  const accent = theme.color || THEME_DEFAULTS.color;
  const text = theme.textColor || THEME_DEFAULTS.textColor;
  const bg = theme.bgColor || THEME_DEFAULTS.bgColor;

  root.setProperty('--color-accent', accent);
  root.setProperty('--color-ink', text);
  root.setProperty('--color-cream', bg);

  const overrides = theme.colors || {};
  const defaults = STATIC_EXTENDED_DEFAULTS;

  const VAR_MAP: Record<ExtendedColorKey, string> = {
    text2: '--color-text2', muted: '--color-muted', heading: '--color-heading',
    navtext: '--color-navtext', btnbg: '--color-btnbg', btntext: '--color-btntext',
    btnhover: '--color-btnhover', card: '--color-card', cardborder: '--color-cardborder',
    cardshadow: '--color-cardshadow', bgalt: '--color-bgalt', darksec: '--color-darksec',
    lighttext: '--color-lighttext', footerbg: '--color-footerbg', footertext: '--color-footertext',
    inputbg: '--color-inputbg', inputborder: '--color-inputborder', inputtext: '--color-inputtext',
    badgebg: '--color-badgebg', badgetext: '--color-badgetext', overlay: '--color-overlay',
    gradstart: '--color-gradstart', gradend: '--color-gradend',
  };

  for (const key of EXTENDED_COLOR_KEYS) {
    const value = (overrides[key] || '').trim() || defaults[key];
    root.setProperty(VAR_MAP[key], value);
  }

  document.body.style.backgroundColor = bg;
  document.body.style.color = text;
}

export function deepMerge<T>(base: T, patch: unknown): T {
  if (patch === undefined || patch === null) return base;
  if (Array.isArray(base)) {
    if (Array.isArray(patch)) {
      return (patch.length > 0 ? patch : base) as T;
    }
    return base;
  }
  if (typeof base === 'object' && base !== null && typeof patch === 'object') {
    const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
    for (const k of Object.keys(base as object)) {
      out[k] = deepMerge((base as Record<string, unknown>)[k], (patch as Record<string, unknown>)[k]);
    }
    return out as T;
  }
  return (typeof patch === typeof base ? patch : base) as T;
}
