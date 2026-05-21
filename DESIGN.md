---
version: alpha
name: RIA Hub Docs Experience System
description: A component-ready design system for radio intelligence documentation that combines precise technical reading with interactive, signal-rich learning surfaces.
colors:
  primary: "#3B82F6"
  primary-high: "#60A5FA"
  secondary: "#2DD4BF"
  tertiary: "#F472B6"
  warning: "#FACC15"
  success: "#22C55E"
  danger: "#FB7185"
  neutral-bg: "#070B12"
  neutral-panel: "#0D1522"
  neutral-surface: "#121C2B"
  neutral-surface-raised: "#182438"
  border-subtle: "#263449"
  border-strong: "#3A4B66"
  text-primary: "#F8FAFC"
  text-secondary: "#B7C3D4"
  text-muted: "#7C8BA1"
  code-bg: "#08111F"
typography:
  display-xl:
    fontFamily: Sora
    fontSize: 56px
    fontWeight: 650
    lineHeight: 1.05
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Sora
    fontSize: 34px
    fontWeight: 620
    lineHeight: 1.15
    letterSpacing: -0.025em
  headline-md:
    fontFamily: Sora
    fontSize: 24px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: -0.015em
  body-md:
    fontFamily: Source Sans 3
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.65
  body-sm:
    fontFamily: Source Sans 3
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.55
  label-caps:
    fontFamily: IBM Plex Mono
    fontSize: 12px
    fontWeight: 600
    lineHeight: 1
    letterSpacing: 0.11em
  code:
    fontFamily: IBM Plex Mono
    fontSize: 14px
    fontWeight: 450
    lineHeight: 1.55
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  2xl: 64px
  content: 768px
  wide: 1120px
  gutter: 24px
rounded:
  sm: 6px
  md: 10px
  lg: 16px
  xl: 24px
  full: 9999px
components:
  doc-card:
    backgroundColor: "{colors.neutral-surface}"
    borderColor: "{colors.border-subtle}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
  signal-panel:
    backgroundColor: "{colors.neutral-panel}"
    borderColor: "{colors.border-strong}"
    accentColor: "{colors.secondary}"
    rounded: "{rounded.xl}"
  status-chip:
    backgroundColor: "{colors.neutral-surface-raised}"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.full}"
  youtube-embed:
    backgroundColor: "{colors.code-bg}"
    borderColor: "{colors.border-subtle}"
    accentColor: "{colors.primary-high}"
    rounded: "{rounded.xl}"
  graph:
    backgroundColor: "{colors.neutral-panel}"
    axisColor: "{colors.border-strong}"
    seriesPrimary: "{colors.primary-high}"
    seriesSecondary: "{colors.secondary}"
---

# RIA Hub Docs Experience System

## Overview

RIA Hub docs should feel like a guided radio lab, not a generic documentation theme. The visual language is precise, instrumented, and calm: dark technical surfaces, measured glow, compact status language, and interactive learning elements that help a reader move from "what is this?" to "I can run the workflow."

The docs remain Starlight-first and MDX-first. Authors should be able to add a normal `.md` page for prose or a `.mdx` page when they need reusable Astro components. Svelte is reserved for true islands of interactivity: selection, filtering, animated state, charts, graph exploration, and guided reveal.

## Colors

The palette keeps the RIA Hub product atmosphere while avoiding a default purple-on-dark marketing look.

- **Primary (#3B82F6):** Action blue for links, selected states, and progress.
- **Secondary (#2DD4BF):** Signal teal for RF, capture, synthesis, and validation states.
- **Tertiary (#F472B6):** Model magenta for training, inference, and ML comparisons. Use sparingly.
- **Warning (#FACC15):** Lab amber for setup warnings, prerequisites, and "check this first" callouts.
- **Success (#22C55E):** Completion, healthy runner status, and valid outputs.
- **Danger (#FB7185):** Failed runs, invalid manifests, and destructive warnings.
- **Neutrals:** Layer from `neutral-bg` to `neutral-surface-raised`; never use pure black for page backgrounds.

## Typography

Use an expressive but readable pairing.

- **Sora** is for display, headings, cards, and navigation labels. It gives the docs a distinctive engineered voice without becoming decorative.
- **Source Sans 3** is for prose. It is readable in long documentation pages and less generic than system stacks.
- **IBM Plex Mono** is for code, RF metrics, status chips, and small technical labels.

If the implementation does not ship web fonts in the first pass, preserve this hierarchy in CSS variables and fall back to Starlight/system fonts until fonts are added intentionally.

## Layout

Use Starlight as the shell, but make content blocks feel like instrument panels inside it.

- Content pages keep Starlight's readable article width by default.
- Visual sections can opt into a wide container with a `ria-wide` wrapper and a max width of 1120px.
- Interactive learning components should sit in rhythmic groups with 24px internal padding and 24px vertical separation.
- Use an 8px spacing rhythm. Small exceptions are acceptable only for optical alignment.
- Avoid page-specific one-off layouts; every rich block should be a reusable component with documented props.

## Elevation & Depth

Depth is created with tonal layers, borders, gradients, and very restrained glow. Heavy shadows are not part of the system.

- Base layer: `neutral-bg` with a subtle radial/scan-grid atmosphere.
- Reading layer: Starlight article surface.
- Component layer: bordered cards and panels using `neutral-panel` or `neutral-surface`.
- Active layer: 1px high-contrast border plus a soft glow in the relevant semantic accent.

Motion should reinforce state changes, not entertain. All motion must honor `prefers-reduced-motion`.

## Shapes

The shape language is "softened precision."

- Primary cards and media panels use 16px radius.
- Large visual panels use 24px radius.
- Buttons and chips use full radius only when they represent compact status or filters.
- Graph nodes use rounded rectangles with one accent edge, not floating blobs.

## Components

The public authoring API should be Astro components under `src/components/docs/`. Svelte files under `src/components/islands/` are implementation details wrapped by Astro components, so MDX authors do not have to remember hydration directives.

- **YouTubeEmbed:** Static thumbnail first, no YouTube iframe until activation, accessible play button, optional caption, strict iframe permissions.
- **CollapsibleList:** Progressive-enhancement accordion for prerequisites, FAQs, and step groups. Static `<details>` output should work without JavaScript.
- **InteractiveCards:** Selectable cards for comparing tools, roles, datasets, model templates, or workflow choices. The component must expose the selected item in an accessible details panel.
- **PipelineGraph:** Data-driven SVG workflow map for capture -> curate/label -> train -> package -> screens. Nodes should be selectable and deep-linkable when practical.
- **MetricGraph:** Lightweight SVG chart for training metrics, dataset balance, SNR examples, signal quality, and app status. Do not pull in Plotly for first-pass docs.
- **StatusLight and SignalMeter:** Small support components for health, runner state, confidence, and RF signal strength.
- **TerminalCard:** Styled command/result blocks for onboarding and getting started pages.
- **SectionCard and StatCard:** Static Astro cards for overview pages and reusable explanation blocks.

## Do's and Don'ts

- **Do** keep MDX authoring simple: import one Astro component and pass plain data.
- **Do** prefer Astro/static HTML unless user interaction materially improves comprehension.
- **Do** use RIA Hub product concepts as visual metaphors: recordings, datasets, slices, qualifiers, training runs, ONNX artifacts, app manifests, and screens.
- **Do** cite code-derived behavior in docs when explaining product workflows.
- **Don't** hydrate static cards, video thumbnails, or basic accordions unnecessarily.
- **Don't** introduce a component library before the first component set proves the design language.
- **Don't** copy RIA Hub Vue code directly into docs; extract behaviors, props, and visual patterns into small Astro/Svelte components.
- **Don't** make one-off MDX islands with inline scripts. Add reusable components instead.
