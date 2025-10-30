#!/usr/bin/env node

/**
 * Capture Script - Use Playwright to capture rendered page and assets
 *
 * This script:
 * 1. Launches Chromium with viewport 1440×900, DPR=2
 * 2. Intercepts network requests to save asset responses
 * 3. Captures runtime-injected styles and DOM changes
 * 4. Outputs:
 *    - raw/index.rendered.html (rendered HTML snapshot)
 *    - public/assets/** (css, fonts, images)
 *    - verification/live-1440.png (screenshot of live page)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.join(__dirname, '..');
const RAW_DIR = path.join(ROOT_DIR, 'raw');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const ASSETS_DIR = path.join(PUBLIC_DIR, 'assets');
const VERIFICATION_DIR = path.join(ROOT_DIR, 'verification');

const TARGET_URL = 'https://marketplace.naea1.uds.lenovo.com/';
const VIEWPORT = { width: 1440, height: 900 };
const DEVICE_SCALE_FACTOR = 2;

// Asset type mapping
const ASSET_TYPES = {
  css: /\.(css)$/i,
  font: /\.(woff2?|ttf|otf|eot)$/i,
  image: /\.(jpg|jpeg|png|gif|svg|webp|ico)$/i,
  js: /\.(js|mjs)$/i
};

console.log('🎭 Starting capture process with Playwright...');
console.log(`Target URL: ${TARGET_URL}`);
console.log(`Viewport: ${VIEWPORT.width}×${VIEWPORT.height}, DPR: ${DEVICE_SCALE_FACTOR}`);

// Ensure directories exist
[RAW_DIR, ASSETS_DIR, VERIFICATION_DIR,
  path.join(ASSETS_DIR, 'css'),
  path.join(ASSETS_DIR, 'fonts'),
  path.join(ASSETS_DIR, 'images'),
  path.join(ASSETS_DIR, 'js')
].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Track downloaded assets
const downloadedAssets = new Map();
const assetPaths = new Map(); // URL to local path mapping

function getAssetType(url) {
  const urlPath = new URL(url, TARGET_URL).pathname;
  for (const [type, regex] of Object.entries(ASSET_TYPES)) {
    if (regex.test(urlPath)) {
      return type;
    }
  }
  return null;
}

function getLocalPath(url, contentType) {
  // Generate a unique but deterministic filename
  const urlObj = new URL(url, TARGET_URL);
  const pathname = urlObj.pathname;
  const extension = path.extname(pathname) || getExtensionFromContentType(contentType);

  // Get base filename
  let filename = path.basename(pathname);
  if (!filename || filename === '/') {
    filename = `asset_${crypto.createHash('md5').update(url).digest('hex').substring(0, 8)}${extension}`;
  }

  // Determine subdirectory
  const assetType = getAssetType(url);
  let subdir = 'images'; // default

  if (assetType === 'css') subdir = 'css';
  else if (assetType === 'font') subdir = 'fonts';
  else if (assetType === 'js') subdir = 'js';
  else if (assetType === 'image') subdir = 'images';

  return path.join(subdir, filename);
}

function getExtensionFromContentType(contentType) {
  const mimeTypes = {
    'text/css': '.css',
    'font/woff': '.woff',
    'font/woff2': '.woff2',
    'font/ttf': '.ttf',
    'font/otf': '.otf',
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'image/svg+xml': '.svg',
    'image/webp': '.webp',
    'application/javascript': '.js',
  };
  return mimeTypes[contentType] || '';
}

function isSameOrigin(url) {
  try {
    const urlObj = new URL(url);
    const baseObj = new URL(TARGET_URL);
    return urlObj.origin === baseObj.origin;
  } catch {
    return false;
  }
}

async function capturePageWithAssets() {
  let browser;

  try {
    console.log('🚀 Launching browser...');
    browser = await chromium.launch({
      headless: true
    });

    const context = await browser.newContext({
      viewport: VIEWPORT,
      deviceScaleFactor: DEVICE_SCALE_FACTOR,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });

    const page = await context.newPage();

    // Intercept and save asset responses
    page.on('response', async (response) => {
      const url = response.url();
      const status = response.status();

      // Only capture successful same-origin requests
      if (status !== 200 || !isSameOrigin(url)) {
        return;
      }

      // Skip the main document
      if (url === TARGET_URL || url === TARGET_URL + '/') {
        return;
      }

      try {
        const contentType = response.headers()['content-type'] || '';
        const assetType = getAssetType(url);

        // Only save CSS, fonts, and images
        if (!assetType || assetType === 'js') {
          return;
        }

        // Skip if already downloaded
        if (downloadedAssets.has(url)) {
          return;
        }

        const buffer = await response.body();
        const localPath = getLocalPath(url, contentType);
        const fullPath = path.join(ASSETS_DIR, localPath);

        // Ensure directory exists
        const dir = path.dirname(fullPath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(fullPath, buffer);
        downloadedAssets.set(url, localPath);
        assetPaths.set(url, `/assets/${localPath.replace(/\\/g, '/')}`);

        console.log(`  ✅ Downloaded: ${assetType} - ${path.basename(localPath)}`);

      } catch (error) {
        console.warn(`  ⚠️  Failed to save ${url}: ${error.message}`);
      }
    });

    console.log('📄 Loading page...');
    await page.goto(TARGET_URL, {
      waitUntil: 'networkidle',
      timeout: 60000
    });

    console.log('⏱️  Waiting for page to settle...');
    await page.waitForTimeout(3000);

    // Disable animations for stable screenshot
    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
          transition-delay: 0s !important;
        }
      `
    });

    console.log('📸 Taking screenshot...');
    const screenshotPath = path.join(VERIFICATION_DIR, 'live-1440.png');
    await page.screenshot({
      path: screenshotPath,
      fullPage: true
    });
    console.log(`✅ Screenshot saved: ${screenshotPath}`);

    console.log('💾 Extracting rendered HTML...');
    const html = await page.content();
    const renderedHtmlPath = path.join(RAW_DIR, 'index.rendered.html');
    fs.writeFileSync(renderedHtmlPath, html, 'utf8');
    console.log(`✅ Saved rendered HTML: ${renderedHtmlPath}`);

    // Extract computed styles for fonts
    console.log('🔤 Extracting font information...');
    const fontInfo = await page.evaluate(() => {
      const fonts = new Set();
      const elements = document.querySelectorAll('*');

      elements.forEach(el => {
        const style = window.getComputedStyle(el);
        const fontFamily = style.fontFamily;
        const fontWeight = style.fontWeight;
        const fontStyle = style.fontStyle;

        if (fontFamily) {
          fonts.add(JSON.stringify({ fontFamily, fontWeight, fontStyle }));
        }
      });

      return Array.from(fonts).map(f => JSON.parse(f));
    });

    const fontInfoPath = path.join(RAW_DIR, 'font-info.json');
    fs.writeFileSync(fontInfoPath, JSON.stringify(fontInfo, null, 2), 'utf8');
    console.log(`✅ Saved font information: ${fontInfoPath}`);

    console.log(`\n📊 Asset Summary:`);
    console.log(`  Total assets downloaded: ${downloadedAssets.size}`);

    // Save asset mapping
    const assetMappingPath = path.join(RAW_DIR, 'asset-mapping.json');
    fs.writeFileSync(
      assetMappingPath,
      JSON.stringify(Object.fromEntries(assetPaths), null, 2),
      'utf8'
    );
    console.log(`✅ Saved asset mapping: ${assetMappingPath}`);

    await browser.close();

    console.log('\n✨ Capture complete!');
    console.log(`\nNext step: Run 'npm run rewrite' to build the static Vite app`);

  } catch (error) {
    console.error('\n❌ Capture failed:', error);
    if (browser) {
      await browser.close();
    }
    process.exit(1);
  }
}

capturePageWithAssets();
