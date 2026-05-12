# AGENTS.md

This repo is the Astro Starlight documentation site for RIA Hub at `docs.riahub.ai`.

The active implementation plan is [PLAN.md](PLAN.md). Start there. `DESIGN.md` is the design-system source of truth for visual tokens, component names, and interaction rules.

`repos/` contains local reference clones only:

- `repos/ria-hub`: the product implementation. Use it to extract workflow requirements, UI behavior, copy placeholders, visual assets, and source line references.
- `repos/MakerFirst3DP.github.io`: the Astro/Svelte reference. Use it for Svelte 5 island setup, `src/` structure, component composition, and visual-system organization.

Do not treat `repos/` as code to ship in this docs site. Copy only the specific patterns, data, and assets called out in `PLAN.md`.

When completing work from `PLAN.md`:

- Remove or shrink the completed plan section so `PLAN.md` only tracks remaining work.
- Add the completed work to `CHANGELOG.md`; create it if it does not exist.
- Commit incrementally in small semantic units.
- Do not make one giant commit that mixes unrelated config, components, content, assets, and cleanup.
