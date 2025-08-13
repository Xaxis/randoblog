# RANDOBLOG

A modern retro-styled blog that automatically pulls content from GitHub repositories, featuring smooth scrolling table of contents, KaTeX math rendering, and dark/light theme support.

## 🚀 Quick Start

### First Time Setup
```bash
npm install
npm run setup    # Interactive setup for GitHub Pages deployment
```

### Development
```bash
npm run dev      # Start local development server
```

### Deployment
```bash
npm run deploy   # Deploy to GitHub Pages
```

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4322`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run setup`           | Interactive setup for GitHub Pages deployment    |
| `npm run deploy`          | Deploy to GitHub Pages                          |
| `npm run deploy:force`    | Force deploy (even with uncommitted changes)    |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 📖 Deployment Guide

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

### Quick Deployment Steps:

1. **Setup** (first time only):
   ```bash
   npm run setup
   ```

2. **Create GitHub repository** and push:
   ```bash
   git push -u origin main
   ```

3. **Enable GitHub Pages** in repository settings

4. **Automatic deployment** - every push to main branch automatically deploys!

## ✨ Features

- 🎨 **Modern Retro Design** - Dark/light theme with retro aesthetics
- 📱 **Fully Responsive** - Perfect on all devices
- 🔗 **GitHub Integration** - Automatically pulls content from repositories
- 📚 **Auto Table of Contents** - Generated for all blog posts
- 🎯 **Smooth Scrolling** - Enhanced navigation experience
- 🧮 **Math Support** - KaTeX rendering for mathematical expressions
- ⚡ **Fast Performance** - Built with Astro for optimal speed
- 🔍 **SEO Optimized** - Meta tags and structured data
- 🚀 **Easy Deployment** - One-command GitHub Pages deployment

## 🎯 Adding Content

Your blog automatically pulls content from GitHub repositories. Edit `src/content/config.ts` to add your repositories:

```javascript
const GITHUB_REPOS = [
  'yourusername/repo1',
  'yourusername/repo2',
  // Add more repositories here
];
```

## 🎨 Customization

- **Colors & Theme**: Edit `src/styles/global.css`
- **Site Info**: Update `src/layouts/Layout.astro`
- **About Page**: Modify `src/pages/about.astro`
- **Configuration**: Adjust `astro.config.mjs`
