/**
 * Quick test to verify black-friday-demo.html loads correctly
 */
import { chromium } from 'playwright';

async function testDemoPage() {
    console.log('🧪 Testing Black Friday Demo Page...\n');

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    // Track console messages and errors
    const errors = [];
    page.on('console', msg => {
        const text = msg.text();
        if (text.includes('✅') || text.includes('🎯') || text.includes('💡')) {
            console.log(`   ${text}`);
        }
    });
    page.on('pageerror', error => errors.push(error.message));

    try {
        // Navigate to original version
        await page.goto('http://localhost:5173/black-friday-demo.html?version=original', {
            waitUntil: 'networkidle'
        });

        // Wait for products to load
        await page.waitForSelector('#originalProducts .ds-card', { timeout: 5000 });

        // Count products
        const productCount = await page.locator('#originalProducts .ds-card').count();
        console.log(`\n📦 Products loaded: ${productCount}/11`);

        // Check if products are standard (white) cards
        const featuredCount = await page.locator('#originalProducts .ds-card-featured').count();
        console.log(`   Featured cards: ${featuredCount} (should be 0 for original version)`);

        // Check if McAfee card exists
        const mcafeeExists = await page.locator('#originalProducts .ds-card:has-text("McAfee")').count() > 0;
        console.log(`   McAfee card: ${mcafeeExists ? '✅ Found' : '❌ Missing'}`);

        // Check if hero banner exists
        const heroBannerExists = await page.locator('.image__container .banner__img--header').count() > 0;
        console.log(`   Hero banner: ${heroBannerExists ? '✅ Found' : '❌ Missing'}`);

        // Test V1 version
        await page.goto('http://localhost:5173/black-friday-demo.html?version=v1', {
            waitUntil: 'networkidle'
        });

        // Wait for V1 banner to load
        await page.waitForSelector('.bf-v1-banner', { timeout: 5000 });
        const v1BannerExists = await page.locator('.bf-v1-banner').count() > 0;
        console.log(`\n🎯 V1 Banner: ${v1BannerExists ? '✅ Loaded' : '❌ Missing'}`);

        // Check countdown timer exists
        const countdownExists = await page.locator('#v1-countdown').count() > 0;
        console.log(`   Countdown timer: ${countdownExists ? '✅ Found' : '❌ Missing'}`);

        // Check V1 products
        const v1ProductCount = await page.locator('#v1-products .ds-card').count();
        console.log(`   V1 products: ${v1ProductCount}/11`);

        // Report errors
        if (errors.length > 0) {
            console.log('\n❌ JavaScript Errors:');
            errors.forEach(err => console.log(`   - ${err}`));
        } else {
            console.log('\n✅ No JavaScript errors detected');
        }

        // Final verdict
        const allGood = productCount === 11 &&
                       featuredCount === 0 &&
                       mcafeeExists &&
                       heroBannerExists &&
                       v1BannerExists &&
                       countdownExists &&
                       v1ProductCount === 11 &&
                       errors.length === 0;

        console.log('\n' + '='.repeat(50));
        if (allGood) {
            console.log('🎉 ALL TESTS PASSED!');
            console.log('✅ Original version: 100% accurate (with hero banner)');
            console.log('✅ V1 version: Banner and products loading correctly');
        } else {
            console.log('⚠️ SOME ISSUES DETECTED - Review output above');
        }
        console.log('='.repeat(50) + '\n');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    } finally {
        await browser.close();
    }
}

testDemoPage();
