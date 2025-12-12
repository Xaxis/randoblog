import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Define the blog collection schema
const blog = defineCollection({
  loader: glob({ pattern: '**/index.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    tags: z.array(z.string()).default([]),
    repository: z.string(),
    repositoryUrl: z.string(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };

