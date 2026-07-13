# Daley Organics — Schema v2 Implementation Handoff

## Claude Code: Read This First

This document contains precise implementation instructions for upgrading the JSON-LD schema across daleyorganics.com. The schema definitions are in `daley-organics-schema-v2.json` (sibling file). Every change below is production-ready — no stubs, no TODOs.

---

## Bug Fix: Canonical Tags (3 files)

### Root Cause
Three pages hardcode `Astro.site` (or a bare URL string) as the canonical instead of computing it from the current page path. The fix was identified on June 4, 2026 but never deployed to these files.

### Affected Pages
- `src/pages/products.astro` (or wherever `/products` is defined)
- `src/pages/ingredients.astro` (or wherever `/ingredients` is defined)  
- `src/pages/blog/index.astro` (the blog index, NOT individual `[slug].astro` posts)

### Fix Pattern
In each file's frontmatter (or in `BaseLayout.astro` if it controls all three), find:

```astro
<!-- WRONG — one of these patterns: -->
<link rel="canonical" href="https://daleyorganics.com" />
<link rel="canonical" href={Astro.site} />
<meta property="og:url" content="https://daleyorganics.com" />
<meta property="og:url" content={Astro.site} />
```

Replace with:

```astro
---
const canonical = new URL(Astro.url.pathname, Astro.site).href;
---
<link rel="canonical" href={canonical} />
<meta property="og:url" content={canonical} />
```

The newer pages (`/faq`, `/research`, `/privacy`, `/terms`, all `/blog/*` posts) already use this pattern — verify they're correct and don't touch them.

### Validation
After build, check the HTML output:
```bash
grep -oP 'rel="canonical" href="[^"]+"' dist/products/index.html
# Should output: rel="canonical" href="https://daleyorganics.com/products"

grep -oP 'rel="canonical" href="[^"]+"' dist/ingredients/index.html  
# Should output: rel="canonical" href="https://daleyorganics.com/ingredients"

grep -oP 'rel="canonical" href="[^"]+"' dist/blog/index.html
# Should output: rel="canonical" href="https://daleyorganics.com/blog"
```

---

## Schema Implementation: Page-by-Page

### General Pattern

All schema injection uses the Astro `<slot name="head" />` pattern in BaseLayout:

```astro
<!-- In BaseLayout.astro <head> section, before </head>: -->
<slot name="head" />
```

Schema components use `set:html` for build-time rendering:

```astro
<!-- In any SchemaComponent.astro: -->
---
const schema = { /* ... */ };
---
<script type="application/ld+json" set:html={JSON.stringify(schema)} />
```

---

### 1. Homepage Schema

**File:** `src/pages/index.astro`
**Action:** REPLACE the existing `<script type="application/ld+json">` block (the current `LocalBusiness` object) with the `homepage` schema from `daley-organics-schema-v2.json`.

**Key changes from current:**
- `@type` changes from `LocalBusiness` to `LandscapingSupplies`
- Adds `@id: "#organization"` anchor for cross-page linking
- Adds `legalName`, `alternateName`, `founder`, `contactPoint`
- Expands `areaServed` from a single GeoCircle to an array of 7 entity-linked towns + 1 GeoCircle (30mi radius)
- Adds `WebSite` node in `@graph` array
- GeoCircle radius changes from 80467m to 48280m (match GBP 30-mile setting)

**Create component:** `src/components/schema/HomepageSchema.astro`

```astro
---
// HomepageSchema.astro — LandscapingSupplies + WebSite @graph
// Source: daley-organics-schema-v2.json → "homepage"
import schemaData from '../../../daley-organics-schema-v2.json';
const schema = schemaData.homepage;
---
<script type="application/ld+json" set:html={JSON.stringify(schema)} />
```

**In `src/pages/index.astro`:**
```astro
---
import HomepageSchema from '../components/schema/HomepageSchema.astro';
---
<BaseLayout ...>
  <HomepageSchema slot="head" />
  <!-- existing homepage body -->
</BaseLayout>
```

**REMOVE:** The existing inline `<script type="application/ld+json">` block with the `LocalBusiness` schema from the homepage.

---

### 2. Products Page Schema

**File:** `src/pages/products.astro`
**Action:** REPLACE the LocalBusiness schema (which is a duplicate of the homepage schema) with the `products_page` schema from the JSON file.

**Create component:** `src/components/schema/ProductsSchema.astro`

This gives the products page its own `WebPage` + `ItemList` of `Product` objects with proper `Offer` pricing. Each product back-references the organization via `@id`.

---

### 3. Ingredients Page Schema

**File:** `src/pages/ingredients.astro`
**Action:** REPLACE the LocalBusiness schema with the `ingredients_page` schema.

This gives the ingredients page a `CollectionPage` type with an `ItemList` of all 26 ingredients, each linking to its blog post URL. This creates a rich internal linking mesh in structured data that AI engines use for entity mapping.

---

### 4. Blog Post Schema (Template)

**File:** `src/pages/blog/[slug].astro` (or individual post files)
**Action:** REPLACE both the `LocalBusiness` AND `Article` script blocks with a single `@graph` array containing `Article` + `FAQPage` + `BreadcrumbList`.

**Create component:** `src/components/schema/BlogPostSchema.astro`

```astro
---
// BlogPostSchema.astro
// Props come from the blog post frontmatter
interface Props {
  headline: string;
  description: string;
  canonicalUrl: string;
  heroImage: string;
  datePublished: string;  // ISO 8601: "2025-03-10"
  dateModified: string;   // ISO 8601: "2026-07-05"
  keywords: string;
  category: string;       // "Ingredients" or "Soil Science" or "Education"
  wordCount: number;
  ingredientName?: string;
  ingredientDescription?: string;
  faqs: Array<{ question: string; answer: string }>;
}

const {
  headline, description, canonicalUrl, heroImage,
  datePublished, dateModified, keywords, category,
  wordCount, ingredientName, ingredientDescription, faqs
} = Astro.props;

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": `${canonicalUrl}#article`,
      "headline": headline,
      "description": description,
      "image": heroImage,
      "datePublished": datePublished,
      "dateModified": dateModified,
      "wordCount": wordCount,
      "articleSection": category,
      "keywords": keywords,
      "author": {
        "@type": "Person",
        "name": "Cameron Daley",
        "jobTitle": "Founder",
        "worksFor": { "@id": "https://daleyorganics.com/#organization" },
        "url": "https://daleyorganics.com",
        "description": "Cameron Daley has been formulating organic soil blends and complete fertilizers in Grants Pass, Oregon since 2014."
      },
      "publisher": {
        "@type": "Organization",
        "name": "Daley Organics",
        "@id": "https://daleyorganics.com/#organization",
        "url": "https://daleyorganics.com",
        "logo": { "@type": "ImageObject", "url": "https://daleyorganics.com/favicon.svg" }
      },
      "mainEntityOfPage": { "@type": "WebPage", "@id": canonicalUrl },
      "speakable": {
        "@type": "SpeakableSpecification",
        "cssSelector": [".speakable-intro", ".tldr-block", ".faq-answer"]
      },
      ...(ingredientName ? {
        "about": {
          "@type": "Thing",
          "name": ingredientName,
          "description": ingredientDescription || ""
        }
      } : {})
    },
    {
      "@type": "FAQPage",
      "@id": `${canonicalUrl}#faq`,
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": { "@type": "Answer", "text": faq.answer }
      }))
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${canonicalUrl}#breadcrumb`,
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://daleyorganics.com" },
        { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://daleyorganics.com/blog" },
        { "@type": "ListItem", "position": 3, "name": headline, "item": canonicalUrl }
      ]
    }
  ]
};
---
<script type="application/ld+json" set:html={JSON.stringify(schema)} />
```

**CRITICAL:** Remove the existing `LocalBusiness` `<script>` block from all blog post pages. Blog posts should NOT have LocalBusiness schema — only the homepage and contact page should.

**Date format fix:** The current Article schema has `"datePublished": "March 10, 2025"` — this MUST be ISO 8601 format: `"2025-03-10"`. Update all existing post frontmatter dates.

---

### 5. Delivery Pages Schema

**Files:** New pages to create:
- `src/pages/delivery/index.astro`
- `src/pages/delivery/murphy.astro`
- `src/pages/delivery/williams.astro`

Use the `delivery_hub_page`, `delivery_murphy_page`, and `delivery_williams_page` schemas from the JSON file. These use `WebPage` (NOT `LocalBusiness`) with `about: AdministrativeArea` to signal geographic relevance without implying a physical storefront exists in those towns.

---

## Existing Blog Post Schema Retrofit

Each of the 9 existing blog posts needs:

1. **Remove** the `LocalBusiness` `<script>` block
2. **Replace** the `Article` `<script>` block with the full `@graph` array via `BlogPostSchema.astro`
3. **Add** 4-6 FAQ pairs per post (content provided separately in the blog series documents)
4. **Fix** `datePublished` to ISO 8601 format
5. **Add** `dateModified` set to the date of this retrofit
6. **Add** CSS classes to HTML: `.speakable-intro` on the lead paragraph, `.tldr-block` on the TL;DR container, `.faq-answer` on each FAQ answer element

---

## Validation Checklist

After implementation, verify:

```bash
# 1. Canonical tags — all pages correct
for path in / /products /ingredients /blog /faq /research; do
  grep -oP 'rel="canonical" href="[^"]+"' "dist${path}/index.html"
done

# 2. Schema types — correct per page
grep -oP '"@type":"[^"]+"' dist/index.html          # LandscapingSupplies, WebSite
grep -oP '"@type":"[^"]+"' dist/products/index.html  # WebPage, ItemList, Product, Offer
grep -oP '"@type":"[^"]+"' dist/ingredients/index.html # CollectionPage, ItemList
grep -oP '"@type":"[^"]+"' dist/blog/worm-castings-black-gold/index.html # Article, FAQPage, BreadcrumbList (NO LocalBusiness)

# 3. @id anchors — homepage has #organization
grep '#organization' dist/index.html  # should find it

# 4. areaServed — homepage has 8 entries (7 towns + 1 GeoCircle)
python3 -c "
import json, re
html = open('dist/index.html').read()
m = re.search(r'<script type=\"application/ld\+json\">(.*?)</script>', html)
data = json.loads(m.group(1))
areas = data['@graph'][0].get('areaServed', [])
print(f'areaServed count: {len(areas)}')
for a in areas:
    print(f'  {a.get(\"@type\")}: {a.get(\"name\", a.get(\"geoRadius\", \"circle\"))}')
"

# 5. Paste schemas into https://validator.schema.org/ — no errors
```

---

## Sitemap Updates

Add these URLs to `sitemap.xml` (or the Astro sitemap integration config):

```
https://daleyorganics.com/delivery
https://daleyorganics.com/delivery/murphy
https://daleyorganics.com/delivery/williams
```

Plus all 18 new blog post URLs as they publish.
