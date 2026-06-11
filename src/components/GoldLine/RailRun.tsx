/*
  A straight vertical run of the Gold Line, drawn by scroll. Straight runs are
  plain divs animated with scaleY so the whole signature stays on the
  compositor. Lives in the rail lane (--rail-x) unless positioned by a parent.
*/
import { useRef } from 'react'
import { gsap, useGSAP, MOTION_OK } from '../../lib/motion'

interface RailRunProps {
  className?: string
}

export function RailRun({ className = '' }: RailRunProps) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          el,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top 78%',
              end: 'bottom 55%',
              scrub: 0.4,
            },
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
      className={`pointer-events-none absolute w-0.5 origin-top bg-gold ${className}`}
    />
  )
}
