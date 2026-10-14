# msumner.com

Matt Sumner's personal website, built with [Astro](https://astro.build).

## Development

Node is pinned in `.node-version` (mise picks it up automatically).

```sh
npm install
npm run dev      # local dev server at http://localhost:4321
npm run build    # production build into dist/
npm run preview  # serve the production build locally
npm run check    # type-check .astro files
```

## CI

GitHub Actions runs `npm run check` and `npm run build` on every pull request
and on pushes to `master`.
