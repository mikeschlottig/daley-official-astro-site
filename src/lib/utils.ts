/**
 * Estimates word count from markdown content string.
 * Strips frontmatter, HTML tags, markdown syntax, and URLs.
 */
export function estimateWordCount(markdown: string): number {
  const stripped = markdown
    .replace(/^---[\s\S]*?---\s*/m, '')  // frontmatter
    .replace(/<[^>]+>/g, '')               // HTML tags
    .replace(/!\[.*?\]\(.*?\)/g, '')       // images
    .replace(/\[([^\]]*)\]\(.*?\)/g, '$1') // links → text
    .replace(/```[\s\S]*?```/g, '')        // code blocks
    .replace(/`[^`]+`/g, '')               // inline code
    .replace(/^#{1,6}\s+/gm, '')           // headings
    .replace(/[*_~]+/g, '')                // bold/italic/strikethrough
    .replace(/https?:\/\/\S+/g, '');       // bare URLs

  return stripped.split(/\s+/).filter(w => w.length > 0).length;
}
