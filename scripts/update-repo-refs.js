#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTENT_DIR = path.join(__dirname, '../src/content/blog');

// Find all index.md files
const files = fs.readdirSync(CONTENT_DIR)
  .filter(dir => {
    const stat = fs.statSync(path.join(CONTENT_DIR, dir));
    return stat.isDirectory();
  })
  .map(dir => path.join(CONTENT_DIR, dir, 'index.md'))
  .filter(file => fs.existsSync(file));

console.log(`Found ${files.length} blog posts to update...\n`);

let updated = 0;

for (const file of files) {
  try {
    let content = fs.readFileSync(file, 'utf8');

    const folderName = path.basename(path.dirname(file));

    // Replace repository field
    content = content.replace(
      /repository: "Xaxis\/[^"]+"/g,
      'repository: "Xaxis/randoblog"'
    );

    // Replace repositoryUrl field to point to the specific index.md file
    content = content.replace(
      /repositoryUrl: "https:\/\/github\.com\/Xaxis\/[^"]+"/g,
      `repositoryUrl: "https://github.com/Xaxis/randoblog/blob/main/src/content/blog/${folderName}/index.md"`
    );

    fs.writeFileSync(file, content, 'utf8');

    console.log(`✅ Updated ${folderName}`);
    updated++;

  } catch (error) {
    console.error(`❌ Failed to update ${file}:`, error.message);
  }
}

console.log(`\n✨ Updated ${updated} blog posts!`);

