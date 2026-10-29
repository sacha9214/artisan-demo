# Morel Finitions: artisan website template

A fast, SEO-ready website for a French tradesperson (*artisan du bâtiment*), with a project gallery, a quote form and an admin panel the owner can use without touching code.

**Morel Finitions is a fictional business.** This repo is a portfolio demo and a starting point for real client sites. The interface is in French and the code is in English.

## What's inside

| Feature | How |
|---|---|
| Pages | Home, 4 service pages, project gallery + 6 project pages, quote form, legal notice, 404 |
| Gallery | Filter by service (works without JS), lightbox with keyboard and swipe, before/after toggle |
| Quote form | Inline validation in French, honeypot anti-spam, pre-ticks the service when coming from a service page, sends to Formspree or Web3Forms |
| Owner admin | [Decap CMS](https://decapcms.org) at `/admin/`, in French: projects, services, home page, business details |
| Local SEO | `HousePainter` / `LocalBusiness` JSON-LD (area served, hours, geo), `Service` and `BreadcrumbList` schema, per-page titles and descriptions, sitemap, robots.txt, canonical URLs |
| Performance | Static HTML, under 4 KB of JS per page (no framework runtime), responsive images, no tracking or cookies, so no consent banner is needed |
| Mobile | Sticky "Appeler / Devis gratuit" bar, click-to-call everywhere |

Stack: [Astro 7](https://astro.build), plain CSS, a self-hosted font (Bricolage Grotesque) and [Lucide](https://lucide.dev) icons. There's no database or server: the site can be hosted for free.

## Run it

```bash
npm install
npm run dev        # http://localhost:4321, admin at http://localhost:4321/admin/
npm run build      # static site in dist/
npm run check      # type-check
```

## Where the content lives

Everything the owner edits is a plain file, versioned in Git:

```
src/content/settings/site.json   business name, phone, hours, towns served, form settings
src/content/pages/home.json      home page text, highlights, steps, testimonials, FAQ
src/content/services/*.md        one file per service
src/content/realisations/*.md    one file per project (photos, town, date, story)
public/uploads/                  photos uploaded through the admin
```

The admin fields are defined in `src/lib/cms.ts`, and the matching validation lives in `src/content.config.ts`. Keep the two in sync when you add a field.

## Demo mode vs. a real client

With `"demo": true` in `site.json`, every page is marked `noindex` (a fictional business must not appear in Google, where real customers would try to reach it), and the admin uses Decap's in-memory `test-repo` backend. Visitors can click "Se connecter" and try everything; nothing is saved, and a reload resets it. That's what makes the live demo useful in a sales pitch.

To turn this into a real client site:

1. **Replace the content.** Business details go in `site.json`. Use real photos, real projects and **real testimonials only**: fake reviews are illegal in France (*pratique commerciale trompeuse*). Set `"demo": false` (this also lets Google index the site) and clear `creditLabel` if the client doesn't want the credit.
2. **Quote form.** Create a free form on [Web3Forms](https://web3forms.com) (paste the access key into `formAccessKey`) or on [Formspree](https://formspree.io). Then put the endpoint URL in `formEndpoint`. While `formEndpoint` is empty, the form runs in demo mode and sends nothing.
3. **Admin login.** Build with the GitHub backend:
   ```bash
   CMS_BACKEND=github CMS_REPO=owner/repo SITE_URL=https://www.client.fr npm run build
   ```
   The owner needs a free GitHub account, added as a collaborator on the repo. Login runs through a GitHub OAuth app:
   - **Netlify:** the simplest option, since it provides the OAuth endpoint.
   - **Anywhere else:** run a small OAuth proxy and pass its URL as `CMS_AUTH_URL`. See the [Decap docs on backends](https://decapcms.org/docs/backends-overview/).

   Each save from the admin becomes a Git commit, and the host rebuilds the site in about a minute.
4. **Domain and Google.**
   - Buy the domain **in the client's name**. Point it at the host, then set `SITE_URL`.
   - Create or claim the client's **Google Business Profile**, and put its URL in `googleBusinessUrl`.
   - Submit `sitemap-index.xml` in Google Search Console.
5. **Legal notice.** Check `/mentions-legales/`: SIRET, insurance, host. The data section assumes the only personal data collected is the quote form.

### Running cost for the client

Hosting on Netlify, Cloudflare Pages or GitHub Pages is free at this size. Forms are free up to the provider's monthly limit. That leaves only the domain, about 10 to 15 € a year, which is a strong selling point against WordPress hosting and its maintenance.

### Deploying under a sub-path (GitHub Pages project site)

```bash
SITE_URL=https://user.github.io BASE_PATH=/repo-name npm run build
```

All links and assets follow `BASE_PATH`. One limitation: images uploaded through the admin are previewed in the admin without the sub-path. They still display correctly on the site.

## SEO notes

- **Titles:** each page targets "service + town", for example *Peintre en bâtiment à Joué-lès-Tours*. Each project page adds its own town, which is where local long-tail traffic comes from. Titles stay around 60 characters.
- **No city doorway pages:** the towns served are listed once and declared in `areaServed`. Google penalises near-duplicate "Peintre à <ville>" pages.
- **No review stars in structured data:** Google ignores self-published ratings on a LocalBusiness. Real reviews belong on the Google Business Profile.
- **FAQ markup:** the home page has `FAQPage` markup. Google no longer shows it as a rich result for most sites, but it's harmless and other engines read it.

## Credits

Demo photos come from [Unsplash](https://unsplash.com) (Unsplash License) and are hotlinked from their CDN. The phone number is fictitious.
