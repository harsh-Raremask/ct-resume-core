import { Link } from 'react-router-dom';
import { ArrowUp, Mail, Phone, Instagram, Linkedin } from 'lucide-react';
import { useContent } from '../contexts/ContentContext';

export default function Footer() {
  const { content } = useContent();
  const f = content.footer;
  const c = content.contact;
  const btns = content.buttonToggles || {};

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer data-tsec="footer" className="bg-footerbg text-footertext pt-16 pb-12 border-t border-white/10">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          <div className="md:col-span-5">
            <span className="font-[var(--font-display)] text-2xl font-semibold tracking-tight">
              {content.brand.name}<span className="text-flame">{content.brand.dot}</span>
              <span className="ml-1.5 text-[10px] font-[var(--font-mono)] uppercase tracking-[0.25em] text-white/50 align-middle">
                {content.brand.suffix}
              </span>
            </span>
            <p className="mt-4 text-sm text-white/70 max-w-sm leading-relaxed">
              {f.tagline}
            </p>
          </div>

          <div className="md:col-span-3">
            <div className="text-xs font-[var(--font-mono)] uppercase tracking-[0.2em] text-white/50 mb-4">
              {f.navigateLabel}
            </div>
            <ul className="space-y-2.5 text-sm text-white/80">
              <li><Link to="/" className="hover:text-flame transition-colors">{content.nav.home}</Link></li>
              <li><Link to="/templates" className="hover:text-flame transition-colors">{content.nav.templates}</Link></li>
              <li><Link to="/services" className="hover:text-flame transition-colors">{content.nav.services}</Link></li>
              <li><Link to="/store" className="hover:text-flame transition-colors">{content.nav.store}</Link></li>
              <li><Link to="/about" className="hover:text-flame transition-colors">{content.nav.about}</Link></li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <div className="text-xs font-[var(--font-mono)] uppercase tracking-[0.2em] text-white/50 mb-4">
              {f.contactLabel}
            </div>
            {btns.footerSocialLinks !== false && (
              <ul className="space-y-3 text-sm text-white/80">
                {c.email && (
                  <li>
                    <a href={`mailto:${c.email}`} className="inline-flex items-center gap-2 hover:text-flame transition-colors">
                      <Mail className="h-4 w-4 text-flame" />
                      {c.email}
                    </a>
                  </li>
                )}
                {c.phone && (
                  <li>
                    <a href={`tel:${c.phoneRaw}`} className="inline-flex items-center gap-2 hover:text-flame transition-colors">
                      <Phone className="h-4 w-4 text-flame" />
                      {c.phone}
                    </a>
                  </li>
                )}
                {c.linkedinUrl && (
                  <li>
                    <a href={c.linkedinUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-flame transition-colors">
                      <Linkedin className="h-4 w-4 text-flame" />
                      {c.linkedin}
                    </a>
                  </li>
                )}
                {c.instagramUrl && (
                  <li>
                    <a href={c.instagramUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-flame transition-colors">
                      <Instagram className="h-4 w-4 text-flame" />
                      {c.instagram}
                    </a>
                  </li>
                )}
              </ul>
            )}
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <div>
            © {new Date().getFullYear()} {content.brand.name}. {f.rights}
          </div>

          <div className="flex items-center gap-4">
            {btns.footerAdminLink !== false && (
              <Link to="/ct-vault" className="hover:text-white transition-colors">
                {f.adminLabel}
              </Link>
            )}
            {btns.footerBackToTop !== false && (
              <button
                onClick={scrollToTop}
                aria-label="Back to top"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-3 py-1 hover:border-flame hover:text-flame transition-colors"
              >
                <span>Top</span>
                <ArrowUp className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
