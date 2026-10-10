// Server-only (build time). Turns the "/images/*.jpg" paths used in site-config.ts into
// responsive WebP via astro:assets, so the React islands stop shipping full-size JPGs.
// The source files are the copies in src/assets/images (same filenames as public/images).
import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';
import * as siteConfig from './site-config';
import type { ImageMap, ResponsiveImage } from '../types/images';

const WIDTHS = [480, 800, 1200, 1600];

const assetModules = import.meta.glob<{ default: ImageMetadata }>('../assets/images/*.{jpg,jpeg,png}', {
  eager: true,
});

const assetsByName = new Map(
  Object.entries(assetModules).map(([path, mod]) => [path.split('/').pop() ?? path, mod.default]),
);

/** Every "/images/<file>" path referenced anywhere in site-config.ts. */
export function configImagePaths(): string[] {
  const serialized = JSON.stringify(siteConfig);
  return [...new Set(serialized.match(/\/images\/[\w.-]+\.(?:jpe?g|png)/g) ?? [])];
}

export async function buildImageMap(paths: string[] = configImagePaths()): Promise<ImageMap> {
  const entries: Array<[string, ResponsiveImage]> = [];
  for (const path of paths) {
    const source = assetsByName.get(path.split('/').pop() ?? '');
    if (!source) continue; // not in src/assets → the island falls back to the public/ original
    const widths = WIDTHS.filter((w) => w <= source.width);
    const image = await getImage({ src: source, widths: widths.length ? widths : [source.width], format: 'webp' });
    entries.push([path, { src: image.src, srcSet: image.srcSet.attribute }]);
  }
  return Object.fromEntries(entries);
}
