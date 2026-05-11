# Image Optimization — COMPLETE
Session: 2026-05-11

## Status: DONE ✓ Sharp running, WebP output confirmed.

## Root Cause (for the record)
**Sharp was never installed.** Without it, Astro accepts image imports but silently falls back to public/ URL paths. No WebP conversion, no `/_astro/` paths. The `image()` schema helper issue (with `../../` relative paths and glob loader) was a secondary problem.

## What's Wired

### Image storage
- `src/assets/images/` — 22 images, processed by Sharp at build time → `/_astro/*.hash.webp`
- `public/images/` — React-consumed images stay here (referenced as strings in `site-config.ts`)
  - Keep: `hero-garden.jpg, soil-mix.jpg, compost-hands.jpg, farm-landscape.jpg, tomato-garden.jpg, flower-garden.jpg, happy-gardener.jpg, fertilizer-blend.jpg`
  - Blog-only images removed from public/ (they're only in src/assets/images/ now)

### Image map — `src/lib/blog-images.ts`
Single file with all static imports + keyed record. All content collection images go through this map.
**Never use `image()` schema helper** — does NOT work with glob loader + `../../` paths.

### Schema — `src/content.config.ts`
Both `blog` and `products` schemas use `image: z.string()`. Frontmatter value = just the filename (`daleys-cavern.png`).

### Components updated
- `src/pages/blog/[slug].astro` — hero + related posts use `siteImages[post.data.image]`
- `src/pages/blog/index.astro` — featured + grid use `siteImages[post.data.image]`
- `src/components/News.astro` — blog cards use `siteImages[article.data.image]`
- `src/pages/index.astro` — banner uses direct `import bannerImage from '../assets/images/banner-image.png'`

### Build command
`pnpm run build` — use this. Direct Volta node invocation swallows all output.

## Compression results (sample)
| Image | Before | After |
|-------|--------|-------|
| daleys-bone-meal.png | 8.4 MB | 39 kB |
| daleys-cavern.png | 8.7 MB | 102 kB |
| daleys-mycorrhizal-highway.png | 8.9 MB | 33 kB |
| daleys-angel-of-gypsum.png | 8.7 MB | 126 kB |
| daleys-seabird-guano.png | 8.2 MB | 90 kB |
| banner-image.png | 1.4 MB | 45 kB |

29 WebP variants generated (multiple sizes per image for responsive).

## Phase 3 — React Island Audit (NEXT)
Before optimizing React component images (prop-threading from site-config.ts), evaluate which islands are necessary:

| Component | Keep React? | Reason |
|-----------|------------|--------|
| `Hero.tsx` | Yes | Preloader event listener, animations |
| `ProductShowcase.tsx` | Maybe | Tab switching = CSS |
| `GardenCarousel.tsx` | Maybe | Auto-advance = vanilla JS |
| `OurStory.tsx` | Maybe | Tab switching = CSS |
| `ContactForm.tsx` | Yes | Form state |
| `Navigation.tsx` | Maybe | Scroll + mobile menu = vanilla JS |
| `Preloader.tsx` | Maybe | Could be vanilla JS |
| `Footer.tsx` | No | Mostly static — convert to Astro |
| `ScrollToTop.tsx` | Maybe | Simple — vanilla JS |
