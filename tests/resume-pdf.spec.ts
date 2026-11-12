import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { formatResumeForPdf } from '../scripts/format-resume-for-pdf';

test('PDF regrouping preserves all bullet copy and links, and leaves the public page unchanged', async ({ page }) => {
	await page.goto('/resume/');
	const bullets = () => page.locator('.resume li').allTextContents();
	const links = () => page.locator('.resume a').evaluateAll((nodes) => nodes.map((node) => [node.textContent, node.getAttribute('href')]));
	const originalBullets = await bullets();
	const originalLinks = await links();
	const originalMarkup = await page.locator('.resume').innerHTML();
	await page.evaluate(formatResumeForPdf);
	expect((await bullets()).sort()).toEqual(originalBullets.sort());
	expect(await links()).toEqual(originalLinks);
	await expect(page.getByRole('heading', { name: 'Key Accomplishments', exact: true })).toHaveCount(3);
	await expect(page.locator('.resume h3').first()).toHaveText('HubSpotApr 2020 – Oct 2026');
	await expect(page.getByRole('heading', { name: 'Education, Thought Leadership, and Additional Experience', exact: true })).toBeVisible();
	await expect(page.locator('.pdf-contact a')).toHaveCount(4);
	await page.reload();
	expect(await page.locator('.resume').innerHTML()).toBe(originalMarkup);
});

test('generated PDF has the grouped sections, two Letter pages and embedded Carlito', async () => {
	const task = getDocument({ data: new Uint8Array(readFileSync('public/resume.pdf')), fontExtraProperties: true });
	const pdf = await task.promise;
	try {
		expect(pdf.numPages).toBe(2);
		const allText: string[] = [];
		for (let i = 1; i <= pdf.numPages; i++) {
			const page = await pdf.getPage(i);
			const [x, y, width, height] = page.view;
			expect([x, y, width, height]).toEqual([0, 0, 612, 792]);
			const text = await page.getTextContent();
			allText.push(...text.items.flatMap((item) => 'str' in item ? [item.str] : []));
			await page.getOperatorList();
			const fontNames = Object.keys(text.styles).map((name) => (page.commonObjs.get(name) as { name: string }).name);
			expect(fontNames.length).toBeGreaterThan(0);
			expect(fontNames.every((name) => /Carlito/.test(name))).toBe(true);
		}
		const text = allText.join(' ');
		for (const heading of ['MATT SUMNER', 'Recent Professional Experience', 'Key Accomplishments', 'Additional Professional Experience', 'Thought Leadership']) expect(text).toContain(heading);
	} finally {
		await task.destroy();
	}
});
