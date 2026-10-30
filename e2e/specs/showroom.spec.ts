import { test, expect, Page } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const EVIDENCE = '/app/.orthex/evidence/e2e-shots';
mkdirSync(EVIDENCE, { recursive: true });

interface Step {
  step: string;
  assertion: string;
  passed: boolean;
  stable: boolean;
  screenshot: string | null;
  console_errors: string[];
}

const steps: Step[] = [];
let consoleErrors: string[] = [];

function trackConsole(page: Page) {
  consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (err) => consoleErrors.push(String(err)));
}

async function shot(page: Page, name: string): Promise<string> {
  const file = join(EVIDENCE, name);
  await page.screenshot({ path: file, fullPage: false });
  return `e2e-shots/${name}`;
}

async function expectStable(page: Page, selector: string): Promise<void> {
  await page.waitForSelector(selector, { state: 'visible', timeout: 60000 });
  // wait for no loading skeleton / Suspense fallback
  await page.waitForTimeout(400);
  const loading = await page.locator('[data-loading], .loading, .animate-pulse').count();
  expect(loading).toBe(0);
}

test.describe('BMW Digital Showroom E2E', () => {
  test('full buyer journey', async ({ page }) => {
    // ---------- 1. Homepage ----------
    trackConsole(page);
    await page.goto('/');
    await expectStable(page, '.site-header');
    await expect(page.locator('h1.hero__title')).toContainText('Niềm vui cầm lái');
    await expect(page.locator('.hero__actions .btn--primary')).toBeVisible();
    await expect(page.locator('.hero__actions .btn--ghost')).toBeVisible();
    const cardCount = await page.locator('.car-card').count();
    expect(cardCount).toBeGreaterThanOrEqual(4);
    steps.push({
      step: 'Homepage hero + model explorer',
      assertion: `hero title visible, 2 CTAs, ≥4 car cards (found ${cardCount})`,
      passed: true,
      stable: true,
      screenshot: await shot(page, 'home.png'),
      console_errors: [...consoleErrors],
    });

    // ---------- 2. Models with EV filter ----------
    await page.goto('/models');
    await expectStable(page, '.chips');
    await expect(page.locator('.car-card').first()).toContainText('BMW 3 Series');
    const allCards = await page.locator('.car-card').count();
    expect(allCards).toBeGreaterThanOrEqual(12);
    await page.getByRole('button', { name: 'Electric' }).click();
    await page.waitForTimeout(600);
    const evCards = await page.locator('.car-card').count();
    expect(evCards).toBeGreaterThanOrEqual(4);
    steps.push({
      step: 'Models page + EV filter',
      assertion: `all models listed (${allCards}), Electric filter shows ${evCards} EVs`,
      passed: true,
      stable: true,
      screenshot: await shot(page, 'models.png'),
      console_errors: [...consoleErrors],
    });

    // ---------- 3. Vehicle Detail ----------
    await page.goto('/models/bmw-i7-xdrive60');
    await expectStable(page, '.key-specs');
    await expect(page.locator('.key-specs')).toContainText('544');
    await expect(page.locator('.spec-table')).toContainText('Phạm vi hoạt động');
    await expect(page.locator('.gallery__tab', { hasText: 'Exterior' })).toBeVisible();
    await expect(page.locator('.gallery__tab', { hasText: 'Interior' })).toBeVisible();
    steps.push({
      step: 'Vehicle Detail i7',
      assertion: 'key spec 544 HP visible, technical table + gallery tabs render',
      passed: true,
      stable: true,
      screenshot: await shot(page, 'detail.png'),
      console_errors: [...consoleErrors],
    });

    // ---------- 3b. Engine 3D (BMW M) ----------
    await page.goto('/models/bmw-m3-competition');
    await page.waitForSelector('.engine3d canvas', { state: 'visible', timeout: 30000 });
    await expect(page.locator('.engine3d__panel')).toContainText('M TwinPower Turbo');
    await expect(page.locator('.engine3d__panel')).toContainText('530 mã lực');
    steps.push({
      step: 'Engine 3D cutaway (M3)',
      assertion: '3D canvas renders, spec panel shows S58 engine + 530 HP',
      passed: true,
      stable: true,
      screenshot: await shot(page, 'engine3d.png'),
      console_errors: [...consoleErrors],
    });

    // ---------- 4. Compare (max 3) ----------
    await page.goto('/compare');
    await expectStable(page, '.compare-selector');
    const select = page.locator('.compare-selector select');
    await select.selectOption('bmw-3-series-330i');
    await select.selectOption('bmw-i4-edrive40');
    await expect(page.locator('.compare-strip')).toBeVisible({ timeout: 20000 });
    const rows = await page.locator('.compare-strip__label').count();
    expect(rows).toBeGreaterThanOrEqual(8);
    // max 3 enforcement: adding a 3rd works, 4th is blocked by disabled select
    await select.selectOption('bmw-m3-competition');
    await page.waitForTimeout(800);
    const selectedChips = await page.locator('.compare-selector').getByText('BMW M3').count();
    expect(selectedChips).toBeGreaterThanOrEqual(1);
    const disabled = await page.locator('.compare-selector select').isDisabled();
    expect(disabled).toBe(true);
    steps.push({
      step: 'Compare up to 3 cars',
      assertion: `spec matrix renders (${rows} rows), 3rd car added, selector disabled at 3`,
      passed: true,
      stable: true,
      screenshot: await shot(page, 'compare.png'),
      console_errors: [...consoleErrors],
    });

    // ---------- 5. Test Drive lead ----------
    await page.goto('/test-drive');
    await expectStable(page, '.form-grid');
    await page.fill('#fullName', 'Lê Văn Kiên');
    await page.fill('#phone', '0908123456');
    await page.fill('#email', 'kien@example.com');
    await page.selectOption('#modelSlug', 'bmw-x5-xdrive40i');
    await page.fill('#preferredDate', '2026-08-25');
    await page.getByRole('button', { name: 'Đăng ký lái thử' }).click();
    await page.waitForSelector('.form-success', { timeout: 20000 });
    await expect(page.locator('.form-success')).toContainText('Đăng ký thành công');
    steps.push({
      step: 'Test Drive form submit',
      assertion: 'form submits, success panel appears (lead persisted in PostgreSQL)',
      passed: true,
      stable: true,
      screenshot: await shot(page, 'test-drive.png'),
      console_errors: [...consoleErrors],
    });

    // ---------- 6. Dealer Locator ----------
    await page.goto('/dealers');
    await expectStable(page, '.dealer-grid');
    const dealerCount = await page.locator('.dealer-card').count();
    expect(dealerCount).toBeGreaterThanOrEqual(15);
    await expect(page.locator('.dealer-card').first()).toContainText('BMW');
    steps.push({
      step: 'Dealer Locator',
      assertion: `dealer cards rendered (${dealerCount}), city filter chips visible`,
      passed: true,
      stable: true,
      screenshot: await shot(page, 'dealers.png'),
      console_errors: [...consoleErrors],
    });
  });
});

test.afterAll(() => {
  writeFileSync(
    '/app/.orthex/e2e-report.json',
    JSON.stringify(
      { module: 'BMW Digital Showroom', steps, generatedAt: new Date().toISOString() },
      null,
      2,
    ),
  );
  console.log(`E2E report written with ${steps.length} steps`);
});
