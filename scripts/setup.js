#!/usr/bin/env node

import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import readline from 'readline';

const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

function exec(command, options = {}) {
  try {
    return execSync(command, { 
      encoding: 'utf8', 
      stdio: options.silent ? 'pipe' : 'inherit',
      ...options 
    });
  } catch (error) {
    if (!options.allowFail) {
      log(`❌ Command failed: ${command}`, 'red');
      log(error.message, 'red');
      process.exit(1);
    }
    return null;
  }
}

function askQuestion(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function updateConfig(username, repoName) {
  // Update astro.config.mjs
  const configPath = 'astro.config.mjs';
  let config = readFileSync(configPath, 'utf8');
  
  config = config.replace(
    /site: 'https:\/\/.*\.github\.io'/,
    `site: 'https://${username}.github.io'`
  );
  
  config = config.replace(
    /base: '\/.*'/,
    `base: '/${repoName}'`
  );
  
  writeFileSync(configPath, config);
  log(`✅ Updated astro.config.mjs with your GitHub info`, 'green');
}

async function main() {
  log('🚀 RANDOBLOG Setup Script', 'cyan');
  log('=========================', 'cyan');
  log('This script will help you set up your blog for GitHub Pages deployment.', 'blue');
  log('');

  // Get user information
  const username = await askQuestion('Enter your GitHub username: ');
  const repoName = await askQuestion('Enter your repository name (default: randoblog): ') || 'randoblog';
  
  log('');
  log('📝 Setting up your blog...', 'blue');

  // Update configuration
  await updateConfig(username, repoName);

  // Check if git is initialized
  const gitStatus = exec('git status', { silent: true, allowFail: true });
  
  if (!gitStatus) {
    log('🔧 Initializing git repository...', 'blue');
    exec('git init');
    exec('git branch -M main');
  }

  // Check if remote exists
  const remoteExists = exec('git remote get-url origin', { silent: true, allowFail: true });
  
  if (!remoteExists) {
    log('🔗 Adding GitHub remote...', 'blue');
    exec(`git remote add origin https://github.com/${username}/${repoName}.git`);
  } else {
    log('ℹ️  Git remote already exists', 'yellow');
  }

  // Add and commit files
  log('📦 Committing files...', 'blue');
  exec('git add .');
  
  const hasCommits = exec('git log --oneline', { silent: true, allowFail: true });
  if (!hasCommits) {
    exec('git commit -m "Initial commit: RANDOBLOG setup"');
  } else {
    exec('git commit -m "Update configuration for deployment" --allow-empty');
  }

  log('');
  log('✅ Setup complete!', 'green');
  log('');
  log('🎯 Next steps:', 'cyan');
  log('1. Create a repository on GitHub:', 'blue');
  log(`   https://github.com/new`, 'blue');
  log(`   Repository name: ${repoName}`, 'blue');
  log(`   Make it PUBLIC (required for free GitHub Pages)`, 'yellow');
  log('');
  log('2. Push your code:', 'blue');
  log('   git push -u origin main', 'cyan');
  log('');
  log('3. Enable GitHub Pages:', 'blue');
  log('   Go to: Repository → Settings → Pages', 'blue');
  log('   Source: GitHub Actions', 'blue');
  log('');
  log('4. Your site will be live at:', 'blue');
  log(`   https://${username}.github.io/${repoName}`, 'cyan');
  log('');
  log('📖 For detailed instructions, see DEPLOYMENT.md', 'magenta');
}

main().catch(error => {
  log(`❌ Setup failed: ${error.message}`, 'red');
  process.exit(1);
});
