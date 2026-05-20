const { chromium } = require('@playwright/test');

async function captureGlow() {
  console.log('Capturing upgraded UI pages...');
  const browser = await chromium.launch({ headless: true });
  
  // 1. Library Page
  try {
    const page = await browser.newPage();
    console.log('Navigating to http://localhost:3000/library ...');
    await page.goto('http://localhost:3000/library', { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(4000);
    await page.screenshot({ path: 'scratch/library_glowing.png', fullPage: false });
    console.log('Library screenshot saved.');
  } catch (e) {
    console.error('Library shot failed:', e);
  }

  // 2. Diagnose Page
  try {
    const page = await browser.newPage();
    console.log('Navigating to http://localhost:3000/diagnose ...');
    await page.goto('http://localhost:3000/diagnose', { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(4000);
    await page.screenshot({ path: 'scratch/diagnose_glowing.png', fullPage: false });
    console.log('Diagnose screenshot saved.');
  } catch (e) {
    console.error('Diagnose shot failed:', e);
  }

  await browser.close();
  console.log('Done capturing.');
}

captureGlow();
