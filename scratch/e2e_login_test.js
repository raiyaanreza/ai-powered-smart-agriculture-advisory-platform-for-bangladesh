const { chromium } = require('@playwright/test');
const fs = require('fs');

async function runTests() {
  console.log('Starting Playwright browser E2E integration verification...');
  const browser = await chromium.launch({ headless: true });
  
  // 1. FARMER LOGIN & PORTAL VERIFICATION
  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    
    console.log('Navigating to Farmer Login Page: http://localhost:3000/login ...');
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle', timeout: 15000 });
    
    console.log('Filling in Farmer Credentials...');
    await page.fill('input[type="email"]', 'abdur.rahman@agrivision.bd');
    await page.fill('input[type="password"]', 'AgriVision@2026!');
    
    console.log('Submitting Farmer Login Form...');
    // Click submit button
    await page.click('button[type="submit"]');
    
    console.log('Waiting for authentication and redirect to complete...');
    // Wait for the URL to change to dashboard/home, and let the dashboard component mount fully
    await page.waitForTimeout(12000);
    
    console.log('Current URL after login:', page.url());
    
    // Check if full name Abdur Rahman is rendered in the UI
    const bodyText = await page.innerText('body');
    const isNameShown = bodyText.includes('Abdur Rahman') || bodyText.includes('Abdur') || bodyText.includes('Rahman');
    console.log('Is farmer profile name visible in UI?', isNameShown);
    
    // Take a screenshot of the farmer portal
    await page.screenshot({ path: 'scratch/farmer_logged_in.png', fullPage: false });
    console.log('Farmer logged in screenshot captured successfully at scratch/farmer_logged_in.png');
    
    await context.close();
  } catch (error) {
    console.error('Farmer E2E verification failed:', error);
  }
  
  // 2. ADMIN LOGIN & PORTAL VERIFICATION
  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    
    console.log('Navigating to Admin Login Page: http://localhost:3001/login ...');
    await page.goto('http://localhost:3001/login', { waitUntil: 'networkidle', timeout: 15000 });
    
    console.log('Filling in Admin Credentials...');
    await page.fill('input[type="email"]', 'admin@agrivision.bd');
    await page.fill('input[type="password"]', 'AgriVision@2026!');
    
    console.log('Submitting Admin Login Form...');
    await page.click('button[type="submit"]');
    
    console.log('Waiting for admin authentication and Command Center to load...');
    await page.waitForTimeout(6000);
    
    console.log('Current Admin URL after login:', page.url());
    
    const adminBodyText = await page.innerText('body');
    const isAdminDashboardLoaded = adminBodyText.includes('Command Center') || adminBodyText.includes('Overview') || adminBodyText.includes('System Admin');
    console.log('Is Admin Dashboard content visible in UI?', isAdminDashboardLoaded);
    
    // Take a screenshot of the admin portal
    await page.screenshot({ path: 'scratch/admin_logged_in.png', fullPage: false });
    console.log('Admin logged in screenshot captured successfully at scratch/admin_logged_in.png');
    
    await context.close();
  } catch (error) {
    console.error('Admin E2E verification failed:', error);
  }
  
  await browser.close();
  console.log('Playwright E2E verification run complete.');
}

runTests();
