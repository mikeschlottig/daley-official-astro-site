#!/usr/bin/env node
// Generates public/sitemap.xml — single canonical sitemap, sitemaps.org 0.9 schema.
// Routes are derived deterministically from src/pages + the blog content collection.
// Run: node scripts/generate-sitemap.mjs   (also wired into prebuild)
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://daleyorganics.com';
const today = new Date().toISOString().slice(0, 10);

// Static routes with crawl priority + change frequency.
const staticRoutes = [
  { path: '/',            priority: '1.0', changefreq: 'weekly'  },
  { path: '/products',    priority: '0.9', changefreq: 'weekly'  },
  { path: '/ingredients', priority: '0.8', changefreq: 'monthly' },
  { path: '/research',    priority: '0.8', changefreq: 'monthly' },
  { path: '/blog',        priority: '0.7', changefreq: 'weekly'  },
  { path: '/faq',         priority: '0.5', changefreq: 'monthly' },
  { path: '/privacy',     priority: '0.3', changefreq: 'yearly'  },
  { path: '/terms',       priority: '0.3', changefreq: 'yearly'  },
];

// Parse "March 5, 2025" -> "2025-03-05"; fall back to today on bad input.
function parseDate(raw) {
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? today : d.toISOString().slice(0, 10);
}

// Blog posts: slug = filename, lastmod = frontmatter `date`.
const blogDir = join(root, 'src/content/blog');
const blogRoutes = readdirSync(blogDir)
  .filter((f) => f.endsWith('.md'))
  .map((f) => {
    const slug = f.replace(/\.md$/, '');
    const src = readFileSync(join(blogDir, f), 'utf8');
    const m = src.match(/^date:\s*["']?(.+?)["']?\s*$/m);
    return {
      path: `/blog/${slug}`,
      priority: '0.6',
      changefreq: 'yearly',
      lastmod: m ? parseDate(m[1]) : today,
    };
  })
  .sort((a, b) => a.path.localeCompare(b.path));

const urls = [
  ...staticRoutes.map((r) => ({ ...r, lastmod: today })),
  ...blogRoutes,
];

const body = urls
  .map(
    (u) =>
      `  <url>\n` +
      `    <loc>${SITE}${u.path}</loc>\n` +
      `    <lastmod>${u.lastmod}</lastmod>\n` +
      `    <changefreq>${u.changefreq}</changefreq>\n` +
      `    <priority>${u.priority}</priority>\n` +
      `  </url>`,
  )
  .join('\n');

const xml =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  `${body}\n` +
  `</urlset>\n`;

writeFileSync(join(root, 'public/sitemap.xml'), xml);
console.log(`sitemap.xml written — ${urls.length} URLs (${blogRoutes.length} blog posts)`);
