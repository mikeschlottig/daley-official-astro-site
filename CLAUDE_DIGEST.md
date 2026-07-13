# CLAUDE_DIGEST.md — Google Maps Reviews Embed

## Role / Goal
**Role:** Scraper + Astro engineer
**Goal:** Real Google Maps reviews for Daley Organics displayed on the site, with link to Google profile

---

## Scrape Results

- **Reviews scraped:** 10 (of 10 visible on page)
- **Overall rating:** 4.6 stars, 10 reviews
- **Source:** Camofox browser (headless Chrome gets "limited view" without reviews; Camofox anti-bot bypass works)

### Reviews Extracted
| # | Author | Rating | Date | Text Preview |
|---|--------|--------|------|--------------|
| 1 | Joan | 5★ | a year ago | Fantastic place to buy bulk organic gardening soil... |
| 2 | Jon Schlottig | 5★ | 9 months ago | Great Soil for a fair price... |
| 3 | That Girl | 5★ | 2 years ago | My fav place for quick loads of the merlin blend... |
| 4 | Seth Williams | 5★ | a year ago | This is my go to place to get dirt... |
| 5 | Kody Kite | 5★ | a year ago | Best soil yard in southren Oregon... |
| 6 | Shawna Newton | 1★ | Edited a year ago | Over priced, and every yr their mix gets worse... |
| 7 | Bob Johnson | 5★ | 2 years ago | Best soil around |
| 8 | Abe rubio | 5★ | 2 years ago | Good |
| 9 | Jimmy Long | 5★ | 2 years ago | *(empty text)* |
| 10 | Brendon kinzel | 5★ | 3 years ago | *(empty text)* |

---

## Selectors That Worked (Camofox + Google Maps Reviews)

| Element | Selector | Notes |
|---------|----------|-------|
| Review card | `.jftiEf` | Primary container for each review |
| Author name | `.d4r55` | Inside review card |
| Star rating | `.kvMYJc [aria-label]` | aria-label contains "N stars" |
| Review text | `.wiI7pd` | Full review text |
| Relative date | `.rsqaWe` | "a year ago", "Edited a year ago" |
| More button | `.w8nwRe` | Expands truncated reviews |
| Reviews tab | `[role="tab"]` text "Reviews" | Only visible on Camofox (anti-bot bypass) |
| Overall rating | `document.body.innerText` regex `(\d+\.\d)\s*\n\s*(\d+)\s*reviews?` | |

**Critical finding:** Headless Chrome (CDP on port 9222) gets a "limited view" of Google Maps with NO reviews tab and NO review content in DOM. Camofox on port 9377 (anti-bot browser) shows the full Reviews tab with all content. This is a Google anti-bot measure.

---

## Files Created / Changed

| File | Action | Purpose |
|------|--------|---------|
| `/home/mikes/scrapers/gmaps-reviews/v1.0.0/scrape_reviews.py` | Created | Camofox-based scraper with JS extraction + fallback text parsing |
| `/home/mikes/daley-official-astro-site/src/data/google-reviews.json` | Created | 10 reviews, rating, profile URL |
| `/home/mikes/daley-official-astro-site/src/components/GoogleReviews.astro` | Created | Review cards with stars, author, text, date, Google link |
| `/home/mikes/daley-official-astro-site/src/pages/index.astro` | Modified | Added GoogleReviews import + component after News |
| `/home/mikes/scrapers/gmaps-reviews/v1.0.0/evidence-*.png` | Created | 15+ screenshots documenting scrape process |

**Zero changes to:** blog posts, product copy, existing testimonials, existing JSON-LD, npm dependencies.

---

## Build Result

```
$ pnpm run build
✓ Completed in 8.17s
38 page(s) built
```

**Verified in built HTML:**
- ✅ "What Our Customers Say" header present
- ✅ "4.6 stars, 10 reviews" rating display
- ✅ All 8 non-empty review cards rendered (Joan, Jon Schlottig, That Girl, Seth Williams, Kody Kite, Shawna Newton, Bob Johnson, Abe rubio)
- ✅ "Read All Reviews on Google" link to profileUrl
- ✅ Existing testimonials (Sarah Mitchell, Mike Rodriguez, Jennifer Chen) untouched
- ✅ No schema.org Review/AggregateRating markup (Google policy compliant)
- ✅ No TypeScript annotations in `{}` template expressions

---

## Technical Notes

1. **Anti-bot detection:** Google Maps serves a "limited view" to headless Chrome — no Reviews tab, no review content in DOM. Camofox (anti-bot Firefox fork) bypasses this and shows full content.

2. **Scraper architecture:** The scraper uses Camofox REST API (same pattern as `gmaps_scraper.py`): `POST /tabs` → `POST /tabs/{id}/navigate` → `POST /tabs/{id}/evaluate` with JS extractors. Scroll loop loads all reviews.

3. **Two extraction methods:** Primary: `.jftiEf` card-based structured extraction. Fallback: regex-based text parsing from `document.body.innerText` for resilience.

4. **Profile URL:** Links to the place page (without `!9m1!1b1` review-pane parameter) so users see the main business listing.
