import { useState, useEffect } from 'react';
import {
  Plus,
  Trash2,
  ExternalLink,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
  Copy,
  Layers,
  Menu,
  FilePlus,
  Image as ImageIcon,
  Type,
  MousePointerClick,
  Link as LinkIcon,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import {
  type CustomPageData,
  type Block,
  type CustomNavItem,
  uid,
  BLOCK_LIBRARY,
  makeBlock,
  STARTER_TEMPLATES,
  DEFAULT_PAGES,
} from '../../lib/blocks';
import { type SiteContent, DEFAULT_NAV_ITEMS } from '../../lib/content';
import BlockRenderer from '../../components/BlockRenderer';

const LOCAL_PAGES_KEY = 'ct_resume_custom_pages';

const INITIAL_PAGES: CustomPageData[] = DEFAULT_PAGES;

interface PageBuilderTabProps {
  draft: SiteContent;
  setDraft: (updater: (prev: SiteContent) => SiteContent) => void;
}

export default function PageBuilderTab({ draft, setDraft }: PageBuilderTabProps) {
  const [subTab, setSubTab] = useState<'pages' | 'navbar'>('pages');

  // Pages state
  const [pages, setPages] = useState<CustomPageData[]>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_PAGES_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return INITIAL_PAGES;
  });

  const [activePageId, setActivePageId] = useState<string | number>(INITIAL_PAGES[0].id);
  const [previewMode, setPreviewMode] = useState(false);
  const [showAddBlockModal, setShowAddBlockModal] = useState(false);

  // Sync pages to localStorage
  const savePages = (nextPages: CustomPageData[]) => {
    setPages(nextPages);
    try {
      localStorage.setItem(LOCAL_PAGES_KEY, JSON.stringify(nextPages));
    } catch {
      // ignore
    }
  };

  const activePage = pages.find((p) => p.id === activePageId) || pages[0];

  const updateActivePage = (updater: (prev: CustomPageData) => CustomPageData) => {
    if (!activePage) return;
    const updated = updater(activePage);
    const nextList = pages.map((p) => (p.id === activePage.id ? updated : p));
    savePages(nextList);
  };

  // Add new custom page
  const handleCreatePage = (templateIndex = 0) => {
    const tpl = STARTER_TEMPLATES[templateIndex] || STARTER_TEMPLATES[0];
    const newId = `page-${Date.now()}`;
    const newSlug = `new-section-${Math.floor(Math.random() * 900 + 100)}`;
    const newPage: CustomPageData = {
      id: newId,
      slug: newSlug,
      title: tpl.name,
      status: 'published',
      visibility: 'public',
      hero: { ...tpl.hero, title: tpl.hero.title || tpl.name },
      blocks: tpl.blocks.map((b) => ({ ...b, id: uid() })),
    };
    const nextList = [newPage, ...pages];
    savePages(nextList);
    setActivePageId(newId);
  };

  const handleDeletePage = (pageId: string | number) => {
    if (pages.length <= 1) {
      alert('You must keep at least one page.');
      return;
    }
    if (confirm('Are you sure you want to delete this custom page?')) {
      const nextList = pages.filter((p) => p.id !== pageId);
      savePages(nextList);
      setActivePageId(nextList[0].id);
    }
  };

  // Add block to active page
  const handleAddBlock = (type: string) => {
    const newBlock = makeBlock(type);
    updateActivePage((prev) => ({
      ...prev,
      blocks: [...(prev.blocks || []), newBlock],
    }));
    setShowAddBlockModal(false);
  };

  // Reorder blocks
  const moveBlock = (index: number, direction: 'up' | 'down') => {
    if (!activePage) return;
    const blocks = [...activePage.blocks];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= blocks.length) return;
    const temp = blocks[index];
    blocks[index] = blocks[targetIdx];
    blocks[targetIdx] = temp;
    updateActivePage((prev) => ({ ...prev, blocks }));
  };

  const deleteBlock = (blockId: string) => {
    updateActivePage((prev) => ({
      ...prev,
      blocks: prev.blocks.filter((b) => b.id !== blockId),
    }));
  };

  // ── Navbar Builder helpers (Default Core Links + Custom Links) ──
  const navItems: CustomNavItem[] =
    draft.customNav?.items && draft.customNav.items.length > 0
      ? draft.customNav.items
      : DEFAULT_NAV_ITEMS;

  const addNavbarItem = (item?: Partial<CustomNavItem>) => {
    const newItem: CustomNavItem = {
      id: uid(),
      label: item?.label || 'New Link',
      url: item?.url || '/services',
      icon: item?.icon || '',
      badge: item?.badge || '',
      badgeColor: '#2563eb',
      newTab: item?.newTab || false,
      visible: true,
    };
    setDraft((prev) => ({
      ...prev,
      customNav: {
        ...prev.customNav,
        enabled: true,
        items: [...navItems, newItem],
      },
    }));
  };

  const updateNavbarItem = (id: string, patch: Partial<CustomNavItem>) => {
    const nextItems = navItems.map((i) => (i.id === id ? { ...i, ...patch } : i));
    setDraft((prev) => ({
      ...prev,
      customNav: {
        ...prev.customNav,
        enabled: true,
        items: nextItems,
      },
    }));
  };

  const moveNavbarItem = (index: number, direction: 'up' | 'down') => {
    const items = [...navItems];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= items.length) return;
    const temp = items[index];
    items[index] = items[targetIdx];
    items[targetIdx] = temp;
    setDraft((prev) => ({
      ...prev,
      customNav: {
        ...prev.customNav,
        enabled: true,
        items,
      },
    }));
  };

  const deleteNavbarItem = (id: string) => {
    const nextItems = navItems.filter((i) => i.id !== id);
    setDraft((prev) => ({
      ...prev,
      customNav: {
        ...prev.customNav,
        enabled: true,
        items: nextItems,
      },
    }));
  };

  const resetNavbarToDefaults = () => {
    if (confirm('Reset navbar to standard links (Home, Templates, Services, Store, About)?')) {
      setDraft((prev) => ({
        ...prev,
        customNav: {
          ...prev.customNav,
          enabled: true,
          items: [...DEFAULT_NAV_ITEMS],
        },
      }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub tabs Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-ink/10">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setSubTab('pages')}
            className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-semibold transition-all ${
              subTab === 'pages'
                ? 'bg-flame text-white shadow-md'
                : 'bg-card border border-ink/15 text-ink hover:border-ink/40'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Visual Page & Section Builder</span>
          </button>
          <button
            type="button"
            onClick={() => setSubTab('navbar')}
            className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-semibold transition-all ${
              subTab === 'navbar'
                ? 'bg-flame text-white shadow-md'
                : 'bg-card border border-ink/15 text-ink hover:border-ink/40'
            }`}
          >
            <Menu className="h-3.5 w-3.5" />
            <span>🧭 Navbar Links Builder ({navItems.length})</span>
          </button>
        </div>

        {subTab === 'pages' && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPreviewMode(!previewMode)}
              className="inline-flex items-center gap-1.5 rounded-full border border-ink/20 px-3.5 py-1.5 text-xs font-medium hover:bg-ink/5"
            >
              {previewMode ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              <span>{previewMode ? 'Exit Live Preview' : 'Live Preview'}</span>
            </button>
            <button
              type="button"
              onClick={() => handleCreatePage(0)}
              className="inline-flex items-center gap-1.5 rounded-full bg-btnbg text-btntext px-4 py-1.5 text-xs font-medium hover:bg-btnhover shadow-sm"
            >
              <FilePlus className="h-3.5 w-3.5" />
              <span>Create New Page / Section</span>
            </button>
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          NAVBAR BUILDER SUB-TAB
      ───────────────────────────────────────────────────────────── */}
      {subTab === 'navbar' && (
        <div className="rounded-3xl border border-cardborder bg-card p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-ink/10">
            <div>
              <h2 className="font-[var(--font-display)] text-xl font-bold text-heading">
                🧭 Master Navbar Links & Toggle Controls
              </h2>
              <p className="mt-1 text-xs text-muted">
                Customize all navbar links (including default Home, Templates, Services, Store, About) + add new custom pages/links with full ON/OFF toggle control.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={resetNavbarToDefaults}
                className="inline-flex items-center gap-1.5 rounded-full border border-ink/20 px-3.5 py-1.5 text-xs font-medium hover:bg-ink/5 transition-colors"
                title="Reset navbar to original default links"
              >
                <span>Reset to Defaults</span>
              </button>
              <button
                type="button"
                onClick={() => addNavbarItem()}
                className="inline-flex items-center gap-1.5 rounded-full bg-btnbg text-btntext px-4 py-1.5 text-xs font-semibold hover:bg-btnhover shadow-sm"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Navbar Link</span>
              </button>
            </div>
          </div>

          {/* Quick link existing custom pages to navbar */}
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200">
            <span className="text-xs font-semibold text-blue-900 block mb-2">
              ⚡ 1-Click: Add Created Custom Page to Navbar
            </span>
            <div className="flex flex-wrap gap-2">
              {pages.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() =>
                    addNavbarItem({
                      label: p.title,
                      url: `/${p.slug}`,
                      icon: p.icon || '📄',
                      badge: 'NEW',
                      badgeColor: '#2563eb',
                      newTab: false,
                    })
                  }
                  className="inline-flex items-center gap-1.5 rounded-full bg-white border border-blue-300 px-3 py-1 text-xs font-medium text-blue-800 hover:bg-blue-600 hover:text-white transition-colors shadow-xs"
                >
                  <Plus className="h-3 w-3" />
                  <span>
                    {p.title} (/{p.slug})
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Nav Items List */}
          <div className="space-y-4">
            {navItems.length === 0 ? (
              <div className="text-center py-8 text-muted text-xs border border-dashed rounded-2xl">
                No navbar links active. Click "Reset to Defaults" or "Add Navbar Link" to configure!
              </div>
            ) : (
              navItems.map((item, idx) => {
                const isCore = ['/', '/templates', '/services', '/store', '/about'].includes(item.url);
                const isVisible = item.visible !== false;

                return (
                  <div
                    key={item.id}
                    className={`p-5 rounded-2xl border transition-all ${
                      isVisible
                        ? 'bg-cream/70 border-ink/10'
                        : 'bg-gray-100/70 border-gray-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-ink/5 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-muted bg-white border border-ink/10 rounded-md px-2 py-0.5">
                          #{idx + 1}
                        </span>
                        <span className="text-xs font-bold text-heading">
                          {item.label || 'Untitled Link'}
                        </span>
                        {isCore && (
                          <span className="text-[10px] bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded-full">
                            Core Default
                          </span>
                        )}
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isVisible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {isVisible ? '● VISIBLE IN NAVBAR' : '○ HIDDEN (TOGGLED OFF)'}
                        </span>
                      </div>

                      {/* Reorder and Delete */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => moveNavbarItem(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1 hover:bg-ink/5 rounded disabled:opacity-30"
                          title="Move Up"
                        >
                          <ChevronUp className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveNavbarItem(idx, 'down')}
                          disabled={idx === navItems.length - 1}
                          className="p-1 hover:bg-ink/5 rounded disabled:opacity-30"
                          title="Move Down"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteNavbarItem(item.id)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded ml-1"
                          title="Delete navbar link"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <div>
                        <label className="text-[10px] font-[var(--font-mono)] uppercase text-muted block mb-1">
                          Link Label
                        </label>
                        <input
                          type="text"
                          value={item.label}
                          onChange={(e) => updateNavbarItem(item.id, { label: e.target.value })}
                          className="w-full rounded-xl border border-inputborder bg-white px-3 py-1.5 text-xs font-semibold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-[var(--font-mono)] uppercase text-muted block mb-1">
                          Target URL / Slug
                        </label>
                        <input
                          type="text"
                          value={item.url}
                          onChange={(e) => updateNavbarItem(item.id, { url: e.target.value })}
                          placeholder="/page-slug or https://..."
                          className="w-full rounded-xl border border-inputborder bg-white px-3 py-1.5 text-xs font-[var(--font-mono)]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-[var(--font-mono)] uppercase text-muted block mb-1">
                          Badge (Optional)
                        </label>
                        <input
                          type="text"
                          value={item.badge || ''}
                          onChange={(e) => updateNavbarItem(item.id, { badge: e.target.value })}
                          placeholder="NEW, HOT, FREE"
                          className="w-full rounded-xl border border-inputborder bg-white px-3 py-1.5 text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-[var(--font-mono)] uppercase text-muted block mb-1">
                          Emoji Icon (Optional)
                        </label>
                        <input
                          type="text"
                          value={item.icon || ''}
                          onChange={(e) => updateNavbarItem(item.id, { icon: e.target.value })}
                          placeholder="📄, 💼, 🛒"
                          className="w-full rounded-xl border border-inputborder bg-white px-3 py-1.5 text-xs"
                        />
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-ink/5 flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-1.5 text-xs font-medium text-ink/80 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={item.newTab || false}
                            onChange={(e) => updateNavbarItem(item.id, { newTab: e.target.checked })}
                            className="rounded text-flame"
                          />
                          <span>Open in New Tab</span>
                        </label>
                      </div>

                      {/* Main ON / OFF Toggle Switch */}
                      <label className="relative inline-flex items-center cursor-pointer gap-2">
                        <span className="text-xs font-bold text-heading">
                          {isVisible ? 'Navbar Status: ON' : 'Navbar Status: OFF'}
                        </span>
                        <input
                          type="checkbox"
                          checked={isVisible}
                          onChange={(e) => updateNavbarItem(item.id, { visible: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-flame"></div>
                      </label>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          PAGE & SECTION BUILDER SUB-TAB
      ───────────────────────────────────────────────────────────── */}
      {subTab === 'pages' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Pages List */}
          <div className="lg:col-span-4 rounded-3xl border border-cardborder bg-card p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-ink/10">
              <span className="text-xs font-[var(--font-mono)] uppercase tracking-wider text-muted font-semibold">
                Custom Pages ({pages.length})
              </span>
            </div>

            <div className="space-y-2">
              {pages.map((p) => {
                const isActive = p.id === activePageId;
                return (
                  <div
                    key={p.id}
                    onClick={() => setActivePageId(p.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                      isActive
                        ? 'bg-blue-50/80 border-blue-400 shadow-xs'
                        : 'bg-cream/40 border-ink/10 hover:border-ink/30'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-xs text-heading truncate">{p.title}</div>
                      <div className="text-[11px] text-flame font-[var(--font-mono)] truncate">/{p.slug}</div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <a
                        href={`/${p.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 text-muted hover:text-flame transition-colors"
                        title="Open live URL"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePage(p.id);
                        }}
                        className="p-1.5 text-muted hover:text-red-500 transition-colors"
                        title="Delete page"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Starter Template Shortcuts */}
            <div className="pt-3 border-t border-ink/10">
              <span className="text-[11px] text-muted font-medium block mb-2">Create From Template:</span>
              <div className="grid grid-cols-1 gap-1.5">
                {STARTER_TEMPLATES.map((t, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleCreatePage(idx)}
                    className="w-full text-left p-2 rounded-xl border border-ink/10 bg-white hover:bg-blue-50 text-xs font-medium flex items-center gap-2"
                  >
                    <span>{t.emoji}</span>
                    <span className="truncate">{t.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Page Content & Sections Editor */}
          <div className="lg:col-span-8 space-y-6">
            {activePage && (
              <>
                {/* Page Details Card */}
                <div className="rounded-3xl border border-cardborder bg-card p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-ink/10">
                    <h3 className="font-[var(--font-display)] text-lg font-bold text-heading">
                      Page Settings: {activePage.title}
                    </h3>
                    <a
                      href={`/${activePage.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-flame font-medium hover:underline"
                    >
                      <span>View Live: /{activePage.slug}</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-[var(--font-mono)] uppercase text-muted block mb-1">
                        Page Title
                      </label>
                      <input
                        type="text"
                        value={activePage.title}
                        onChange={(e) => updateActivePage((p) => ({ ...p, title: e.target.value }))}
                        className="w-full rounded-2xl border border-inputborder bg-inputbg px-4 py-2 text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-[var(--font-mono)] uppercase text-muted block mb-1">
                        URL Slug (Path)
                      </label>
                      <input
                        type="text"
                        value={activePage.slug}
                        onChange={(e) =>
                          updateActivePage((p) => ({
                            ...p,
                            slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''),
                          }))
                        }
                        className="w-full rounded-2xl border border-inputborder bg-inputbg px-4 py-2 text-xs font-[var(--font-mono)] text-flame"
                      />
                    </div>
                  </div>
                </div>

                {/* Live Preview Display (if toggled) */}
                {previewMode && (
                  <div className="rounded-3xl border-2 border-flame/30 bg-cream p-6 md:p-8 shadow-inner">
                    <div className="text-xs font-[var(--font-mono)] uppercase tracking-widest text-flame font-bold mb-4">
                      👁️ Real-Time Live Preview
                    </div>
                    <div className="space-y-4">
                      {activePage.blocks.map((b) => (
                        <BlockRenderer key={b.id} block={b} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Blocks / Sections Stack */}
                <div className="rounded-3xl border border-cardborder bg-card p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-ink/10">
                    <div>
                      <h4 className="font-[var(--font-display)] text-base font-bold text-heading">
                        Page Sections & Visual Elements ({activePage.blocks.length})
                      </h4>
                      <p className="text-xs text-muted">
                        Configure images like Word doc / Canva, write context, and add buttons with link actions.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowAddBlockModal(true)}
                      className="inline-flex items-center gap-1.5 rounded-full bg-flame text-white px-4 py-2 text-xs font-semibold hover:brightness-110 shadow-sm"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add Section / Block</span>
                    </button>
                  </div>

                  {/* Block Items Editor List */}
                  <div className="space-y-4">
                    {activePage.blocks.map((block, idx) => {
                      const bp = block.props || {};

                      return (
                        <div
                          key={block.id}
                          className="p-5 rounded-2xl border border-ink/10 bg-cream/50 space-y-3 relative group"
                        >
                          <div className="flex items-center justify-between pb-2 border-b border-ink/5">
                            <span className="text-xs font-bold font-[var(--font-mono)] text-heading uppercase flex items-center gap-2">
                              <span className="h-5 w-5 rounded-lg bg-flame/10 text-flame flex items-center justify-center text-xs">
                                {idx + 1}
                              </span>
                              <span>{block.type.toUpperCase()} SECTION</span>
                            </span>

                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => moveBlock(idx, 'up')}
                                disabled={idx === 0}
                                className="p-1 hover:bg-ink/5 rounded disabled:opacity-30"
                              >
                                <ChevronUp className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => moveBlock(idx, 'down')}
                                disabled={idx === activePage.blocks.length - 1}
                                className="p-1 hover:bg-ink/5 rounded disabled:opacity-30"
                              >
                                <ChevronDown className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteBlock(block.id)}
                                className="p-1 text-red-500 hover:bg-red-50 rounded"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>

                          {/* Specific Editor based on block type */}
                          {/* 1. IMAGE EDITOR (Word / Canva style) */}
                          {block.type === 'image' && (
                            <div className="space-y-3 text-xs">
                              <div>
                                <label className="text-muted block mb-1 font-medium">Image URL</label>
                                <input
                                  type="text"
                                  value={bp.src || ''}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    updateActivePage((prev) => {
                                      const bks = [...prev.blocks];
                                      bks[idx].props = { ...bks[idx].props, src: val };
                                      return { ...prev, blocks: bks };
                                    });
                                  }}
                                  className="w-full rounded-xl border border-inputborder bg-white px-3 py-1.5 font-[var(--font-mono)]"
                                />
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div>
                                  <label className="text-muted block mb-1 font-medium">
                                    Alignment (Word Layout)
                                  </label>
                                  <select
                                    value={bp.alignment || 'center'}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      updateActivePage((prev) => {
                                        const bks = [...prev.blocks];
                                        bks[idx].props = { ...bks[idx].props, alignment: val };
                                        return { ...prev, blocks: bks };
                                      });
                                    }}
                                    className="w-full rounded-xl border border-inputborder bg-white px-2.5 py-1.5"
                                  >
                                    <option value="center">Center Block</option>
                                    <option value="left">Left Aligned</option>
                                    <option value="right">Right Aligned</option>
                                    <option value="float-left">Float Left (Wrap Text around)</option>
                                    <option value="float-right">Float Right (Wrap Text around)</option>
                                  </select>
                                </div>

                                <div>
                                  <label className="text-muted block mb-1 font-medium">Width Size</label>
                                  <select
                                    value={bp.width || '100%'}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      updateActivePage((prev) => {
                                        const bks = [...prev.blocks];
                                        bks[idx].props = { ...bks[idx].props, width: val };
                                        return { ...prev, blocks: bks };
                                      });
                                    }}
                                    className="w-full rounded-xl border border-inputborder bg-white px-2.5 py-1.5"
                                  >
                                    <option value="100%">100% Full Width</option>
                                    <option value="75%">75% Large</option>
                                    <option value="50%">50% Half Width</option>
                                    <option value="33%">33% Column</option>
                                    <option value="25%">25% Compact</option>
                                  </select>
                                </div>

                                <div>
                                  <label className="text-muted block mb-1 font-medium">Corner Radius</label>
                                  <select
                                    value={bp.borderRadius || '24px'}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      updateActivePage((prev) => {
                                        const bks = [...prev.blocks];
                                        bks[idx].props = { ...bks[idx].props, borderRadius: val };
                                        return { ...prev, blocks: bks };
                                      });
                                    }}
                                    className="w-full rounded-xl border border-inputborder bg-white px-2.5 py-1.5"
                                  >
                                    <option value="24px">Curved (24px)</option>
                                    <option value="12px">Soft Rounded (12px)</option>
                                    <option value="0px">Sharp Square (0px)</option>
                                    <option value="9999px">Pill / Circle</option>
                                  </select>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                  <label className="text-muted block mb-1 font-medium">
                                    Clickable Link URL (Optional)
                                  </label>
                                  <input
                                    type="text"
                                    value={bp.linkUrl || ''}
                                    placeholder="https://... or /services"
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      updateActivePage((prev) => {
                                        const bks = [...prev.blocks];
                                        bks[idx].props = { ...bks[idx].props, linkUrl: val };
                                        return { ...prev, blocks: bks };
                                      });
                                    }}
                                    className="w-full rounded-xl border border-inputborder bg-white px-3 py-1.5"
                                  />
                                </div>
                                <div>
                                  <label className="text-muted block mb-1 font-medium">Caption Label</label>
                                  <input
                                    type="text"
                                    value={bp.caption || ''}
                                    placeholder="e.g. ATS-Compliant Layout"
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      updateActivePage((prev) => {
                                        const bks = [...prev.blocks];
                                        bks[idx].props = { ...bks[idx].props, caption: val };
                                        return { ...prev, blocks: bks };
                                      });
                                    }}
                                    className="w-full rounded-xl border border-inputborder bg-white px-3 py-1.5"
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          {/* 2. CONTEXT & TEXT EDITOR (Word Doc style) */}
                          {block.type === 'context' && (
                            <div className="space-y-2 text-xs">
                              <label className="text-muted block font-medium">
                                Context Content (Use **bold** for emphasis, paragraphs will format cleanly)
                              </label>
                              <textarea
                                rows={4}
                                value={bp.text || ''}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  updateActivePage((prev) => {
                                    const bks = [...prev.blocks];
                                    bks[idx].props = { ...bks[idx].props, text: val };
                                    return { ...prev, blocks: bks };
                                  });
                                }}
                                className="w-full rounded-xl border border-inputborder bg-white p-3 text-xs leading-relaxed"
                              />
                            </div>
                          )}

                          {/* 3. BUTTONS SECTION EDITOR (With Button Toggles!) */}
                          {block.type === 'button-group' && (
                            <div className="space-y-3 text-xs">
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-heading">Button Items & Toggles</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    updateActivePage((prev) => {
                                      const bks = [...prev.blocks];
                                      const curBtns = bks[idx].props.buttons || [];
                                      bks[idx].props.buttons = [
                                        ...curBtns,
                                        {
                                          id: uid(),
                                          label: 'New Button',
                                          url: '/services',
                                          style: 'primary',
                                          icon: 'arrow',
                                          enabled: true,
                                          newTab: false,
                                        },
                                      ];
                                      return { ...prev, blocks: bks };
                                    });
                                  }}
                                  className="text-[11px] text-flame font-semibold hover:underline flex items-center gap-1"
                                >
                                  <Plus className="h-3 w-3" />
                                  <span>Add Button</span>
                                </button>
                              </div>

                              <div className="space-y-2">
                                {(bp.buttons || []).map((b: { id: string; label: string; url: string; enabled?: boolean; style?: string }, bIdx: number) => (
                                  <div
                                    key={b.id}
                                    className="p-3 rounded-xl border border-ink/10 bg-white flex flex-wrap items-center justify-between gap-3"
                                  >
                                    <div className="flex items-center gap-2 flex-1">
                                      <input
                                        type="text"
                                        value={b.label}
                                        onChange={(e) => {
                                          const val = e.target.value;
                                          updateActivePage((prev) => {
                                            const bks = [...prev.blocks];
                                            bks[idx].props.buttons[bIdx].label = val;
                                            return { ...prev, blocks: bks };
                                          });
                                        }}
                                        className="rounded-lg border px-2.5 py-1 text-xs font-semibold flex-1 min-w-[120px]"
                                      />
                                      <input
                                        type="text"
                                        value={b.url}
                                        onChange={(e) => {
                                          const val = e.target.value;
                                          updateActivePage((prev) => {
                                            const bks = [...prev.blocks];
                                            bks[idx].props.buttons[bIdx].url = val;
                                            return { ...prev, blocks: bks };
                                          });
                                        }}
                                        placeholder="URL / Link"
                                        className="rounded-lg border px-2.5 py-1 text-xs font-[var(--font-mono)] flex-1 min-w-[120px]"
                                      />
                                    </div>

                                    {/* Button ON / OFF Toggle */}
                                    <div className="flex items-center gap-3">
                                      <label className="flex items-center gap-1.5 cursor-pointer text-[11px] font-medium">
                                        <input
                                          type="checkbox"
                                          checked={b.enabled !== false}
                                          onChange={(e) => {
                                            const val = e.target.checked;
                                            updateActivePage((prev) => {
                                              const bks = [...prev.blocks];
                                              bks[idx].props.buttons[bIdx].enabled = val;
                                              return { ...prev, blocks: bks };
                                            });
                                          }}
                                          className="rounded text-flame"
                                        />
                                        <span>Toggle ON</span>
                                      </label>

                                      <button
                                        type="button"
                                        onClick={() => {
                                          updateActivePage((prev) => {
                                            const bks = [...prev.blocks];
                                            bks[idx].props.buttons = bks[idx].props.buttons.filter(
                                              (_: unknown, i: number) => i !== bIdx
                                            );
                                            return { ...prev, blocks: bks };
                                          });
                                        }}
                                        className="text-red-500 hover:bg-red-50 p-1 rounded"
                                      >
                                        <Trash2 className="h-3.5 w-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* 4. LINK BOX EDITOR */}
                          {block.type === 'link-box' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                              <div>
                                <label className="text-muted block mb-1 font-medium">Card Title</label>
                                <input
                                  type="text"
                                  value={bp.title || ''}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    updateActivePage((prev) => {
                                      const bks = [...prev.blocks];
                                      bks[idx].props = { ...bks[idx].props, title: val };
                                      return { ...prev, blocks: bks };
                                    });
                                  }}
                                  className="w-full rounded-xl border border-inputborder bg-white px-3 py-1.5"
                                />
                              </div>
                              <div>
                                <label className="text-muted block mb-1 font-medium">Destination URL</label>
                                <input
                                  type="text"
                                  value={bp.url || ''}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    updateActivePage((prev) => {
                                      const bks = [...prev.blocks];
                                      bks[idx].props = { ...bks[idx].props, url: val };
                                      return { ...prev, blocks: bks };
                                    });
                                  }}
                                  className="w-full rounded-xl border border-inputborder bg-white px-3 py-1.5 font-[var(--font-mono)]"
                                />
                              </div>
                              <div className="md:col-span-2">
                                <label className="text-muted block mb-1 font-medium">Description Context</label>
                                <input
                                  type="text"
                                  value={bp.description || ''}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    updateActivePage((prev) => {
                                      const bks = [...prev.blocks];
                                      bks[idx].props = { ...bks[idx].props, description: val };
                                      return { ...prev, blocks: bks };
                                    });
                                  }}
                                  className="w-full rounded-xl border border-inputborder bg-white px-3 py-1.5"
                                />
                              </div>
                            </div>
                          )}

                          {/* 5. HEADING EDITOR */}
                          {block.type === 'heading' && (
                            <div className="space-y-3 text-xs">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                  <label className="text-muted block mb-1 font-medium">Heading Text</label>
                                  <input
                                    type="text"
                                    value={bp.text || ''}
                                    placeholder="Main title text"
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      updateActivePage((prev) => {
                                        const bks = [...prev.blocks];
                                        bks[idx].props = { ...bks[idx].props, text: val };
                                        return { ...prev, blocks: bks };
                                      });
                                    }}
                                    className="w-full rounded-xl border border-inputborder bg-white px-3 py-1.5"
                                  />
                                </div>
                                <div>
                                  <label className="text-muted block mb-1 font-medium">Italic Accent (Colored)</label>
                                  <input
                                    type="text"
                                    value={bp.italic || ''}
                                    placeholder="Accent suffix"
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      updateActivePage((prev) => {
                                        const bks = [...prev.blocks];
                                        bks[idx].props = { ...bks[idx].props, italic: val };
                                        return { ...prev, blocks: bks };
                                      });
                                    }}
                                    className="w-full rounded-xl border border-inputborder bg-white px-3 py-1.5 text-flame"
                                  />
                                </div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                  <label className="text-muted block mb-1 font-medium">Heading Size</label>
                                  <select
                                    value={bp.size || 'lg'}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      updateActivePage((prev) => {
                                        const bks = [...prev.blocks];
                                        bks[idx].props = { ...bks[idx].props, size: val };
                                        return { ...prev, blocks: bks };
                                      });
                                    }}
                                    className="w-full rounded-xl border border-inputborder bg-white px-2.5 py-1.5"
                                  >
                                    <option value="sm">Small (H3)</option>
                                    <option value="md">Medium (H2)</option>
                                    <option value="lg">Large Hero (H1)</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="text-muted block mb-1 font-medium">Text Alignment</label>
                                  <select
                                    value={bp.align || 'left'}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      updateActivePage((prev) => {
                                        const bks = [...prev.blocks];
                                        bks[idx].props = { ...bks[idx].props, align: val };
                                        return { ...prev, blocks: bks };
                                      });
                                    }}
                                    className="w-full rounded-xl border border-inputborder bg-white px-2.5 py-1.5"
                                  >
                                    <option value="left">Left</option>
                                    <option value="center">Center</option>
                                    <option value="right">Right</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* 6. SINGLE BUTTON EDITOR */}
                          {block.type === 'button' && (
                            <div className="space-y-3 text-xs">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                  <label className="text-muted block mb-1 font-medium">Button Label</label>
                                  <input
                                    type="text"
                                    value={bp.label || ''}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      updateActivePage((prev) => {
                                        const bks = [...prev.blocks];
                                        bks[idx].props = { ...bks[idx].props, label: val };
                                        return { ...prev, blocks: bks };
                                      });
                                    }}
                                    className="w-full rounded-xl border border-inputborder bg-white px-3 py-1.5 font-semibold"
                                  />
                                </div>
                                <div>
                                  <label className="text-muted block mb-1 font-medium">Destination URL</label>
                                  <input
                                    type="text"
                                    value={bp.url || ''}
                                    placeholder="/services or https://..."
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      updateActivePage((prev) => {
                                        const bks = [...prev.blocks];
                                        bks[idx].props = { ...bks[idx].props, url: val };
                                        return { ...prev, blocks: bks };
                                      });
                                    }}
                                    className="w-full rounded-xl border border-inputborder bg-white px-3 py-1.5 font-[var(--font-mono)]"
                                  />
                                </div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div>
                                  <label className="text-muted block mb-1 font-medium">Style</label>
                                  <select
                                    value={bp.style || 'primary'}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      updateActivePage((prev) => {
                                        const bks = [...prev.blocks];
                                        bks[idx].props = { ...bks[idx].props, style: val };
                                        return { ...prev, blocks: bks };
                                      });
                                    }}
                                    className="w-full rounded-xl border border-inputborder bg-white px-2.5 py-1.5"
                                  >
                                    <option value="primary">Solid Primary (Dark)</option>
                                    <option value="flame">Flame / Accent Color</option>
                                    <option value="secondary">Soft Border</option>
                                    <option value="outline">Accent Outline</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="text-muted block mb-1 font-medium">Icon</label>
                                  <select
                                    value={bp.icon || 'arrow'}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      updateActivePage((prev) => {
                                        const bks = [...prev.blocks];
                                        bks[idx].props = { ...bks[idx].props, icon: val };
                                        return { ...prev, blocks: bks };
                                      });
                                    }}
                                    className="w-full rounded-xl border border-inputborder bg-white px-2.5 py-1.5"
                                  >
                                    <option value="arrow">Arrow (➔)</option>
                                    <option value="download">Download (📥)</option>
                                    <option value="message">Message / WhatsApp (💬)</option>
                                    <option value="external">External Link (↗)</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="text-muted block mb-1 font-medium">Alignment</label>
                                  <select
                                    value={bp.align || 'left'}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      updateActivePage((prev) => {
                                        const bks = [...prev.blocks];
                                        bks[idx].props = { ...bks[idx].props, align: val };
                                        return { ...prev, blocks: bks };
                                      });
                                    }}
                                    className="w-full rounded-xl border border-inputborder bg-white px-2.5 py-1.5"
                                  >
                                    <option value="left">Left</option>
                                    <option value="center">Center</option>
                                    <option value="right">Right</option>
                                  </select>
                                </div>
                              </div>
                              <div className="flex items-center gap-6 pt-2 border-t border-ink/5">
                                <label className="flex items-center gap-2 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={bp.newTab || false}
                                    onChange={(e) => {
                                      const val = e.target.checked;
                                      updateActivePage((prev) => {
                                        const bks = [...prev.blocks];
                                        bks[idx].props = { ...bks[idx].props, newTab: val };
                                        return { ...prev, blocks: bks };
                                      });
                                    }}
                                    className="rounded text-flame"
                                  />
                                  <span className="font-medium">Open in New Tab</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={bp.enabled !== false}
                                    onChange={(e) => {
                                      const val = e.target.checked;
                                      updateActivePage((prev) => {
                                        const bks = [...prev.blocks];
                                        bks[idx].props = { ...bks[idx].props, enabled: val };
                                        return { ...prev, blocks: bks };
                                      });
                                    }}
                                    className="rounded text-flame"
                                  />
                                  <span className="font-bold text-heading">Button Enabled (Toggle ON/OFF)</span>
                                </label>
                              </div>
                            </div>
                          )}

                          {/* 7. FEATURE CARDS GRID EDITOR */}
                          {block.type === 'feature-cards' && (
                            <div className="space-y-3 text-xs">
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-heading">Card Items ({bp.items?.length || 0})</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    updateActivePage((prev) => {
                                      const bks = [...prev.blocks];
                                      const curItems = bks[idx].props.items || [];
                                      bks[idx].props.items = [
                                        ...curItems,
                                        { icon: '⭐', title: 'New Feature', text: 'Feature description goes here.' },
                                      ];
                                      return { ...prev, blocks: bks };
                                    });
                                  }}
                                  className="text-[11px] text-flame font-semibold hover:underline flex items-center gap-1"
                                >
                                  <Plus className="h-3 w-3" />
                                  <span>Add Card</span>
                                </button>
                              </div>
                              <div className="space-y-2">
                                {(bp.items || []).map((card: { icon?: string; title?: string; text?: string }, cIdx: number) => (
                                  <div key={cIdx} className="p-3 rounded-xl border border-ink/10 bg-white space-y-2">
                                    <div className="flex items-center justify-between gap-2">
                                      <div className="flex items-center gap-2 flex-1">
                                        <input
                                          type="text"
                                          value={card.icon || ''}
                                          placeholder="Emoji"
                                          onChange={(e) => {
                                            const val = e.target.value;
                                            updateActivePage((prev) => {
                                              const bks = [...prev.blocks];
                                              bks[idx].props.items[cIdx].icon = val;
                                              return { ...prev, blocks: bks };
                                            });
                                          }}
                                          className="w-16 rounded-lg border px-2 py-1 text-center text-xs"
                                        />
                                        <input
                                          type="text"
                                          value={card.title || ''}
                                          placeholder="Card Title"
                                          onChange={(e) => {
                                            const val = e.target.value;
                                            updateActivePage((prev) => {
                                              const bks = [...prev.blocks];
                                              bks[idx].props.items[cIdx].title = val;
                                              return { ...prev, blocks: bks };
                                            });
                                          }}
                                          className="flex-1 rounded-lg border px-2.5 py-1 text-xs font-semibold"
                                        />
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          updateActivePage((prev) => {
                                            const bks = [...prev.blocks];
                                            bks[idx].props.items = bks[idx].props.items.filter((_: unknown, i: number) => i !== cIdx);
                                            return { ...prev, blocks: bks };
                                          });
                                        }}
                                        className="text-red-500 hover:bg-red-50 p-1 rounded"
                                      >
                                        <Trash2 className="h-3.5 w-3.5" />
                                      </button>
                                    </div>
                                    <input
                                      type="text"
                                      value={card.text || ''}
                                      placeholder="Description"
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        updateActivePage((prev) => {
                                          const bks = [...prev.blocks];
                                          bks[idx].props.items[cIdx].text = val;
                                          return { ...prev, blocks: bks };
                                        });
                                      }}
                                      className="w-full rounded-lg border px-2.5 py-1 text-xs text-muted"
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* 8. FAQ ACCORDION EDITOR */}
                          {block.type === 'faq' && (
                            <div className="space-y-3 text-xs">
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-heading">Questions & Answers ({bp.items?.length || 0})</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    updateActivePage((prev) => {
                                      const bks = [...prev.blocks];
                                      const curItems = bks[idx].props.items || [];
                                      bks[idx].props.items = [
                                        ...curItems,
                                        { q: 'New Question?', a: 'Answer context goes here.' },
                                      ];
                                      return { ...prev, blocks: bks };
                                    });
                                  }}
                                  className="text-[11px] text-flame font-semibold hover:underline flex items-center gap-1"
                                >
                                  <Plus className="h-3 w-3" />
                                  <span>Add FAQ Item</span>
                                </button>
                              </div>
                              <div className="space-y-2">
                                {(bp.items || []).map((faq: { q?: string; a?: string }, fIdx: number) => (
                                  <div key={fIdx} className="p-3 rounded-xl border border-ink/10 bg-white space-y-2">
                                    <div className="flex items-center justify-between gap-2">
                                      <input
                                        type="text"
                                        value={faq.q || ''}
                                        placeholder="Question"
                                        onChange={(e) => {
                                          const val = e.target.value;
                                          updateActivePage((prev) => {
                                            const bks = [...prev.blocks];
                                            bks[idx].props.items[fIdx].q = val;
                                            return { ...prev, blocks: bks };
                                          });
                                        }}
                                        className="flex-1 rounded-lg border px-2.5 py-1 text-xs font-semibold"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => {
                                          updateActivePage((prev) => {
                                            const bks = [...prev.blocks];
                                            bks[idx].props.items = bks[idx].props.items.filter((_: unknown, i: number) => i !== fIdx);
                                            return { ...prev, blocks: bks };
                                          });
                                        }}
                                        className="text-red-500 hover:bg-red-50 p-1 rounded"
                                      >
                                        <Trash2 className="h-3.5 w-3.5" />
                                      </button>
                                    </div>
                                    <textarea
                                      rows={2}
                                      value={faq.a || ''}
                                      placeholder="Detailed Answer..."
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        updateActivePage((prev) => {
                                          const bks = [...prev.blocks];
                                          bks[idx].props.items[fIdx].a = val;
                                          return { ...prev, blocks: bks };
                                        });
                                      }}
                                      className="w-full rounded-lg border px-2.5 py-1.5 text-xs text-muted"
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* 9. GALLERY EDITOR */}
                          {block.type === 'gallery' && (
                            <div className="space-y-3 text-xs">
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-heading">Image Collage Items ({bp.images?.length || 0})</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    updateActivePage((prev) => {
                                      const bks = [...prev.blocks];
                                      const curImgs = bks[idx].props.images || [];
                                      bks[idx].props.images = [
                                        ...curImgs,
                                        { src: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=500&auto=format&fit=crop&q=80', title: 'New Sample' },
                                      ];
                                      return { ...prev, blocks: bks };
                                    });
                                  }}
                                  className="text-[11px] text-flame font-semibold hover:underline flex items-center gap-1"
                                >
                                  <Plus className="h-3 w-3" />
                                  <span>Add Image</span>
                                </button>
                              </div>
                              <div className="space-y-2">
                                {(bp.images || []).map((img: { src?: string; title?: string }, gIdx: number) => (
                                  <div key={gIdx} className="p-3 rounded-xl border border-ink/10 bg-white flex items-center justify-between gap-2">
                                    <input
                                      type="text"
                                      value={img.src || ''}
                                      placeholder="Image URL"
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        updateActivePage((prev) => {
                                          const bks = [...prev.blocks];
                                          bks[idx].props.images[gIdx].src = val;
                                          return { ...prev, blocks: bks };
                                        });
                                      }}
                                      className="flex-1 rounded-lg border px-2.5 py-1 text-xs font-[var(--font-mono)]"
                                    />
                                    <input
                                      type="text"
                                      value={img.title || ''}
                                      placeholder="Title / Caption"
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        updateActivePage((prev) => {
                                          const bks = [...prev.blocks];
                                          bks[idx].props.images[gIdx].title = val;
                                          return { ...prev, blocks: bks };
                                        });
                                      }}
                                      className="w-40 rounded-lg border px-2.5 py-1 text-xs"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        updateActivePage((prev) => {
                                          const bks = [...prev.blocks];
                                          bks[idx].props.images = bks[idx].props.images.filter((_: unknown, i: number) => i !== gIdx);
                                          return { ...prev, blocks: bks };
                                        });
                                      }}
                                      className="text-red-500 hover:bg-red-50 p-1 rounded"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Block Selector Modal */}
      {showAddBlockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-cream border border-ink/10 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-ink/10">
              <h3 className="font-[var(--font-display)] text-lg font-bold text-heading">
                Choose a New Section / Element
              </h3>
              <button
                type="button"
                onClick={() => setShowAddBlockModal(false)}
                className="p-1 rounded-full hover:bg-ink/5"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
              {BLOCK_LIBRARY.map((def) => (
                <button
                  key={def.type}
                  type="button"
                  onClick={() => handleAddBlock(def.type)}
                  className="p-3.5 rounded-2xl border border-ink/10 bg-card hover:border-flame hover:shadow-xs transition-all text-left flex items-start gap-3"
                >
                  <span className="text-2xl mt-0.5">{def.emoji}</span>
                  <div>
                    <div className="text-xs font-bold text-heading">{def.label}</div>
                    <div className="text-[10px] text-muted">{def.group}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
