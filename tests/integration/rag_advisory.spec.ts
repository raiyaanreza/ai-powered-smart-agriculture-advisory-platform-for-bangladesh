import { test, expect } from '@playwright/test';

test.describe('End-to-End RAG Advisory Verification', () => {
  test('Should open landing page, advisory, diagnosis, and library', async ({ page }) => {
    // 1. Check landing page
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1')).toBeVisible();

    // 2. Check advisory page
    await page.goto('/advisory');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/advisory/);
    
    // 3. Check diagnosis page
    await page.goto('/diagnose');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/diagnose/);

    // 4. Check library page
    await page.goto('/library');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/library/);
  });

  test('Should ask advisory chat a question and verify citations', async ({ page }) => {
    await page.goto('/advisory');
    await page.waitForLoadState('networkidle');

    // Enter a question in the chat input (supports textarea or input)
    const chatInput = page.locator('[placeholder*="বার্তা লিখুন"]');
    await expect(chatInput).toBeVisible();
    await chatInput.fill('ধানের ব্লাস্ট রোগের প্রতিকার কি?');
    
    // Press enter to send
    await chatInput.press('Enter');

    // Wait for the response message (which should contain a citation block)
    // RAG outputs citations with source tags like "উৎস (Source):" or BARI/BRRI
    const responseBubble = page.locator('.flex.gap-4.items-start').last();
    await expect(responseBubble).toContainText(/(উৎস|Source|BRRI|BARI|blast|treatment)/i, { timeout: 45000 });
  });
});
