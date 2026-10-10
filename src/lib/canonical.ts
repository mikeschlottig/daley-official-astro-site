// Canonical, slash-less URL for a page. With build.format 'file', Astro.url.pathname is
// "/blog.html" at build time while the URL served (and listed in the sitemap) is "/blog".
export function canonicalFor(pathname: string, site: URL | undefined): string {
  const path = pathname.replace(/(?:\/index)?\.html$/, '').replace(/\/+$/, '') || '/';
  return new URL(path, site).href;
}
