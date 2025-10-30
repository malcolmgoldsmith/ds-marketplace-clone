#!/usr/bin/env node

/**
 * Verify Script - Screenshot and compare live vs local renders
 *
 * This script:
 * 1. Starts the local Vite dev server
 * 2. Screenshots the local build at 1440×900, DPR=2
 * 3. Outputs verification/local-1440.png
 * 4. Provides comparison information
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.join(__dirname, '..');
const VERIFICATION_DIR = path.join(ROOT_DIR, 'verification');
const APP_DIR = path.join(ROOT_DIR, 'app');

const VIEWPORT = { width: 1440, height: 900 };
const DEVICE_SCALE_FACTOR = 2;
const LOCAL_URL = 'http://localhost:5173';

console.log('🔍 Starting verification process...');

// Ensure directories exist
if (!fs.existsSync(VERIFICATION_DIR)) {
  fs.mkdirSync(VERIFICATION_DIR, { recursive: true });
}

// Check if app/index.html exists
if (!fs.existsSync(path.join(APP_DIR, 'index.html'))) {
  console.error('❌ No app/index.html found. Run "npm run rewrite" first!');
  process.exit(1);
}

async function startDevServer() {
  return new Promise((resolve, reject) => {
    console.log('🚀 Starting Vite dev server...');

    const vite = spawn('npm', ['run', 'dev'], {
      cwd: ROOT_DIR,
      shell: true,
      stdio: ['ignore', 'pipe', 'pipe']
    });

    let serverReady = false;

    vite.stdout.on('data', (data) => {
      const output = data.toString();
      console.log(`  ${output.trim()}`);

      if (output.includes('Local') || output.includes('5173') || output.includes('ready in')) {
        if (!serverReady) {
          serverReady = true;
          setTimeout(() => resolve(vite), 3000); // Give it a moment to fully start
        }
      }
    });

    vite.stderr.on('data', (data) => {
      console.error(`  Error: ${data.toString().trim()}`);
    });

    vite.on('error', (error) => {
      reject(error);
    });

    // Timeout after 30 seconds
    setTimeout(() => {
      if (!serverReady) {
        reject(new Error('Dev server failed to start within 30 seconds'));
      }
    }, 30000);
  });
}

async function screenshotLocal(devServerProcess) {
  let browser;

  try {
    console.log('🎭 Launching browser for local screenshot...');
    browser = await chromium.launch({
      headless: true
    });

    const context = await browser.newContext({
      viewport: VIEWPORT,
      deviceScaleFactor: DEVICE_SCALE_FACTOR,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });

    const page = await context.newPage();

    console.log(`📄 Loading local page: ${LOCAL_URL}`);
    await page.goto(LOCAL_URL, {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    console.log('⏱️  Waiting for page to settle...');
    await page.waitForTimeout(2000);

    // Disable animations for stable screenshot
    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
          transition-delay: 0s !important;
        }
      `
    });

    console.log('📸 Taking screenshot...');
    const screenshotPath = path.join(VERIFICATION_DIR, 'local-1440.png');
    await page.screenshot({
      path: screenshotPath,
      fullPage: true
    });
    console.log(`✅ Screenshot saved: ${screenshotPath}`);

    await browser.close();

  } catch (error) {
    if (browser) {
      await browser.close();
    }
    throw error;
  } finally {
    // Stop the dev server
    if (devServerProcess) {
      console.log('🛑 Stopping dev server...');
      devServerProcess.kill();
    }
  }
}

function compareScreenshots() {
  const livePath = path.join(VERIFICATION_DIR, 'live-1440.png');
  const localPath = path.join(VERIFICATION_DIR, 'local-1440.png');

  const liveExists = fs.existsSync(livePath);
  const localExists = fs.existsSync(localPath);

  console.log('\n📊 Verification Results:');
  console.log('='.repeat(50));

  if (liveExists && localExists) {
    const liveStats = fs.statSync(livePath);
    const localStats = fs.statSync(localPath);

    console.log(`\n✅ Live screenshot:  ${livePath}`);
    console.log(`   Size: ${(liveStats.size / 1024).toFixed(2)} KB`);

    console.log(`\n✅ Local screenshot: ${localPath}`);
    console.log(`   Size: ${(localStats.size / 1024).toFixed(2)} KB`);

    console.log('\n💡 Next steps:');
    console.log('   1. Compare the two screenshots visually');
    console.log('   2. If there are differences, check:');
    console.log('      - CSS order and @font-face rules');
    console.log('      - Missing fonts or images');
    console.log('      - Runtime-injected styles');
    console.log('      - JavaScript-dependent layouts');

  } else {
    if (!liveExists) {
      console.log('\n❌ Live screenshot not found');
      console.log('   Run "npm run capture" first to capture the live site');
    }
    if (!localExists) {
      console.log('\n❌ Local screenshot not found');
      console.log('   Screenshot capture failed');
    }
  }

  console.log('\n' + '='.repeat(50));
}

async function main() {
  let devServerProcess;

  try {
    // Start dev server
    devServerProcess = await startDevServer();

    // Screenshot local build
    await screenshotLocal(devServerProcess);

    // Compare results
    compareScreenshots();

    console.log('\n✨ Verification complete!');

  } catch (error) {
    console.error('\n❌ Verification failed:', error.message);
    if (devServerProcess) {
      devServerProcess.kill();
    }
    process.exit(1);
  }
}

main();
