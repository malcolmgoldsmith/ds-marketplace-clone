#!/usr/bin/env node

/**
 * Extract component patterns from app/index.html
 * Identifies and catalogs all UI components for the design system
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.join(__dirname, '..');
const APP_HTML = path.join(ROOT_DIR, 'app', 'index.html');
const CSS_FILE = path.join(ROOT_DIR, 'public', 'assets', 'css', 'site.css');
const COMPONENTS_DIR = path.join(ROOT_DIR, 'design-system', 'components');

console.log('🔍 Extracting components from cloned site...\n');

// Ensure components directory exists
if (!fs.existsSync(COMPONENTS_DIR)) {
  fs.mkdirSync(COMPONENTS_DIR, { recursive: true });
}

// Read the HTML file
console.log('📖 Reading app/index.html...');
const html = fs.readFileSync(APP_HTML, 'utf8');

// Read CSS for color extraction
console.log('📖 Reading site.css...');
const css = fs.readFileSync(CSS_FILE, 'utf8');

console.log('🔨 Parsing HTML with regex...');

const components = {
  atoms: {
    colors: [],
    typography: [],
    buttons: [],
    icons: []
  },
  molecules: {},
  organisms: {}
};

console.log('\n🎨 Extracting Atoms...');

// Extract colors from CSS
const colorMatches = css.match(/#[0-9a-fA-F]{3,6}|rgba?\([^)]+\)/g);
if (colorMatches) {
  const uniqueColors = [...new Set(colorMatches)].slice(0, 20);
  components.atoms.colors = uniqueColors.map(color => ({
    value: color,
    usage: 'Found in CSS'
  }));
}
console.log(`  ✅ Found ${components.atoms.colors.length} unique colors`);

// Extract button patterns
const buttonMatches = html.matchAll(/<button[^>]*class="([^"]*)"[^>]*>/g);
const buttonClasses = new Set();
for (const match of buttonMatches) {
  if (match[1]) buttonClasses.add(match[1]);
}
components.atoms.buttons = Array.from(buttonClasses).slice(0, 15).map(className => ({
  classes: className,
  example: `<button class="${className}">Button Text</button>`
}));
console.log(`  ✅ Found ${components.atoms.buttons.length} button styles`);

// Extract typography from CSS
const fontMatches = css.match(/font-family:\s*([^;]+);/g);
if (fontMatches) {
  components.atoms.typography = fontMatches.slice(0, 10).map(match => ({
    property: match.trim()
  }));
}
console.log(`  ✅ Found ${components.atoms.typography.length} typography rules`);

// Extract SVG icons
const svgMatches = html.matchAll(/<svg[^>]*aria-label="([^"]*)"[^>]*>/g);
const iconNames = new Set();
for (const match of svgMatches) {
  if (match[1]) iconNames.add(match[1]);
}
components.atoms.icons = Array.from(iconNames).slice(0, 20).map(name => ({
  name,
  type: 'svg'
}));
console.log(`  ✅ Found ${components.atoms.icons.length} unique icons`);

console.log('\n🧩 Extracting Molecules...');

// Extract search field
const searchMatch = html.match(/<ds-search-field[\s\S]{0,1000}?<\/ds-search-field>/);
if (searchMatch) {
  components.molecules.searchField = {
    name: 'Search Field',
    html: searchMatch[0],
    description: 'Search input with icon button'
  };
  console.log(`  ✅ Search field extracted`);
}

// Extract dropdown
const dropdownMatch = html.match(/<ds-country-dropdown[\s\S]{0,800}?<\/ds-country-dropdown>/);
if (dropdownMatch) {
  components.molecules.dropdown = {
    name: 'Country Dropdown',
    html: dropdownMatch[0],
    description: 'Country selector with flags'
  };
  console.log(`  ✅ Dropdown extracted`);
}

// Extract breadcrumbs
const breadcrumbMatch = html.match(/<ds-breadcrumbs[\s\S]{0,600}?<\/ds-breadcrumbs>/);
if (breadcrumbMatch) {
  components.molecules.breadcrumbs = {
    name: 'Breadcrumbs',
    html: breadcrumbMatch[0],
    description: 'Navigation breadcrumb trail'
  };
  console.log(`  ✅ Breadcrumbs extracted`);
}

console.log('\n🏗️  Extracting Organisms...');

// Extract header
const headerMatch = html.match(/<ds-header[\s\S]{0,2000}?<\/ds-header>/);
if (headerMatch) {
  components.organisms.header = {
    name: 'Navigation Header',
    html: headerMatch[0],
    description: 'Main navigation header with logo, search, cart, and user actions'
  };
  console.log(`  ✅ Header extracted`);
}

// Extract product cards by looking for app-partner-card tags
const partnerCardMatches = html.matchAll(/<app-partner-card[\s\S]{0,1500}?<\/app-partner-card>/g);
components.organisms.productCards = [];

for (const match of partnerCardMatches) {
  const card = match[0];
  // Try to identify which partner
  let partner = 'Unknown';
  const partners = ['special_offers', 'microsoft', 'mcafee', 'norton', 'dropbox', 'cyberlink', 'foxit', 'Absolute'];
  for (const p of partners) {
    if (card.toLowerCase().includes(p.toLowerCase())) {
      partner = p;
      break;
    }
  }

  components.organisms.productCards.push({
    name: `${partner.charAt(0).toUpperCase() + partner.slice(1).replace('_', ' ')} Card`,
    html: card,
    partner: partner
  });
}

// If no app-partner-card found, look for generic cards
if (components.organisms.productCards.length === 0) {
  const cardMatches = html.matchAll(/<div[^>]*class="[^"]*card[^"]*"[^>]*>[\s\S]{0,800}?<\/div>/g);
  let count = 0;
  for (const match of cardMatches) {
    if (count >= 8) break;
    components.organisms.productCards.push({
      name: `Card ${count + 1}`,
      html: match[0],
      partner: 'generic'
    });
    count++;
  }
}

console.log(`  ✅ Found ${components.organisms.productCards.length} product cards`);

// Save extracted components
console.log('\n💾 Saving extracted components...');

fs.writeFileSync(
  path.join(COMPONENTS_DIR, 'atoms.json'),
  JSON.stringify(components.atoms, null, 2)
);

fs.writeFileSync(
  path.join(COMPONENTS_DIR, 'molecules.json'),
  JSON.stringify(components.molecules, null, 2)
);

fs.writeFileSync(
  path.join(COMPONENTS_DIR, 'organisms.json'),
  JSON.stringify(components.organisms, null, 2)
);

// Create summary
const summary = {
  extractedAt: new Date().toISOString(),
  stats: {
    atoms: {
      colors: components.atoms.colors.length,
      typography: components.atoms.typography.length,
      buttons: components.atoms.buttons.length,
      icons: components.atoms.icons.length
    },
    molecules: Object.keys(components.molecules).length,
    organisms: {
      header: components.organisms.header ? 1 : 0,
      productCards: components.organisms.productCards.length
    }
  },
  totalComponents:
    components.atoms.colors.length +
    components.atoms.typography.length +
    components.atoms.buttons.length +
    components.atoms.icons.length +
    Object.keys(components.molecules).length +
    (components.organisms.header ? 1 : 0) +
    components.organisms.productCards.length
};

fs.writeFileSync(
  path.join(COMPONENTS_DIR, 'extraction-summary.json'),
  JSON.stringify(summary, null, 2)
);

console.log('\n✨ Extraction Complete!');
console.log(`📊 Summary:`);
console.log(`   Total components: ${summary.totalComponents}`);
console.log(`   - Atoms: ${summary.stats.atoms.colors + summary.stats.atoms.typography + summary.stats.atoms.buttons + summary.stats.atoms.icons}`);
console.log(`     • Colors: ${summary.stats.atoms.colors}`);
console.log(`     • Typography: ${summary.stats.atoms.typography}`);
console.log(`     • Buttons: ${summary.stats.atoms.buttons}`);
console.log(`     • Icons: ${summary.stats.atoms.icons}`);
console.log(`   - Molecules: ${summary.stats.molecules}`);
console.log(`   - Organisms: ${summary.stats.organisms.header + summary.stats.organisms.productCards}`);
console.log(`     • Header: ${summary.stats.organisms.header}`);
console.log(`     • Product Cards: ${summary.stats.organisms.productCards}`);
console.log(`\n📁 Files saved to: ${COMPONENTS_DIR}/`);
console.log(`   - atoms.json`);
console.log(`   - molecules.json`);
console.log(`   - organisms.json`);
console.log(`   - extraction-summary.json`);
