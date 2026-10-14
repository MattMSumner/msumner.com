import { readdirSync, readFileSync } from 'node:fs';
import { extname, join, relative } from 'node:path';
import { expect, test } from '@playwright/test';
import { violations, visibleText } from './publish-guard';

const dist = join(import.meta.dirname, '..', 'dist');

function files(dir: string): string[] {
	return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
		const path = join(dir, entry.name);
		return entry.isDirectory() ? files(path) : [path];
	});
}

test.describe('built site', () => {
	const built = files(dist);

	test('has pages to scan', () => {
		expect(built.some((file) => file.endsWith('.html'))).toBe(true);
	});

	test('contains no PDFs the guard cannot read', () => {
		const pdfs = built.filter((file) => extname(file) === '.pdf').map((file) => relative(dist, file));
		expect(pdfs, 'teach the publish guard to extract PDF text before shipping a PDF').toEqual([]);
	});

	for (const file of built.filter((file) => ['.html', '.xml', '.txt', '.json'].includes(extname(file)))) {
		test(`${relative(dist, file)} has nothing that must not be published`, () => {
			const raw = readFileSync(file, 'utf8');
			const text = extname(file) === '.html' ? visibleText(raw) : raw;
			expect([...violations(text), ...violations(raw).filter((name) => name === 'tel: link')]).toEqual([]);
		});
	}
});

test.describe('guard rules', () => {
	for (const sample of [
		'Call me on 978-555-0123',
		'(978) 555 0123',
		'+1 978.555.0123',
		'<a href="tel:+19785550123">',
		'Looking for $180k',
		'base of $180,000',
		'$0.99 per resolution',
		'$1/conversation',
		'salary expectations',
		'my severance package',
		'no AI change ships without evals',
		'I built the Action Execution framework',
		'led the Responses API migration',
	]) {
		test(`flags "${sample}"`, () => {
			expect(violations(sample)).not.toEqual([]);
		});
	}

	for (const sample of [
		'$0 → $10M ARR in about 18 months',
		'71% of conversations resolved automatically',
		'a 43-engineer org; grew 34 → 48 engineers',
		'HubSpot, Apr 2020 – Oct 2026',
		'EPIC Week, every year 2020–2025',
		'matt.m.sumner@gmail.com',
	]) {
		test(`allows "${sample}"`, () => {
			expect(violations(sample)).toEqual([]);
		});
	}
});
