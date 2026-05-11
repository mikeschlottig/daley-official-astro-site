import { useState } from 'react';
import { Leaf, MapPin, Phone, Mail, ArrowUp, CheckCircle } from 'lucide-react';
import { footerConfig } from '../lib/site-config';

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Leaf, MapPin, Phone, Mail, Instagram: InstagramIcon, Facebook: FacebookIcon, ArrowUp,
};

export function Footer() {
  if (!footerConfig.brandName) return null;

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const scrollToSection = (href: string) => {
    if (href.startsWith('/')) {
      window.location.href = href;
    } else {
      const element = document.querySelector(href);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;

    try {
      const response = await fetch(footerConfig.newsletterEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail }),
      });

      if (response.ok) {
        setNewsletterStatus('success');
        setNewsletterEmail('');
      } else {
        setNewsletterStatus('error');
      }
    } catch {
      setNewsletterStatus('error');
    }

    setTimeout(() => setNewsletterStatus('idle'), 4000);
  };

  return (
    <footer className="relative border-t border-white/10" role="contentinfo">
      <div className="container-custom py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <Leaf className="w-8 h-8 text-gold-500" aria-hidden="true" />
              <div>
                <span className="font-serif text-xl text-white block">{footerConfig.brandName}</span>
                {footerConfig.tagline && (
                  <span className="text-[10px] text-gold-400 tracking-widest uppercase">{footerConfig.tagline}</span>
                )}
              </div>
            </div>
            {footerConfig.description && (
              <p className="text-white/70 text-sm leading-relaxed mb-6">{footerConfig.description}</p>
            )}
            {/* Social Links */}
            {footerConfig.socialLinks.length > 0 && (
              <nav aria-label="Social media links">
                <div className="flex gap-3">
                  {footerConfig.socialLinks.map((social) => {
                    const IconComponent = iconMap[social.icon];
                    return (
                      <a
                        key={social.label}
                        href={social.href}
                        aria-label={social.label}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:bg-gold-500 hover:border-gold-500 hover:text-white transition-all duration-300"
                      >
                        {IconComponent && <IconComponent className="w-4 h-4" />}
                      </a>
                    );
                  })}
                </div>
              </nav>
            )}
          </div>

          {/* Link Groups */}
          {footerConfig.linkGroups.map((group, index) => (
            <nav key={index} aria-label={group.title}>
              <h3 className="font-serif text-lg text-white mb-5">{group.title}</h3>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.name}>
                    <button
                      onClick={() => scrollToSection(link.href)}
                      className="text-white/70 text-sm hover:text-gold-400 transition-colors"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* Contact Info + Newsletter */}
          <div>
            {footerConfig.contactItems.length > 0 && (
              <>
                <h3 className="font-serif text-lg text-white mb-5">Contact</h3>
                <ul className="space-y-4">
                  {footerConfig.contactItems.map((item, index) => {
                    const IconComponent = iconMap[item.icon];
                    return (
                      <li key={index} className="flex items-start gap-3">
                        {IconComponent && <IconComponent className="w-4 h-4 text-gold-500 mt-0.5 flex-shrink-0" aria-hidden="true" />}
                        <span className="text-white/70 text-sm">{item.text}</span>
                      </li>
                    );
                  })}
                </ul>
              </>
            )}

            {/* Newsletter */}
            {footerConfig.newsletterLabel && (
              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-white/70 text-sm mb-3">{footerConfig.newsletterLabel}</p>
                {newsletterStatus === 'success' ? (
                  <div className="flex items-center gap-2 text-green-400 text-sm">
                    <CheckCircle className="w-4 h-4" />
                    <span>{footerConfig.newsletterSuccessText}</span>
                  </div>
                ) : (
                  <form onSubmit={handleNewsletter} className="flex gap-2">
                    <label htmlFor="newsletter-email" className="sr-only">{footerConfig.newsletterLabel}</label>
                    <input
                      id="newsletter-email"
                      type="email"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder={footerConfig.newsletterPlaceholder}
                      required
                      autoComplete="email"
                      className="flex-1 px-3 py-2 bg-white/5 border border-white/20 rounded-sm text-white text-sm placeholder-white/40 focus:outline-none focus:border-gold-500 transition-colors"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-gold-500 text-white text-sm rounded-sm hover:bg-gold-600 transition-colors"
                    >
                      {footerConfig.newsletterButtonText}
                    </button>
                  </form>
                )}
                {newsletterStatus === 'error' && (
                  <p className="text-red-400 text-xs mt-2">{footerConfig.newsletterErrorText}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container-custom py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center justify-center gap-4 text-white/50 text-xs">
            {footerConfig.copyrightText && (
              <span>&copy; 2026 {footerConfig.copyrightText}</span>
            )}
            {footerConfig.legalLinks.map((link, index) => (
              <span key={index}>
                <span className="hidden md:inline">|</span>
                <a href={link.href} className="hover:text-gold-400 transition-colors ml-2 md:ml-0">{link.name}</a>
              </span>
            ))}
          </div>

          {footerConfig.backToTopText && (
            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 text-white/70 text-sm hover:text-gold-400 transition-colors group"
              aria-label={footerConfig.backToTopText}
            >
              <span>{footerConfig.backToTopText}</span>
              <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:border-gold-500 group-hover:bg-gold-500 transition-all duration-300">
                <ArrowUp className="w-4 h-4" />
              </div>
            </button>
          )}
        </div>

        {/* Credit Bar */}
        <div className="border-t border-white/5">
          <div className="container-custom py-4 flex flex-col md:flex-row items-center justify-center gap-2 text-white/30 text-[11px] text-center">
            <span>Website custom built and powered by <a href="https://leverageai.network" target="_blank" rel="noopener noreferrer" className="hover:text-gold-400 transition-colors">LEVERAGE AI LLC</a></span>
            <span className="hidden md:inline">·</span>
            <span>
              Proud member of the{' '}
              <a href="https://leverageai.network" target="_blank" rel="noopener noreferrer" className="hover:text-gold-400 transition-colors">Oregon SMB Directory</a>
              {' '}network — helping local businesses maximize reach and rank at or near the top of local search from Google to ChatGPT, Perplexity, and every service in between.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
