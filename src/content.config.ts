import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),          // SERP-optimized meta description (120-155 chars)
    excerpt: z.string(),
    date: z.string(),
    category: z.string(),
    image: z.string(),
    featured: z.boolean().optional(),
    relatedProducts: z.array(z.string()).optional(),
    relatedPosts: z.array(z.string()).optional(),
    // GEO / AI-search optimization fields
    tldr: z.array(z.string()).optional(),       // 3-5 bullet key takeaways shown at top
    readingTime: z.string().optional(),          // "8 min read"
    author: z.string().optional(),              // "Cameron Daley"
    tags: z.array(z.string()).optional(),        // ["mycorrhiza", "soil biology"]
    ogImage: z.string().optional(),             // override default OG image
    dateModified: z.string().optional(),         // ISO 8601: "2026-07-12"
    faqs: z.array(z.object({
      question: z.string(),
      answer: z.string(),
    })).optional(),
    ingredientName: z.string().optional(),       // for schema About field
    ingredientDescription: z.string().optional(),
  }),
});

const products = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/products' }),
  schema: z.object({
    name: z.string(),
    subtitle: z.string(),
    badge: z.string().optional(),
    image: z.string(),
    glowColor: z.string().optional(),
    // Catalog organization
    category: z.enum(['premium-media', 'amendments', 'landscaping', 'fertilizer']),
    featured: z.boolean().optional(),          // show in homepage showcase
    order: z.number(),
    // Pricing (optional — call for some products)
    price: z.string().optional(),             // "$140 per yard"
    totePrice: z.string().optional(),         // "$300 per 2-yard tote"
    // Fertilizer specs
    npk: z.string().optional(),              // "5-4-2"
    // Blend composition
    components: z.array(z.string()).optional(),     // base materials %
    enhancedWith: z.array(z.string()).optional(),   // amendment list
    fertilizerIncluded: z.string().optional(),      // "20 lbs fertilizer + 10 lbs 8-3-1 bat guano"
    // Usage meta
    usage: z.string().optional(),
    season: z.string().optional(),
    releaseType: z.string().optional(),
    bestFor: z.string().optional(),
  }),
});

const testimonials = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/testimonials' }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    rating: z.number(),
    order: z.number(),
  }),
});

export const collections = { blog, products, testimonials };
