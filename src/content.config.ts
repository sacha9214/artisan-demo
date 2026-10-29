import { defineCollection, reference } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

// Every field here is edited by the owner in /admin (see src/lib/cms.ts).
// Keep the two files in sync when adding a field.

export const ICONS = ['brick-wall', 'paint-roller', 'thermometer', 'layers', 'hammer', 'paintbrush', 'house', 'ruler'] as const;

const photo = z.object({ image: z.string(), alt: z.string() });

const services = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/services' }),
  schema: z.object({
    title: z.string(),
    order: z.number().default(10),
    icon: z.enum(ICONS).default('paint-roller'),
    summary: z.string(),
    image: z.string(),
    imageAlt: z.string(),
    points: z.array(z.string()).default([]),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
  }),
});

const realisations = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/realisations' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    commune: z.string(),
    service: reference('services'),
    summary: z.string(),
    surface: z.string().optional(),
    duration: z.string().optional(),
    cover: z.string(),
    coverAlt: z.string(),
    featured: z.boolean().default(false),
    gallery: z.array(photo).nullable().default([]),
    // The CMS writes empty strings when the optional "before" photo is left blank.
    before: z.object({ image: z.string().optional(), alt: z.string().optional() }).nullable().optional(),
  }),
});

export const collections = { services, realisations };
