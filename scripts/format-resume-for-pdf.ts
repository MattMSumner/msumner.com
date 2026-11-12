/** Runs only in the PDF generator's browser; the public webpage is untouched. */
export function formatResumeForPdf() {
	const resume = document.querySelector<HTMLElement>('.resume');
	if (!resume) throw new Error('Resume content missing');
	const headings = [...resume.querySelectorAll('h2')];
	const section = (title: string) => {
		const heading = headings.find((node) => node.textContent === title);
		if (!heading) throw new Error(`Resume section missing: ${title}`);
		const nodes: Element[] = [];
		for (let node = heading.nextElementSibling; node && node.tagName !== 'H2'; node = node.nextElementSibling) nodes.push(node);
		return { heading, nodes };
	};
	const summary = section('Summary');
	const experience = section('Experience');
	const speaking = section('Speaking');
	const education = section('Education');
	const additional = section('Additional');
	const testimonials = section('What my teams say');

	resume.classList.add('resume-pdf');
	resume.querySelector('h1')!.textContent = resume.querySelector('h1')!.textContent!.toUpperCase();
	resume.querySelector('h1 + p')!.classList.add('pdf-title');
	resume.querySelector('h1 + p + p')!.classList.add('pdf-contact');
	summary.heading.remove();
	summary.nodes.at(-1)!.classList.add('pdf-expertise');
	experience.heading.textContent = 'Recent Professional Experience';

	// Select achievements by their existing lead-ins, leaving new bullets in the
	// responsibilities list by default. Move nodes to preserve links and wording.
	const achievements = ['Took Customer Agent', 'Grew leaders', 'Set direction', 'Stayed hands-on', 'Turned a broad quality', 'Bet early on AI', 'Turned around a Live Chat'];
	for (const list of experience.nodes.filter((node) => node.tagName === 'UL')) {
		const items = [...list.children];
		const selected = items.filter((item) => achievements.some((prefix) => item.textContent!.startsWith(prefix)));
		// The second thoughtbot studio bullet describes the client portfolio.
		if (list.previousElementSibling?.textContent?.startsWith('Development Director')) selected.push(...items.slice(1));
		if (!selected.length) continue;
		const label = document.createElement('h4');
		label.textContent = 'Key Accomplishments';
		const group = document.createElement('ul');
		group.className = 'pdf-accomplishments';
		group.append(...selected);
		list.after(label, group);
	}
	for (const heading of experience.nodes.filter((node) => node.tagName === 'H3')) {
		const parts = heading.textContent!.split(' · ');
		if (parts.length !== 3) throw new Error(`Expected company, location and dates: ${heading.textContent}`);
		heading.classList.add('pdf-company');
		heading.replaceChildren();
		const company = document.createElement('span');
		company.textContent = parts[0]!;
		const dates = document.createElement('span');
		// Keep the separator inside a rendered text run so Chromium retains it
		// in the PDF outline; whitespace between flex items is discarded.
		dates.textContent = ` ${parts[2]!}`;
		heading.append(company, dates);
		if (parts[0] === 'The Beech Group') {
			const label = document.createElement('h2');
			label.textContent = 'Additional Professional Experience';
			heading.before(label);
		}
	}
	for (const paragraph of experience.nodes.filter((node) => node.tagName === 'P' && node.querySelector('strong'))) {
		if (paragraph.textContent?.includes(' · ')) paragraph.classList.add('pdf-role');
	}

	// Gather the shorter closing sections in the same order as RiseSmart.
	const closing = document.createElement('h2');
	closing.textContent = 'Education, Thought Leadership, and Additional Experience';
	resume.append(closing, ...education.nodes);
	for (const [title, nodes] of [
		['Thought Leadership', speaking.nodes],
		['Additional Experience', additional.nodes],
		['What my teams say', testimonials.nodes],
	] as const) {
		const label = document.createElement('h3');
		label.className = 'pdf-subheading';
		label.textContent = title;
		resume.append(label, ...nodes);
	}
	for (const group of [speaking, education, additional, testimonials]) group.heading.remove();
}
