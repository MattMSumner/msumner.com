import { spawn, execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { chromium } from '@playwright/test';
import { PDFDocument } from 'pdf-lib';
import { formatResumeForPdf } from './format-resume-for-pdf.ts';
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
	await page.evaluate(formatResumeForPdf);
	const faces = [
		['Regular', 400, 'normal'], ['Bold', 700, 'normal'], ['Italic', 400, 'italic'],
	].map(([name, weight, style]) => {
		const file = `scripts/fonts/Carlito-${name}.ttf`;
		const data = readFileSync(join(root, file)).toString('base64');
		return `@font-face { font-family: 'Resume Carlito'; font-weight: ${weight}; font-style: ${style}; src: url(data:font/ttf;base64,${data}) format('truetype'); }`;
	}).join('\n');
	await page.addStyleTag({ content: faces + readFileSync(join(root, 'scripts/resume-pdf.css'), 'utf8') });
	await page.emulateMedia({ media: 'print', colorScheme: 'light' });
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
	try {
		process.kill(-preview.pid!);
	} catch (error) {
		if ((error as NodeJS.ErrnoException).code !== 'ESRCH') throw error;
	}
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
