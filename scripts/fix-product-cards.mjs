import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 Fixing product card HTML...\n');

// Read the organisms JSON file
const orgsPath = path.join(__dirname, '../public/design-system/components/organisms-v2.json');
const orgs = JSON.parse(fs.readFileSync(orgsPath, 'utf-8'));

console.log(`Found ${orgs.cards.length} product cards\n`);

// Function to fix common HTML issues
function fixCardHTML(html) {
  let fixed = html;

  // Fix: <img class="ds-card__image src="..."
  // Should be: <img class="ds-card__image" src="..."
  fixed = fixed.replace(/class="ds-card__image\s+src="/g, 'class="ds-card__image" src="');

  // Fix: <div class="card-content>
  // Should be: <div class="card-content">
  fixed = fixed.replace(/class="([^"]+)>/g, 'class="$1">');

  // Fix: <span dstruncate="" class="ds-chips__content
  // Should be: <span dstruncate="" class="ds-chips__content"
  fixed = fixed.replace(/class="ds-chips__content\s+style="/g, 'class="ds-chips__content" style="');

  // Fix other common attribute issues
  fixed = fixed.replace(/chipssize="/g, ' chipssize="');
  fixed = fixed.replace(/maxwidth="/g, ' maxwidth="');

  // Ensure all class attributes are properly closed
  fixed = fixed.replace(/class="([^"]+)\s+([a-z]+=)/g, 'class="$1" $2');

  return fixed;
}

// Fix each card
orgs.cards = orgs.cards.map((card, index) => {
  const before = card.html.length;
  card.html = fixCardHTML(card.html);
  const after = card.html.length;

  console.log(`✓ Card ${index + 1} (${card.name}): ${before} → ${after} chars`);

  return card;
});

// Write back to file
fs.writeFileSync(orgsPath, JSON.stringify(orgs, null, 2));

console.log(`\n✅ Fixed ${orgs.cards.length} product cards`);
console.log(`📁 Updated: ${orgsPath}`);
