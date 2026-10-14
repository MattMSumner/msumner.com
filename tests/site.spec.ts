import { expect, test } from '@playwright/test';

test('home page renders', async ({ page }) => {
	await page.goto('/');

	await expect(page).toHaveTitle('Matt Sumner · Engineering Leader');
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('Matt Sumner');
	await expect(page.locator('html')).toHaveAttribute('lang', 'en');
	await expect(page.getByText('I build diverse, engaged engineering teams, and they deliver.')).toBeVisible();
});

test('has every section', async ({ page }) => {
	await page.goto('/');

	for (const heading of ['Impact', 'How I lead', 'Experience', 'Speaking', 'What people say', 'Writing', 'Let’s talk']) {
		await expect(page.getByRole('heading', { level: 2, name: heading })).toBeVisible();
	}
});

test('contact buttons point to the right places', async ({ page }) => {
	await page.goto('/');

	for (const nav of await page.getByRole('navigation').all()) {
		await expect(nav.getByRole('link', { name: 'Email me' })).toHaveAttribute('href', 'mailto:matt.m.sumner@gmail.com');
		await expect(nav.getByRole('link', { name: 'Book a chat' })).toHaveAttribute(
			'href',
			'https://calendar.app.google/wKUybcZfCQsHv3b1A',
		);
		await expect(nav.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute(
			'href',
			'https://www.linkedin.com/in/matt-m-sumner/',
		);
	}
	expect(await page.getByRole('navigation').count()).toBe(2);
});

test('recommendations carousel', async ({ page }) => {
	await page.goto('/');

	const carousel = page.getByRole('region', { name: /Recommendations/ });
	await expect(carousel.getByRole('listitem')).toHaveCount(11);

	const previous = page.getByRole('button', { name: 'Previous recommendations' });
	const next = page.getByRole('button', { name: 'Next recommendations' });
	await expect(previous).toBeDisabled();
	await expect(next).toBeEnabled();

	await next.click();
	await expect.poll(() => carousel.evaluate((el) => el.scrollLeft)).toBeGreaterThan(0);
	await expect(previous).toBeEnabled();

	await carousel.evaluate((el) => el.scrollTo({ left: el.scrollWidth, behavior: 'instant' }));
	await expect(next).toBeDisabled();
});

test('headshot loads with alt text', async ({ page }) => {
	await page.goto('/');

	const headshot = page.getByRole('img', { name: 'Portrait of Matt Sumner, smiling' });
	await expect(headshot).toBeVisible();
	expect(await headshot.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
});

test('has a description and canonical URL', async ({ page }) => {
	await page.goto('/');

	await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /Engineering Leader/);
	await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://msumner.com/');
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
