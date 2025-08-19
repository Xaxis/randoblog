import { defineCollection, z } from 'astro:content';

// GitHub repositories to fetch README content from
const GITHUB_REPOS = [
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

// Custom loader to fetch README files from GitHub repositories
const githubLoader = async () => {
  const entries = [];

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
        console.warn(`Failed to fetch ${repo}: ${response.status} ${response.statusText}`);

        // Try alternative approach for public repos
        if (response.status === 401) {
          console.log(`Trying alternative fetch method for ${repo}...`);

          // Try fetching raw content directly (try main branch first, then master) with cache busting
          let rawResponse = await fetch(`https://raw.githubusercontent.com/${repo}/main/README.md?t=${Date.now()}&v=4&r=${Math.random()}`);
          if (!rawResponse.ok) {
            rawResponse = await fetch(`https://raw.githubusercontent.com/${repo}/master/README.md?t=${Date.now()}&v=4&r=${Math.random()}`);
          }

          if (rawResponse.ok) {
            let content = await rawResponse.text();

            // Clean up ANSI color codes that might interfere with rendering
            content = content.replace(/\x1b\[[0-9;]*[mK]/g, '');

            console.log(`✓ Fetched content from ${repo}`);

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
              id: repo.replace('/', '-'),
              body: body.trim(),
              data: entryData
            };

            entries.push(entry);
            continue;
          } else {
            console.warn(`Alternative fetch also failed for ${repo}: ${rawResponse.status}`);
          }
        }

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
        id: repo.replace('/', '-'),
        body: body.trim(),
        data: entryData
      };

      entries.push(entry);
      console.log(`✓ Fetched content from ${repo}`);

    } catch (error) {
      console.error(`Error fetching ${repo}:`, error);
    }
  }

  console.log(`Loaded ${entries.length} entries from GitHub repositories`);
  return entries;
};

const blog = defineCollection({
  loader: githubLoader,
});

export const collections = { blog };
