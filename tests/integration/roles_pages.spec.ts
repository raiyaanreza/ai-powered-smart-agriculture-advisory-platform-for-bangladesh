import { test, expect } from '@playwright/test';

test.describe('AgriVision Role-Based Pages and Console Access Verification', () => {

  test('1. Verify Farmer role access and Farmer Dashboard pages', async ({ page }) => {
    // Go to login page
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    // Fill in existing farmer credentials
    await page.fill('input[placeholder="Email Address"]', 'abdur.rahman@agrivision.bd');
    await page.fill('input[placeholder="Password"]', 'AgriVision@2026!');
    
    // Click Sign In
    await page.click('button[type="submit"]');

    // Should redirect to farmer dashboard or onboarding redirect
    await page.waitForURL(/.*(farmer|onboarding).*/, { timeout: 15000 });
    
    // If it routes to onboarding, it will immediately redirect to farmer
    if (page.url().includes('onboarding')) {
      await page.waitForURL(/\/farmer/, { timeout: 15000 });
    }

    await expect(page).toHaveURL(/\/farmer/);
    
    // Check key components on the farmer dashboard
    const dashboardTitle = page.locator('h1');
    await expect(dashboardTitle).toContainText(/(কৃষক|Farmer|Abdur|শুভ)/i);

    // Verify access to Advisory page
    await page.goto('/advisory');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/advisory/);
    await expect(page.locator('[placeholder*="বার্তা লিখুন"]')).toBeVisible();

    // Verify access to Diagnosis page
    await page.goto('/diagnose');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/diagnose/);

    // Verify access to Library page
    await page.goto('/library');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/library/);
  });

  test('2. Verify Admin role access and Admin Command Center', async ({ page }) => {
    // Go to login page
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    // Fill in existing admin credentials
    await page.fill('input[placeholder="Email Address"]', 'admin@agrivision.bd');
    await page.fill('input[placeholder="Password"]', 'AgriVision@2026!');
    
    // Click Sign In
    await page.click('button[type="submit"]');

    // Admin should redirect to onboarding or port 3001
    await page.waitForURL(/.*(3001|onboarding).*/, { timeout: 15000 });

    if (page.url().includes('onboarding')) {
      await page.waitForURL(/.*3001.*/, { timeout: 15000 });
    }

    // Should land on Admin App
    await expect(page.url()).toContain('3001');

    // Wait for the admin page to load
    await page.waitForLoadState('networkidle');

    if (page.url().includes('/login')) {
      await page.fill('input[placeholder="Email Address"]', 'admin@agrivision.bd');
      await page.fill('input[placeholder="Password"]', 'AgriVision@2026!');
      await page.click('button[type="submit"]');
      await page.waitForURL('http://localhost:3001/', { timeout: 15000 });
    }

    // Now we should be on the admin dashboard command center
    await expect(page).toHaveURL('http://localhost:3001/');
    await page.waitForLoadState('networkidle');
    
    // Verify admin dashboard title
    await expect(page.locator('h1')).toBeVisible();
  });
});
