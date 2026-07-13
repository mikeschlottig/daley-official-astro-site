#!/usr/bin/env python3
"""Generate 18 blog markdown files from JSON sources."""
import json
import os
import re

OUTPUT_DIR = "/home/mikes/daley-official-astro-site/src/content/blog"
JSON_DIR = "/home/mikes/daley-official-astro-site/posts-seo-enhancements-etc"

# Product name to slug mapping
PRODUCT_SLUGS = {
    "Daley's Mix": "daleys-mix",
    "Premium Soil Mix": "premium-soil-mix",
    "Merlin Blend": "merlin-blend",
    "Grow Blend 5-4-2": "grow-blend",
    "Grow Blend (5-4-2)": "grow-blend",
    "Bloom Blend 2-7-7": "bloom-blend",
    "Bloom Blend (2-7-7)": "bloom-blend",
    "Premium Organic Compost": None,  # not in template map
}

# Image mapping: slug -> filename in src/assets/images + blog-images.ts
IMAGE_MAP = {
    "coco-coir-sustainable-alternative": "soil-mix.jpg",
    "peat-moss-ancient-carbon": "farm-landscape.jpg",
    "perlite-volcanic-glass-drainage": "rock-dust.jpg",
    "pumice-porous-rock-soil": "rock-dust.jpg",
    "composting-science-soil-biology": "compost-hands.jpg",
    "bat-guano-cave-fertilizer": "bat-guano.jpg",
    "fish-bone-meal-phosphorus": "fish-bone-meal.jpg",
    "fish-meal-nitrogen-ocean": "fish-bone-meal.jpg",
    "feather-meal-slow-nitrogen": "fertilizer-blend.jpg",
    "greensand-ancient-seabed": "rock-dust.jpg",
    "alfalfa-meal-triacontanol": "happy-gardener.jpg",
    "soybean-meal-balanced-nitrogen": "soil-mix.jpg",
    "oyster-shell-calcium-ph": "daleys-bone-meal.png",
    "crab-meal-chitin-pest-defense": "worm-castings.jpg",
    "shrimp-meal-trace-minerals": "daleys-seabird-guano.png",
    "k-mag-langbeinite-triple-mineral": "rock-dust.jpg",
    "dolomite-lime-calcium-magnesium": "compost-hands.jpg",
    "humic-acids-leonardite-soil": "soil-mix.jpg",
}

# Reading time estimates
READING_TIME = {
    "coco-coir-sustainable-alternative": "5 min read",
    "peat-moss-ancient-carbon": "5 min read",
    "perlite-volcanic-glass-drainage": "5 min read",
    "pumice-porous-rock-soil": "5 min read",
    "composting-science-soil-biology": "5 min read",
    "bat-guano-cave-fertilizer": "6 min read",
    "fish-bone-meal-phosphorus": "5 min read",
    "fish-meal-nitrogen-ocean": "5 min read",
    "feather-meal-slow-nitrogen": "6 min read",
    "greensand-ancient-seabed": "5 min read",
    "alfalfa-meal-triacontanol": "5 min read",
    "soybean-meal-balanced-nitrogen": "5 min read",
    "oyster-shell-calcium-ph": "5 min read",
    "crab-meal-chitin-pest-defense": "5 min read",
    "shrimp-meal-trace-minerals": "5 min read",
    "k-mag-langbeinite-triple-mineral": "5 min read",
    "dolomite-lime-calcium-magnesium": "5 min read",
    "humic-acids-leonardite-soil": "6 min read",
}

def tldr_to_array(tldr_string):
    """Convert TLDR string to array of bullet points."""
    # Split by sentence-ending periods, but not decimals like 5-10 or 2.5
    # Use regex to split on '. ' or '.\n' but not within numbers
    sentences = re.split(r'(?<!\d)\.\s+', tldr_string.strip())
    result = []
    for s in sentences:
        s = s.strip()
        if s and len(s) > 10:
            # Remove trailing period if present
            if s.endswith('.'):
                s = s[:-1]
            result.append(s)
    return result

def map_products(products_used_in):
    """Map product names to slugs."""
    slugs = []
    for p in products_used_in:
        slug = PRODUCT_SLUGS.get(p)
        if slug and slug not in slugs:
            slugs.append(slug)
    return slugs

def escape_yaml(s):
    """Escape a string for YAML frontmatter."""
    if '"' in s or ':' in s or '#' in s or '&' in s or '*' in s:
        return s.replace('"', '\\"')
    return s

def generate_post(post):
    """Generate markdown content for a single post."""
    slug = post["slug"]
    title = post["title"]
    excerpt = post["metaDescription"]
    keywords = post.get("keywords", "")
    tags = [t.strip() for t in keywords.split(",")] if keywords else []
    tldr = tldr_to_array(post["tldr"])
    products = map_products(post.get("productsUsedIn", []))
    content = post["content"]
    image = IMAGE_MAP.get(slug, "hero-garden.jpg")
    reading_time = READING_TIME.get(slug, "5 min read")
    faqs = post.get("faqs", [])
    ingredient_name = post.get("ingredientName", "")
    ingredient_desc = post.get("ingredientDescription", "")

    # Build frontmatter
    lines = ["---"]
    lines.append(f'title: "{escape_yaml(title)}"')
    lines.append(f'excerpt: "{escape_yaml(excerpt)}"')
    lines.append(f'date: "July 12, 2026"')
    lines.append(f'category: "Ingredients"')
    lines.append(f'image: "{image}"')
    lines.append(f'author: "Cameron Daley"')
    lines.append(f'readingTime: "{reading_time}"')

    # Tags
    tags_str = ", ".join(f'"{t}"' for t in tags[:6])
    lines.append(f'tags: [{tags_str}]')

    # TLDR
    lines.append("tldr:")
    for item in tldr:
        # Escape quotes in tldr items
        item_escaped = item.replace('"', '\\"')
        lines.append(f'  - "{item_escaped}"')

    # Related products
    if products:
        prods_str = ", ".join(f'"{p}"' for p in products)
        lines.append(f'relatedProducts: [{prods_str}]')

    # Ingredient fields for schema
    if ingredient_name:
        lines.append(f'ingredientName: "{escape_yaml(ingredient_name)}"')
    if ingredient_desc:
        lines.append(f'ingredientDescription: "{escape_yaml(ingredient_desc)}"')

    # FAQs
    if faqs:
        lines.append("faqs:")
        for faq in faqs:
            q = faq["question"].replace('"', '\\"')
            a = faq["answer"].replace('"', '\\"')
            lines.append(f'  - question: "{q}"')
            lines.append(f'    answer: "{a}"')

    lines.append('dateModified: "2026-07-12"')
    lines.append("---")
    lines.append("")

    # Body content
    lines.append(content)
    lines.append("")

    return "\n".join(lines)

def main():
    json_files = [
        os.path.join(JSON_DIR, "daley-blog-posts-tier1-base-media.json"),
        os.path.join(JSON_DIR, "daley-blog-posts-tier2-batch1.json"),
        os.path.join(JSON_DIR, "daley-blog-posts-tier2-batch2.json"),
    ]

    all_slugs = []
    for jf in json_files:
        with open(jf) as f:
            data = json.load(f)
        for post in data["posts"]:
            slug = post["slug"]
            filepath = os.path.join(OUTPUT_DIR, f"{slug}.md")
            content = generate_post(post)
            with open(filepath, "w") as f:
                f.write(content)
            all_slugs.append(slug)
            print(f"Created: {filepath}")

    print(f"\nTotal: {len(all_slugs)} posts created")
    for s in all_slugs:
        print(f"  - {s}")

if __name__ == "__main__":
    main()
