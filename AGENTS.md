# Repository guide

## Architecture

This is Matt Sumner's personal website, built with Astro and strict TypeScript.
It builds static files into `dist/`, served by Cloudflare Workers static assets.
There is no application backend, database, UI framework, or Astro server adapter.

- `src/pages/index.astro` delegates the home page to `src/components/Home.astro`.
  `Home.astro` owns the document, sections, and browser scripts for the
  recommendations carousel and sticky contact bar.
- `src/content/site.ts` holds shared profile data, links, and most home-page copy.
  Some copy and metadata also live directly in components.
- `src/components/ContactLinks.astro` renders full and compact contact navigation.
- `src/components/SocialMeta.astro` supplies Open Graph and Twitter metadata for
  both pages. Canonical and social image URLs use `site` in `astro.config.mjs`,
  including on branch previews.
- `src/pages/resume.astro` renders `src/content/resume.md` directly at `/resume/`.
  Content uses plain TypeScript exports and a Markdown import, not content collections.
- `src/styles/base.css` contains shared resets and behavior; `theme.css` contains
  home-page layout and light/dark tokens; `resume.css` contains resume and print styles.
  Fonts are self-hosted IBM Plex Sans and IBM Plex Mono through Fontsource.
- `src/assets/` holds source photos, rendered through Astro's `Picture` component
  as responsive AVIF/WebP images. `public/` holds favicons and the generated resume PDF.
- `src/pages/og.png.ts` generates the 1200×630 social image at build time using
  Satori and resvg, with shared profile data, local fonts, and the headshot.

## Development

Use npm and the Node version pinned in `.node-version`. Commit dependency lockfile
changes with dependency updates.

- `npm ci`: install the locked dependencies.
- `npm run check`: check Astro and TypeScript.
- `npm run build`: generate the production site in `dist/`.
- `npm test`: build, then run the Playwright Chromium suite.
- `npx playwright install chromium`: install the browser needed by tests and PDF generation.
- `npm run resume`: build and regenerate `public/resume.pdf`.

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

Use the local CLI via `npx astro` or `npm run dev -- --background`.
The test suite manages its own foreground preview server on port 4322, using
`--ignore-lock`. PDF generation manages a separate preview server on port 4324.

## Editing and validation

Keep content, markup, and styles in their existing locations. Preserve semantic
headings, keyboard navigation, image alt text, responsive layouts, light/dark
themes, and reduced-motion support. Keep browser interactions in the existing
Astro scripts unless a change calls for a different architecture.

After changing resume Markdown, the resume page, `base.css`, or `resume.css`, run
`npm run resume` and include the updated `public/resume.pdf` in the change. The PDF
embeds a source fingerprint defined in `scripts/resume-source.ts`; tests reject
a stale PDF. Rebuild after generation (or run `npm test`) so `dist/` receives the
new PDF. Do not edit generated files in `dist/` or `.astro/`.

For application changes, run `npm run check` and `npm test`, as CI does:

- `tests/site.spec.ts`: page content, links, metadata, social image dimensions,
  responsive overflow, carousel behavior, resume availability, and contact bar behavior.
- `tests/accessibility.spec.ts`: axe WCAG A/AA checks on both pages in both color schemes.
- `tests/publish-guard.spec.ts`: built-content and PDF scans, guard-rule examples,
  and resume fingerprint validation.

The publication rules in `tests/publish-guard.ts` are intentional content constraints.
Keep phone numbers, compensation details, internal revenue/pricing figures, exact
team sizes, home-town details, and prohibited claims out of public content.
Use rounded team sizes and Greater Boston, as existing content does. Do not weaken
the guards just to make new copy pass; review the rules when changing public copy.

## Resume refreshes

Matt's working resume and supporting notes are outside this repository in
`~/development/notes/resume/`. Start with `Matt-Sumner-Resume.md` and the dated
decisions in `brag-doc.md`; `linkedin-recommendations.md` records testimonial
excerpts and reporting relationships. Tailored resumes provide additional context,
but do not automatically supersede the base resume or explicit dated decisions.
These are private working sources: selectively adapt approved public material,
not whole files, into this repository. Resolve conflicting claims before publishing.

Current content decisions (October 29, 2026):

- Headline scope is **about 50 engineers**, reflecting peak scope. Keep **about
  40 engineers** in the Director role and the **30 → 50 → 30 → 40** progression
  in detailed experience. Do not globally replace team sizes.
- The 53% metric is **HubSpot's AI credit consumption (Q1 2026)**, not generic
  AI usage. The launch resolution rate is **about 20%**; EPIC Week talks span
  **2020–2025**; the three-departure retention claim refers to **2024**.
- Coordinate edits across `src/content/site.ts`, the description in
  `src/components/Home.astro`, and `src/content/resume.md`, then regenerate the PDF.
- Keep testimonial excerpts faithful to the source and distinguish direct reports
  from members of Matt's org. The LinkedIn link says "Read more recommendations"
  because the site's selection is not the full LinkedIn set.
- Board-service titles and dates differ between the base resume and supporting
  notes. Leave that addition pending clarification rather than copying either version.

## Hosting and CI

`.github/workflows/ci.yml` runs checks and tests on pull requests and pushes to
`main`. `wrangler.jsonc` configures static assets from `dist/` for `msumner.com`.
The README documents Cloudflare Workers Builds: pushes to `main` deploy production,
and other branches receive public previews. Treat branch content as public.
DNS, redirects, and analytics settings are documented in the README and managed
outside this repository.

Before an authorized merge, check both GitHub CI and Cloudflare Workers Builds on
the current PR head, including after a rebase. A successful preview does not verify
the subsequent production deployment. If Cloudflare fails, inspect its build logs;
GitHub's check summary may contain only a dashboard link. Check `npx wrangler whoami`
before attempting authenticated diagnostics. A later green result does not establish
why an earlier build failed.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
