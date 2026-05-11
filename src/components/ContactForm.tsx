import { useState, useEffect, useRef } from 'react';
import { Send, CheckCircle, AlertCircle, MapPin, Phone, Mail, Clock, ExternalLink } from 'lucide-react';
import { contactFormConfig, directoryLinks } from '../lib/site-config';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  MapPin, Phone, Mail, Clock,
};

export function ContactForm() {
  if (!contactFormConfig.mainTitle) return null;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    visitDate: '',
    visitors: contactFormConfig.form.visitorsOptions[0] || '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -10% 0px' }
    );

    const elements = sectionRef.current?.querySelectorAll('.fade-up, .slide-in-left, .slide-in-right');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(contactFormConfig.formEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', visitDate: '', visitors: contactFormConfig.form.visitorsOptions[0] || '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }

    setIsSubmitting(false);
    setTimeout(() => setStatus('idle'), 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const form = contactFormConfig.form;

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="section-padding relative overflow-hidden"
    >
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #d2a855 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }} />
      </div>

      <div className="container-custom relative">
        <div className="fade-up text-center mb-16">
          <span className="eyebrow">{contactFormConfig.scriptText}</span>
          <span className="text-gold-500 text-xs uppercase tracking-[0.2em] mb-4 block">
            {contactFormConfig.subtitle}
          </span>
          <h2 className="font-serif text-h1 text-white mb-4">{contactFormConfig.mainTitle}</h2>
          {contactFormConfig.introText && (
            <p className="text-white/70 max-w-2xl mx-auto">{contactFormConfig.introText}</p>
          )}
        </div>

        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Contact Info + Map */}
          <div className="lg:col-span-2 space-y-6">
            <div className="slide-in-left" style={{ transitionDelay: '0.1s' }}>
              {contactFormConfig.contactInfoTitle && (
                <h3 className="font-serif text-h5 text-white mb-6">{contactFormConfig.contactInfoTitle}</h3>
              )}
              <div className="space-y-3" role="list" aria-label="Contact information">
                {contactFormConfig.contactInfo.map((item) => {
                  const IconComponent = iconMap[item.icon];
                  return (
                    <div
                      key={item.label}
                      className="flex items-start gap-4 p-4 bg-white/5 rounded-lg border border-white/10 hover:border-gold-500/30 transition-colors"
                      role="listitem"
                    >
                      <div className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center flex-shrink-0">
                        {IconComponent && <IconComponent className="w-5 h-5 text-gold-500" />}
                      </div>
                      <div>
                        <p className="text-xs text-white/60 uppercase tracking-wider mb-1">{item.label}</p>
                        <p className="text-white font-medium">{item.value}</p>
                        <p className="text-sm text-white/60">{item.subtext}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Google Maps Embed */}
            <div className="slide-in-left rounded-lg overflow-hidden border border-white/10" style={{ transitionDelay: '0.2s' }}>
              <iframe
                src={contactFormConfig.mapsEmbedUrl}
                width="100%"
                height="240"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Daley Organics location map"
                className="block"
              />
              <a
                href="https://www.google.com/maps/place/Daley+Organics/@42.5432168,-123.3884123,17z"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 bg-white/5 text-gold-400 text-sm hover:bg-white/10 hover:text-gold-300 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5" />
                Get Directions
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <div className="slide-in-right bg-white/5 rounded-lg border border-white/10 p-8" style={{ transitionDelay: '0.15s' }}>
              {status === 'success' ? (
                <div className="text-center py-12" role="alert">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="font-serif text-h5 text-white mb-2">{form.successMessage}</h3>
                </div>
              ) : status === 'error' ? (
                <div className="text-center py-12" role="alert">
                  <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                  <h3 className="font-serif text-h5 text-white mb-2">{form.errorMessage}</h3>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="contact-name" className="block text-sm text-white/80 mb-2">
                        {form.nameLabel} <span className="text-gold-500">*</span>
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder={form.namePlaceholder}
                        autoComplete="name"
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-sm text-white placeholder-white/40 focus:outline-none focus:border-gold-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-phone" className="block text-sm text-white/80 mb-2">
                        {form.phoneLabel} <span className="text-gold-500">*</span>
                      </label>
                      <input
                        id="contact-phone"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder={form.phonePlaceholder}
                        autoComplete="tel"
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-sm text-white placeholder-white/40 focus:outline-none focus:border-gold-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-email" className="block text-sm text-white/80 mb-2">
                        {form.emailLabel} <span className="text-gold-500">*</span>
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder={form.emailPlaceholder}
                        autoComplete="email"
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-sm text-white placeholder-white/40 focus:outline-none focus:border-gold-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-date" className="block text-sm text-white/80 mb-2">
                        {form.visitDateLabel} <span className="text-gold-500">*</span>
                      </label>
                      <input
                        id="contact-date"
                        type="date"
                        name="visitDate"
                        value={formData.visitDate}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-sm text-white focus:outline-none focus:border-gold-500 transition-colors"
                      />
                    </div>
                  </div>

                  {form.visitorsOptions.length > 0 && (
                    <div>
                      <label htmlFor="contact-visitors" className="block text-sm text-white/80 mb-2">
                        {form.visitorsLabel}
                      </label>
                      <select
                        id="contact-visitors"
                        name="visitors"
                        value={formData.visitors}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-sm text-white focus:outline-none focus:border-gold-500 transition-colors"
                      >
                        {form.visitorsOptions.map((option) => (
                          <option key={option} value={option} className="bg-[#141414]">{option}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label htmlFor="contact-message" className="block text-sm text-white/80 mb-2">
                      {form.messageLabel}
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      placeholder={form.messagePlaceholder}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-sm text-white placeholder-white/40 focus:outline-none focus:border-gold-500 transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-primary rounded-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {form.submittingText}
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        {form.submitText}
                      </>
                    )}
                  </button>

                  {contactFormConfig.privacyNotice && (
                    <p className="text-xs text-white/50 text-center">{contactFormConfig.privacyNotice}</p>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Find Us Online — Directory Trust Badges */}
        <div className="fade-up mt-16 pt-10 border-t border-white/10" style={{ transitionDelay: '0.25s' }}>
          <p className="text-center text-xs text-white/50 uppercase tracking-[0.2em] mb-6">Find Us Online</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {directoryLinks.map((dir) => (
              <a
                key={dir.shortLabel}
                href={dir.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Daley Organics on ${dir.label}`}
                className="group flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:border-gold-500/50 hover:bg-gold-500/5 transition-all duration-300 text-sm text-white/70 hover:text-white"
              >
                {dir.badge && (
                  <span className="text-xs font-bold text-gold-400 bg-gold-400/10 px-1.5 py-0.5 rounded">
                    {dir.badge}
                  </span>
                )}
                <span>{dir.shortLabel === 'Yellow Pages' ? 'Yellow Pages' : dir.shortLabel}</span>
                <ExternalLink className="w-3 h-3 opacity-40 group-hover:opacity-70 transition-opacity" />
              </a>
            ))}
          </div>
          <p className="text-center text-xs text-white/40 mt-4">
            Verified listings · Proudly serving Grants Pass & the Rogue Valley
          </p>
        </div>
      </div>
    </section>
  );
}
