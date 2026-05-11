# Daley Organics — Site Editing Guide
> Astro v6 + React Islands + Cloudflare Pages
> Last updated: 2026-04-11

---

## Quick Reference

| Task | File(s) to Edit |
|------|----------------|
| Change any text/copy | `src/lib/site-config.ts` |
| Change nav links or CTA | `src/lib/site-config.ts` → `navigationConfig` |
| Change colors / fonts | `tailwind.config.cjs` + `src/styles/global.css` |
| Add a blog post | New `.md` in `src/content/blog/` |
| Add a product | New `.md` in `src/content/products/` |
| Add a testimonial | New `.md` in `src/content/testimonials/` |
| Add a new page | New `.astro` in `src/pages/` |
| Change SEO / JSON-LD | `src/layouts/BaseLayout.astro` |
| Change social links | `src/lib/site-config.ts` → `footerConfig.socialLinks` |
| Change directory badges | `src/lib/site-config.ts` → `directoryLinks` |
| Change address / phone | `src/lib/site-config.ts` + `src/layouts/BaseLayout.astro` |

---

## 1. Running the Dev Server

```bash
# From the Astro project directory (git bash or PowerShell with Volta in PATH):
pnpm dev          # http://localhost:4321
pnpm build        # outputs to dist/
pnpm preview      # serves dist/ locally

# If node is not in PATH (Windows CMD environment):
# Use the wrapper: app/start-astro-dev.cmd
# Or start via the Claude Code preview panel (launch.json is configured)
```

---

## 2. Changing Text & Copy

**All site-wide text lives in one file:** `src/lib/site-config.ts`

- `navigationConfig` — nav links, CTA button text, brand name/tagline
- `heroConfig` — hero title, subtitle, stats bar, CTA text
- `productShowcaseConfig` — products section heading and quote
- `gardenCarouselConfig` — carousel heading and slides
- `ourStoryConfig` — story section tabs, timeline, quote
- `newsConfig` — blog section headings, story paragraphs
- `contactFormConfig` — contact info, form labels, map embed URL
- `footerConfig` — footer brand, social links, link groups, contact items
- `directoryLinks` — the trust badge strip (Yelp, BBB, Yellow Pages, etc.)

**Example — change the hero subtitle:**
```ts
// src/lib/site-config.ts
export const heroConfig = {
  scriptText: "Your New Eyebrow Text Here",  // bold tracked sans-serif
  mainTitle: "Your New Headline",
  // ...
};
```

---

## 3. Adding a New Page

1. Create `src/pages/your-page-name.astro`
2. Wrap it in `<BaseLayout>` for SEO + consistent styles:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout
  title="Page Title | Daley Organics"
  description="Page meta description."
>
  <main class="bg-[#141414] min-h-screen">
    <!-- your content -->
  </main>
</BaseLayout>
```

3. Add to navigation in `src/lib/site-config.ts`:
```ts
navLinks: [
  // ...existing links
  { name: "New Page", href: "/your-page-name", icon: "Sprout" },
],
```

The Navigation component automatically handles both:
- Hash anchors (`#section`) → smooth scroll
- Page routes (`/page`) → full navigation

---

## 4. Internal Routing & Link Types

### Hash anchors (same-page scroll)
Use `href="#section-id"` — the Navigation and Footer `scrollToSection` functions handle these automatically.

```astro
<a href="#contact">Contact Us</a>
<!-- or in React components: -->
<button onClick={() => scrollToSection('#contact')}>Contact</button>
```

### Page routes (different page)
Use `href="/page-name"` — Navigation's `handleNavLink()` detects the `/` prefix and does `window.location.href`.

```astro
<a href="/products">View Products</a>
```

### Page routes with section anchors
```astro
<a href="/products#pickup">Pickup Instructions</a>
```

### External links — always add `target="_blank" rel="noopener noreferrer"`:
```astro
<a href="https://yelp.com/..." target="_blank" rel="noopener noreferrer">Yelp</a>
```

---

## 5. Changing Fonts

Fonts are loaded in `src/layouts/BaseLayout.astro` via Google Fonts, and configured in `tailwind.config.cjs`.

**Current fonts:**
| Class | Font | Use |
|-------|------|-----|
| `font-serif` | Cormorant Garamond | Main headings (H1, H2) |
| `font-sans` | Poppins | Body text, UI elements |
| `font-script` | Qwitcher Grypen | Preloader brand mark only |

**To change the serif font:**
1. Update the Google Fonts URL in `BaseLayout.astro`
2. Update `fontFamily.serif` in `tailwind.config.cjs`

**To change the sans-serif font:**
1. Update the Google Fonts URL
2. Update `fontFamily.sans`

---

## 6. Changing Colors

All brand colors are in `tailwind.config.cjs`:

```js
colors: {
  gold: {
    400: '#e0b860',  // lighter gold (eyebrows, accents)
    500: '#d2a855',  // primary gold (buttons, borders)
    600: '#b8922e',  // hover state
  },
  wine: {
    800: '#2a1a1a',  // dark backgrounds
    900: '#1a0f0f',  // deepest dark
  }
}
```

The `btn-primary` style (the gold CTA button) is in `src/styles/global.css`:
```css
.btn-primary {
  background-color: var(--gold-500);
  /* ... */
}
```

**To standardize gold usage:**
- Buttons: `btn-primary` class (auto uses gold-500)
- Eyebrows: `eyebrow` class (auto uses gold-500)
- Borders/accents: `border-gold-500/30`, `text-gold-400`

---

## 7. Typography Classes Reference

| Class | Description |
|-------|-------------|
| `font-serif text-h1` | Main section heading (~4-5xl) |
| `font-serif text-h5` | Sub-heading (~xl) |
| `eyebrow` | Section eyebrow — bold tracked uppercase gold sans-serif |
| `eyebrow-hero` | Hero banner eyebrow — larger, black weight |
| `text-gold-500 text-xs uppercase tracking-[0.2em]` | Subtitle under eyebrow |
| `font-script` | Script/calligraphy — **Preloader only** |

---

## 8. Adding Blog Posts

Create a new markdown file in `src/content/blog/`:

```markdown
---
title: "How to Use Worm Castings in Grants Pass Clay Soil"
excerpt: "A practical guide to applying worm castings in the Rogue Valley's clay-heavy soils."
date: "2026-05-01"
category: "Application Guides"
image: "/images/worm-castings.jpg"
---

Your blog content here. Each post automatically appears in the blog grid on the homepage.

## Subheading

Paragraph text. [Link to our Fertilizer Blend](/products#catalog) for more.
```

**Blog post SEO tips:**
- Title: include "Grants Pass" or "Rogue Valley" for local SEO
- Answer a specific long-tail question (e.g., "best fertilizer for tomatoes in Southern Oregon")
- Link back to a product in every post

---

## 9. Adding Products

Create a new markdown file in `src/content/products/`:

```markdown
---
name: "Rock Dust Blend"
subtitle: "Remineralization Formula"
badge: "New"
image: "/images/rock-dust.jpg"
glowColor: "rgba(150, 120, 80, 0.3)"
usage: "Top-dress or mix in at 1 cup per sq ft"
season: "Spring / Fall"
releaseType: "Slow Release"
order: 4
---

Product description here.
```

---

## 10. Updating Business Info

Business info appears in multiple places. Update all at once:

**`src/lib/site-config.ts`:**
- `contactFormConfig.contactInfo` — contact section cards
- `footerConfig.contactItems` — footer contact strip

**`src/layouts/BaseLayout.astro`:**
- `localBusinessSchema.address` — JSON-LD structured data
- `localBusinessSchema.telephone`
- `localBusinessSchema.geo` — latitude/longitude
- `localBusinessSchema.openingHoursSpecification`
- Geo meta tags (`geo.position`, `ICBM`)

---

## 11. Deployment (Cloudflare Pages)

```bash
# Build
pnpm build        # generates dist/

# Deploy to Cloudflare Pages
npx wrangler pages deploy dist/ --project-name=daley-organics

# Or connect repo to Cloudflare Pages dashboard for auto-deploy on push
```

The site is pure static (`output: 'static'`). No Cloudflare Workers adapter needed.
`wrangler.toml` is configured for the project name `daley-organics`.

---

## 12. File Structure Reference

```
Astro_Daley_Organics_Website/
├── src/
│   ├── components/          # React islands + Astro components
│   │   ├── Navigation.tsx   # client:load — sticky nav
│   │   ├── Hero.tsx         # client:load — animated hero
│   │   ├── Preloader.tsx    # client:load — loading screen
│   │   ├── ProductShowcase.tsx  # client:visible
│   │   ├── GardenCarousel.tsx   # client:visible
│   │   ├── OurStory.tsx         # client:visible
│   │   ├── News.astro           # STATIC — no JS shipped
│   │   ├── ContactForm.tsx      # client:visible — maps + form
│   │   ├── Footer.tsx           # client:visible
│   │   └── ScrollToTop.tsx      # client:load
│   ├── content/             # Content Collections (markdown)
│   │   ├── blog/            # Blog posts → News section
│   │   ├── products/        # Products → ProductShowcase
│   │   └── testimonials/    # Testimonials → News section
│   ├── layouts/
│   │   └── BaseLayout.astro # HTML shell, SEO, JSON-LD
│   ├── lib/
│   │   └── site-config.ts   # ALL text content lives here
│   ├── pages/
│   │   ├── index.astro      # Homepage
│   │   └── products.astro   # /products hub page
│   └── styles/
│       └── global.css       # Tailwind base + custom classes
├── public/
│   └── images/              # All images (static, no processing)
├── content.config.ts        # Content collection schemas (Astro v6)
├── astro.config.mjs         # Astro config (integrations, site URL)
├── tailwind.config.cjs      # Brand colors, fonts, keyframes
├── wrangler.toml            # Cloudflare deployment config
└── SITE_EDITING_GUIDE.md    # This file
```
