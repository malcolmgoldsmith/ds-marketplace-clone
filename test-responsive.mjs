/**
 * Test Responsive Layouts for All Versions
 */
import { chromium } from 'playwright';

const viewports = [
    { name: 'Mobile', width: 375, height: 667 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Desktop', width: 1440, height: 900 },
    { name: 'Large Desktop', width: 1920, height: 1080 }
];

const versions = [
    { id: 'original', name: 'Original' },
    { id: 'v1', name: 'V1 Minimal' },
    { id: 'v2', name: 'V2 Standard' },
    { id: 'v3', name: 'V3 Deluxe' }
];

async function testResponsive() {
    console.log('🧪 Testing Responsive Layouts Across All Versions\n');
    console.log('='.repeat(60) + '\n');

    const browser = await chromium.launch({ headless: true });

    for (const viewport of viewports) {
        console.log(`📱 ${viewport.name} (${viewport.width}x${viewport.height})`);
        console.log('-'.repeat(60));

        const page = await browser.newPage({
            viewport: { width: viewport.width, height: viewport.height }
        });

        for (const version of versions) {
            try {
                await page.goto(`http://localhost:5173/black-friday-demo.html?version=${version.id}`, {
                    waitUntil: 'networkidle',
                    timeout: 10000
                });

                await page.waitForTimeout(500);

                // Check product grid
                const productGrid = await page.locator('.product-grid').first();
                const productCards = await page.locator('.ds-card').count();

                // Check if products are visible
                const visibleCards = await page.locator('.ds-card:visible').count();

                // Check layout
                const gridBox = await productGrid.boundingBox();
                const isCentered = gridBox ? gridBox.x > 0 : false;

                // Check for horizontal overflow
                const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
                const viewportWidth = viewport.width;
                const hasOverflow = bodyWidth > viewportWidth;

                const status = visibleCards > 0 && !hasOverflow ? '✅' : '⚠️';

                console.log(`  ${status} ${version.name.padEnd(15)} - ${visibleCards}/${productCards} cards visible, ${hasOverflow ? '❌ overflow' : '✅ no overflow'}`);

            } catch (error) {
                console.log(`  ❌ ${version.name.padEnd(15)} - Error: ${error.message.substring(0, 40)}...`);
            }
        }

        await page.close();
        console.log('');
    }

    await browser.close();

    console.log('='.repeat(60));
    console.log('✅ Responsive testing complete!\n');
    console.log('Key Points:');
    console.log('  • Product cards should be centered on all viewports');
    console.log('  • No horizontal overflow should occur');
    console.log('  • All cards should be visible (not hidden)');
    console.log('  • Layout should adapt gracefully to screen size');
    console.log('='.repeat(60) + '\n');
}

testResponsive();
