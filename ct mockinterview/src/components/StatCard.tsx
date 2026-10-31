/** Small stat tile used on the home + results pages */
export function StatCard({
  label, value, suffix = '', sub, tone = 'light',
}: {
  label: string;
  value: string | number;
  suffix?: string;
  sub?: string;
  tone?: 'light' | 'dark';
}) {
  const dark = tone === 'dark';
  return (
    <div className={`rounded-2xl border px-4 py-3.5 text-center ${dark ? 'border-white/10 bg-white/5' : 'border-sky-100 bg-sky-50/60'}`}>
      <div className={`font-display font-extrabold text-[26px] leading-none ${dark ? 'text-white' : 'text-deep-900'}`}>
        {value}<span className="text-[14px] font-bold">{suffix}</span>
      </div>
      <div className={`mt-1.5 text-[10px] font-bold uppercase tracking-widest ${dark ? 'text-sky-300' : 'text-sky-700'}`}>{label}</div>
      {sub && <div className={`text-[9.5px] ${dark ? 'text-sky-100/50' : 'text-slate-400'}`}>{sub}</div>}
    </div>
  );
}
