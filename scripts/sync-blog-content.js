#!/usr/bin/env node

/**
 * Sync Blog Content Script
 * 
 * This script downloads blog content from GitHub repositories tagged with 'randoblog'
 * and saves them as local markdown files in src/content/blog/
 * 
 * Benefits:
 * - Single source of truth (this repo)
 * - Faster builds (no API calls during build)
 * - Better version control
 * - Offline development
 * - No rate limiting issues
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const GITHUB_USERNAME = 'Xaxis';
const BLOG_TOPIC = 'randoblog';
const CONTENT_DIR = path.join(__dirname, '../src/content/blog');

// Fallback list in case API fails
const FALLBACK_REPOS = [
  'Xaxis/bitcoin-quantum-expose',
  'Xaxis/hoard-the-coins-not-the-rules',
  'Xaxis/deficits-are-not-private-surplus',
  'Xaxis/how-to-talk-to-something-smarter',
  'Xaxis/super-intelligence-when-boundaries-fail',
  'Xaxis/basement-bitcoin-hash-plan',
  'Xaxis/bitcoin-weird-edges-real-risks',
  'Xaxis/proof-over-identity-bitcoiners-case-for-lock',
  'Xaxis/orangecheck-bitcoin-reputation-introduction',
  'Xaxis/broken-money-polarized-people',
  'Xaxis/wintering-well-how-to-cross-fourth-turning',
  'Xaxis/age-of-ai-mono-v-poly-culture',
  'Xaxis/mvnav-and-bitcoin-treasury-companies',
  'Xaxis/the-sats-first-shift',
  'Xaxis/a-lightning-flywheel-you-can-actually-run',
  'Xaxis/spacetime-fossil-curvatures',
  'Xaxis/magnets-minerals-and-bitcoin',
  'Xaxis/bitcoin-mad-to-map',
  'Xaxis/bitcoin-nuclear-non-proliferation-plan',
  'Xaxis/bitcoin-when-energy-gets-weird-with-fusion',
  'Xaxis/bitcoin-ai-that-pays-its-own-bills',
  'Xaxis/bitcoin-hide-keys-in-plain-sight',
  'Xaxis/fusion-in-2025',
  'Xaxis/an-open-console-that-could-actually-ship',
  'Xaxis/what-science-is-being-sat-on',
  'Xaxis/quantum-gravity-roadblocks-and-inroads',
  'Xaxis/dialing-up-speed-of-light',
  'Xaxis/bitcoin-and-home-buying-strategy',
  'Xaxis/arizona-radio-observatory-plan',
  'Xaxis/bitcoin-nonprofit-housing',
  'Xaxis/bitcoin-saves-humans-from-ai-redundancy',
  'Xaxis/quantum-brains-disembodied-ai',
  'Xaxis/how-bitcoin-quietly-defunds-the-fed',
  'Xaxis/metrics-to-metal-physical-warp-drives',
  'Xaxis/through-a-wormhole',
  'Xaxis/btc-ar-post',
  'Xaxis/detecting-the-graviton',
  'Xaxis/uapwatch-cubesat',
  'Xaxis/beyond-radio',
  'Xaxis/bitcoin-proof-of-ownership',
  'Xaxis/entangled-black-hole-network',
  'Xaxis/ftl-signalling',
  'Xaxis/wormhole-device',
  'Xaxis/uap-ufo-honeypot-sensor-project',
  'Xaxis/agentic-agi',
  'Xaxis/photonic-foundations',
  'Xaxis/ompsa',
  'Xaxis/modelling-consciousness'
];

// Ensure content directory exists
if (!fs.existsSync(CONTENT_DIR)) {
  fs.mkdirSync(CONTENT_DIR, { recursive: true });
}

// Fetch repositories tagged with the blog topic
async function fetchRandoblogRepos() {
  try {
    console.log(`\n🔍 Fetching repositories tagged with "${BLOG_TOPIC}" from ${GITHUB_USERNAME}...`);

    if (!process.env.GITHUB_TOKEN) {
      console.warn('⚠️  No GITHUB_TOKEN found. Using fallback repo list.');
      return FALLBACK_REPOS;
    }

    const searchUrl = `https://api.github.com/search/repositories?q=user:${GITHUB_USERNAME}+topic:${BLOG_TOPIC}&per_page=100&sort=updated&order=desc`;
    const response = await fetch(searchUrl, {
      headers: {
        'Accept': 'application/vnd.github+json',
        'User-Agent': 'randoblog/1.0',
        'X-GitHub-Api-Version': '2022-11-28',
        'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`
      }
    });

    if (!response.ok) {
      console.warn(`⚠️  API request failed: ${response.status}. Using fallback list.`);
      return FALLBACK_REPOS;
    }

    const searchData = await response.json();
    const items = Array.isArray(searchData.items) ? searchData.items : [];

    if (items.length === 0) {
      console.warn(`⚠️  No repositories found. Using fallback list.`);
      return FALLBACK_REPOS;
    }

    const repoList = items.map((repo) => `${repo.owner?.login || GITHUB_USERNAME}/${repo.name}`);
    console.log(`✅ Found ${repoList.length} repositories`);

    return repoList;
  } catch (error) {
    console.error('❌ Error fetching repositories:', error.message);
    console.log('Using fallback repo list.');
    return FALLBACK_REPOS;
  }
}

// Fetch README content from a repository
async function fetchReadmeContent(repo) {
  const headers = {
    'Accept': 'application/vnd.github.v3.raw',
    'User-Agent': 'randoblog/1.0',
    'X-GitHub-Api-Version': '2022-11-28',
    ...(process.env.GITHUB_TOKEN && {
      'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`
    })
  };

  // Try API first
  try {
    const response = await fetch(`https://api.github.com/repos/${repo}/readme`, { headers });
    if (response.ok) {
      return await response.text();
    }
  } catch (error) {
    // Fall through to raw fetch
  }

  // Try raw GitHub URLs
  const candidates = ['README.md', 'Readme.md', 'readme.md', 'README.MD', 'README', 'readme'];
  const branches = ['main', 'master'];

  for (const branch of branches) {
    for (const file of candidates) {
      try {
        const url = `https://raw.githubusercontent.com/${repo}/${branch}/${file}`;
        const response = await fetch(url);
        if (response.ok) {
          return await response.text();
        }
      } catch (error) {
        // Continue trying
      }
    }
  }

  throw new Error('README not found');
}

// Fetch repository metadata
async function fetchRepoMetadata(repo) {
  try {
    const response = await fetch(`https://api.github.com/repos/${repo}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'randoblog/1.0',
        'X-GitHub-Api-Version': '2022-11-28',
        ...(process.env.GITHUB_TOKEN && {
          'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`
        })
      }
    });

    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    // Return empty object if metadata fetch fails
  }
  return {};
}

// Parse frontmatter from markdown content
function parseFrontmatter(content) {
  const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);

  if (!frontmatterMatch) {
    return { frontmatter: {}, body: content };
  }

  const frontmatter = {};
  const yamlContent = frontmatterMatch[1];
  const lines = yamlContent.split(/\r?\n/).filter(line => line.trim());

  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim();
      let value = line.substring(colonIndex + 1).trim();

      // Remove quotes
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }

      // Parse arrays
      if (value.startsWith('[') && value.endsWith(']')) {
        frontmatter[key] = value.slice(1, -1).split(',').map(s => s.trim().replace(/['"]/g, ''));
      }
      // Parse booleans
      else if (value === 'true' || value === 'false') {
        frontmatter[key] = value === 'true';
      }
      // Keep as string
      else {
        frontmatter[key] = value;
      }
    }
  }

  return { frontmatter, body: frontmatterMatch[2] };
}

// Create frontmatter string
function createFrontmatter(data) {
  const lines = ['---'];

  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || value === null) continue;

    if (Array.isArray(value)) {
      lines.push(`${key}: [${value.map(v => `"${v}"`).join(', ')}]`);
    } else if (typeof value === 'boolean') {
      lines.push(`${key}: ${value}`);
    } else if (value instanceof Date) {
      lines.push(`${key}: ${value.toISOString()}`);
    } else {
      lines.push(`${key}: "${value}"`);
    }
  }

  lines.push('---');
  return lines.join('\n');
}

// Sync a single repository
async function syncRepo(repo) {
  try {
    console.log(`  📥 Syncing ${repo}...`);

    // Fetch content and metadata
    const [content, metadata] = await Promise.all([
      fetchReadmeContent(repo),
      fetchRepoMetadata(repo)
    ]);

    // Clean ANSI codes
    const cleanContent = content.replace(/\x1b\[[0-9;]*[mK]/g, '');

    // Parse existing frontmatter
    const { frontmatter, body } = parseFrontmatter(cleanContent);

    // Create complete frontmatter with defaults from repo metadata
    const completeFrontmatter = {
      title: frontmatter.title || metadata.name || repo.split('/')[1],
      description: frontmatter.description || metadata.description || `Content from ${repo}`,
      pubDate: frontmatter.pubDate || (metadata.created_at ? new Date(metadata.created_at).toISOString() : new Date().toISOString()),
      updatedDate: frontmatter.updatedDate || (metadata.updated_at ? new Date(metadata.updated_at).toISOString() : undefined),
      heroImage: frontmatter.heroImage,
      tags: frontmatter.tags || metadata.topics || [],
      repository: repo,
      repositoryUrl: metadata.html_url || `https://github.com/${repo}`,
      draft: frontmatter.draft || false,
      // Include any custom frontmatter fields
      ...Object.fromEntries(
        Object.entries(frontmatter).filter(([key]) =>
          !['title', 'description', 'pubDate', 'updatedDate', 'heroImage', 'tags', 'repository', 'repositoryUrl', 'draft'].includes(key)
        )
      )
    };

    // Create directory for this article
    const repoSlug = repo.replace('/', '-').toLowerCase();
    const articleDir = path.join(CONTENT_DIR, repoSlug);

    if (!fs.existsSync(articleDir)) {
      fs.mkdirSync(articleDir, { recursive: true });
    }

    // Extract and download images
    let processedBody = body.trim();
    const imageRegex = /!\[([^\]]*)\]\((?!https?:\/\/)([^)]+)\)/g;
    const images = [];
    let match;

    while ((match = imageRegex.exec(body)) !== null) {
      images.push({
        alt: match[1],
        path: match[2].replace(/^\.\//, '') // Remove leading ./
      });
    }

    // Download images
    for (const image of images) {
      const branches = ['main', 'master'];
      let downloaded = false;

      for (const branch of branches) {
        try {
          const imageUrl = `https://raw.githubusercontent.com/${repo}/${branch}/${image.path}`;
          const response = await fetch(imageUrl);

          if (response.ok) {
            const buffer = await response.arrayBuffer();
            const imagePath = path.join(articleDir, path.basename(image.path));
            fs.writeFileSync(imagePath, Buffer.from(buffer));
            console.log(`    📷 Downloaded image: ${image.path}`);
            downloaded = true;
            break;
          }
        } catch (error) {
          // Try next branch
        }
      }

      if (!downloaded) {
        console.warn(`    ⚠️  Could not download image: ${image.path}`);
      }
    }

    // Update image paths in markdown to be relative
    processedBody = processedBody.replace(
      /!\[([^\]]*)\]\(\.\/([^)]+)\)/g,
      '![$1]($2)'
    );
    processedBody = processedBody.replace(
      /!\[([^\]]*)\]\((?!https?:\/\/)([^)\/][^)]*)\)/g,
      '![$1]($2)'
    );

    // Create markdown file content
    const markdownContent = `${createFrontmatter(completeFrontmatter)}\n\n${processedBody}\n`;

    // Write the markdown file
    const filePath = path.join(articleDir, 'index.md');
    fs.writeFileSync(filePath, markdownContent, 'utf8');

    console.log(`  ✅ Synced ${repo} → ${repoSlug}/index.md`);
    return { success: true, repo };

  } catch (error) {
    console.error(`  ❌ Failed to sync ${repo}:`, error.message);
    return { success: false, repo, error: error.message };
  }
}

// Main sync function
async function syncAllContent() {
  console.log('\n🚀 Starting blog content sync...\n');

  const repos = await fetchRandoblogRepos();

  if (repos.length === 0) {
    console.error('❌ No repositories to sync!');
    process.exit(1);
  }

  console.log(`\n📚 Syncing ${repos.length} repositories...\n`);

  const results = [];
  for (const repo of repos) {
    const result = await syncRepo(repo);
    results.push(result);
  }

  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  console.log('\n' + '='.repeat(60));
  console.log(`✨ Sync complete!`);
  console.log(`   ✅ Successful: ${successful}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log('='.repeat(60) + '\n');

  if (failed > 0) {
    console.log('Failed repositories:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`  - ${r.repo}: ${r.error}`);
    });
    console.log('');
  }
}

// Run the sync
syncAllContent().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});

