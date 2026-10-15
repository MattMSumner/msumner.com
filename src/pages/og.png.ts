import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Resvg } from '@resvg/resvg-js';
import type { APIRoute } from 'astro';
import satori from 'satori';
import { person } from '../content/site';

export const width = 1200;
export const height = 630;

const root = process.cwd();
const font = (weight: number) =>
	readFileSync(join(root, `node_modules/@fontsource/inter/files/inter-latin-${weight}-normal.woff`));
const headshot = `data:image/jpeg;base64,${readFileSync(join(root, 'src/assets/headshot.jpg')).toString('base64')}`;

const colors = {
	bg: '#ffffff',
	ink: '#0f172a',
	muted: '#475569',
	accent: '#3047d1',
	accentSoft: '#e4e9ff',
};

type Node = { type: string; props: { style?: Record<string, unknown>; children?: unknown; [key: string]: unknown } };
const el = (type: string, style: Record<string, unknown>, children?: unknown, props: Record<string, unknown> = {}): Node => ({
	type,
	props: { style, children, ...props },
});

export const GET: APIRoute = async () => {
	const card = el(
		'div',
		{
			width: width - 2 * 80,
			height: height - 2 * 72,
			display: 'flex',
			alignItems: 'center',
			gap: 72,
			padding: '72px 80px',
			background: colors.bg,
			fontFamily: 'Inter',
			color: colors.ink,
		},
		[
			el('div', { display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: 668, height: 486 }, [
				el('div', { display: 'flex', flexDirection: 'column' }, [
					el(
						'div',
						{
							display: 'flex',
							alignSelf: 'flex-start',
							padding: '8px 20px',
							borderRadius: 999,
							background: colors.accentSoft,
							color: colors.accent,
							fontSize: 26,
							fontWeight: 600,
						},
						person.title,
					),
					el('div', { marginTop: 20, fontSize: 84, fontWeight: 800, letterSpacing: -3, lineHeight: 1 }, person.name),
					el('div', { marginTop: 22, fontSize: 34, fontWeight: 600, lineHeight: 1.25, letterSpacing: -0.5 }, person.tagline),
					el('div', { marginTop: 18, fontSize: 25, color: colors.muted, lineHeight: 1.4 }, person.proof),
				]),
				el('div', { display: 'flex', fontSize: 28, fontWeight: 600, color: colors.accent }, 'msumner.com'),
			]),
			el('div', { display: 'flex', position: 'relative', flexShrink: 0, width: 320, height: 395 }, [
				el('div', {
					position: 'absolute',
					top: 20,
					left: 20,
					width: 300,
					height: 375,
					borderRadius: 28,
					background: colors.accentSoft,
				}),
				el('img', { position: 'absolute', top: 0, left: 0, width: 300, height: 375, borderRadius: 28, objectFit: 'cover', objectPosition: '50% 20%' }, undefined, {
					src: headshot,
					width: 300,
					height: 375,
				}),
			]),
		],
	);

	const svg = await satori(card as Parameters<typeof satori>[0], {
		width,
		height,
		fonts: [400, 600, 800].map((weight) => ({ name: 'Inter', data: font(weight), weight: weight as 400 | 600 | 800, style: 'normal' as const })),
	});
	const png = new Resvg(svg, { fitTo: { mode: 'width', value: width } }).render().asPng();

	return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
