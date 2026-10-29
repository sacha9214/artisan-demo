import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// SITE_URL and BASE_PATH let the same code deploy to a custom domain
// (https://www.client.fr, base "/") or to GitHub Pages (https://user.github.io, base "/repo").
export default defineConfig({
  site: process.env.SITE_URL || 'https://morel-finitions.example',
  base: process.env.BASE_PATH || '/',
  trailingSlash: 'always',
  integrations: [sitemap({ filter: (page) => !page.includes('/admin/') })],
});
