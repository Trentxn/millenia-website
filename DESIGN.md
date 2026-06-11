# DESIGN.md

## Color (OKLCH, warm hue family ~80 to 95)

Strategy: drenched warm near black surface, gold as scarce kinetic accent (Committed dark, Restrained gold). Named reference: an NBA arena court at night under one bank of lights, gold court tape on black hardwood.

- `ink` oklch(0.145 0.006 80) base near black, warm
- `ink-2` oklch(0.175 0.007 80) raised section tone
- `ink-3` oklch(0.21 0.009 80) highest surface
- `bone` oklch(0.92 0.015 85) body text, headlines
- `bone-dim` bone at 62% secondary text
- `gold` oklch(0.72 0.13 92) keywords, the Gold Line, live rules
- `gold-bright` oklch(0.82 0.135 92) hover and active only
- `gold-deep` oklch(0.50 0.10 90) low emphasis rules

Gold budget under 10% per viewport including the Gold Line stroke area. Imagery graded ink/bone monochrome; exactly one true color break (Bahamian court light).

## Typography

- Display: Big Shoulders Variable (wght 100 to 900 + opsz). Uppercase, leading ~0.85, tracking tight. Viewport scaled via clamp().
- Body: Schibsted Grotesk Variable. Sentence case, leading 1.6, measure 65ch max.
- Utility: Martian Mono Variable (wght + wdth). Scoreboard voice: eyebrows, stats, wayfinding markers, LED ticker. Uppercase, wide tracking, small.
- Headline device law: exactly one gold word per display headline; the word a coach would shout (verb or court noun), never the brand name, never the first word. One exception: at the manifesto close the Gold Line underlines the keyword instead.

## Layout

"Court Editorial". 12 column grid, persistent left rail (~8vw desktop) hosting the Gold Line lane and rotated mono wayfinding markers naming court geometry per section: THE CIRCLE, THE ARC, THE PAINT, THE FLOOR, THE RIM. Asymmetric: hero bleeds off right edge, manifesto narrow measure right of center, programs as roster rows inside the drawn key, facility offset stagger, join full viewport. Fluid spacing via clamp(), varied rhythm.

## Motion

Owned by the motion director (not this file). Eases: SNAP (fast attack slight overshoot), GLIDE (long expo settle), SETTLE (image scale settle). Durations 0.5 / 0.85 / 1.3. Text reveal: pure baseline mask rise, hard SNAP. Transforms and opacity only. Full reduced motion experience.

## Components

- GradedImage: ink/bone monochrome grade wrapper, lazy below fold
- Roster rows (Programs): no cards, stat line visible at rest, one hover move
- Courtside LED ticker: mono, beneath the Gold Line baseline rule, velocity coupled
- Court minimap: small fixed full court diagram in left rail, gold position dot, doubles as scroll progress
