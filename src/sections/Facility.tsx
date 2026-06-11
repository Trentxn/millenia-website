/*
  The physical vision. One image entrance on the whole page: a straight edge
  wipe traveling the same direction as the sideline run, so the Gold Line
  reads as dragging each panel open, with a weighty scale settle inside.
  Every panel is graded ink/bone except one: the outdoor courts in true
  Bahamian color, the page's single image surprise.
*/
import { useRef } from 'react'
import { gsap, useGSAP, GLIDE, SETTLE, MOTION_OK } from '../lib/motion'
import { SectionMarker } from '../components/SectionMarker'
import { useSplitReveal } from '../hooks/useSplitReveal'
import { GradedImage } from '../components/GradedImage'
import { BranchRule } from '../components/GoldLine/BranchRule'
import { FACILITY_IMAGES } from '../lib/images'

const [courts, gym, spa, gathering, outdoor] = FACILITY_IMAGES

function Panel({
  image,
  ratio,
  className = '',
}: {
  image: (typeof FACILITY_IMAGES)[number]
  ratio: string
  className?: string
}) {
  return (
    <figure className={className}>
      <BranchRule className="mb-3 w-full" />
      <div className={`js-panel relative overflow-hidden ${ratio}`}>
        <div className="js-parallax absolute -inset-y-[6%] inset-x-0">
          <GradedImage
            src={image.src}
            srcSet={image.srcSet}
            sizes={image.sizes}
            alt={image.alt}
            graded={image.graded}
            className="h-full"
            imgClassName="js-panel-img"
          />
        </div>
      </div>
      <figcaption className="mt-3 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <span className="mono-label text-bone">{image.caption}</span>
        <span
          className={`mono-label !text-[0.6rem] ${
            image.graded ? 'text-bone-dim' : 'text-gold'
          }`}
        >
          {image.detail}
        </span>
      </figcaption>
    </figure>
  )
}

export function Facility() {
  const scope = useRef<HTMLElement>(null)
  const headlineRef = useSplitReveal<HTMLHeadingElement>()

  useGSAP(
    () => {
      const root = scope.current
      if (!root) return
      const mm = gsap.matchMedia()

      mm.add(MOTION_OK, () => {
        gsap.utils.toArray<HTMLElement>('.js-panel', root).forEach((panel) => {
          const img = panel.querySelector('.js-panel-img')
          gsap.fromTo(
            panel,
            { clipPath: 'inset(0 100% 0 0)' },
            {
              clipPath: 'inset(0 0% 0 0)',
              duration: 1.1,
              ease: GLIDE,
              scrollTrigger: { trigger: panel, start: 'top 83%', once: true },
            },
          )
          gsap.from(img, {
            scale: 1.12,
            duration: 1.4,
            ease: SETTLE,
            scrollTrigger: { trigger: panel, start: 'top 83%', once: true },
          })
          /* restrained parallax on the inner sleeve, never the clip frame */
          gsap.fromTo(
            panel.querySelector('.js-parallax'),
            { yPercent: -4 },
            {
              yPercent: 4,
              ease: 'none',
              scrollTrigger: {
                trigger: panel,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.5,
              },
            },
          )
        })
      })
    },
    { scope },
  )

  return (
    <section
      ref={scope}
      id="facility"
      aria-labelledby="facility-heading"
      className="relative py-[clamp(5rem,12vh,9rem)]"
    >
      <SectionMarker label="THE FLOOR" className="top-[6%]" />

      <div className="pr-[clamp(1.25rem,6vw,6rem)] pl-[calc(var(--rail-x)+clamp(1rem,4vw,4rem))]">
        <p className="mono-label mb-5 text-gold">THE FACILITY</p>
        <h2
          id="facility-heading"
          ref={headlineRef}
          className="display-tight text-slab font-extrabold text-bone"
        >
          THE HOUSE NASSAU <span className="text-gold">BUILDS</span>
        </h2>
        <p className="mt-6 max-w-xl text-bone-dim">
          Competition courts, a performance gym, a spa and recovery suite, and
          room for the whole family to gather. Planned for New Providence,
          open to the whole island.
        </p>

        <div className="mt-16 grid grid-cols-12 gap-x-[clamp(1rem,3vw,2.5rem)] gap-y-[clamp(3rem,7vh,5rem)]">
          <Panel
            image={courts}
            ratio="aspect-[16/9]"
            className="col-span-12 md:col-span-9 md:col-start-4"
          />
          <Panel
            image={gym}
            ratio="aspect-[4/5]"
            className="col-span-12 md:col-span-5"
          />
          <Panel
            image={spa}
            ratio="aspect-[3/4]"
            className="col-span-12 md:col-span-6 md:col-start-7 md:mt-[14vh]"
          />
          <Panel
            image={gathering}
            ratio="aspect-[16/10]"
            className="col-span-12 md:col-span-7 md:mt-[10vh]"
          />
          <Panel
            image={outdoor}
            ratio="aspect-[4/5]"
            className="col-span-12 md:col-span-5"
          />
        </div>
      </div>
    </section>
  )
}
