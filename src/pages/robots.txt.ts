import type { APIRoute } from 'astro';
import { absolute } from '../lib/site';

export const GET: APIRoute = ({ site }) =>
  new Response(`User-agent: *\nDisallow: ${new URL(absolute('/admin/', site)).pathname}\n\nSitemap: ${absolute('/sitemap-index.xml', site)}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
