import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔽 Extracting dropdown components...\n');

// Read the rendered HTML
const htmlPath = path.join(__dirname, '../raw/index.rendered.html');
const html = fs.readFileSync(htmlPath, 'utf-8');

const dropdowns = [];

// Extract country dropdown (the main dropdown in the header)
const countryDropdownRegex = /<ds-country-dropdown[^>]*>[\s\S]*?<\/ds-country-dropdown>/g;
const countryMatches = [...html.matchAll(countryDropdownRegex)];

if (countryMatches.length > 0) {
    let countryHTML = countryMatches[0][0];

    // Clean up Angular-specific attributes
    countryHTML = countryHTML
        .replace(/_ngcontent-[^=]+=["'][^"']*["']\s*/g, '')
        .replace(/_nghost-[^=]+=["'][^"']*["']\s*/g, '')
        .replace(/ng-[^=]+=["'][^"']*["']\s*/g, '')
        .replace(/\s+class="/g, ' class="')
        .replace(/\s+>/g, '>')
        .trim();

    dropdowns.push({
        id: 'dropdown-1',
        name: 'Country Dropdown',
        html: countryHTML,
        framework: 'HTML5',
        category: 'input'
    });

    console.log(`✓ Extracted: Country Dropdown (${countryHTML.length} chars)`);
}

// Create a simplified version of country dropdown for demo
const simplifiedDropdown = `<div class="ds-field ds-dropdown ds-dropdown--country theme-uds-light" aria-disabled="false">
    <div class="ds-dropdown__trigger" role="combobox" tabindex="0" aria-expanded="false" aria-label="Country Dropdown" aria-disabled="false">
        <span class="ds-field__icon">🇺🇸</span>
        <div class="ds-field__input ds-dropdown__input">United States</div>
        <span class="ds-dropdown__show-more">▼</span>
    </div>
</div>`;

dropdowns.push({
    id: 'dropdown-2',
    name: 'Country Dropdown (Simplified)',
    html: simplifiedDropdown,
    framework: 'HTML5',
    category: 'input'
});

console.log(`✓ Created: Simplified Country Dropdown`);

console.log(`\n✅ Extracted ${dropdowns.length} dropdown components\n`);

// Read existing molecules JSON
const moleculesPath = path.join(__dirname, '../public/design-system/components/molecules-v2.json');
const molecules = JSON.parse(fs.readFileSync(moleculesPath, 'utf-8'));

// Update dropdowns
molecules.dropdowns = dropdowns;
molecules.extractedAt = new Date().toISOString();

// Write back
fs.writeFileSync(moleculesPath, JSON.stringify(molecules, null, 2));

console.log(`📁 Updated: ${moleculesPath}`);
console.log(`🎉 Successfully extracted dropdown components!`);
