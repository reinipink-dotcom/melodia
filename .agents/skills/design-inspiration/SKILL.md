---
name: design-inspiration
description: |
  Loads visual design references before creating or modifying any UI.
  Reads all images in the references/ folder and uses them to guide
  design decisions — colors, layout, typography, spacing, component
  style, and overall feel. Triggered automatically whenever a screen,
  component, or stylesheet is being designed or modified.
  Use when someone says "design", "build a screen", "create a component",
  "style this", "make it look like", or when any .tsx/.jsx/.ts file
  containing UI code is being created or edited.
license: MIT
metadata:
  author: melodia
  version: "1.0"
---

# Design Inspiration

You are working on Melodia — a dark-mode music learning app. Before creating or modifying any UI, you MUST read and internalize the visual references in this skill.

## Step 1 — Load References

Read every file inside the `references/` directory of this skill:

```
.agents/skills/design-inspiration/references/
```

Use the Read tool on each image file found there. Study them carefully:
- Color palette and contrast ratios
- Layout structure and spacing rhythms
- Typography hierarchy and weight choices
- Component shapes (border radius, shadow, borders)
- How interactive elements (buttons, cards, inputs) are styled
- Overall mood and visual density

If no reference files exist yet, skip to Step 2 and rely solely on the Melodia design system in CLAUDE.md.

## Step 2 — Extract Style Principles

After reading the references, extract and hold in mind:

1. **Color usage** — Which colors dominate? How is accent color used? What's the background/surface/text contrast pattern?
2. **Spacing** — Is it dense or airy? Consistent padding units?
3. **Typography** — Font weights used, size relationships, letter spacing
4. **Components** — Card styles, button shapes, icon treatment, border styles
5. **Motion/feel** — Does it feel minimal and clean, or rich and layered?

## Step 3 — Apply to Design

When writing or editing UI code:

- Match the visual language extracted from the references, not just the Melodia design token values in CLAUDE.md
- If the references show a specific pattern (e.g. large pill buttons with subtle shadow, or full-bleed cards with no border), apply that pattern
- If there's a conflict between the references and CLAUDE.md tokens, prefer the references for feel/composition and CLAUDE.md for exact color hex values and font sizes
- Call out what you're borrowing from the references in a brief comment before your code, e.g.:
  ```
  // Design reference: dark card with coral left-border accent, 20px padding, no shadow
  ```

## Trigger Conditions

This skill should activate automatically when:
- Creating any new screen component (`.tsx` file in `/screens/`)
- Creating or editing any reusable component (`.tsx` file in `/components/`)
- Modifying `StyleSheet` blocks or inline styles
- Building anything the user describes with visual language ("make it look like", "style this", "design a...")

## Adding New References

To add a new design reference:
1. Drop any image file (PNG, JPG, WebP) into `.agents/skills/design-inspiration/references/`
2. Name it descriptively, e.g. `duolingo-home.png`, `spotify-card-style.jpg`, `paywall-inspo.png`
3. Claude will automatically read it the next time a design task runs

The more references you add, the more aligned the output will be.
