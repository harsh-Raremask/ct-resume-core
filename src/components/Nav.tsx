import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useContent } from '../contexts/ContentContext';
import { DEFAULT_NAV_ITEMS } from '../lib/content';
import ActivityBell from './ActivityBell';
import UserButton from './auth/UserButton';

export default function Nav() {
  const { content } = useContent();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const navItems = (
    content.customNav?.items && content.customNav.items.length > 0
      ? content.customNav.items
      : DEFAULT_NAV_ITEMS
  ).filter((i) => i.visible !== false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const btns = content.buttonToggles || {};

  return (
    <header
      data-tsec="nav"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-cream/90 backdrop-blur-md border-b border-ink/10' : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto max-w-[1400px] px-6 md:px-10 h-16 md:h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          {content.brand.logoUrl ? (
            <img
              src={content.brand.logoUrl}
              alt={content.brand.name}
              className="h-9 w-9 rounded-full object-cover border border-ink/10"
            />
          ) : (
            <div className="h-9 w-9 rounded-xl bg-flame flex items-center justify-center text-white font-bold text-sm shadow-sm">
              CT
            </div>
          )}
          <span className="font-[var(--font-display)] text-xl md:text-2xl font-semibold tracking-tight">
            {content.brand.name}<span className="text-flame">{content.brand.dot}</span>
            <span className="ml-1.5 text-[10px] font-[var(--font-mono)] uppercase tracking-[0.25em] text-muted align-middle">
              {content.brand.suffix}
            </span>
          </span>
        </Link>

        {/* Desktop Navbar Items */}
        <div className="hidden md:flex items-center gap-7">
          {navItems.map((item) => {
            const isInternal = item.url.startsWith('/') && !item.newTab;
            const contentNode = (
              <>
                {item.icon && <span className="mr-1">{item.icon}</span>}
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className="ml-1.5 rounded-full px-1.5 py-0.5 text-[8px] font-bold text-white align-middle"
                    style={{ backgroundColor: item.badgeColor || '#2563eb' }}
                  >
                    {item.badge}
                  </span>
                )}
              </>
            );

            if (isInternal) {
              return (
                <NavLink
                  key={item.id}
                  to={item.url}
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors duration-300 ${
                      isActive ? 'text-flame font-semibold' : 'text-navtext hover:text-ink'
                    }`
                  }
                >
                  {contentNode}
                </NavLink>
              );
            }
            return (
              <a
                key={item.id}
                href={item.url}
                target={item.newTab ? '_blank' : undefined}
                rel="noreferrer"
                className="text-sm font-medium text-navtext hover:text-ink transition-colors"
              >
                {contentNode}
              </a>
            );
          })}

          <ActivityBell />
          <UserButton />

          {btns.navCta !== false && (
            <Link
              to="/services"
              className="group inline-flex items-center gap-2 rounded-full bg-btnbg text-btntext px-5 py-2 text-sm font-medium transition-all duration-300 hover:bg-btnhover shadow-sm"
            >
              {content.nav.cta}
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
            </Link>
          )}
        </div>

        {/* Mobile Header Buttons */}
        <div className="md:hidden flex items-center gap-2">
          <ActivityBell />
          <UserButton mobile />
          <button
            className="p-2 text-ink hover:text-flame transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-cream border-b border-ink/10 overflow-hidden"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {navItems.map((item) => {
                const isInternal = item.url.startsWith('/') && !item.newTab;
                if (isInternal) {
                  return (
                    <NavLink
                      key={item.id}
                      to={item.url}
                      className={({ isActive }) =>
                        `text-lg font-medium ${isActive ? 'text-flame font-semibold' : 'text-ink'}`
                      }
                    >
                      {item.icon && <span className="mr-2">{item.icon}</span>}
                      {item.label}
                      {item.badge && (
                        <span
                          className="ml-2 rounded-full px-1.5 py-0.5 text-[9px] font-bold text-white align-middle"
                          style={{ backgroundColor: item.badgeColor || '#2563eb' }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                }
                return (
                  <a
                    key={item.id}
                    href={item.url}
                    target={item.newTab ? '_blank' : undefined}
                    rel="noreferrer"
                    className="text-lg font-medium text-ink flex items-center"
                  >
                    {item.icon && <span className="mr-2">{item.icon}</span>}
                    <span>{item.label}</span>
                    {item.badge && (
                      <span
                        className="ml-2 rounded-full px-1.5 py-0.5 text-[9px] font-bold text-white align-middle"
                        style={{ backgroundColor: item.badgeColor || '#2563eb' }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </a>
                );
              })}

              {btns.navCta !== false && (
                <Link
                  to="/services"
                  className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-btnbg text-btntext px-5 py-3 text-sm font-medium"
                >
                  {content.nav.cta} <ArrowUpRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
