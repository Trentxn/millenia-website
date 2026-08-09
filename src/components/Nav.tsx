/*
  Anchored nav: drops in after the ident, hides on scroll down, returns on
  scroll up. Motion (the library) owns this presence behavior; GSAP owns
  everything scroll choreographed. One runtime per job.

  Below md the links live behind a hamburger: a full screen ink overlay
  where the trunk line keeps running and the links rise through baseline
  masks, same vocabulary as the page. The menu locks the page scroll while
  it holds the floor.
*/
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useLenis } from 'lenis/react'

const EASE_GLIDE = [0.19, 1, 0.22, 1] as const

const LINKS = [
  { href: '#movement', label: 'THE MOVEMENT' },
  { href: '#programs', label: 'PROGRAMS' },
  { href: '#facility', label: 'FACILITY' },
]

const MENU_LINKS = [...LINKS, { href: '#join', label: 'JOIN' }]

export function Nav({ ready }: { ready: boolean }) {
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)
  const lenis = useLenis()

  /* Hide on scroll down, return on scroll up, with hysteresis: the state
     only flips after ~24px of travel in one direction. Lenis settles with a
     long tail of sub-pixel deltas; a per-event threshold reads that tail as
     direction changes and flutters the bar. */
  useEffect(() => {
    let lastY = window.scrollY
    let acc = 0
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const y = window.scrollY
        const delta = y - lastY
        lastY = y
        if (y <= 140) {
          acc = 0
          setHidden(false)
          return
        }
        acc = Math.sign(delta) === Math.sign(acc) ? acc + delta : delta
        if (acc > 24) setHidden(true)
        else if (acc < -24) setHidden(false)
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  /* open menu holds the floor: no page scroll, Escape lets go */
  useEffect(() => {
    if (!open) return
    lenis?.stop()
    document.documentElement.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.documentElement.style.overflow = ''
      lenis?.start()
    }
  }, [open, lenis])

  /* growing past md brings the inline links back; the overlay stands down */
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const onChange = () => {
      if (mq.matches) setOpen(false)
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  /* release the lock before navigating so the anchor scroll can run */
  const onMenuLink = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    setOpen(false)
    document.documentElement.style.overflow = ''
    lenis?.start()
    if (lenis) lenis.scrollTo(href)
    else document.querySelector(href)?.scrollIntoView()
  }

  return (
    <>
      <motion.header
        initial={{ y: '-110%' }}
        animate={{ y: ready && (!hidden || open) ? 0 : '-110%' }}
        transition={{ duration: 0.55, ease: EASE_GLIDE }}
        inert={!ready || (hidden && !open)}
        className="fixed inset-x-0 top-0 z-50"
      >
        <nav
          aria-label="Main"
          className="flex items-center justify-between bg-ink/95 py-4 pr-[clamp(1.25rem,4vw,4rem)] pl-(--rail-x)"
        >
          <a
            href="#top"
            className="display-tight flex items-center gap-3 text-xl font-extrabold text-bone"
          >
            {/* mini center court: the brand glyph */}
            <svg aria-hidden="true" width="22" height="22" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="9" className="stroke-gold" strokeWidth="2.5" />
              <line x1="0" y1="16" x2="7" y2="16" className="stroke-gold" strokeWidth="2.5" />
              <line x1="25" y1="16" x2="32" y2="16" className="stroke-gold" strokeWidth="2.5" />
            </svg>
            MILLENIA
          </a>
          <div className="flex items-center gap-[clamp(1.25rem,3vw,3rem)]">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="link-draw mono-label text-bone-dim transition-colors duration-300 hover:text-bone max-md:hidden"
              >
                {link.label}
              </a>
            ))}
            <a href="#join" className="link-draw mono-label text-gold">
              JOIN
            </a>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              className="relative -my-1 grid size-10 place-items-center md:hidden"
            >
              <span className="relative block h-3.5 w-6">
                <motion.span
                  animate={open ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.35, ease: EASE_GLIDE }}
                  className="absolute top-0 left-0 block h-0.5 w-full bg-gold"
                />
                <motion.span
                  animate={open ? { opacity: 0 } : { opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-1.5 left-0 block h-0.5 w-full bg-gold"
                />
                <motion.span
                  animate={open ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.35, ease: EASE_GLIDE }}
                  className="absolute top-3 left-0 block h-0.5 w-full bg-gold"
                />
              </span>
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE_GLIDE }}
            className="fixed inset-0 z-40 flex flex-col justify-center bg-ink/[0.98] md:hidden"
          >
            {/* the trunk keeps running through the menu */}
            <div
              aria-hidden="true"
              className="absolute inset-y-0 left-(--rail-x) w-0.5 bg-gold"
            />
            <nav
              aria-label="Menu"
              className="flex flex-col gap-3 pl-[calc(var(--rail-x)+1.25rem)]"
            >
              {MENU_LINKS.map((link, i) => (
                <div key={link.href} className="overflow-hidden py-[0.06em]">
                  <motion.a
                    href={link.href}
                    onClick={onMenuLink(link.href)}
                    initial={{ y: '112%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '112%', transition: { duration: 0.3, ease: EASE_GLIDE } }}
                    transition={{
                      duration: 0.55,
                      ease: EASE_GLIDE,
                      delay: 0.08 + i * 0.06,
                    }}
                    className={`display-tight block text-[clamp(2.75rem,11vw,4.5rem)] leading-[0.95] font-extrabold ${
                      link.href === '#join' ? 'text-gold' : 'text-bone'
                    }`}
                  >
                    {link.label}
                  </motion.a>
                </div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
