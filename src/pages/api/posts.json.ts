import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async ({ url }) => {
  const searchParams = new URL(url).searchParams;
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const offset = (page - 1) * limit;

  try {
    const posts = await getCollection('blog', ({ data }) => {
      return !data.draft;
    });

    // Sort posts by date (newest first)
    posts.sort((a, b) => {
      const dateA = a.data.pubDate ? new Date(a.data.pubDate) : new Date(0);
      const dateB = b.data.pubDate ? new Date(b.data.pubDate) : new Date(0);
      return dateB.getTime() - dateA.getTime();
    });

    // Paginate posts
    const paginatedPosts = posts.slice(offset, offset + limit);
    const hasMore = offset + limit < posts.length;

    // Format posts for JSON response
    const formattedPosts = paginatedPosts.map(post => ({
      id: post.id,
      title: post.data?.data?.title || post.data?.title || post.id,
      description: post.data?.data?.description || post.data?.description || 'No description available',
      pubDate: post.data?.data?.pubDate || post.data?.pubDate,
      tags: post.data?.data?.tags || post.data?.tags || [],
      repository: post.data?.data?.repository || post.data?.repository,
      repositoryUrl: post.data?.data?.repositoryUrl || post.data?.repositoryUrl,
      url: `/randoblog/blog/${post.id}`
    }));

    return new Response(JSON.stringify({
      posts: formattedPosts,
      hasMore,
      page,
      total: posts.length
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return new Response(JSON.stringify({
      error: 'Failed to fetch posts'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
