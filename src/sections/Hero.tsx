/*
  Tip off. The brand ident and the hero are one continuous movement on one
  stage: a real shot clock (5.0 counting down in tenths, the way clocks tick
  under five seconds) inside the drawing center circle. The stroke completes
  exactly at 0.0 and the wordmark slam IS the buzzer. The circle then glides
  to rest as a cropped arc behind the type. Any scroll or key press skips
  straight to the finished frame. Revisits get a compressed entry; reduced
  motion gets the finished frame immediately.
*/
import { useEffect, useRef } from 'react'
import { useLenis } from 'lenis/react'
import {
  gsap,
  useGSAP,
  SNAP,
  GLIDE,
  DUR,
  MOTION_OK,
  REDUCED,
  prefersReducedMotion,
} from '../lib/motion'
import { SectionMarker } from '../components/SectionMarker'

const VISITED_KEY = 'millenia-ident'
const LETTERS = 'MILLENIA'.split('')

/* storage can throw under blocked cookies settings; never let it crash */
const safeGet = (key: string) => {
  try {
    return sessionStorage.getItem(key)
  } catch {
    return null
  }
}
const safeSet = (key: string, value: string) => {
  try {
    sessionStorage.setItem(key, value)
  } catch {
    /* ignore */
  }
}

/* where the circle lives once the ident ends */
const CIRCLE_REST = {
  x: '-31vw',
  y: '6vh',
  scale: 2.4,
  autoAlpha: 0.5,
}

export function Hero({ onReady }: { onReady: () => void }) {
  const scope = useRef<HTMLElement>(null)
  const onReadyRef = useRef(onReady)
  onReadyRef.current = onReady

  /* Lenis arrives in a later effect than ours; the lock ref lets us stop it
     the moment it exists if the ident is still holding the floor. */
  const lenis = useLenis()
  const lenisRef = useRef(lenis)
  lenisRef.current = lenis
  const identLockRef = useRef(false)

  useEffect(() => {
    if (lenis && identLockRef.current) lenis.stop()
  }, [lenis])

  /* Reduced motion: the finished frame, immediately interactive. */
  useEffect(() => {
    if (prefersReducedMotion()) onReadyRef.current()
  }, [])

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      /* reduced motion still gets the resting arc, not the centered ident */
      mm.add(REDUCED, () => {
        gsap.set('.js-circle', CIRCLE_REST)
      })

      mm.add(MOTION_OK, () => {
        const revisit = safeGet(VISITED_KEY) === '1'
        const root = document.documentElement
        const circlePath = scope.current?.querySelector(
          '.js-circle-path',
        ) as SVGCircleElement

        const finish = () => {
          identLockRef.current = false
          lenisRef.current?.start()
          root.style.overflow = ''
          /* drop the dash pattern so the resting circle survives resizes */
          gsap.set(circlePath, {
            attr: { 'stroke-dasharray': 'none', 'stroke-dashoffset': 0 },
          })
          onReadyRef.current()
          safeSet(VISITED_KEY, '1')
        }

        const tl = gsap.timeline({ paused: true, onComplete: finish })

        if (revisit) {
          /* Compressed entry: no clock, circle already at rest. */
          gsap.set('.js-circle', CIRCLE_REST)
          tl.from('.js-letter', {
            yPercent: 112,
            duration: 0.6,
            ease: SNAP,
            stagger: { each: 0.03, from: 'center' },
          })
            .from('.js-eyebrow-char', { autoAlpha: 0, duration: 0.01, stagger: 0.01 }, 0.1)
            .from('.js-mission', { y: 16, autoAlpha: 0, duration: 0.5, ease: GLIDE }, 0.2)
            .from('.js-dropline', { scaleY: 0, duration: 0.5, ease: GLIDE }, 0.25)
            .from('.js-cue', { autoAlpha: 0, duration: 0.4 }, 0.3)
        } else {
          /* Hold the floor: no scrolling while the clock runs. */
          identLockRef.current = true
          lenisRef.current?.stop()
          root.style.overflow = 'hidden'
          const clockProxy = { t: 5.0 }
          const clockEl = scope.current?.querySelector('.js-clock') as HTMLElement

          /* Dash lengths must be measured in screen pixels: with a non
             scaling stroke, Chromium consumes dash patterns in device space,
             so author-unit values (even pathLength normalized) misdraw. */
          const svgEl = scope.current?.querySelector('.js-circle') as SVGSVGElement
          const screenLen =
            2 * Math.PI * 48 * (svgEl.getBoundingClientRect().width / 100)
          gsap.set(circlePath, {
            attr: {
              'stroke-dasharray': screenLen,
              'stroke-dashoffset': screenLen,
            },
          })

          tl.set('.js-clock-wrap', { autoAlpha: 1 })
            /* the countdown and the circle draw end on the same beat */
            .to(clockProxy, {
              t: 0,
              duration: 1.35,
              ease: 'power1.out',
              onUpdate: () => {
                if (clockEl) clockEl.textContent = clockProxy.t.toFixed(1)
              },
            })
            .to(
              circlePath,
              { attr: { 'stroke-dashoffset': 0 }, duration: 1.35, ease: GLIDE },
              0,
            )
            /* buzzer: one hot flash on the stroke, numerals out through the mask */
            .to(circlePath, {
              stroke: 'var(--color-gold-bright)',
              duration: 0.08,
              yoyo: true,
              repeat: 1,
            })
            .to('.js-clock', { yPercent: -120, duration: 0.25, ease: 'power2.in' }, 1.38)
            /* the circle takes its seat behind the wordmark */
            .to('.js-circle', { ...CIRCLE_REST, duration: 1.0, ease: GLIDE }, 1.45)
            /* the slam is the buzzer's echo: from center out, like a tip win */
            .from(
              '.js-letter',
              {
                yPercent: 112,
                duration: DUR.std,
                ease: SNAP,
                stagger: { each: 0.045, from: 'center' },
              },
              1.5,
            )
            .from('.js-eyebrow-char', { autoAlpha: 0, duration: 0.01, stagger: 0.016 }, 1.78)
            .from('.js-mission', { y: 16, autoAlpha: 0, duration: DUR.std, ease: GLIDE }, 1.95)
            .from('.js-dropline', { scaleY: 0, duration: 0.7, ease: GLIDE }, 2.0)
            .from('.js-cue', { autoAlpha: 0, duration: 0.4 }, 2.2)
        }

        /* a scroll attempt or key press during the ident means "get on with
           it": jump to the finished frame (onComplete still runs) */
        const skip = () => {
          if (tl.progress() < 1) tl.progress(1)
        }
        window.addEventListener('wheel', skip, { passive: true, once: true })
        /* touchmove, not touchstart: a tap is not a scroll attempt */
        window.addEventListener('touchmove', skip, { passive: true, once: true })
        window.addEventListener('keydown', skip, { once: true })

        /* Hold the opening frame until the display face is ready so the slam
           never lands in a fallback font. */
        let cancelled = false
        Promise.race([
          document.fonts.ready,
          new Promise((r) => setTimeout(r, 1200)),
        ]).then(() => {
          if (!cancelled) tl.play()
        })

        return () => {
          cancelled = true
          window.removeEventListener('wheel', skip)
          window.removeEventListener('touchmove', skip)
          window.removeEventListener('keydown', skip)
          identLockRef.current = false
          lenisRef.current?.start()
          root.style.overflow = ''
        }
      })
    },
    { scope },
  )

  return (
    <section
      ref={scope}
      id="top"
      aria-label="Millenia"
      className="relative flex h-svh min-h-[600px] flex-col justify-end overflow-hidden pb-[9vh]"
    >
      <SectionMarker label="THE CIRCLE" className="top-[16%]" />

      {/* center circle: shot clock cage, then resting arc */}
      <div className="pointer-events-none absolute inset-0 grid place-items-center">
        <svg
          aria-hidden="true"
          className="js-circle size-[clamp(240px,34vw,460px)]"
          viewBox="0 0 100 100"
          fill="none"
        >
          <circle
            className="js-circle-path stroke-gold"
            cx="50"
            cy="50"
            r="48"
            strokeWidth="1.25"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>

      {/* shot clock */}
      <div className="js-clock-wrap pointer-events-none invisible absolute inset-0 grid place-items-center">
        <div className="overflow-hidden">
          <p
            aria-hidden="true"
            className="js-clock font-mono text-[clamp(2.5rem,7vw,4.5rem)] font-bold tabular-nums text-bone"
          >
            5.0
          </p>
        </div>
      </div>

      <div className="relative pl-[calc(var(--rail-x)+clamp(0.75rem,3vw,3.5rem))]">
        <p className="js-eyebrow mono-label mb-4 text-gold">
          <span className="sr-only">Nassau, The Bahamas</span>
          <span aria-hidden="true">
            {'NASSAU, THE BAHAMAS'.split('').map((c, i) => (
              <span key={i} className="js-eyebrow-char">
                {c}
              </span>
            ))}
          </span>
        </p>
        <h1
          aria-label="MILLENIA"
          className="display-tight text-hero font-extrabold whitespace-nowrap text-bone"
        >
          {LETTERS.map((c, i) => (
            <span
              key={i}
              aria-hidden="true"
              className="inline-block overflow-hidden py-[0.06em] [margin-block:-0.06em]"
            >
              <span className="js-letter inline-block">{c}</span>
            </span>
          ))}
        </h1>
        <p className="js-mission mt-[clamp(1.5rem,4vh,3rem)] ml-auto max-w-md pr-[clamp(1rem,6vw,6rem)] text-base text-pretty text-bone-dim md:text-lg">
          A home court for The Bahamas. Sport, study, and recovery under one
          roof, so young people in Nassau can find who they are. The healthy
          way.
        </p>
      </div>

      {/* the line tips off: drops from the hero toward the run of play */}
      <div
        aria-hidden="true"
        className="js-dropline absolute bottom-0 left-(--rail-x) h-[14vh] w-0.5 origin-top bg-gold"
      />
      <p className="js-cue mono-label absolute right-[clamp(1rem,4vw,4rem)] bottom-6 text-bone-dim">
        SCROLL FOR THE FULL COURT
      </p>
    </section>
  )
}
