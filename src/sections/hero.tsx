import { useRef } from 'react'
import { Collage } from '@/components/site/collage'
import { buildCollage } from '@/lib/collage'
import { COLLAGE_PHOTOS } from '@/lib/photos'
import { useScrollScrub } from '@/hooks/use-scroll-scrub'

const PIECES = buildCollage(9, 'right')

/**
 * The headline fills the screen: three lines of uppercase display serif with
 * the middle word in italic. It fades and drifts as it scrolls away, so the
 * next section arrives like a turned page.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)

  useScrollScrub(
    ref,
    (p) => {
      const el = titleRef.current
      if (!el) return
      el.style.opacity = String(1 - Math.min(p / 0.75, 1) * 0.75)
      el.style.transform = `translateY(${-p * 12}%)`
    },
    { start: 'top top', end: 'bottom top', scrub: 0.6 },
  )

  return (
    <section ref={ref} id="hero" className="relative isolate min-h-[92vh] overflow-hidden">
      <Collage pieces={PIECES} photos={COLLAGE_PHOTOS} />

      <div className="relative mx-auto flex min-h-[92vh] w-full max-w-[1400px] flex-col justify-center px-6 py-32 md:px-10">
        <div ref={titleRef}>
          <h1 className="text-center font-display uppercase leading-[0.84] tracking-[-0.02em] text-navy">
            <span className="block text-[clamp(3.5rem,13vw,12rem)]">The</span>
            <span className="block text-[clamp(3.5rem,13vw,12rem)] italic">Connected</span>
            <span className="block text-[clamp(3.5rem,13vw,12rem)]">Firm</span>
          </h1>
        </div>

        <div className="mt-14 flex flex-col items-center gap-3 text-center">
          <p className="max-w-xl text-lg text-slate md:text-xl">
            An events strategy for White &amp; Case&apos;s New York office
          </p>
          <p className="text-caption text-muted-ink">
            Not affiliated with or endorsed by White &amp; Case LLP
          </p>
        </div>
      </div>
    </section>
  )
}
