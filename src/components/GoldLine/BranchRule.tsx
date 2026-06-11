/*
  A horizontal branch off the Gold Line trunk: hairline gold rule that draws
  left to right when it enters. Used as the ticker's top rule and the
  facility panels' drag edges.
*/
import { useRef } from 'react'
import { gsap, useGSAP, GLIDE, DUR, MOTION_OK } from '../../lib/motion'

interface BranchRuleProps {
  className?: string
  /** scrub with scroll instead of snap drawing on entry */
  scrub?: boolean
}

export function BranchRule({ className = '', scrub = false }: BranchRuleProps) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          el,
          { scaleX: 0 },
          scrub
            ? {
                scaleX: 1,
                ease: 'none',
                scrollTrigger: {
                  trigger: el,
                  start: 'top 85%',
                  end: 'top 45%',
                  scrub: 0.4,
                },
              }
            : {
                scaleX: 1,
                duration: DUR.std,
                ease: GLIDE,
                scrollTrigger: { trigger: el, start: 'top 85%', once: true },
              },
        )
      })
    },
    { scope: ref },
  )

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none h-0.5 origin-left bg-gold ${className}`}
    />
  )
}
