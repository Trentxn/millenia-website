/*
  The motion vocabulary for the entire page. Three eases, three durations,
  two staggers. Every animation on the site draws from this file so the page
  reads as one directed sequence, not a collection of effects.

  Narrative: "Four Quarters".
  Tip off (ident + hero slam), run of play (ticker, manifesto, roster),
  the build (facility wipes, tally ticks), buzzer (one slam, then stillness).
*/
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { CustomEase } from 'gsap/CustomEase'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase, useGSAP)

/* Fast attack, ~6% overshoot, controlled settle. Type and UI entrances. */
export const SNAP = CustomEase.create('snap', '0.16, 1.06, 0.26, 1')

/* Long exponential settle. Masks, parallax catch up, line draws. */
export const GLIDE = CustomEase.create('glide', '0.19, 1, 0.22, 1')

/* Weighty settle for image scale. */
export const SETTLE = CustomEase.create('settle', '0.22, 1, 0.36, 1')

export const DUR = {
  micro: 0.5,
  std: 0.85,
  hero: 1.3,
} as const

export const STAGGER = {
  word: 0.06,
  line: 0.09,
} as const

/* Shared gold stroke width for every Gold Line segment. */
export const LINE_W = 2

export const REDUCED = '(prefers-reduced-motion: reduce)'
export const MOTION_OK = '(prefers-reduced-motion: no-preference)'

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia(REDUCED).matches
}

export { gsap, ScrollTrigger, SplitText, useGSAP }
