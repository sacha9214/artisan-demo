import type { APIRoute } from 'astro';
import { cmsConfig } from '../../lib/cms';

// JSON is valid YAML, and Decap parses it as such: no YAML serializer needed.
export const GET: APIRoute = ({ site }) =>
  new Response(JSON.stringify(cmsConfig(site), null, 2), { headers: { 'Content-Type': 'text/yaml; charset=utf-8' } });
