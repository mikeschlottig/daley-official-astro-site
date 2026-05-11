# Daley Organics — Astro Site

## Project
Astro v6.1.5 static site for Daley Organics (Grants Pass, OR). Cloudflare Workers deployment. No ecommerce — pickup only.

**Output:** `C:/Dev/KimiK2/Claude_workspace/Kimi_Agent_Daley Organics Website/Astro_Daley_Organics_Website/`

## Dev Server
Dev server config is at `.claude/launch.json` — name: `astro-daley-organics`, port 4321.
Start via `preview_start`, not Bash. Node via Volta: `C:/Users/mikes/AppData/Local/Volta/tools/image/node/22.12.0/node.exe`.

## CRITICAL: Astro Template Rules
**Never use TypeScript type annotations inside `{}` Astro template expressions.** This causes silent 500 errors.

```astro
<!-- WRONG — causes 500 -->
{items.map((item: string) => <p>{item}</p>)}
{items.map((id: string) => { const x: Record<string, string> = {}; })}

<!-- RIGHT -->
{items.map((item) => <p>{item}</p>)}
```

Move typed `const` declarations to the frontmatter (`---` block) instead.

## Content Collections
- `src/content/blog/` — Markdown blog posts. Slug = filename without extension.
- `src/content/testimonials/` — Testimonials with `order`, `name`, `role`, `rating` fields.
- `src/content/products/` — Product content.
- Schema defined in `src/content.config.ts` (not `src/content/config.ts`).

## Blog Routes
- `/blog` → `src/pages/blog/index.astro`
- `/blog/[slug]` → `src/pages/blog/[slug].astro` — uses `post.id` as slug param
- `/research` → `src/pages/research/index.astro` — whitepaper (15 sections, inline data)
- `/ingredients` → `src/pages/ingredients.astro` — 26-ingredient SEO library

## Config
- `src/lib/site-config.ts` — all text content, colors, layout config
- `tailwind.config.cjs` (not `.js`) — ESM conflict with `"type":"module"` in package.json
- `src/styles/global.css` — global styles

## Build
Build wrapper: `run-build.cmd` (sets Volta PATH). Dev server HMR works fine for verification.

## GEO/SEO Patterns
- Blog posts: TLDR box rendered BEFORE `<Content />` — AI crawlers read it first
- Article JSON-LD on every blog post; ScholarlyArticle on `/research`
- LocalBusiness JSON-LD in `BaseLayout.astro`
- Blog frontmatter supports: `tldr`, `readingTime`, `author`, `tags`, `ogImage`, `relatedProducts`, `featured`
