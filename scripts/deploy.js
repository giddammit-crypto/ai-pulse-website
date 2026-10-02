#!/usr/bin/env node

/**
 * AI PULSE — 1-CLICK DEPLOY SCRIPT TO GITHUB PAGES
 */

import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');

console.log('📦 Building Vite bundle for GitHub Pages...');
execSync('npm run build', { cwd: projectRoot, stdio: 'inherit' });

console.log('🚀 Publishing dist/ to gh-pages branch...');
try {
  execSync('git init', { cwd: distDir, stdio: 'pipe' });
  execSync('git checkout -B gh-pages', { cwd: distDir, stdio: 'pipe' });
  execSync('git add .', { cwd: distDir, stdio: 'pipe' });
  execSync('git commit -m "deploy: update AI PULSE live build"', { cwd: distDir, stdio: 'pipe' });
  execSync('git remote add origin https://github.com/giddammit-crypto/ai-pulse-website.git', { cwd: distDir, stdio: 'pipe' });
} catch (e) {
  // Remote might already exist, update it
  try {
    execSync('git remote set-url origin https://github.com/giddammit-crypto/ai-pulse-website.git', { cwd: distDir, stdio: 'pipe' });
  } catch (err) {}
}

execSync('git push -f origin gh-pages', { cwd: distDir, stdio: 'inherit' });
console.log('✨ Deployed successfully to https://giddammit-crypto.github.io/ai-pulse-website/');
