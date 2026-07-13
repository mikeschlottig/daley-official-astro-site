# CLAUDE_DIGEST — Schema v2 Implementation

## Summary

Implemented the full handoff spec from `CLAUDE-CODE-SCHEMA-HANDOFF.md` (excluding new blog post creation). All 20 pages build cleanly with zero errors. Validation checklist passes on all items.

---

## Files Created (absolute paths)

| File | Purpose |
|------|---------|
| `/home/mikes/daley-official-astro-site/src/data/daley-organics-schema-v2.json` | Schema payload (copied from posts-seo-enhancements-etc/) |
| `/home/mikes/daley-official-astro-site/src/lib/utils.ts` | `estimateWordCount()` utility for BlogPostSchema |
| `/home/mikes/daley-official-astro-site/src/components/schema/HomepageSchema.astro` | LandscapingSupplies + WebSite @graph |
| `/home/mikes/daley-official-astro-site/src/components/schema/ProductsSchema.astro` | WebPage + ItemList + Product + Offer |
| `/home/mikes/daley-official-astro-site/src/components/schema/IngredientsSchema.astro` | CollectionPage + ItemList (26 ingredients) |
| `/home/mikes/daley-official-astro-site/src/components/schema/BlogPostSchema.astro` | Article + FAQPage + BreadcrumbList @graph |
| `/home/mikes/daley-official-astro-site/src/pages/delivery/index.astro` | Delivery hub page |
| `/home/mikes/daley-official-astro-site/src/pages/delivery/murphy.astro` | Murphy delivery page |
| `/home/mikes/daley-official-astro-site/src/pages/delivery/williams.astro` | Williams delivery page |

## Files Edited (absolute paths)

| File | Changes |
|------|---------|
| `/home/mikes/daley-official-astro-site/src/layouts/BaseLayout.astro` | Removed LocalBusiness JSON-LD; removed hardcoded canonical default; canonical now dynamic from `Astro.url.pathname`; added `<slot name="head" />` |
| `/home/mikes/daley-official-astro-site/src/pages/index.astro` | Added HomepageSchema via head slot; explicit canonical |
| `/home/mikes/daley-official-astro-site/src/pages/products.astro` | Added ProductsSchema via head slot; explicit canonical (fixes bug) |
| `/home/mikes/daley-official-astro-site/src/pages/ingredients.astro` | Added IngredientsSchema via head slot; explicit canonical (fixes bug) |
| `/home/mikes/daley-official-astro-site/src/pages/blog/index.astro` | Explicit canonical (fixes bug) |
| `/home/mikes/daley-official-astro-site/src/pages/blog/[slug].astro` | Replaced Article JSON-LD with BlogPostSchema; removed LocalBusiness; dates → ISO 8601; added dateModified; added `.speakable-intro` and `.tldr-block` CSS classes; added `<time>` elements with datetime attrs |
| `/home/mikes/daley-official-astro-site/src/content.config.ts` | Added `dateModified: z.string().optional()` to blog schema |
| `/home/mikes/daley-official-astro-site/scripts/generate-sitemap.mjs` | Added /delivery, /delivery/murphy, /delivery/williams URLs |
| `/home/mikes/daley-official-astro-site/src/content/blog/blood-meal-blood-money.md` | Added `dateModified: "2026-07-12"` |
| `/home/mikes/daley-official-astro-site/src/content/blog/bone-meal-the-bone-business.md` | Added `dateModified: "2026-07-12"` |
| `/home/mikes/daley-official-astro-site/src/content/blog/glacial-rock-dust-remineralize.md` | Added `dateModified: "2026-07-12"` |
| `/home/mikes/daley-official-astro-site/src/content/blog/gypsums-great-transformation.md` | Added `dateModified: "2026-07-12"` |
| `/home/mikes/daley-official-astro-site/src/content/blog/kelp-meal-ocean-nutrition.md` | Added `dateModified: "2026-07-12"` |
| `/home/mikes/daley-official-astro-site/src/content/blog/mycorrhizal-network.md` | Added `dateModified: "2026-07-12"` |
| `/home/mikes/daley-official-astro-site/src/content/blog/the-guano-wars.md` | Added `dateModified: "2026-07-12"` |
| `/home/mikes/daley-official-astro-site/src/content/blog/understanding-npk.md` | Added `dateModified: "2026-07-12"` |
| `/home/mikes/daley-official-astro-site/src/content/blog/worm-castings-black-gold.md` | Added `dateModified: "2026-07-12"` |

---

## Validation Checklist Output

### 1. Canonical Tags
```
/            → rel="canonical" href="https://daleyorganics.com/"
/products    → rel="canonical" href="https://daleyorganics.com/products/"
/ingredients → rel="canonical" href="https://daleyorganics.com/ingredients/"
/blog        → rel="canonical" href="https://daleyorganics.com/blog/"
/faq         → rel="canonical" href="https://daleyorganics.com/faq"        (untouched)
/research    → rel="canonical" href="https://daleyorganics.com/research"   (untouched)
```

### 2. Schema Types per Page
- **Homepage**: `LandscapingSupplies`, `WebSite` ✓ (NO LocalBusiness)
- **Products**: `WebPage`, `ItemList`, `Product`, `Offer` ✓
- **Ingredients**: `CollectionPage`, `ItemList`, `BreadcrumbList` ✓
- **Blog post (worm-castings)**: `Article`, `FAQPage`, `BreadcrumbList`, `SpeakableSpecification` ✓ (NO LocalBusiness)
- **Delivery hub**: `WebPage`, `Service`, `BreadcrumbList` ✓
- **Delivery murphy**: `WebPage`, `CensusDesignatedPlace`, `BreadcrumbList` ✓
- **Delivery williams**: `WebPage`, `CensusDesignatedPlace`, `BreadcrumbList` ✓

### 3. @id Anchors
- Homepage has `#organization` ✓
- Homepage has `#website` ✓

### 4. areaServed (8 entries)
```
AdministrativeArea: Grants Pass
AdministrativeArea: Josephine County
CensusDesignatedPlace: Merlin, Oregon
CensusDesignatedPlace: Murphy, Oregon
CensusDesignatedPlace: Williams, Oregon
CensusDesignatedPlace: Wilderville, Oregon
City: Rogue River, Oregon
GeoCircle: 48280
```

### 5. Blog Post Dates (ISO 8601)
```
blood-meal-blood-money:    published=2025-03-14  modified=2026-07-12
bone-meal-the-bone-business: published=2025-03-18  modified=2026-07-12
glacial-rock-dust-remineralize: published=2025-02-28  modified=2026-07-12
gypsums-great-transformation: published=2025-03-28  modified=2026-07-12
kelp-meal-ocean-nutrition: published=2025-03-15  modified=2026-07-12
mycorrhizal-network:       published=2025-04-01  modified=2026-07-12
the-guano-wars:            published=2025-03-22  modified=2026-07-12
understanding-npk:         published=2025-03-05  modified=2026-07-12
worm-castings-black-gold:  published=2025-03-10  modified=2026-07-12
```

### 6. Speakable CSS Classes
- `.speakable-intro` on article content div ✓
- `.tldr-block` on TL;DR container ✓
- `.faq-answer` not present (no FAQ content available — see Missing FAQs)

### 7. Sitemap
- 20 URLs total ✓
- `/delivery` ✓
- `/delivery/murphy` ✓
- `/delivery/williams` ✓

### 8. Build Status
```
20 page(s) built in 7.30s — zero errors, zero warnings
```

---

## Fleet Reuse

No custom tools or existing utilities were reused from code-atlas. All implementations are new Astro components and a simple `estimateWordCount()` utility.

---

## Missing FAQs

The tier1/tier2 JSON files contain FAQ data for **new** blog posts (slugs like `coco-coir-sustainable-alternative`, `bat-guano-cave-fertilizer`, etc.) that do NOT match any of the 9 existing blog posts. Therefore all 9 existing posts have `faqs={[]}` (empty array) and generate a `FAQPage` node with an empty `mainEntity`:

- `blood-meal-blood-money` — no FAQ data available
- `bone-meal-the-bone-business` — no FAQ data available
- `glacial-rock-dust-remineralize` — no FAQ data available
- `gypsums-great-transformation` — no FAQ data available
- `kelp-meal-ocean-nutrition` — no FAQ data available
- `mycorrhizal-network` — no FAQ data available
- `the-guano-wars` — no FAQ data available
- `understanding-npk` — no FAQ data available
- `worm-castings-black-gold` — no FAQ data available

---

## Skipped (Per Instructions)

- **18 new blog posts** — not created (tier1/tier2 JSON batches are a separate later task)
- **`/faq`, `/research`, `/privacy`, `/terms`** canonicals — verified correct, not touched
- **No commits** — changes left in worktree
