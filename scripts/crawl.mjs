#!/usr/bin/env node

/**
 * Crawl Script - Fetch homepage HTML and discover assets
 *
 * This script uses Firecrawl to:
 * 1. Fetch the Lenovo marketplace homepage HTML
 * 2. Discover first-depth, same-origin static assets (CSS, images, fonts)
 * 3. Save raw/index.remote.html
 * 4. Save raw/assets.json (asset inventory in original order)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.join(__dirname, '..');
const RAW_DIR = path.join(ROOT_DIR, 'raw');

const TARGET_URL = 'https://marketplace.naea1.uds.lenovo.com/';

console.log('🔍 Starting crawl process...');
console.log(`Target URL: ${TARGET_URL}`);

// Ensure raw directory exists
if (!fs.existsSync(RAW_DIR)) {
  fs.mkdirSync(RAW_DIR, { recursive: true });
}

// For now, we'll use node-fetch to get the HTML
// In a production environment, you'd use Firecrawl API directly
async function fetchPage() {
  try {
    const fetch = (await import('node-fetch')).default;

    console.log('📥 Fetching homepage...');
    const response = await fetch(TARGET_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();

    // Save the original HTML
    const htmlPath = path.join(RAW_DIR, 'index.remote.html');
    fs.writeFileSync(htmlPath, html, 'utf8');
    console.log(`✅ Saved HTML to: ${htmlPath}`);

    return html;
  } catch (error) {
    console.error('❌ Error fetching page:', error.message);
    throw error;
  }
}

function extractAssets(html, baseUrl) {
  const assets = {
    css: [],
    images: [],
    fonts: [],
    scripts: []
  };

  console.log('🔎 Discovering assets...');

  // Extract CSS links
  const cssRegex = /<link[^>]+href=["']([^"']+\.css[^"']*)["'][^>]*>/gi;
  let match;
  while ((match = cssRegex.exec(html)) !== null) {
    const url = resolveUrl(match[1], baseUrl);
    if (url && isSameOrigin(url, baseUrl)) {
      assets.css.push({ url, type: 'stylesheet' });
    }
  }

  // Extract inline styles (we'll capture these during the Playwright phase)
  const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
  let styleCount = 0;
  while ((match = styleRegex.exec(html)) !== null) {
    styleCount++;
    assets.css.push({
      url: null,
      type: 'inline',
      content: match[1],
      index: styleCount
    });
  }

  // Extract images
  const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
  while ((match = imgRegex.exec(html)) !== null) {
    const url = resolveUrl(match[1], baseUrl);
    if (url && isSameOrigin(url, baseUrl)) {
      assets.images.push({ url, tag: 'img' });
    }
  }

  // Extract background images from inline styles
  const bgRegex = /url\(["']?([^"')]+)["']?\)/gi;
  while ((match = bgRegex.exec(html)) !== null) {
    const url = resolveUrl(match[1], baseUrl);
    if (url && isSameOrigin(url, baseUrl) && /\.(jpg|jpeg|png|gif|svg|webp)$/i.test(url)) {
      assets.images.push({ url, tag: 'background' });
    }
  }

  // Extract scripts (for reference, but we'll exclude most in final build)
  const scriptRegex = /<script[^>]+src=["']([^"']+)["'][^>]*>/gi;
  while ((match = scriptRegex.exec(html)) !== null) {
    const url = resolveUrl(match[1], baseUrl);
    if (url && isSameOrigin(url, baseUrl)) {
      assets.scripts.push({ url });
    }
  }

  // Deduplicate assets
  assets.css = deduplicateAssets(assets.css.filter(a => a.url));
  assets.images = deduplicateAssets(assets.images);
  assets.scripts = deduplicateAssets(assets.scripts);

  console.log(`  📄 CSS files: ${assets.css.filter(a => a.type === 'stylesheet').length}`);
  console.log(`  🎨 Inline styles: ${assets.css.filter(a => a.type === 'inline').length}`);
  console.log(`  🖼️  Images: ${assets.images.length}`);
  console.log(`  📜 Scripts: ${assets.scripts.length}`);

  return assets;
}

function resolveUrl(url, baseUrl) {
  try {
    // Skip data URLs, blob URLs, etc.
    if (url.startsWith('data:') || url.startsWith('blob:') || url.startsWith('javascript:')) {
      return null;
    }

    // If it's already absolute, use it
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }

    // Resolve relative URLs
    const base = new URL(baseUrl);
    if (url.startsWith('//')) {
      return `${base.protocol}${url}`;
    }
    if (url.startsWith('/')) {
      return `${base.origin}${url}`;
    }

    // Relative to current path
    return new URL(url, baseUrl).href;
  } catch (error) {
    return null;
  }
}

function isSameOrigin(url, baseUrl) {
  try {
    const urlObj = new URL(url);
    const baseObj = new URL(baseUrl);
    return urlObj.origin === baseObj.origin;
  } catch {
    return false;
  }
}

function deduplicateAssets(assets) {
  const seen = new Set();
  return assets.filter(asset => {
    if (seen.has(asset.url)) {
      return false;
    }
    seen.add(asset.url);
    return true;
  });
}

async function main() {
  try {
    // Fetch the page
    const html = await fetchPage();

    // Extract and discover assets
    const assets = extractAssets(html, TARGET_URL);

    // Save assets inventory
    const assetsPath = path.join(RAW_DIR, 'assets.json');
    fs.writeFileSync(assetsPath, JSON.stringify(assets, null, 2), 'utf8');
    console.log(`✅ Saved asset inventory to: ${assetsPath}`);

    console.log('\n✨ Crawl complete!');
    console.log(`\nNext step: Run 'npm run capture' to capture rendered page and download assets`);

  } catch (error) {
    console.error('\n❌ Crawl failed:', error);
    process.exit(1);
  }
}

main();
