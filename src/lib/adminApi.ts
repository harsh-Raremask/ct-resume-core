/* Admin session + authenticated fetch helpers.
   Uses dedicated session storage keys for CT Resume Core. */

const KEY = 'ct_resume_admin_session';
const LAST_ACTIVE = 'ct_resume_admin_last_active';
export const INACTIVITY_LIMIT_MS = 30 * 60 * 1000; // 30 minutes

export interface AdminSession {
  access_token: string;
  refresh_token: string;
  email: string;
}

export function getSession(): AdminSession | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const last = Number(sessionStorage.getItem(LAST_ACTIVE) || 0);
    if (last && Date.now() - last > INACTIVITY_LIMIT_MS) {
      clearSession();
      return null;
    }
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setSession(s: AdminSession) {
  sessionStorage.setItem(KEY, JSON.stringify(s));
  touchActivity();
}

export function clearSession() {
  sessionStorage.removeItem(KEY);
  sessionStorage.removeItem(LAST_ACTIVE);
  sessionStorage.removeItem('ct_resume_admin_ok');
}

export function touchActivity() {
  sessionStorage.setItem(LAST_ACTIVE, String(Date.now()));
}

export function getToken(): string | null {
  const s = getSession();
  return s ? s.access_token : null;
}

export function authFetch(input: string, init: RequestInit = {}): Promise<Response> {
  const token = getToken();
  const headers: Record<string, string> = {
    ...(init.headers as Record<string, string> | undefined),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  touchActivity();
  return fetch(input, { ...init, headers });
}

let installed = false;
export function installAuthInterceptor() {
  if (installed) return;
  installed = true;
  const orig = window.fetch.bind(window);
  window.fetch = (input: RequestInfo | URL, init: RequestInit = {}) => {
    try {
      const url = typeof input === 'string' ? input : input instanceof URL ? input.pathname : (input as Request).url;
      if (typeof url === 'string' && (url.startsWith('/api/') || url.includes(`${location.origin}/api/`))) {
        const token = getToken();
        if (token) {
          const headers = new Headers(init.headers || (input instanceof Request ? input.headers : undefined));
          if (!headers.has('Authorization')) headers.set('Authorization', `Bearer ${token}`);
          init = { ...init, headers };
          touchActivity();
        }
      }
    } catch { /* never break fetch */ }
    return orig(input as RequestInfo, init);
  };
}
