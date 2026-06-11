/*
  The goals, kept honest. No rolling counters: the Gold Line's tally ticks
  ARE the count, scratched in groups of five like a scorebook, rising off
  the line itself. When a row completes, the figure sets instantly. Small
  numbers get their true tally; 500 gets the symbolic full row.
*/
import { useRef } from 'react'
import { gsap, useGSAP, SNAP, MOTION_OK } from '../lib/motion'
import { SectionMarker } from '../components/SectionMarker'
import { useSplitReveal } from '../hooks/useSplitReveal'
import { BranchRule } from '../components/GoldLine/BranchRule'

interface Stat {
  value: string
  label: string
}

const STATS: Stat[] = [
  { value: '500', label: 'YOUNG BAHAMIANS SERVED A YEAR' },
  { value: '6', label: 'PROGRAMS ON DAY ONE' },
  { value: '7', label: 'DAYS A WEEK WITH DOORS OPEN' },
  { value: '1', label: 'HOME COURT FOR THE WHOLE ISLAND' },
]

/* one scorebook group: up to four uprights, the fifth strikes through */
function TallyGroup({ count }: { count: number }) {
  const uprights = count === 5 ? 4 : count
  return (
    <span className="relative mr-3 inline-flex h-6 items-end gap-[5px]">
      {Array.from({ length: uprights }, (_, i) => (
        <span key={i} className="js-tick block h-6 w-px origin-bottom bg-gold/80" />
      ))}
      {count === 5 && (
        <span className="js-tick absolute top-1/2 left-1/2 block h-8 w-px origin-bottom -translate-x-1/2 -translate-y-1/2 rotate-[64deg] bg-gold" />
      )}
    </span>
  )
}

function tallyGroups(raw: string): number[] {
  const n = Number(raw.replace(/\D/g, ''))
  if (n > 20) return [5, 5, 5, 5]
  const groups = Array.from({ length: Math.floor(n / 5) }, () => 5)
  if (n % 5 > 0) groups.push(n % 5)
  return groups
}

export function Vision() {
  const scope = useRef<HTMLElement>(null)
  const headlineRef = useSplitReveal<HTMLHeadingElement>()

  useGSAP(
    () => {
      const root = scope.current
      if (!root) return
      const mm = gsap.matchMedia()

      mm.add(MOTION_OK, () => {
        /* figures hide only inside the motion context: the no motion default
           is the finished frame, numbers visible */
        gsap.set(gsap.utils.toArray('.js-figure', root), { autoAlpha: 0 })
        gsap.utils.toArray<HTMLElement>('.js-stat', root).forEach((block, i) => {
          const ticks = block.querySelectorAll('.js-tick')
          const figure = block.querySelector('.js-figure')
          const tl = gsap.timeline({
            scrollTrigger: { trigger: block, start: 'top 84%', once: true },
            delay: i * 0.12,
          })
          tl.from(ticks, {
            scaleY: 0,
            duration: 0.3,
            ease: SNAP,
            stagger: 0.045,
          })
            /* the figure sets while the last groups are still scratching in,
               so the headline number never trails the small ones by seconds */
            .set(figure, { autoAlpha: 1 }, 0.6)
        })
      })
    },
    { scope },
  )

  return (
    <section
      ref={scope}
      aria-labelledby="vision-heading"
      className="relative bg-ink-2 py-[clamp(5rem,12vh,9rem)]"
    >
      <SectionMarker label="THE SCORE" className="top-[18%]" />

      <div className="pr-[clamp(1.25rem,6vw,6rem)] pl-[calc(var(--rail-x)+clamp(1rem,4vw,4rem))]">
        <p className="mono-label mb-5 text-gold">THE VISION</p>
        <h2
          id="vision-heading"
          ref={headlineRef}
          className="display-tight text-slab font-extrabold text-bone"
        >
          WRITE THE <span className="text-gold">GOAL</span> DOWN
        </h2>
        <p className="mt-6 max-w-xl text-bone-dim">
          Millenia is a vision today. These are the numbers we intend to
          answer for, published so Nassau can hold us to them.
        </p>

        {/* the count lives on the line */}
        <div className="mt-20">
          <BranchRule scrub className="w-full !bg-gold-deep" />
          <dl className="flex flex-wrap gap-x-[clamp(2rem,6vw,6rem)] gap-y-12 pt-px">
            {STATS.map((stat) => (
              <div key={stat.label} className="js-stat -mt-6 flex min-w-[150px] flex-col">
                <dt className="mono-label order-2 mt-2 max-w-[24ch] text-bone-dim">
                  {stat.label}
                </dt>
                <dd className="order-1 m-0">
                  <div aria-hidden="true" className="flex h-8 items-end">
                    {tallyGroups(stat.value).map((count, i) => (
                      <TallyGroup key={i} count={count} />
                    ))}
                  </div>
                  <div className="js-figure mt-5 font-mono text-[clamp(2rem,4vw,3.25rem)] font-bold text-bone">
                    {stat.value}
                  </div>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
