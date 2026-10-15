import { readdirSync, readFileSync } from 'node:fs';
import { extname, join, relative } from 'node:path';
import { expect, test } from '@playwright/test';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { resumeSourceHash, subjectPrefix } from '../scripts/resume-source.ts';
import { violations, visibleText } from './publish-guard';

const root = join(import.meta.dirname, '..');
const dist = join(root, 'dist');

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

	for (const file of built.filter((file) => extname(file) === '.pdf')) {
		test(`${relative(dist, file)} has nothing that must not be published`, async () => {
			const { text, metadata } = await readPdf(file);
			expect(text.length, 'PDF has extractable text').toBeGreaterThan(100);
			expect([...violations(text), ...violations(text.replace(/ /g, '')), ...violations(metadata)]).toEqual([]);
		});
	}

	for (const file of built.filter((file) => ['.html', '.xml', '.txt', '.json'].includes(extname(file)))) {
		test(`${relative(dist, file)} has nothing that must not be published`, () => {
			const raw = readFileSync(file, 'utf8');
			const text = extname(file) === '.html' ? visibleText(raw) : raw;
			expect([...violations(text), ...violations(raw).filter((name) => name === 'tel: link')]).toEqual([]);
		});
	}
});

test('resume.pdf matches its source', async () => {
	const { metadata } = await readPdf(join(root, 'public', 'resume.pdf'));
	expect(metadata, 'resume.pdf is out of date: run npm run resume').toContain(
		`${subjectPrefix}${resumeSourceHash(root)}`,
	);
});

test('scans meta content, alt and title attributes as well as visible text', () => {
	for (const html of [
		'<meta name="description" content="Call 978-555-0123">',
		'<img src="/a.png" alt="Call 978-555-0123">',
		'<a href="/" title="Call 978-555-0123">Home</a>',
	]) {
		expect(violations(visibleText(html)), html).toContain('phone number');
	}
});

test.describe('guard rules', () => {
	for (const sample of [
		'Call me on 978-555-0123',
		'(978) 555 0123',
		'+1 978.555.0123',
		'<a href="tel:+19785550123">',
		'Looking for $180k',
		'$0 → $4M ARR in a year',
		'$2.5 million in AI revenue',
		'base of $180,000',
		'$0.99 per resolution',
		'$1/conversation',
		'salary expectations',
		'my severance package',
		'no AI change ships without evals',
		'I built the Action Execution framework',
		'led the Responses API migration',
		'My org of 43 engineers',
		'grew from 34 to 48 engineers',
		'refocused to 28 around Customer Agent',
		'shipping 24 AI-assisted PRs',
		'merged 24 pull requests',
		'Based in Beverly, MA',
		'beverly (Boston area)',
	]) {
		test(`flags "${sample}"`, () => {
			expect(violations(sample)).not.toEqual([]);
		});
	}

	for (const sample of [
		'more than 10,000 businesses using Customer Agent',
		'72% of conversations resolved automatically',
		'HubSpot, Apr 2020 – Oct 2026',
		'EPIC Week, every year 2020–2025',
		'matt.m.sumner@gmail.com',
		'My org of about 40 engineers',
		'grew the group from about 30 to 50 engineers',
		'a studio of about 30 people',
		'shipping production code with AI-assisted development',
		'7 promotions in a single year',
		'Greater Boston',
		'Open to remote (US), hybrid in Boston, or on-site in Boston.',
	]) {
		test(`allows "${sample}"`, () => {
			expect(violations(sample)).toEqual([]);
		});
	}
});

async function readPdf(file: string): Promise<{ text: string; metadata: string }> {
	const task = getDocument({ data: new Uint8Array(readFileSync(file)) });
	const pdf = await task.promise;
	const pages: string[] = [];
	for (let number = 1; number <= pdf.numPages; number++) {
		const content = await (await pdf.getPage(number)).getTextContent();
		pages.push(content.items.map((item) => ('str' in item ? item.str : '')).join(' '));
	}
	const { info } = (await pdf.getMetadata()) as { info: Record<string, unknown> };
	await task.destroy();
	return { text: pages.join(' ').replace(/\s+/g, ' '), metadata: Object.values(info).map(String).join(' ') };
}
