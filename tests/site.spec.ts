import { expect, test } from '@playwright/test';

test('home page renders', async ({ page }) => {
	await page.goto('/');

	await expect(page).toHaveTitle(/Matt Sumner/);
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('Matt Sumner');
	await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('internal links resolve', async ({ page, request }) => {
	await page.goto('/');

	const hrefs = await page
		.locator('a[href^="/"], a[href^="#"]')
		.evaluateAll((links) => links.map((link) => link.getAttribute('href') ?? ''));

	for (const href of new Set(hrefs)) {
		if (href.startsWith('#')) {
			if (href.length > 1) await expect(page.locator(href), `anchor ${href}`).toHaveCount(1);
			continue;
		}
		const response = await request.get(href);
		expect(response.status(), href).toBe(200);
	}
});

test('no horizontal scroll at phone width', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/');

	const overflow = await page.evaluate(
		() => document.documentElement.scrollWidth - document.documentElement.clientWidth,
	);
	expect(overflow).toBe(0);
});
