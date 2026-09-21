import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { projects } from '../data/projects';

/* Built once at build time and fetched lazily the first time someone opens
   search, so the homepage HTML does not carry the whole corpus. Articles and
   projects share one index: the search box covers both. */
export const GET: APIRoute = async () => {
  const posts = await getCollection('blog', ({ data }) => !data.draft);

  // Frontmatter has turned up both flat and nested across content versions, so
  // read it the same defensive way the listing markup does.
  const field = (post: any, key: string) => post.data?.data?.[key] ?? post.data?.[key];

  const articles = posts
    .map((post: any) => ({
      kind: 'article' as const,
      id: post.id,
      title: field(post, 'title') ?? post.id,
      description: field(post, 'description') ?? '',
      tags: field(post, 'tags') ?? [],
      pubDate: field(post, 'pubDate') ?? null,
    }))
    .sort((a, b) => {
      const da = a.pubDate ? new Date(a.pubDate).getTime() : 0;
      const db = b.pubDate ? new Date(b.pubDate).getTime() : 0;
      return db - da;
    });

  const projectEntries = projects.map((project) => ({
    kind: 'project' as const,
    name: project.name,
    url: project.url,
    category: project.category,
    tags: project.tags,
    blurb: project.blurb,
  }));

  return new Response(JSON.stringify({ articles, projects: projectEntries }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
