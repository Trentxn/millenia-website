/*
  The manifesto. The page's only pinned moment, and the Gold Line's second
  court quote: the three point arc. The arc IS the reveal mechanism: as its
  leading point sweeps past each line's position, that line inks from ghost
  to full bone. One mechanism, fully reversible with scroll. At the close,
  the line underlines the keyword instead of coloring it: the single
  exception to the gold keyword law, spent at the emotional peak.

  Mobile: no pin; lines ink as they enter. Reduced motion: the finished page.
*/
import { useRef } from 'react'
import {
  gsap,
  ScrollTrigger,
  useGSAP,
  SNAP,
  GLIDE,
  MOTION_OK,
} from '../lib/motion'
import { SectionMarker } from '../components/SectionMarker'

const LINES = [
  'We grew up on open courts and family yards.',
  'We know what one good run can save.',
  'Millenia is a home for the youth of Nassau.',
  'Room to sweat. Room to study. Room to belong.',
  'Healthy people build a healthy island.',
]
const CLOSER = ['So we move ', 'together.']

export function Movement() {
  const scope = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const root = scope.current
      if (!root) return
      const mm = gsap.matchMedia()

      const inkLine = (el: Element, on: boolean) =>
        gsap.to(el, {
          color: on ? 'var(--color-bone)' : 'var(--color-bone-ghost)',
          duration: 0.35,
          ease: SNAP,
          overwrite: 'auto',
        })

      /* Desktop: the pin. Arc draw and line inking share one progress.
         The arc's viewBox is stretched non uniformly and the stroke does not
         scale, so Chromium consumes dashes in screen pixels: the dash length
         is integrated in screen space and remeasured on refresh. */
      mm.add(`${MOTION_OK} and (min-width: 768px)`, () => {
        const svg = root.querySelector('.js-arc') as SVGSVGElement
        const path = root.querySelector('.js-arc-path') as SVGPathElement
        const lines = gsap.utils.toArray<HTMLElement>('.js-mline', root)
        const underline = root.querySelector('.js-underline') as HTMLElement

        const measure = () => {
          const r = svg.getBoundingClientRect()
          if (r.width === 0 || r.height === 0) return 0
          const sx = r.width / 100
          const sy = r.height / 300
          const userLen = path.getTotalLength()
          let len = 0
          let prevX = 0
          let prevY = 0
          for (let i = 0; i <= 48; i++) {
            const pt = path.getPointAtLength((i / 48) * userLen)
            const x = pt.x * sx
            const y = pt.y * sy
            if (i > 0) len += Math.hypot(x - prevX, y - prevY)
            prevX = x
            prevY = y
          }
          return len
        }

        let screenLen = measure()
        const drawTo = (p: number) =>
          gsap.set(path, {
            attr: {
              'stroke-dasharray': screenLen,
              'stroke-dashoffset': screenLen * (1 - Math.min(p / 0.88, 1)),
            },
          })

        drawTo(0)
        gsap.set(lines, { color: 'var(--color-bone-ghost)' })
        gsap.set(underline, { scaleX: 0, transformOrigin: 'left center' })

        const states = lines.map(() => false)
        const applyStates = (p: number) => {
          lines.forEach((el, i) => {
            const on = p >= 0.1 + i * 0.145
            if (on !== states[i]) {
              states[i] = on
              inkLine(el, on)
              if (i === lines.length - 1) {
                gsap.to(underline, {
                  scaleX: on ? 1 : 0,
                  duration: 0.5,
                  ease: GLIDE,
                  overwrite: 'auto',
                })
              }
            }
          })
        }

        ScrollTrigger.create({
          trigger: root,
          start: 'top top',
          end: '+=170%',
          pin: true,
          onUpdate: (self) => {
            drawTo(self.progress)
            applyStates(self.progress)
          },
          onRefresh: (self) => {
            screenLen = measure()
            drawTo(self.progress)
            applyStates(self.progress)
          },
        })

        /* ink tweens fire from trigger callbacks, outside this context's
           recording: clear their inline styles when the context flips */
        return () => {
          gsap.set(lines, { clearProps: 'color' })
          gsap.set(underline, { clearProps: 'transform' })
        }
      })

      /* Mobile: same ink language, triggered per line, no pin, no arc. */
      mm.add(`${MOTION_OK} and (max-width: 767px)`, () => {
        const lines = gsap.utils.toArray<HTMLElement>('.js-mline', root)
        const underline = root.querySelector('.js-underline') as HTMLElement
        gsap.set(lines, { color: 'var(--color-bone-ghost)' })
        gsap.set(underline, { scaleX: 0, transformOrigin: 'left center' })

        lines.forEach((el, i) => {
          ScrollTrigger.create({
            trigger: el,
            start: 'top 72%',
            once: true,
            onEnter: () => {
              inkLine(el, true)
              if (i === lines.length - 1) {
                gsap.to(underline, { scaleX: 1, duration: 0.5, ease: GLIDE, delay: 0.2 })
              }
            },
          })
        })

        return () => {
          gsap.set(lines, { clearProps: 'color' })
          gsap.set(underline, { clearProps: 'transform' })
        }
      })
    },
    { scope },
  )

  return (
    <section
      ref={scope}
      id="movement"
      aria-labelledby="movement-heading"
      className="relative flex h-svh min-h-[600px] items-center max-md:h-auto max-md:min-h-0 max-md:py-28"
    >
      <SectionMarker label="THE ARC" className="top-[14%]" />

      {/* the three point arc, bulging toward the words it reveals; capped so
          the stroke never crosses the text column it exists to reveal */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-(--rail-x) hidden h-full w-[min(34vw,480px)] lg:block"
      >
        <svg
          className="js-arc h-full w-full"
          viewBox="0 0 100 300"
          preserveAspectRatio="none"
          fill="none"
        >
          <path
            className="js-arc-path stroke-gold"
            d="M 1 0 C 92 64, 92 236, 1 300"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>

      <div className="relative ml-auto w-full max-w-[640px] pr-[clamp(1.25rem,6vw,6rem)] pl-[clamp(1.25rem,12vw,4rem)] max-md:pl-[calc(var(--rail-x)+1rem)]">
        <h2 id="movement-heading" className="mono-label mb-10 text-gold">
          THE MOVEMENT
        </h2>
        <div className="display-tight text-manifesto font-bold text-bone">
          {LINES.map((line) => (
            <p key={line} className="js-mline mt-[0.55em] first:mt-0">
              {line}
            </p>
          ))}
          <p className="js-mline mt-[0.55em]">
            {CLOSER[0]}
            <span className="relative inline-block">
              {CLOSER[1]}
              <span
                aria-hidden="true"
                className="js-underline absolute bottom-[-0.08em] left-0 h-[0.045em] w-full bg-gold"
              />
            </span>
          </p>
        </div>
      </div>
    </section>
  )
}
