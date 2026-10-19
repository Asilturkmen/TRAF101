import { test, expect } from '@playwright/test';

test.describe('static pages', () => {
  test('home is prerendered in Turkish and links to the English version', async ({ page, request }) => {
    const raw = await (await request.get('/')).text();
    expect(raw).toContain('<html lang="tr"');
    expect(raw).toContain('KKTC ehliyet sınavına hazırlan');
    expect(raw).toContain('hreflang="en"');

    await page.goto('/');
    await expect(page.locator('h1')).toHaveText('KKTC ehliyet sınavına hazırlan');
    await page.locator('.lang-switch, .menu-button').first().isVisible();
    await page.goto('/en/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('h1')).toContainText('North Cyprus');
  });

  test('language switch keeps the same page', async ({ page, isMobile }) => {
    await page.goto('/levhalar/oncelik/dur/');
    if (isMobile) {
      await page.locator('.menu-button').click();
      await page.locator('.menu-lang').click();
    } else {
      await page.locator('.lang-switch').click();
    }
    await expect(page).toHaveURL(/\/en\/signs\/priority\/stop\/$/);
    await expect(page.locator('h1')).toHaveText('Stop');
  });

  test('unknown pages return 404 with a helpful page', async ({ page }) => {
    const resp = await page.goto('/boyle-bir-sayfa-yok/');
    expect(resp.status()).toBe(404);
    await expect(page.getByRole('heading', { name: 'Bu sayfa yok' })).toBeVisible();
  });

  test('old course URLs redirect after the app starts', async ({ page }) => {
    // The static host serves 404.html for /study; the client router then redirects.
    await page.goto('/study');
    await expect(page).toHaveURL(/\/levhalar\/$/);
    await expect(page.locator('h1')).toHaveText('Trafik levhaları');
    await page.goto('/scenarios');
    await expect(page).toHaveURL(/\/senaryolar\/$/);
  });

  test('sitemap and robots exist', async ({ request }) => {
    const sm = await request.get('/sitemap.xml');
    expect(sm.status()).toBe(200);
    expect(await sm.text()).toContain('xhtml:link');
    expect((await request.get('/robots.txt')).status()).toBe(200);
  });
});

test.describe('learning flows', () => {
  test('sign page question gives feedback with a source', async ({ page }) => {
    await page.goto('/levhalar/oncelik/dur/');
    const card = page.locator('.quiz-card');
    await card.locator('label.choice-option').first().click();
    await card.getByRole('button', { name: 'Kontrol et' }).click();
    await expect(card.locator('.feedback-box')).toBeVisible();
    await expect(card.locator('.basis-line').first()).toBeVisible();
  });

  test('keyboard can answer a question', async ({ page, isMobile }) => {
    test.skip(isMobile, 'keyboard flow is desktop only');
    await page.goto('/levhalar/oncelik/dur/');
    const first = page.locator('.quiz-card input[type="radio"]').first();
    await first.focus();
    await page.keyboard.press('Space');
    await expect(first).toBeChecked();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await expect(page.locator('.quiz-card .feedback-box')).toBeVisible();
  });

  test('a wrong answer in today\'s review lands in My mistakes', async ({ page }) => {
    await page.goto('/calis/bugun/');
    const card = page.locator('.quiz-card');
    await expect(card).toBeVisible();
    // Answer until we get one wrong (at most 6 tries), then check the bank.
    let wrong = false;
    for (let i = 0; i < 6 && !wrong; i++) {
      await card.locator('label.choice-option').nth(3).click();
      await card.getByRole('button', { name: 'Kontrol et' }).click();
      wrong = await card.locator('.feedback-box:not(.correct-feedback)').isVisible();
      await card.getByRole('button', { name: /Sonraki soru/ }).click();
    }
    expect(wrong).toBe(true);
    await page.goto('/hatalarim/');
    await expect(page.locator('.quiz-card')).toBeVisible();
  });

  test('a full car mock exam produces a result and appears in progress', async ({ page }) => {
    test.setTimeout(180_000);
    page.on('dialog', (d) => d.accept());
    await page.goto('/deneme-sinavi/otomobil/');
    await expect(page.locator('.exam-bar')).toBeVisible();
    await expect(page.locator('.exam-count')).toContainText('/ 50');
    for (let i = 0; i < 50; i++) {
      await page.locator('.quiz-card label.choice-option').first().click();
      if (i < 49) await page.getByRole('button', { name: 'Sonraki', exact: true }).click();
    }
    // Reload mid-way would resume; here we finish.
    await page.locator('.exam-bar').getByRole('button', { name: 'Sınavı bitir' }).click();
    await page.getByRole('button', { name: 'Evet, bitir' }).click();
    await expect(page).toHaveURL(/\/deneme-sinavi\/sonuc\/\?id=/);
    await expect(page.locator('.result-summary .score-number')).toContainText('/ 50');
    await page.goto('/ilerleme/');
    await expect(page.locator('.history table tbody tr')).toHaveCount(1);
  });

  test('an unfinished mock resumes after a reload', async ({ page }) => {
    await page.goto('/deneme-sinavi/motosiklet/');
    await page.locator('.quiz-card label.choice-option').first().click();
    await page.getByRole('button', { name: 'Sonraki', exact: true }).click();
    await page.locator('.quiz-card label.choice-option').first().click();
    await page.reload();
    await expect(page.locator('.palette-btn.answered')).toHaveCount(2);
  });

  test('sign exam rehearsal records self-grades', async ({ page }) => {
    await page.goto('/calis/levha-sinavi/');
    for (let i = 0; i < 10; i++) {
      await page.getByRole('button', { name: 'Cevabı göster' }).click();
      await page.getByRole('button', { name: i % 2 ? 'Bildim' : 'Bilemedim' }).click();
    }
    await expect(page.getByRole('heading', { name: 'Prova bitti' })).toBeVisible();
    await expect(page.locator('.score-number')).toHaveText('5 / 10');
  });

  test('scenarios run to a result', async ({ page }) => {
    await page.goto('/senaryolar/');
    for (let i = 0; i < 10; i++) {
      await page.locator('.choice-option').first().click();
      await page.locator('.quiz-actions .btn-primary').click();
    }
    await expect(page.getByRole('heading', { name: 'Senaryolar bitti' })).toBeVisible();
  });

  test('progress can be exported and reset', async ({ page }) => {
    await page.goto('/levhalar/oncelik/dur/');
    await page.locator('.quiz-card label.choice-option').first().click();
    await page.locator('.quiz-card').getByRole('button', { name: 'Kontrol et' }).click();
    await page.goto('/ilerleme/');
    const download = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Dışa aktar' }).click();
    expect((await download).suggestedFilename()).toMatch(/^test2drive-.*\.json$/);
    await page.getByRole('button', { name: 'İlerlemeyi sıfırla' }).click();
    await page.getByRole('button', { name: 'Evet, sıfırla' }).click();
    await expect(page.getByRole('heading', { name: 'Henüz ilerleme yok' })).toBeVisible();
  });
});

test.describe('phone layout', () => {
  test('no horizontal overflow on key pages', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'phone only');
    for (const p of ['/', '/en/', '/levhalar/', '/levhalar/oncelik/dur/', '/konular/', '/calis/', '/deneme-sinavi/', '/ilerleme/', '/en/how-the-exam-works/']) {
      await page.goto(p);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, p).toBeLessThanOrEqual(0);
    }
  });

  test('menu opens as a sheet and navigates', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'phone only');
    await page.goto('/');
    await page.locator('.menu-button').click();
    await expect(page.locator('dialog.menu-sheet')).toBeVisible();
    await page.locator('.menu-links a', { hasText: 'Konular' }).click();
    await expect(page).toHaveURL(/\/konular\/$/);
    await expect(page.locator('dialog.menu-sheet')).toBeHidden();
  });
});
