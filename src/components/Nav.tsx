/*
  Anchored nav: drops in after the ident, hides on scroll down, returns on
  scroll up. Motion (the library) owns this presence behavior; GSAP owns
  everything scroll choreographed. One runtime per job.
*/
import { useEffect, useState } from 'react'
import { motion } from 'motion/react'

const EASE_GLIDE = [0.19, 1, 0.22, 1] as const

const LINKS = [
  { href: '#movement', label: 'THE MOVEMENT' },
  { href: '#programs', label: 'PROGRAMS' },
  { href: '#facility', label: 'FACILITY' },
]

export function Nav({ ready }: { ready: boolean }) {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    let lastY = window.scrollY
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const y = window.scrollY
        setHidden(y > lastY + 2 && y > 140)
        if (Math.abs(y - lastY) > 2) lastY = y
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <motion.header
      initial={{ y: '-110%' }}
      animate={{ y: ready && !hidden ? 0 : '-110%' }}
      transition={{ duration: 0.55, ease: EASE_GLIDE }}
      inert={!ready || hidden}
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
        </div>
      </nav>
    </motion.header>
  )
}
