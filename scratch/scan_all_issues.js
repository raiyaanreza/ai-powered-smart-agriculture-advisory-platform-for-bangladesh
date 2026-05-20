const { chromium } = require('@playwright/test');

async function scanAllPages() {
  const browser = await chromium.launch({ headless: true });
  
  const pagesToScan = [
    'http://localhost:3000/library',
    'http://localhost:3000/diagnose',
    'http://localhost:3000/advisory',
    'http://localhost:3000/farmer'
  ];

  for (const url of pagesToScan) {
    console.log(`\n=== Scanning Page: ${url} ===`);
    const page = await browser.newPage();
    const consoleMsgs = [];
    
    page.on('console', msg => {
      consoleMsgs.push({ type: msg.type(), text: msg.text() });
    });

    page.on('pageerror', err => {
      console.log('PAGE ERROR:', err.message);
    });

    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
      await page.waitForTimeout(3000);
      
      consoleMsgs.forEach(m => {
        if (m.type === 'error' || m.type === 'warning') {
          console.log(`  [${m.type.toUpperCase()}] ${m.text}`);
        }
      });
    } catch (e) {
      console.log('  Failed to load:', e.message);
    }
    await page.close();
  }

  await browser.close();
  console.log('\nScan complete.');
}

scanAllPages();
