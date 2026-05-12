# RIA Hub Docs

Source for the documentation site at **[docs.riahub.ai](https://docs.riahub.ai)**.

Built with [Astro Starlight](https://starlight.astro.build/) and hosted on GitHub Pages.

## Local development

```sh
npm install
npm run dev
```

The dev server runs at `http://localhost:4321`.

## Project structure

```
.
├── public/                 # Static assets (incl. CNAME for custom domain)
│   └── ria/                # Docs-owned RIA Hub brand/status/example assets
├── src/
│   ├── components/
│   │   ├── docs/           # Public Astro component API for MDX authors
│   │   ├── islands/        # Svelte implementation details
│   │   └── media/          # Media helpers such as YouTube parsing
│   ├── content/
│   │   └── docs/           # Markdown / MDX pages
│   │       ├── index.mdx   # Landing page
│   │       ├── guides/     # How-to guides
│   │       └── reference/  # Reference material
│   ├── data/               # Typed reusable docs data
│   └── styles/             # Starlight custom CSS and RIA docs tokens
├── astro.config.mjs        # Site config + sidebar
└── .github/workflows/      # GitHub Pages deploy workflow
```

## Adding a page

1. Drop a `.md` or `.mdx` file into `src/content/docs/guides/` or `src/content/docs/reference/`.
2. Give it a frontmatter block with at least `title` and `description`.
3. Use `.md` for prose-only docs. Use `.mdx` when importing Astro components from `@components/docs/*`.
4. Do not import Svelte islands directly in MDX; the Astro wrappers decide when hydration is needed.
5. The page will appear in the sidebar automatically (sections use `autogenerate`).

## RIA assets

Brand, status, and terminal assets live under `public/ria/`. The Starlight header uses the combination mark, the landing page uses `BrandPanel`, `StatusLight` uses the copied status icons, and `TerminalCard` uses the terminal icon. `public/CNAME` is deployment metadata for the custom domain.

## Deployment

Pushes to `main` trigger `.github/workflows/deploy.yml`, which builds the site and publishes it to GitHub Pages.

## Custom domain

`public/CNAME` contains `docs.riahub.ai`. A `CNAME` DNS record at `docs.riahub.ai` points to `qoherent.github.io`. The Cloudflare proxy is **off** (DNS only) so GitHub can issue and serve the TLS certificate.
