# 🚀 RANDOBLOG Deployment Guide

This guide will help you deploy your RANDOBLOG to GitHub Pages easily and automatically.

## 📋 Prerequisites

1. **GitHub Account**: You need a GitHub account
2. **Git**: Git should be installed on your system
3. **Node.js**: Node.js 18+ should be installed

## 🎯 Quick Setup (First Time Only)

### 1. Create GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository named `randoblog`
2. Make it **public** (required for free GitHub Pages)
3. Don't initialize with README (we already have files)

### 2. Connect Your Local Repository

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Make initial commit
git commit -m "Initial commit: RANDOBLOG setup"

# Add GitHub remote (replace 'wilneeley' with your username)
git remote add origin https://github.com/wilneeley/randoblog.git

# Push to GitHub
git push -u origin main
```

### 3. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** tab
3. Scroll down to **Pages** section
4. Under **Source**, select **GitHub Actions**
5. Save the settings

## 🚀 Deployment Methods

### Method 1: Automatic Deployment (Recommended)

**Every time you push to the main branch, your site automatically deploys!**

```bash
# Make changes to your blog
# Add new posts, modify styling, etc.

# Commit and push
git add .
git commit -m "Update blog content"
git push

# 🎉 Your site automatically deploys in 2-3 minutes!
```

### Method 2: Manual Deployment Script

Use the built-in deployment script for manual deployments:

```bash
# Deploy current changes
npm run deploy

# Force deploy (even with uncommitted changes)
npm run deploy:force
```

### Method 3: Manual Build and Deploy

```bash
# Build the site
npm run build

# The built site is in the 'dist' folder
# You can manually upload this to any hosting service
```

## 🌐 Your Live Site

After deployment, your blog will be available at:
**https://wilneeley.github.io/randoblog**

(Replace 'wilneeley' with your GitHub username)

## 🔧 Configuration

The blog is already configured for GitHub Pages in `astro.config.mjs`:

```javascript
export default defineConfig({
  site: 'https://wilneeley.github.io',  // Your GitHub Pages URL
  base: '/randoblog',                   // Your repository name
  // ... other config
});
```

**Important**: Update the `site` URL with your GitHub username!

## 📝 Adding New Blog Posts

Your blog automatically pulls content from GitHub repositories. To add new posts:

1. **Edit `src/content/config.ts`**
2. **Add your repository** to the `GITHUB_REPOS` array:

```javascript
const GITHUB_REPOS = [
  'yourusername/your-repo-1',
  'yourusername/your-repo-2',
  // Add more repositories here
];
```

3. **Commit and push** the changes
4. **Your new posts appear automatically** on the next deployment!

## 🎨 Customization

### Update Site Information

Edit these files to customize your blog:

- **`astro.config.mjs`**: Update site URL and base path
- **`src/layouts/Layout.astro`**: Update site title and tagline
- **`src/pages/about.astro`**: Update about page content
- **`src/styles/global.css`**: Customize colors and styling

### Update Colors and Theme

The blog uses CSS custom properties for theming. Edit `src/styles/global.css`:

```css
:root {
  --bg-primary: #0a0a0f;      /* Background color */
  --accent-primary: #8b5cf6;   /* Purple accent */
  --accent-secondary: #06b6d4; /* Cyan accent */
  /* ... more colors */
}
```

## 🔍 Troubleshooting

### Deployment Fails

1. **Check GitHub Actions**: Go to your repo → Actions tab → Check for errors
2. **Check Repository Settings**: Ensure Pages is set to "GitHub Actions"
3. **Check Branch**: Make sure you're pushing to `main` branch

### Site Not Updating

1. **Wait 2-3 minutes**: GitHub Pages takes time to update
2. **Hard refresh**: Ctrl+F5 (or Cmd+Shift+R on Mac)
3. **Check Actions**: Ensure the deployment workflow completed successfully

### Content Not Loading

1. **Check Repository URLs**: Ensure repositories in `config.ts` are correct
2. **Check Repository Access**: Ensure repositories are public
3. **Check GitHub API**: Sometimes GitHub API has rate limits

## 📊 Monitoring

### Check Deployment Status

- **GitHub Actions**: Repository → Actions tab
- **Pages Status**: Repository → Settings → Pages

### Analytics (Optional)

Add Google Analytics or other analytics by editing `src/layouts/Layout.astro`.

## 🎉 You're All Set!

Your RANDOBLOG is now:
- ✅ **Automatically deployed** on every push
- ✅ **Live on GitHub Pages**
- ✅ **Pulling content** from your repositories
- ✅ **Mobile responsive** and fast
- ✅ **SEO optimized**

Happy blogging! 🚀
