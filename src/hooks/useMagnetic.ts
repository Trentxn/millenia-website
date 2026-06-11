/*
  Magnetic pull for the one CTA that earns it. Pointer fine devices only;
  the element leans toward the cursor and snaps home on leave.
*/
import { useRef, type RefObject } from 'react'
import { gsap, useGSAP, SNAP } from '../lib/motion'

export function useMagnetic<T extends HTMLElement>(
  strength = 0.35,
): RefObject<T | null> {
  const ref = useRef<T>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      const mm = gsap.matchMedia()
      mm.add('(pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
        const xTo = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3.out' })
        const yTo = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3.out' })

        const onMove = (e: MouseEvent) => {
          const r = el.getBoundingClientRect()
          xTo((e.clientX - (r.left + r.width / 2)) * strength)
          yTo((e.clientY - (r.top + r.height / 2)) * strength)
        }
        const onLeave = () => {
          gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: SNAP })
        }

        el.addEventListener('mousemove', onMove)
        el.addEventListener('mouseleave', onLeave)
        return () => {
          el.removeEventListener('mousemove', onMove)
          el.removeEventListener('mouseleave', onLeave)
        }
      })
    },
    { scope: ref },
  )

  return ref
}
