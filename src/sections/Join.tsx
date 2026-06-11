/*
  The buzzer. The trunk line descends one last time and resolves into the
  final court quote: the rim. One slam reveal, one magnetic CTA, then
  stillness. No backend exists yet, so the CTA is an honest mail link, not
  a form that pretends to save anything.
*/
import { useRef } from 'react'
import { motion } from 'motion/react'
import { gsap, ScrollTrigger, useGSAP, GLIDE, MOTION_OK } from '../lib/motion'
import { SectionMarker } from '../components/SectionMarker'
import { useSplitReveal } from '../hooks/useSplitReveal'
import { useMagnetic } from '../hooks/useMagnetic'
import { RailRun } from '../components/GoldLine/RailRun'

export function Join() {
  const scope = useRef<HTMLElement>(null)
  const headlineRef = useSplitReveal<HTMLHeadingElement>()
  const magneticRef = useMagnetic<HTMLSpanElement>()

  useGSAP(
    () => {
      const root = scope.current
      if (!root) return
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const svg = root.querySelector('.js-rim') as SVGSVGElement
        const path = root.querySelector('.js-rim-path') as SVGCircleElement

        /* measure the dash length in screen pixels when the draw actually
           starts (not at mount, where the svg can be hidden or another
           size), and drop the pattern afterward so resizes can't tear it */
        ScrollTrigger.create({
          trigger: svg,
          start: 'top 80%',
          once: true,
          onEnter: () => {
            const screenLen =
              2 * Math.PI * 46 * (svg.getBoundingClientRect().width / 100)
            if (screenLen === 0) return
            gsap.fromTo(
              path,
              {
                attr: {
                  'stroke-dasharray': screenLen,
                  'stroke-dashoffset': screenLen,
                },
              },
              {
                attr: { 'stroke-dashoffset': 0 },
                duration: 0.9,
                ease: GLIDE,
                onComplete: () =>
                  gsap.set(path, {
                    attr: { 'stroke-dasharray': 'none', 'stroke-dashoffset': 0 },
                  }),
              },
            )
          },
        })
      })
    },
    { scope },
  )

  return (
    <section
      ref={scope}
      id="join"
      aria-labelledby="join-heading"
      className="relative pt-[clamp(6rem,18vh,12rem)] pb-[clamp(5rem,14vh,9rem)]"
    >
      <SectionMarker label="THE RIM" className="top-[34%]" />
      <RailRun className="top-0 left-(--rail-x) h-[clamp(4rem,12vh,8rem)] max-md:hidden" />

      {/* the line becomes the rim */}
      <svg
        aria-hidden="true"
        className="js-rim absolute top-[clamp(4rem,12vh,8rem)] left-(--rail-x) size-[clamp(56px,6vw,84px)] -translate-x-1/2 max-md:hidden"
        viewBox="0 0 100 100"
        fill="none"
      >
        <circle
          className="js-rim-path stroke-gold"
          cx="50"
          cy="50"
          r="46"
          strokeWidth="2.5"
          vectorEffect="non-scaling-stroke"
          transform="rotate(-90 50 50)"
        />
      </svg>

      <div className="pr-[clamp(1.25rem,6vw,6rem)] pl-[calc(var(--rail-x)+clamp(2.5rem,6vw,6rem))] max-md:pl-[calc(var(--rail-x)+1rem)]">
        <p className="mono-label mb-5 text-gold">JOIN THE MOVEMENT</p>
        <h2
          id="join-heading"
          ref={headlineRef}
          className="display-tight text-slab font-extrabold text-bone"
        >
          TAKE YOUR <span className="text-gold">SHOT</span>
        </h2>
        <p className="mt-6 max-w-xl text-pretty text-bone-dim">
          Youth, families, partners: the doors open soon. Tell us you want in
          and we will hold you a place on the floor.
        </p>

        <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-6">
          <span ref={magneticRef} className="inline-block">
            <motion.a
              href="mailto:hello@themilleniamovement.com?subject=Put me on the roster"
              whileTap={{ scale: 0.96 }}
              className="display-tight inline-block bg-gold px-9 py-4 text-xl font-extrabold text-ink transition-colors duration-300 hover:bg-gold-bright"
            >
              GET ON THE ROSTER
            </motion.a>
          </span>
          <p className="mono-label max-w-[26ch] text-bone-dim">
            ONE EMAIL. FIRST WORD WHEN THE DOORS OPEN.
          </p>
        </div>
      </div>
    </section>
  )
}
