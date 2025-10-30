#!/usr/bin/env node

/**
 * Rewrite Script - Build static Vite app from captured assets
 *
 * This script:
 * 1. Reads raw/index.rendered.html
 * 2. Concatenates all CSS (preserving order) into public/assets/site.css
 * 3. Generates @font-face rules for local fonts
 * 4. Rewrites absolute/same-origin asset URLs to /assets/**
 * 5. Creates app/index.html
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.join(__dirname, '..');
const RAW_DIR = path.join(ROOT_DIR, 'raw');
const APP_DIR = path.join(ROOT_DIR, 'app');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const ASSETS_DIR = path.join(PUBLIC_DIR, 'assets');

const TARGET_URL = 'https://marketplace.naea1.uds.lenovo.com';

console.log('✍️  Starting rewrite process...');

// Ensure app directory exists
if (!fs.existsSync(APP_DIR)) {
  fs.mkdirSync(APP_DIR, { recursive: true });
}

function loadAssetMapping() {
  const mappingPath = path.join(RAW_DIR, 'asset-mapping.json');
  if (!fs.existsSync(mappingPath)) {
    console.warn('⚠️  No asset mapping found, skipping...');
    return {};
  }
  return JSON.parse(fs.readFileSync(mappingPath, 'utf8'));
}

function loadRenderedHtml() {
  const htmlPath = path.join(RAW_DIR, 'index.rendered.html');
  if (!fs.existsSync(htmlPath)) {
    throw new Error('Missing raw/index.rendered.html - run capture first!');
  }
  return fs.readFileSync(htmlPath, 'utf8');
}

function extractAndConsolidateCss(html, assetMapping) {
  console.log('📝 Extracting and consolidating CSS...');

  const cssBlocks = [];
  const processedLinks = new Set();

  // Extract <link> stylesheets
  const linkRegex = /<link[^>]+rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>|<link[^>]+href=["']([^"']+)["'][^>]*rel=["']stylesheet["'][^>]*>/gi;
  let match;

  while ((match = linkRegex.exec(html)) !== null) {
    const href = match[1] || match[2];
    const absoluteUrl = resolveUrl(href, TARGET_URL);

    if (processedLinks.has(absoluteUrl)) continue;
    processedLinks.add(absoluteUrl);

    // Try to find the local file
    const localPath = assetMapping[absoluteUrl];
    if (localPath) {
      const fullPath = path.join(PUBLIC_DIR, localPath.replace(/^\//, ''));
      if (fs.existsSync(fullPath)) {
        const css = fs.readFileSync(fullPath, 'utf8');
        cssBlocks.push({
          type: 'external',
          url: absoluteUrl,
          content: css
        });
        console.log(`  ✅ Loaded CSS: ${path.basename(fullPath)}`);
      }
    }
  }

  // Extract inline <style> blocks
  const styleRegex = /<style([^>]*)>([\s\S]*?)<\/style>/gi;
  let styleMatch;
  let inlineCount = 0;

  while ((styleMatch = styleRegex.exec(html)) !== null) {
    inlineCount++;
    cssBlocks.push({
      type: 'inline',
      index: inlineCount,
      content: styleMatch[2]
    });
  }

  console.log(`  📄 Found ${cssBlocks.filter(b => b.type === 'external').length} external stylesheets`);
  console.log(`  🎨 Found ${inlineCount} inline style blocks`);

  return cssBlocks;
}

function generateFontFaces() {
  console.log('🔤 Generating @font-face rules...');

  const fontsDir = path.join(ASSETS_DIR, 'fonts');
  if (!fs.existsSync(fontsDir)) {
    return '';
  }

  const fontFiles = fs.readdirSync(fontsDir);
  const fontFaces = [];

  // Group fonts by family
  const fontGroups = {};
  fontFiles.forEach(file => {
    const ext = path.extname(file).toLowerCase();
    if (!['.woff', '.woff2', '.ttf', '.otf'].includes(ext)) return;

    // Try to extract font family from filename
    const baseName = path.basename(file, ext);
    const parts = baseName.split(/[-_]/);

    let family = parts[0];
    let weight = '400';
    let style = 'normal';

    // Detect weight
    if (/bold|700/i.test(baseName)) weight = '700';
    else if (/semibold|600/i.test(baseName)) weight = '600';
    else if (/medium|500/i.test(baseName)) weight = '500';
    else if (/light|300/i.test(baseName)) weight = '300';

    // Detect style
    if (/italic/i.test(baseName)) style = 'italic';

    const key = `${family}-${weight}-${style}`;
    if (!fontGroups[key]) {
      fontGroups[key] = { family, weight, style, files: {} };
    }

    if (ext === '.woff2') fontGroups[key].files.woff2 = file;
    else if (ext === '.woff') fontGroups[key].files.woff = file;
    else if (ext === '.ttf') fontGroups[key].files.ttf = file;
    else if (ext === '.otf') fontGroups[key].files.otf = file;
  });

  // Generate @font-face rules
  Object.values(fontGroups).forEach(({ family, weight, style, files }) => {
    const sources = [];
    if (files.woff2) sources.push(`url('/assets/fonts/${files.woff2}') format('woff2')`);
    if (files.woff) sources.push(`url('/assets/fonts/${files.woff}') format('woff')`);
    if (files.ttf) sources.push(`url('/assets/fonts/${files.ttf}') format('truetype')`);
    if (files.otf) sources.push(`url('/assets/fonts/${files.otf}') format('opentype')`);

    if (sources.length > 0) {
      fontFaces.push(`
@font-face {
  font-family: '${family}';
  font-weight: ${weight};
  font-style: ${style};
  font-display: swap;
  src: ${sources.join(',\n       ')};
}`.trim());
    }
  });

  console.log(`  ✅ Generated ${fontFaces.length} @font-face rules`);

  return fontFaces.join('\n\n');
}

function consolidateCss(cssBlocks) {
  const fontFaces = generateFontFaces();
  const consolidated = [fontFaces, ...cssBlocks.map(b => b.content)].join('\n\n');

  const cssPath = path.join(ASSETS_DIR, 'css', 'site.css');
  fs.writeFileSync(cssPath, consolidated, 'utf8');
  console.log(`✅ Consolidated CSS saved: ${cssPath}`);

  return '/assets/css/site.css';
}

function rewriteHtml(html, assetMapping, consolidatedCssPath) {
  console.log('🔄 Rewriting HTML...');

  let rewritten = html;

  // Remove original <link rel="stylesheet"> tags
  rewritten = rewritten.replace(
    /<link[^>]+rel=["']stylesheet["'][^>]*>|<link[^>]+href=["'][^"']+\.css["'][^>]*>/gi,
    ''
  );

  // Remove inline <style> tags (they're now in consolidated CSS)
  rewritten = rewritten.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

  // Add consolidated CSS in <head>
  rewritten = rewritten.replace(
    '</head>',
    `  <link rel="stylesheet" href="${consolidatedCssPath}">\n</head>`
  );

  // Rewrite asset URLs
  for (const [originalUrl, localPath] of Object.entries(assetMapping)) {
    // Escape special regex characters in URL
    const escapedUrl = originalUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Replace in various contexts
    rewritten = rewritten.replace(
      new RegExp(`["']${escapedUrl}["']`, 'g'),
      `"${localPath}"`
    );
    rewritten = rewritten.replace(
      new RegExp(`\\(${escapedUrl}\\)`, 'g'),
      `(${localPath})`
    );
  }

  // Remove ALL external script tags (including analytics, tracking, and Angular runtime)
  // We're building a static clone without JavaScript functionality
  rewritten = rewritten.replace(
    /<script[^>]*\ssrc=["'][^"']+["'][^>]*>[\s\S]*?<\/script>/gi,
    ''
  );

  // Also remove standalone script tags with src
  rewritten = rewritten.replace(
    /<script[^>]*\ssrc=["'][^"']+["'][^>]*><\/script>/gi,
    ''
  );

  // Remove inline scripts that reference Google Tag Manager, analytics, etc.
  const inlineScriptsToRemove = [
    /google-analytics/i,
    /gtag/i,
    /dataLayer/i,
    /googletagmanager/i,
    /GTM-/i,
    /facebook\.net/i,
    /fbevents/i,
  ];

  inlineScriptsToRemove.forEach(pattern => {
    rewritten = rewritten.replace(
      new RegExp(`<script[^>]*>[\s\S]*?${pattern.source}[\s\S]*?</script>`, 'gis'),
      ''
    );
  });

  console.log('  ✅ HTML rewritten (all external scripts removed)');

  return rewritten;
}

function resolveUrl(url, baseUrl) {
  try {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    if (url.startsWith('//')) {
      return `https:${url}`;
    }
    if (url.startsWith('/')) {
      return `${new URL(baseUrl).origin}${url}`;
    }
    return new URL(url, baseUrl).href;
  } catch {
    return url;
  }
}

async function main() {
  try {
    console.log('📖 Loading files...');

    const assetMapping = loadAssetMapping();
    const html = loadRenderedHtml();

    // Extract and consolidate CSS
    const cssBlocks = extractAndConsolidateCss(html, assetMapping);
    const consolidatedCssPath = consolidateCss(cssBlocks);

    // Rewrite HTML
    const rewrittenHtml = rewriteHtml(html, assetMapping, consolidatedCssPath);

    // Save to app/index.html
    const appHtmlPath = path.join(APP_DIR, 'index.html');
    fs.writeFileSync(appHtmlPath, rewrittenHtml, 'utf8');
    console.log(`✅ Saved app HTML: ${appHtmlPath}`);

    console.log('\n✨ Rewrite complete!');
    console.log(`\nNext step: Run 'npm run dev' to start the local dev server`);
    console.log(`Then run 'npm run verify' to compare live vs local renders`);

  } catch (error) {
    console.error('\n❌ Rewrite failed:', error);
    process.exit(1);
  }
}

main();
