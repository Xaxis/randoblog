#!/usr/bin/env node

/**
 * Copy Blog Images Script
 * 
 * Copies images from src/content/blog/{slug}/ directories to public/blog-images/{slug}/
 * so they can be served as static assets.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTENT_DIR = path.join(__dirname, '../src/content/blog');
const PUBLIC_DIR = path.join(__dirname, '../public/blog-images');

// Image extensions to copy
const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.ico'];

// Ensure public blog-images directory exists
if (!fs.existsSync(PUBLIC_DIR)) {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}

// Get all blog directories
const blogDirs = fs.readdirSync(CONTENT_DIR, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

let copiedCount = 0;

for (const slug of blogDirs) {
  const sourceDir = path.join(CONTENT_DIR, slug);
  const destDir = path.join(PUBLIC_DIR, slug);
  
  // Get all files in the blog directory
  const files = fs.readdirSync(sourceDir);
  
  // Filter for image files
  const imageFiles = files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return IMAGE_EXTENSIONS.includes(ext);
  });
  
  if (imageFiles.length > 0) {
    // Create destination directory
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    
    // Copy each image
    for (const imageFile of imageFiles) {
      const sourcePath = path.join(sourceDir, imageFile);
      const destPath = path.join(destDir, imageFile);
      
      fs.copyFileSync(sourcePath, destPath);
      copiedCount++;
    }
    
    console.log(`📷 Copied ${imageFiles.length} image(s) from ${slug}`);
  }
}

console.log(`\n✅ Copied ${copiedCount} total images to public/blog-images/`);

