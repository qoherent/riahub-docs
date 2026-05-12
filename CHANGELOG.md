# Changelog

## 2026-05-12

- Added Svelte support behind Astro wrappers, TypeScript path aliases, Starlight custom CSS, and docs-owned RIA Hub assets under `public/ria/`.
- Added reusable docs components for cards, stats, status lights, signal meters, terminal snippets, callouts, lazy YouTube embeds, collapsible lists, interactive cards, workflow graphs, and metric graphs.
- Added typed reusable workflow, onboarding, and training example data under `src/data/`.
- Added a component showcase at `src/content/docs/reference/components.mdx`.
- Added journey guides for getting started, end-to-end onboarding, training materials, synthesis/local capture, curation/labeling, inspection, training, packaging, and Screens.
- Updated the landing page and README to document the component-based authoring model.
- Wired copied public RIA assets into the Starlight header, site favicon, landing brand panel, component showcase, status chips, and terminal cards.
- Fixed lazy YouTube embeds so keyboard activation creates the iframe and applies the strict referrer policy attribute.
