# GitHub Content Setup Guide

Your blog is now configured to pull content directly from GitHub repositories! Here's how to set it up:

## 1. Configure Your Repositories

Edit `src/content/config.ts` and add your repository names to the `GITHUB_REPOS` array:

```typescript
const GITHUB_REPOS = [
  'yourusername/repo1',
  'yourusername/repo2', 
  'yourusername/repo3',
  // Add more repositories as needed
];
```

## 2. Prepare Your Repository READMEs

Your README.md files can include frontmatter for better metadata:

```markdown
---
title: "My Awesome Project"
description: "A detailed description of what this project does"
pubDate: 2024-08-13
tags: ["javascript", "web-development", "tutorial"]
draft: false
---

# My Awesome Project

Your regular README content goes here...
```

### Supported Frontmatter Fields:
- `title` - Post title (defaults to repository name)
- `description` - Post description (defaults to repo description)
- `pubDate` - Publication date (defaults to repo creation date)
- `updatedDate` - Last updated date (defaults to repo updated date)
- `tags` - Array of tags (defaults to repo topics)
- `draft` - Whether to hide the post (defaults to false)

## 3. GitHub Token (Optional but Recommended)

For higher API rate limits (5000/hour vs 60/hour):

1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Give it a name like "randoblog"
4. Select scope: `public_repo` (for public repositories)
5. Copy the token

Create a `.env` file in your project root:

```bash
GITHUB_TOKEN=your_token_here
```

## 4. How It Works

- **Build Time**: Content is fetched from GitHub when you build/dev
- **Local Development**: Works perfectly - you'll see live content
- **Caching**: Astro caches the content for performance
- **Frontmatter**: Automatically parsed from your README files
- **Metadata**: Repository info (topics, dates) used as fallbacks

## 5. Content Structure

Each repository README becomes a blog post with:
- **Title**: From frontmatter or repository name
- **Description**: From frontmatter or repository description  
- **Date**: From frontmatter or repository creation date
- **Tags**: From frontmatter or repository topics
- **Repository Link**: Automatic link back to the source repo

## 6. Testing

1. Add your repositories to the `GITHUB_REPOS` array
2. Run `npm run dev`
3. Check the console for fetch logs
4. Visit your blog to see the content

## 7. Deployment

The same setup works for deployment:
- Add `GITHUB_TOKEN` to your deployment environment variables
- The build process will fetch fresh content from GitHub
- No need to manually sync content!

## Example Repository Structure

```
your-repo/
├── README.md          # This becomes your blog post
├── src/              # Your project code
├── docs/             # Additional documentation
└── ...               # Other project files
```

The blog will only use the README.md file - all your other project files remain untouched.
