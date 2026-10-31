import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { PhoneCall, Menu, X, LayoutDashboard, ShieldCheck, Home, Target, BookOpenCheck, Sparkles } from 'lucide-react';
import { useCTCore } from '../lib/store';

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5 group">
      <div className="relative h-10 w-10 grid place-items-center rounded-xl bg-gradient-to-br from-sky-400 via-sky-500 to-cyan-600 shadow-lg shadow-sky-500/30 transition-transform group-hover:scale-105">
        <PhoneCall size={20} className="text-white" strokeWidth={2.2} />
        <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-400 border-2 border-white animate-pulse-soft" />
      </div>
      {!compact && (
        <div className="leading-tight">
          <div className="font-display font-extrabold text-[19px] tracking-tight text-deep-800">
            CT<span className="text-sky-500">Core</span>
          </div>
          <div className="text-[9.5px] font-bold uppercase tracking-[0.18em] text-sky-600/80">Mock Interview</div>
        </div>
      )}
    </Link>
  );
}

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/interview', label: 'Start Interview' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/question-bank', label: 'Question Bank' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const inInterview = pathname.startsWith('/interview/live');
  const { candidateName } = useCTCore();

  useEffect(() => { setOpen(false); window.scrollTo(0, 0); }, [pathname]);

  if (inInterview) return null; // distraction-free interview shell

  return (
    <header className="sticky top-0 z-40 border-b border-sky-100 bg-white/85 backdrop-blur-xl">
      {/* top utility strip */}
      <div className="hidden md:block bg-deep-800 text-sky-100 text-[11px]">
        <div className="mx-auto max-w-7xl px-6 h-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5"><ShieldCheck size={12} className="text-sky-400" /> Proctored-style simulation aligned to TCS · Infosys · Wipro · Accenture · Amazon hiring flows</span>
          </div>
          <div className="flex items-center gap-4 font-medium">
            <span className="inline-flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block" /> 36+ interview-ready questions</span>
            <span>·</span>
            <span>MCQ 30s &nbsp;|&nbsp; Theory 90s</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="h-16 flex items-center justify-between gap-4">
          <Logo />
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-[13.5px] font-semibold transition-colors ${isActive ? 'bg-sky-50 text-sky-700' : 'text-deep-800/80 hover:text-sky-700 hover:bg-sky-50/60'}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 pl-1 pr-3 py-1">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-sky-600 text-[11px] font-bold text-white">{candidateName.slice(0, 1).toUpperCase()}</span>
              <span className="text-[12px] font-semibold text-deep-800 max-w-[110px] truncate">{candidateName}</span>
            </div>
            <Link to="/interview" className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 px-4 py-2.5 text-[13px] font-bold text-white shadow-md shadow-sky-500/30 hover:shadow-lg hover:shadow-sky-500/40 hover:-translate-y-0.5 transition-all">
              <Target size={15} strokeWidth={2.5} /> Start
            </Link>
          </div>
          <button className="lg:hidden p-2 text-deep-800" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-sky-100 bg-white px-4 py-4 space-y-1 shadow-xl">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'}
              className={({ isActive }) => `block rounded-lg px-4 py-3 text-sm font-semibold ${isActive ? 'bg-sky-50 text-sky-700' : 'text-deep-800'}`}>
              {item.label}
            </NavLink>
          ))}
          <Link to="/interview" className="block rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 px-4 py-3 text-center text-sm font-bold text-white">Start Mock Interview</Link>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  const { pathname } = useLocation();
  if (pathname.startsWith('/interview/live')) return null;
  return (
    <footer className="relative border-t border-sky-100 bg-deep-900 text-sky-100">
      <div className="pointer-events-none absolute inset-0 hero-glow opacity-[0.07]" />
      <div className="relative mx-auto max-w-7xl px-6 py-12 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 grid place-items-center rounded-lg bg-gradient-to-br from-sky-400 to-cyan-600"><PhoneCall size={18} className="text-white" /></div>
            <div>
              <div className="font-display font-extrabold text-white">CT<span className="text-sky-400">Core</span></div>
              <div className="text-[9px] uppercase tracking-[0.2em] text-sky-400/80 font-bold">Mock Interview</div>
            </div>
          </div>
          <p className="mt-4 text-[12.5px] leading-relaxed text-sky-100/75">
            India’s focused mock-interview module for freshers and final-year students — technology, aptitude and critical-thinking rounds exactly the way campus hiring panels conduct them.
          </p>
        </div>
        <div>
          <div className="text-[11px] font-bold uppercase tracking-widest text-sky-400">Module</div>
          <ul className="mt-3 space-y-2 text-[13px]">
            <li><Link to="/interview" className="hover:text-white inline-flex items-center gap-1.5"><Sparkles size={12}/> Start Interview</Link></li>
            <li><Link to="/dashboard" className="hover:text-white inline-flex items-center gap-1.5"><LayoutDashboard size={12}/> Performance Dashboard</Link></li>
            <li><Link to="/question-bank" className="hover:text-white inline-flex items-center gap-1.5"><BookOpenCheck size={12}/> Question Bank</Link></li>
            <li><Link to="/interview" className="hover:text-white inline-flex items-center gap-1.5"><Home size={12}/> Full Simulation Mode</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-[11px] font-bold uppercase tracking-widest text-sky-400">Rounds</div>
          <ul className="mt-3 space-y-2 text-[13px] text-sky-100/80">
            <li>Technology — Code & MCQs</li>
            <li>Aptitude — Quant & Logic</li>
            <li>Critical Thinking — Reasoning</li>
            <li>Code-Output Prediction</li>
          </ul>
        </div>
        <div>
          <div className="text-[11px] font-bold uppercase tracking-widest text-sky-400">Interview Rules</div>
          <ul className="mt-3 space-y-2 text-[13px] text-sky-100/80">
            <li>MCQ & Code → <span className="text-white font-semibold">30 sec</span> per question</li>
            <li>Theory → <span className="text-white font-semibold">90 sec</span> per answer</li>
            <li>Instant scoring & explanations</li>
            <li>Certificate on completion</li>
          </ul>
        </div>
      </div>
      <div className="relative border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 h-11 flex flex-col sm:flex-row items-center justify-between text-[11px] text-sky-100/60 gap-1 sm:gap-0">
          <span>© 2026 CTCore Technologies Pvt. Ltd. — Mock Interview Module v2.4</span>
          <span>Practice today. Interview with confidence.</span>
        </div>
      </div>
    </footer>
  );
}

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f6fcff] font-sans text-deep-800 antialiased">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
