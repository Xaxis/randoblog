#!/usr/bin/env node

import { execSync } from 'child_process';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

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
    const result = execSync(command, { 
      encoding: 'utf8', 
      stdio: options.silent ? 'pipe' : 'inherit',
      ...options 
    });
    return result;
  } catch (error) {
    log(`❌ Command failed: ${command}`, 'red');
    log(error.message, 'red');
    process.exit(1);
  }
}

function checkGitStatus() {
  try {
    const status = exec('git status --porcelain', { silent: true });
    return status.trim();
  } catch (error) {
    log('❌ Not a git repository or git not available', 'red');
    process.exit(1);
  }
}

function getCurrentBranch() {
  try {
    return exec('git branch --show-current', { silent: true }).trim();
  } catch (error) {
    return 'main';
  }
}

function checkRemoteExists() {
  try {
    exec('git remote get-url origin', { silent: true });
    return true;
  } catch (error) {
    return false;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const force = args.includes('--force');

  log('🚀 RANDOBLOG Deployment Script', 'cyan');
  log('================================', 'cyan');

  // Check if we're in the right directory
  if (!existsSync('astro.config.mjs')) {
    log('❌ Not in the project root directory. Please run from the project root.', 'red');
    process.exit(1);
  }

  // Check git status
  const gitStatus = checkGitStatus();
  if (gitStatus && !force) {
    log('⚠️  You have uncommitted changes:', 'yellow');
    log(gitStatus, 'yellow');
    log('Please commit your changes first, or use --force to deploy anyway.', 'yellow');
    log('Run: npm run deploy:force', 'cyan');
    process.exit(1);
  }

  // Check if remote exists
  if (!checkRemoteExists()) {
    log('❌ No git remote "origin" found. Please set up your GitHub repository first.', 'red');
    log('Run: git remote add origin https://github.com/wilneeley/randoblog.git', 'cyan');
    process.exit(1);
  }

  const currentBranch = getCurrentBranch();
  log(`📍 Current branch: ${currentBranch}`, 'blue');

  // Ensure we're on the main branch (or master)
  if (currentBranch !== 'main' && currentBranch !== 'master' && !force) {
    log('⚠️  You are not on the main/master branch.', 'yellow');
    log('It\'s recommended to deploy from main/master branch.', 'yellow');
    log('Use --force to deploy from current branch anyway.', 'yellow');
    process.exit(1);
  }

  // Build the project
  log('🔨 Building project...', 'blue');
  exec('npm run build');
  log('✅ Build completed successfully!', 'green');

  // Check if dist directory exists
  if (!existsSync('dist')) {
    log('❌ Build output directory "dist" not found.', 'red');
    process.exit(1);
  }

  // Deploy to GitHub Pages using gh-pages branch
  log('📤 Deploying to GitHub Pages...', 'blue');
  
  try {
    // Check if gh-pages branch exists
    try {
      exec('git show-ref --verify --quiet refs/heads/gh-pages', { silent: true });
      log('📋 Using existing gh-pages branch', 'blue');
    } catch (error) {
      log('🆕 Creating new gh-pages branch', 'blue');
    }

    // Deploy using git subtree
    exec('git add dist -f');
    exec('git commit -m "Build for deployment" --allow-empty');
    exec('git subtree push --prefix dist origin gh-pages');
    
    log('✅ Successfully deployed to GitHub Pages!', 'green');
    log('🌐 Your site will be available at: https://wilneeley.github.io/randoblog', 'cyan');
    log('⏱️  It may take a few minutes for changes to appear.', 'yellow');

  } catch (error) {
    log('❌ Deployment failed. Trying alternative method...', 'yellow');
    
    // Alternative: Force push to gh-pages
    try {
      exec('cd dist && git init');
      exec('cd dist && git add -A');
      exec('cd dist && git commit -m "Deploy to GitHub Pages"');
      exec('cd dist && git branch -M gh-pages');
      exec('cd dist && git remote add origin https://github.com/wilneeley/randoblog.git');
      exec('cd dist && git push -f origin gh-pages');
      exec('rm -rf dist/.git');
      
      log('✅ Successfully deployed using alternative method!', 'green');
      log('🌐 Your site will be available at: https://wilneeley.github.io/randoblog', 'cyan');
    } catch (altError) {
      log('❌ Both deployment methods failed.', 'red');
      log('Please check your GitHub repository settings and try again.', 'red');
      process.exit(1);
    }
  }

  log('🎉 Deployment complete!', 'green');
}

main().catch(error => {
  log(`❌ Deployment failed: ${error.message}`, 'red');
  process.exit(1);
});
