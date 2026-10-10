import type { ImageMap } from '../types/images';

/**
 * Client-safe lookup used by the React islands. Returns the build-time WebP version when the
 * homepage passed one in, otherwise the original public path (which always exists in public/images).
 */
export function pickImage(images: ImageMap | undefined, path: string): { src: string; srcSet?: string } {
  const optimized = images?.[path];
  return optimized ? { src: optimized.src, srcSet: optimized.srcSet } : { src: path };
}
