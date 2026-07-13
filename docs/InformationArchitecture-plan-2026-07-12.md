---
title: Daley Organics — Information Architecture & Authority Plan
date: 2026-07-12
status: adopted
decision: keep URL silos; build full bidirectional link mesh (Mike, 2026-07-12)
---

# Daley Organics — Information Architecture Plan

## 1. The model: four silos, one mesh

URL structure stays flat (decision 2026-07-12). Authority flows through internal links, not URL paths.

```
/                    ← brand + LandscapingSupplies schema (the entity anchor: #organization)
/products            ← commercial hub (WebPage + ItemList of Product+Offer)
/ingredients         ← topical hub (CollectionPage + 26-entry ItemList)
/blog/<slug>         ← 27 articles: 23 ingredient profiles + 4 editorial
/delivery/<town>     ← local hubs (WebPage + AdministrativeArea/CensusDesignatedPlace)
/faq /research …     ← trust layer
```

## 2. Authority flow (who links whom, and why)

**Down (hubs → spokes):** homepage → 3 hubs. `/ingredients` links every library entry to its article — the hub hands authority to 23 ingredient posts. `/products` links each product to the articles for its ingredients — commercial pages endorse the topical content.

**Up (spokes → hubs):** every blog post links back to `/ingredients` (template-level). Ingredient posts link to `/products` via productsUsedIn. This concentrates authority in the two hubs that convert.

**Sideways (spoke ↔ spoke):** every post carries a 2-4 link "Related reading" block. Editorial posts (understanding-npk, composting-science, mycorrhizal-network, the-guano-wars) act as connective tissue — they link into multiple ingredient profiles.

**Rule of thumb:** every page reachable within 2 clicks of a hub; no orphan pages; no page links out more than ~8 internal links per block (dilution).

## 3. Placement rules for future content (stop deciding ad-hoc)

| New content | Where it goes | Mandatory wiring |
|---|---|---|
| Ingredient profile | `/blog/<ingredient-slug>.md` | library entry link on /ingredients + related block + productsUsedIn + FAQPage (4-6) |
| Editorial / education | `/blog/<slug>.md` | related block linking ≥2 ingredient profiles + hub back-link |
| Product | products data + schema JSON ItemList | card anchor id + links to its ingredient articles + comparison table row if premium |
| Delivery town | `/delivery/<town>.astro` | hub page link + CensusDesignatedPlace/AdministrativeArea schema + sitemap |
| FAQ content for a page | frontmatter `faqs` | renders visible + FAQPage schema automatically; never ship empty faqs |

## 4. Schema layer (already shipped, keep invariant)

- Homepage: `LandscapingSupplies` + `WebSite` @graph, `#organization` anchor — the ONLY LocalBusiness-semantics node besides contact.
- /products: WebPage + ItemList of Product+Offer, back-ref `#organization`.
- /ingredients: CollectionPage + ItemList → article URLs. **Invariant: schema ItemList URLs and visible HTML links must match 1:1.**
- Posts: Article + BreadcrumbList (+ FAQPage only when faqs non-empty). Dates ISO 8601.
- Delivery: WebPage + about:place. Never LocalBusiness (no storefront implication).

## 5. Deferred decision: /ingredients/<slug> URL migration

Rejected for now (silos kept). Revisit ONLY if: (a) ingredient article count passes ~35, or (b) after 6 months the hub page ranks but articles don't (authority not flowing). Migration cost then: 301s for all article URLs via Workers `_redirects`, breadcrumb + canonical + sitemap updates. The mesh built now transfers fully — nothing done today is throwaway under a later migration.

## 6. Editorial voice invariant

`title:` and `excerpt:` frontmatter are Mike's voice — no executor or SEO pass may rewrite them. SERP copy lives in the dedicated description field; SEO tooling touches only that. Enforced in dispatch prompts + validation gates as of 2026-07-12.
