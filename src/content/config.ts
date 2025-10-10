import { defineCollection, z } from 'astro:content';

// GitHub username and topic to search for
const GITHUB_USERNAME = 'Xaxis';
const BLOG_TOPIC = 'randoblog';


// Fallback list in case API fails (your current repos)
const FALLBACK_REPOS = [
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

// Function to fetch repositories tagged with the blog topic
const fetchRandoblogRepos = async () => {
  try {
    console.log(`Fetching repositories tagged with "${BLOG_TOPIC}" from ${GITHUB_USERNAME}...`);

    // Ensure we have a GitHub token for API calls
    if (!process.env.GITHUB_TOKEN) {
      console.warn('No GITHUB_TOKEN found in environment variables. Using fallback repo list.');
      return FALLBACK_REPOS;
    }

    // Use the Search API to reliably fetch repos with the topic
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
      console.warn(`Failed to search repositories: ${response.status} ${response.statusText}. Using fallback repo list.`);
      return FALLBACK_REPOS;
    }

    const searchData = await response.json();
    const items = Array.isArray(searchData.items) ? searchData.items : [];

    if (items.length === 0) {
      console.warn(`No repositories found with "${BLOG_TOPIC}" topic. Using fallback repo list.`);
      return FALLBACK_REPOS;
    }

    // Map to owner/name and ensure most-recent-first order
    const repoList = items.map((repo: any) => `${repo.owner?.login || GITHUB_USERNAME}/${repo.name}`);
    console.log(`✓ Found ${repoList.length} repositories tagged with "${BLOG_TOPIC}":`, repoList);

    return repoList;
  } catch (error) {
    console.error('Error fetching randoblog repositories:', error);
    console.log('Using fallback repo list due to API error.');
    return FALLBACK_REPOS;
  }
};

// Custom loader to fetch README files from GitHub repositories
const githubLoader = async () => {
  const entries = [];

  // Fetch repositories dynamically
  const GITHUB_REPOS = await fetchRandoblogRepos();

  if (GITHUB_REPOS.length === 0) {
    console.error('❌ No repositories found! This should not happen with fallback list.');
    return [];
  }

  console.log(`📚 Processing ${GITHUB_REPOS.length} repositories for blog content...`);

  for (const repo of GITHUB_REPOS) {
    try {
      console.log(`Fetching content from ${repo}...`);

      // Fetch README content with cache busting
      const response = await fetch(`https://api.github.com/repos/${repo}/readme?t=${Date.now()}&v=4&r=${Math.random()}`, {
        headers: {
          'Accept': 'application/vnd.github.v3.raw',
          'User-Agent': 'randoblog/1.0',
          'X-GitHub-Api-Version': '2022-11-28',
          'Cache-Control': 'no-cache',
          // Add GitHub token for higher rate limits (optional for public repos)
          ...(process.env.GITHUB_TOKEN && {
            'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`
          })
        }
      });

      if (!response.ok) {
        console.warn(`Failed to fetch ${repo} via API: ${response.status} ${response.statusText}`);

        // Try alternative raw fetch regardless of status (handles 401, 403, 404, etc.)
        console.log(`Trying raw README fetch for ${repo}...`);

        const candidates = [
          'README.md','Readme.md','readme.md','README.MD',
          'README','readme','docs/README.md','Docs/README.md','docs/readme.md','index.md'
        ];
        const branches = ['main', 'master'];
        let rawContent: string | null = null;

        for (const branch of branches) {
          for (const file of candidates) {
            const url = `https://raw.githubusercontent.com/${repo}/${branch}/${file}?t=${Date.now()}&v=4&r=${Math.random()}`;
            try {
              const rawResp = await fetch(url);
              if (rawResp.ok) {
                rawContent = await rawResp.text();
                break;
              }
            } catch { /* ignore and try next */ }
          }
          if (rawContent) break;
        }

        if (rawContent) {
          let content = rawContent;
          // Clean up ANSI color codes that might interfere with rendering
          content = content.replace(/\x1b\[[0-9;]*[mK]/g, '');

          console.log(`✓ Fetched content (raw) from ${repo}`);

          // Parse frontmatter if it exists
          const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
          let frontmatter = {} as any;
          let body = content;

          if (frontmatterMatch) {
            try {
              const yamlContent = frontmatterMatch[1];
              const lines = yamlContent.split(/\r?\n/).filter(line => line.trim());

              for (const line of lines) {
                const colonIndex = line.indexOf(':');
                if (colonIndex > 0) {
                  const key = line.substring(0, colonIndex).trim();
                  let value = line.substring(colonIndex + 1).trim();

                  // Remove quotes if present
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
                  // Parse dates (specifically for pubDate and updatedDate)
                  else if ((key === 'pubDate' || key === 'updatedDate') && !isNaN(Date.parse(value))) {
                    frontmatter[key] = new Date(value);
                  }
                  // String values
                  else {
                    frontmatter[key] = value;
                  }
                }
              }
              body = frontmatterMatch[2];

            } catch (error) {
              console.warn(`Failed to parse frontmatter for ${repo}:`, error);
            }
          }

          // Create entry with parsed frontmatter
          const entryData = {
            title: frontmatter.title || repo.split('/')[1] || repo,
            description: frontmatter.description || `Content from ${repo}`,
            pubDate: frontmatter.pubDate || new Date(),
            updatedDate: frontmatter.updatedDate,
            heroImage: frontmatter.heroImage,
            tags: frontmatter.tags || [],
            repository: repo,
            repositoryUrl: `https://github.com/${repo}`,
            draft: frontmatter.draft || false,
            // Add any other frontmatter fields
            ...Object.fromEntries(
              Object.entries(frontmatter).filter(([key]) =>
                !['title', 'description', 'pubDate', 'updatedDate', 'heroImage', 'tags', 'draft'].includes(key)
              )
            )
          };

          const entry = {
            id: repo.replace('/', '-').toLowerCase(),
            body: body.trim(),
            data: entryData
          };

          entries.push(entry);
          continue;
        }

        console.warn(`Raw README fetch failed for ${repo}. Creating placeholder entry.`);
        // As a last resort, create a minimal placeholder entry so production count stays accurate
        let repoData: any = {};
        try {
          const repoResp = await fetch(`https://api.github.com/repos/${repo}`, {
            headers: {
              'Accept': 'application/vnd.github.v3+json',
              'User-Agent': 'randoblog/1.0',
              'X-GitHub-Api-Version': '2022-11-28',
              ...(process.env.GITHUB_TOKEN && { 'Authorization': `Bearer ${process.env.GITHUB_TOKEN}` })
            }
          });
          if (repoResp.ok) repoData = await repoResp.json();
        } catch {}

        const placeholder = {
          id: repo.replace('/', '-').toLowerCase(),
          body: `Content for ${repo} could not be loaded at build time. Visit the repository for details.`,
          data: {
            title: repoData.name || repo.split('/')[1] || repo,
            description: repoData.description || `Content from ${repo}`,
            pubDate: repoData.created_at ? new Date(repoData.created_at) : new Date(),
            updatedDate: repoData.updated_at ? new Date(repoData.updated_at) : undefined,
            heroImage: undefined,
            tags: repoData.topics || [],
            repository: repo,
            repositoryUrl: repoData.html_url || `https://github.com/${repo}`,
            draft: false,
            missingContent: true
          }
        } as any;

        entries.push(placeholder);
        continue;
      }

      let content = await response.text();

      // Clean up ANSI color codes that might interfere with rendering
      content = content.replace(/\x1b\[[0-9;]*[mK]/g, '');

      // Fetch repository metadata
      const repoResponse = await fetch(`https://api.github.com/repos/${repo}`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'randoblog/1.0',
          'X-GitHub-Api-Version': '2022-11-28',
          ...(process.env.GITHUB_TOKEN && {
            'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`
          })
        }
      });

      let repoData = {} as any;
      if (repoResponse.ok) {
        repoData = await repoResponse.json();
      }

      // Extract frontmatter if it exists
      const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
      let frontmatter = {} as any;
      let body = content;

      if (frontmatterMatch) {
        try {

          const yamlContent = frontmatterMatch[1];
          const lines = yamlContent.split(/\r?\n/);
          for (const line of lines) {
            const match = line.match(/^(\w+):\s*(.+)$/);
            if (match) {
              const [, key, value] = match;
              let parsedValue = value.trim();

              // Remove quotes if present
              if ((parsedValue.startsWith('"') && parsedValue.endsWith('"')) ||
                  (parsedValue.startsWith("'") && parsedValue.endsWith("'"))) {
                parsedValue = parsedValue.slice(1, -1);
              }

              // Parse arrays
              if (parsedValue.startsWith('[') && parsedValue.endsWith(']')) {
                frontmatter[key] = parsedValue.slice(1, -1).split(',').map(s => s.trim().replace(/['"]/g, ''));
              }
              // Parse booleans
              else if (parsedValue === 'true' || parsedValue === 'false') {
                frontmatter[key] = parsedValue === 'true';
              }
              // Parse dates
              else if (key.toLowerCase().includes('date') && !isNaN(Date.parse(parsedValue))) {
                frontmatter[key] = new Date(parsedValue);
              }
              // String values
              else {
                frontmatter[key] = parsedValue;
              }
            }
          }
          body = frontmatterMatch[2];

        } catch (error) {
          console.warn(`Failed to parse frontmatter for ${repo}:`, error);
        }
      } else {
        console.log(`No frontmatter found for ${repo}`);
      }

      // Create entry
      const entryData = {
        title: frontmatter.title || repoData.name || repo.split('/')[1] || repo,
        description: frontmatter.description || repoData.description || `Content from ${repo}`,
        pubDate: frontmatter.pubDate || (repoData.created_at ? new Date(repoData.created_at) : new Date()),
        updatedDate: frontmatter.updatedDate || (repoData.updated_at ? new Date(repoData.updated_at) : undefined),
        heroImage: frontmatter.heroImage,
        tags: frontmatter.tags || (repoData.topics ? repoData.topics : []),
        repository: repo,
        repositoryUrl: repoData.html_url || `https://github.com/${repo}`,
        draft: frontmatter.draft || false,
        // Add any other frontmatter fields (excluding the ones we already handle)
        ...Object.fromEntries(
          Object.entries(frontmatter).filter(([key]) =>
            !['title', 'description', 'pubDate', 'updatedDate', 'heroImage', 'tags', 'draft'].includes(key)
          )
        )
      };

      const entry = {
        id: repo.replace('/', '-').toLowerCase(),
        body: body.trim(),
        data: entryData
      };

      entries.push(entry);
      console.log(`✓ Fetched content from ${repo}`);

    } catch (error) {
      console.error(`Error fetching ${repo}:`, error);
    }
  }

  // Sort entries by publish date (newest first)
  entries.sort((a, b) => {
    const dateA = a.data.pubDate ? new Date(a.data.pubDate) : new Date(0);
    const dateB = b.data.pubDate ? new Date(b.data.pubDate) : new Date(0);
    return dateB.getTime() - dateA.getTime();
  });

  console.log(`Loaded ${entries.length} entries from GitHub repositories tagged with "${BLOG_TOPIC}"`);
  return entries;
};

const blog = defineCollection({
  loader: githubLoader,
});

export const collections = { blog };
