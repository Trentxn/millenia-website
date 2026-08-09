import { useState } from 'react'
import { MotionConfig } from 'motion/react'
import { SmoothScroll } from './lib/SmoothScroll'
import { Nav } from './components/Nav'
import { Footer } from './components/Footer'
import { CourtMinimap } from './components/GoldLine/CourtMinimap'
import { RailRun } from './components/GoldLine/RailRun'
import { Hero } from './sections/Hero'
import { Ticker } from './sections/Ticker'
import { Movement } from './sections/Movement'
import { Programs } from './sections/Programs'
import { Facility } from './sections/Facility'
import { Vision } from './sections/Vision'
import { Join } from './sections/Join'

export default function App() {
  const [ready, setReady] = useState(false)

  return (
    <SmoothScroll>
      <MotionConfig reducedMotion="user">
        <a
          href="#movement"
          className="mono-label sr-only z-[60] bg-gold !text-ink focus-visible:not-sr-only focus-visible:fixed focus-visible:top-3 focus-visible:left-3 focus-visible:px-4 focus-visible:py-2"
        >
          SKIP TO CONTENT
        </a>
        <Nav ready={ready} />
        <CourtMinimap visible={ready} />
        <main>
          <Hero onReady={() => setReady(true)} />
          <Ticker />
          <Movement />
          <div className="relative">
            {/* trunk run: the line's straight connector through the lower half */}
            <RailRun className="top-0 left-(--rail-x) z-[5] h-full" />
            <Programs />
            <Facility />
            <Vision />
          </div>
          <Join />
        </main>
        <Footer />
      </MotionConfig>
    </SmoothScroll>
  )
}
