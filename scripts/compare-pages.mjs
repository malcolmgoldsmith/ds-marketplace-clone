import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LIVE_URL = 'https://marketplace.naea1.uds.lenovo.com/';
const LOCAL_URL = 'http://localhost:5173/design-system.html';
const VIEWPORT = { width: 1440, height: 900 };
const DEVICE_SCALE_FACTOR = 2;

console.log('🔍 Starting page comparison...\n');

async function capturePages() {
  const browser = await chromium.launch({
    headless: true,
    args: ['--disable-web-security']
  });

  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: DEVICE_SCALE_FACTOR,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });

  // Create comparison directory
  const comparisonDir = path.join(__dirname, '../verification/comparison');
  if (!fs.existsSync(comparisonDir)) {
    fs.mkdirSync(comparisonDir, { recursive: true });
  }

  try {
    // Capture live marketplace page
    console.log('📸 Capturing live marketplace page...');
    const livePage = await context.newPage();
    await livePage.goto(LIVE_URL, { waitUntil: 'networkidle', timeout: 60000 });

    // Wait for main content
    await livePage.waitForSelector('.ds-header', { timeout: 10000 }).catch(() => {});
    await livePage.waitForTimeout(2000);

    await livePage.screenshot({
      path: path.join(comparisonDir, 'live-marketplace.png'),
      fullPage: true
    });

    // Extract component info from live page
    const liveComponents = await livePage.evaluate(() => {
      const components = {
        header: !!document.querySelector('.ds-header'),
        productCards: document.querySelectorAll('.ds-card').length,
        breadcrumbs: !!document.querySelector('ds-breadcrumbs'),
        searchField: !!document.querySelector('ds-search-field'),
        dropdown: !!document.querySelector('ds-country-dropdown'),
        buttons: document.querySelectorAll('.ds-btn').length,
        colors: {
          primary: getComputedStyle(document.documentElement).getPropertyValue('--midnight-40'),
          background: getComputedStyle(document.body).backgroundColor
        }
      };
      return components;
    });

    console.log('✅ Live page captured');
    console.log('   Components found:', JSON.stringify(liveComponents, null, 2));

    await livePage.close();

    // Capture local design system page
    console.log('\n📸 Capturing local design system page...');
    const localPage = await context.newPage();

    try {
      await localPage.goto(LOCAL_URL, { waitUntil: 'networkidle', timeout: 10000 });
      await localPage.waitForTimeout(2000);

      await localPage.screenshot({
        path: path.join(comparisonDir, 'local-design-system.png'),
        fullPage: true
      });

      // Extract component info from design system page
      const localComponents = await localPage.evaluate(() => {
        const components = {
          sections: Array.from(document.querySelectorAll('.ds-section-heading')).map(h => h.textContent.trim()),
          productCards: document.querySelectorAll('.ds-card').length,
          buttons: document.querySelectorAll('.ds-btn').length,
          dropdowns: document.querySelectorAll('.ds-dropdown').length,
          searchFields: document.querySelectorAll('.ds-search').length || document.querySelectorAll('ds-search-field').length,
          breadcrumbs: document.querySelectorAll('ds-breadcrumbs').length
        };
        return components;
      });

      console.log('✅ Design system page captured');
      console.log('   Components found:', JSON.stringify(localComponents, null, 2));

      // Generate comparison report
      const report = {
        timestamp: new Date().toISOString(),
        live: liveComponents,
        local: localComponents,
        comparison: {
          productCards: {
            live: liveComponents.productCards,
            local: localComponents.productCards,
            match: liveComponents.productCards === localComponents.productCards
          },
          buttons: {
            live: liveComponents.buttons,
            local: localComponents.buttons,
            match: liveComponents.buttons === localComponents.buttons
          }
        }
      };

      fs.writeFileSync(
        path.join(comparisonDir, 'comparison-report.json'),
        JSON.stringify(report, null, 2)
      );

      console.log('\n📊 Comparison report saved to verification/comparison/comparison-report.json');

      await localPage.close();

    } catch (error) {
      console.error('❌ Error capturing local page:', error.message);
      console.log('   Make sure dev server is running on http://localhost:5173');
    }

  } catch (error) {
    console.error('❌ Error during comparison:', error);
  } finally {
    await context.close();
    await browser.close();
  }
}

async function analyzeComponents() {
  console.log('\n🔬 Analyzing component differences...\n');

  const reportPath = path.join(__dirname, '../verification/comparison/comparison-report.json');

  if (!fs.existsSync(reportPath)) {
    console.log('⚠️  No comparison report found. Run capture first.');
    return;
  }

  const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));

  console.log('Component Comparison:');
  console.log('====================');

  if (report.comparison) {
    for (const [component, data] of Object.entries(report.comparison)) {
      const status = data.match ? '✅' : '❌';
      console.log(`${status} ${component}: Live=${data.live}, Local=${data.local}`);
    }
  }

  console.log('\nLocal Design System Sections:');
  if (report.local.sections) {
    report.local.sections.forEach(section => {
      console.log(`  - ${section}`);
    });
  }

  return report;
}

// Run the comparison
(async () => {
  await capturePages();
  await analyzeComponents();

  console.log('\n✨ Comparison complete!');
  console.log('📁 Screenshots saved to: verification/comparison/');
})();
