#!/usr/bin/env node

/**
 * Analyze cake.lenovo.com design system structure
 * This script uses Playwright to navigate and document their organization patterns
 */

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.join(__dirname, '..');
const ANALYSIS_DIR = path.join(ROOT_DIR, 'design-system', 'analysis');

const CAKE_URL = 'https://cake.lenovo.com';

console.log('🔍 Analyzing cake.lenovo.com design system structure...\n');

// Ensure analysis directory exists
if (!fs.existsSync(ANALYSIS_DIR)) {
  fs.mkdirSync(ANALYSIS_DIR, { recursive: true });
}

async function analyzeCake() {
  let browser;

  try {
    console.log('🚀 Launching browser...');
    browser = await chromium.launch({
      headless: true
    });

    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });

    const page = await context.newPage();

    console.log(`📄 Loading ${CAKE_URL}...`);
    await page.goto(CAKE_URL, {
      waitUntil: 'networkidle',
      timeout: 60000
    });

    // Wait for page to fully render
    await page.waitForTimeout(3000);

    console.log('📸 Taking full page screenshot...');
    await page.screenshot({
      path: path.join(ANALYSIS_DIR, 'cake-homepage.png'),
      fullPage: true
    });

    // Extract navigation structure
    console.log('🧭 Extracting navigation structure...');
    const navStructure = await page.evaluate(() => {
      const result = {
        mainNav: [],
        sidebar: [],
        breadcrumbs: [],
        pageTitle: document.title
      };

      // Try to find main navigation
      const navElements = document.querySelectorAll('nav a, [role="navigation"] a, .nav a, .navigation a');
      result.mainNav = Array.from(navElements).slice(0, 20).map(el => ({
        text: el.textContent.trim(),
        href: el.getAttribute('href'),
        classes: el.className
      })).filter(item => item.text);

      // Try to find sidebar
      const sidebarElements = document.querySelectorAll('aside a, .sidebar a, [class*="sidebar"] a, [class*="menu"] a');
      result.sidebar = Array.from(sidebarElements).slice(0, 30).map(el => ({
        text: el.textContent.trim(),
        href: el.getAttribute('href'),
        classes: el.className
      })).filter(item => item.text);

      // Look for headings to understand structure
      const headings = document.querySelectorAll('h1, h2, h3, h4');
      result.headings = Array.from(headings).map(el => ({
        level: el.tagName,
        text: el.textContent.trim(),
        id: el.id
      }));

      return result;
    });

    console.log(`  ✅ Found ${navStructure.mainNav.length} main nav links`);
    console.log(`  ✅ Found ${navStructure.sidebar.length} sidebar links`);
    console.log(`  ✅ Found ${navStructure.headings.length} headings`);

    // Save navigation structure
    fs.writeFileSync(
      path.join(ANALYSIS_DIR, 'navigation-structure.json'),
      JSON.stringify(navStructure, null, 2)
    );

    // Try to navigate to a components page if we can find one
    const componentsLinks = navStructure.sidebar.filter(link =>
      link.text.toLowerCase().includes('component') ||
      link.text.toLowerCase().includes('button') ||
      link.text.toLowerCase().includes('atom') ||
      link.href && link.href.includes('component')
    );

    if (componentsLinks.length > 0) {
      console.log(`\n🔗 Found potential components page: ${componentsLinks[0].text}`);
      const componentUrl = new URL(componentsLinks[0].href, CAKE_URL).href;

      console.log(`📄 Loading ${componentUrl}...`);
      await page.goto(componentUrl, {
        waitUntil: 'networkidle',
        timeout: 30000
      });

      await page.waitForTimeout(2000);

      await page.screenshot({
        path: path.join(ANALYSIS_DIR, 'cake-component-page.png'),
        fullPage: true
      });

      // Extract component page structure
      const componentStructure = await page.evaluate(() => {
        return {
          pageTitle: document.title,
          sections: Array.from(document.querySelectorAll('section, [class*="section"]')).map(el => ({
            heading: el.querySelector('h1, h2, h3')?.textContent.trim(),
            classes: el.className
          })),
          codeBlocks: document.querySelectorAll('pre, code, [class*="code"]').length,
          previewAreas: document.querySelectorAll('[class*="preview"], [class*="example"], [class*="demo"]').length
        };
      });

      console.log(`  ✅ Code blocks found: ${componentStructure.codeBlocks}`);
      console.log(`  ✅ Preview areas found: ${componentStructure.previewAreas}`);

      fs.writeFileSync(
        path.join(ANALYSIS_DIR, 'component-page-structure.json'),
        JSON.stringify(componentStructure, null, 2)
      );
    }

    // Extract overall design patterns
    console.log('\n🎨 Analyzing design patterns...');
    const designPatterns = await page.evaluate(() => {
      const computeStyle = window.getComputedStyle(document.body);

      return {
        layout: {
          hasSidebar: !!document.querySelector('aside, .sidebar, [class*="sidebar"]'),
          hasHeader: !!document.querySelector('header'),
          hasFooter: !!document.querySelector('footer'),
          mainContentSelector: document.querySelector('main')?.className || 'unknown'
        },
        colorScheme: {
          backgroundColor: computeStyle.backgroundColor,
          color: computeStyle.color,
          fontFamily: computeStyle.fontFamily
        },
        features: {
          hasSearch: !!document.querySelector('[type="search"], [class*="search"]'),
          hasThemeToggle: !!document.querySelector('[class*="theme"], [class*="dark"], [class*="light"]'),
          hasTabs: !!document.querySelector('[role="tab"], [class*="tab"]'),
          hasCopyButtons: !!document.querySelector('[class*="copy"], [data-copy]')
        }
      };
    });

    console.log('\n📊 Design Pattern Analysis:');
    console.log(`  Layout: ${JSON.stringify(designPatterns.layout, null, 2)}`);
    console.log(`  Features: ${JSON.stringify(designPatterns.features, null, 2)}`);

    fs.writeFileSync(
      path.join(ANALYSIS_DIR, 'design-patterns.json'),
      JSON.stringify(designPatterns, null, 2)
    );

    // Create summary report
    const summary = {
      url: CAKE_URL,
      analyzedAt: new Date().toISOString(),
      findings: {
        navigationLinks: navStructure.mainNav.length + navStructure.sidebar.length,
        hasSidebar: designPatterns.layout.hasSidebar,
        hasSearch: designPatterns.features.hasSearch,
        hasTabs: designPatterns.features.hasTabs,
        hasCopyButtons: designPatterns.features.hasCopyButtons,
        componentPageFound: componentsLinks.length > 0
      },
      recommendations: [
        'Use sidebar navigation for component categories',
        designPatterns.features.hasSearch ? 'Implement search functionality' : 'Consider adding search',
        designPatterns.features.hasTabs ? 'Use tabs for Preview/Code/Usage views' : 'Consider tab-based views',
        designPatterns.features.hasCopyButtons ? 'Add copy-to-clipboard for code snippets' : 'Consider copy functionality',
        'Follow atomic design methodology (atoms/molecules/organisms)',
        'Include live previews alongside code examples'
      ]
    };

    console.log('\n✨ Analysis Summary:');
    console.log(JSON.stringify(summary, null, 2));

    fs.writeFileSync(
      path.join(ANALYSIS_DIR, 'summary.json'),
      JSON.stringify(summary, null, 2)
    );

    await browser.close();

    console.log('\n✅ Analysis complete!');
    console.log(`📁 Results saved to: ${ANALYSIS_DIR}/`);
    console.log('   - cake-homepage.png');
    console.log('   - navigation-structure.json');
    console.log('   - design-patterns.json');
    console.log('   - summary.json');
    if (componentsLinks.length > 0) {
      console.log('   - cake-component-page.png');
      console.log('   - component-page-structure.json');
    }

  } catch (error) {
    console.error('\n❌ Analysis failed:', error.message);
    if (browser) {
      await browser.close();
    }
    process.exit(1);
  }
}

analyzeCake();
