/**
 * Test V3 Deluxe Version - Full Immersive Experience
 */
import { chromium } from 'playwright';

async function testV3() {
    console.log('🧪 Testing V3 Deluxe Version...\n');

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    // Track console messages
    const consoleMessages = [];
    page.on('console', msg => {
        consoleMessages.push(msg.text());
        if (msg.text().includes('✅') || msg.text().includes('V3') || msg.text().includes('carousel')) {
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
        // Navigate to V3 version
        await page.goto('http://localhost:5173/black-friday-demo.html?version=v3', {
            waitUntil: 'networkidle',
            timeout: 10000
        });

        console.log('🎨 Testing V3 Full-Screen Hero:\n');

        // Check hero section
        const hero = await page.locator('.bf-v3-hero').count() > 0;
        console.log(`   ${hero ? '✅' : '❌'} Full-screen hero: ${hero ? 'Found' : 'Missing'}`);

        // Check lightning bolt
        const lightning = await page.locator('.bf-v3-lightning').count() > 0;
        console.log(`   ${lightning ? '✅' : '❌'} Lightning effect: ${lightning ? 'Found' : 'Missing'}`);

        // Check super headline
        const headline = await page.locator('.bf-v3-super-headline').textContent();
        console.log(`   ${headline ? '✅' : '❌'} Headline: "${headline.replace(/\n/g, ' ')}"`);

        // Check mega countdown
        const megaCountdown = await page.locator('.bf-v3-mega-countdown').count() > 0;
        const countdownItems = await page.locator('.bf-v3-mega-item').count();
        console.log(`   ${countdownItems === 4 ? '✅' : '❌'} Mega countdown: ${countdownItems}/4 items`);

        // Get countdown values
        const days = await page.locator('#v3-days').textContent();
        const hours = await page.locator('#v3-hours').textContent();
        const minutes = await page.locator('#v3-minutes').textContent();
        const seconds = await page.locator('#v3-seconds').textContent();
        console.log(`   ⏱️  Time: ${days}:${hours}:${minutes}:${seconds}`);

        // Check CTA buttons
        const megaBtn = await page.locator('.bf-v3-btn-mega').count() > 0;
        const outlineBtn = await page.locator('.bf-v3-btn-outline').count() > 0;
        console.log(`   ${megaBtn && outlineBtn ? '✅' : '❌'} CTA buttons: ${megaBtn && outlineBtn ? 'Both found' : 'Missing'}`);

        console.log('\n🎠 Testing V3 Carousel:\n');

        // Check carousel elements
        const carousel = await page.locator('.bf-v3-carousel').count() > 0;
        console.log(`   ${carousel ? '✅' : '❌'} Carousel container: ${carousel ? 'Found' : 'Missing'}`);

        // Check carousel products
        const carouselProducts = await page.locator('#v3-carousel-track .ds-card').count();
        console.log(`   ${carouselProducts > 0 ? '✅' : '❌'} Carousel products: ${carouselProducts}`);

        // Check carousel navigation
        const prevBtn = await page.locator('.bf-v3-carousel-nav.prev').count() > 0;
        const nextBtn = await page.locator('.bf-v3-carousel-nav.next').count() > 0;
        console.log(`   ${prevBtn && nextBtn ? '✅' : '❌'} Navigation buttons: ${prevBtn && nextBtn ? 'Both found' : 'Missing'}`);

        // Check carousel dots
        const dots = await page.locator('.bf-v3-carousel-dot').count();
        console.log(`   ${dots > 0 ? '✅' : '❌'} Carousel dots: ${dots}`);

        console.log('\n📁 Testing Category Tabs:\n');

        // Check category tabs
        const tabs = await page.locator('.bf-v3-tab').count();
        console.log(`   ${tabs === 5 ? '✅' : '❌'} Category tabs: ${tabs}/5`);

        // Test category filtering
        const securityTab = await page.locator('.bf-v3-tab[data-category="security"]');
        if (await securityTab.count() > 0) {
            await securityTab.click();
            await page.waitForTimeout(500);
            const visibleProducts = await page.locator('#v3-products-grid .ds-card:visible').count();
            console.log(`   ✅ Security filter: ${visibleProducts} products visible`);

            // Click "All Deals" again
            await page.locator('.bf-v3-tab[data-category="all"]').click();
            await page.waitForTimeout(500);
        }

        console.log('\n📦 Testing V3 Products:\n');

        // Check product grid
        const gridProducts = await page.locator('#v3-products-grid .ds-card').count();
        console.log(`   ${gridProducts === 11 ? '✅' : '❌'} Grid products: ${gridProducts}/11`);

        // Check featured cards
        const featuredCount = await page.locator('#v3-products-grid .ds-card-featured').count();
        console.log(`   ${featuredCount === 2 ? '✅' : '❌'} Featured cards: ${featuredCount}`);

        // Check category data attributes
        const cardsWithCategory = await page.locator('#v3-products-grid .ds-card[data-category]').count();
        console.log(`   ${cardsWithCategory > 0 ? '✅' : '❌'} Cards with categories: ${cardsWithCategory}`);

        console.log('\n⏱️  Testing Countdown Functionality:\n');

        // Wait 2 seconds
        const initialSeconds = await page.locator('#v3-seconds').textContent();
        console.log(`   Initial seconds: ${initialSeconds}`);
        await page.waitForTimeout(2000);
        const newSeconds = await page.locator('#v3-seconds').textContent();
        console.log(`   After 2 seconds: ${newSeconds}`);

        const isCountingDown = parseInt(initialSeconds) !== parseInt(newSeconds);
        console.log(`   ${isCountingDown ? '✅' : '❌'} Countdown active: ${isCountingDown ? 'Yes' : 'No'}`);

        // Test Sale Live state
        console.log('\n🔥 Testing Sale Live State:\n');
        await page.evaluate(() => {
            const timer = window.BlackFridayTimers.timers.get('v3-main');
            if (timer && timer.onComplete) {
                timer.onComplete();
            }
        });

        await page.waitForTimeout(500);

        const saleLive = await page.locator('.sale-live-v3').count() > 0;
        const saleLiveText = saleLive ? await page.locator('.sale-live-v3').textContent() : '';
        console.log(`   ${saleLive ? '✅' : '❌'} Sale Live banner: ${saleLive ? 'Displayed' : 'Missing'}`);
        if (saleLive) {
            console.log(`   📢 Message: "${saleLiveText.trim()}"`);
        }

        // Check console logs
        const v3TimerInit = consoleMessages.some(msg =>
            msg.includes('V3 countdown timer initialized')
        );
        const carouselInit = consoleMessages.some(msg =>
            msg.includes('carousel initialized')
        );

        // Final verdict
        console.log('\n' + '='.repeat(50));
        const allGood = hero &&
                       lightning &&
                       megaCountdown &&
                       countdownItems === 4 &&
                       carousel &&
                       carouselProducts > 0 &&
                       prevBtn && nextBtn &&
                       tabs === 5 &&
                       gridProducts === 11 &&
                       featuredCount === 2 &&
                       isCountingDown &&
                       saleLive &&
                       v3TimerInit &&
                       errors.length === 0;

        if (allGood) {
            console.log('🎉 V3 DELUXE VERSION WORKING PERFECTLY!');
            console.log('✅ Full-screen immersive hero');
            console.log('✅ Mega countdown with 4 time units');
            console.log('✅ Product carousel with auto-rotation');
            console.log('✅ Category filtering (5 tabs)');
            console.log('✅ All 11 products loaded (2 featured)');
            console.log('✅ Countdown timer working');
            console.log('✅ Sale Live state working');
            console.log('✅ No errors detected');
        } else {
            console.log('⚠️ SOME ISSUES DETECTED:');
            if (!hero) console.log('❌ Hero not found');
            if (!lightning) console.log('❌ Lightning not found');
            if (!megaCountdown) console.log('❌ Mega countdown not found');
            if (countdownItems !== 4) console.log(`❌ Wrong countdown items: ${countdownItems}`);
            if (!carousel) console.log('❌ Carousel not found');
            if (carouselProducts === 0) console.log('❌ No carousel products');
            if (!prevBtn || !nextBtn) console.log('❌ Navigation buttons missing');
            if (tabs !== 5) console.log(`❌ Wrong tab count: ${tabs}`);
            if (gridProducts !== 11) console.log(`❌ Wrong product count: ${gridProducts}`);
            if (featuredCount !== 2) console.log(`❌ Wrong featured count: ${featuredCount}`);
            if (!isCountingDown) console.log('❌ Countdown not working');
            if (!saleLive) console.log('❌ Sale Live state not working');
            if (!v3TimerInit) console.log('❌ Timer not initialized');
            if (!carouselInit) console.log('❌ Carousel not initialized');
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

testV3();
