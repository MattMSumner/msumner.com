export const person = {
	name: 'Matt Sumner',
	title: 'Engineering Leader',
	tagline: 'I build diverse, engaged engineering teams, and they deliver.',
	intro: [
		'Most recently I was Director of Engineering for Customer Agent at HubSpot, the AI agent that now resolves 71% of customer conversations automatically. My org of about 40 engineers took it from an early experiment to $10M ARR in about 18 months.',
		'My role was impacted in HubSpot’s 7% restructuring in October 2026, and I’m looking for my next engineering leadership role on a team building products people trust.',
	],
	location: 'Greater Boston',
	workPreferences: 'Open to remote (US), hybrid in Boston, or on-site in Boston.',
};

export const links = {
	email: 'mailto:matt.m.sumner@gmail.com',
	emailAddress: 'matt.m.sumner@gmail.com',
	booking: 'https://calendar.app.google/wKUybcZfCQsHv3b1A',
	linkedin: 'https://www.linkedin.com/in/matt-m-sumner/',
	recommendations: 'https://www.linkedin.com/in/matt-m-sumner/details/recommendations/',
	github: 'https://github.com/MattMSumner',
	resume: null as string | null,
	thoughtbot: 'https://thoughtbot.com/blog/authors/matt-sumner',
	blog: 'https://appallingfarrago.com',
};

export const impact = [
	{
		figure: '$0 → $10M',
		label: 'ARR from Customer Agent',
		detail: 'New usage-based AI revenue in about 18 months of monetization.',
	},
	{
		figure: '71%',
		label: 'of conversations resolved',
		detail: 'Automatically, by Customer Agent, across chat, email and voice.',
	},
	{
		figure: 'About 40',
		label: 'engineers in my org',
		detail: 'Mission-based teams, with a roughly 50/50 gender split.',
	},
	{
		figure: '2nd',
		label: 'highest eNPS at HubSpot',
		detail: 'Company-wide in 2023, through re-orgs, a strategic pivot and the pace of AI.',
	},
];

export const principles = [
	{
		title: 'Transparency by default',
		body: 'Every two weeks I wrote reflections for my whole product group on what was happening at HubSpot and what it meant for us. I keep conversations in public channels so everyone gets heard. My talk on psychological safety became part of HubSpot’s new-hire onboarding.',
	},
	{
		title: 'Diverse teams on purpose',
		body: 'I built a gender-balanced org through intentional hiring, and hired people who don’t fit the usual mold, including a Hack Diversity intern I sponsored through to a full-time role and a parent returning to work after a career break.',
	},
	{
		title: 'Growing leaders',
		body: 'I sponsored 7 promotions in a single year, and four of my leads became Engineering Managers in 2026. The group ran without me for a month while I was on sabbatical.',
	},
	{
		title: 'High standards, with care',
		body: 'Clear expectations, direct feedback, and honest conversations when things aren’t working. We ship in small, iterative milestones.',
	},
];

export const experience = [
	{
		company: 'HubSpot',
		place: 'Cambridge, MA (remote)',
		dates: '2020 – 2026',
		roles: [
			{
				title: 'Director of Engineering, Customer Agent',
				dates: 'Mar 2026 – Oct 2026',
				summary: 'Led about 40 engineers in mission-based teams building Customer Agent, HubSpot’s AI agent for customer service. Live Chat and Voice joined the group in 2026.',
			},
			{
				title: 'Senior Engineering Manager, Customer Agent & Communication',
				dates: 'Jun 2022 – Mar 2026',
				summary: 'Grew the group from about 30 to 50 engineers with only 3 departures, refocused it to about 30 around Customer Agent, then rebuilt it to about 40. Was DRI for defining the billable “resolution” behind Customer Agent’s move to resolution-based pricing. Led the org through a Code Orange quality push that cut email churn from 41% to 22%, and its 7 launches for Spring Spotlight 2024, including the AI chatbot.',
			},
			{
				title: 'Engineering Lead, Conversations',
				dates: 'Apr 2020 – Jun 2022',
				summary: 'Led up to four Live Chat and Self Service teams while acting as tech lead. Led the year-long, cross-group build of Customer Portal, the top-requested feature on HubSpot’s Ideas Forum, which launched in the 2022 Service Hub relaunch.',
			},
		],
	},
	{
		company: 'thoughtbot',
		place: 'Boston, MA',
		dates: '2014 – 2020',
		roles: [
			{
				title: 'Development Director, Boston Studio',
				dates: 'Oct 2018 – Apr 2020',
				summary: 'Led and mentored a studio of about 30 people while still coding, and led hiring and new client work. Clients included Indigo AG, Adobe and Berklee College of Music.',
			},
			{
				title: 'Developer (from Apprentice)',
				dates: 'Jun 2014 – Sep 2018',
				summary: 'Built client products in Rails, Ember, React and Scala with test-driven development and pair programming.',
			},
		],
	},
	{
		company: 'The Beech Group',
		place: 'Phoenix, AZ',
		dates: '2011 – 2014',
		roles: [
			{
				title: 'Full Stack Developer',
				dates: 'Feb 2011 – Jun 2014',
				summary: 'Self-taught developer; built the Rails app that ran a medical-transportation business.',
			},
		],
	},
];

export const alsoExperience = [
	{ title: 'Professional coach', detail: 'For technical managers and working parents', dates: '2021 – 2024' },
	{ title: 'MPhys, Theoretical Physics', detail: 'Durham University, UK', dates: '2010' },
];

export const talks = [
	{
		title: 'AI Applied to Revenue',
		venue: 'Inbound Marketing Summit, Medellín, Colombia',
		year: '2026',
	},
	{
		title: 'Building Psychological Safety',
		venue: 'HubSpot EPIC Week · now part of new-hire onboarding',
		year: '',
	},
	{ title: 'We Write Code for Humans', venue: 'HubSpot EPIC Week', year: '' },
	{ title: 'The Power of Telling People What You Want', venue: 'HubSpot EPIC Week', year: '' },
	{ title: 'Iterative Development: Working Out What to Do Next', venue: 'HubSpot EPIC Week', year: '' },
];

export const talksNote = 'I’ve spoken at HubSpot’s EPIC Week every year since 2020, including a career-paths panel in 2022 and “Parents in HubSpot” in 2024.';

export const testimonials = [
	{
		quote: 'Deeply empathetic and highly effective, and he never treated those as a tradeoff.',
		name: 'Lynnsey Martin',
	},
	{
		quote: 'The manager who truly launched my career.',
		name: 'Paul Leninger',
	},
];

export const writing = {
	summary: 'Before leadership I spent nine years writing code, and some of what I learned ended up in writing.',
	posts: [
		{ title: 'The Real Story Behind Story Points', year: '2018', href: 'https://thoughtbot.com/blog/the-real-story-behind-story-points' },
		{ title: 'Deadlines', year: '2017', href: 'https://thoughtbot.com/blog/deadlines' },
		{ title: 'Factories Should be the Bare Minimum', year: '2016', href: 'https://thoughtbot.com/blog/factories-should-be-the-bare-minimum' },
		{ title: 'Better Commit Messages with a .gitmessage Template', year: '2015', href: 'https://thoughtbot.com/blog/better-commit-messages-with-a-gitmessage-template' },
	],
};
