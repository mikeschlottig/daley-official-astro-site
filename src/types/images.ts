/** An image prepared at build time: a default WebP URL plus a responsive srcset. */
export type ResponsiveImage = {
  src: string;
  srcSet: string;
};

/** Keyed by the original public path used in site-config.ts, e.g. "/images/hero-garden.jpg". */
export type ImageMap = Readonly<Record<string, ResponsiveImage>>;
