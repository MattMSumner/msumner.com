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

## Hosting and CI

`.github/workflows/ci.yml` runs checks and tests on pull requests and pushes to
`main`. `wrangler.jsonc` configures static assets from `dist/` for `msumner.com`.
The README documents Cloudflare Workers Builds: pushes to `main` deploy production,
and other branches receive public previews. Treat branch content as public.
DNS, redirects, and analytics settings are documented in the README and managed
outside this repository.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
