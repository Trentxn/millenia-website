/*
  Lenis drives the page scroll; GSAP's ticker drives Lenis so ScrollTrigger
  and the smooth scroller share one clock (the official sync pattern).
  syncTouch puts touch gestures through the same smoothing, so the scroll
  choreography reads identically on phones and desktops.
  Reduced motion gets native scrolling: no Lenis, no smoothing, no surprises.
*/
import { useEffect, type ReactNode } from 'react'
import { ReactLenis, useLenis } from 'lenis/react'
import { gsap, ScrollTrigger, prefersReducedMotion } from './motion'

function RafDriver() {
  const lenis = useLenis()

  useEffect(() => {
    if (!lenis) return
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(tick)
      lenis.off('scroll', ScrollTrigger.update)
    }
  }, [lenis])

  return null
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  if (prefersReducedMotion()) {
    return <>{children}</>
  }

  return (
    <ReactLenis
      root
      options={{ autoRaf: false, lerp: 0.095, anchors: true, syncTouch: true }}
    >
      <RafDriver />
      {children}
    </ReactLenis>
  )
}
