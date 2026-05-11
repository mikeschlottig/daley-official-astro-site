import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// NOTE: @astrojs/cloudflare adapter is omitted for pure static output.
// `output: 'static'` generates a dist/ folder deployable to Cloudflare Pages
// via `wrangler pages deploy dist/` — no adapter required.
// Add the adapter back only if you need server-side rendering (SSR) or
// Cloudflare Workers dynamic routes.

export default defineConfig({
  site: 'https://daleyorganics.com',
  output: 'static',
  integrations: [
    react(),
    tailwind({ applyBaseStyles: false }),
    sitemap(),
  ],
  image: {
    responsiveStyles: true,
  },
});
