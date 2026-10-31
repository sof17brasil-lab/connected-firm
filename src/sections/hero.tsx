import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Collage } from '@/components/site/collage'
import { buildCollage } from '@/lib/collage'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

const PIECES = buildCollage(9, 'right')

/**
 * The headline fills the screen: three lines of uppercase display serif with
 * the middle word in italic. It fades and drifts as it scrolls away, so the
 * next section arrives like a turned page.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0.25])
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '-12%'])

  return (
    <section ref={ref} id="hero" className="relative isolate min-h-[92vh] overflow-hidden">
      <Collage pieces={PIECES} />

      <div className="relative mx-auto flex min-h-[92vh] w-full max-w-[1400px] flex-col justify-center px-6 py-32 md:px-10">
        <motion.div style={reducedMotion ? undefined : { opacity, y }}>
          <h1 className="text-center font-display uppercase leading-[0.84] tracking-[-0.02em] text-navy">
            <span className="block text-[clamp(3.5rem,13vw,12rem)]">The</span>
            <span className="block text-[clamp(3.5rem,13vw,12rem)] italic">Connected</span>
            <span className="block text-[clamp(3.5rem,13vw,12rem)]">Firm</span>
          </h1>
        </motion.div>

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
