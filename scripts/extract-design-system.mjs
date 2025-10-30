#!/usr/bin/env node

/**
 * Comprehensive Design System Extraction Script
 *
 * Extracts all components from the marketplace with proper categorization
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.join(__dirname, '..');
const RAW_DIR = path.join(ROOT_DIR, 'raw');
const DESIGN_SYSTEM_DIR = path.join(ROOT_DIR, 'design-system');
const COMPONENTS_DIR = path.join(DESIGN_SYSTEM_DIR, 'components');

console.log('🎨 Comprehensive Design System Extraction');
console.log('==========================================\n');

// Read the rendered HTML
const htmlPath = path.join(RAW_DIR, 'index.rendered.html');
if (!fs.existsSync(htmlPath)) {
  console.error('❌ No rendered HTML found. Run "npm run capture" first!');
  process.exit(1);
}

const html = fs.readFileSync(htmlPath, 'utf8');

/**
 * Clean Angular attributes
 */
function cleanHtml(htmlString) {
  return htmlString
    .replace(/_ngcontent-[^=]+=["'][^"']*["']\s*/g, '')
    .replace(/_nghost-[^=]+=["'][^"']*["']\s*/g, '')
    .replace(/ng-[^=]+=["'][^"']*["']\s*/g, '')
    .replace(/\s+>/g, '>')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/**
 * Extract unique components based on selector
 */
function extractComponents(selector, limit = 20) {
  const regex = new RegExp(selector, 'gims');
  const matches = [];
  const seen = new Set();
  let match;

  while ((match = regex.exec(html)) !== null && matches.length < limit) {
    const cleaned = cleanHtml(match[0]);
    const signature = cleaned.substring(0, 100); // Use first 100 chars as signature

    if (!seen.has(signature)) {
      seen.add(signature);
      matches.push(cleaned);
    }
  }

  return matches;
}

console.log('📦 Extracting ATOMS...');

// Buttons - all variants
const buttons = extractComponents('<button[^>]*class=["\'][^"\']*ds-btn[^"\']*["\'][^>]*>[\\s\\S]*?</button>');
console.log(`  ✓ Buttons: ${buttons.length}`);

// Inputs
const inputs = extractComponents('<input[^>]*class=["\'][^"\']*ds-field__input[^"\']*["\'][^>]*>');
console.log(`  ✓ Inputs: ${inputs.length}`);

// Chips/Badges
const chips = extractComponents('<[^>]*class=["\'][^"\']*ds-chips[^"\']*["\'][^>]*>[\\s\\S]*?</[^>]+>');
console.log(`  ✓ Chips/Badges: ${chips.length}`);

// Icons
const icons = extractComponents('<ds-icon[^>]*>[\\s\\S]*?</ds-icon>', 30);
console.log(`  ✓ Icons: ${icons.length}`);

// Avatars
const avatars = extractComponents('<ds-avatar[^>]*>[\\s\\S]*?</ds-avatar>');
console.log(`  ✓ Avatars: ${avatars.length}`);

// Links
const links = extractComponents('<a[^>]*class=["\'][^"\']*ds-link[^"\']*["\'][^>]*>[\\s\\S]*?</a>');
console.log(`  ✓ Links: ${links.length}`);

console.log('\n📦 Extracting MOLECULES...');

// Dropdowns
const dropdowns = extractComponents('<[^>]*class=["\'][^"\']*ds-dropdown["\'][^>]*>[\\s\\S]*?</[^>]+>');
console.log(`  ✓ Dropdowns: ${dropdowns.length}`);

// Search Fields
const searchFields = extractComponents('<ds-search-field[^>]*>[\\s\\S]*?</ds-search-field>');
console.log(`  ✓ Search Fields: ${searchFields.length}`);

// Breadcrumbs
const breadcrumbs = extractComponents('<ds-breadcrumbs[^>]*>[\\s\\S]*?</ds-breadcrumbs>');
console.log(`  ✓ Breadcrumbs: ${breadcrumbs.length}`);

// Form Fields
const formFields = extractComponents('<ds-form-field[^>]*>[\\s\\S]*?</ds-form-field>');
console.log(`  ✓ Form Fields: ${formFields.length}`);

// Tabs
const tabs = extractComponents('<ds-tabs[^>]*>[\\s\\S]*?</ds-tabs>');
console.log(`  ✓ Tabs: ${tabs.length}`);

console.log('\n📦 Extracting ORGANISMS...');

// Headers
const headers = extractComponents('<ds-header[^>]*>[\\s\\S]*?</ds-header>');
console.log(`  ✓ Headers: ${headers.length}`);

// Footers
const footers = extractComponents('<ds-footer[^>]*>[\\s\\S]*?</ds-footer>');
console.log(`  ✓ Footers: ${footers.length}`);

// Cards
const cards = extractComponents('<div[^>]*class=["\'][^"\']*ds-card[^"\']*["\'][^>]*>[\\s\\S]*?</div>', 15);
console.log(`  ✓ Cards: ${cards.length}`);

// Navigation
const navigation = extractComponents('<nav[^>]*>[\\s\\S]*?</nav>');
console.log(`  ✓ Navigation: ${navigation.length}`);

// Modals/Dialogs
const modals = extractComponents('<ds-modal[^>]*>[\\s\\S]*?</ds-modal>');
console.log(`  ✓ Modals: ${modals.length}`);

console.log('\n💾 Saving components...');

// Save comprehensive atoms
const atomsData = {
  extractedAt: new Date().toISOString(),
  source: 'Lenovo UDS Marketplace',
  buttons: buttons.map((html, idx) => ({
    id: `button-${idx + 1}`,
    name: `Button ${idx + 1}`,
    html,
    framework: 'Angular (cleaned)',
    category: 'interactive'
  })),
  inputs: inputs.map((html, idx) => ({
    id: `input-${idx + 1}`,
    name: `Input ${idx + 1}`,
    html,
    framework: 'Angular (cleaned)',
    category: 'form'
  })),
  chips: chips.map((html, idx) => ({
    id: `chip-${idx + 1}`,
    name: `Chip/Badge ${idx + 1}`,
    html,
    framework: 'Angular (cleaned)',
    category: 'data-display'
  })),
  icons: icons.map((html, idx) => ({
    id: `icon-${idx + 1}`,
    name: `Icon ${idx + 1}`,
    html,
    framework: 'Angular (cleaned)',
    category: 'visual'
  })),
  avatars: avatars.map((html, idx) => ({
    id: `avatar-${idx + 1}`,
    name: `Avatar ${idx + 1}`,
    html,
    framework: 'Angular (cleaned)',
    category: 'visual'
  })),
  links: links.map((html, idx) => ({
    id: `link-${idx + 1}`,
    name: `Link ${idx + 1}`,
    html,
    framework: 'Angular (cleaned)',
    category: 'navigation'
  }))
};

fs.writeFileSync(
  path.join(COMPONENTS_DIR, 'atoms-v2.json'),
  JSON.stringify(atomsData, null, 2),
  'utf8'
);

// Save comprehensive molecules
const moleculesData = {
  extractedAt: new Date().toISOString(),
  source: 'Lenovo UDS Marketplace',
  dropdowns: dropdowns.map((html, idx) => ({
    id: `dropdown-${idx + 1}`,
    name: `Dropdown ${idx + 1}`,
    html,
    framework: 'Angular (cleaned)',
    category: 'form'
  })),
  searchFields: searchFields.map((html, idx) => ({
    id: `search-field-${idx + 1}`,
    name: `Search Field ${idx + 1}`,
    html,
    framework: 'Angular (cleaned)',
    category: 'input'
  })),
  breadcrumbs: breadcrumbs.map((html, idx) => ({
    id: `breadcrumb-${idx + 1}`,
    name: `Breadcrumb ${idx + 1}`,
    html,
    framework: 'Angular (cleaned)',
    category: 'navigation'
  })),
  formFields: formFields.map((html, idx) => ({
    id: `form-field-${idx + 1}`,
    name: `Form Field ${idx + 1}`,
    html,
    framework: 'Angular (cleaned)',
    category: 'form'
  })),
  tabs: tabs.map((html, idx) => ({
    id: `tabs-${idx + 1}`,
    name: `Tabs ${idx + 1}`,
    html,
    framework: 'Angular (cleaned)',
    category: 'navigation'
  }))
};

fs.writeFileSync(
  path.join(COMPONENTS_DIR, 'molecules-v2.json'),
  JSON.stringify(moleculesData, null, 2),
  'utf8'
);

// Save comprehensive organisms
const organismsData = {
  extractedAt: new Date().toISOString(),
  source: 'Lenovo UDS Marketplace',
  headers: headers.map((html, idx) => ({
    id: `header-${idx + 1}`,
    name: `Header ${idx + 1}`,
    html: html.substring(0, 1000) + '...', // Truncate large components
    framework: 'Angular (cleaned)',
    category: 'layout'
  })),
  footers: footers.map((html, idx) => ({
    id: `footer-${idx + 1}`,
    name: `Footer ${idx + 1}`,
    html: html.substring(0, 1000) + '...',
    framework: 'Angular (cleaned)',
    category: 'layout'
  })),
  cards: cards.map((html, idx) => ({
    id: `card-${idx + 1}`,
    name: `Card ${idx + 1}`,
    html: html.substring(0, 800) + '...',
    framework: 'Angular (cleaned)',
    category: 'content'
  })),
  navigation: navigation.map((html, idx) => ({
    id: `nav-${idx + 1}`,
    name: `Navigation ${idx + 1}`,
    html: html.substring(0, 800) + '...',
    framework: 'Angular (cleaned)',
    category: 'navigation'
  })),
  modals: modals.map((html, idx) => ({
    id: `modal-${idx + 1}`,
    name: `Modal ${idx + 1}`,
    html: html.substring(0, 800) + '...',
    framework: 'Angular (cleaned)',
    category: 'overlay'
  }))
};

fs.writeFileSync(
  path.join(COMPONENTS_DIR, 'organisms-v2.json'),
  JSON.stringify(organismsData, null, 2),
  'utf8'
);

// Summary
const totalComponents =
  buttons.length + inputs.length + chips.length + icons.length + avatars.length + links.length +
  dropdowns.length + searchFields.length + breadcrumbs.length + formFields.length + tabs.length +
  headers.length + footers.length + cards.length + navigation.length + modals.length;

const summary = {
  extractedAt: new Date().toISOString(),
  source: 'https://marketplace.naea1.uds.lenovo.com/',
  totalComponents,
  breakdown: {
    atoms: {
      total: buttons.length + inputs.length + chips.length + icons.length + avatars.length + links.length,
      buttons: buttons.length,
      inputs: inputs.length,
      chips: chips.length,
      icons: icons.length,
      avatars: avatars.length,
      links: links.length
    },
    molecules: {
      total: dropdowns.length + searchFields.length + breadcrumbs.length + formFields.length + tabs.length,
      dropdowns: dropdowns.length,
      searchFields: searchFields.length,
      breadcrumbs: breadcrumbs.length,
      formFields: formFields.length,
      tabs: tabs.length
    },
    organisms: {
      total: headers.length + footers.length + cards.length + navigation.length + modals.length,
      headers: headers.length,
      footers: footers.length,
      cards: cards.length,
      navigation: navigation.length,
      modals: modals.length
    }
  }
};

fs.writeFileSync(
  path.join(COMPONENTS_DIR, 'summary-v2.json'),
  JSON.stringify(summary, null, 2),
  'utf8'
);

console.log('\n✨ Extraction Complete!');
console.log(`\n📊 Total Components Extracted: ${totalComponents}`);
console.log(`  • Atoms: ${summary.breakdown.atoms.total}`);
console.log(`  • Molecules: ${summary.breakdown.molecules.total}`);
console.log(`  • Organisms: ${summary.breakdown.organisms.total}`);
console.log(`\n📁 Saved to: ${COMPONENTS_DIR}`);
