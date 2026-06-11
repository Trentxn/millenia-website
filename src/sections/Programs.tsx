/*
  The roster, seated inside the third court quote: the key. The lane
  rectangle snap draws like court tape, then the rows rise through baseline
  masks. Every row carries its box score stat line at rest (nothing hover
  gated); hover is one move only: the rule heats up and the stat line ticks
  through scoreboard digits before settling.
*/
import { useRef } from 'react'
import { gsap, useGSAP, SNAP, GLIDE, DUR, MOTION_OK } from '../lib/motion'
import { SectionMarker } from '../components/SectionMarker'
import { useSplitReveal } from '../hooks/useSplitReveal'

interface Program {
  name: string
  pitch: string
  stat: string
}

const PROGRAMS: Program[] = [
  {
    name: 'Youth Basketball Development',
    pitch: 'Fundamentals, footwork, and film with coaches who hold a standard.',
    stat: 'AGES 8 TO 18 · COURT 1',
  },
  {
    name: 'Mentorship and Life Skills',
    pitch: 'Real talk with Bahamians who walked the road first.',
    stat: 'AGES 12 TO 21 · THE COMMONS',
  },
  {
    name: 'Strength and Conditioning',
    pitch: 'Speed, power, and bodies built to last whole seasons.',
    stat: 'AGES 14 AND UP · PERFORMANCE GYM',
  },
  {
    name: 'Community Leagues',
    pitch: 'Open runs and organized seasons for every age and every level.',
    stat: 'ALL AGES · NIGHTS AND WEEKENDS',
  },
  {
    name: 'Wellness and Recovery',
    pitch: 'Cold water, warm hands, and rest taken as seriously as work.',
    stat: 'ATHLETES AND FAMILIES · RECOVERY SUITE',
  },
  {
    name: 'Academic Support',
    pitch: 'Tutors and quiet rooms, because the grade comes before the game.',
    stat: 'AGES 8 TO 18 · STUDY HALL',
  },
]

export function Programs() {
  const scope = useRef<HTMLElement>(null)
  const headlineRef = useSplitReveal<HTMLHeadingElement>()

  useGSAP(
    () => {
      const root = scope.current
      if (!root) return
      const mm = gsap.matchMedia()

      mm.add(MOTION_OK, () => {
        /* the key snap draws like tape being laid: top, sides, bottom */
        const edges = gsap.utils.toArray<HTMLElement>('.js-key-edge', root)
        gsap.from(edges, {
          scaleX: (_i, el) => ((el as HTMLElement).dataset.axis === 'x' ? 0 : 1),
          scaleY: (_i, el) => ((el as HTMLElement).dataset.axis === 'y' ? 0 : 1),
          duration: DUR.std,
          ease: GLIDE,
          stagger: 0.09,
          scrollTrigger: { trigger: '.js-key', start: 'top 78%', once: true },
        })

        /* rows rise through their masks, rules draw with them */
        const rows = gsap.utils.toArray<HTMLElement>('.js-row', root)
        rows.forEach((row) => {
          const tl = gsap.timeline({
            scrollTrigger: { trigger: row, start: 'top 86%', once: true },
          })
          tl.from(row.querySelector('.js-row-inner'), {
            yPercent: 105,
            duration: DUR.std,
            ease: SNAP,
          }).from(
            row.querySelector('.js-row-rule'),
            { scaleX: 0, transformOrigin: 'left center', duration: DUR.std, ease: GLIDE },
            0.1,
          )
        })
      })

      /* hover: scoreboard tick on the stat line, pointer fine only */
      mm.add('(pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
        const cleanups: Array<() => void> = []
        gsap.utils.toArray<HTMLElement>('.js-row', root).forEach((row) => {
          const stat = row.querySelector('.js-row-stat') as HTMLElement
          const original = stat.textContent ?? ''
          const proxy = { p: 0 }

          const onEnter = () => {
            gsap.fromTo(
              proxy,
              { p: 0 },
              {
                p: 1,
                duration: 0.38,
                ease: 'none',
                overwrite: true,
                onUpdate: () => {
                  stat.textContent = original
                    .split('')
                    .map((ch, i) =>
                      /\d/.test(ch) && proxy.p < (i / original.length) * 0.6 + 0.4
                        ? String(gsap.utils.random(0, 9, 1))
                        : ch,
                    )
                    .join('')
                },
                onComplete: () => {
                  stat.textContent = original
                },
              },
            )
          }
          row.addEventListener('mouseenter', onEnter)
          cleanups.push(() => row.removeEventListener('mouseenter', onEnter))
        })
        return () => cleanups.forEach((fn) => fn())
      })
    },
    { scope },
  )

  return (
    <section
      ref={scope}
      id="programs"
      aria-labelledby="programs-heading"
      className="relative bg-ink-2 py-[clamp(5rem,12vh,9rem)]"
    >
      <SectionMarker label="THE PAINT" className="top-[12%]" />

      <div className="pr-[clamp(1.25rem,6vw,6rem)] pl-[calc(var(--rail-x)+clamp(1rem,4vw,4rem))]">
        <p className="mono-label mb-5 text-gold">PROGRAMS</p>
        <h2
          id="programs-heading"
          ref={headlineRef}
          className="display-tight text-slab font-extrabold text-bone"
        >
          PICK YOUR <span className="text-gold">LANE</span>
        </h2>
        <p className="mt-6 max-w-xl text-pretty text-bone-dim">
          Six ways in. Real work, real coaches, real standards. The lineup
          will sharpen as we build. The standard will not.
        </p>

        {/* the key: lane rectangle, drawn edge by edge */}
        <div className="js-key relative mt-16 max-w-5xl">
          <div
            aria-hidden="true"
            data-axis="x"
            className="js-key-edge absolute top-0 left-0 h-0.5 w-full origin-left bg-gold"
          />
          <div
            aria-hidden="true"
            data-axis="y"
            className="js-key-edge absolute top-0 left-0 h-full w-0.5 origin-top bg-gold"
          />
          <div
            aria-hidden="true"
            data-axis="y"
            className="js-key-edge absolute top-0 right-0 h-full w-0.5 origin-top bg-gold max-md:hidden"
          />
          <div
            aria-hidden="true"
            data-axis="x"
            className="js-key-edge absolute bottom-0 left-0 h-0.5 w-full origin-left bg-gold"
          />

          <ul className="px-[clamp(1.25rem,4vw,3.5rem)] py-[clamp(0.5rem,2vw,1.5rem)]">
            {PROGRAMS.map((program) => (
              <li key={program.name} className="js-row group">
                <div className="overflow-hidden">
                  <div className="js-row-inner flex flex-wrap items-baseline justify-between gap-x-10 gap-y-2 py-[clamp(1.1rem,2.6vw,2rem)]">
                    <div className="min-w-0 max-w-3xl">
                      <h3 className="display-tight text-roster font-bold text-bone">
                        {program.name}
                      </h3>
                      <p className="mt-2 max-w-xl text-sm text-bone-dim md:text-base">
                        {program.pitch}
                      </p>
                    </div>
                    <p className="js-row-stat mono-label text-bone-dim transition-colors duration-300 group-hover:text-gold max-md:basis-full md:shrink-0">
                      {program.stat}
                    </p>
                  </div>
                </div>
                <div
                  aria-hidden="true"
                  className="js-row-rule h-px w-full bg-bone-ghost transition-colors duration-300 group-hover:bg-gold"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
