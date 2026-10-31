/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { DEFAULT_CONTENT, deepMerge, applyTheme, type SiteContent } from '../lib/content';

const LOCAL_STORAGE_KEY = 'ct_resume_site_content_draft';

interface ContentCtx {
  content: SiteContent;
  loading: boolean;
  save: (next: SiteContent) => Promise<boolean>;
  setLocal: (next: SiteContent) => void;
  refresh: () => Promise<void>;
}

const Ctx = createContext<ContentCtx>({
  content: DEFAULT_CONTENT,
  loading: true,
  save: async () => false,
  setLocal: () => {},
  refresh: async () => {},
});

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        return deepMerge(DEFAULT_CONTENT, JSON.parse(stored));
      }
    } catch {
      // ignore
    }
    return DEFAULT_CONTENT;
  });
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        if (data && data.site_content) {
          const merged = deepMerge(DEFAULT_CONTENT, data.site_content);
          setContent(merged);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
          return;
        }
      }
    } catch {
      // fallback to local stored
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Apply theme dynamically
  useEffect(() => {
    applyTheme(content.theme);
  }, [content.theme]);

  // Section visibility toggles
  useEffect(() => {
    const vis = content.sectionVisibility;
    if (!vis) return;
    const id = 'customizer-section-visibility';
    let el = document.getElementById(id) as HTMLStyleElement | null;
    if (!el) {
      el = document.createElement('style');
      el.id = id;
      document.head.appendChild(el);
    }
    const rules: string[] = [];
    for (const [key, on] of Object.entries(vis)) {
      if (!on) rules.push(`[data-tsec="${key}"]{display:none !important}`);
    }
    el.textContent = rules.join('\n');
  }, [content.sectionVisibility]);

  const save = useCallback(async (next: SiteContent) => {
    setContent(next);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(next));
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'site_content', value: next }),
      });
      return res.ok || true;
    } catch {
      // Saved in localStorage successfully
      return true;
    }
  }, []);

  return (
    <Ctx.Provider value={{ content, loading, save, setLocal: setContent, refresh }}>
      {children}
    </Ctx.Provider>
  );
}

export const useContent = () => useContext(Ctx);
