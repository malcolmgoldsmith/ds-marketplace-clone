/**
 * Test V2 Standard Version - Enhanced Hero & Product Badges
 */
import { chromium } from 'playwright';

async function testV2() {
    console.log('🧪 Testing V2 Standard Version...\n');

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    // Track console messages
    const consoleMessages = [];
    page.on('console', msg => {
        consoleMessages.push(msg.text());
        if (msg.text().includes('✅') || msg.text().includes('V2')) {
            console.log(`   ${msg.text()}`);
        }
    });

    // Track errors
    const errors = [];
    page.on('pageerror', error => {
        errors.push(error.message);
        console.error(`   ❌ ${error.message}`);
    });

    try {
        // Navigate to V2 version
        await page.goto('http://localhost:5173/black-friday-demo.html?version=v2', {
            waitUntil: 'networkidle'
        });

        console.log('🎨 Testing V2 Hero Banner:\n');

        // Check hero banner
        const heroBanner = await page.locator('.bf-v2-hero').count() > 0;
        console.log(`   ${heroBanner ? '✅' : '❌'} Hero banner: ${heroBanner ? 'Found' : 'Missing'}`);

        // Check headline
        const headline = await page.locator('.bf-v2-headline').textContent();
        console.log(`   ${headline ? '✅' : '❌'} Headline: "${headline}"`);

        // Check countdown items
        const countdownItems = await page.locator('.bf-v2-countdown-item').count();
        console.log(`   ${countdownItems === 4 ? '✅' : '❌'} Countdown items: ${countdownItems}/4`);

        // Get countdown values
        const days = await page.locator('#v2-days').textContent();
        const hours = await page.locator('#v2-hours').textContent();
        const minutes = await page.locator('#v2-minutes').textContent();
        const seconds = await page.locator('#v2-seconds').textContent();
        console.log(`   ⏱️  Time: ${days}:${hours}:${minutes}:${seconds}`);

        // Check CTA buttons
        const primaryBtn = await page.locator('.bf-v2-cta .btn-primary').count() > 0;
        const secondaryBtn = await page.locator('.bf-v2-cta .btn-secondary').count() > 0;
        console.log(`   ${primaryBtn && secondaryBtn ? '✅' : '❌'} CTA buttons: ${primaryBtn && secondaryBtn ? 'Both found' : 'Missing'}`);

        console.log('\n📦 Testing V2 Products:\n');

        // Check products loaded
        const productCount = await page.locator('#v2-products .ds-card').count();
        console.log(`   ${productCount === 11 ? '✅' : '❌'} Products loaded: ${productCount}/11`);

        // Check featured cards
        const featuredCount = await page.locator('#v2-products .ds-card-featured').count();
        console.log(`   ${featuredCount === 2 ? '✅' : '❌'} Featured cards: ${featuredCount} (Special Offers + McAfee)`);

        // Check countdown badges on featured cards
        const badgeCount = await page.locator('.product-countdown-badge').count();
        console.log(`   ${badgeCount === 2 ? '✅' : '❌'} Countdown badges: ${badgeCount}`);

        if (badgeCount > 0) {
            const badgeText = await page.locator('.product-countdown-badge').first().textContent();
            console.log(`   📍 Badge example: "${badgeText.trim()}"`);
        }

        console.log('\n⏱️  Testing Countdown Functionality:\n');

        // Wait 2 seconds
        const initialSeconds = await page.locator('#v2-seconds').textContent();
        console.log(`   Initial seconds: ${initialSeconds}`);
        await page.waitForTimeout(2000);
        const newSeconds = await page.locator('#v2-seconds').textContent();
        console.log(`   After 2 seconds: ${newSeconds}`);

        const isCountingDown = parseInt(initialSeconds) !== parseInt(newSeconds);
        console.log(`   ${isCountingDown ? '✅' : '❌'} Countdown active: ${isCountingDown ? 'Yes' : 'No'}`);

        // Test Sale Live state
        console.log('\n🔥 Testing Sale Live State:\n');
        await page.evaluate(() => {
            const timer = window.BlackFridayTimers.timers.get('v2-main');
            if (timer && timer.onComplete) {
                timer.onComplete();
            }
        });

        await page.waitForTimeout(500);

        const saleLive = await page.locator('.sale-live-v2').count() > 0;
        const saleLiveText = saleLive ? await page.locator('.sale-live-v2').textContent() : '';
        console.log(`   ${saleLive ? '✅' : '❌'} Sale Live banner: ${saleLive ? 'Displayed' : 'Missing'}`);
        if (saleLive) {
            console.log(`   📢 Message: "${saleLiveText.trim()}"`);
        }

        // Check timer initialization
        const v2TimerInit = consoleMessages.some(msg =>
            msg.includes('V2 countdown timer initialized')
        );

        // Final verdict
        console.log('\n' + '='.repeat(50));
        const allGood = heroBanner &&
                       countdownItems === 4 &&
                       productCount === 11 &&
                       featuredCount === 2 &&
                       badgeCount === 2 &&
                       isCountingDown &&
                       saleLive &&
                       v2TimerInit &&
                       errors.length === 0;

        if (allGood) {
            console.log('🎉 V2 STANDARD VERSION WORKING PERFECTLY!');
            console.log('✅ Enhanced hero banner with countdown');
            console.log('✅ All 11 products loaded (2 featured)');
            console.log('✅ Countdown badges on featured cards');
            console.log('✅ Timer counting down correctly');
            console.log('✅ Sale Live state working');
            console.log('✅ No errors detected');
        } else {
            console.log('⚠️ SOME ISSUES DETECTED:');
            if (!heroBanner) console.log('❌ Hero banner not found');
            if (countdownItems !== 4) console.log(`❌ Wrong countdown items: ${countdownItems}`);
            if (productCount !== 11) console.log(`❌ Wrong product count: ${productCount}`);
            if (featuredCount !== 2) console.log(`❌ Wrong featured count: ${featuredCount}`);
            if (badgeCount !== 2) console.log(`❌ Wrong badge count: ${badgeCount}`);
            if (!isCountingDown) console.log('❌ Countdown not working');
            if (!saleLive) console.log('❌ Sale Live state not working');
            if (!v2TimerInit) console.log('❌ Timer not initialized');
            if (errors.length > 0) {
                console.log('\n❌ JavaScript Errors:');
                errors.forEach(err => console.log(`   - ${err}`));
            }
        }
        console.log('='.repeat(50) + '\n');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    } finally {
        await browser.close();
    }
}

testV2();
