import { test, expect } from '@playwright/test';

/**
 * Accessibility Audit Tests for AgriVision Platform
 * 
 * These tests scan pages for WCAG 2.1 AA violations using axe-core.
 * Results are logged to console and can be exported for manual review.
 * 
 * Run: pnpm exec playwright test tests/integration/accessibility.spec.ts
 */

// Helper to run axe-core audit directly via page.evaluate
async function runAxeAudit(page: any, pageName: string) {
  // Inject axe-core script
  await page.addScriptTag({ path: require.resolve('axe-core') });
  
  // Run axe audit
  const results = await page.evaluate(async () => {
    return await (window as any).axe.run();
  });
  
  const violations = results.violations;
  
  if (violations.length > 0) {
    console.log(`\n🚨 ACCESSIBILITY VIOLATIONS ON: ${pageName}`);
    console.log(`   Found ${violations.length} violation(s):\n`);
    
    violations.forEach((v: any, i: number) => {
      console.log(`   ${i + 1}. [${v.impact?.toUpperCase() || 'MINOR'}] ${v.id}`);
      console.log(`      Description: ${v.description}`);
      console.log(`      Help: ${v.help}`);
      console.log(`      Help URL: ${v.helpUrl}`);
      console.log(`      Affected elements: ${v.nodes.length}`);
      
      // Log first 5 affected nodes for context
      v.nodes.slice(0, 5).forEach((node: any, j: number) => {
        console.log(`        - ${node.html || node.target}`);
        if (node.failureSummary) {
          console.log(`          Issue: ${node.failureSummary}`);
        }
      });
      console.log('');
    });
  } else {
    console.log(`\n✅ ${pageName}: No accessibility violations found`);
  }
  
  return violations;
}

// Test 1: Landing Page (/)
test('Landing Page - Accessibility Audit', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  
  const violations = await runAxeAudit(page, 'Landing Page (/)');
  
  // Log specific issues for automated fixing
  const missingAriaLabels = violations.filter((v: any) => 
    v.id === 'aria-required-attr' || v.id === 'aria-allowed-attr'
  );
  const missingAltText = violations.filter((v: any) => v.id === 'image-alt');
  const colorContrast = violations.filter((v: any) => v.id === 'color-contrast');
  const headingOrder = violations.filter((v: any) => v.id === 'heading-order');
  
  // These are critical and should be fixed
  expect(missingAltText.length).toBe(0);
});

// Test 2: Advisory Page (/advisory)
test('Advisory Page - Accessibility Audit', async ({ page }) => {
  await page.goto('/advisory');
  await page.waitForLoadState('networkidle');
  
  const violations = await runAxeAudit(page, 'Advisory Page (/advisory)');
  
  const missingAriaLabels = violations.filter((v: any) => 
    v.id === 'aria-required-attr' || v.id === 'aria-allowed-attr'
  );
  const missingAltText = violations.filter((v: any) => v.id === 'image-alt');
  
  expect(missingAltText.length).toBe(0);
});

// Test 3: Diagnosis Page (/diagnose)
test('Diagnosis Page - Accessibility Audit', async ({ page }) => {
  await page.goto('/diagnose');
  await page.waitForLoadState('networkidle');
  
  const violations = await runAxeAudit(page, 'Diagnosis Page (/diagnose)');
  
  const missingAriaLabels = violations.filter((v: any) => 
    v.id === 'aria-required-attr' || v.id === 'aria-allowed-attr'
  );
  const missingAltText = violations.filter((v: any) => v.id === 'image-alt');
  
  expect(missingAltText.length).toBe(0);
});

// Test 4: Library Page (/library)
test('Library Page - Accessibility Audit', async ({ page }) => {
  await page.goto('/library');
  await page.waitForLoadState('networkidle');
  
  const violations = await runAxeAudit(page, 'Library Page (/library)');
  
  const missingAriaLabels = violations.filter((v: any) => 
    v.id === 'aria-required-attr' || v.id === 'aria-allowed-attr'
  );
  const missingAltText = violations.filter((v: any) => v.id === 'image-alt');
  
  expect(missingAltText.length).toBe(0);
});

// Test 5: Admin Dashboard (/admin)
test('Admin Dashboard - Accessibility Audit', async ({ page }) => {
  await page.goto('/admin');
  await page.waitForLoadState('networkidle');
  
  const violations = await runAxeAudit(page, 'Admin Dashboard (/admin)');
  
  const missingAriaLabels = violations.filter((v: any) => 
    v.id === 'aria-required-attr' || v.id === 'aria-allowed-attr'
  );
  const missingAltText = violations.filter((v: any) => v.id === 'image-alt');
  
  expect(missingAltText.length).toBe(0);
});
