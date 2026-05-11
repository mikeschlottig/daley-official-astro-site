import { useState, useEffect, useRef } from 'react';
import { Sprout, Sparkles, MapPin, Clock, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { productShowcaseConfig } from '../lib/site-config';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Sprout, Sparkles, MapPin, Clock,
};

export function ProductShowcase() {
  if (!productShowcaseConfig.mainTitle || productShowcaseConfig.products.length === 0) return null;

  const [activeProduct, setActiveProduct] = useState(0);
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

  const products = productShowcaseConfig.products;
  const features = productShowcaseConfig.features;
  const quote = productShowcaseConfig.quote;
  const product = products[activeProduct];

  const nextProduct = () => setActiveProduct((prev) => (prev + 1) % products.length);
  const prevProduct = () => setActiveProduct((prev) => (prev - 1 + products.length) % products.length);

  return (
    <section
      id="products"
      ref={sectionRef}
      className="section-padding relative overflow-hidden"
    >
      {/* Subtle Texture Overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #d2a855 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="container-custom relative">
        {/* Section Title */}
        <div className="fade-up text-center mb-16">
          <span className="eyebrow">{productShowcaseConfig.scriptText}</span>
          <span className="text-gold-500 text-xs uppercase tracking-[0.2em] mb-4 block">
            {productShowcaseConfig.subtitle}
          </span>
          <h2 className="font-serif text-h1 text-white">{productShowcaseConfig.mainTitle}</h2>
        </div>

        {/* Product Tabs */}
        <div className="fade-up flex justify-center gap-2 mb-16" style={{ transitionDelay: '0.1s' }}>
          {products.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setActiveProduct(i)}
              className={`px-6 py-3 rounded-sm text-sm transition-all duration-300 ${
                i === activeProduct
                  ? 'bg-gold-500 text-white'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-center">
          {/* Left: Product Info */}
          <div className="slide-in-left lg:col-span-2 order-2 lg:order-1">
            <div className="mb-8">
              <div className="flex items-baseline gap-4 mb-3">
                <span className="font-serif text-6xl lg:text-7xl text-gold-500/30 leading-none">{product.badge}</span>
              </div>
              <h2 className="font-serif text-h3 text-white leading-tight">{product.name}</h2>
              <span className="eyebrow mb-0">{product.subtitle}</span>
              <div className="w-16 h-px bg-gold-500 mt-4" />
            </div>

            <p className="text-white/85 leading-relaxed mb-4">{product.description}</p>
            <p className="text-white/65 leading-relaxed text-sm mb-8">{product.usage}</p>

            {/* Product Details */}
            <div className="flex gap-6 mb-8">
              <div>
                <div className="font-serif text-2xl text-gold-500">{product.season}</div>
                <div className="text-[11px] text-white/50 uppercase tracking-wider mt-1">Season</div>
              </div>
              <div className="w-px bg-white/10" />
              <div>
                <div className="font-serif text-2xl text-gold-500">{product.releaseType}</div>
                <div className="text-[11px] text-white/50 uppercase tracking-wider mt-1">Type</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => {
                  const element = document.querySelector('#contact');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn-primary rounded-sm flex items-center gap-2 group"
                aria-label="Schedule Bulk Pickup"
              >
                Schedule Bulk Pickup
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
              <a
                href="/products"
                className="px-5 py-3 rounded-sm text-sm border border-white/20 text-white/70 hover:text-white hover:border-gold-500/40 transition-all flex items-center gap-2"
              >
                Full Details
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Center: Product Image */}
          <div className="lg:col-span-1 order-1 lg:order-2 flex justify-center">
            <div className="relative" style={{ width: '220px', height: '520px' }}>
              {/* Glow */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className={`w-48 h-48 ${product.glowColor} rounded-full blur-3xl transition-colors duration-700`} />
              </div>

              {/* Product Images */}
              {products.map((p, i) => (
                <img
                  key={p.id}
                  src={p.image}
                  alt={`${p.name} - ${p.subtitle}`}
                  loading={i === 0 ? undefined : 'lazy'}
                  style={p.filter ? { filter: p.filter } : undefined}
                  className={`absolute inset-0 w-full h-full object-contain z-10 drop-shadow-2xl transition-all duration-700 ${
                    i === activeProduct
                      ? 'opacity-100 scale-100 translate-y-0'
                      : i < activeProduct
                        ? 'opacity-0 scale-90 -translate-y-6 pointer-events-none'
                        : 'opacity-0 scale-90 translate-y-6 pointer-events-none'
                  }`}
                />
              ))}

              {/* Switcher Arrows */}
              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-4 z-20">
                <button
                  onClick={prevProduct}
                  className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-gold-500 hover:border-gold-500 transition-all duration-300"
                  aria-label="Previous product"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm text-white/50 font-serif tabular-nums whitespace-nowrap">
                  {activeProduct + 1} / {products.length}
                </span>
                <button
                  onClick={nextProduct}
                  className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-gold-500 hover:border-gold-500 transition-all duration-300"
                  aria-label="Next product"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right: Features + Quote */}
          <div className="slide-in-right lg:col-span-2 order-3">
            <div className="space-y-6">
              {features.map((feature) => {
                const IconComponent = iconMap[feature.icon] || Sprout;
                return (
                  <div key={feature.title} className="flex items-start gap-4 group">
                    <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:border-gold-500/30 transition-colors">
                      <IconComponent className="w-5 h-5 text-gold-500" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg text-white mb-1">{feature.title}</h3>
                      <p className="text-sm text-white/65 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quote */}
            {quote.text && (
              <div className="mt-10 p-6 bg-white/[0.03] rounded-lg border-l-2 border-gold-500/50">
                {quote.prefix && <p className="eyebrow">{quote.prefix}</p>}
                <p className="text-white/70 text-sm italic leading-relaxed">"{quote.text}"</p>
                {quote.attribution && <p className="text-gold-500 text-xs mt-3">— {quote.attribution}</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
