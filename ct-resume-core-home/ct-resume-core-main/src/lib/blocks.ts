/* ─────────────────────────────────────────────────────────────────────────────
   CT Resume Core — Visual Page & Block System
   Supports rich Word/Canva-style layouts, flexible images, custom buttons & links.
───────────────────────────────────────────────────────────────────────────── */

export interface Block {
  id: string;
  type: string;
  hidden?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: Record<string, any>;
}

export interface PageHero {
  enabled?: boolean;
  eyebrow?: string;
  title?: string;
  italic?: string;
  description?: string;
  image?: string;
}

export interface CustomPageData {
  id: number | string;
  slug: string;
  title: string;
  seo_title?: string;
  meta_description?: string;
  icon?: string;
  hero: PageHero;
  blocks: Block[];
  status: 'published' | 'draft';
  visibility: 'public' | 'unlisted';
  sort_order?: number;
}

export interface CustomNavItem {
  id: string;
  label: string;
  url: string;
  icon?: string;
  badge?: string;
  badgeColor?: string;
  newTab?: boolean;
  visible?: boolean;
  dropdown?: { label: string; url: string }[];
}

export const uid = () => Math.random().toString(36).slice(2, 10);

export interface BlockDef {
  type: string;
  label: string;
  emoji: string;
  group: 'Text & Context' | 'Media & Canvas' | 'Buttons & Links' | 'Structure & Cards';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaults: Record<string, any>;
}

export const BLOCK_LIBRARY: BlockDef[] = [
  // ── Text & Context ──
  {
    type: 'heading',
    label: 'Heading Title',
    emoji: '🔤',
    group: 'Text & Context',
    defaults: { text: 'Crafting Your Career Story', italic: 'with impact.', size: 'lg', align: 'left' },
  },
  {
    type: 'context',
    label: 'Text & Context Block',
    emoji: '📝',
    group: 'Text & Context',
    defaults: {
      text: 'Write detailed background, instructions, or article context here. Supports **bold text**, bullet points, and clean paragraphs like a Word document.',
      align: 'left',
      fontSize: 'base',
    },
  },
  {
    type: 'divider',
    label: 'Divider Line',
    emoji: '➖',
    group: 'Text & Context',
    defaults: { style: 'line', spacing: 40 },
  },

  // ── Media & Canvas (Word/Canva style) ──
  {
    type: 'image',
    label: 'Image Canvas (Word/Canva)',
    emoji: '🖼',
    group: 'Media & Canvas',
    defaults: {
      src: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&auto=format&fit=crop&q=80',
      alt: 'Resume preview',
      caption: 'ATS-Optimized Executive Format',
      width: '100%', // 25%, 33%, 50%, 75%, 100%, custom
      alignment: 'center', // left, center, right, float-left, float-right (Word style wrap)
      aspectRatio: '16/9', // original, 16/9, 4/3, 1/1, custom
      borderRadius: '24px', // 0px, 12px, 24px, 9999px
      shadow: 'md', // none, sm, md, lg, 2xl
      linkUrl: '', // Open link on click
      newTab: true,
    },
  },
  {
    type: 'gallery',
    label: 'Image Grid / Collage',
    emoji: '🏞',
    group: 'Media & Canvas',
    defaults: {
      columns: 3,
      gap: 16,
      images: [
        { src: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=500&auto=format&fit=crop&q=80', title: 'Modern Clean' },
        { src: 'https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?w=500&auto=format&fit=crop&q=80', title: 'Tech Leadership' },
        { src: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=500&auto=format&fit=crop&q=80', title: 'Consulting CV' },
      ],
    },
  },

  // ── Buttons & Links ──
  {
    type: 'button',
    label: 'Single Button',
    emoji: '🔘',
    group: 'Buttons & Links',
    defaults: {
      label: 'Get Your Resume Built',
      url: '/services',
      style: 'primary', // primary, secondary, outline, flame
      size: 'md', // sm, md, lg
      align: 'left', // left, center, right
      icon: 'arrow', // arrow, download, external, message
      newTab: false,
      enabled: true, // Button toggle on/off
    },
  },
  {
    type: 'button-group',
    label: 'Button Section (Multiple)',
    emoji: '🎛',
    group: 'Buttons & Links',
    defaults: {
      align: 'center',
      buttons: [
        { id: uid(), label: 'Book 1-on-1 Consultation', url: '/services', style: 'primary', icon: 'arrow', enabled: true, newTab: false },
        { id: uid(), label: 'Download ATS Sample', url: '/store', style: 'secondary', icon: 'download', enabled: true, newTab: false },
        { id: uid(), label: 'Chat on WhatsApp', url: 'https://wa.me/919876543210', style: 'outline', icon: 'message', enabled: true, newTab: true },
      ],
    },
  },
  {
    type: 'link-box',
    label: 'Clickable Link Card',
    emoji: '🔗',
    group: 'Buttons & Links',
    defaults: {
      title: 'Free ATS Keyword Scanner',
      description: 'Upload your draft resume to verify readability against major ATS filters before submitting.',
      url: 'https://example.com/ats-scan',
      badge: 'RECOMMENDED',
      icon: '🚀',
      newTab: true,
      enabled: true,
    },
  },

  // ── Structure & Cards ──
  {
    type: 'feature-cards',
    label: 'Feature Cards Grid',
    emoji: '💠',
    group: 'Structure & Cards',
    defaults: {
      columns: 3,
      items: [
        { icon: '🎯', title: 'ATS Keyword Optimized', text: 'Scored for Workday, Taleo, Greenhouse & Lever algorithms.' },
        { icon: '⚡', title: '24-48 Hour Turnaround', text: 'Fast delivery with comprehensive revision rounds included.' },
        { icon: '💼', title: 'Executive Impact Metrics', text: 'Transform simple job duties into quantifiable achievement stories.' },
      ],
    },
  },
  {
    type: 'faq',
    label: 'FAQ Accordion',
    emoji: '❓',
    group: 'Structure & Cards',
    defaults: {
      items: [
        { q: 'Will this resume pass through ATS systems?', a: 'Yes! All our templates are structured strictly adhering to single-column and dual-column ATS readability rules.' },
        { q: 'What format will I receive?', a: 'You receive fully editable Word (.docx) and print-ready PDF files.' },
      ],
    },
  },
];

export function makeBlock(type: string): Block {
  const def = BLOCK_LIBRARY.find((b) => b.type === type);
  return { id: uid(), type, hidden: false, props: JSON.parse(JSON.stringify(def?.defaults || {})) };
}

export const STARTER_TEMPLATES: { name: string; emoji: string; hero: PageHero; blocks: Block[] }[] = [
  {
    name: 'Executive Career Landing Page',
    emoji: '💼',
    hero: {
      enabled: true,
      eyebrow: '(Specialized)',
      title: 'Executive Resume',
      italic: 'Architecture.',
      description: 'Engineered for Directors, VPs, and Founders ready to accelerate their next big career transition.',
    },
    blocks: [
      makeBlock('image'),
      makeBlock('context'),
      makeBlock('button-group'),
      makeBlock('feature-cards'),
      makeBlock('link-box'),
      makeBlock('faq'),
    ],
  },
  {
    name: 'Resource & Download Guide',
    emoji: '📥',
    hero: {
      enabled: true,
      eyebrow: '(Toolkit)',
      title: 'Resume & Interview',
      italic: 'Master Kit.',
      description: 'Essential guides, ATS action verbs, and cover letter frameworks ready for instant access.',
    },
    blocks: [
      makeBlock('link-box'),
      makeBlock('image'),
      makeBlock('context'),
      makeBlock('button-group'),
    ],
  },
  {
    name: 'Blank Canvas Page',
    emoji: '📄',
    hero: { enabled: true, title: 'New Custom Page', italic: '', eyebrow: '(Custom)', description: 'Build your custom layout using blocks.' },
    blocks: [makeBlock('heading'), makeBlock('context'), makeBlock('image'), makeBlock('button-group')],
  },
];

export const DEFAULT_PAGES: CustomPageData[] = [
  {
    id: 'demo-page-1',
    slug: 'executive-kit',
    title: 'Executive Resume Architecture Kit',
    status: 'published',
    visibility: 'public',
    hero: {
      enabled: true,
      eyebrow: '(Specialized Offer)',
      title: 'Executive Career',
      italic: 'Framework.',
      description: 'A complete framework for modern directors and senior leaders looking to rebrand their resume and online authority.',
    },
    blocks: [
      {
        id: 'b1',
        type: 'image',
        hidden: false,
        props: {
          src: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1000&auto=format&fit=crop&q=80',
          caption: 'Word-compatible ATS Executive Format Preview',
          width: '85%',
          alignment: 'center',
          borderRadius: '24px',
          shadow: 'lg',
          linkUrl: 'https://wa.me/919876543210',
          newTab: true,
        },
      },
      {
        id: 'b2',
        type: 'context',
        hidden: false,
        props: {
          text: 'Modern executive recruiting has shifted dramatically. **Over 98% of Fortune 500 companies utilize automated ATS filters** before any human recruiter views your resume.\n\nOur format uses **quantified achievement formulas** (X achieved by Y doing Z) that maximize keyword indexing without compromising visual layout.',
          align: 'left',
        },
      },
      {
        id: 'b3',
        type: 'button-group',
        hidden: false,
        props: {
          align: 'center',
          buttons: [
            { id: 'btn-1', label: 'Order This Architecture Package', url: '/services', style: 'flame', icon: 'arrow', enabled: true, newTab: false },
            { id: 'btn-2', label: 'Download Word Sample (.docx)', url: '/store', style: 'secondary', icon: 'download', enabled: true, newTab: false },
          ],
        },
      },
      {
        id: 'b4',
        type: 'link-box',
        hidden: false,
        props: {
          title: 'Direct WhatsApp Review with Lead Coach',
          description: 'Send us your current PDF resume directly for an instant 10-point audit via WhatsApp message.',
          url: 'https://wa.me/919876543210?text=Hi! Please audit my executive resume.',
          badge: 'FAST 24H',
          icon: '💬',
          newTab: true,
          enabled: true,
        },
      },
    ],
  },
];
