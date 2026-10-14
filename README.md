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
  salary-style or pricing figures, compensation and benefits terms, and claims
  that aren't accurate. Rules live in `tests/publish-guard.ts` and are matched
  by pattern, so no private values are stored in this public repo. The guard
  fails if `dist/` contains a PDF, until it can extract PDF text. Each rule is
  tested against examples it should flag and real content it should allow.

## CI

GitHub Actions runs `npm run check` and `npm test` on every pull request and on
pushes to `main`. If tests fail, the Playwright HTML report (with traces) is
uploaded as a build artifact.
