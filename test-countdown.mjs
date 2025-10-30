/**
 * Test to verify countdown timer is working
 */
import { chromium } from 'playwright';

async function testCountdown() {
    console.log('🧪 Testing V1 Countdown Timer...\n');

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    // Track console messages
    const consoleMessages = [];
    page.on('console', msg => {
        consoleMessages.push(msg.text());
        if (msg.text().includes('✅') || msg.text().includes('countdown')) {
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
        // Navigate to V1 version
        await page.goto('http://localhost:5173/black-friday-demo.html?version=v1', {
            waitUntil: 'networkidle'
        });

        // Wait for countdown to appear
        await page.waitForSelector('#v1-countdown', { timeout: 5000 });
        console.log('✅ Countdown element found\n');

        // Get initial values
        const initialSeconds = await page.locator('#v1-seconds').textContent();
        const initialMinutes = await page.locator('#v1-minutes').textContent();
        console.log(`⏱️  Initial time: ${initialMinutes}:${initialSeconds}`);

        // Wait 2 seconds
        console.log('⏳ Waiting 2 seconds...\n');
        await page.waitForTimeout(2000);

        // Get updated values
        const newSeconds = await page.locator('#v1-seconds').textContent();
        const newMinutes = await page.locator('#v1-minutes').textContent();
        console.log(`⏱️  After 2 seconds: ${newMinutes}:${newSeconds}`);

        // Calculate if countdown is working
        const initialTotal = parseInt(initialMinutes) * 60 + parseInt(initialSeconds);
        const newTotal = parseInt(newMinutes) * 60 + parseInt(newSeconds);
        const difference = initialTotal - newTotal;

        console.log(`\n📊 Time difference: ${difference} seconds`);

        // Check if timer initialization was logged
        const timerInitialized = consoleMessages.some(msg =>
            msg.includes('V1 countdown timer initialized')
        );

        console.log('\n' + '='.repeat(50));
        if (difference >= 1 && difference <= 3 && timerInitialized) {
            console.log('🎉 COUNTDOWN IS WORKING!');
            console.log('✅ Timer initialized correctly');
            console.log('✅ Countdown is updating every second');
            console.log('✅ Time is decreasing as expected');
        } else {
            console.log('⚠️ COUNTDOWN ISSUE DETECTED');
            if (!timerInitialized) {
                console.log('❌ Timer initialization not detected');
            }
            if (difference < 1 || difference > 3) {
                console.log(`❌ Time difference unexpected: ${difference} (expected 1-3)`);
            }
        }

        if (errors.length > 0) {
            console.log('\n❌ JavaScript Errors:');
            errors.forEach(err => console.log(`   - ${err}`));
        }

        console.log('='.repeat(50) + '\n');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    } finally {
        await browser.close();
    }
}

testCountdown();
