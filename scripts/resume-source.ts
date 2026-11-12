import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export const resumeSources = [
	'src/content/resume.md',
	'src/pages/resume.astro',
	'src/styles/base.css',
	'src/styles/resume.css',
	'scripts/build-resume-pdf.ts',
	'scripts/format-resume-for-pdf.ts',
	'scripts/resume-pdf.css',
	'scripts/fonts/Carlito-Regular.ttf',
	'scripts/fonts/Carlito-Bold.ttf',
	'scripts/fonts/Carlito-Italic.ttf',
];

export function resumeSourceHash(root: string): string {
	const hash = createHash('sha256');
	for (const file of resumeSources) {
		hash.update(file);
		hash.update(readFileSync(join(root, file)));
	}
	return hash.digest('hex').slice(0, 16);
}

export const subjectPrefix = 'Source ';
