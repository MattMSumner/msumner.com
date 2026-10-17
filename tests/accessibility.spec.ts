import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

for (const colorScheme of ['light', 'dark'] as const) {
	test.describe(`${colorScheme} mode`, () => {
		test.use({ colorScheme });

		for (const path of ['/', '/resume/', '/mockups/slate/', '/mockups/bold/', '/mockups/engineer/']) {
			test(`${path} has no WCAG A/AA violations`, async ({ page }) => {
				await page.goto(path);

				const results = await new AxeBuilder({ page })
					.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
					.analyze();

				expect(results.violations).toEqual([]);
			});
		}
	});
}
