import type { APIRoute } from 'astro';

// Demo mode only: hands the site's current content to Decap's in-memory "test-repo" backend,
// so visitors trying /admin see (and can edit) the real pages without touching anything.
const files = import.meta.glob('/src/content/{realisations,services}/*.md', { query: '?raw', import: 'default', eager: true });
const data = import.meta.glob('/src/content/{settings,pages}/*.json', { query: '?raw', import: 'default', eager: true });

export const GET: APIRoute = () => {
  const tree: Record<string, Record<string, { content: string; path: string }>> = {};
  for (const [path, content] of Object.entries({ ...files, ...data })) {
    const [, folder, name] = path.match(/^\/src\/content\/([^/]+)\/(.+)$/)!;
    (tree[folder] ??= {})[name] = { content: content as string, path: `${folder}/${name}` };
  }
  return new Response(`window.repoFiles = ${JSON.stringify(tree)};\n`, {
    headers: { 'Content-Type': 'text/javascript; charset=utf-8' },
  });
};
