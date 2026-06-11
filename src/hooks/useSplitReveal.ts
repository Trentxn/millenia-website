/*
  The page's one text reveal: lines rise through a baseline mask with a hard
  SNAP. No skew, no fades, no float. Reduced motion sees text in place.
*/
import { useRef, type RefObject } from 'react'
import {
  gsap,
  SplitText,
  useGSAP,
  SNAP,
  DUR,
  STAGGER,
  MOTION_OK,
} from '../lib/motion'

interface SplitRevealOptions {
  /** ScrollTrigger start, default 'top 82%' */
  start?: string
  delay?: number
  stagger?: number
  duration?: number
}

export function useSplitReveal<T extends HTMLElement>(
  options: SplitRevealOptions = {},
): RefObject<T | null> {
  const ref = useRef<T>(null)
  const {
    start = 'top 82%',
    delay = 0,
    stagger = STAGGER.line,
    duration = DUR.std,
  } = options

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const split = SplitText.create(el, {
          type: 'lines',
          mask: 'lines',
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 112,
              duration,
              ease: SNAP,
              stagger,
              delay,
              scrollTrigger: { trigger: el, start, once: true },
            }),
        })
        return () => split.revert()
      })
    },
    { scope: ref },
  )

  return ref
}
