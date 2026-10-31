export const CONTACT = {
  email: 'contact@ctresumecore.com',
  phone: '+91 98765 43210',
  phoneRaw: '919876543210',
  instagram: 'ct_resume_core',
  instagramUrl: 'https://instagram.com/ct_resume_core',
  linkedin: 'ct-resume-core',
  linkedinUrl: 'https://linkedin.com/company/ct-resume-core',
  whatsapp: (msg: string) => `https://wa.me/919876543210?text=${encodeURIComponent(msg)}`,
  emailTo: (subject: string, body?: string) =>
    `mailto:contact@ctresumecore.com?subject=${encodeURIComponent(subject)}${body ? `&body=${encodeURIComponent(body)}` : ''}`,
};

export const PAYMENT = {
  upiId: 'ctresume@okhdfcbank',
  payeeName: 'CT RESUME CORE',
};

export function upiLink(amount: number, note: string, ref?: string) {
  const params = new URLSearchParams({
    pa: PAYMENT.upiId,
    pn: PAYMENT.payeeName,
    am: amount.toFixed(2),
    cu: 'INR',
    tn: note,
  });
  if (ref) params.set('tr', ref);
  return `upi://pay?${params.toString()}`;
}

export function parsePrice(price?: string): number | null {
  if (!price || /free/i.test(price)) return null;
  const cleaned = price.replace(/[^\d.]/g, '');
  const n = Number(cleaned);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  long_description?: string;
  price?: string;
  image?: string;
  external_link?: string;
  client?: string;
  year?: string;
  featured?: boolean;
  sort_order?: number;
  display_size?: string;
  display_mode?: string;
  custom_aspect?: string;
  custom_width?: number | null;
  custom_height?: number | null;
  col_span?: number;
  row_span?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  extras?: any;
  status?: string;
  publish_at?: string | null;
  views?: number;
  clicks?: number;
  plays?: number;
  downloads?: number;
}

export interface Product {
  id: number;
  title: string;
  category: string;
  description: string;
  long_description?: string;
  type: 'free' | 'paid';
  price: string;
  original_price?: string;
  image?: string;
  download_link?: string;
  tags?: string[];
  file_info?: string;
  badge?: string;
  featured?: boolean;
  sort_order?: number;
}

export interface Service {
  id: number;
  title: string;
  description: string;
  starting: string;
  features: string[];
  accent: string;
  delivery_time: string;
  sort_order?: number;
}

export interface Testimonial {
  id: number;
  quote: string;
  name: string;
  role: string;
  initials: string;
  rating: number;
  highlighted?: boolean;
  sort_order?: number;
}

export const WORK_CATEGORIES = [
  'All',
  'Executive Resumes',
  'Tech & Software Engineering',
  'Product & Design CVs',
  'Finance & Consulting',
  'Freshers & Campus Placement',
  'Cover Letters',
  'LinkedIn Banner & Profile',
  'Academic CVs',
];

export const STORE_CATEGORIES = [
  'All',
  'ATS Resume Templates',
  'Modern CV Formats',
  'Cover Letter Bundles',
  'Interview Prep Guides',
  'Action Verb Cheat Sheets',
  'Portfolio One-Pagers',
  'Cold Email Kits',
];
