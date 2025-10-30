import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOCAL_URL = 'http://localhost:5173/design-system.html';
const VIEWPORT = { width: 1440, height: 900 };
const DEVICE_SCALE_FACTOR = 2;

console.log('📸 Taking final design system screenshots...\n');

async function captureFinalScreenshots() {
  const browser = await chromium.launch({
    headless: true,
    args: ['--disable-web-security']
  });

  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: DEVICE_SCALE_FACTOR
  });

  const comparisonDir = path.join(__dirname, '../verification/comparison');
  if (!fs.existsSync(comparisonDir)) {
    fs.mkdirSync(comparisonDir, { recursive: true });
  }

  try {
    const page = await context.newPage();
    await page.goto(LOCAL_URL, { waitUntil: 'networkidle', timeout: 10000 });
    await page.waitForTimeout(2000);

    // Capture full page
    console.log('📸 Capturing full design system page...');
    await page.screenshot({
      path: path.join(comparisonDir, 'design-system-final.png'),
      fullPage: true
    });

    // Scroll to product cards section
    console.log('📸 Capturing product cards section...');
    await page.evaluate(() => {
      document.querySelector('#product-cards').scrollIntoView();
    });
    await page.waitForTimeout(500);

    const cardsSection = await page.locator('#product-cards-container');
    await cardsSection.screenshot({
      path: path.join(comparisonDir, 'product-cards-final.png')
    });

    // Scroll to dropdowns
    console.log('📸 Capturing dropdowns section...');
    await page.evaluate(() => {
      document.querySelector('#dropdown').scrollIntoView();
    });
    await page.waitForTimeout(500);

    const dropdownSection = await page.locator('#dropdown-examples');
    await dropdownSection.screenshot({
      path: path.join(comparisonDir, 'dropdowns-final.png')
    });

    // Scroll to header
    console.log('📸 Capturing header section...');
    await page.evaluate(() => {
      document.querySelector('#header').scrollIntoView();
    });
    await page.waitForTimeout(500);

    const headerSection = await page.locator('#header-examples');
    await headerSection.screenshot({
      path: path.join(comparisonDir, 'header-final.png')
    });

    // Scroll to breadcrumbs
    console.log('📸 Capturing breadcrumbs section...');
    await page.evaluate(() => {
      document.querySelector('#breadcrumbs').scrollIntoView();
    });
    await page.waitForTimeout(500);

    const breadcrumbsSection = await page.locator('#breadcrumbs-examples');
    await breadcrumbsSection.screenshot({
      path: path.join(comparisonDir, 'breadcrumbs-final.png')
    });

    // Get component counts
    const stats = await page.evaluate(() => {
      return {
        productCards: document.querySelectorAll('#product-cards-container .ds-card').length,
        featuredCards: document.querySelectorAll('.ds-card-featured').length,
        standardCards: document.querySelectorAll('.ds-card-outline').length,
        dropdowns: document.querySelectorAll('#dropdown-examples .ds-dropdown').length,
        buttons: document.querySelectorAll('.ds-btn').length,
        sections: document.querySelectorAll('.ds-section-heading').length
      };
    });

    console.log('\n✅ All screenshots captured!');
    console.log('\n📊 Component Statistics:');
    console.log(`   Total Cards: ${stats.productCards}`);
    console.log(`   Featured Cards: ${stats.featuredCards}`);
    console.log(`   Standard Cards: ${stats.standardCards}`);
    console.log(`   Dropdowns: ${stats.dropdowns}`);
    console.log(`   Buttons: ${stats.buttons}`);
    console.log(`   Sections: ${stats.sections}`);

    console.log('\n📁 Screenshots saved to: verification/comparison/');
    console.log('   - design-system-final.png (full page)');
    console.log('   - product-cards-final.png (cards section)');
    console.log('   - dropdowns-final.png (dropdowns section)');
    console.log('   - header-final.png (header section)');
    console.log('   - breadcrumbs-final.png (breadcrumbs section)');

    await page.close();

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await context.close();
    await browser.close();
  }
}

// Run the script
(async () => {
  await captureFinalScreenshots();
  console.log('\n✨ Done!');
})();
