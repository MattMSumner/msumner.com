import { spawn, execSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { chromium } from '@playwright/test';
import { PDFDocument } from 'pdf-lib';
import { resumeSourceHash, subjectPrefix } from './resume-source.ts';

const root = join(import.meta.dirname, '..');
const port = 4324;
const output = join(root, 'public', 'resume.pdf');

execSync('npx astro build', { cwd: root, stdio: 'inherit' });

const preview = spawn('npx', ['astro', 'preview', '--port', String(port), '--ignore-lock'], {
	cwd: root,
	stdio: 'ignore',
	detached: true,
});

try {
	await waitFor(`http://localhost:${port}/resume/`);

	const browser = await chromium.launch();
	const page = await browser.newPage();
	await page.goto(`http://localhost:${port}/resume/`, { waitUntil: 'networkidle' });
	await page.evaluate(() => document.fonts.ready);
	const pdf = await page.pdf({ preferCSSPageSize: true, printBackground: true, tagged: true, outline: true });
	await browser.close();

	const pdfDocument = await PDFDocument.load(pdf);
	pdfDocument.setTitle('Matt Sumner · Resume');
	pdfDocument.setAuthor('Matt Sumner');
	pdfDocument.setSubject(`${subjectPrefix}${resumeSourceHash(root)}`);
	pdfDocument.setCreator('msumner.com');
	pdfDocument.setProducer('msumner.com');
	writeFileSync(output, await pdfDocument.save());

	console.log(`Wrote public/resume.pdf (${pdfDocument.getPageCount()} pages)`);
} finally {
	process.kill(-preview.pid!);
}

async function waitFor(url: string) {
	for (let attempt = 0; attempt < 50; attempt++) {
		try {
			if ((await fetch(url)).ok) return;
		} catch {}
		await new Promise((resolve) => setTimeout(resolve, 200));
	}
	throw new Error(`Preview server never answered at ${url}`);
}
