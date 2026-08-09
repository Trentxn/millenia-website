/*
  The disclosure device for the Gold Line: a small fixed full court diagram in
  the rail. One gold dot travels baseline to baseline with scroll, teaching
  the conceit (the page is a court) while doubling as scroll progress.
  Decorative; hidden from assistive tech.
*/
import { useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from '../../lib/motion'

const TOP = 7
const BOTTOM = 87

export function CourtMinimap({ visible }: { visible: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const dotRef = useRef<SVGCircleElement>(null)

  useGSAP(
    () => {
      const dot = dotRef.current
      if (!dot) return
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const setY = gsap.quickSetter(dot, 'y', 'px')
        const st = ScrollTrigger.create({
          start: 0,
          end: 'max',
          onUpdate: (self) => setY(self.progress * (BOTTOM - TOP)),
        })
        return () => st.kill()
      })
    },
    { scope: ref },
  )

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none fixed bottom-5 left-(--rail-x) z-40 -translate-x-1/2 bg-ink p-1.5 transition-opacity duration-700 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <svg
        width="26"
        height="49"
        viewBox="0 0 50 94"
        fill="none"
        className="text-bone-ghost"
      >
        {/* full court, baseline to baseline */}
        <rect x="2" y="2" width="46" height="90" stroke="currentColor" />
        <line x1="2" y1="47" x2="48" y2="47" stroke="currentColor" />
        <circle cx="25" cy="47" r="7" stroke="currentColor" />
        {/* keys */}
        <rect x="16" y="2" width="18" height="14" stroke="currentColor" />
        <rect x="16" y="78" width="18" height="14" stroke="currentColor" />
        {/* the dot: where on the court you are */}
        <circle
          ref={dotRef}
          cx="25"
          cy={TOP}
          r="3.5"
          className="fill-gold"
        />
      </svg>
    </div>
  )
}
