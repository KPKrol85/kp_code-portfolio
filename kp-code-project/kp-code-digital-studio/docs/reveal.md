# Reveal System

## Purpose

The project uses one reveal trigger system with a small set of visual motion profiles.
The goal is to keep scroll motion consistent, lightweight, and component-aware instead of applying one generic fade-up to every section.

This system is implemented in:

- `js/modules/reveal.js`
- `css/tokens.css`
- `css/utilities.css`

## Trigger Model

HTML hooks:

- `data-reveal="<type>"`
  - Reveal for a standalone perceptual unit.
- `data-reveal-group="<type>"`
  - Parent for staggered sibling items.
- `data-reveal-item="<type>"`
  - Individual item inside a reveal group.

JS behavior:

- `IntersectionObserver` reveals elements once.
- Elements already visible on load are shown immediately.
- `data-reveal-group` assigns `--reveal-index` to its `data-reveal-item` children for stagger timing.
- `prefers-reduced-motion: reduce` disables the motion effect and shows content immediately.

The JS stays generic on purpose. Triggering lives in JS; visual differences live in CSS.

## Reveal Types

### `soft`

Use for:

- hero sections
- section headers
- compact supporting content
- CTA shells

Intent:

- subtle entry
- short travel distance
- faster duration

### `standard`

Use for:

- large split-layout sections
- overview sections
- content-heavy sections that still benefit from entrance motion

Intent:

- restrained fade-up
- neutral default for larger content blocks

### `visual`

Use for:

- large visuals
- screenshot frames
- image-heavy portfolio cards

Intent:

- stronger presence than text sections
- slightly longer duration
- deeper travel and a small scale settle

## Group Types

### `cards`

Use for:

- small repeated cards
- process items
- highlight cards
- pricing cards
- factor cards

Behavior:

- staggered siblings
- moderate delay step
- meant for scan-friendly repeated UI

### `visual`

Use for:

- image-heavy archives
- visually dominant repeated portfolio cards

Behavior:

- slower stagger than `cards`
- suited to heavier visual blocks

## Current Assignment Strategy

### Home

- Hero: `soft`
- Section headers: `soft`
- Service cards and process items: `cards` + `soft`
- Work cards: `visual` group + `visual` items
- Larger narrative/about blocks: `standard`
- CTA: `soft`

### Services Overview

- Hero: `soft`
- Main overview header: `soft`
- Overview cards: `cards` + `soft`
- Service detail previews: `standard`

### Service Detail Pages

- Hero: `soft`
- Intro / benefits split sections: `standard`
- Section headers for included, audience, process, pricing, factors, FAQ: `soft`
- Repeated cards: `cards` + `soft`
- CTA: `soft`
- Forms, embeds, and utility-heavy surfaces should stay mostly static unless there is a clear reason to animate them

### Projects Archive

- Hero: `soft`
- Archive header: `soft`
- Portfolio grid: `visual` group + `visual` items

### Project Detail Pages

- Hero: `soft`
- Overview and stack sections: `standard`
- Highlights cards: `cards` + `soft`
- Main visual showcase: `visual`
- CTA: `soft`

### About / Ecosystem / Case Pages

- Hero: `soft`
- Large explanatory sections: `standard`
- Repeated info cards: `cards` + `soft`
- Large showcase visuals: `visual` when the block is primarily visual

### Legal Pages

- Hero: `soft`
- Intro panel and table of contents panel: `soft`
- Dense legal content: no reveal
- Legal notes / reading-heavy blocks: no reveal unless there is a specific UX case

### Contact

- Hero: `soft`
- Main contact info block: `standard`
- Secondary collaboration/info block: `soft`
- Form and map remain static

## What Not To Do

- Do not put `data-reveal` on every section by default.
- Do not animate dense legal text blocks.
- Do not animate forms, maps, or similar utility-heavy blocks unless motion adds real clarity.
- Do not use stagger for unrelated items.
- Do not mix bare `data-reveal` with typed profiles in new work.

## Authoring Rules

When adding a new section:

1. Identify the perceptual unit.
2. Decide whether it is standalone or a sibling collection.
3. Use one of the existing profiles instead of inventing a new one.

Practical guidance:

- Use `data-reveal="soft"` for headers and lightweight lead-ins.
- Use `data-reveal="standard"` for larger text/content sections.
- Use `data-reveal="visual"` for hero media and showcase imagery.
- Use `data-reveal-group="cards"` with `data-reveal-item="soft"` for repeated card grids.
- Use `data-reveal-group="visual"` with `data-reveal-item="visual"` for image-led archive grids.

## Tokens And Tuning

Global reveal tokens live in `css/tokens.css`.

Most important variables:

- `--reveal-distance`
- `--reveal-duration`
- `--reveal-delay-step`
- `--reveal-delay-max`
- `--reveal-distance-soft`
- `--reveal-duration-soft`
- `--reveal-distance-standard`
- `--reveal-duration-standard`
- `--reveal-distance-visual`
- `--reveal-duration-visual`
- `--reveal-scale-visual`
- `--reveal-delay-step-cards`
- `--reveal-delay-step-visual`

Guardrail:

- Prefer reducing travel distance before increasing duration.
- If a section feels theatrical, it is usually assigned too high in the DOM or using the wrong profile.

## Maintenance Notes

- Keep new reveal work in source files only.
- Do not update minified files directly.
- If a component category keeps needing exceptions, fix the assignment pattern first before adding more CSS complexity.
- If a new component does not clearly fit `soft`, `standard`, or `visual`, default to `standard` and review whether reveal is needed at all.
