import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const url = typeof rawUrl === 'string' && rawUrl.startsWith('http') ? rawUrl : 'https://placeholder-ct-resume.supabase.co';
const key = typeof rawKey === 'string' && rawKey.length > 5 ? rawKey : 'placeholder-anon-key-ct-resume-12345';

const supabaseClient = createClient(url, key, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export default supabaseClient;
