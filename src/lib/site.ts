import site from '../content/settings/site.json';
import home from '../content/pages/home.json';

export { site, home };

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

/** Prefixes an internal path with the deploy base ("/" or "/repo-name"). */
export const url = (path = '/') => BASE + (path.startsWith('/') ? path : `/${path}`);

/** "02 61 91 37 42" -> "tel:+33261913742" */
export const telHref = (phone: string) => 'tel:' + phone.replace(/[^\d+]/g, '').replace(/^0/, '+33');

/** "02 61 91 37 42" -> "+33261913742", the form schema.org expects. */
export const telIntl = (phone: string) => telHref(phone).slice(4);

const isUnsplash = (src: string) => src.startsWith('https://images.unsplash.com/');

/**
 * Image URL at a given width. Unsplash photos are resized by their CDN; photos the owner
 * uploads through the CMS live in /public/uploads and are served as-is.
 */
export function img(src: string, width = 1200, height?: number) {
  if (isUnsplash(src)) {
    const params = new URLSearchParams({ auto: 'format', fit: 'crop', w: String(width), q: '70' });
    if (height) params.set('h', String(height));
    return `${src.split('?')[0]}?${params}`;
  }
  return src.startsWith('/') ? url(src) : src;
}

/** Responsive srcset for a fixed aspect ratio (height/width), or undefined for local files. */
export function srcset(src: string, ratio?: number, widths = [480, 800, 1200, 1600]) {
  if (!isUnsplash(src)) return undefined;
  return widths.map((w) => `${img(src, w, ratio ? Math.round(w * ratio) : undefined)} ${w}w`).join(', ');
}

/** Absolute URL, for canonical links, Open Graph and structured data. */
export const absolute = (path: string, siteUrl: URL | undefined) =>
  new URL(path.startsWith('http') ? path : url(path), siteUrl ?? 'https://example.com').href;

export const yearsActive = () => new Date().getFullYear() - site.founded;

export const formatDate = (d: Date) =>
  d.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
