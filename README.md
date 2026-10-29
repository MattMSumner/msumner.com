# msumner.com

Matt Sumner's personal website, built with [Astro](https://astro.build).

## Development

Node is pinned in `.node-version` (mise picks it up automatically).

```sh
npm install
npx playwright install chromium   # once, for the test suite
npm run dev      # local dev server at http://localhost:4321
npm run build    # production build into dist/
npm run preview  # serve the production build locally
npm run check    # type-check .astro files
npm test         # build, then run the Playwright suite against the built site
```

## Content and design

The site has a home page and a separate resume page. The home page's words and links live in `src/content/site.ts`,
the markup in `src/components/Home.astro`, and the styles in `src/styles/`
(`base.css` for resets and shared behaviour, `theme.css` for the design and its
light and dark colour tokens). IBM Plex Sans and IBM Plex Mono are self-hosted via Fontsource, so pages
make no requests to Google. The headshot in `src/assets/` has had its EXIF
metadata stripped, and Astro serves it as responsive AVIF and WebP.

## Resume

The resume lives in `src/content/resume.md`, the public version of Matt's
general resume (no phone number, team sizes rounded, nothing internal). It's
served as a web page at `/resume/` and as `public/resume.pdf`.

The PDF is generated, not hand-made. After changing the resume source or its
styles, run:

```sh
npm run resume   # builds the site, prints /resume/ to public/resume.pdf with Playwright
```

and commit the new PDF. The script stamps a fingerprint of the source files
(`src/content/resume.md`, `src/pages/resume.astro`, `src/styles/base.css` and
`src/styles/resume.css`) into the PDF's metadata, and a test fails if the
committed PDF doesn't match the current source.

Run `npm test` after generating the PDF: it rebuilds the site so `dist/` contains
the new PDF, then checks its fingerprint and publication constraints. The build
inside `npm run resume` happens before the new PDF is written.

## Link previews

`src/pages/og.png.ts` generates `/og.png`, the 1200×630 image LinkedIn, Slack
and others show when someone shares a link. It's built on every `astro build`
with [satori](https://github.com/vercel/satori) (layout and text to SVG, using
the static IBM Plex Sans and IBM Plex Mono files from `@fontsource/ibm-plex-sans`
and `@fontsource/ibm-plex-mono`) and
[resvg](https://github.com/yisibl/resvg-js) (SVG to PNG), so it needs no
browser and can't go stale. Its words come from `src/content/site.ts`.

`src/components/SocialMeta.astro` adds the Open Graph and Twitter tags to each
page. They always point at `https://msumner.com/og.png`, so branch preview URLs
show the live image, not the branch's. After changing the image, refresh
LinkedIn's cache with its [Post Inspector](https://www.linkedin.com/post-inspector/).

The Post Inspector's preview looks blurry because it shows LinkedIn's own
160×84 thumbnail scaled up, not our image. To see what people will actually
see, start a LinkedIn post containing the link and look at the card in the
editor, without publishing.

## Tests

`npm test` builds the site and runs [Playwright](https://playwright.dev) in
Chromium against `astro preview` on port 4322. It uses `--ignore-lock` so the
preview server stays in the foreground even when Astro detects a coding agent,
and doesn't clash with a preview server you already have running.

- `tests/site.spec.ts`: the page renders, internal links and anchors resolve,
  and there's no horizontal scroll at phone width (390px).
- `tests/accessibility.spec.ts`: [axe](https://github.com/dequelabs/axe-core)
  finds no WCAG 2.2 A/AA violations (including colour contrast) in light or
  dark mode.
- `tests/publish-guard.spec.ts`: scans every built HTML, XML, TXT and JSON file
  for things that must never be published: phone numbers and `tel:` links,
  salary-style or pricing figures, compensation and benefits terms, exact team
  sizes (always rounded to the nearest 10 on the site), PR counts, Matt's home
  town (the site says Greater Boston), and claims
  that aren't accurate. Rules live in `tests/publish-guard.ts` and are matched
  by pattern, so no private values are stored in this public repo. PDFs are
  scanned too: their text and metadata are extracted with pdf.js. Each rule is
  tested against examples it should flag and real content it should allow.

## CI

GitHub Actions runs `npm run check` and `npm test` on every pull request and on
pushes to `main`. If tests fail, the Playwright HTML report (with traces) is
uploaded as a build artifact.

## Hosting

The site is static files served by
[Cloudflare Workers static assets](https://developers.cloudflare.com/workers/static-assets/),
configured in `wrangler.jsonc` (worker name `msumner-com`, serving `dist/`). No
Astro adapter is needed because every page is pre-rendered.

### Domain

msumner.com is registered at Squarespace, with its DNS on Cloudflare
(nameservers `chip` and `ines`). It's served by the Worker as a custom domain
declared in `wrangler.jsonc`; `workers_dev` is off, so msumner.com is the only
production URL.

These are set in the Cloudflare dashboard rather than in this repo:

- **DNS records:** `www` is a proxied `AAAA 100::` placeholder. The TXT records
  `v=spf1 -all`, `_dmarc` (`p=reject`) and an empty `_domainkey` say the domain
  sends no email.
- **Redirect rule:** `www.msumner.com` → `https://msumner.com` (301, keeps the
  path and query string).
- **SSL/TLS:** Always Use HTTPS is on.
- **DNSSEC:** on in Cloudflare, with its DS record at Squarespace.
- **Web Analytics:** automatic setup, so Cloudflare injects the beacon script
  as pages are served.

### Deploys

Deploys run through [Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/),
which is connected to this GitHub repo:

- **Production:** every push to `main` runs `npm run build` and then `npx wrangler deploy`,
  which publishes to msumner.com.
- **Previews:** every other branch runs `npm run build` and `npx wrangler preview`
  (enabled by `previews` and `preview_urls` in `wrangler.jsonc`) and gets its own
  public preview URL at `https://<branch>-msumner-com.matt-m-sumner.workers.dev`,
  which Cloudflare posts as a comment on the PR.

The free plan runs one build at a time, so a production build can sit queued
behind a preview build. When `main` points at the same commit as a branch, the
green "Workers Builds" check on GitHub may be that branch's preview build, not
production. To confirm a deploy, check the Deployments tab in the Cloudflare
dashboard or load msumner.com and look for the change.

To check the deploy config locally without deploying, run
`npm run build && npx wrangler deploy --dry-run`.
