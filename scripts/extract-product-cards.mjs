import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🎴 Extracting product cards from rendered HTML...\n');

// Read the rendered HTML
const htmlPath = path.join(__dirname, '../raw/index.rendered.html');
const html = fs.readFileSync(htmlPath, 'utf-8');

// Extract all product cards
// Look for ds-card elements with proper boundaries
const cardRegex = /<div[^>]*class="[^"]*ds-card ds-card-outline[^"]*"[^>]*>([\s\S]*?)<\/div><\/div><\/div>/g;
const cards = [];
let match;
let cardIndex = 1;

// Find all card matches
while ((match = cardRegex.exec(html)) !== null) {
  let cardHTML = match[0];

  // Extract aria-label for the card name
  const labelMatch = cardHTML.match(/aria-label="([^"]+)"/);
  const label = labelMatch ? labelMatch[1] : `Card ${cardIndex}`;

  // Clean up Angular-specific attributes
  cardHTML = cardHTML
    .replace(/_ngcontent-[^=]+=["'][^"']*["']\s*/g, '')
    .replace(/_nghost-[^=]+=["'][^"']*["']\s*/g, '')
    .replace(/ng-[^=]+=["'][^"']*["']\s*/g, '')
    .replace(/\s+class="/g, ' class="')
    .replace(/\s+>/g, '>')
    .trim();

  cards.push({
    id: `card-${cardIndex}`,
    name: label,
    html: cardHTML,
    framework: 'Angular (cleaned)',
    category: 'content'
  });

  console.log(`✓ Extracted: ${label} (${cardHTML.length} chars)`);
  cardIndex++;
}

console.log(`\n✅ Found ${cards.length} product cards\n`);

// Read existing organisms JSON
const orgsPath = path.join(__dirname, '../public/design-system/components/organisms-v2.json');
const orgs = JSON.parse(fs.readFileSync(orgsPath, 'utf-8'));

// Update cards
orgs.cards = cards;
orgs.extractedAt = new Date().toISOString();

// Write back
fs.writeFileSync(orgsPath, JSON.stringify(orgs, null, 2));

console.log(`📁 Updated: ${orgsPath}`);
console.log(`🎉 Successfully extracted and cleaned ${cards.length} product cards!`);
