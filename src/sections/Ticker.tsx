/*
  The energy strip as a courtside LED ribbon. The Gold Line's horizontal
  branch is the board's top rule; the words run beneath it like an arena
  scoreboard crawl at a steady, constant pace. Hover pauses it; it sleeps
  while offscreen; reduced motion gets a static board.
*/
import { useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from '../lib/motion'
import { BranchRule } from '../components/GoldLine/BranchRule'

const WORDS = [
  'BASKETBALL',
  'ENRICHMENT',
  'COMMUNITY',
  'DISCIPLINE',
  'BROTHERHOOD',
  'SISTERHOOD',
  'NASSAU',
]

const SPEED = 70 // px per second, leftward, always

function Row() {
  return (
    <span className="flex shrink-0 items-center">
      {WORDS.map((w) => (
        <span key={w} className="flex shrink-0 items-center">
          <span className="mono-label px-6 !text-sm text-gold/90 md:px-9">
            {w}
          </span>
          <span className="size-1.5 rotate-45 bg-gold-deep" />
        </span>
      ))}
    </span>
  )
}

export function Ticker() {
  const scope = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const track = scope.current?.querySelector('.js-track') as HTMLElement
      const copy = scope.current?.querySelector('.js-copy') as HTMLElement
      if (!track || !copy) return

      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        let x = 0
        let active = false
        let paused = false
        const setX = gsap.quickSetter(track, 'x', 'px')

        const tick = (_t: number, deltaMS: number) => {
          if (!active || paused) return
          const width = copy.offsetWidth
          if (!width) return
          x = gsap.utils.wrap(-width, 0, x - SPEED * (deltaMS / 1000))
          setX(x)
        }

        gsap.ticker.add(tick)
        const st = ScrollTrigger.create({
          trigger: scope.current,
          start: 'top bottom',
          end: 'bottom top',
          onToggle: (self) => {
            active = self.isActive
          },
        })

        /* moving content needs a way to stop: hovering the board pauses it */
        const band = scope.current as HTMLElement
        const pause = () => {
          paused = true
        }
        const resume = () => {
          paused = false
        }
        band.addEventListener('mouseenter', pause)
        band.addEventListener('mouseleave', resume)

        return () => {
          gsap.ticker.remove(tick)
          st.kill()
          band.removeEventListener('mouseenter', pause)
          band.removeEventListener('mouseleave', resume)
        }
      })
    },
    { scope },
  )

  return (
    <div ref={scope} className="relative bg-ink-2">
      <p className="sr-only">
        Basketball. Enrichment. Community. Discipline. Brotherhood. Sisterhood.
        Nassau.
      </p>
      <BranchRule className="absolute top-0 left-(--rail-x) w-[calc(100vw-var(--rail-x))] max-md:left-0 max-md:w-full" />
      {/* the trunk passes straight through the board */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-(--rail-x) w-0.5 bg-gold max-md:hidden"
      />
      <div aria-hidden="true" className="overflow-hidden py-4 md:py-5">
        <div className="js-track flex w-max">
          <span className="js-copy flex shrink-0">
            <Row />
          </span>
          <Row />
          <Row />
          <Row />
          <Row />
        </div>
      </div>
    </div>
  )
}
