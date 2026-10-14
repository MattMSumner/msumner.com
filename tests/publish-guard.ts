export type Rule = { name: string; pattern: RegExp };

export const rules: Rule[] = [
	{ name: 'phone number', pattern: /(?:\+?1[\s.-]?)?\(?\b\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}\b/ },
	{ name: 'tel: link', pattern: /\btel:/i },
	{ name: 'salary-style figure', pattern: /\$\s?\d{2,3}(?:,\d{3}|\s?k)\b/i },
	{ name: 'pricing figure', pattern: /\$\d+(?:\.\d+)?\s*(?:per|\/)\s*[a-z]/i },
	{ name: 'compensation or benefits', pattern: /\b(?:salary|severance|unemployment)\b/i },
	{ name: 'evals standard claim', pattern: /without evals/i },
	{ name: 'Action Execution framework', pattern: /\bAction Execution\b/i },
	{ name: 'Responses API migration', pattern: /\bResponses API\b/i },
];

export function violations(text: string): string[] {
	return rules.filter((rule) => rule.pattern.test(text)).map((rule) => rule.name);
}

export function visibleText(html: string): string {
	return html
		.replace(/<(script|style|svg)\b[\s\S]*?<\/\1>/gi, ' ')
		.replace(/<[^>]+>/g, ' ')
		.replace(/&nbsp;/g, ' ')
		.replace(/&amp;/g, '&')
		.replace(/\s+/g, ' ');
}
