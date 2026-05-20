const { chromium } = require('@playwright/test');

async function checkIssues() {
  console.log('Fetching console warnings and hydration errors...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  const consoleMsgs = [];
  page.on('console', msg => {
    consoleMsgs.push({ type: msg.type(), text: msg.text() });
  });

  page.on('pageerror', err => {
    console.log('PAGE ERROR:', err.message);
  });

  try {
    await page.goto('http://localhost:3000/library', { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(3000);
    
    console.log('=== Console Messages ===');
    consoleMsgs.forEach(m => {
      if (m.type === 'error' || m.type === 'warning') {
        console.log(`[${m.type.toUpperCase()}] ${m.text}`);
      }
    });
  } catch (e) {
    console.error('Failed to load page:', e);
  }

  await browser.close();
}

checkIssues();
